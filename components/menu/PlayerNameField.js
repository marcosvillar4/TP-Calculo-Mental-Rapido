import { Text, TextInput, View } from 'react-native';

import styles from '../../App.styles';

export default function PlayerNameField({ value, onChangeText }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Nombre del jugador</Text>
      <TextInput
        accessibilityLabel="Nombre del jugador"
        placeholder="Escribí tu nombre"
        placeholderTextColor="#64748b"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
      />
    </View>
  );
}
