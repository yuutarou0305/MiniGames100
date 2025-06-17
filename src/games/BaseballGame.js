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

const Field = styled.div`
  width: 400px;
  height: 400px;
  background: #228B22;
  border-radius: 50%;
  position: relative;
  margin: 20px;
  border: 4px solid #fff;
`;

const Ball = styled.div`
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transition: all 0.5s ease;
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

const BaseballGame = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [ballPosition, setBallPosition] = useState({ top: 190, left: 190 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      onGameOver(score);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, onGameOver]);

  const moveBall = () => {
    const newTop = Math.random() * 360;
    const newLeft = Math.random() * 360;
    setBallPosition({ top: newTop, left: newLeft });
  };

  const handleBallClick = () => {
    if (!isPlaying) return;
    setScore(prev => prev + 1);
    moveBall();
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    moveBall();
  };

  return (
    <GameContainer>
      <h1>野球ゲーム</h1>
      <Score>スコア: {score}</Score>
      <Score>残り時間: {timeLeft}秒</Score>
      <Field>
        <Ball
          top={ballPosition.top}
          left={ballPosition.left}
          onClick={handleBallClick}
        />
      </Field>
      {!isPlaying && (
        <Button onClick={startGame}>
          {timeLeft === 30 ? 'ゲーム開始' : 'もう一度プレイ'}
        </Button>
      )}
    </GameContainer>
  );
};

export default BaseballGame; 