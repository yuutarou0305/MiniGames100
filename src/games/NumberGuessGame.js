import React, { useState } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #f7fbff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Stats = styled.div`
  color: #111;
  font-size: 22px;
  margin: 16px;
`;

const Input = styled.input`
  font-size: 22px;
  padding: 8px 16px;
  border: 2px solid #b3d8f7;
  border-radius: 6px;
  margin-right: 12px;
  outline: none;
`;

const Button = styled.button`
  background: #174ea6;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin: 10px;
  font-size: 18px;
  cursor: pointer;
  &:hover { background: #2196f3; }
`;

const GameOver = styled.div`
  background: rgba(0,0,0,0.85);
  color: #fff;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const NumberGuessGame = ({ onGameOver }) => {
  const [answer, setAnswer] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState('1〜100の数字を当ててください');
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const handleChange = (e) => {
    setGuess(e.target.value.replace(/[^0-9]/g, ''));
  };

  const handleGuess = () => {
    if (!guess) return;
    const num = parseInt(guess, 10);
    if (num < 1 || num > 100) {
      setHint('1〜100の数字を入力してください');
      return;
    }
    setTries(t => t + 1);
    if (num === answer) {
      setHint('正解！');
      setGameOver(true);
      setTimeout(() => onGameOver(100 - tries * 5), 1000);
    } else if (num < answer) {
      setHint('もっと大きい数字です');
    } else {
      setHint('もっと小さい数字です');
    }
    setGuess('');
  };

  const handleRestart = () => {
    setAnswer(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setTries(0);
    setHint('1〜100の数字を当ててください');
    setGameOver(false);
    setGameStarted(true);
  };

  const handleExit = () => {
    onGameOver(0);
  };

  return (
    <GameContainer>
      <Stats>数あてゲーム</Stats>
      <Stats>挑戦回数: {tries}</Stats>
      <Stats>{hint}</Stats>
      {!gameOver ? (
        <div>
          <Input
            type="text"
            value={guess}
            onChange={handleChange}
            maxLength={3}
            disabled={!gameStarted}
            onKeyDown={e => e.key === 'Enter' && handleGuess()}
          />
          <Button onClick={handleGuess} disabled={!gameStarted}>決定</Button>
        </div>
      ) : null}
      {!gameStarted || gameOver ? (
        <GameOver>
          <h2>{gameOver ? '正解！' : '数あてゲーム'}</h2>
          {gameOver && <p>挑戦回数: {tries}</p>}
          <Button onClick={handleRestart}>スタート</Button>
          <Button onClick={handleExit}>終了</Button>
        </GameOver>
      ) : null}
    </GameContainer>
  );
};

export default NumberGuessGame; 