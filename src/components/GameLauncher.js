import React from 'react';
import styled from 'styled-components';

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const GameCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.2);
  }
`;

const GameTitle = styled.h2`
  margin: 0;
  color: #111;
`;

const GameDescription = styled.p`
  margin: 10px 0;
  color: #ccc;
`;

function GameLauncher({ games, onGameSelect }) {
  return (
    <GameGrid>
      {games.map(game => (
        <GameCard key={game.id} onClick={() => onGameSelect(game.id)}>
          <GameTitle>{game.name}</GameTitle>
          <GameDescription>
            {game.name}をプレイするにはクリックしてください
          </GameDescription>
        </GameCard>
      ))}
    </GameGrid>
  );
}

export default GameLauncher; 