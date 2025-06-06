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
import DropDownPicker from "react-native-dropdown-picker";

const API_URL = "https://safezone-api-r535.onrender.com";

interface Morador {
  id?: number;
  nome: string;
  cpf: string;
  prioridade: string;
  zonaDeRiscoId: number;
}

export default function MoradoresScreen() {
  const [zonas, setZonas] = useState<{ id: number; nome: string }[]>([]);
  const [prioridadeOpen, setPrioridadeOpen] = useState<boolean>(false);
  const [zonaOpen, setZonaOpen] = useState<boolean>(false);

  const carregarZonas = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/ZonaDeRisco`);
      let lista: any[] = [];

      const responseData = res.data;

      if (
        responseData &&
        typeof responseData === "object" &&
        Array.isArray((responseData as any).$values)
      ) {
        lista = (responseData as any).$values;
      } else if (Array.isArray(responseData)) {
        lista = responseData;
      }

      const zonasAtivas = lista.filter((z: any) => z.status === "Ativo");
      setZonas(zonasAtivas);
    } catch {
      Alert.alert("Erro ao carregar zonas de risco");
    }
  };

  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Morador>({
    nome: "",
    cpf: "",
    prioridade: "",
    zonaDeRiscoId: 1,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [moradorSelecionado, setMoradorSelecionado] = useState<Morador | null>(
    null
  );

  const carregarMoradores = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Morador`);
      let lista: Morador[] = [];
      if (Array.isArray(res.data)) {
        lista = res.data;
      } else if (
        res.data &&
        typeof res.data === "object" &&
        Array.isArray((res.data as any).$values)
      ) {
        lista = (res.data as any).$values;
      }
      setMoradores(lista);
    } catch {
      Alert.alert("Erro ao carregar moradores");
    } finally {
      setLoading(false);
    }
  };

  const cadastrarMorador = async () => {
    const { nome, cpf, prioridade, zonaDeRiscoId } = form;
    if (!nome || !cpf || !prioridade || !zonaDeRiscoId) {
      Alert.alert("Preencha todos os campos");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/Morador`, form);
      setForm({ nome: "", cpf: "", prioridade: "", zonaDeRiscoId: 1 });
      carregarMoradores();
    } catch {
      Alert.alert("Erro ao cadastrar morador");
    }
  };

  const excluirMorador = async (id?: number) => {
    if (!id) return;
    Alert.alert("Confirmar exclusão", "Deseja excluir este morador?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/Morador/${id}`);
            carregarMoradores();
          } catch {
            Alert.alert("Erro ao excluir morador");
          }
        },
      },
    ]);
  };

  const abrirModalEdicao = (morador: Morador) => {
    setMoradorSelecionado(morador);
    setModalVisible(true);
  };

  const salvarEdicao = async () => {
    if (!moradorSelecionado || !moradorSelecionado.id) return;
    try {
      await axios.put(
        `${API_URL}/api/Morador/${moradorSelecionado.id}`,
        moradorSelecionado
      );
      setModalVisible(false);
      carregarMoradores();
    } catch {
      Alert.alert("Erro ao editar morador");
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarMoradores();
      carregarZonas();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Lista de Moradores</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007FD7" />
      ) : moradores.length === 0 ? (
        <Text style={styles.noData}>Nenhum morador cadastrado ainda.</Text>
      ) : (
        <FlatList
          data={moradores}
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
              <Text style={styles.cardText}>CPF: {item.cpf}</Text>
              <Text style={styles.cardText}>Prioridade: {item.prioridade}</Text>
              <Text style={styles.cardText}>
                Zona:{" "}
                {zonas.find((z) => z.id === item.zonaDeRiscoId)?.nome ??
                  "Desconhecida"}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => excluirMorador(item.id)}
              >
                <Ionicons name="trash" size={20} color="#ff5555" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Cadastrar Novo Morador</Text>
        <TextInput
          placeholder="Nome"
          value={form.nome}
          onChangeText={(t) => setForm({ ...form, nome: t })}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="CPF"
          value={form.cpf}
          onChangeText={(t) => setForm({ ...form, cpf: t })}
          style={styles.input}
          keyboardType="numeric"
          placeholderTextColor="#aaa"
        />
        <View style={{ zIndex: prioridadeOpen ? 1000 : 500 }}>
          <DropDownPicker
            open={prioridadeOpen}
            value={form.prioridade}
            items={[
              { label: "Alta", value: "Alta" },
              { label: "Média", value: "Média" },
              { label: "Baixa", value: "Baixa" },
            ]}
            setOpen={setPrioridadeOpen}
            onOpen={() => setZonaOpen(false)}
            setValue={(callback) =>
              setForm((prev) => ({
                ...prev,
                prioridade: callback(prev.prioridade),
              }))
            }
            setItems={() => {}}
            placeholder="Selecione a prioridade"
            style={styles.dropdown}
            textStyle={{ color: "#fff" }}
            dropDownContainerStyle={{
              backgroundColor: "#0A1C3B",
              borderColor: "#007FD7",
            }}
            ArrowDownIconComponent={() => (
              <Ionicons name="chevron-down" size={20} color="#fff" />
            )}
            ArrowUpIconComponent={() => (
              <Ionicons name="chevron-up" size={20} color="#fff" />
            )}
          />
        </View>
        <View style={{ zIndex: zonaOpen ? 1000 : 500 }}>
          <DropDownPicker
            open={zonaOpen}
            value={form.zonaDeRiscoId}
            items={zonas.map((zona) => ({
              label: zona.nome,
              value: zona.id,
            }))}
            setOpen={setZonaOpen}
            onOpen={() => setPrioridadeOpen(false)}
            setValue={(callback) =>
              setForm((prev) => ({
                ...prev,
                zonaDeRiscoId: callback(prev.zonaDeRiscoId),
              }))
            }
            setItems={() => {}}
            placeholder="Selecione a zona"
            style={styles.dropdown}
            textStyle={{ color: "#fff" }}
            dropDownContainerStyle={{
              backgroundColor: "#0A1C3B",
              borderColor: "#007FD7",
            }}
            ArrowDownIconComponent={() => (
              <Ionicons name="chevron-down" size={20} color="#fff" />
            )}
            ArrowUpIconComponent={() => (
              <Ionicons name="chevron-up" size={20} color="#fff" />
            )}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={cadastrarMorador}>
          <Text style={styles.buttonText}>Cadastrar Morador</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Editar Morador</Text>
            <TextInput
              placeholder="Nome"
              value={moradorSelecionado?.nome || ""}
              onChangeText={(t) =>
                setMoradorSelecionado({ ...moradorSelecionado!, nome: t })
              }
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="CPF"
              value={moradorSelecionado?.cpf || ""}
              onChangeText={(t) =>
                setMoradorSelecionado({ ...moradorSelecionado!, cpf: t })
              }
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Prioridade"
              value={moradorSelecionado?.prioridade || ""}
              onChangeText={(t) =>
                setMoradorSelecionado({ ...moradorSelecionado!, prioridade: t })
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
  dropdown: {
    backgroundColor: "#0A1C3B",
    borderColor: "#007FD7",
    marginBottom: 10,
    zIndex: 1000, // ajuda a resolver sobreposição
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
    width: 190,
    textAlign: "center",
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
  pickerWrapper: {
    backgroundColor: "#0A1C3B",
    borderRadius: 8,
    marginBottom: 10,
    color: "#fff",
  },
});
