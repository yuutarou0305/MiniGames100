import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { BackButton } from '../components/commonStyles';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ClickerButton = styled.button`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #e94560;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  &:hover {
    background: #d13b54;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #111;
  font-size: 1.2rem;
  text-align: center;
`;

const UpgradeButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #e94560;
  color: #111;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
  width: 200px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

function ClickerGame({ onGameOver, onBack }) {
  const [clicks, setClicks] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const handleClick = useCallback(() => {
    setClicks(prev => prev + clickPower);
  }, [clickPower]);

  const buyUpgrade = useCallback((type) => {
    const costs = {
      power: clickPower * 10,
      auto: (autoClickers + 1) * 50
    };

    if (clicks >= costs[type]) {
      setClicks(prev => prev - costs[type]);
      if (type === 'power') {
        setClickPower(prev => prev + 1);
      } else {
        setAutoClickers(prev => prev + 1);
      }
    }
  }, [clicks, clickPower, autoClickers]);

  useEffect(() => {
    const autoClickInterval = setInterval(() => {
      if (autoClickers > 0) {
        setClicks(prev => prev + autoClickers);
      }
    }, 1000);

    return () => clearInterval(autoClickInterval);
  }, [autoClickers]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRestart = () => {
    setClicks(0);
    setClickPower(1);
    setAutoClickers(0);
    setGameOver(false);
    setTimeLeft(30);
  };

  const handleExit = () => {
    onGameOver(clicks);
  };

  return (
    <GameContainer>
      <Stats>
        <div>残り時間: {timeLeft}秒</div>
        <div>クリック数: {clicks}</div>
        <div>クリック力: {clickPower}</div>
        <div>自動クリッカー: {autoClickers}</div>
      </Stats>
      <ClickerButton onClick={handleClick} disabled={gameOver}>
        クリック！
      </ClickerButton>
      <div style={{ display: 'flex', gap: '10px' }}>
        <UpgradeButton
          onClick={() => buyUpgrade('power')}
          disabled={clicks < clickPower * 10 || gameOver}
        >
          クリック力アップ ({clickPower * 10}ポイント)
        </UpgradeButton>
        <UpgradeButton
          onClick={() => buyUpgrade('auto')}
          disabled={clicks < (autoClickers + 1) * 50 || gameOver}
        >
          自動クリッカー購入 ({(autoClickers + 1) * 50}ポイント)
        </UpgradeButton>
      </div>
      {gameOver && (
        <GameOver>
          <h2>ゲーム終了！</h2>
          <p>最終スコア: {clicks}ポイント</p>
          <button onClick={handleRestart}>もう一度プレイ</button>
          <button onClick={handleExit} style={{ marginLeft: '10px' }}>終了</button>
        </GameOver>
      )}
      <BackButton onClick={onBack}>ホームに戻る</BackButton>
    </GameContainer>
  );
}

export default ClickerGame; 