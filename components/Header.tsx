import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import logo from "../assets/images/logo.png";

type HeaderProps = {
  style?: ViewStyle;
  logoStyle?: ImageStyle;
};

export default function Header({ style, logoStyle }: HeaderProps) {
  const { userType, setUserType } = useUser();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingOut, setLoadingOut] = useState(false);

  const handleLogout = () => {
    setModalVisible(false);
    setLoadingOut(true);
    setTimeout(() => {
      setUserType(null);
      router.replace("/login");
    }, 1000);
  };

  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="chevron-forward" size={28} color="#fff" />
      </TouchableOpacity>
      <Image
        source={logo}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="chevron-back" size={28} color="000" />
            </TouchableOpacity>
            <View style={styles.user}>
              <Text style={styles.modalText}>
                Olá, {userType === "agente" ? "Agente" : "Cidadão"}!
              </Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={20} color="#fc0001" />
                <Text style={styles.logoutText}> Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={loadingOut} transparent>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007FD7" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 110,
    width: "100%",
    backgroundColor: "#001023",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
  },
  logo: {
    width: 140,
    height: 100,
    position: "absolute",
    left: "50%",
    top: 20,
    transform: [{ translateX: -70 }],
  },
  user: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    width: 220,
    height: 100,
    marginTop: 60,
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#007FD7",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 17,
    zIndex: 10,
  },
  modalText: {
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 1,
  },
  logoutButton: {
    marginTop: 4,
    alignSelf: "flex-start",
    marginLeft: 28,
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    color: "#fc0001",
    fontWeight: "bold",
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
