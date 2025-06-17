import React, { useState } from 'react';
import styled from 'styled-components';

const GameArea = styled.div`
  width: 320px;
  height: 400px;
  background: #e3f0fc;
  border: 2px solid #174ea6;
  border-radius: 16px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

const Crane = styled.div`
  position: absolute;
  top: 0;
  left: ${props => props.x}px;
  width: 40px;
  height: 60px;
  z-index: 2;
`;

const CraneArm = styled.div`
  width: 8px;
  height: ${props => props.armLength}px;
  background: #888;
  margin: 0 auto;
`;

const CraneHead = styled.div`
  width: 40px;
  height: 20px;
  background: #174ea6;
  border-radius: 8px 8px 12px 12px;
  margin: 0 auto;
`;

const Prize = styled.div`
  position: absolute;
  bottom: 20px;
  left: ${props => props.x}px;
  width: 36px;
  height: 36px;
  background: #fbbf24;
  border-radius: 50%;
  border: 2px solid #f59e42;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 1;
`;

const ButtonBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
`;

const Info = styled.div`
  text-align: center;
  margin: 12px 0;
`;

const PRIZE_POSITIONS = [30, 90, 170, 240];
const PRIZE_ICONS = ['🧸', '🎁', '🐻', '🍩'];

const CraneGame = ({ onGameOver }) => {
  const [craneX, setCraneX] = useState(30);
  const [armLength, setArmLength] = useState(40);
  const [isDropping, setIsDropping] = useState(false);
  const [prizes, setPrizes] = useState([
    { x: 30, icon: '🧸', caught: false },
    { x: 90, icon: '🎁', caught: false },
    { x: 170, icon: '🐻', caught: false },
    { x: 240, icon: '🍩', caught: false },
  ]);
  const [message, setMessage] = useState('左右ボタンでクレーンを動かそう！');
  const [score, setScore] = useState(0);
  const [gameEnd, setGameEnd] = useState(false);

  const moveCrane = dir => {
    if (isDropping || gameEnd) return;
    setCraneX(x => {
      let nx = x + dir * 60;
      if (nx < 0) nx = 0;
      if (nx > 280) nx = 280;
      return nx;
    });
  };

  const dropCrane = () => {
    if (isDropping || gameEnd) return;
    setIsDropping(true);
    setMessage('クレーンを下ろしています...');
    let len = 40;
    const dropInterval = setInterval(() => {
      len += 10;
      setArmLength(len);
      if (len >= 320) {
        clearInterval(dropInterval);
        checkCatch(len);
      }
    }, 30);
  };

  const checkCatch = (len) => {
    // クレーンの中心座標
    const craneCenter = craneX + 20;
    let caught = false;
    setPrizes(prizes => prizes.map(prize => {
      if (!prize.caught && Math.abs(prize.x + 18 - craneCenter) < 24) {
        caught = true;
        setMessage('ゲット！');
        setScore(s => s + 1);
        return { ...prize, caught: true };
      }
      return prize;
    }));
    setTimeout(() => {
      setArmLength(40);
      setIsDropping(false);
      if (caught) {
        setMessage('もう一度チャレンジ！');
      } else {
        setMessage('残念...');
      }
      // 全部取ったら終了
      setTimeout(() => {
        if (prizes.filter(p => !p.caught).length === (caught ? 1 : 0)) {
          setGameEnd(true);
          setMessage(`ゲームクリア！スコア: ${score + (caught ? 1 : 0)}`);
          if (onGameOver) onGameOver(score + (caught ? 1 : 0));
        }
      }, 800);
    }, 600);
  };

  const resetGame = () => {
    setCraneX(30);
    setArmLength(40);
    setIsDropping(false);
    setPrizes([
      { x: 30, icon: '🧸', caught: false },
      { x: 90, icon: '🎁', caught: false },
      { x: 170, icon: '🐻', caught: false },
      { x: 240, icon: '🍩', caught: false },
    ]);
    setMessage('左右ボタンでクレーンを動かそう！');
    setScore(0);
    setGameEnd(false);
  };

  return (
    <div>
      <GameArea>
        <Crane x={craneX}>
          <CraneArm armLength={armLength} />
          <CraneHead />
        </Crane>
        {prizes.map((prize, i) =>
          !prize.caught && (
            <Prize key={i} x={prize.x}>{prize.icon}</Prize>
          )
        )}
      </GameArea>
      <Info>{message}</Info>
      <Info>スコア: {score}</Info>
      <ButtonBar>
        <button onClick={() => moveCrane(-1)} disabled={isDropping || gameEnd}>←</button>
        <button onClick={dropCrane} disabled={isDropping || gameEnd}>落とす</button>
        <button onClick={() => moveCrane(1)} disabled={isDropping || gameEnd}>→</button>
        <button onClick={resetGame}>リトライ</button>
      </ButtonBar>
    </div>
  );
};

export default CraneGame; 