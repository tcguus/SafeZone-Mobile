import React, { useCallback, useContext, useState } from "react";
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
import { useFocusEffect } from "expo-router";

const API_URL = "https://safezone-api-r535.onrender.com";

export default function DashboardScreen() {
  const userContext = useContext(UserContext);
  const userType = userContext?.userType;
  const [loading, setLoading] = useState(true);
  type Alerta = {
    titulo?: string;
    descricao?: string;
    [key: string]: any;
  };

  const [data, setData] = useState<{
    moradores: number;
    zonas: number;
    alertas: number;
    kits: number;
    ultimosAlertas: Alerta[];
  }>({
    moradores: 0,
    zonas: 0,
    alertas: 0,
    kits: 0,
    ultimosAlertas: [],
  });

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [moradoresRes, zonasRes, alertasRes, kitsRes] =
            await Promise.all([
              axios.get(`${API_URL}/api/Morador`),
              axios.get(`${API_URL}/api/ZonaDeRisco`),
              axios.get(`${API_URL}/api/Alerta`),
              axios.get(`${API_URL}/api/KitEmergencia`),
            ]);

          function extractArray(data: any): any[] {
            if (data && Array.isArray(data.$values)) {
              return data.$values;
            }
            if (Array.isArray(data)) {
              return data;
            }
            return [];
          }

          const alertasData = extractArray(alertasRes.data);
          const alertas = alertasData.slice(-3).reverse();

          setData({
            moradores: extractArray(moradoresRes.data).length,
            zonas: extractArray(zonasRes.data).length,
            alertas: extractArray(alertasRes.data).length,
            kits: extractArray(kitsRes.data).length,
            ultimosAlertas: alertas,
          });
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        } finally {
          setLoading(false);
        }
      };

      if (userType === "agente") {
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
      <Text style={styles.title}>Central de Monitoramento</Text>

      {userType === "agente" && (
        <>
          <Card title="Moradores Cadastrados" value={data.moradores} />
          <Card title="Zonas de Risco Mapeadas" value={data.zonas} />
          <Card title="Alertas Ativos" value={data.alertas} />
          <Card title="Kits Solicitados" value={data.kits} />

          <SectionTitle text="Últimos Alertas Cadastrados" />
          {data.ultimosAlertas.length > 0 ? (
            data.ultimosAlertas.map((alerta, index) => (
              <View key={index} style={styles.alertCard}>
                <Text style={styles.alertTitle}>
                  {alerta?.titulo || "Alerta Sem Título"}
                </Text>
                <Text style={styles.alertDesc}>
                  {alerta?.descricao || "Sem descrição"}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.alertEmpty}>
              Nenhum alerta cadastrado recentemente.
            </Text>
          )}

          <SectionTitle text="Recomendações de Segurança" />
          <Card textOnly>
            <Text style={styles.tipText}>
              - Monitore zonas com maior risco com mais frequência.
            </Text>
            <Text style={styles.tipText}>
              - Cadastre moradores vulneráveis o quanto antes.
            </Text>
            <Text style={styles.tipText}>
              - Verifique se os kits solicitados já foram entregues.
            </Text>
            <Text style={styles.tipText}>
              - Alinhe alertas com ações reais e locais.
            </Text>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

function Card({
  title,
  value,
  children,
  textOnly,
}: {
  title?: string;
  value?: number | string;
  children?: React.ReactNode;
  textOnly?: boolean;
}) {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      {value !== undefined && <Text style={styles.cardValue}>{value}</Text>}
      {textOnly && children}
    </View>
  );
}

function SectionTitle({ text }: { text: string }) {
  return <Text style={styles.sectionTitle}>{text}</Text>;
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
  sectionTitle: {
    fontSize: 18,
    color: "#FFF",
    marginTop: 30,
    marginBottom: 10,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#0A1C3B",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 5,
  },
  cardValue: {
    color: "#007FD7",
    fontSize: 22,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#001023",
    justifyContent: "center",
    alignItems: "center",
  },
  alertCard: {
    backgroundColor: "#12284F",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  alertTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  alertDesc: {
    color: "#ccc",
    fontSize: 14,
  },
  alertEmpty: {
    color: "#aaa",
    fontStyle: "italic",
    marginBottom: 15,
  },
  tipText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
});
