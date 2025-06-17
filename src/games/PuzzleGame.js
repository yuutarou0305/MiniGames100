import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin: 20px;
  background: #2c3e50;
  padding: 10px;
  border-radius: 10px;
`;

const Tile = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.empty ? 'transparent' : '#3498db'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  cursor: ${props => props.empty ? 'default' : 'pointer'};
  border-radius: 5px;
  transition: transform 0.2s;

  &:hover {
    transform: ${props => props.empty ? 'none' : 'scale(1.05)'};
  }
`;

const Stats = styled.div`
  color: white;
  font-size: 24px;
  margin: 20px;
  text-align: center;
`;

const GameOver = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
`;

const Button = styled.button`
  background: #3498db;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  color: white;

  &:hover {
    background: #2980b9;
  }
`;

const PuzzleGame = ({ onGameOver, onScoreUpdate }) => {
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeGame = () => {
    const numbers = Array.from({ length: 15 }, (_, i) => i + 1);
    const shuffled = [...numbers, null].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setMoves(0);
    setTime(0);
    setGameOver(false);
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (tiles.length === 0) return;

    const isComplete = tiles.every((tile, index) => {
      if (index === tiles.length - 1) return tile === null;
      return tile === index + 1;
    });

    if (isComplete) {
      setGameOver(true);
      const score = Math.max(0, 1000 - moves * 10 - time);
      onGameOver(score);
    }
  }, [tiles, moves, time, onGameOver]);

  const handleTileClick = (index) => {
    if (gameOver) return;

    const emptyIndex = tiles.indexOf(null);
    const row = Math.floor(index / 4);
    const emptyRow = Math.floor(emptyIndex / 4);
    const col = index % 4;
    const emptyCol = emptyIndex % 4;

    const isAdjacent = (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(m => m + 1);
    }
  };

  const handleStart = () => {
    setGameStarted(true);
    initializeGame();
  };

  const handleExit = () => {
    onGameOver(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <GameContainer>
      {!gameStarted ? (
        <GameOver>
          <h2>スライドパズル</h2>
          <p>数字を1から15の順番に並べよう！</p>
          <p>少ない手数と時間で完成させよう！</p>
          <Button onClick={handleStart}>スタート</Button>
        </GameOver>
      ) : gameOver ? (
        <GameOver>
          <h2>パズル完成！</h2>
          <p>手数: {moves}</p>
          <p>時間: {formatTime(time)}</p>
          <p>スコア: {Math.max(0, 1000 - moves * 10 - time)}</p>
          <Button onClick={handleStart}>もう一度プレイ</Button>
          <Button onClick={handleExit}>終了</Button>
        </GameOver>
      ) : (
        <>
          <Stats>
            <div>手数: {moves}</div>
            <div>時間: {formatTime(time)}</div>
          </Stats>
          <Grid>
            {tiles.map((tile, index) => (
              <Tile
                key={index}
                empty={tile === null}
                onClick={() => handleTileClick(index)}
              >
                {tile}
              </Tile>
            ))}
          </Grid>
        </>
      )}
    </GameContainer>
  );
};

export default PuzzleGame; 