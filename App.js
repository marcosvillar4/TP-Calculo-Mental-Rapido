import { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './App.styles';
import GameScreen from './GameScreen';

const MODES = [
  { id: 'clasico', label: 'Modo clásico', description: 'Operaciones rápidas y directas.' },
  { id: 'vf', label: 'Modo Verdadero/Falso', description: 'Elegí si la cuenta es correcta o no.' },
  { id: 'multiple', label: 'Modo Multiple Choice', description: 'Seleccioná la respuesta correcta.' },
  { id: 'cronometro', label: 'Modo contra reloj continuo', description: 'Jugá sin pausas mientras corre el tiempo.' },
];

const DIFFICULTIES = [
  { id: 'facil', label: 'Fácil' },
  { id: 'medio', label: 'Medio' },
  { id: 'dificil', label: 'Difícil' },
];

const clampRounds = (value) => Math.min(99, Math.max(1, value));

const sanitizeRoundsInput = (text) => {
  const digits = text.replace(/[^0-9]/g, '');

  if (!digits) {
    return '';
  }

  return String(clampRounds(Number.parseInt(digits, 10)));
};

function MenuOption({ label, description, selected, onPress, compact = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        compact && styles.optionCompact,
        selected && styles.optionSelected,
        pressed && styles.optionPressed,
      ]}
    >
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
      {Boolean(description) && <Text style={styles.optionDescription}>{description}</Text>}
    </Pressable>
  );
}

function formatAverageTime(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return '—';
  }

  return `${numeric.toFixed(1)}s`;
}

export default function App() {
  const [selectedMode, setSelectedMode] = useState(MODES[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTIES[1].id);
  const [playerName, setPlayerName] = useState('');
  const [roundsText, setRoundsText] = useState('10');
  const [timePerQuestionText, setTimePerQuestionText] = useState('8');
  const [runningSettings, setRunningSettings] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [selectedHistoryMode, setSelectedHistoryMode] = useState(MODES[0].id);

  const maxRounds = useMemo(() => {
    const parsed = Number.parseInt(roundsText, 10);
    return Number.isFinite(parsed) ? clampRounds(parsed) : 1;
  }, [roundsText]);

  const timePerQuestion = useMemo(() => {
    const parsed = Number.parseInt(timePerQuestionText, 10);
    return Number.isFinite(parsed) ? Math.max(1, parsed) : 8;
  }, [timePerQuestionText]);

  const changeRounds = (delta) => {
    setRoundsText(String(clampRounds(maxRounds + delta)));
  };

  const playerLabel = playerName.trim() || 'Jugador';
  const modeLabel = MODES.find((mode) => mode.id === selectedMode)?.label ?? MODES[0].label;
  const difficultyLabel =
    DIFFICULTIES.find((difficulty) => difficulty.id === selectedDifficulty)?.label ??
    DIFFICULTIES[1].label;

  const loadHistory = async () => {
    try {
      const raw = await AsyncStorage.getItem('tp_scores');
      const parsed = raw ? JSON.parse(raw) : [];
      setHistoryRecords(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.warn('Error loading history', error);
      setHistoryRecords([]);
    }
  };

  useEffect(() => {
    if (!runningSettings) {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningSettings]);

  const historyBySelectedMode = useMemo(() => {
    return [...historyRecords]
      .filter((record) => record.mode === selectedHistoryMode)
      .sort((a, b) => {
        const scoreA = Number(a.score) || 0;
        const scoreB = Number(b.score) || 0;
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }

        const timeA = Number(a.averageResponseTime);
        const timeB = Number(b.averageResponseTime);
        if (Number.isFinite(timeA) && Number.isFinite(timeB) && timeA !== timeB) {
          return timeA - timeB;
        }

        return 0;
      });
  }, [historyRecords, selectedHistoryMode]);

  if (runningSettings) {
    return <GameScreen settings={runningSettings} onExit={() => setRunningSettings(null)} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.kicker}>Juego de cálculos rápidos</Text>
          <Text style={styles.title}>Menú principal</Text>
          <Text style={styles.subtitle}>
            Configurá el modo de juego, la dificultad, la cantidad máxima de rondas y el nombre del jugador.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nombre del jugador</Text>
            <TextInput
              accessibilityLabel="Nombre del jugador"
              placeholder="Escribí tu nombre"
              placeholderTextColor="#64748b"
              value={playerName}
              onChangeText={setPlayerName}
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cantidad máxima de rondas</Text>
            <View style={styles.roundsRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Disminuir rondas"
                onPress={() => changeRounds(-1)}
                style={({ pressed }) => [styles.roundButton, pressed && styles.roundButtonPressed]}
              >
                <Text style={styles.roundButtonText}>−</Text>
              </Pressable>

              <TextInput
                accessibilityLabel="Cantidad máxima de rondas"
                keyboardType="number-pad"
                value={roundsText}
                onChangeText={(text) => setRoundsText(sanitizeRoundsInput(text))}
                onBlur={() => {
                  if (!roundsText) {
                    setRoundsText('1');
                  }
                }}
                style={styles.roundsInput}
                textAlign="center"
                maxLength={2}
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Aumentar rondas"
                onPress={() => changeRounds(1)}
                style={({ pressed }) => [styles.roundButton, pressed && styles.roundButtonPressed]}
              >
                <Text style={styles.roundButtonText}>+</Text>
              </Pressable>
            </View>
            <Text style={styles.helperText}>Máximo permitido: 99 rondas.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tiempo por ronda (segundos)</Text>
            <TextInput
              accessibilityLabel="Tiempo por ronda"
              keyboardType="number-pad"
              value={timePerQuestionText}
              onChangeText={(text) => setTimePerQuestionText(text.replace(/[^0-9]/g, ''))}
              style={styles.roundsInput}
              textAlign="center"
              maxLength={3}
            />
            <Text style={styles.helperText}>Tiempo en segundos que tiene el jugador para responder cada cálculo.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dificultad</Text>
            <View style={styles.difficultyRow}>
              {DIFFICULTIES.map((difficulty) => (
                <View key={difficulty.id} style={styles.flexItem}>
                  <MenuOption
                    compact
                    label={difficulty.label}
                    selected={selectedDifficulty === difficulty.id}
                    onPress={() => setSelectedDifficulty(difficulty.id)}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Modo de juego</Text>
            <View style={styles.modeGrid}>
              {MODES.map((mode) => (
                <MenuOption
                  key={mode.id}
                  label={mode.label}
                  description={mode.description}
                  selected={selectedMode === mode.id}
                  onPress={() => setSelectedMode(mode.id)}
                />
              ))}
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen de partida</Text>
            <Text style={styles.summaryText}>Jugador: {playerLabel}</Text>
            <Text style={styles.summaryText}>Modo: {modeLabel}</Text>
            <Text style={styles.summaryText}>Dificultad: {difficultyLabel}</Text>
            <Text style={styles.summaryText}>Rondas máximas: {maxRounds}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historial</Text>
            <View style={styles.historyTabs}>
              {MODES.map((mode) => (
                <Pressable
                  key={mode.id}
                  accessibilityRole="button"
                  onPress={() => setSelectedHistoryMode(mode.id)}
                  style={({ pressed }) => [
                    styles.historyTab,
                    selectedHistoryMode === mode.id && styles.historyTabSelected,
                    pressed && styles.historyTabPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.historyTabLabel,
                      selectedHistoryMode === mode.id && styles.historyTabLabelSelected,
                    ]}
                  >
                    {mode.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.historyList}>
              {historyBySelectedMode.length > 0 ? (
                historyBySelectedMode.map((record, index) => (
                  <View key={`${record.date}-${index}`} style={styles.historyItem}>
                    <View style={styles.historyItemTop}>
                      <Text style={styles.historyPlayer}>{record.name || 'Jugador'}</Text>
                      <View style={styles.historyScoreBadge}>
                        <Text style={styles.historyScoreText}>{Number(record.score) || 0}</Text>
                      </View>
                    </View>
                    <Text style={styles.historyMeta}>
                      Tiempo promedio de respuesta: {formatAverageTime(record.averageResponseTime)}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.historyEmptyState}>
                  <Text style={styles.historyEmptyText}>
                    No hay partidas guardadas para este modo todavía.
                  </Text>
                </View>
              )}
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            style={styles.primaryButton}
            onPress={() => {
              // assemble settings and start game screen
              setRunningSettings({
                mode: selectedMode,
                difficulty: selectedDifficulty,
                rounds: maxRounds,
                playerName: playerName.trim() || 'Jugador',
                timePerQuestion: timePerQuestion,
              });
            }}
          >
            <Text style={styles.primaryButtonText}>Comenzar partida</Text>
          </Pressable>

          <Text style={styles.footerNote}>Por ahora este archivo solo define el menú principal.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
