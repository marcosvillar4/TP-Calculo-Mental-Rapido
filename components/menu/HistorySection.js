import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../../App.styles';
import TabButton from '../common/TabButton';
import { MODES } from '../../constants/gameOptions';
import { formatSeconds } from '../../utils/gameUtils';
import { useEffect } from 'react';

export default function HistorySection() {
  const [historyRecords, setHistoryRecords] = useState([]);
  const [selectedHistoryMode, setSelectedHistoryMode] = useState(MODES[0].id);

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
    loadHistory();
  }, []);

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

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Historial</Text>
      <View style={styles.historyTabs}>
        {MODES.map((mode) => (
          <TabButton
            key={mode.id}
            label={mode.label}
            selected={selectedHistoryMode === mode.id}
            onPress={() => setSelectedHistoryMode(mode.id)}
          />
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
                Tiempo promedio de respuesta: {formatSeconds(record.averageResponseTime)}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.historyEmptyState}>
            <Text style={styles.historyEmptyText}>No hay partidas guardadas para este modo todavía.</Text>
          </View>
        )}
      </View>
    </View>
  );
}
