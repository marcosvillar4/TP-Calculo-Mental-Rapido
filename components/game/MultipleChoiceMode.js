import { Pressable, Text, View } from 'react-native';

import styles from '../../App.styles';

export default function MultipleChoiceMode({ choices, onSubmitMultiple }) {
  return (
    <View style={styles.multipleGrid}>
      {choices.map((choice, indexChoice) => (
        <Pressable
          key={`${choice}-${indexChoice}`}
          onPress={() => onSubmitMultiple(choice)}
          style={[styles.option, styles.multipleOption]}
        >
          <Text style={styles.multipleOptionLabel}>{String(choice)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

