import React, { useState } from 'react';
import styled from 'styled-components';

const BOARD_SIZE = 9;
const PIECES = {
  FU: '歩',
  KIN: '金',
  OU: '王',
};

const initialBoard = () => {
  // 先手: 1段目に王、2段目に金、3段目に歩
  // 後手: 9段目に王、8段目に金、7段目に歩
  const board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
  board[0][4] = { type: 'OU', owner: '先手' };
  board[1][3] = { type: 'KIN', owner: '先手' };
  board[1][5] = { type: 'KIN', owner: '先手' };
  for (let i = 0; i < BOARD_SIZE; i++) board[2][i] = { type: 'FU', owner: '先手' };
  board[8][4] = { type: 'OU', owner: '後手' };
  board[7][3] = { type: 'KIN', owner: '後手' };
  board[7][5] = { type: 'KIN', owner: '後手' };
  for (let i = 0; i < BOARD_SIZE; i++) board[6][i] = { type: 'FU', owner: '後手' };
  return board;
};

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #f5deb3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 40px);
  grid-template-rows: repeat(9, 40px);
  gap: 2px;
  background: #deb887;
  padding: 10px;
  border-radius: 10px;
`;

const Cell = styled.div`
  width: 40px;
  height: 40px;
  background: #fff8dc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ selectable }) => (selectable ? 'pointer' : 'default')};
  border: ${({ selectable }) => (selectable ? '2px solid #e94560' : '1px solid #b8860b')};
  font-size: 20px;
  font-weight: bold;
  color: #222;
`;

const Piece = styled.div`
  writing-mode: vertical-rl;
  font-size: 20px;
  color: ${({ owner }) => (owner === '先手' ? '#e94560' : '#222')};
`;

const Stats = styled.div`
  color: #222;
  font-size: 20px;
  margin: 10px;
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

function getMovableCells(board, x, y, current) {
  const piece = board[y][x];
  if (!piece || piece.owner !== current) return [];
  const moves = [];
  const dir = current === '先手' ? 1 : -1;
  if (piece.type === 'FU') {
    const ny = y + dir;
    if (ny >= 0 && ny < BOARD_SIZE && !board[ny][x]) moves.push([x, ny]);
  } else if (piece.type === 'KIN') {
    const kinMoves = [
      [0, dir], [1, 0], [-1, 0], [0, -dir], [1, dir], [-1, dir]
    ];
    for (const [dx, dy] of kinMoves) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
        if (!board[ny][nx] || board[ny][nx].owner !== current) moves.push([nx, ny]);
      }
    }
  } else if (piece.type === 'OU') {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
          if (!board[ny][nx] || board[ny][nx].owner !== current) moves.push([nx, ny]);
        }
      }
    }
  }
  return moves;
}

const ShogiGame = ({ onGameOver }) => {
  const [board, setBoard] = useState(initialBoard());
  const [current, setCurrent] = useState('先手');
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const handleCellClick = (x, y) => {
    if (gameOver) return;
    if (selected) {
      const [sx, sy] = selected;
      const moves = getMovableCells(board, sx, sy, current);
      if (moves.some(([mx, my]) => mx === x && my === y)) {
        const newBoard = board.map(row => [...row]);
        // 王を取ったら勝ち
        if (newBoard[y][x] && newBoard[y][x].type === 'OU') {
          setGameOver(true);
          setWinner(current);
          setTimeout(() => onGameOver(10), 1000);
        }
        newBoard[y][x] = newBoard[sy][sx];
        newBoard[sy][sx] = null;
        setBoard(newBoard);
        setSelected(null);
        setCurrent(current === '先手' ? '後手' : '先手');
      } else {
        setSelected(null);
      }
    } else if (board[y][x] && board[y][x].owner === current) {
      setSelected([x, y]);
    }
  };

  const handleRestart = () => {
    setBoard(initialBoard());
    setCurrent('先手');
    setSelected(null);
    setGameOver(false);
    setWinner(null);
  };

  const handleExit = () => {
    onGameOver(0);
  };

  return (
    <GameContainer>
      <Stats>
        <div>現在の手番: {current}</div>
      </Stats>
      <Board>
        {board.map((row, y) =>
          row.map((cell, x) => {
            const selectable = selected
              ? getMovableCells(board, selected[0], selected[1], current).some(([mx, my]) => mx === x && my === y)
              : board[y][x] && board[y][x].owner === current;
            return (
              <Cell
                key={x + '-' + y}
                selectable={selectable && !gameOver}
                onClick={() => handleCellClick(x, y)}
                style={{ background: selected && selected[0] === x && selected[1] === y ? '#ffe066' : undefined }}
              >
                {cell && <Piece owner={cell.owner}>{PIECES[cell.type]}</Piece>}
              </Cell>
            );
          })
        )}
      </Board>
      {gameOver && (
        <GameOver>
          <h2>ゲーム終了！</h2>
          <p>{winner}の勝ち！</p>
          <Button onClick={handleRestart}>もう一度プレイ</Button>
          <Button onClick={handleExit}>終了</Button>
        </GameOver>
      )}
    </GameContainer>
  );
};

export default ShogiGame; 