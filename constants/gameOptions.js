export const MODES = [
  { id: 'clasico', label: 'Modo clásico', description: 'Operaciones rápidas y directas.' },
  { id: 'vf', label: 'Modo Verdadero/Falso', description: 'Elegí si la cuenta es correcta o no.' },
  { id: 'multiple', label: 'Modo Multiple Choice', description: 'Seleccioná la respuesta correcta.' },
  { id: 'cronometro', label: 'Modo contra reloj continuo', description: 'Jugá sin pausas mientras corre el tiempo.' },
];

export const DIFFICULTIES = [
  { id: 'facil', label: 'Fácil' },
  { id: 'medio', label: 'Medio' },
  { id: 'dificil', label: 'Difícil' },
];

export const TIME_BY_DIFFICULTY = {
  facil: 45,
  medio: 30,
  dificil: 15,
};

export const getTimePerQuestionByDifficulty = (difficultyId) =>
  TIME_BY_DIFFICULTY[difficultyId] ?? TIME_BY_DIFFICULTY.medio;

