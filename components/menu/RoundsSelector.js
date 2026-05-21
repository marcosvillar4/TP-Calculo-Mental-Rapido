import { Pressable, Text, TextInput, View } from 'react-native';

import styles from '../../App.styles';

export default function RoundsSelector({ roundsText, setRoundsText, maxRounds }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Cantidad máxima de rondas</Text>
      <View style={styles.roundsRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Disminuir rondas"
          onPress={() => setRoundsText(String(Math.max(1, maxRounds - 1)))}
          style={({ pressed }) => [styles.roundButton, pressed && styles.roundButtonPressed]}
        >
          <Text style={styles.roundButtonText}>−</Text>
        </Pressable>

        <TextInput
          accessibilityLabel="Cantidad máxima de rondas"
          keyboardType="number-pad"
          value={roundsText}
          onChangeText={(text) => setRoundsText(text.replace(/[^0-9]/g, ''))}
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
          onPress={() => setRoundsText(String(Math.min(99, maxRounds + 1)))}
          style={({ pressed }) => [styles.roundButton, pressed && styles.roundButtonPressed]}
        >
          <Text style={styles.roundButtonText}>+</Text>
        </Pressable>
      </View>
      <Text style={styles.helperText}>Máximo permitido: 99 rondas.</Text>
    </View>
  );
}

