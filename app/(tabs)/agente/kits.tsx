import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

const API_URL = "https://safezone-api-r535.onrender.com";

interface KitEmergencia {
  id: number;
  tipo: string;
  quantidade: number;
  localEstoque: string;
}

export default function KitsScreen() {
  const [kits, setKits] = useState<KitEmergencia[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarKits = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/KitEmergencia`);
      const lista = Array.isArray(res.data)
        ? res.data
        : (res.data as { $values?: KitEmergencia[] })?.$values || [];
      setKits(lista);
    } catch {
      Alert.alert("Erro ao carregar kits de emergência");
    } finally {
      setLoading(false);
    }
  };

  const excluirKit = async (id: number) => {
    Alert.alert("Confirmar exclusão", "Deseja excluir este kit?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/KitEmergencia/${id}`);
            carregarKits();
          } catch {
            Alert.alert("Erro ao excluir kit");
          }
        },
      },
    ]);
  };

  const confirmarKit = async (id: number) => {
    Alert.alert("Confirmar entrega", "Deseja confirmar a entrega deste kit?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/KitEmergencia/${id}`);
            carregarKits();
          } catch {
            Alert.alert("Erro ao confirmar entrega");
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      carregarKits();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Kits Solicitados</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007FD7" />
      ) : kits.length === 0 ? (
        <Text style={styles.noData}>Nenhum kit solicitado ainda.</Text>
      ) : (
        <FlatList
          data={kits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.tipo}</Text>
              <Text style={styles.cardText}>Quantidade: {item.quantidade}</Text>
              <Text style={styles.cardText}>Local: {item.localEstoque}</Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => confirmarKit(item.id)}>
                  <Ionicons name="checkmark-circle" size={24} color="#00B131" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => excluirKit(item.id)}>
                  <Ionicons name="trash" size={24} color="#ff5555" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 10,
  },
});
