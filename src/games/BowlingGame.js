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

const Lane = styled.div`
  width: 300px;
  height: 600px;
  background: #8B4513;
  position: relative;
  margin: 20px;
  border: 4px solid #fff;
  overflow: hidden;
`;

const Pin = styled.div`
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transition: all 0.5s ease;
  opacity: ${props => props.hit ? 0 : 1};
`;

const Ball = styled.div`
  width: 30px;
  height: 30px;
  background: #000;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  left: ${props => props.position}px;
  transition: all 0.5s ease;
`;

const Score = styled.div`
  font-size: 24px;
  margin: 10px;
  color: #111;
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

const BowlingGame = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [ballPosition, setBallPosition] = useState(150);
  const [isRolling, setIsRolling] = useState(false);
  const [pins, setPins] = useState([]);
  const [remainingRolls, setRemainingRolls] = useState(10);

  const initializePins = () => {
    const newPins = [];
    const positions = [
      { top: 50, left: 150 },
      { top: 100, left: 130 },
      { top: 100, left: 170 },
      { top: 150, left: 110 },
      { top: 150, left: 150 },
      { top: 150, left: 190 },
      { top: 200, left: 90 },
      { top: 200, left: 130 },
      { top: 200, left: 170 },
      { top: 200, left: 210 }
    ];
    positions.forEach((pos, index) => {
      newPins.push({ ...pos, hit: false, id: index });
    });
    setPins(newPins);
  };

  useEffect(() => {
    initializePins();
  }, []);

  const rollBall = () => {
    if (isRolling || remainingRolls === 0) return;
    setIsRolling(true);
    setBallPosition(150);

    // ボールを投げる
    setTimeout(() => {
      const newPosition = 150 + (Math.random() * 100 - 50);
      setBallPosition(newPosition);

      // ピンを倒す
      setTimeout(() => {
        const newPins = pins.map(pin => ({
          ...pin,
          hit: Math.random() > 0.3 // 70%の確率でピンが倒れる
        }));
        setPins(newPins);

        // スコア計算
        const knockedPins = newPins.filter(pin => pin.hit).length;
        setScore(prev => prev + knockedPins);
        setRemainingRolls(prev => prev - 1);

        // ゲーム終了判定
        if (remainingRolls === 1) {
          setTimeout(() => {
            onGameOver(score + knockedPins);
          }, 1000);
        }

        setIsRolling(false);
      }, 1000);
    }, 100);
  };

  return (
    <GameContainer>
      <h1>ボウリング</h1>
      <Score>スコア: {score}</Score>
      <Score>残り投球数: {remainingRolls}</Score>
      <Lane>
        {pins.map(pin => (
          <Pin
            key={pin.id}
            top={pin.top}
            left={pin.left}
            hit={pin.hit}
          />
        ))}
        <Ball position={ballPosition} />
      </Lane>
      <Button onClick={rollBall} disabled={isRolling || remainingRolls === 0}>
        {remainingRolls === 0 ? 'ゲーム終了' : 'ボールを投げる'}
      </Button>
    </GameContainer>
  );
};

export default BowlingGame; 