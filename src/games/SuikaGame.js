import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 600px;
  margin: 0 auto;
  position: relative;
  background: #f0f0f0;
  border: 2px solid #333;
  overflow: hidden;
`;

const Fruit = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.color};
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transition: top 0.1s linear;
  cursor: pointer;
`;

const NextFruit = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.color};
  margin: 10px auto;
`;

const Score = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  font-weight: bold;
`;

const FRUITS = [
  { name: 'grape', size: 30, color: '#8B5CF6', points: 1 },
  { name: 'cherry', size: 40, color: '#EF4444', points: 2 },
  { name: 'orange', size: 50, color: '#F97316', points: 3 },
  { name: 'lemon', size: 60, color: '#FBBF24', points: 4 },
  { name: 'peach', size: 70, color: '#F87171', points: 5 },
  { name: 'pineapple', size: 80, color: '#FCD34D', points: 6 },
  { name: 'melon', size: 90, color: '#34D399', points: 7 },
  { name: 'watermelon', size: 100, color: '#10B981', points: 8 },
];

const SuikaGame = () => {
  const [fruits, setFruits] = useState([]);
  const [nextFruit, setNextFruit] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const getRandomFruit = () => {
    return FRUITS[Math.floor(Math.random() * 3)];
  };

  const initializeGame = useCallback(() => {
    setFruits([]);
    setNextFruit(getRandomFruit());
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleClick = (e) => {
    if (gameOver) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - (nextFruit.size / 2);
    
    const newFruit = {
      ...nextFruit,
      x,
      y: 0,
      id: Date.now(),
    };

    setFruits(prev => [...prev, newFruit]);
    setNextFruit(getRandomFruit());
  };

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setFruits(prev => {
        const updated = prev.map(fruit => ({
          ...fruit,
          y: fruit.y + 5,
        }));

        // Check for collisions
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const f1 = updated[i];
            const f2 = updated[j];

            const dx = f1.x - f2.x;
            const dy = f1.y - f2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (f1.size + f2.size) / 2) {
              if (f1.name === f2.name) {
                // Merge fruits
                const newFruit = FRUITS[FRUITS.findIndex(f => f.name === f1.name) + 1];
                if (newFruit) {
                  setScore(prev => prev + newFruit.points);
                  return updated.filter(f => f.id !== f1.id && f.id !== f2.id).concat({
                    ...newFruit,
                    x: (f1.x + f2.x) / 2,
                    y: (f1.y + f2.y) / 2,
                    id: Date.now(),
                  });
                }
              }
            }
          }
        }

        // Check for game over
        const hasGameOver = updated.some(fruit => fruit.y + fruit.size >= 600);
        if (hasGameOver) {
          setGameOver(true);
          clearInterval(gameLoop);
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [fruits]);

  return (
    <div>
      <GameContainer onClick={handleClick}>
        {fruits.map(fruit => (
          <Fruit
            key={fruit.id}
            size={fruit.size}
            color={fruit.color}
            x={fruit.x}
            y={fruit.y}
          />
        ))}
        <Score>Score: {score}</Score>
      </GameContainer>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h3>Next Fruit:</h3>
        {nextFruit && <NextFruit size={nextFruit.size} color={nextFruit.color} />}
      </div>
      {gameOver && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Game Over!</h2>
          <button onClick={initializeGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default SuikaGame; 