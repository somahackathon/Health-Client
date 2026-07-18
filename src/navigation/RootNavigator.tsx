import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from '../components/Icon';
import { colors } from '../theme/colors';
import HomeScreen from '../screens/HomeScreen';
import InputScreen from '../screens/InputScreen';
import PlanScreen from '../screens/PlanScreen';
import PostureScreen from '../screens/PostureScreen';

export type RootTabParamList = {
  Home: undefined;
  Input: undefined;
  Plan: undefined;
  Posture: undefined;
};

const TAB_ICONS: Record<keyof RootTabParamList, { icon: string; iconActive: string }> = {
  Home: { icon: 'home', iconActive: 'home-fill' },
  Input: { icon: 'pencil', iconActive: 'pencil-fill' },
  Plan: { icon: 'sparkle', iconActive: 'sparkle-fill' },
  Posture: { icon: 'camera', iconActive: 'camera-fill' },
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryNormal,
        tabBarInactiveTintColor: colors.labelAssistive,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          height: 56 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
          borderTopColor: colors.lineNormal,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const meta = TAB_ICONS[route.name as keyof RootTabParamList];
          return <Icon name={focused ? meta.iconActive : meta.icon} size={size} color={color} />;
        },
        tabBarButton: (props) => (
          <PlatformPressable {...props} android_ripple={{ color: 'transparent' }} pressOpacity={1} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
      <Tab.Screen name="Input" component={InputScreen} options={{ title: '기록' }} />
      <Tab.Screen name="Plan" component={PlanScreen} options={{ title: 'AI 계획' }} />
      <Tab.Screen name="Posture" component={PostureScreen} options={{ title: '자세교정' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
