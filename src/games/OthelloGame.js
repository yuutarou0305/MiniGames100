import React, { useState } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #111;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 40px);
  grid-template-rows: repeat(8, 40px);
  gap: 2px;
  background: #006400;
  padding: 10px;
  border-radius: 10px;
  color: #111;
`;

const Cell = styled.div`
  width: 40px;
  height: 40px;
  background: #228B22;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ selectable }) => (selectable ? 'pointer' : 'default')};
  border: ${({ selectable }) => (selectable ? '2px solid #fff' : 'none')};
  color: #111;
`;

const Stone = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ color }) => (color === 'black' ? '#222' : '#fff')};
  border: 2px solid #888;
  color: #111;
`;

const Stats = styled.div`
  color: #111;
  margin-bottom: 10px;
`;

const GameOver = styled.div`
  background: rgba(0,0,0,0.9);
  color: #111;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Button = styled.button`
  background: #228B22;
  color: #111;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin: 10px;
  font-size: 16px;
  cursor: pointer;
  &:hover { background: #44b244; }
`;

const directions = [
  [0, 1], [1, 0], [0, -1], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1]
];

function getInitialBoard() {
  const board = Array(8).fill().map(() => Array(8).fill(null));
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
  return board;
}

function getValidMoves(board, current) {
  const valid = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x]) continue;
      for (const [dx, dy] of directions) {
        let nx = x + dx, ny = y + dy, found = false;
        let count = 0;
        while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[ny][nx] && board[ny][nx] !== current) {
          nx += dx;
          ny += dy;
          count++;
          found = true;
        }
        if (found && count > 0 && nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[ny][nx] === current) {
          valid.push([x, y]);
          break;
        }
      }
    }
  }
  return valid;
}

function flipStones(board, x, y, current) {
  const newBoard = board.map(row => [...row]);
  newBoard[y][x] = current;
  for (const [dx, dy] of directions) {
    let nx = x + dx, ny = y + dy;
    const toFlip = [];
    while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && newBoard[ny][nx] && newBoard[ny][nx] !== current) {
      toFlip.push([nx, ny]);
      nx += dx;
      ny += dy;
    }
    if (toFlip.length > 0 && nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && newBoard[ny][nx] === current) {
      for (const [fx, fy] of toFlip) {
        newBoard[fy][fx] = current;
      }
    }
  }
  return newBoard;
}

const OthelloGame = ({ onGameOver, onBack }) => {
  const [board, setBoard] = useState(getInitialBoard());
  const [current, setCurrent] = useState('black');
  const [gameOver, setGameOver] = useState(false);
  const [passCount, setPassCount] = useState(0);

  const validMoves = getValidMoves(board, current);

  const countStones = (color) =>
    board.flat().filter(s => s === color).length;

  const handleCellClick = (x, y) => {
    if (gameOver) return;
    if (!validMoves.some(([vx, vy]) => vx === x && vy === y)) return;
    const newBoard = flipStones(board, x, y, current);
    setBoard(newBoard);
    setCurrent(current === 'black' ? 'white' : 'black');
    setPassCount(0);
  };

  // パス処理
  const handlePass = () => {
    if (gameOver) return;
    setCurrent(current === 'black' ? 'white' : 'black');
    setPassCount(passCount + 1);
  };

  // 勝敗判定
  React.useEffect(() => {
    const blackMoves = getValidMoves(board, 'black');
    const whiteMoves = getValidMoves(board, 'white');
    if (blackMoves.length === 0 && whiteMoves.length === 0) {
      setGameOver(true);
      setTimeout(() => {
        const b = countStones('black');
        const w = countStones('white');
        onGameOver(b > w ? b : w);
      }, 1000);
    }
    if (passCount >= 2) {
      setGameOver(true);
      setTimeout(() => {
        const b = countStones('black');
        const w = countStones('white');
        onGameOver(b > w ? b : w);
      }, 1000);
    }
  }, [board, passCount, onGameOver]);

  const handleRestart = () => {
    setBoard(getInitialBoard());
    setCurrent('black');
    setGameOver(false);
    setPassCount(0);
  };

  const handleExit = () => {
    onGameOver(0);
  };

  const blackCount = countStones('black');
  const whiteCount = countStones('white');

  return (
    <GameContainer>
      <Stats>
        <div>黒: {blackCount}　白: {whiteCount}</div>
        <div>現在の手番: {current === 'black' ? '黒' : '白'}</div>
      </Stats>
      <Board>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={x + '-' + y}
              selectable={validMoves.some(([vx, vy]) => vx === x && vy === y) && !gameOver}
              onClick={() => handleCellClick(x, y)}
            >
              {cell && <Stone color={cell} />}
            </Cell>
          ))
        )}
      </Board>
      <div style={{ margin: '10px' }}>
        {validMoves.length === 0 && !gameOver && (
          <Button onClick={handlePass}>パス</Button>
        )}
      </div>
      {gameOver && (
        <GameOver>
          <h2>ゲーム終了！</h2>
          <p>黒: {blackCount}　白: {whiteCount}</p>
          <p>
            {blackCount > whiteCount
              ? '黒の勝ち！'
              : blackCount < whiteCount
              ? '白の勝ち！'
              : '引き分け！'}
          </p>
          <Button onClick={handleRestart}>もう一度プレイ</Button>
          <Button onClick={handleExit}>終了</Button>
        </GameOver>
      )}
      {onBack && (
        <Button onClick={onBack}>ホームに戻る</Button>
      )}
    </GameContainer>
  );
};

export default OthelloGame; 