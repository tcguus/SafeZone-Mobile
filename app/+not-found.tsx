import { Link, Stack } from "expo-router";
import { Image, StyleSheet, View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Página não encontrada" }} />
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Tela não encontrada</Text>
        <Text style={styles.subtitle}>
          A página que você está tentando acessar não existe.
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Voltar para a tela inicial</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#001023",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
  },
  link: {
    marginTop: 30,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  linkText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
