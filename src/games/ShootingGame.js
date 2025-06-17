import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #000;
  position: relative;
  overflow: hidden;
`;

const Player = styled.div`
  width: 50px;
  height: 50px;
  background: #0ff;
  position: absolute;
  bottom: 50px;
  left: ${props => props.x}px;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transition: left 0.1s linear;
`;

const Bullet = styled.div`
  width: 4px;
  height: 15px;
  background: #fff;
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
`;

const Enemy = styled.div`
  width: 30px;
  height: 30px;
  background: ${props => props.type === 'boss' ? '#f00' : '#f0f'};
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(180deg);
`;

const Stats = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #fff;
  font-size: 20px;
  font-family: 'Arial', sans-serif;
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
  color: #fff;
`;

const Button = styled.button`
  background: #0ff;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  color: #000;

  &:hover {
    background: #0dd;
  }
`;

const ShootingGame = ({ onGameOver, onScoreUpdate }) => {
  const [playerX, setPlayerX] = useState(400);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);

  // プレイヤーの移動
  const handleMouseMove = useCallback((e) => {
    if (!gameStarted || gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 25;
    if (x >= 0 && x <= rect.width - 50) {
      setPlayerX(x);
    }
  }, [gameStarted, gameOver]);

  // 弾の発射
  const handleClick = useCallback(() => {
    if (!gameStarted || gameOver) return;
    setBullets(prev => [...prev, { x: playerX + 23, y: window.innerHeight - 100 }]);
  }, [gameStarted, gameOver, playerX]);

  // 敵の生成
  const generateEnemy = useCallback(() => {
    if (!gameStarted || gameOver) return;
    const x = Math.random() * (window.innerWidth - 30);
    const type = Math.random() < 0.1 ? 'boss' : 'normal';
    setEnemies(prev => [...prev, { x, y: -30, type }]);
  }, [gameStarted, gameOver]);

  // ゲームの更新
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // 弾の移動
      setBullets(prev => prev.filter(bullet => {
        if (bullet.y < -15) return false;
        bullet.y -= 10;
        return true;
      }));

      // 敵の移動
      setEnemies(prev => prev.filter(enemy => {
        if (enemy.y > window.innerHeight) {
          setLives(l => l - 1);
          return false;
        }
        enemy.y += enemy.type === 'boss' ? 1 : 2;
        return true;
      }));

      // 衝突判定
      setEnemies(prev => {
        const newEnemies = [...prev];
        setBullets(bullets => {
          const newBullets = [...bullets];
          for (let i = newEnemies.length - 1; i >= 0; i--) {
            for (let j = newBullets.length - 1; j >= 0; j--) {
              const enemy = newEnemies[i];
              const bullet = newBullets[j];
              if (
                bullet.x >= enemy.x &&
                bullet.x <= enemy.x + 30 &&
                bullet.y >= enemy.y &&
                bullet.y <= enemy.y + 30
              ) {
                newEnemies.splice(i, 1);
                newBullets.splice(j, 1);
                setScore(s => s + (enemy.type === 'boss' ? 50 : 10));
                break;
              }
            }
          }
          return newBullets;
        });
        return newEnemies;
      });

      // レベルアップ
      if (score >= level * 100) {
        setLevel(l => l + 1);
      }
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, score, level]);

  // 敵の生成タイマー
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const enemyTimer = setInterval(generateEnemy, 1000 / level);
    return () => clearInterval(enemyTimer);
  }, [gameStarted, gameOver, level, generateEnemy]);

  // ゲームオーバー判定
  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
      onGameOver(score);
    }
  }, [lives, score, onGameOver]);

  const handleStart = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLives(3);
    setBullets([]);
    setEnemies([]);
  };

  const handleExit = () => {
    onGameOver(0);
  };

  return (
    <GameContainer onMouseMove={handleMouseMove} onClick={handleClick}>
      {!gameStarted ? (
        <GameOver>
          <h2>シューティングゲーム</h2>
          <p>マウスで移動、クリックで発射</p>
          <p>敵を倒してスコアを稼ごう！</p>
          <Button onClick={handleStart}>スタート</Button>
        </GameOver>
      ) : gameOver ? (
        <GameOver>
          <h2>ゲームオーバー</h2>
          <p>スコア: {score}</p>
          <p>レベル: {level}</p>
          <Button onClick={handleStart}>もう一度プレイ</Button>
          <Button onClick={handleExit}>終了</Button>
        </GameOver>
      ) : (
        <>
          <Player x={playerX} />
          {bullets.map((bullet, i) => (
            <Bullet key={i} x={bullet.x} y={bullet.y} />
          ))}
          {enemies.map((enemy, i) => (
            <Enemy key={i} x={enemy.x} y={enemy.y} type={enemy.type} />
          ))}
          <Stats>
            <div>スコア: {score}</div>
            <div>レベル: {level}</div>
            <div>ライフ: {'❤️'.repeat(lives)}</div>
          </Stats>
        </>
      )}
    </GameContainer>
  );
};

export default ShootingGame; 