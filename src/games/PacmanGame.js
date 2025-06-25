import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const WIDTH = 15;
const HEIGHT = 15;
const CELL_SIZE = 32;
const INIT_PACMAN = { x: 1, y: 1, dir: 'RIGHT' };
const INIT_GHOST = { x: 13, y: 13, dir: 'LEFT' };

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Board = styled.div`
  position: relative;
  width: ${WIDTH * CELL_SIZE}px;
  height: ${HEIGHT * CELL_SIZE}px;
  background: #111;
  border-radius: 10px;
  margin: 20px 0;
`;

const Cell = styled.div`
  position: absolute;
  left: ${props => props.x * CELL_SIZE}px;
  top: ${props => props.y * CELL_SIZE}px;
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wall = styled.div`
  width: 100%;
  height: 100%;
  background: #3498db;
  border-radius: 6px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: #ffe066;
  border-radius: 50%;
`;

const Pacman = styled.div`
  width: 28px;
  height: 28px;
  background: #ffe066;
  border-radius: 50%;
  position: absolute;
  left: 2px;
  top: 2px;
`;

const Ghost = styled.div`
  width: 28px;
  height: 28px;
  background: #e94560;
  border-radius: 50% 50% 40% 40% / 50% 50% 60% 60%;
  position: absolute;
  left: 2px;
  top: 2px;
`;

const Stats = styled.div`
  color: #111;
  font-size: 20px;
  margin: 10px;
`;

const GameOver = styled.div`
  background: rgba(0,0,0,0.9);
  color: #fff;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Button = styled.button`
  background: #e94560;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin: 10px;
  font-size: 16px;
  cursor: pointer;
  &:hover { background: #ff6b81; }
`;

// シンプルな迷路（1:壁, 0:道, 2:ドット）
const simpleMaze = () => {
  const maze = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(2));
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (x === 0 || y === 0 || x === WIDTH - 1 || y === HEIGHT - 1) maze[y][x] = 1;
      if ((x % 2 === 0 && y % 2 === 0) && (x !== 1 || y !== 1) && (x !== WIDTH-2 || y !== HEIGHT-2)) maze[y][x] = 1;
    }
  }
  maze[1][1] = 0;
  maze[HEIGHT-2][WIDTH-2] = 0;
  return maze;
};

const PacmanGame = ({ onGameOver }) => {
  const [maze, setMaze] = useState(simpleMaze());
  const [pacman, setPacman] = useState(INIT_PACMAN);
  const [ghost, setGhost] = useState(INIT_GHOST);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [clear, setClear] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const moveRef = useRef('RIGHT');

  // パックマンの移動
  useEffect(() => {
    if (!gameStarted || gameOver || clear) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') moveRef.current = 'UP';
      if (e.key === 'ArrowDown') moveRef.current = 'DOWN';
      if (e.key === 'ArrowLeft') moveRef.current = 'LEFT';
      if (e.key === 'ArrowRight') moveRef.current = 'RIGHT';
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, clear]);

  // ゲームループ
  useEffect(() => {
    if (!gameStarted || gameOver || clear) return;
    const interval = setInterval(() => {
      setPacman(prev => {
        let { x, y } = prev;
        let dir = moveRef.current;
        let nx = x, ny = y;
        if (dir === 'UP') ny--;
        if (dir === 'DOWN') ny++;
        if (dir === 'LEFT') nx--;
        if (dir === 'RIGHT') nx++;
        if (maze[ny][nx] !== 1) {
          // ドットを食べる
          if (maze[ny][nx] === 2) {
            setMaze(mz => {
              const newMaze = mz.map(row => [...row]);
              newMaze[ny][nx] = 0;
              return newMaze;
            });
            setScore(s => s + 10);
          }
          return { x: nx, y: ny, dir };
        }
        return prev;
      });
      // ゴーストの移動（ランダム）
      setGhost(prev => {
        const dirs = [
          [0, -1, 'UP'], [0, 1, 'DOWN'], [-1, 0, 'LEFT'], [1, 0, 'RIGHT']
        ];
        const valid = dirs.filter(([dx, dy]) => {
          const nx = prev.x + dx, ny = prev.y + dy;
          return maze[ny][nx] !== 1;
        });
        if (valid.length === 0) return prev;
        const [dx, dy, dir] = valid[Math.floor(Math.random() * valid.length)];
        return { x: prev.x + dx, y: prev.y + dy, dir };
      });
    }, 180);
    return () => clearInterval(interval);
  }, [maze, gameStarted, gameOver, clear]);

  // 衝突・クリア判定
  useEffect(() => {
    if (!gameStarted || gameOver || clear) return;
    if (pacman.x === ghost.x && pacman.y === ghost.y) {
      setGameOver(true);
      setTimeout(() => onGameOver(score), 1000);
    }
    // クリア判定
    if (maze.flat().every(cell => cell !== 2)) {
      setClear(true);
      setTimeout(() => onGameOver(score + 100), 1000);
    }
  }, [pacman, ghost, maze, gameStarted, gameOver, clear, score, onGameOver]);

  const handleStart = () => {
    setMaze(simpleMaze());
    setPacman(INIT_PACMAN);
    setGhost(INIT_GHOST);
    setScore(0);
    setGameOver(false);
    setClear(false);
    setGameStarted(true);
    moveRef.current = 'RIGHT';
  };

  const handleExit = () => {
    onGameOver(0);
  };

  return (
    <GameContainer>
      <Stats>
        <div>スコア: {score}</div>
        <div>矢印キーでパックマンを操作</div>
      </Stats>
      <Board>
        {maze.map((row, y) =>
          row.map((cell, x) => (
            <Cell key={x + '-' + y} x={x} y={y}>
              {cell === 1 && <Wall />}
              {cell === 2 && <Dot />}
              {pacman.x === x && pacman.y === y && <Pacman />}
              {ghost.x === x && ghost.y === y && <Ghost />}
            </Cell>
          ))
        )}
        {(!gameStarted || gameOver || clear) && (
          <GameOver>
            <h2>{clear ? 'クリア！' : gameOver ? 'ゲームオーバー！' : 'パックマン'}</h2>
            <Button onClick={handleStart}>スタート</Button>
            <Button onClick={handleExit}>終了</Button>
          </GameOver>
        )}
      </Board>
    </GameContainer>
  );
};

export default PacmanGame; 