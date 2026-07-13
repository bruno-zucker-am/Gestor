import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Layout raiz do aplicativo
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="administrador" />
      </Stack>
    </SafeAreaProvider>
  );
}
