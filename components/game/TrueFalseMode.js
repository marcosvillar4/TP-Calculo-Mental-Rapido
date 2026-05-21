import { Pressable, Text, View } from 'react-native';

import styles from '../../App.styles';

export default function TrueFalseMode({ questionText, proposed, onSubmitVF }) {
  return (
    <View style={styles.gameCenteredActions}>
      <Text style={{ color: '#cbd5e1', fontSize: 20, marginTop: 6, textAlign: 'center' }}>
        {questionText} = {proposed}
      </Text>
      <View style={styles.vfActionRow}>
        <Pressable onPress={() => onSubmitVF('true')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Verdadero</Text>
        </Pressable>
        <Pressable onPress={() => onSubmitVF('false')} style={[styles.primaryButton, { backgroundColor: '#ef4444' }]}>
          <Text style={styles.primaryButtonText}>Falso</Text>
        </Pressable>
      </View>
    </View>
  );
}

