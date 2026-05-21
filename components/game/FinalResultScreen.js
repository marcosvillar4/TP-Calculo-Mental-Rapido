import { Pressable, Text, View } from 'react-native';

import styles from '../../App.styles';
import { formatSeconds } from '../../utils/gameUtils';

export function FinalResultScreen({ reason, score, averageResponseTime, questionsPlayed, playerName, mode, onBackToMenu }) {
  const titleByReason = {
    completed: '¡Partida finalizada!',
    lost: 'Perdiste la partida',
    timeout: 'Se acabó el tiempo',
  };

  return (
    <View style={styles.gameScreenContainer}>
      <View style={[styles.card, styles.gameCard]}>
        <Text style={styles.kicker}>Resultado final</Text>
        <Text style={styles.title}>{titleByReason[reason] ?? 'Partida finalizada'}</Text>
        <Text style={[styles.subtitle, { marginTop: 10, textAlign: 'center' }]}>
          {playerName || 'Jugador'} completó la partida en el modo {mode}.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen</Text>
          <Text style={styles.summaryText}>Puntuación final: {score}</Text>
          <Text style={styles.summaryText}>Tiempo de respuesta promedio: {formatSeconds(averageResponseTime)}</Text>
          <Text style={styles.summaryText}>Preguntas jugadas: {questionsPlayed}</Text>
        </View>

        <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={onBackToMenu}>
          <Text style={styles.primaryButtonText}>Volver al menú principal</Text>
        </Pressable>
      </View>
    </View>
  );
}

