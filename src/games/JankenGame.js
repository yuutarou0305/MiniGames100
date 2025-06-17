import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Hand = styled.div`
  width: 150px;
  height: 150px;
  background: ${props => props.color || '#fff'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin: 20px;
  transition: transform 0.3s ease;
  transform: scale(${props => props.selected ? 1.2 : 1});
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
`;

const HandsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px;
`;

const Result = styled.div`
  font-size: 32px;
  margin: 20px;
  color: ${props => {
    switch(props.result) {
      case 'win': return '#4CAF50';
      case 'lose': return '#f44336';
      default: return '#fff';
    }
  }};
`;

const Score = styled.div`
  font-size: 24px;
  margin: 10px;
`;

const Button = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin: 10px;
  &:hover {
    background: #45a049;
  }
`;

const JankenGame = ({ onGameOver }) => {
  const [playerHand, setPlayerHand] = useState(null);
  const [computerHand, setComputerHand] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const maxRounds = 5;

  const hands = {
    rock: { emoji: '✊', color: '#e74c3c' },
    scissors: { emoji: '✌️', color: '#3498db' },
    paper: { emoji: '✋', color: '#2ecc71' }
  };

  const getComputerHand = () => {
    const choices = Object.keys(hands);
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player, computer) => {
    if (player === computer) return 'draw';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'scissors' && computer === 'paper') ||
      (player === 'paper' && computer === 'rock')
    ) {
      return 'win';
    }
    return 'lose';
  };

  const handleHandSelect = (hand) => {
    if (rounds >= maxRounds) return;
    
    const computer = getComputerHand();
    setPlayerHand(hand);
    setComputerHand(computer);
    
    const gameResult = determineWinner(hand, computer);
    setResult(gameResult);
    
    if (gameResult === 'win') {
      setScore(prev => prev + 10);
    }
    
    setRounds(prev => prev + 1);
    
    if (rounds + 1 >= maxRounds) {
      setTimeout(() => {
        onGameOver(score + (gameResult === 'win' ? 10 : 0));
      }, 1000);
    }
  };

  const resetGame = () => {
    setPlayerHand(null);
    setComputerHand(null);
    setResult(null);
    setScore(0);
    setRounds(0);
  };

  return (
    <GameContainer>
      <h1>じゃんけん</h1>
      <Score>スコア: {score}</Score>
      <Score>残り回数: {maxRounds - rounds}</Score>
      
      <div>
        <h2>あなたの手</h2>
        <HandsContainer>
          {Object.entries(hands).map(([key, { emoji, color }]) => (
            <Hand
              key={key}
              color={color}
              selected={playerHand === key}
              onClick={() => handleHandSelect(key)}
            >
              {emoji}
            </Hand>
          ))}
        </HandsContainer>
      </div>

      {computerHand && (
        <div>
          <h2>コンピュータの手</h2>
          <Hand color={hands[computerHand].color}>
            {hands[computerHand].emoji}
          </Hand>
        </div>
      )}

      {result && (
        <Result result={result}>
          {result === 'win' ? '勝ち！' : result === 'lose' ? '負け...' : '引き分け'}
        </Result>
      )}

      {rounds >= maxRounds && (
        <Button onClick={resetGame}>
          もう一度プレイ
        </Button>
      )}
    </GameContainer>
  );
};

export default JankenGame; 