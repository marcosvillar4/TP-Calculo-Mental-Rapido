import { Text, TextInput, View } from 'react-native';

import styles from '../../App.styles';

export default function TimePerQuestionField({ value, onChangeText }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tiempo por ronda (segundos)</Text>
      <TextInput
        accessibilityLabel="Tiempo por ronda"
        keyboardType="number-pad"
        value={value}
        onChangeText={onChangeText}
        style={styles.roundsInput}
        textAlign="center"
        maxLength={3}
      />
      <Text style={styles.helperText}>Tiempo en segundos que tiene el jugador para responder cada cálculo.</Text>
    </View>
  );
}

