import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const WIDTH = 600;
const HEIGHT = 400;
const BAR_SIZE = 20;

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GameArea = styled.div`
  position: relative;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  background: #fff;
  border: 4px solid #e94560;
  border-radius: 10px;
  margin: 20px 0;
`;

const Bar = styled.div`
  position: absolute;
  width: ${BAR_SIZE}px;
  height: ${BAR_SIZE}px;
  background: #e94560;
  border-radius: 50%;
  pointer-events: none;
`;

const Wall = styled.div`
  position: absolute;
  background: #222;
  border-radius: 4px;
`;

const Start = styled.div`
  position: absolute;
  left: 10px;
  top: ${HEIGHT / 2 - 30}px;
  width: 40px;
  height: 60px;
  background: #44b244;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
`;

const Goal = styled.div`
  position: absolute;
  right: 10px;
  top: ${HEIGHT / 2 - 30}px;
  width: 40px;
  height: 60px;
  background: #ffe066;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
`;

const GameOver = styled.div`
  background: rgba(0,0,0,0.9);
  color: #fff;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: auto;
`;

const Button = styled.button`
  background: #e94560;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin: 10px;
  font-size: 16px;
  cursor: pointer;
  &:hover { background: #ff6b81; }
`;

// クリア可能なジグザグ通路を確保した壁配置
const walls = [
  // 上部と下部の壁
  [0, 0, 600, 40],
  [0, 360, 600, 40],
  // 左側の縦壁
  [60, 40, 20, 120],
  [60, 240, 20, 120],
  // ジグザグ通路の壁
  [140, 40, 20, 200],
  [140, 280, 20, 80],
  [220, 120, 20, 200],
  [220, 40, 20, 40],
  [300, 40, 20, 200],
  [300, 280, 20, 80],
  [380, 120, 20, 200],
  [380, 40, 20, 40],
  [460, 40, 20, 200],
  [460, 280, 20, 80],
  [540, 120, 20, 200],
  [540, 40, 20, 40],
];

const IrairaGame = ({ onGameOver }) => {
  const [barPos, setBarPos] = useState({ x: 30, y: HEIGHT / 2 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [clear, setClear] = useState(false);
  const [dragging, setDragging] = useState(false);
  const areaRef = useRef();

  const handleMouseMove = (e) => {
    if (!gameStarted || gameOver || clear || !dragging) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBarPos({ x, y });
    // 壁判定
    for (const [wx, wy, ww, wh] of walls) {
      if (
        x + BAR_SIZE / 2 > wx &&
        x - BAR_SIZE / 2 < wx + ww &&
        y + BAR_SIZE / 2 > wy &&
        y - BAR_SIZE / 2 < wy + wh
      ) {
        setGameOver(true);
        setDragging(false);
        setTimeout(() => onGameOver(0), 1000);
        return;
      }
    }
    // ゴール判定
    if (
      x > WIDTH - 50 &&
      y > HEIGHT / 2 - 30 &&
      y < HEIGHT / 2 + 30
    ) {
      setClear(true);
      setDragging(false);
      setTimeout(() => onGameOver(10), 1000);
    }
  };

  const handleStart = () => {
    setBarPos({ x: 30, y: HEIGHT / 2 });
    setGameStarted(true);
    setGameOver(false);
    setClear(false);
    setDragging(false);
  };

  const handleExit = () => {
    onGameOver(0);
  };

  // 丸をクリックしたらドラッグ開始
  const handleBarMouseDown = (e) => {
    if (!gameStarted || gameOver || clear) return;
    setDragging(true);
    e.stopPropagation();
  };

  // エリア外クリックやマウスアップでドラッグ終了
  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <GameContainer>
      <div style={{ color: '#fff', fontSize: '24px', margin: '10px' }}>赤い丸をクリックしてからゴールまで進もう！</div>
      <GameArea
        ref={areaRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ pointerEvents: !gameStarted || gameOver || clear ? 'none' : 'auto' }}
      >
        <Start>スタート</Start>
        <Goal>ゴール</Goal>
        {walls.map(([x, y, w, h], i) => (
          <Wall key={i} style={{ left: x, top: y, width: w, height: h }} />
        ))}
        <Bar
          style={{ left: barPos.x - BAR_SIZE / 2, top: barPos.y - BAR_SIZE / 2, cursor: 'pointer', pointerEvents: 'auto' }}
          onMouseDown={handleBarMouseDown}
        />
        {(!gameStarted || gameOver || clear) && (
          <GameOver>
            <h2>{clear ? 'クリア！' : gameOver ? 'ゲームオーバー！' : 'イライラ棒'}</h2>
            <Button onClick={handleStart}>スタート</Button>
            <Button onClick={handleExit}>終了</Button>
          </GameOver>
        )}
      </GameArea>
    </GameContainer>
  );
};

export default IrairaGame; 