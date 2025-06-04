import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import logo from "../assets/images/logo.png";
import { useUser } from "../context/UserContext";

export default function LoginScreen() {
  const [id, setId] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { setUserType } = useUser();
  const router = useRouter();

  const handleLogin = () => {
    const idLower = id.trim().toLowerCase();

    if ((idLower === "cidadao" || idLower === "cidadão") && senha === "12345") {
      setUserType("cidadao");
      showLoadingAndWelcome("Cidadão", idLower, senha);
    } else if (idLower === "agente" && senha === "54321") {
      setUserType("agente");
      showLoadingAndWelcome("Agente", idLower, senha);
    } else {
      Alert.alert("Erro", "ID ou senha incorretos.");
    }
  };

  const showLoadingAndWelcome = (
    tipo: string,
    idLower: string,
    senha: string
  ) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setWelcomeMessage(`Seja bem-vindo, ${tipo}!`);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        if (idLower === "cidadao" && senha === "12345") {
          setUserType("cidadao");
          router.replace("/(tabs)/cidadao/dashboard");
        } else if (idLower === "agente" && senha === "54321") {
          setUserType("agente");
          router.replace("/(tabs)/agente/dashboard");
        }
      }, 1500);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <View style={styles.card}>
        <Text style={styles.title}>Faça Login</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person" size={20} color="#FFF" style={styles.icon} />
          <TextInput
            placeholder="ID"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={id}
            onChangeText={setId}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed"
            size={20}
            color="#FFF"
            style={styles.icon}
          />
          <TextInput
            placeholder="Senha"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!showSenha}
          />
          <TouchableOpacity onPress={() => setShowSenha((prev) => !prev)}>
            <Ionicons
              name={showSenha ? "eye" : "eye-off"}
              size={20}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={loading} transparent>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007FD7" />
        </View>
      </Modal>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.popup}>
            <Text style={styles.popupText}>{welcomeMessage}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001023",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFF",
    width: "95%",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 50,
    borderRadius: 28,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#00306A",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00306A",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 50,
    width: "100%",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#0077CC",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: 100,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 25,
    paddingHorizontal: 35,
    alignItems: "center",
    elevation: 10,
  },
  popupText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007FD7",
  },
});
