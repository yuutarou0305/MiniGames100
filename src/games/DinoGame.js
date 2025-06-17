import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const GameArea = styled.div`
  width: 600px;
  height: 200px;
  background: #f7fbff;
  border: 2px solid #174ea6;
  border-radius: 12px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

const Dino = styled.div`
  position: absolute;
  left: 40px;
  bottom: ${props => props.y}px;
  width: 40px;
  height: 40px;
  background: #444;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 2rem;
`;

const Obstacle = styled.div`
  position: absolute;
  bottom: 0;
  left: ${props => props.x}px;
  width: 20px;
  height: 40px;
  background: #2ecc40;
  border-radius: 4px;
`;

const Ground = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 8px;
  background: #aaa;
`;

const Info = styled.div`
  text-align: center;
  margin: 12px 0;
`;

const ButtonBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
`;

const DinoGame = ({ onGameOver }) => {
  const [dinoY, setDinoY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const jumpRef = useRef();
  const gameLoopRef = useRef();

  // ジャンプ処理（1回だけ、より高く・長く）
  const jump = () => {
    if (isJumping || gameOver) return;
    setIsJumping(true);
    let t = 0;
    jumpRef.current = setInterval(() => {
      t += 1;
      // 少しだけジャンプ力を減らす: -0.5 * t^2 + 16 * t
      const y = Math.max(0, -0.5 * t * t + 16 * t);
      setDinoY(y);
      if (y <= 0) {
        clearInterval(jumpRef.current);
        setIsJumping(false);
        setDinoY(0);
      }
    }, 16);
  };

  // スペースキーでジャンプ
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') jump();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // ゲームループ
  useEffect(() => {
    if (gameOver) return;
    gameLoopRef.current = setInterval(() => {
      setObstacles(obs => {
        // 障害物を左に動かす
        const moved = obs.map(o => ({ ...o, x: o.x - 6 }));
        // 画面外の障害物を除去
        const filtered = moved.filter(o => o.x > -20);
        // 新しい障害物を追加
        if (Math.random() < 0.03) {
          filtered.push({ x: 600 + Math.random() * 100, id: Date.now() + Math.random() });
        }
        return filtered;
      });
      setScore(s => s + 1);
    }, 30);
    return () => clearInterval(gameLoopRef.current);
  }, [gameOver]);

  // 衝突判定
  useEffect(() => {
    obstacles.forEach(o => {
      if (
        o.x < 80 && o.x + 20 > 40 &&
        dinoY < 40
      ) {
        setGameOver(true);
        if (onGameOver) onGameOver(score);
      }
    });
  }, [obstacles, dinoY, score, onGameOver]);

  // ゲームリセット
  const resetGame = () => {
    setDinoY(0);
    setIsJumping(false);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div>
      <GameArea>
        <Dino y={dinoY}>🦖</Dino>
        {obstacles.map(o => (
          <Obstacle key={o.id} x={o.x} />
        ))}
        <Ground />
      </GameArea>
      <Info>スコア: {score}</Info>
      {gameOver && <Info>ゲームオーバー！</Info>}
      <ButtonBar>
        <button onClick={jump} disabled={isJumping || gameOver}>ジャンプ</button>
        <button onClick={resetGame}>リトライ</button>
      </ButtonBar>
    </div>
  );
};

export default DinoGame; 