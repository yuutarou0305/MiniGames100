import React, { useState } from 'react';
import styled from 'styled-components';
import { BackButton } from '../components/commonStyles';

const questions = [
  {
    question: '日本の首都はどこ？',
    options: ['大阪府', '北海道', '東京都', '福岡県'],
    answer: 2,
  },
  {
    question: '富士山がある都道府県は？',
    options: ['静岡県', '長野県', '山梨県', '岐阜県'],
    answer: 0,
  },
  {
    question: '沖縄県の県庁所在地は？',
    options: ['那覇市', '浦添市', '名護市', '石垣市'],
    answer: 0,
  },
  {
    question: 'りんごの生産量が日本一の県は？',
    options: ['青森県', '長野県', '山形県', '秋田県'],
    answer: 0,
  },
  {
    question: '日本で一番面積が大きい都道府県は？',
    options: ['北海道', '岩手県', '福島県', '新潟県'],
    answer: 0,
  },
  {
    question: '「うどん県」として有名な都道府県は？',
    options: ['香川県', '愛媛県', '徳島県', '高知県'],
    answer: 0,
  },
  {
    question: '名古屋市がある都道府県は？',
    options: ['愛知県', '岐阜県', '三重県', '静岡県'],
    answer: 0,
  },
  {
    question: '「さっぽろ雪まつり」が開催される都道府県は？',
    options: ['北海道', '青森県', '秋田県', '岩手県'],
    answer: 0,
  },
  {
    question: '「お好み焼き」が有名な都道府県は？',
    options: ['広島県', '大阪府', '兵庫県', '京都府'],
    answer: 1,
  },
  {
    question: '「金閣寺」がある都道府県は？',
    options: ['京都府', '奈良県', '滋賀県', '大阪府'],
    answer: 0,
  },
  {
    question: '「阿波おどり」が有名な都道府県は？',
    options: ['徳島県', '香川県', '愛媛県', '高知県'],
    answer: 0,
  },
  {
    question: '「博多ラーメン」が有名な都道府県は？',
    options: ['福岡県', '熊本県', '佐賀県', '長崎県'],
    answer: 0,
  },
  {
    question: '「松本城」がある都道府県は？',
    options: ['長野県', '山梨県', '岐阜県', '新潟県'],
    answer: 0,
  },
  {
    question: '「伊勢神宮」がある都道府県は？',
    options: ['三重県', '愛知県', '岐阜県', '滋賀県'],
    answer: 0,
  },
  {
    question: '「なまはげ」で有名な都道府県は？',
    options: ['秋田県', '青森県', '岩手県', '山形県'],
    answer: 0,
  },
  {
    question: '「さくらんぼ」の生産量が日本一の県は？',
    options: ['山形県', '福島県', '青森県', '秋田県'],
    answer: 0,
  },
  {
    question: '「しらぬい（デコポン）」の生産量が日本一の県は？',
    options: ['熊本県', '愛媛県', '和歌山県', '静岡県'],
    answer: 0,
  },
  {
    question: '「琵琶湖」がある都道府県は？',
    options: ['滋賀県', '京都府', '奈良県', '三重県'],
    answer: 0,
  },
  {
    question: '「スカイツリー」がある都道府県は？',
    options: ['東京都', '千葉県', '埼玉県', '神奈川県'],
    answer: 0,
  },
  {
    question: '「善光寺」がある都道府県は？',
    options: ['長野県', '新潟県', '山梨県', '群馬県'],
    answer: 0,
  },
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

const Score = styled.div`
  font-size: 1.5rem;
  margin: 24px 0;
`;

const PrefectureQuizGame = ({ onGameOver, onBack }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOption = (idx) => {
    if (questions[current].answer === idx) {
      setScore(s => s + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
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
          <Question>{questions[current].question}</Question>
          <Options>
            {questions[current].options.map((opt, idx) => (
              <OptionButton key={idx} onClick={() => handleOption(idx)}>{opt}</OptionButton>
            ))}
          </Options>
          <Score>スコア: {score}</Score>
        </>
      ) : (
        <>
          <Score>あなたのスコア: {score} / {questions.length}</Score>
          <OptionButton onClick={() => onGameOver(score)}>終了</OptionButton>
        </>
      )}
    </Container>
  );
};

export default PrefectureQuizGame; 