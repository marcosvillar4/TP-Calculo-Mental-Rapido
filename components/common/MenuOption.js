import { Pressable, Text } from 'react-native';

import styles from '../../App.styles';

export default function MenuOption({ label, description, selected, onPress, compact = false }) {
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

