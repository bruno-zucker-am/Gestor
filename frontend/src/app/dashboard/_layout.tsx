import { Stack } from "expo-router";
// Componente de layout para a Dashboard, encapsulando as rotas filhas
export default function DashboardLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
