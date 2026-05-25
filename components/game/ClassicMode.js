import { Platform, Pressable, Text, TextInput, View } from 'react-native';

import styles from '../../App.styles';
import NumericKeypad from './NumericKeypad';

export default function ClassicMode({ input, setInput, onSubmitClassic }) {
  const useCustomKeypad = Platform.OS !== 'web';

  return (
    <View style={styles.gameInputBlock}>
      {useCustomKeypad ? (
        <NumericKeypad value={input} onChangeText={setInput} onSubmit={onSubmitClassic} submitLabel="Enviar" />
      ) : (
        <>
          <TextInput
            keyboardType="numeric"
            placeholder="Escribí la respuesta"
            placeholderTextColor="#64748b"
            value={input}
            onChangeText={setInput}
            style={styles.input}
          />
          <Pressable onPress={onSubmitClassic} style={[styles.primaryButton, { marginTop: 12 }]}>
            <Text style={styles.primaryButtonText}>Enviar</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

