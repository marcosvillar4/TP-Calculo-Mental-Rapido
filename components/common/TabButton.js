import { Pressable, Text } from 'react-native';

import styles from '../../App.styles';

export default function TabButton({ label, selected, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.historyTab,
        selected && styles.historyTabSelected,
        pressed && styles.historyTabPressed,
      ]}
    >
      <Text style={[styles.historyTabLabel, selected && styles.historyTabLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

