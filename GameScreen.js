import { useEffect, useRef, useState } from 'react';

import { FinalResultScreen } from './components/game/FinalResultScreen';
import { GameContent } from './components/game/GameContent';
import {
  calculateAverageResponseTime,
  calculateScoreDelta,
  generateOperation,
  makeChoices,
  saveScore,
} from './utils/gameUtils';

export default function GameScreen({ settings, onExit }) {
  const { mode, difficulty, rounds, playerName, timePerQuestion } = settings;

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(() => generateOperation(difficulty));
  const [input, setInput] = useState('');
  const [choices, setChoices] = useState([]);
  const [proposed, setProposed] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [screenState, setScreenState] = useState('playing');
  const [finalResult, setFinalResult] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const hasResolvedQuestionRef = useRef(false);
  const responseTimesRef = useRef([]);
  const finishLockRef = useRef(false);
  const scoreRef = useRef(0);

  const maxQuestions = mode === 'cronometro' ? Infinity : rounds;

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const prepareQuestionExtras = (nextQuestion) => {
    if (mode === 'multiple') {
      setChoices(makeChoices(nextQuestion.answer));
    } else {
      setChoices([]);
    }

    if (mode === 'vf') {
      const showCorrect = Math.random() < 0.6;
      const delta = Math.max(1, Math.round(Math.abs(nextQuestion.answer) * 0.2) + 1);
      const shown = showCorrect
        ? nextQuestion.answer
        : nextQuestion.answer + (Math.random() < 0.5 ? -1 : 1) * delta;
      setProposed(shown);
    } else {
      setProposed(null);
    }
  };

  useEffect(() => {
    if (screenState !== 'playing') {
      return undefined;
    }

    hasResolvedQuestionRef.current = false;
    setInput('');
    setTimeLeft(timePerQuestion);
    startTimeRef.current = Date.now();
    prepareQuestionExtras(question);

    clearTimer();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const left = Math.max(0, timePerQuestion - elapsed);
      setTimeLeft(left);

      if (left <= 0) {
        clearTimer();
        handleTimeout();
      }
    }, 100);

    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, screenState, timePerQuestion, mode]);

  const finalizeGame = async (reason) => {
    if (finishLockRef.current) {
      return;
    }

    finishLockRef.current = true;
    clearTimer();

    const totalQuestions = mode === 'cronometro' ? index + 1 : rounds;
    const averageResponseTime = calculateAverageResponseTime(responseTimesRef.current);
    const finalScore = scoreRef.current;

    await saveScore({
      name: playerName || 'Jugador',
      score: finalScore,
      averageResponseTime,
      mode,
      difficulty,
      rounds: totalQuestions,
      date: new Date().toISOString(),
      reason,
    });

    setFinalResult({
      reason,
      score: finalScore,
      averageResponseTime,
      questionsPlayed: totalQuestions,
    });
    setScreenState('final');
  };

  const advanceQuestion = () => {
    const nextIndex = index + 1;

    if (nextIndex >= maxQuestions) {
      finalizeGame('completed');
      return;
    }

    setIndex(nextIndex);
    setQuestion(generateOperation(difficulty));
  };

  const completeAnswer = (correct, timeUsed, noAnswer = false) => {
    if (hasResolvedQuestionRef.current || screenState !== 'playing') {
      return;
    }

    hasResolvedQuestionRef.current = true;
    clearTimer();
    responseTimesRef.current.push(timeUsed);

    const delta = calculateScoreDelta({
      correct,
      timeUsed,
      timePerQuestion,
      noAnswer,
    });

    scoreRef.current += delta;
    setScore(scoreRef.current);

    if (!correct && mode === 'cronometro') {
      finalizeGame('lost');
      return;
    }

    if (noAnswer && mode === 'cronometro') {
      finalizeGame('timeout');
      return;
    }

    advanceQuestion();
  };

  const handleTimeout = () => {
    completeAnswer(false, timePerQuestion, true);
  };

  const handleSubmitClassic = () => {
    const timeUsed = timePerQuestion - timeLeft;
    const numeric = Number(input);
    completeAnswer(numeric === question.answer, timeUsed, false);
  };

  const handleSubmitVF = (choice) => {
    const timeUsed = timePerQuestion - timeLeft;
    const correct = choice === 'true' ? proposed === question.answer : proposed !== question.answer;
    completeAnswer(correct, timeUsed, false);
  };

  const handleSubmitMultiple = (value) => {
    const timeUsed = timePerQuestion - timeLeft;
    completeAnswer(Number(value) === question.answer, timeUsed, false);
  };

  if (screenState === 'final' && finalResult) {
    return (
      <FinalResultScreen
        reason={finalResult.reason}
        score={finalResult.score}
        averageResponseTime={finalResult.averageResponseTime}
        questionsPlayed={finalResult.questionsPlayed}
        playerName={playerName}
        mode={mode}
        onBackToMenu={onExit}
      />
    );
  }

  return (
    <GameContent
      mode={mode}
      playerName={playerName}
      score={score}
      index={index}
      rounds={rounds}
      questionText={question.text}
      timeLeft={timeLeft}
      input={input}
      setInput={setInput}
      proposed={proposed}
      choices={choices}
      onSubmitClassic={handleSubmitClassic}
      onSubmitVF={handleSubmitVF}
      onSubmitMultiple={handleSubmitMultiple}
    />
  );
}
