import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BackButton } from '../components/commonStyles';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #2d3436;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const GameArea = styled.div`
  width: 800px;
  height: 600px;
  background: #636e72;
  position: relative;
  border: 4px solid #b2bec3;
`;

const Bomb = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  background: #d63031;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0px 0px 15px 5px #ff7675;
`;

const Stats = styled.div`
  color: #fff;
  font-size: 24px;
  margin: 10px;
`;

const BombGame = ({ onGameOver, onBack }) => {
  const [bombs, setBombs] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      // Add new bombs
      if (Math.random() < 0.03) {
        setBombs(prev => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 740,
            y: Math.random() * 540,
            timer: 3000, // 3 seconds
          },
        ]);
      }

      // Update bomb timers
      setBombs(prev =>
        prev.map(bomb => {
          const newTimer = bomb.timer - 16;
          if (newTimer <= 0) {
            setGameOver(true);
            onGameOver(score);
            return null;
          }
          return { ...bomb, timer: newTimer };
        }).filter(Boolean)
      );
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameOver, score, onGameOver]);

  const handleBombClick = (bombId) => {
    setBombs(prev => prev.filter(bomb => bomb.id !== bombId));
    setScore(s => s + 10);
  };

  return (
    <GameContainer>
      <Stats>Score: {score}</Stats>
      <GameArea>
        {bombs.map(bomb => (
          <Bomb
            key={bomb.id}
            style={{ left: bomb.x, top: bomb.y }}
            onClick={() => handleBombClick(bomb.id)}
          >
            {Math.ceil(bomb.timer / 1000)}
          </Bomb>
        ))}
      </GameArea>
      <BackButton onClick={onBack}>ホームに戻る</BackButton>
    </GameContainer>
  );
};

export default BombGame; 