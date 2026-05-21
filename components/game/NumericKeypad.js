import { Pressable, Text, View } from 'react-native';

import styles from '../../App.styles';

const DIGITS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['±', '0', '⌫'],
];

export default function NumericKeypad({ value, onChangeText, onSubmit, submitLabel = 'Enviar' }) {
  const canSubmit = value !== '' && value !== '-';

  const appendDigit = (digit) => {
    onChangeText(`${value}${digit}`);
  };

  const backspace = () => {
    onChangeText(value.slice(0, -1));
  };

  const clear = () => {
    onChangeText('');
  };

  const toggleSign = () => {
    if (!value) {
      onChangeText('-');
      return;
    }

    if (value.startsWith('-')) {
      onChangeText(value.slice(1));
      return;
    }

    onChangeText(`-${value}`);
  };

  const handleKeyPress = (key) => {
    if (key === '⌫') {
      backspace();
      return;
    }

    if (key === '±') {
      toggleSign();
      return;
    }

    appendDigit(key);
  };

  return (
    <View style={styles.keypadContainer}>
      <View style={styles.keypadDisplayRow}>
        <Text style={styles.keypadLabel}>Respuesta</Text>
        <Text style={styles.keypadValue}>{value || '—'}</Text>
      </View>

      <View style={styles.keypadGrid}>
        {DIGITS.flat().map((key) => {
          const isSpecial = key === '±' || key === '⌫';
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={key === '⌫' ? 'Borrar' : key === '±' ? 'Cambiar signo' : `Tecla ${key}`}
              onPress={() => handleKeyPress(key)}
              style={({ pressed }) => [
                styles.keypadButton,
                isSpecial && styles.keypadButtonSpecial,
                pressed && styles.keypadButtonPressed,
              ]}
            >
              <Text style={styles.keypadButtonText}>{key}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.keypadActionsRow}>
        <Pressable accessibilityRole="button" onPress={clear} style={({ pressed }) => [styles.keypadActionButton, pressed && styles.keypadButtonPressed]}>
          <Text style={styles.keypadActionText}>Limpiar</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (!canSubmit) {
              return;
            }

            onSubmit();
          }}
          style={({ pressed }) => [
            styles.keypadActionButton,
            styles.keypadActionButtonPrimary,
            !canSubmit && { opacity: 0.55 },
            pressed && styles.keypadButtonPressed,
          ]}
        >
          <Text style={styles.keypadActionTextPrimary}>{submitLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}


