import React, { useState } from 'react';
import styled from 'styled-components';
import { BackButton } from '../components/commonStyles';

const questions = [
  {
    question: 'あなたは夜道を歩いています。後ろから足音が聞こえたとき、どうしますか？',
    options: [
      { text: '振り返る', value: 1 },
      { text: '走って逃げる', value: 2 },
      { text: '無視する', value: 3 },
      { text: '隠れる', value: 4 },
    ],
  },
  {
    question: '友人が困っているとき、あなたは？',
    options: [
      { text: 'すぐ助ける', value: 1 },
      { text: '様子を見る', value: 2 },
      { text: '無関心', value: 3 },
      { text: '逆に困らせる', value: 4 },
    ],
  },
  {
    question: '動物を見たときの気持ちは？',
    options: [
      { text: 'かわいい', value: 1 },
      { text: '普通', value: 2 },
      { text: '興味ない', value: 3 },
      { text: '怖い', value: 4 },
    ],
  },
  {
    question: '落ちている財布を見つけたらどうする？',
    options: [
      { text: '交番に届ける', value: 1 },
      { text: 'そのままにする', value: 2 },
      { text: '中身を確認する', value: 3 },
      { text: '持ち帰る', value: 4 },
    ],
  },
  {
    question: '他人の失敗を見たとき、どう思う？',
    options: [
      { text: '心配する', value: 1 },
      { text: '仕方ないと思う', value: 2 },
      { text: '面白いと思う', value: 3 },
      { text: '自分は大丈夫と安心する', value: 4 },
    ],
  },
  {
    question: '大切な約束を忘れてしまったら？',
    options: [
      { text: 'すぐ謝る', value: 1 },
      { text: '言い訳をする', value: 2 },
      { text: '気にしない', value: 3 },
      { text: '相手のせいにする', value: 4 },
    ],
  },
  {
    question: '自分のミスで誰かが困っているとき、どうする？',
    options: [
      { text: 'すぐ助ける', value: 1 },
      { text: '見て見ぬふり', value: 2 },
      { text: '他人のせいにする', value: 3 },
      { text: '笑ってごまかす', value: 4 },
    ],
  },
  {
    question: '電車で席を譲るか迷ったとき、どうする？',
    options: [
      { text: 'すぐ譲る', value: 1 },
      { text: '様子を見る', value: 2 },
      { text: '譲らない', value: 3 },
      { text: '席を立つ', value: 4 },
    ],
  },
  {
    question: 'SNSで知らない人に絡まれたら？',
    options: [
      { text: '無視する', value: 1 },
      { text: '丁寧に返す', value: 2 },
      { text: '煽り返す', value: 3 },
      { text: 'ブロックする', value: 4 },
    ],
  },
  {
    question: '大事なテストでカンニングを見かけたら？',
    options: [
      { text: '先生に伝える', value: 1 },
      { text: '見なかったふり', value: 2 },
      { text: '一緒にカンニングする', value: 3 },
      { text: '注意する', value: 4 },
    ],
  },
  {
    question: '友達が自分の悪口を言っていたら？',
    options: [
      { text: '直接聞く', value: 1 },
      { text: '距離を置く', value: 2 },
      { text: '仕返しする', value: 3 },
      { text: '気にしない', value: 4 },
    ],
  },
  {
    question: '困っている人を見かけたら？',
    options: [
      { text: '声をかける', value: 1 },
      { text: '見て見ぬふり', value: 2 },
      { text: '他人に任せる', value: 3 },
      { text: '写真を撮る', value: 4 },
    ],
  },
];

const results = [
  { min: 12, max: 17, text: 'あなたはとても優しい性格です。' },
  { min: 18, max: 27, text: 'あなたは普通の性格です。' },
  { min: 28, max: 39, text: 'あなたは少し冷たいかも？' },
  { min: 40, max: 48, text: 'あなたはサイコパスの傾向があります！' },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #e3f0fc;
  color: #111;
`;

const Question = styled.div`
  font-size: 2rem;
  margin-bottom: 24px;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OptionButton = styled.button`
  background: #fff;
  color: #111;
  border: 2px solid #b3d8f7;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  &:hover {
    background: #b3d8f7;
    border-color: #174ea6;
  }
`;

const Result = styled.div`
  font-size: 1.5rem;
  margin: 24px 0;
`;

const PsychopathTestGame = ({ onGameOver, onBack }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOption = (value) => {
    setScore(s => s + value);
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    return results.find(r => score >= r.min && score <= r.max)?.text || '診断できませんでした。';
  };

  const handleBackHome = () => {
    onBack && onBack();
  };

  return (
    <Container>
      <BackButton onClick={handleBackHome}>ホームへ</BackButton>
      {!showResult ? (
        <>
          <Question>{questions[current].question}</Question>
          <Options>
            {questions[current].options.map((opt, idx) => (
              <OptionButton key={idx} onClick={() => handleOption(opt.value)}>{opt.text}</OptionButton>
            ))}
          </Options>
        </>
      ) : (
        <>
          <Result>{getResult()}</Result>
          <OptionButton onClick={() => onGameOver(score)}>終了</OptionButton>
        </>
      )}
    </Container>
  );
};

export default PsychopathTestGame; 