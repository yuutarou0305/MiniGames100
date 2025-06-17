import React, { useState } from 'react';
import styled from 'styled-components';
import BreakoutGame from './games/BreakoutGame';
import RouletteGame from './games/RouletteGame';
import JankenGame from './games/JankenGame';
import CoinGame from './games/CoinGame';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

const GameSelector = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 40px;
  color: #4CAF50;
`;

const GameButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;
  width: 200px;
  transition: all 0.3s ease;
  &:hover {
    background: #45a049;
    transform: scale(1.05);
  }
`;

const Score = styled.div`
  font-size: 24px;
  margin: 20px;
  color: #4CAF50;
`;

const App = () => {
  const [currentGame, setCurrentGame] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  const handleGameOver = (score) => {
    setTotalScore(prev => prev + score);
    setCurrentGame(null);
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'breakout':
        return <BreakoutGame onGameOver={handleGameOver} />;
      case 'roulette':
        return <RouletteGame onGameOver={handleGameOver} />;
      case 'janken':
        return <JankenGame onGameOver={handleGameOver} />;
      case 'coin':
        return <CoinGame onGameOver={handleGameOver} />;
      default:
        return (
          <GameSelector>
            <Title>ミニゲームコレクション</Title>
            <GameButton onClick={() => setCurrentGame('breakout')}>
              ブロック崩し
            </GameButton>
            <GameButton onClick={() => setCurrentGame('roulette')}>
              ルーレット
            </GameButton>
            <GameButton onClick={() => setCurrentGame('janken')}>
              じゃんけん
            </GameButton>
            <GameButton onClick={() => setCurrentGame('coin')}>
              コインゲーム
            </GameButton>
            <Score>合計スコア: {totalScore}</Score>
          </GameSelector>
        );
    }
  };

  return (
    <AppContainer>
      {renderGame()}
    </AppContainer>
  );
};

export default App; 