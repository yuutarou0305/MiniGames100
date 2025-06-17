import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 20px;
  perspective: 1000px;
`;

const Card = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s;
  cursor: pointer;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  border-radius: 10px;
  background: ${props => props.isFront ? '#2c3e50' : '#3498db'};
  color: white;
  transform: ${props => props.isFront ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

const Stats = styled.div`
  color: white;
  font-size: 24px;
  margin: 20px;
  text-align: center;
`;

const GameOver = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
`;

const Button = styled.button`
  background: #3498db;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  color: white;

  &:hover {
    background: #2980b9;
  }
`;

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const MemoryGame = ({ onGameOver, onScoreUpdate }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeGame = () => {
    const cardPairs = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false
      }));
    setCards(cardPairs);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameOver(false);
  };

  useEffect(() => {
    if (matchedPairs.length === emojis.length) {
      setGameOver(true);
      const score = Math.max(0, 100 - moves * 2);
      onGameOver(score);
    }
  }, [matchedPairs, moves, onGameOver]);

  const handleCardClick = (clickedCard) => {
    if (flippedCards.length === 2 || clickedCard.matched || flippedCards.includes(clickedCard.id)) {
      return;
    }

    const newFlippedCards = [...flippedCards, clickedCard.id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(m => m + 1);
      const [firstCard, secondCard] = newFlippedCards.map(id => cards.find(card => card.id === id));

      if (firstCard.emoji === secondCard.emoji) {
        setMatchedPairs(prev => [...prev, firstCard.emoji]);
        setCards(prev => prev.map(card => 
          card.id === firstCard.id || card.id === secondCard.id
            ? { ...card, matched: true }
            : card
        ));
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleStart = () => {
    setGameStarted(true);
    initializeGame();
  };

  const handleExit = () => {
    onGameOver(0);
  };

  return (
    <GameContainer>
      {!gameStarted ? (
        <GameOver>
          <h2>記憶力ゲーム</h2>
          <p>カードをめくって同じ絵柄を探そう！</p>
          <p>少ない手数で全てのカードを揃えよう！</p>
          <Button onClick={handleStart}>スタート</Button>
        </GameOver>
      ) : gameOver ? (
        <GameOver>
          <h2>ゲームクリア！</h2>
          <p>手数: {moves}</p>
          <p>スコア: {Math.max(0, 100 - moves * 2)}</p>
          <Button onClick={handleStart}>もう一度プレイ</Button>
          <Button onClick={handleExit}>終了</Button>
        </GameOver>
      ) : (
        <>
          <Stats>
            <div>手数: {moves}</div>
            <div>残りペア: {emojis.length - matchedPairs.length}</div>
          </Stats>
          <Grid>
            {cards.map(card => (
              <Card
                key={card.id}
                flipped={card.flipped || card.matched || flippedCards.includes(card.id)}
                onClick={() => handleCardClick(card)}
              >
                <CardFace isFront={false}>?</CardFace>
                <CardFace isFront={true}>{card.emoji}</CardFace>
              </Card>
            ))}
          </Grid>
        </>
      )}
    </GameContainer>
  );
};

export default MemoryGame; 