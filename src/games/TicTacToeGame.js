import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { BackButton } from '../components/commonStyles';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  background: rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 10px;
`;

const Cell = styled.button`
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid #e94560;
  border-radius: 5px;
  font-size: 3rem;
  color: #111;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
`;

const Status = styled.div`
  font-size: 1.5rem;
  color: #111;
  text-align: center;
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

const Button = styled.button`
  background: #e94560;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #d13b54;
  }
`;

function TicTacToeGame({ onGameOver, onBack }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });

  const calculateWinner = useCallback((squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    if (squares.every(square => square !== null)) {
      return 'draw';
    }

    return null;
  }, []);

  const handleClick = useCallback((index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner !== 'draw') {
        setScore(prev => ({
          ...prev,
          [gameWinner]: prev[gameWinner] + 1
        }));
      }
    }
  }, [board, isXNext, winner, calculateWinner]);

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const handleExit = () => {
    onGameOver(Math.max(score.X, score.O) * 10);
  };

  const getStatus = () => {
    if (winner === 'draw') return '引き分けです！';
    if (winner) return `勝者: ${winner}`;
    return `次のプレイヤー: ${isXNext ? 'X' : 'O'}`;
  };

  return (
    <GameContainer>
      <Status>
        <div>X: {score.X} - O: {score.O}</div>
        <div>{getStatus()}</div>
      </Status>
      <Board>
        {board.map((cell, index) => (
          <Cell
            key={index}
            onClick={() => handleClick(index)}
            disabled={winner !== null}
          >
            {cell}
          </Cell>
        ))}
      </Board>
      {(winner || board.every(cell => cell !== null)) && (
        <GameOver>
          <h2>{winner === 'draw' ? '引き分け！' : `勝者: ${winner}`}</h2>
          <Button onClick={handleRestart}>もう一度プレイ</Button>
          <Button onClick={handleExit} style={{ marginLeft: '10px' }}>終了</Button>
        </GameOver>
      )}
      <BackButton onClick={onBack}>ホームに戻る</BackButton>
    </GameContainer>
  );
}

export default TicTacToeGame; 