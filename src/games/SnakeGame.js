import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const GameBoard = styled.div`
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  border: 2px solid #e94560;
`;

const SnakeSegment = styled.div`
  width: 20px;
  height: 20px;
  background: #e94560;
  position: absolute;
  border-radius: 2px;
`;

const Food = styled.div`
  width: 20px;
  height: 20px;
  background: #4CAF50;
  position: absolute;
  border-radius: 50%;
`;

const Score = styled.div`
  font-size: 1.5rem;
  color: white;
`;

const GameOver = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
`;

function SnakeGame({ onGameOver }) {
  const [snake, setSnake] = useState([[0, 0]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * 20);
    return [x, y];
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = [...newSnake[0]];

      switch (direction) {
        case 'UP':
          head[1] -= 1;
          break;
        case 'DOWN':
          head[1] += 1;
          break;
        case 'LEFT':
          head[0] -= 1;
          break;
        case 'RIGHT':
          head[0] += 1;
          break;
        default:
          break;
      }

      // Check collision with walls
      if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20) {
        setGameOver(true);
        return prevSnake;
      }

      // Check collision with self
      if (newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check if food is eaten
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  const handleRestart = () => {
    setSnake([[0, 0]]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
  };

  const handleExit = () => {
    onGameOver(score);
  };

  return (
    <GameContainer>
      <Score>スコア: {score}</Score>
      <GameBoard>
        {snake.map((segment, index) => (
          <SnakeSegment
            key={index}
            style={{
              left: `${segment[0] * 20}px`,
              top: `${segment[1] * 20}px`,
            }}
          />
        ))}
        <Food
          style={{
            left: `${food[0] * 20}px`,
            top: `${food[1] * 20}px`,
          }}
        />
        {gameOver && (
          <GameOver>
            <h2>ゲームオーバー！</h2>
            <p>最終スコア: {score}</p>
            <button onClick={handleRestart}>もう一度プレイ</button>
            <button onClick={handleExit} style={{ marginLeft: '10px' }}>終了</button>
          </GameOver>
        )}
      </GameBoard>
    </GameContainer>
  );
}

export default SnakeGame; 