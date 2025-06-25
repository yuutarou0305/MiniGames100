import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { BackButton } from '../components/commonStyles';

const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameContainer = styled.div`
  width: 800px;
  height: 600px;
  background: #1a1a2e;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

const Player = styled.div`
  width: 40px;
  height: 40px;
  background: #e94560;
  position: absolute;
  border-radius: 50%;
  transition: all 0.1s ease;
`;

const Enemy = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  border-radius: ${props => {
    switch (props.type) {
      case 'chaser':
      case 'zigzag':
      case 'bomber':
        return '5px';
      case 'ghost':
        return '50%';
      case 'spinner':
        return '0';
      case 'splitter':
        return '10px';
      default:
        return '5px';
    }
  }};
  background: ${props => {
    switch (props.type) {
      case 'chaser':
        return '#ff4d4d';
      case 'zigzag':
        return '#ff8c00';
      case 'bomber':
        return '#800000';
      case 'ghost':
        return 'rgba(0, 0, 0, 0.7)';
      case 'spinner':
        return '#4a90e2';
      case 'splitter':
        return '#9b59b6';
      default:
        return '#ff4d4d';
    }
  }};
  transform: ${props => props.type === 'spinner' ? `rotate(${props.angle}deg)` : 'none'};
  transition: ${props => props.type === 'ghost' ? 'opacity 0.3s ease' : 'none'};
  opacity: ${props => props.type === 'ghost' ? props.visible ? 1 : 0.3 : 1};
`;

const Coin = styled.div`
  width: 20px;
  height: 20px;
  background: #ffd700;
  position: absolute;
  border-radius: 50%;
`;

const Score = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const Timer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: ${props => props.time <= 10 ? '#ff4d4d' : 'white'};
  font-size: 24px;
  font-weight: bold;
  transition: color 0.3s ease;
`;

const GameOver = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  color: white;
`;

const Button = styled.button`
  background: #e94560;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: #ff6b81;
    transform: scale(1.05);
  }
`;

const ActionGame = ({ onGameOver, onBack }) => {
  const [player, setPlayer] = useState({ x: 400, y: 300 });
  const [enemies, setEnemies] = useState([]);
  const [coins, setCoins] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [keys, setKeys] = useState({});
  const [timeLeft, setTimeLeft] = useState(60); // 60秒の制限時間
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef(null);
  const enemySpawnerRef = useRef(null);

  // キー入力の処理
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };
    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // プレイヤーの移動
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const movePlayer = () => {
      setPlayer(prev => {
        let newX = prev.x;
        let newY = prev.y;
        const speed = 5;

        if (keys['ArrowLeft'] || keys['a']) newX = Math.max(20, newX - speed);
        if (keys['ArrowRight'] || keys['d']) newX = Math.min(760, newX + speed);
        if (keys['ArrowUp'] || keys['w']) newY = Math.max(20, newY - speed);
        if (keys['ArrowDown'] || keys['s']) newY = Math.min(560, newY + speed);

        return { x: newX, y: newY };
      });
    };

    gameLoopRef.current = setInterval(movePlayer, 16);
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [keys, gameStarted, gameOver]);

  // 敵の生成と移動
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnEnemy = () => {
      // 一度に2体の敵を生成
      for (let i = 0; i < 2; i++) {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        // 敵の種類を確実にランダムに選択
        const enemyTypes = ['chaser', 'zigzag', 'bomber', 'ghost', 'spinner', 'splitter', 'speedster', 'teleporter'];
        const randomIndex = Math.floor(Math.random() * enemyTypes.length);
        const type = enemyTypes[randomIndex];

        // 画面外からの出現位置を調整
        switch (side) {
          case 0: // 上
            x = Math.random() * 760;
            y = -30;
            break;
          case 1: // 右
            x = 830;
            y = Math.random() * 560;
            break;
          case 2: // 下
            x = Math.random() * 760;
            y = 630;
            break;
          case 3: // 左
            x = -30;
            y = Math.random() * 560;
            break;
          default:
            x = Math.random() * 760;
            y = -30;
        }

        // 敵の生成を確実に行う
        const newEnemy = {
          x,
          y,
          id: Date.now() + Math.random() + i,
          type,
          angle: 0,
          visible: true,
          lastSplit: 0,
          splitCount: 0,
          lastTeleport: 0
        };

        console.log('Spawning enemy:', type);
        setEnemies(prev => [...prev, newEnemy]);
      }
    };

    // 敵の移動処理
    const moveEnemies = () => {
      setEnemies(prev => {
        return prev.map(enemy => {
          const dx = player.x - enemy.x;
          const dy = player.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          let newX = enemy.x;
          let newY = enemy.y;
          let newAngle = enemy.angle;
          let newVisible = enemy.visible;
          let newLastSplit = enemy.lastSplit;
          let newSplitCount = enemy.splitCount;
          let newLastTeleport = enemy.lastTeleport;

          // 敵の種類に応じた移動処理
          switch (enemy.type) {
            case 'chaser':
              newX += (dx / distance) * 3;
              newY += (dy / distance) * 3;
              break;
            case 'zigzag':
              newAngle += 0.1;
              newX += (dx / distance) * 2.5 + Math.sin(newAngle) * 4;
              newY += (dy / distance) * 2.5 + Math.cos(newAngle) * 4;
              break;
            case 'bomber':
              if (distance < 200) {
                newX += (dx / distance) * 4;
                newY += (dy / distance) * 4;
              } else {
                newX += (dx / distance) * 2;
                newY += (dy / distance) * 2;
              }
              break;
            case 'ghost':
              newX += (dx / distance) * 2.5;
              newY += (dy / distance) * 2.5;
              newVisible = Math.random() > 0.5;
              break;
            case 'spinner':
              newAngle += 5;
              newX += (dx / distance) * 2.5;
              newY += (dy / distance) * 2.5;
              break;
            case 'splitter':
              newX += (dx / distance) * 3;
              newY += (dy / distance) * 3;
              if (Date.now() - newLastSplit > 3000 && newSplitCount < 2) {
                newLastSplit = Date.now();
                newSplitCount++;
                const splitEnemy = {
                  x: enemy.x,
                  y: enemy.y,
                  id: Date.now() + Math.random(),
                  type: 'splitter',
                  angle: 0,
                  visible: true,
                  lastSplit: Date.now(),
                  splitCount: newSplitCount
                };
                setEnemies(prev => [...prev, splitEnemy]);
              }
              break;
            case 'speedster':
              // 超高速で移動する敵
              newX += (dx / distance) * 5;
              newY += (dy / distance) * 5;
              break;
            case 'teleporter':
              // テレポートする敵
              if (Date.now() - newLastTeleport > 2000) {
                newLastTeleport = Date.now();
                // プレイヤーの近くにランダムにテレポート
                const angle = Math.random() * Math.PI * 2;
                const teleportDistance = 100 + Math.random() * 100;
                newX = player.x + Math.cos(angle) * teleportDistance;
                newY = player.y + Math.sin(angle) * teleportDistance;
              } else {
                newX += (dx / distance) * 2;
                newY += (dy / distance) * 2;
              }
              break;
            default:
              newX += (dx / distance) * 3;
              newY += (dy / distance) * 3;
          }

          return {
            ...enemy,
            x: newX,
            y: newY,
            angle: newAngle,
            visible: newVisible,
            lastSplit: newLastSplit,
            splitCount: newSplitCount,
            lastTeleport: newLastTeleport
          };
        });
      });
    };

    // 敵の生成を開始（より頻繁に生成）
    enemySpawnerRef.current = setInterval(spawnEnemy, 600);
    const enemyMover = setInterval(moveEnemies, 16);

    return () => {
      if (enemySpawnerRef.current) {
        clearInterval(enemySpawnerRef.current);
      }
      clearInterval(enemyMover);
    };
  }, [player, gameStarted, gameOver]);

  // コインの生成
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnCoin = () => {
      const x = Math.random() * 760;
      const y = Math.random() * 560;
      setCoins(prev => [...prev, { x, y, id: Date.now() }]);
    };

    const coinSpawner = setInterval(spawnCoin, 3000);
    return () => clearInterval(coinSpawner);
  }, [gameStarted, gameOver]);

  // 衝突判定
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const checkCollisions = () => {
      enemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        let collisionDistance = 35;

        switch (enemy.type) {
          case 'bomber':
            collisionDistance = 45;
            break;
          case 'ghost':
            if (!enemy.visible) return;
            collisionDistance = 30;
            break;
          case 'spinner':
            collisionDistance = 40;
            break;
          case 'splitter':
            collisionDistance = 35;
            break;
          default:
            collisionDistance = 35;
        }

        if (distance < collisionDistance) {
          setGameOver(true);
        }
      });

      setCoins(prev => {
        const newCoins = prev.filter(coin => {
          const dx = player.x - coin.x;
          const dy = player.y - coin.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 30) {
            setScore(s => s + 10);
            return false;
          }
          return true;
        });
        return newCoins;
      });
    };

    const collisionChecker = setInterval(checkCollisions, 16);
    return () => clearInterval(collisionChecker);
  }, [player, enemies, gameStarted, gameOver]);

  // タイマーの処理
  useEffect(() => {
    if (!gameStarted || gameOver) return;

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
  }, [gameStarted, gameOver]);

  const handleStart = () => {
    setGameStarted(true);
    // 最初の敵を即座に生成（3体）
    const initialEnemies = [];
    const enemyTypes = ['chaser', 'zigzag', 'bomber', 'ghost', 'spinner', 'splitter', 'speedster', 'teleporter'];
    
    for (let i = 0; i < 3; i++) {
      const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      initialEnemies.push({
        x: Math.random() * 760,
        y: -30,
        id: Date.now() + i,
        type: randomType,
        angle: 0,
        visible: true,
        lastSplit: 0,
        splitCount: 0,
        lastTeleport: 0
      });
    }
    
    setEnemies(initialEnemies);
  };

  const handleRestart = () => {
    setPlayer({ x: 400, y: 300 });
    setEnemies([]);
    setCoins([]);
    setScore(0);
    setGameOver(false);
    setTimeLeft(60);
    setGameStarted(true);
    // 最初の敵を即座に生成（3体）
    const initialEnemies = [];
    const enemyTypes = ['chaser', 'zigzag', 'bomber', 'ghost', 'spinner', 'splitter', 'speedster', 'teleporter'];
    
    for (let i = 0; i < 3; i++) {
      const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      initialEnemies.push({
        x: Math.random() * 760,
        y: -30,
        id: Date.now() + i,
        type: randomType,
        angle: 0,
        visible: true,
        lastSplit: 0,
        splitCount: 0,
        lastTeleport: 0
      });
    }
    
    setEnemies(initialEnemies);
  };

  const handleExit = () => {
    onGameOver(score);
  };

  return (
    <GameWrapper>
      { !gameStarted ? (
        <GameContainer>
          <GameOver>
            <h2>アクションゲーム</h2>
            <p>矢印キーまたはWASDで移動</p>
            <p>敵を避けながらコインを集めよう！</p>
            <Button onClick={handleStart}>ゲーム開始</Button>
          </GameOver>
        </GameContainer>
      ) : (
      <GameContainer>
        <Score>スコア: {score}</Score>
        <Timer time={timeLeft}>残り時間: {timeLeft}秒</Timer>
        <Player style={{ left: player.x, top: player.y }} />
        {enemies.map(enemy => (
          <Enemy
            key={enemy.id}
            style={{ left: enemy.x, top: enemy.y }}
            type={enemy.type}
            angle={enemy.angle}
            visible={enemy.visible}
          />
        ))}
        {coins.map(coin => (
          <Coin key={coin.id} style={{ left: coin.x, top: coin.y }} />
        ))}
        {gameOver && (
          <GameOver>
            <h2>ゲームオーバー！</h2>
            <p>最終スコア: {score}</p>
            <Button onClick={handleRestart}>もう一度プレイ</Button>
            <Button onClick={handleExit}>終了</Button>
          </GameOver>
        )}
      </GameContainer>
      )}
      <BackButton onClick={onBack}>ホームに戻る</BackButton>
    </GameWrapper>
  );
};

export default ActionGame;