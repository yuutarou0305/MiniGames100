import React, { useState, useEffect, useRef } from 'react';
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

const Canvas = styled.canvas`
  border: 2px solid white;
  background: #000;
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

const BreakoutGame = ({ onGameOver }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // ゲームの設定
    const paddleWidth = 100;
    const paddleHeight = 10;
    const ballRadius = 8;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 30;
    let ballSpeedX = 4;
    let ballSpeedY = -4;

    // ブロックの設定
    const blockRows = 5;
    const blockCols = 8;
    const blockWidth = 60;
    const blockHeight = 20;
    const blockPadding = 10;
    const blocks = [];

    for (let row = 0; row < blockRows; row++) {
      for (let col = 0; col < blockCols; col++) {
        blocks.push({
          x: col * (blockWidth + blockPadding) + 50,
          y: row * (blockHeight + blockPadding) + 50,
          width: blockWidth,
          height: blockHeight,
          active: true
        });
      }
    }

    // マウス移動の処理
    const handleMouseMove = (e) => {
      const relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // ゲームループ
    const gameLoop = () => {
      // 画面クリア
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // パドルの描画
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(paddleX, canvas.height - 20, paddleWidth, paddleHeight);

      // ボールの描画
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();

      // ブロックの描画
      blocks.forEach(block => {
        if (block.active) {
          ctx.fillStyle = '#ff6b6b';
          ctx.fillRect(block.x, block.y, block.width, block.height);
        }
      });

      // ボールの移動
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // 壁との衝突判定
      if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
      }
      if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
      }

      // パドルとの衝突判定
      if (ballY + ballRadius > canvas.height - 20 &&
          ballX > paddleX && ballX < paddleX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
      }

      // ブロックとの衝突判定
      blocks.forEach(block => {
        if (block.active &&
            ballX + ballRadius > block.x &&
            ballX - ballRadius < block.x + block.width &&
            ballY + ballRadius > block.y &&
            ballY - ballRadius < block.y + block.height) {
          ballSpeedY = -ballSpeedY;
          block.active = false;
          setScore(prev => prev + 10);
        }
      });

      // ゲームオーバー判定
      if (ballY + ballRadius > canvas.height) {
        setGameOver(true);
        onGameOver(score);
        return;
      }

      // クリア判定
      if (blocks.every(block => !block.active)) {
        setGameOver(true);
        onGameOver(score + 100); // クリアボーナス
        return;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameStarted, score, onGameOver]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <GameContainer>
      <h1>ブロック崩し</h1>
      <Score>スコア: {score}</Score>
      <Canvas ref={canvasRef} width={600} height={400} />
      {!gameStarted && (
        <Button onClick={startGame}>
          {gameOver ? 'もう一度プレイ' : 'ゲーム開始'}
        </Button>
      )}
    </GameContainer>
  );
};

export default BreakoutGame; 