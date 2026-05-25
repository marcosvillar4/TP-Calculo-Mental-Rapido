import { Text, View } from 'react-native';

import styles from '../../App.styles';
import MenuOption from '../common/MenuOption';
import { DIFFICULTIES } from '../../constants/gameOptions';

export default function DifficultySelector({ selectedDifficulty, setSelectedDifficulty }) {
  return (
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
  );
}
