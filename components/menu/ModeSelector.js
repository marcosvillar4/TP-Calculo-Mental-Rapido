import { Text, View } from 'react-native';

import styles from '../../App.styles';
import MenuOption from '../common/MenuOption';
import { MODES } from '../../constants/gameOptions';

export default function ModeSelector({ selectedMode, setSelectedMode }) {
  return (
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
  );
}

