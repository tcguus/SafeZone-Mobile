import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import axios from "axios";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

const API_URL = "https://safezone-api-r535.onrender.com";

interface Zona {
  id?: number;
  nome: string;
  tipoEvento: string;
  status: string;
  coordenadas: string;
}

export default function ZonasScreen() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Zona>({
    nome: "",
    tipoEvento: "",
    status: "Ativo",
    coordenadas: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [zonaSelecionada, setZonaSelecionada] = useState<Zona | null>(null);

  const carregarZonas = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/ZonaDeRisco`);
      let lista: Zona[] = [];
      if (Array.isArray(res.data)) {
        lista = res.data;
      } else if (
        res.data &&
        typeof res.data === "object" &&
        Array.isArray((res.data as any).$values)
      ) {
        lista = (res.data as any).$values;
      }
      setZonas(lista.filter((z: Zona) => z.status === "Ativo"));
    } catch {
      Alert.alert("Erro ao carregar zonas");
    } finally {
      setLoading(false);
    }
  };

  const cadastrarZona = async () => {
    if (!form.nome || !form.tipoEvento || !form.coordenadas) {
      Alert.alert("Preencha todos os campos");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/ZonaDeRisco`, form);
      setForm({ nome: "", tipoEvento: "", status: "Ativo", coordenadas: "" });
      carregarZonas();
    } catch {
      Alert.alert("Erro ao cadastrar zona");
    }
  };

  const excluirZona = async (id?: number) => {
    if (!id) return;

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta zona?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/api/ZonaDeRisco/${id}`);
              carregarZonas();
            } catch {
              Alert.alert("Erro ao excluir zona");
            }
          },
        },
      ]
    );
  };

  const abrirModalEdicao = (zona: Zona) => {
    setZonaSelecionada(zona);
    setModalVisible(true);
  };

  const salvarEdicao = async () => {
    if (!zonaSelecionada || !zonaSelecionada.id) return;

    try {
      await axios.put(
        `${API_URL}/api/ZonaDeRisco/${zonaSelecionada.id}`,
        zonaSelecionada
      );
      setModalVisible(false);
      carregarZonas();
    } catch {
      Alert.alert("Erro ao editar zona");
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarZonas();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Zonas de Risco</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007FD7" />
      ) : zonas.length === 0 ? (
        <Text style={styles.noData}>Atualmente nenhuma zona em risco.</Text>
      ) : (
        <FlatList
          data={zonas}
          keyExtractor={(item) => item.id?.toString() || item.nome}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => abrirModalEdicao(item)}
              >
                <Ionicons name="create" size={20} color="#666" />
              </TouchableOpacity>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardText}>Evento: {item.tipoEvento}</Text>
              <Text style={styles.cardText}>
                Coordenadas: {item.coordenadas}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => excluirZona(item.id)}
              >
                <Ionicons name="trash" size={20} color="#ff5555" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Cadastrar Nova Zona</Text>
        <TextInput
          placeholder="Zona (ex: Zona Norte, Zona Sul...)"
          value={form.nome}
          onChangeText={(t) => setForm({ ...form, nome: t })}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Tipo de Evento"
          value={form.tipoEvento}
          onChangeText={(t) => setForm({ ...form, tipoEvento: t })}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Coordenadas (ex: -23.55,-46.63)"
          value={form.coordenadas}
          onChangeText={(t) => setForm({ ...form, coordenadas: t })}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.button} onPress={cadastrarZona}>
          <Text style={styles.buttonText}>Cadastrar Zona</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Editar Zona</Text>
            <TextInput
              placeholder="Nome"
              value={zonaSelecionada?.nome || ""}
              onChangeText={(t) =>
                setZonaSelecionada({ ...zonaSelecionada!, nome: t })
              }
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Tipo de Evento"
              value={zonaSelecionada?.tipoEvento || ""}
              onChangeText={(t) =>
                setZonaSelecionada({ ...zonaSelecionada!, tipoEvento: t })
              }
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Coordenadas"
              value={zonaSelecionada?.coordenadas || ""}
              onChangeText={(t) =>
                setZonaSelecionada({ ...zonaSelecionada!, coordenadas: t })
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
