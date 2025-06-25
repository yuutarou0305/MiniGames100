import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { BackButton } from '../components/commonStyles';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgColor }) => bgColor};
  color: #fff;
  transition: background-color 0.2s;
  cursor: pointer;
  text-align: center;
`;

const Text = styled.h1`
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const SubText = styled.p`
  font-size: 1.5rem;
`;

const ReflexGame = ({ onGameOver, onBack }) => {
  const [gameState, setGameState] = useState('waiting'); // waiting, ready, clicking, result
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);

  const handleStateChange = useCallback(() => {
    if (gameState === 'waiting') {
      setGameState('ready');
    } else if (gameState === 'ready') {
      // Clicked too soon
      setReactionTime(-1);
      setGameState('result');
    } else if (gameState === 'clicking') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      const score = Math.max(0, 500 - time); // Faster reaction = higher score
      onGameOver(score);
      setGameState('result');
    } else if (gameState === 'result') {
      setGameState('waiting');
      setReactionTime(0);
    }
  }, [gameState, startTime, onGameOver]);

  useEffect(() => {
    if (gameState === 'ready') {
      const timeout = setTimeout(() => {
        setGameState('clicking');
        setStartTime(Date.now());
      }, Math.random() * 3000 + 2000); // 2-5 seconds delay

      return () => clearTimeout(timeout);
    }
  }, [gameState]);

  const renderContent = () => {
    switch (gameState) {
      case 'waiting':
        return {
          bgColor: '#2c3e50',
          title: '反射神経ゲーム',
          subtext: 'クリックして開始',
        };
      case 'ready':
        return {
          bgColor: '#e74c3c',
          title: '緑になるまで待て…',
          subtext: '',
        };
      case 'clicking':
        return {
          bgColor: '#2ecc71',
          title: 'クリック！',
          subtext: '',
        };
      case 'result':
        if (reactionTime === -1) {
          return {
            bgColor: '#3498db',
            title: '早すぎ！',
            subtext: '緑色になってからクリックしてください。クリックしてもう一度試す',
          };
        }
        return {
          bgColor: '#3498db',
          title: `${reactionTime}ms`,
          subtext: 'クリックしてもう一度プレイ',
        };
      default:
        return {};
    }
  };

  const { bgColor, title, subtext } = renderContent();

  const handleBackButtonClick = (e) => {
    e.stopPropagation();
    onBack();
  }

  return (
    <GameContainer bgColor={bgColor} onClick={handleStateChange}>
      <Text>{title}</Text>
      <SubText>{subtext}</SubText>
      <BackButton onClick={handleBackButtonClick}>ホームに戻る</BackButton>
    </GameContainer>
  );
};

export default ReflexGame; 