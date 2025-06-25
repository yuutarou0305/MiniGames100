import React, { useState } from 'react';
import { BackButton } from '../components/commonStyles';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f7fa;
`;

const Problem = styled.div`
  font-size: 2.2rem;
  margin: 24px 0 12px 0;
  color: #111;
`;

const Input = styled.input`
  font-size: 1.5rem;
  padding: 8px 16px;
  border: 2px solid #e94560;
  border-radius: 7px;
  margin-bottom: 16px;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 24px;
  font-size: 1.2rem;
  background: #e94560;
  color: #fff;
  border: none;
  border-radius: 7px;
  margin: 12px 0;
  cursor: pointer;
  &:hover { background: #d13b54; }
`;

const MathGame = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(1);
  const [problem, setProblem] = useState(generateProblem());
  const [input, setInput] = useState('');
  const [gameOver, setGameOver] = useState(false);

  function generateProblem() {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const op = ['+', '-', '×'][Math.floor(Math.random() * 3)];
    let answer;
    if (op === '+') answer = a + b;
    else if (op === '-') answer = a - b;
    else answer = a * b;
    return { a, b, op, answer };
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(input, 10) === problem.answer) {
      setScore(s => s + 1);
    }
    if (question === 10) {
      setGameOver(true);
    } else {
      setQuestion(q => q + 1);
      setProblem(generateProblem());
      setInput('');
    }
  };

  const restart = () => {
    setScore(0);
    setQuestion(1);
    setProblem(generateProblem());
    setInput('');
    setGameOver(false);
  };

  return (
    <GameContainer>
      <h2>算数ゲーム</h2>
      {!gameOver ? (
        <form onSubmit={handleSubmit}>
          <Problem>
            {question}問目: {problem.a} {problem.op} {problem.b} = ?
          </Problem>
          <Input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <div>
            <Button type="submit">答える</Button>
          </div>
        </form>
      ) : (
        <>
          <div style={{ fontSize: '1.5rem', margin: '12px' }}>正解数: {score} / 10</div>
          <Button onClick={restart}>リスタート</Button>
        </>
      )}
      <BackButton onClick={onBack}>ホームに戻る</BackButton>
    </GameContainer>
  );
};

export default MathGame; 