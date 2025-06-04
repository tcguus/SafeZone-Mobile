import React, { useState, useCallback } from "react";
import { Platform, View, StyleSheet, Alert, Text } from "react-native";
import MapView, { Circle, Callout, Marker } from "react-native-maps";
import axios from "axios";
import Header from "@/components/Header";
import { useFocusEffect } from "@react-navigation/native";

const API_URL = "https://safezone-api-r535.onrender.com";

interface Zona {
  id: number;
  nome: string;
  tipoEvento: string;
  status: string;
  coordenadas: string;
}

export default function MapaScreen() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const carregarZonas = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/ZonaDeRisco`);
      const lista = Array.isArray(res.data)
        ? res.data
        : res.data && typeof res.data === "object" && "$values" in res.data
        ? (res.data as { $values: Zona[] }).$values
        : [];

      const zonasAtivas = lista.filter((z: Zona) => z.status === "Ativo");
      setZonas(zonasAtivas);
    } catch {
      Alert.alert("Erro ao carregar zonas");
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarZonas();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header
        style={{ marginTop: 20, marginLeft: 20 }}
        logoStyle={{
          width: 140,
          height: 100,
          position: "absolute",
          left: "50%",
          top: 20,
          transform: [{ translateX: -90 }],
        }}
      />

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.55,
          longitude: -46.63,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {zonas.map((zona) => {
          const [latStr, lonStr] = zona.coordenadas
            .split(",")
            .map((v) => v.trim());
          const lat = parseFloat(latStr);
          const lon = parseFloat(lonStr);

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`Coordenada inválida: ${zona.coordenadas}`);
            return null;
          }

          return (
            <React.Fragment key={zona.id}>
              <Circle
                center={{ latitude: lat, longitude: lon }}
                radius={5000}
                strokeColor="#FF0000"
                fillColor="rgba(255,0,0,0.3)"
              />
              <Marker
                coordinate={{ latitude: lat, longitude: lon }}
                opacity={Platform.OS === "ios" ? 0 : 1}
              >
                {Platform.OS === "android" && (
                  <View
                    style={{
                      width: 1,
                      height: 1,
                      backgroundColor: "transparent",
                    }}
                  />
                )}
                <Callout>
                  <View>
                    <Text style={{ fontWeight: "bold" }}>{zona.nome}</Text>
                    <Text>Evento: {zona.tipoEvento}</Text>
                  </View>
                </Callout>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001023",
  },
  map: {
    flex: 1,
  },
});
