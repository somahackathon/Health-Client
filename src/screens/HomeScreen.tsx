import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../navigation/RootNavigator';
import { useCounterStore } from '../store/useCounterStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Client</Text>
      <Text style={styles.count}>Count: {count}</Text>
      <Button title="Increment" onPress={increment} />
      <View style={styles.spacer} />
      <Button title="Go to Detail" onPress={() => navigation.navigate('Detail')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  count: {
    fontSize: 16,
  },
  spacer: {
    height: 8,
  },
});
