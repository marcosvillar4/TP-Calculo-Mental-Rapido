import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './App.styles';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOperation(difficulty) {
  let a;
  let b;
  let op;
  let answer;

  const ops = ['+', '-', '*'];

  if (difficulty === 'facil') {
    a = randInt(1, 10);
    b = randInt(1, 10);
  } else if (difficulty === 'medio') {
    a = randInt(2, 50);
    b = randInt(1, 20);
  } else {
    a = randInt(10, 200);
    b = randInt(2, 50);
  }

  op = ops[randInt(0, ops.length - 1)];

  if (op === '+') answer = a + b;
  if (op === '-') answer = a - b;
  if (op === '*') answer = a * b;

  return { text: `${a} ${op} ${b}`, answer };
}

function makeChoices(correct) {
  const choices = new Set([correct]);

  while (choices.size < 4) {
    const delta = randInt(1, Math.max(2, Math.round(Math.abs(correct) * 0.3) + 3));
    const sign = Math.random() < 0.5 ? -1 : 1;
    choices.add(Math.round(correct + sign * delta));
  }

  const arr = Array.from(choices);

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

async function saveScore(record) {
  try {
    const raw = await AsyncStorage.getItem('tp_scores');
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(record);
    await AsyncStorage.setItem('tp_scores', JSON.stringify(arr));
  } catch (error) {
    console.warn('Error saving score', error);
  }
}

function formatTime(seconds) {
  return `${seconds.toFixed(1)}s`;
}

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

  const getAverageResponseTime = () => {
    const times = responseTimesRef.current;

    if (!times.length) {
      return 0;
    }

    return times.reduce((acc, value) => acc + value, 0) / times.length;
  };

  const prepareQuestionExtras = (nextQuestion) => {
    if (mode === 'multiple') {
      setChoices(makeChoices(nextQuestion.answer));
    } else {
      setChoices([]);
    }

    if (mode === 'vf') {
      const showCorrect = Math.random() < 0.6;
      const delta = randInt(1, Math.max(2, Math.round(Math.abs(nextQuestion.answer) * 0.2) + 1));
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

  const awardScore = (correct, timeUsed, noAnswer = false) => {
    if (noAnswer) {
      return -50;
    }

    if (correct) {
      return timeUsed < 0.75 * timePerQuestion ? 100 : 70;
    }

    return -30;
  };

  const finalizeGame = async (reason) => {
    if (finishLockRef.current) {
      return;
    }

    finishLockRef.current = true;
    clearTimer();

    const totalQuestions = mode === 'cronometro' ? index + 1 : rounds;
    const averageResponseTime = getAverageResponseTime();
    const finalScore = scoreRef.current;
    const record = {
      name: playerName || 'Jugador',
      score: finalScore,
      averageResponseTime,
      mode,
      difficulty,
      rounds: totalQuestions,
      date: new Date().toISOString(),
      reason,
    };

    await saveScore(record);
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
    const delta = awardScore(correct, timeUsed, noAnswer);
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
    const correct = numeric === question.answer;
    completeAnswer(correct, timeUsed, false);
  };

  const handleSubmitVF = (choice) => {
    const timeUsed = timePerQuestion - timeLeft;
    const correct = choice === 'true' ? proposed === question.answer : proposed !== question.answer;
    completeAnswer(correct, timeUsed, false);
  };

  const handleSubmitMultiple = (value) => {
    const timeUsed = timePerQuestion - timeLeft;
    const correct = Number(value) === question.answer;
    completeAnswer(correct, timeUsed, false);
  };

  if (screenState === 'final' && finalResult) {
    const titleByReason = {
      completed: '¡Partida finalizada!',
      lost: 'Perdiste la partida',
      timeout: 'Se acabó el tiempo',
    };

    return (
      <View style={styles.gameScreenContainer}>
        <View style={[styles.card, styles.gameCard]}>
          <Text style={styles.kicker}>Resultado final</Text>
          <Text style={styles.title}>{titleByReason[finalResult.reason] ?? 'Partida finalizada'}</Text>
          <Text style={[styles.subtitle, { marginTop: 10, textAlign: 'center' }]}>
            {playerName || 'Jugador'} completó la partida en el modo {mode}.
          </Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen</Text>
            <Text style={styles.summaryText}>Puntuación final: {finalResult.score}</Text>
            <Text style={styles.summaryText}>
              Tiempo de respuesta promedio: {formatTime(finalResult.averageResponseTime)}
            </Text>
            <Text style={styles.summaryText}>Preguntas jugadas: {finalResult.questionsPlayed}</Text>
          </View>

          <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={onExit}>
            <Text style={styles.primaryButtonText}>Volver al menú principal</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.gameScreenContainer}>
      <View style={[styles.card, styles.gameCard]}>
        <Text style={styles.kicker}>En juego · {playerName || 'Jugador'}</Text>
        <Text style={styles.title}>Puntaje: {score}</Text>
        <Text style={[styles.subtitle, { marginTop: 6, textAlign: 'center' }]}>
          Ronda: {index + 1}{mode === 'cronometro' ? '' : ` / ${rounds}`}
        </Text>

        <View style={styles.gameCenteredBlock}>
          <Text style={styles.gameQuestionText}>{question.text}</Text>
          <Text style={styles.gameQuestionSubtext}>
            Tiempo restante: {timeLeft.toFixed(1)}s
          </Text>
        </View>

        {mode === 'clasico' && (
          <View style={styles.gameInputBlock}>
            <TextInput
              keyboardType="numeric"
              placeholder="Escribí la respuesta"
              placeholderTextColor="#64748b"
              value={input}
              onChangeText={setInput}
              style={styles.input}
            />
            <Pressable onPress={handleSubmitClassic} style={[styles.primaryButton, { marginTop: 12 }]}>
              <Text style={styles.primaryButtonText}>Enviar</Text>
            </Pressable>
          </View>
        )}

        {mode === 'vf' && (
          <View style={styles.gameCenteredActions}>
            <Text style={{ color: '#cbd5e1', fontSize: 20, marginTop: 6, textAlign: 'center' }}>
              {question.text} = {proposed}
            </Text>
            <View style={styles.vfActionRow}>
              <Pressable onPress={() => handleSubmitVF('true')} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Verdadero</Text>
              </Pressable>
              <Pressable onPress={() => handleSubmitVF('false')} style={[styles.primaryButton, { backgroundColor: '#ef4444' }]}>
                <Text style={styles.primaryButtonText}>Falso</Text>
              </Pressable>
            </View>
          </View>
        )}

        {mode === 'multiple' && (
          <View style={styles.multipleGrid}>
            {choices.map((choice, indexChoice) => (
              <Pressable
                key={`${choice}-${indexChoice}`}
                onPress={() => handleSubmitMultiple(choice)}
                style={[styles.option, styles.multipleOption]}
              >
                <Text style={styles.multipleOptionLabel}>{String(choice)}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {mode === 'cronometro' && (
          <View style={styles.gameInputBlock}>
            <TextInput
              keyboardType="numeric"
              placeholder="Respuesta"
              placeholderTextColor="#64748b"
              value={input}
              onChangeText={setInput}
              style={styles.input}
            />
            <Pressable onPress={handleSubmitClassic} style={[styles.primaryButton, { marginTop: 12 }]}>
              <Text style={styles.primaryButtonText}>Enviar</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}





