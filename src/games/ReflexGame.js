import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 800px;
  height: 600px;
  position: relative;
  background: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Target = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.color || '#ff4444'};
  border-radius: 50%;
  position: absolute;
  cursor: pointer;
  transition: transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  user-select: none;

  &:hover {
    transform: scale(1.1);
  }
`;

const Stats = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-size: 20px;
  font-family: 'Arial', sans-serif;
`;

const GameOver = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'Arial', sans-serif;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;

  &:hover {
    background: #45a049;
  }
`;

const ResetButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #ff0000;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ReflexGame = ({ onGameOver, onScoreUpdate }) => {
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  const generateTarget = useCallback(() => {
    const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.max(30, 70 - level * 5); // レベルが上がるごとに小さくなる
    const points = Math.max(1, 5 - Math.floor(level / 2)); // レベルが上がるごとにポイントが減る
    const isForbidden = Math.random() < 0.2; // 20%の確率で禁止の的を生成

    return {
      id: Date.now() + Math.random(),
      x: Math.random() * (800 - size),
      y: Math.random() * (600 - size),
      color: isForbidden ? '#ff0000' : color,
      size,
      points: isForbidden ? -5 : points, // 禁止の的はマイナスポイント
      createdAt: Date.now(),
      isForbidden
    };
  }, [level]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          onGameOver(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, score, onGameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnInterval = setInterval(() => {
      setTargets(prev => {
        const newTargets = prev.filter(target => Date.now() - target.createdAt < 2000);
        if (Math.random() < 0.3 + (level * 0.05)) { // レベルが上がるごとに出現確率が上がる
          newTargets.push(generateTarget());
        }
        return newTargets;
      });
    }, 500);

    return () => clearInterval(spawnInterval);
  }, [gameStarted, gameOver, level, generateTarget]);

  const handleTargetClick = (target) => {
    const timeDiff = Date.now() - target.createdAt;
    if (timeDiff <= 2000) {
      if (target.isForbidden) {
        // 禁止の的をクリックした場合
        setCombo(0);
        const penalty = Math.abs(target.points);
        const newScore = Math.max(0, score - penalty); // スコアが0未満にならないように
        setScore(newScore);
        onScoreUpdate(newScore);
      } else {
        // 通常の的をクリックした場合
        const newCombo = combo + 1;
        setCombo(newCombo);
        setMaxCombo(prev => Math.max(prev, newCombo));
        const points = target.points * (1 + (newCombo * 0.1)); // コンボボーナス
        const newScore = score + Math.floor(points);
        setScore(newScore);
        onScoreUpdate(newScore);
      }
      setTargets(prev => prev.filter(t => t.id !== target.id));

      // レベルアップ判定
      if (score >= level * 50) {
        setLevel(prev => prev + 1);
      }
    }
  };

  const handleStart = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setLevel(1);
    setCombo(0);
    setMaxCombo(0);
    setTargets([]);
  };

  const handleRestart = () => {
    handleStart();
  };

  const handleExit = () => {
    onGameOver(score);
  };

  const handleResetCombo = () => {
    setCombo(0);
  };

  if (!gameStarted) {
    return (
      <GameContainer>
        <GameOver>
          <h2>反射神経ゲーム</h2>
          <p>ルール:</p>
          <p>・画面上に現れる的をクリックしてください</p>
          <p>・的は2秒で消えます</p>
          <p>・連続でクリックするとコンボボーナスが付きます</p>
          <p>・レベルが上がるごとに的が小さくなり、出現頻度が上がります</p>
          <p>・赤い×印の的は押してはいけません！</p>
          <p>・×印の的を押すとコンボがリセットされ、ペナルティが発生します</p>
          <Button onClick={handleStart}>ゲーム開始</Button>
        </GameOver>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <Stats>
        <div>スコア: {score}</div>
        <div>レベル: {level}</div>
        <div>コンボ: {combo}</div>
        <div>最大コンボ: {maxCombo}</div>
        <div>残り時間: {timeLeft}秒</div>
      </Stats>

      <ResetButton onClick={handleResetCombo}>
        コンボリセット
      </ResetButton>

      {targets.map(target => (
        <Target
          key={target.id}
          style={{
            left: target.x,
            top: target.y,
            width: target.size,
            height: target.size,
            background: target.color,
            border: target.isForbidden ? '3px solid #ff0000' : 'none',
            boxShadow: target.isForbidden ? '0 0 10px #ff0000' : 'none'
          }}
          onClick={() => handleTargetClick(target)}
        >
          {target.isForbidden ? '×' : target.points}
        </Target>
      ))}

      {gameOver && (
        <GameOver>
          <h2>ゲーム終了！</h2>
          <p>最終スコア: {score}</p>
          <p>最大コンボ: {maxCombo}</p>
          <p>到達レベル: {level}</p>
          <Button onClick={handleRestart}>もう一度プレイ</Button>
          <Button onClick={handleExit}>終了</Button>
        </GameOver>
      )}
    </GameContainer>
  );
};

export default ReflexGame; 