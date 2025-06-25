import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BackButton } from '../components/commonStyles';

const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameContainer = styled.div`
  width: 800px;
  height: 600px;
  position: relative;
  background: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 2px;
  width: 500px;
  height: 500px;
  background: #333;
  padding: 10px;
  border-radius: 5px;
`;

const Cell = styled.div`
  background: ${props => {
    if (props.owner === 'player1') return '#ff4444';
    if (props.owner === 'player2') return '#4444ff';
    if (props.isNeutral) return '#666';
    return '#444';
  }};
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  user-select: none;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }
`;

const Stats = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-size: 20px;
  font-family: 'Arial', sans-serif;
`;

const GameOver = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'Arial', sans-serif;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;

  &:hover {
    background: #45a049;
  }
`;

const TerritoryGame = ({ onGameOver, onScoreUpdate, onBack }) => {
  const [grid, setGrid] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [neutralCells, setNeutralCells] = useState([]);

  // グリッドの初期化
  useEffect(() => {
    if (!gameStarted) return;

    const newGrid = Array(10).fill().map(() => 
      Array(10).fill().map(() => ({
        owner: null,
        isNeutral: false
      }))
    );

    // 中立セルの配置
    const neutralCount = 20;
    const newNeutralCells = [];
    for (let i = 0; i < neutralCount; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      } while (newGrid[y][x].isNeutral);
      
      newGrid[y][x].isNeutral = true;
      newNeutralCells.push({ x, y });
    }

    setGrid(newGrid);
    setNeutralCells(newNeutralCells);
  }, [gameStarted]);

  // タイマーの処理
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          const winner = scores.player1 > scores.player2 ? 'player1' : 'player2';
          onGameOver(scores[winner]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, scores, onGameOver]);

  const handleCellClick = (x, y) => {
    if (gameOver || grid[y][x].owner === currentPlayer) return;

    const newGrid = [...grid];
    const cell = newGrid[y][x];

    // 中立セルの場合
    if (cell.isNeutral) {
      cell.owner = currentPlayer;
      cell.isNeutral = false;
      setNeutralCells(prev => prev.filter(c => c.x !== x || c.y !== y));
      setScores(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 2
      }));
    } else {
      // 相手のセルを奪取
      cell.owner = currentPlayer;
      setScores(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1,
        [currentPlayer === 'player1' ? 'player2' : 'player1']: 
          prev[currentPlayer === 'player1' ? 'player2' : 'player1'] - 1
      }));
    }

    setGrid(newGrid);
    setCurrentPlayer(prev => prev === 'player1' ? 'player2' : 'player1');
  };

  const handleStart = () => {
    setGameStarted(true);
    setGameOver(false);
    setScores({ player1: 0, player2: 0 });
    setTimeLeft(60);
    setCurrentPlayer('player1');
  };

  const handleRestart = () => {
    handleStart();
  };

  const handleExit = () => {
    const winner = scores.player1 > scores.player2 ? 'player1' : 'player2';
    onGameOver(scores[winner]);
  };

  if (!gameStarted) {
    return (
      <GameWrapper>
        <GameContainer>
          <GameOver>
            <h2>陣取りゲーム</h2>
            <p>ルール:</p>
            <p>・2人で交互に陣地を取っていきます</p>
            <p>・灰色のセルは中立地で、取ると2ポイント獲得</p>
            <p>・相手の陣地を取ると1ポイント獲得、相手は1ポイント失う</p>
            <p>・60秒で終了、より多くのポイントを取った方が勝ち</p>
            <Button onClick={handleStart}>ゲーム開始</Button>
          </GameOver>
        </GameContainer>
        <BackButton onClick={onBack}>ホームに戻る</BackButton>
      </GameWrapper>
    );
  }

  return (
    <GameWrapper>
      <GameContainer>
        <Stats>
          <div style={{ color: '#ff4444' }}>プレイヤー1: {scores.player1}</div>
          <div style={{ color: '#4444ff' }}>プレイヤー2: {scores.player2}</div>
          <div>現在のターン: {currentPlayer === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}</div>
          <div>残り時間: {timeLeft}秒</div>
        </Stats>

        <Grid>
          {grid.map((row, y) => 
            row.map((cell, x) => (
              <Cell
                key={`${x}-${y}`}
                owner={cell.owner}
                isNeutral={cell.isNeutral}
                onClick={() => handleCellClick(x, y)}
              >
                {cell.isNeutral ? 'N' : ''}
              </Cell>
            ))
          )}
        </Grid>

        {gameOver && (
          <GameOver>
            <h2>ゲーム終了！</h2>
            <p>プレイヤー1: {scores.player1}ポイント</p>
            <p>プレイヤー2: {scores.player2}ポイント</p>
            <p>勝者: {scores.player1 > scores.player2 ? 'プレイヤー1' : 'プレイヤー2'}</p>
            <Button onClick={handleRestart}>もう一度プレイ</Button>
            <Button onClick={handleExit}>終了</Button>
          </GameOver>
        )}
      </GameContainer>
      <BackButton onClick={onBack}>ホームに戻る</BackButton>
    </GameWrapper>
  );
};

export default TerritoryGame; 