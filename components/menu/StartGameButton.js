import { Pressable, Text } from 'react-native';

import styles from '../../App.styles';

export default function StartGameButton({ onPress }) {
  return (
    <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={onPress}>
      <Text style={styles.primaryButtonText}>Comenzar partida</Text>
    </Pressable>
  );
}

