import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from './src/app/navigation/RootNavigator';
import { useProfileStore } from './src/entities/profile/model/useProfileStore';
import { migrate } from './src/shared/db/client';

migrate();
useProfileStore.getState().load();

export default function App() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
