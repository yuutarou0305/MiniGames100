import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { BackButton } from '../components/commonStyles';

const NUM_ROUNDS = 5;
const NUM_SHAPES = 200;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function generateShapes() {
  // All shapes are squares except one circle
  const baseShape = 'square';
  const diffShape = 'circle';
  const shapes = Array(NUM_SHAPES).fill(baseShape);
  const diffIdx = getRandomInt(NUM_SHAPES);
  shapes[diffIdx] = diffShape;
  return { shapes, diffIdx };
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #e3f0fc;
  color: #111;
`;

const ShapesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 32px 0;
  max-width: 900px;
`;

const Shape = styled.div`
  width: 24px;
  height: 24px;
  background: #e94560;
  border: 2px solid #b3d8f7;
  cursor: pointer;
  border-radius: ${props => props.shape === 'circle' ? '50%' : '8px'};
  box-sizing: border-box;
`;

const Score = styled.div`
  font-size: 1.5rem;
  margin: 24px 0;
`;

const Timer = styled.div`
  font-size: 1.2rem;
  margin-bottom: 8px;
`;

const SpotTheDifferenceGame = ({ onGameOver, onBack }) => {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [current, setCurrent] = useState(generateShapes());
  const [time, setTime] = useState(0);
  const timerRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    if (showResult) return;
    startTimeRef.current = Date.now();
    setTime(0);
    timerRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [showResult]);

  useEffect(() => {
    if (showResult) {
      clearInterval(timerRef.current);
    }
  }, [showResult]);

  const handleShapeClick = idx => {
    if (showResult) return;
    if (idx === current.diffIdx) {
      setScore(s => s + 1);
    }
    if (round + 1 < NUM_ROUNDS) {
      setRound(r => r + 1);
      setCurrent(generateShapes());
    } else {
      setShowResult(true);
    }
  };

  const handleBackHome = () => {
    onBack && onBack();
  };

  return (
    <Container>
      <BackButton onClick={handleBackHome}>ホームへ</BackButton>
      {!showResult ? (
        <>
          <Timer>経過時間: {time.toFixed(1)} 秒</Timer>
          <div>1つだけ形が違うもの（丸）を見つけてクリックしてください（{round + 1} / {NUM_ROUNDS}）</div>
          <ShapesRow>
            {current.shapes.map((shape, idx) => (
              <Shape key={idx} shape={shape} onClick={() => handleShapeClick(idx)} />
            ))}
          </ShapesRow>
          <Score>正解数: {score} / {NUM_ROUNDS}</Score>
        </>
      ) : (
        <>
          <Score>クリアタイム: {time.toFixed(1)} 秒</Score>
          <button onClick={() => onGameOver(time)}>終了</button>
        </>
      )}
    </Container>
  );
};

export default SpotTheDifferenceGame; 