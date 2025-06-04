import React, { useContext, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import Header from "@/components/Header";
import { useFocusEffect } from "@react-navigation/native";

const API_URL = "https://safezone-api-r535.onrender.com";

const RECOMENDACOES = [
  "Mantenha seu kit com água, lanterna e documentos pessoais em local seguro.",
  "Evite áreas de risco em caso de chuvas fortes.",
  "Siga as orientações da Defesa Civil.",
  "Tenha uma mochila de emergência pronta com itens essenciais.",
  "Fique atento às mensagens da Defesa Civil pelo celular.",
  "Tenha um plano de evacuação familiar em mente.",
  "Identifique locais seguros próximos à sua casa.",
];

export default function DashboardScreen() {
  const userContext = useContext(UserContext);
  const userType = userContext?.userType;
  const [loading, setLoading] = useState(true);
  type Alerta = { descricao?: string; [key: string]: any };
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [kitStatus, setKitStatus] = useState<string | null>(null);
  const [zonaAtual, setZonaAtual] = useState<string | null>(null);
  const [recomendacaoAleatoria, setRecomendacaoAleatoria] =
    useState<string>("");

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [alertasRes, kitsRes, zonasRes] = await Promise.all([
            axios.get(`${API_URL}/api/Alerta`),
            axios.get(`${API_URL}/api/KitEmergencia`),
            axios.get(`${API_URL}/api/ZonaDeRisco`),
          ]);
          console.log("Dados brutos dos alertas:", alertasRes.data);

          setAlertas(
            Array.isArray(alertasRes.data)
              ? alertasRes.data
              : alertasRes.data &&
                typeof alertasRes.data === "object" &&
                alertasRes.data !== null &&
                "$values" in alertasRes.data
              ? (alertasRes.data as any).$values
              : []
          );

          const kits =
            kitsRes.data &&
            typeof kitsRes.data === "object" &&
            "$values" in kitsRes.data
              ? (kitsRes.data as any).$values
              : Array.isArray(kitsRes.data)
              ? kitsRes.data
              : [];
          if (kits.length > 0) {
            const ultimoKit = kits[kits.length - 1];
            setKitStatus(ultimoKit.status || "Em análise");
          }

          let zonas =
            zonasRes.data &&
            typeof zonasRes.data === "object" &&
            "$values" in zonasRes.data
              ? (zonasRes.data as any).$values
              : Array.isArray(zonasRes.data)
              ? zonasRes.data
              : [];
          const zonasAtivas = zonas.filter((z: any) => z.status === "Ativo");
          if (zonasAtivas.length > 0) {
            const nomes = zonasAtivas
              .map((z: any) => z.nome?.toLowerCase())
              .filter(Boolean)
              .map(
                (nome: string) => nome.charAt(0).toUpperCase() + nome.slice(1)
              );
            setZonaAtual(nomes.join(", "));
          } else {
            setZonaAtual(null);
          }

          const aleatoria =
            RECOMENDACOES[Math.floor(Math.random() * RECOMENDACOES.length)];
          setRecomendacaoAleatoria(aleatoria);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        } finally {
          setLoading(false);
        }
      };

      if (userType === "cidadao") {
        fetchData();
      } else {
        setLoading(false);
      }
    }, [userType])
  );

  if (!userType || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007FD7" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      <Text style={styles.title}>Informações Atuais</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>
        <Card
          title="Alertas Ativos"
          value={
            alertas.length > 0
              ? `${alertas.length} alerta(s)`
              : "Nenhum alerta ativo"
          }
        />
        <Card
          title="Solicitação de Kit"
          value={kitStatus ? `Status: ${kitStatus}` : "Nenhum kit solicitado"}
        />
        <Card
          title="Zona Atual de Risco"
          value={zonaAtual || "Nenhuma zona definida"}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimos Alertas</Text>
        {alertas.length === 0 ? (
          <Text style={styles.recomendacao}>Nenhum alerta disponível.</Text>
        ) : (
          alertas.slice(0, 3).map((alerta, idx) => (
            <View key={idx} style={styles.alertaItem}>
              <View key={idx} style={styles.alertaItem}>
                <Text style={styles.alertaTextoBold}>
                  {alerta.titulo || "Sem título"}
                </Text>
                <Text style={styles.alertaTexto}>
                  {alerta.descricao || "Sem descrição"}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recomendações</Text>
        <Text style={styles.recomendacao}>{recomendacaoAleatoria}</Text>
      </View>
    </ScrollView>
  );
}

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#001023",
    minHeight: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#0A1C3B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 5,
  },
  cardValue: {
    color: "#007FD7",
    fontSize: 20,
    fontWeight: "bold",
  },
  alertaItem: {
    backgroundColor: "#122645",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  alertaTexto: {
    color: "#EEE",
    fontSize: 14,
  },
  recomendacao: {
    color: "#CCC",
    fontSize: 14,
    marginBottom: 6,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#001023",
    justifyContent: "center",
    alignItems: "center",
  },
  alertaTextoBold: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },
});
