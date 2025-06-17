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

const Board = styled.div`
  width: 400px;
  height: 400px;
  background: #2c3e50;
  position: relative;
  margin: 20px;
  border: 4px solid #fff;
  border-radius: 10px;
`;

const Coin = styled.div`
  width: 40px;
  height: 40px;
  background: #f1c40f;
  border-radius: 50%;
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
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

const Message = styled.div`
  font-size: 20px;
  margin: 10px;
  color: ${props => props.color || '#fff'};
`;

const CoinGame = ({ onGameOver }) => {
  const [coins, setCoins] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const boardRef = useRef(null);

  const addCoin = (x, y) => {
    if (gameOver) return;

    const newCoin = {
      id: Date.now(),
      left: x - 20, // コインの中心をクリック位置に合わせる
      top: y - 20,
    };

    // 他のコインとの衝突チェック
    const isOverlapping = coins.some(coin => {
      const dx = coin.left - newCoin.left;
      const dy = coin.top - newCoin.top;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 40; // コインの直径
    });

    if (isOverlapping) {
      setMessage('コインが重なっています！');
      return;
    }

    setCoins(prev => [...prev, newCoin]);
    setScore(prev => prev + 10);
    setMessage('');

    // バランスチェック
    if (coins.length >= 4) {
      checkBalance();
    }
  };

  const checkBalance = () => {
    const centerX = 200; // ボードの中心
    const centerY = 200;
    let totalX = 0;
    let totalY = 0;

    coins.forEach(coin => {
      totalX += coin.left + 20; // コインの中心座標
      totalY += coin.top + 20;
    });

    const avgX = totalX / coins.length;
    const avgY = totalY / coins.length;

    const distanceFromCenter = Math.sqrt(
      Math.pow(avgX - centerX, 2) + Math.pow(avgY - centerY, 2)
    );

    if (distanceFromCenter > 100) {
      setGameOver(true);
      setMessage('バランスが崩れました！');
      setTimeout(() => {
        onGameOver(score);
      }, 1000);
    }
  };

  const handleBoardClick = (e) => {
    if (gameOver) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // ボードの範囲内かチェック
    if (x >= 0 && x <= 400 && y >= 0 && y <= 400) {
      addCoin(x, y);
    }
  };

  const resetGame = () => {
    setCoins([]);
    setScore(0);
    setGameOver(false);
    setMessage('');
  };

  return (
    <GameContainer>
      <h1>コインゲーム</h1>
      <Score>スコア: {score}</Score>
      <Board ref={boardRef} onClick={handleBoardClick}>
        {coins.map(coin => (
          <Coin
            key={coin.id}
            top={coin.top}
            left={coin.left}
          />
        ))}
      </Board>
      <Message color={message ? '#f44336' : '#4CAF50'}>
        {message || 'コインを配置してください'}
      </Message>
      {gameOver && (
        <Button onClick={resetGame}>
          もう一度プレイ
        </Button>
      )}
    </GameContainer>
  );
};

export default CoinGame; 