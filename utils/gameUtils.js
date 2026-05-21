import AsyncStorage from '@react-native-async-storage/async-storage';

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateOperation(difficulty) {
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

export function makeChoices(correct) {
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

export async function saveScore(record) {
  try {
    const raw = await AsyncStorage.getItem('tp_scores');
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(record);
    await AsyncStorage.setItem('tp_scores', JSON.stringify(arr));
  } catch (error) {
    console.warn('Error saving score', error);
  }
}

export function calculateScoreDelta({ correct, timeUsed, timePerQuestion, noAnswer = false }) {
  if (noAnswer) {
    return -50;
  }

  if (correct) {
    return timeUsed < 0.75 * timePerQuestion ? 100 : 70;
  }

  return -30;
}

export function calculateAverageResponseTime(times) {
  if (!times.length) {
    return 0;
  }

  return times.reduce((acc, value) => acc + value, 0) / times.length;
}

export function formatSeconds(seconds) {
  const numeric = Number(seconds);

  if (!Number.isFinite(numeric)) {
    return '—';
  }

  return `${numeric.toFixed(1)}s`;
}


