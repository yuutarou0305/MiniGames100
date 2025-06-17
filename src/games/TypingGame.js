import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 800px;
  height: 600px;
  position: relative;
  background: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'Arial', sans-serif;
`;

const Word = styled.div`
  position: absolute;
  font-size: 24px;
  color: ${props => props.color || 'white'};
  transition: all 0.1s;
  user-select: none;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Input = styled.input`
  position: absolute;
  bottom: 50px;
  width: 300px;
  padding: 10px;
  font-size: 20px;
  border: none;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  outline: none;

  &:focus {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
`;

const Stats = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 20px;
`;

const GameOver = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;

  &:hover {
    background: #45a049;
  }
`;

const words = [
  'こんにちは', 'さようなら', 'ありがとう', 'おはよう', 'おやすみ',
  'プログラミング', 'タイピング', 'ゲーム', 'コンピュータ', 'インターネット',
  'キーボード', 'マウス', 'ディスプレイ', 'ソフトウェア', 'ハードウェア',
  'アルゴリズム', 'データベース', 'ネットワーク', 'セキュリティ', 'クラウド',
  'アプリケーション', 'システム', 'サーバー', 'クライアント', 'プロトコル',
  'フレームワーク', 'ライブラリ', 'インターフェース', 'デザイン', 'パフォーマンス'
];

const TypingGame = ({ onGameOver, onScoreUpdate }) => {
  const [activeWords, setActiveWords] = useState([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);

  const generateWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    const speed = Math.max(1, 3 - (level * 0.2)); // レベルが上がるごとに速くなる
    const points = Math.max(1, 5 - Math.floor(level / 2)); // レベルが上がるごとにポイントが減る

    return {
      id: Date.now() + Math.random(),
      text: word,
      x: Math.random() * 600,
      y: 0,
      speed,
      points,
      createdAt: Date.now()
    };
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          onGameOver(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, score, onGameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnInterval = setInterval(() => {
      setActiveWords(prev => {
        const newWords = prev.filter(word => word.y < 600);
        if (Math.random() < 0.3 + (level * 0.05)) { // レベルが上がるごとに出現確率が上がる
          newWords.push(generateWord());
        }
        return newWords;
      });
    }, 1000);

    const moveInterval = setInterval(() => {
      setActiveWords(prev => 
        prev.map(word => ({
          ...word,
          y: word.y + word.speed
        }))
      );
    }, 16);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [gameStarted, gameOver, level]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      inputRef.current?.focus();
    }
  }, [gameStarted, gameOver]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // 入力された単語と一致する単語を探す
    const matchingWord = activeWords.find(word => word.text === value);
    if (matchingWord) {
      const timeDiff = Date.now() - matchingWord.createdAt;
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));
      const points = matchingWord.points * (1 + (newCombo * 0.1)); // コンボボーナス
      const newScore = score + Math.floor(points);
      setScore(newScore);
      onScoreUpdate(newScore);
      setActiveWords(prev => prev.filter(w => w.id !== matchingWord.id));
      setInput('');

      // レベルアップ判定
      if (newScore >= level * 50) {
        setLevel(prev => prev + 1);
      }

      // WPMと正確性の計算
      const wordsTyped = newScore / 5; // 平均的な単語の長さを考慮
      const minutes = (60 - timeLeft) / 60;
      setWpm(Math.floor(wordsTyped / minutes));
    }
  };

  const handleStart = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(60);
    setLevel(1);
    setCombo(0);
    setMaxCombo(0);
    setWpm(0);
    setAccuracy(100);
    setActiveWords([]);
    setInput('');
  };

  const handleRestart = () => {
    handleStart();
  };

  const handleExit = () => {
    onGameOver(score);
  };

  if (!gameStarted) {
    return (
      <GameContainer>
        <GameOver>
          <h2>タイピングゲーム</h2>
          <p>ルール:</p>
          <p>・画面上に流れてくる単語を入力してください</p>
          <p>・単語が画面下まで落ちるとゲームオーバーです</p>
          <p>・連続で入力するとコンボボーナスが付きます</p>
          <p>・レベルが上がるごとに単語の速度が上がります</p>
          <Button onClick={handleStart}>ゲーム開始</Button>
        </GameOver>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <Stats>
        <div>スコア: {score}</div>
        <div>レベル: {level}</div>
        <div>コンボ: {combo}</div>
        <div>最大コンボ: {maxCombo}</div>
        <div>WPM: {wpm}</div>
        <div>正確性: {accuracy}%</div>
        <div>残り時間: {timeLeft}秒</div>
      </Stats>

      {activeWords.map(word => (
        <Word
          key={word.id}
          style={{
            left: word.x,
            top: word.y,
            color: word.y > 500 ? '#ff4444' : 'white'
          }}
        >
          {word.text}
        </Word>
      ))}

      <Input
        ref={inputRef}
        value={input}
        onChange={handleInputChange}
        placeholder="単語を入力..."
      />

      {gameOver && (
        <GameOver>
          <h2>ゲーム終了！</h2>
          <p>最終スコア: {score}</p>
          <p>最大コンボ: {maxCombo}</p>
          <p>到達レベル: {level}</p>
          <p>WPM: {wpm}</p>
          <p>正確性: {accuracy}%</p>
          <Button onClick={handleRestart}>もう一度プレイ</Button>
          <Button onClick={handleExit}>終了</Button>
        </GameOver>
      )}
    </GameContainer>
  );
};

export default TypingGame; 