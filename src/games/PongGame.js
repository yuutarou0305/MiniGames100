import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const GameBoard = styled.div`
  width: 600px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  border: 2px solid #e94560;
`;

const Paddle = styled.div`
  width: 10px;
  height: 80px;
  background: #e94560;
  position: absolute;
  left: ${props => props.isLeft ? '0' : 'auto'};
  right: ${props => props.isLeft ? 'auto' : '0'};
  top: ${props => props.top}px;
`;

const Ball = styled.div`
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
`;

const Score = styled.div`
  font-size: 1.5rem;
  color: white;
  display: flex;
  gap: 40px;
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

function PongGame({ onGameOver }) {
  const [leftPaddle, setLeftPaddle] = useState(160);
  const [rightPaddle, setRightPaddle] = useState(160);
  const [ball, setBall] = useState({ x: 290, y: 190 });
  const [ballSpeed, setBallSpeed] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState({ left: 0, right: 0 });
  const [gameOver, setGameOver] = useState(false);

  const movePaddle = useCallback((e) => {
    const gameBoard = document.querySelector('#game-board');
    const rect = gameBoard.getBoundingClientRect();
    const y = e.clientY - rect.top - 40;
    
    if (e.clientX < window.innerWidth / 2) {
      setLeftPaddle(Math.max(0, Math.min(320, y)));
    } else {
      setRightPaddle(Math.max(0, Math.min(320, y)));
    }
  }, []);

  const updateBall = useCallback(() => {
    if (gameOver) return;

    setBall(prev => {
      let newX = prev.x + ballSpeed.x;
      let newY = prev.y + ballSpeed.y;
      let newSpeedX = ballSpeed.x;
      let newSpeedY = ballSpeed.y;

      // Wall collision
      if (newY <= 0 || newY >= 380) {
        newSpeedY = -newSpeedY;
      }

      // Paddle collision
      if (newX <= 10 && newY >= leftPaddle && newY <= leftPaddle + 80) {
        newSpeedX = -newSpeedX;
        newX = 10;
      }
      if (newX >= 570 && newY >= rightPaddle && newY <= rightPaddle + 80) {
        newSpeedX = -newSpeedX;
        newX = 570;
      }

      // Score points
      if (newX < 0) {
        setScore(prev => ({ ...prev, right: prev.right + 1 }));
        newX = 290;
        newY = 190;
        newSpeedX = 5;
        newSpeedY = 5;
      }
      if (newX > 600) {
        setScore(prev => ({ ...prev, left: prev.left + 1 }));
        newX = 290;
        newY = 190;
        newSpeedX = -5;
        newSpeedY = 5;
      }

      setBallSpeed({ x: newSpeedX, y: newSpeedY });
      return { x: newX, y: newY };
    });
  }, [ballSpeed, gameOver, leftPaddle, rightPaddle]);

  useEffect(() => {
    const gameBoard = document.querySelector('#game-board');
    gameBoard.addEventListener('mousemove', movePaddle);
    return () => gameBoard.removeEventListener('mousemove', movePaddle);
  }, [movePaddle]);

  useEffect(() => {
    const gameInterval = setInterval(updateBall, 16);
    return () => clearInterval(gameInterval);
  }, [updateBall]);

  useEffect(() => {
    if (score.left >= 5 || score.right >= 5) {
      setGameOver(true);
    }
  }, [score]);

  const handleRestart = () => {
    setLeftPaddle(160);
    setRightPaddle(160);
    setBall({ x: 290, y: 190 });
    setBallSpeed({ x: 5, y: 5 });
    setScore({ left: 0, right: 0 });
    setGameOver(false);
  };

  const handleExit = () => {
    onGameOver(Math.max(score.left, score.right) * 10);
  };

  return (
    <GameContainer>
      <Score>
        <div>プレイヤー1: {score.left}</div>
        <div>プレイヤー2: {score.right}</div>
      </Score>
      <GameBoard id="game-board">
        <Paddle isLeft top={leftPaddle} />
        <Paddle isLeft={false} top={rightPaddle} />
        <Ball left={ball.x} top={ball.y} />
        {gameOver && (
          <GameOver>
            <h2>ゲーム終了！</h2>
            <p>勝者: {score.left > score.right ? 'プレイヤー1' : 'プレイヤー2'}</p>
            <button onClick={handleRestart}>もう一度プレイ</button>
            <button onClick={handleExit} style={{ marginLeft: '10px' }}>終了</button>
          </GameOver>
        )}
      </GameBoard>
    </GameContainer>
  );
}

export default PongGame; 