import React, { useState } from 'react';
import styled from 'styled-components';
import { BackButton } from '../components/commonStyles';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 40px);
  grid-template-rows: repeat(5, 40px);
  gap: 4px;
  margin: 20px 0;
`;

const Cell = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ owner, resource }) =>
    owner === 'player1' ? '#e94560' : owner === 'player2' ? '#0099ff' : resource ? '#ffe066' : '#444'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  cursor: ${({ selectable }) => (selectable ? 'pointer' : 'default')};
  border: ${({ selectable }) => (selectable ? '2px solid #fff' : 'none')};
`;

const Stats = styled.div`
  color: white;
  margin-bottom: 10px;
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

const initialGrid = () => {
  // 5x5 grid, center is neutral, 2 corners are player1, 2 corners are player2, 3 random resources
  const grid = Array(5).fill().map(() => Array(5).fill({ owner: null, resource: false }));
  grid[0][0] = { owner: 'player1', resource: false };
  grid[4][4] = { owner: 'player1', resource: false };
  grid[0][4] = { owner: 'player2', resource: false };
  grid[4][0] = { owner: 'player2', resource: false };
  // Place 3 resources randomly
  let placed = 0;
  while (placed < 3) {
    const x = Math.floor(Math.random() * 5);
    const y = Math.floor(Math.random() * 5);
    if (!grid[y][x].owner && !grid[y][x].resource) {
      grid[y][x] = { owner: null, resource: true };
      placed++;
    }
  }
  return grid;
};

const StrategyGame = ({ onGameOver, onBack }) => {
  const [grid, setGrid] = useState(initialGrid());
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [resources, setResources] = useState({ player1: 0, player2: 0 });
  const [turn, setTurn] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // 隣接セルを取得
  const getSelectableCells = () => {
    let selectable = [];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        if (grid[y][x].owner === currentPlayer) {
          // 上下左右
          [[0,1],[1,0],[0,-1],[-1,0]].forEach(([dx,dy]) => {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5) {
              if (!grid[ny][nx].owner || grid[ny][nx].owner !== currentPlayer) {
                selectable.push([nx, ny]);
              }
            }
          });
        }
      }
    }
    // 重複除去
    return selectable.filter((v,i,a) => a.findIndex(t => t[0]===v[0]&&t[1]===v[1])===i);
  };

  const selectableCells = getSelectableCells();

  // セルをクリックしたときの処理
  const handleCellClick = (x, y) => {
    if (gameOver) return;
    if (!selectableCells.some(([sx, sy]) => sx === x && sy === y)) return;
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    let newResources = { ...resources };
    // 資源マスなら資源獲得
    if (newGrid[y][x].resource) {
      newResources[currentPlayer] += 2;
      newGrid[y][x].resource = false;
    }
    // 相手の陣地なら1点奪う
    if (newGrid[y][x].owner && newGrid[y][x].owner !== currentPlayer) {
      newResources[currentPlayer] += 1;
      newResources[newGrid[y][x].owner] = Math.max(0, newResources[newGrid[y][x].owner] - 1);
    }
    // 陣地拡大
    newGrid[y][x].owner = currentPlayer;
    setGrid(newGrid);
    setResources(newResources);
    // ターン切り替え
    if (turn >= 20) {
      setGameOver(true);
      if (newResources.player1 > newResources.player2) setWinner('プレイヤー1');
      else if (newResources.player2 > newResources.player1) setWinner('プレイヤー2');
      else setWinner('引き分け');
      setTimeout(() => onGameOver(Math.max(newResources.player1, newResources.player2)), 1000);
    } else {
      setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
      setTurn(turn + 1);
    }
  };

  const handleRestart = () => {
    setGrid(initialGrid());
    setResources({ player1: 0, player2: 0 });
    setCurrentPlayer('player1');
    setTurn(1);
    setGameOver(false);
    setWinner(null);
  };

  const handleExit = () => {
    onGameOver(0);
  };

  return (
    <GameContainer>
      <Stats>
        <div>ターン: {turn} / 20</div>
        <div style={{ color: '#e94560' }}>プレイヤー1: {resources.player1}点</div>
        <div style={{ color: '#0099ff' }}>プレイヤー2: {resources.player2}点</div>
        <div>現在のターン: {currentPlayer === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}</div>
      </Stats>
      <Grid>
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={x + '-' + y}
              owner={cell.owner}
              resource={cell.resource}
              selectable={selectableCells.some(([sx, sy]) => sx === x && sy === y) && !gameOver}
              onClick={() => handleCellClick(x, y)}
            >
              {cell.resource ? '★' : ''}
            </Cell>
          ))
        )}
      </Grid>
      {gameOver && (
        <GameOver>
          <h2>ゲーム終了！</h2>
          <p>プレイヤー1: {resources.player1}点</p>
          <p>プレイヤー2: {resources.player2}点</p>
          <p>勝者: {winner}</p>
          <Button onClick={handleRestart}>もう一度プレイ</Button>
          <Button onClick={handleExit}>終了</Button>
        </GameOver>
      )}
      <BackButton onClick={onBack}>ホームに戻る</BackButton>
    </GameContainer>
  );
};

export default StrategyGame; 