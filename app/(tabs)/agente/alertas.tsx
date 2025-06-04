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

interface Alerta {
  id?: number;
  titulo: string;
  descricao: string;
  nivelGravidade: string;
  dataHora: string;
  zonaDeRiscoId: number;
}

export default function AlertasScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertaSelecionado, setAlertaSelecionado] = useState<Alerta | null>(
    null
  );

  const abrirModalEdicao = (alerta: Alerta) => {
    setAlertaSelecionado(alerta);
    setModalVisible(true);
  };

  const salvarEdicao = async () => {
    if (!alertaSelecionado || !alertaSelecionado.id) return;

    try {
      await axios.put(
        `${API_URL}/api/Alerta/${alertaSelecionado.id}`,
        alertaSelecionado
      );
      setModalVisible(false);
      carregarAlertas();
    } catch {
      Alert.alert("Erro ao salvar alterações");
    }
  };
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Alerta>({
    titulo: "",
    descricao: "",
    nivelGravidade: "",
    dataHora: new Date().toISOString(),
    zonaDeRiscoId: 1,
  });

  const carregarAlertas = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Alerta`);
      let lista: Alerta[] = [];
      if (Array.isArray(res.data)) {
        lista = res.data;
      } else if (
        res.data &&
        typeof res.data === "object" &&
        Array.isArray((res.data as any).$values)
      ) {
        lista = (res.data as any).$values;
      }
      setAlertas(lista);
    } catch {
      Alert.alert("Erro ao carregar alertas");
    } finally {
      setLoading(false);
    }
  };

  const cadastrarAlerta = async () => {
    const { titulo, descricao, nivelGravidade, dataHora, zonaDeRiscoId } = form;
    if (!titulo || !descricao || !nivelGravidade || !zonaDeRiscoId) {
      Alert.alert("Preencha todos os campos");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/Alerta`, {
        titulo,
        descricao,
        nivelGravidade,
        dataHora,
        zonaDeRiscoId: Number(zonaDeRiscoId),
      });
      setForm({
        titulo: "",
        descricao: "",
        nivelGravidade: "",
        dataHora: new Date().toISOString(),
        zonaDeRiscoId: 1,
      });
      carregarAlertas();
    } catch {
      Alert.alert("Erro ao cadastrar alerta");
    }
  };

  const excluirAlerta = async (id?: number) => {
    if (!id) return;

    Alert.alert("Confirmar exclusão", "Deseja excluir este alerta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/Alerta/${id}`);
            carregarAlertas();
          } catch {
            Alert.alert("Erro ao excluir alerta");
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      carregarAlertas();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Alertas Ativos</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007FD7" />
      ) : alertas.length === 0 ? (
        <Text style={styles.noData}>Atualmente nenhum alerta emitido.</Text>
      ) : (
        <FlatList
          data={alertas}
          keyExtractor={(item) => item.id?.toString() || item.titulo}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardText}>Descrição: {item.descricao}</Text>
              <Text style={styles.cardText}>
                Gravidade: {item.nivelGravidade}
              </Text>
              <Text style={styles.cardText}>Data: {item.dataHora}</Text>
              <Text style={styles.cardText}>
                Zona de Risco ID: {item.zonaDeRiscoId}
              </Text>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => abrirModalEdicao(item)}
              >
                <Ionicons name="create" size={20} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => excluirAlerta(item.id)}
              >
                <Ionicons name="trash" size={20} color="#ff5555" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Cadastrar Novo Alerta</Text>
        <TextInput
          placeholder="Título"
          value={form.titulo}
          onChangeText={(t) => setForm({ ...form, titulo: t })}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Descrição"
          value={form.descricao}
          onChangeText={(t) => setForm({ ...form, descricao: t })}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Gravidade (ex: Crítico)"
          value={form.nivelGravidade}
          onChangeText={(t) => setForm({ ...form, nivelGravidade: t })}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          value={form.zonaDeRiscoId.toString()}
          editable={false}
          style={[styles.input, { color: "#888" }]}
        />
        <TouchableOpacity style={styles.button} onPress={cadastrarAlerta}>
          <Text style={styles.buttonText}>Cadastrar Alerta</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Editar Alerta</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#aaa"
              value={alertaSelecionado?.titulo || ""}
              onChangeText={(text) =>
                setAlertaSelecionado((prev) =>
                  prev ? { ...prev, titulo: text } : prev
                )
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              placeholderTextColor="#aaa"
              value={alertaSelecionado?.descricao || ""}
              onChangeText={(text) =>
                setAlertaSelecionado((prev) =>
                  prev ? { ...prev, descricao: text } : prev
                )
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Gravidade"
              placeholderTextColor="#aaa"
              value={alertaSelecionado?.nivelGravidade || ""}
              onChangeText={(text) =>
                setAlertaSelecionado((prev) =>
                  prev ? { ...prev, nivelGravidade: text } : prev
                )
              }
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
                style={[styles.button, { backgroundColor: "#666" }]}
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
  editButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  modalOverlay: {
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
