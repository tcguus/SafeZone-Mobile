import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

export default function AgenteLayout() {
  return (
    <View style={styles.wrapper}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#007FD7",
            borderTopWidth: 0,
            paddingTop: 10,
            borderRadius: 20,
            width: "85%",
            height: 60,
            alignSelf: "center",
            marginBottom: 30,
            marginTop: 10,
          },
          tabBarActiveTintColor: "#FFF",
          tabBarInactiveTintColor: "#FFF",
          tabBarIcon: ({ color, size, focused }) => {
            const icons = {
              dashboard: "home",
              zonas: "map",
              alertas: "warning",
              moradores: "people",
              kits: "medkit",
            } as const;

            const iconName = icons[route.name as keyof typeof icons];

            return (
              <View style={[styles.iconBase, focused && styles.iconActive]}>
                <Ionicons name={iconName} size={22} color={color} />
              </View>
            );
          },
        })}
      >
        <Tabs.Screen name="dashboard" />
        <Tabs.Screen name="zonas" />
        <Tabs.Screen name="alertas" />
        <Tabs.Screen name="moradores" />
        <Tabs.Screen name="kits" />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#001023",
  },
  iconBase: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconActive: {
    backgroundColor: "#0A1C3B",
  },
});
