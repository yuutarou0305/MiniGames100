import React, { useState } from 'react';
import styled from 'styled-components';
import { BackButton } from '../components/commonStyles';

const questions = [
  {
    question: '花束が2束と3束あります。合わせると何束になる？',
    options: ['5束', '1束', '6束', '4束'],
    answer: 1,
  },
  {
    question: '奈良の大仏と鎌倉の大仏！どちらが先に立った？',
    options: ['奈良の大仏', '鎌倉の大仏', 'どちらも立っていない', '同時'],
    answer: 2,
  },
  {
    question: '孫がおじいちゃんとボール遊びをしました。なにをした？',
    options: ['野球', 'サッカー', 'ソフトボール', 'バスケット'],
    answer: 2,
  },
  {
    question: '1トンの鉄と1トンの紙はどちらが重い？',
    options: ['鉄', '紙', '同じ', '鉄の方が軽い'],
    answer: 2,
  },
  {
    question: '答えは簡単です。1×2×5×10×0の答えはなに？',
    options: ['0', '100', '簡単', '10'],
    answer: 2,
  },
  {
    question: 'いま、なんじ？',
    options: ['2時', '3時', '2字', '4時'],
    answer: 2,
  },
  {
    question: '1枚の紙を切らずに10枚にしました。どうやった？',
    options: ['両替した', 'コピーした', '折った', '破った'],
    answer: 0,
  },
  {
    question: '1日中回っているのに疲れなかった！なぜ？',
    options: ['時計だから', 'ロボットだから', '機械だから', '電池だから'],
    answer: 0,
  },
  {
    question: '夜も寝ずに働いているのに元気！なぜ？',
    options: ['夜勤だから', '若いから', '元気だから', '寝てないから'],
    answer: 0,
  },
  {
    question: '目にさしても血が出ないものは？',
    options: ['針', '薬', '指', '綿棒'],
    answer: 1,
  },
  {
    question: '火を消せるぼうしってなに？',
    options: ['消防士', '帽子', 'ヘルメット', 'キャップ'],
    answer: 0,
  },
  {
    question: '貝がお風呂に入ったときの感想は？',
    options: ['温かい', '気持ちいい', '熱い', '冷たい'],
    answer: 0,
  },
  {
    question: 'Jの隣にいるえらい女性は誰？',
    options: ['女王（クイーン）', 'ジャック', 'キング', 'エース'],
    answer: 0,
  },
  {
    question: '父親がじっと時計を見ています。なんじ？',
    options: ['おやじ', '3時', '12時', '6時'],
    answer: 0,
  },
  {
    question: '鉛筆を使わずに、お風呂でかくものはなに？',
    options: ['汗', '絵', '文字', '数字'],
    answer: 0,
  },
  {
    question: '満員電車なのに、毎日座れる人は誰？',
    options: ['電車の運転手', 'お年寄り', '妊婦', '子供'],
    answer: 0,
  },
  {
    question: 'オセロのコマは何種類ある？',
    options: ['1種類', '2種類', '3種類', '4種類'],
    answer: 0,
  },
  {
    question: '50を半分で割り、10を足します。いくつになる？',
    options: ['35', '12', '60', '25'],
    answer: 1,
  },
  {
    question: '田んぼの隣に糸があります。どんな糸？',
    options: ['細い', '太い', '長い', '短い'],
    answer: 0,
  },
  {
    question: '泡が出てくる犬ってなに？',
    options: ['石鹸', 'シャンプー', '洗剤', '泡'],
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

const TrickQuizGame = ({ onGameOver, onBack }) => {
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

export default TrickQuizGame; 