import React, { useState } from 'react';
import styled from 'styled-components';
import GameLauncher from './components/GameLauncher';
import SnakeGame from './games/SnakeGame';
import TicTacToeGame from './games/TicTacToeGame';
import PongGame from './games/PongGame';
import ClickerGame from './games/ClickerGame';
import ActionGame from './games/ActionGame';
import ReflexGame from './games/ReflexGame';
import TypingGame from './games/TypingGame';
import TerritoryGame from './games/TerritoryGame';
import ShootingGame from './games/ShootingGame';
import MemoryGame from './games/MemoryGame';
import PuzzleGame from './games/PuzzleGame';
import StrategyGame from './games/StrategyGame';
import OthelloGame from './games/OthelloGame';
import BlackjackGame from './games/BlackjackGame';
import IrairaGame from './games/IrairaGame';
import PacmanGame from './games/PacmanGame';
import NumberGuessGame from './games/NumberGuessGame';
import BombGame from './games/BombGame';
import MathGame from './games/MathGame';
import PrefectureQuizGame from './games/PrefectureQuizGame';
import SpotTheDifferenceGame from './games/SpotTheDifferenceGame';
import TrickQuizGame from './games/TrickQuizGame';
import './App.css';

const pastelColors = [
  '#ffffff', '#f7fbff', '#e3f0fc', '#d0e6fa', '#b3d8f7', '#eaf4fd', '#cbe2fa', '#e3f0fc', '#f7fbff', '#ffffff', '#e3f0fc', '#b3d8f7', '#eaf4fd', '#cbe2fa', '#e3f0fc', '#f7fbff'
];

const AppContainer = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(120deg, #f7fbff 0%, #e3f0fc 100%);
  color: #111;
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  color: #111;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
  color: #111;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.08);
`;

const TotalScore = styled.p`
  font-size: 1.5rem;
  margin: 0;
  color: #111;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.08);
`;

const GameContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const GameGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px 40px;
  margin-top: 32px;
`;

const GameCard = styled.div`
  background: #fff;
  color: #111;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(23, 78, 166, 0.08);
  border: 2px solid #b3d8f7;
  padding: 32px 24px;
  margin: 18px;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  min-width: 260px;
  min-height: 80px;
  user-select: none;
  &:hover {
    transform: scale(1.04);
    box-shadow: 0 4px 16px rgba(23, 78, 166, 0.12);
    border-color: #174ea6;
  }
`;

const GameTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: #111;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.08);
`;

const GameCardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
`;

const GameIcon = styled.span`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const App = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  const games = [
    { id: 'snake', name: 'スネークゲーム', component: SnakeGame },
    { id: 'tictactoe', name: 'まるばつゲーム', component: TicTacToeGame },
    { id: 'pong', name: 'ポン', component: PongGame },
    { id: 'clicker', name: 'クリッカーゲーム', component: ClickerGame },
    { id: 'action', name: 'アクションゲーム', component: ActionGame },
    { id: 'reflex', name: '反射神経ゲーム', component: ReflexGame },
    { id: 'typing', name: 'タイピングゲーム', component: TypingGame },
    { id: 'territory', name: '陣取りゲーム', component: TerritoryGame },
    { id: 'shooting', name: 'シューティングゲーム', component: ShootingGame },
    { id: 'memory', name: '記憶力ゲーム', component: MemoryGame },
    { id: 'puzzle', name: 'スライドパズル', component: PuzzleGame },
    { id: 'strategy', name: 'ストラテジーゲーム', component: StrategyGame },
    { id: 'othello', name: 'リバーシ（オセロ）ゲーム', component: OthelloGame },
    { id: 'blackjack', name: 'ブラックジャック', component: BlackjackGame },
    { id: 'iraira', name: 'イライラ棒', component: IrairaGame },
    { id: 'pacman', name: 'パックマン', component: PacmanGame },
    { id: 'numberguess', name: '数あてゲーム', component: NumberGuessGame },
    { id: 'bomb', name: '爆弾ゲーム', component: BombGame },
    { id: 'math', name: '算数ゲーム', component: MathGame },
    { id: 'prefecturequiz', name: '都道府県クイズ', component: PrefectureQuizGame },
    { id: 'spotthedifference', name: '間違い探し', component: SpotTheDifferenceGame },
    { id: 'trickquiz', name: '引っ掛けクイズ', component: TrickQuizGame },
  ];

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleGameOver = (score) => {
    setTotalScore(prev => prev + score);
    setSelectedGame(null);
  };

  const handleBack = () => {
    setSelectedGame(null);
  };

  const handleScoreUpdate = (score) => {
    setTotalScore(score);
  };

  const renderGame = () => {
    const game = games.find(g => g.id === selectedGame.id);
    if (!game) return null;
    const GameComponent = game.component;
    return <GameComponent onGameOver={handleGameOver} onScoreUpdate={handleScoreUpdate} onBack={handleBack} />;
  };

  return (
    <AppContainer>
      <Header>
        <Title>ミニゲーム 100</Title>
        <TotalScore>合計スコア: {totalScore}</TotalScore>
      </Header>
      {selectedGame ? (
        <GameContainer>
          {renderGame()}
        </GameContainer>
      ) : (
        <GameGrid>
          {games.map((game, idx) => (
            <GameCard
              key={game.id}
              color={pastelColors[idx % pastelColors.length]}
              onClick={() => handleGameSelect(game)}
            >
              <GameCardContent>
                <GameTitle>{game.name}</GameTitle>
              </GameCardContent>
            </GameCard>
          ))}
        </GameGrid>
      )}
    </AppContainer>
  );
};

export default App; 