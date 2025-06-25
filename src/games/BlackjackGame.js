import React, { useState } from 'react';
import styled from 'styled-components';

const suits = ['♠', '♥', '♦', '♣'];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // 11=J, 12=Q, 13=K, 14=A

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #2d2d2d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CardArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
`;

const Card = styled.div`
  width: 60px;
  height: 90px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${({ suit }) => (suit === '♥' || suit === '♦' ? '#e94560' : '#222')};
`;

const Stats = styled.div`
  color: #111;
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

function createDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
}

function getCardString(card) {
  if (!card) return '';
  let v = card.value;
  if (v === 11) v = 'J';
  if (v === 12) v = 'Q';
  if (v === 13) v = 'K';
  if (v === 14) v = 'A';
  return `${v}${card.suit}`;
}

function calcHandValue(hand) {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.value >= 11 && card.value <= 13) total += 10;
    else if (card.value === 14) {
      total += 11;
      aces++;
    } else {
      total += card.value;
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

const BlackjackGame = ({ onGameOver }) => {
  const [deck, setDeck] = useState([]);
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [playerStand, setPlayerStand] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    const d = createDeck();
    setDeck(d.slice(4));
    setPlayer([d[0], d[2]]);
    setDealer([d[1], d[3]]);
    setPlayerStand(false);
    setGameOver(false);
    setWinner(null);
    setGameStarted(true);
  };

  const handleHit = () => {
    if (gameOver || playerStand) return;
    setPlayer(prev => {
      const newHand = [...prev, deck[0]];
      setDeck(deck.slice(1));
      return newHand;
    });
  };

  const handleStand = () => {
    setPlayerStand(true);
  };

  // ディーラーの自動プレイ
  React.useEffect(() => {
    if (!playerStand || gameOver) return;
    let dealerHand = [...dealer];
    let d = [...deck];
    while (calcHandValue(dealerHand) < 17 && d.length > 0) {
      dealerHand.push(d[0]);
      d = d.slice(1);
    }
    setTimeout(() => {
      setDealer(dealerHand);
      setDeck(d);
    }, 800);
    setTimeout(() => setGameOver(true), 1200);
  }, [playerStand, gameOver]);

  // 勝敗判定
  React.useEffect(() => {
    if (!gameStarted) return;
    const playerValue = calcHandValue(player);
    const dealerValue = calcHandValue(dealer);
    if (playerValue > 21) {
      setGameOver(true);
      setWinner('ディーラー');
      setTimeout(() => onGameOver(0), 1000);
    } else if (gameOver) {
      if (dealerValue > 21 || playerValue > dealerValue) setWinner('プレイヤー');
      else if (dealerValue > playerValue) setWinner('ディーラー');
      else setWinner('引き分け');
      setTimeout(() => onGameOver(winner === 'プレイヤー' ? 10 : 0), 1000);
    }
  }, [player, dealer, gameOver, gameStarted, winner, onGameOver]);

  const handleRestart = () => {
    startGame();
  };

  const handleExit = () => {
    onGameOver(0);
  };

  return (
    <GameContainer>
      <Stats>
        <div>ディーラー: {playerStand || gameOver ? calcHandValue(dealer) : '?'} / プレイヤー: {calcHandValue(player)}</div>
      </Stats>
      <div style={{ color: '#fff', fontSize: '20px', margin: '10px' }}>ディーラーの手札</div>
      <CardArea>
        {dealer.map((card, i) => (
          <Card key={i} suit={card.suit} style={{ opacity: (i === 0 && !playerStand && !gameOver) ? 0.3 : 1 }}>
            {(i === 0 && !playerStand && !gameOver) ? '?' : getCardString(card)}
          </Card>
        ))}
      </CardArea>
      <div style={{ color: '#fff', fontSize: '20px', margin: '10px' }}>プレイヤーの手札</div>
      <CardArea>
        {player.map((card, i) => (
          <Card key={i} suit={card.suit}>{getCardString(card)}</Card>
        ))}
      </CardArea>
      {!gameStarted || gameOver ? (
        <GameOver>
          <h2>{gameOver ? 'ゲーム終了！' : 'ブラックジャック'}</h2>
          {gameOver && (
            <>
              <p>ディーラー: {calcHandValue(dealer)} / プレイヤー: {calcHandValue(player)}</p>
              <p>
                {winner === '引き分け'
                  ? '引き分け！'
                  : winner
                  ? `${winner}の勝ち！`
                  : ''}
              </p>
            </>
          )}
          <Button onClick={handleRestart}>スタート</Button>
          <Button onClick={handleExit}>終了</Button>
        </GameOver>
      ) : (
        <div style={{ margin: '20px' }}>
          <Button onClick={handleHit}>ヒット</Button>
          <Button onClick={handleStand}>スタンド</Button>
        </div>
      )}
    </GameContainer>
  );
};

export default BlackjackGame; 