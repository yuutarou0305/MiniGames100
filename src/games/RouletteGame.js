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

const RouletteWheel = styled.div`
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: #2c3e50;
  position: relative;
  margin: 20px;
  border: 4px solid #fff;
  transition: transform 3s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  transform: rotate(${props => props.rotation}deg);
`;

const Segment = styled.div`
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: 100% 100%;
  transform: rotate(${props => props.rotation}deg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px black;
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
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const Result = styled.div`
  font-size: 32px;
  margin: 20px;
  color: #4CAF50;
`;

const RouletteGame = ({ onGameOver }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [spins, setSpins] = useState(0);
  const maxSpins = 3;

  const segments = [
    { value: 1, color: '#e74c3c' },
    { value: 2, color: '#2ecc71' },
    { value: 3, color: '#3498db' },
    { value: 4, color: '#f1c40f' },
    { value: 5, color: '#9b59b6' },
    { value: 6, color: '#e67e22' },
    { value: 7, color: '#1abc9c' },
    { value: 8, color: '#34495e' }
  ];

  const spinWheel = () => {
    if (isSpinning || spins >= maxSpins) return;

    setIsSpinning(true);
    setResult(null);

    // ランダムな回転角度を生成（5-10回転）
    const spins = 5 + Math.random() * 5;
    const degrees = spins * 360 + Math.random() * 360;
    setRotation(prev => prev + degrees);

    // 結果の計算
    setTimeout(() => {
      const finalRotation = (rotation + degrees) % 360;
      const segmentIndex = Math.floor(finalRotation / (360 / segments.length));
      const selectedValue = segments[segmentIndex].value;
      setResult(selectedValue);
      setIsSpinning(false);
      setSpins(prev => prev + 1);

      if (spins + 1 >= maxSpins) {
        onGameOver(selectedValue);
      }
    }, 3000);
  };

  return (
    <GameContainer>
      <h1>ルーレット</h1>
      <RouletteWheel rotation={rotation}>
        {segments.map((segment, index) => (
          <Segment
            key={index}
            rotation={(360 / segments.length) * index}
            style={{
              backgroundColor: segment.color,
              clipPath: `polygon(0 0, 100% 0, 100% 100%)`
            }}
          >
            {segment.value}
          </Segment>
        ))}
      </RouletteWheel>
      {result && <Result>結果: {result}</Result>}
      <Button
        onClick={spinWheel}
        disabled={isSpinning || spins >= maxSpins}
      >
        {spins >= maxSpins ? 'ゲーム終了' : 'ルーレットを回す'}
      </Button>
      <div>残り回数: {maxSpins - spins}</div>
    </GameContainer>
  );
};

export default RouletteGame; 