import { ScrollView, Text, View } from 'react-native';

import styles from '../../App.styles';
import { formatSeconds } from '../../utils/gameUtils';
import { DIFFICULTIES, MODES } from '../../constants/gameOptions';
import DifficultySelector from './DifficultySelector';
import HistorySection from './HistorySection';
import ModeSelector from './ModeSelector';
import PlayerNameField from './PlayerNameField';
import RoundsSelector from './RoundsSelector';
import StartGameButton from './StartGameButton';

export default function MainMenu({
  selectedMode,
  setSelectedMode,
  selectedDifficulty,
  setSelectedDifficulty,
  playerName,
  setPlayerName,
  roundsText,
  setRoundsText,
  maxRounds,
  timePerQuestion,
  onStartGame,
}) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.kicker}>Desafio Calculo Mental</Text>
          <Text style={styles.title}>Menú principal</Text>


          <PlayerNameField value={playerName} onChangeText={setPlayerName} />
          <RoundsSelector roundsText={roundsText} setRoundsText={setRoundsText} maxRounds={maxRounds} />
          <DifficultySelector selectedDifficulty={selectedDifficulty} setSelectedDifficulty={setSelectedDifficulty} />
          <ModeSelector selectedMode={selectedMode} setSelectedMode={setSelectedMode} />

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen de partida</Text>
            <Text style={styles.summaryText}>Jugador: {playerName.trim() || 'Jugador'}</Text>
            <Text style={styles.summaryText}>
              Modo: {MODES.find((mode) => mode.id === selectedMode)?.label ?? selectedMode}
            </Text>
            <Text style={styles.summaryText}>
              Dificultad: {DIFFICULTIES.find((difficulty) => difficulty.id === selectedDifficulty)?.label ?? selectedDifficulty}
            </Text>
            <Text style={styles.summaryText}>Tiempo por ronda: {formatSeconds(timePerQuestion)}</Text>
            <Text style={styles.summaryText}>Rondas máximas: {maxRounds}</Text>
          </View>

          <HistorySection />

          <StartGameButton
            onPress={() => {
              onStartGame({
                mode: selectedMode,
                difficulty: selectedDifficulty,
                rounds: maxRounds,
                playerName: playerName.trim() || 'Jugador',
                timePerQuestion,
              });
            }}
          />

          <Text style={styles.footerNote}>Por ahora este archivo solo define el menú principal.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
