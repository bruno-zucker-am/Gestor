import { Redirect } from "expo-router";

// Redireciona para a tela de login
export default function Index() {
  return <Redirect href="/login" />;
}
