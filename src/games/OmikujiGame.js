import React, { useState } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const OmikujiBox = styled.div`
  width: 300px;
  height: 400px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin: 20px;
`;

const Result = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: ${props => {
    switch(props.fortune) {
      case '大吉': return '#ff0000';
      case '中吉': return '#ff6b6b';
      case '小吉': return '#ffa500';
      case '末吉': return '#ffd700';
      case '凶': return '#4169e1';
      case '大凶': return '#000080';
      default: return '#000';
    }
  }};
  margin: 20px 0;
`;

const Button = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 18px;
  cursor: pointer;
  margin: 20px;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
    background: #ff5252;
  }
`;

const Message = styled.p`
  font-size: 18px;
  color: #666;
  text-align: center;
  margin: 10px 0;
`;

const fortunes = ['大吉', '中吉', '小吉', '末吉', '凶', '大凶'];
const messages = {
  '大吉': '素晴らしい運勢です！何をやってもうまくいくでしょう。',
  '中吉': '良い運勢です。積極的に行動しましょう。',
  '小吉': 'まずまずの運勢です。慎重に進めましょう。',
  '末吉': 'やや不安定な運勢です。注意深く行動しましょう。',
  '凶': '気をつけて過ごしましょう。',
  '大凶': '慎重に行動し、静かに過ごすことをお勧めします。'
};

const OmikujiGame = ({ onGameOver }) => {
  const [result, setResult] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  const drawOmikuji = () => {
    setIsShaking(true);
    setTimeout(() => {
      const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      setResult(fortune);
      setIsShaking(false);
      onGameOver(1); // おみくじを引いたら1ポイント
    }, 1000);
  };

  return (
    <GameContainer>
      <h1>おみくじ</h1>
      <OmikujiBox>
        {result ? (
          <>
            <Result fortune={result}>{result}</Result>
            <Message>{messages[result]}</Message>
          </>
        ) : (
          <Message>おみくじを引いてください</Message>
        )}
      </OmikujiBox>
      <Button 
        onClick={drawOmikuji}
        style={{
          transform: isShaking ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.1s ease'
        }}
      >
        おみくじを引く
      </Button>
    </GameContainer>
  );
};

export default OmikujiGame; 