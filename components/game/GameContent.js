import { Text, View } from 'react-native';

import styles from '../../App.styles';
import ClassicMode from './ClassicMode';
import ChronoMode from './ChronoMode';
import MultipleChoiceMode from './MultipleChoiceMode';
import TrueFalseMode from './TrueFalseMode';

export function GameContent({
  mode,
  playerName,
  score,
  index,
  rounds,
  questionText,
  timeLeft,
  input,
  setInput,
  proposed,
  choices,
  onSubmitClassic,
  onSubmitVF,
  onSubmitMultiple,
}) {
  return (
    <View style={styles.gameScreenContainer}>
      <View style={[styles.card, styles.gameCard]}>
        <Text style={styles.kicker}>En juego · {playerName || 'Jugador'}</Text>
        <Text style={styles.title}>Puntaje: {score}</Text>
        <Text style={[styles.subtitle, { marginTop: 6, textAlign: 'center' }]}>Ronda: {index + 1}{mode === 'cronometro' ? '' : ` / ${rounds}`}</Text>

        <View style={styles.gameCenteredBlock}>
          <Text style={styles.gameQuestionText}>{questionText}</Text>
          <Text style={styles.gameQuestionSubtext}>Tiempo restante: {timeLeft.toFixed(1)}s</Text>
        </View>

        {mode === 'clasico' && (
          <ClassicMode input={input} setInput={setInput} onSubmitClassic={onSubmitClassic} />
        )}

        {mode === 'vf' && (
          <TrueFalseMode questionText={questionText} proposed={proposed} onSubmitVF={onSubmitVF} />
        )}

        {mode === 'multiple' && (
          <MultipleChoiceMode choices={choices} onSubmitMultiple={onSubmitMultiple} />
        )}

        {mode === 'cronometro' && (
          <ChronoMode input={input} setInput={setInput} onSubmitClassic={onSubmitClassic} />
        )}
      </View>
    </View>
  );
}

