import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, SafeAreaView, StatusBar, Alert } from "react-native";
import { useAppState } from "../../App";
import { api } from "../api/client";

export function AdminUsersScreen({ navigation }) {
  const { token, appTheme, setAppTheme } = useAppState();
  const themeBgColors = appTheme === "blue" ? ["#0B101A", "#152E4D"] : appTheme === "green" ? ["#0A1A0D", "#15401E"] : appTheme === "orange" ? ["#1A0C0B", "#421A0F"] : ["#0B091A", "#1D1B38"];

  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await api.getAdminUsers(token);
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const toggleAdmin = async (userId, currentEmail) => {
    if (currentEmail.toLowerCase() === "sruthy.m@thinkpalm.com") {
        Alert.alert("Permission Denied", "Cannot modify the root administrator.");
        return;
    }

    try {
      const res = await api.toggleUserAdmin(userId, token);
      setUsers((prev) =>
        prev.map((s) => (s.id === userId ? { ...s, is_admin: res.is_admin } : s))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.emailText}>{item.email}</Text>
        <Text style={styles.subText}>
          Verified: {item.is_verified ? "✅ Yes" : "❌ No"}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.btn, item.is_admin ? styles.btnAdminActive : styles.btnAdminInactive]}
        onPress={() => toggleAdmin(item.id, item.email)}
      >
        <Text style={styles.btnText}>
          {item.is_admin ? "Revoke Admin" : "Make Admin"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B091A" />
      <View style={styles.header}>
         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={{ color: "#fff", fontSize: 20 }}>←</Text>
         </TouchableOpacity>
         <Text style={styles.headerTitle}>User Management</Text>
         <View style={{width: 40}} />
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFA500" />}
        ListEmptyComponent={<Text style={styles.empty}>No users found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B091A" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  list: { padding: 16 },
  card: {
    backgroundColor: "#1D1B38",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#38346b",
  },
  cardInfo: { flex: 1 },
  emailText: { color: "#fff", fontSize: 15, fontWeight: "bold", marginBottom: 4 },
  subText: { color: "#8a8ea8", fontSize: 12 },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  btnAdminActive: {
    backgroundColor: "#F44336",
  },
  btnAdminInactive: {
    backgroundColor: "#4CAF50",
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  empty: { color: "#8a8ea8", textAlign: "center", marginTop: 40 },
});
