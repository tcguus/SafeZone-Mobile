import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import axios from "axios";
import { useFocusEffect } from "expo-router";

const API_URL = "https://safezone-api-r535.onrender.com";

interface Kit {
  id?: number;
  tipo: string;
  quantidade: number;
  localEstoque: string;
  status?: string;
}

export default function KitsCidadaoScreen() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Kit>({
    tipo: "",
    quantidade: 1,
    localEstoque: "",
    status: "Em análise",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [kitSelecionado, setKitSelecionado] = useState<Kit | null>(null);

  const carregarKits = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/KitEmergencia`);
      let lista: Kit[] = [];
      if (Array.isArray(res.data)) {
        lista = res.data;
      } else if (
        res.data &&
        typeof res.data === "object" &&
        "$values" in res.data &&
        Array.isArray((res.data as any).$values)
      ) {
        lista = (res.data as any).$values;
      }
      setKits(lista);
    } catch {
      Alert.alert("Erro ao carregar kits");
    } finally {
      setLoading(false);
    }
  };

  const cadastrarKit = async () => {
    const { tipo, quantidade, localEstoque } = form;
    if (!tipo || !quantidade || !localEstoque) {
      Alert.alert("Preencha todos os campos");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/KitEmergencia`, {
        tipo,
        quantidade,
        localEstoque,
        status: "Em análise",
      });
      setForm({
        tipo: "",
        quantidade: 1,
        localEstoque: "",
        status: "Em análise",
      });
      carregarKits();
    } catch {
      Alert.alert("Erro ao solicitar kit");
    }
  };

  const excluirKit = async (id?: number) => {
    if (!id) return;
    Alert.alert("Confirmar exclusão", "Deseja excluir este pedido de kit?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/KitEmergencia/${id}`);
            carregarKits();
          } catch {
            Alert.alert("Erro ao excluir pedido");
          }
        },
      },
    ]);
  };

  const abrirModalEdicao = (kit: Kit) => {
    setKitSelecionado(kit);
    setModalVisible(true);
  };

  const salvarEdicao = async () => {
    if (!kitSelecionado || !kitSelecionado.id) return;
    try {
      await axios.put(
        `${API_URL}/api/KitEmergencia/${kitSelecionado.id}`,
        kitSelecionado
      );
      setModalVisible(false);
      carregarKits();
    } catch {
      Alert.alert("Erro ao editar pedido");
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarKits();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Meus Pedidos de Kit</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007FD7" />
      ) : kits.length === 0 ? (
        <Text style={styles.noData}>Nenhum pedido feito ainda.</Text>
      ) : (
        <FlatList
          data={kits}
          keyExtractor={(item) => item.id?.toString() || item.tipo}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => excluirKit(item.id)}
              >
                <Ionicons name="trash" size={20} color="#ff5555" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => abrirModalEdicao(item)}
              >
                <Ionicons name="create" size={20} color="#888" />
              </TouchableOpacity>
              <Text style={styles.cardTitle}>{item.tipo}</Text>
              <Text style={styles.cardText}>Quantidade: {item.quantidade}</Text>
              <Text style={styles.cardText}>Estoque: {item.localEstoque}</Text>
              <Text style={styles.cardText}>Status: Em análise</Text>
            </View>
          )}
        />
      )}

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Solicitar Novo Kit</Text>
        <TextInput
          placeholder="Tipo do Kit (ex: Água, Alimento...)"
          value={form.tipo}
          onChangeText={(t) => setForm({ ...form, tipo: t })}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Quantidade"
          value={form.quantidade.toString()}
          onChangeText={(t) =>
            setForm({ ...form, quantidade: parseInt(t) || 1 })
          }
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Local de Estoque"
          value={form.localEstoque}
          onChangeText={(t) => setForm({ ...form, localEstoque: t })}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.button} onPress={cadastrarKit}>
          <Text style={styles.buttonText}>Solicitar Kit</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Editar Pedido</Text>
            <TextInput
              placeholder="Tipo do Kit"
              value={kitSelecionado?.tipo || ""}
              onChangeText={(t) =>
                setKitSelecionado({ ...kitSelecionado!, tipo: t })
              }
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Quantidade"
              value={kitSelecionado?.quantidade.toString() || ""}
              onChangeText={(t) =>
                setKitSelecionado({
                  ...kitSelecionado!,
                  quantidade: parseInt(t) || 1,
                })
              }
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Local de Estoque"
              value={kitSelecionado?.localEstoque || ""}
              onChangeText={(t) =>
                setKitSelecionado({ ...kitSelecionado!, localEstoque: t })
              }
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#00B131" }]}
                onPress={salvarEdicao}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#888" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 22,
  },
  noData: {
    color: "#aaa",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#0A1C3B",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    position: "relative",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  editIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  form: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#0A1C3B",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007FD7",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: 150,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#001023",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    borderWidth: 1,
    borderColor: "#007FD7",
  },
});
