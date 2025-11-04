import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.card}>
        <Text style={styles.name}>Nico Robin</Text>
        <Text style={styles.level}>Level 1 - 1000 / 10,000 XP</Text>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      </View>

      {/* Your Impact Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        <View style={styles.impactContainer}>
          <View style={styles.impactBoxGreen}>
            <Ionicons name="leaf" size={20} color="#2e7d32" />
            <Text style={styles.impactText}>5 Actions Completed</Text>
          </View>
          <View style={styles.impactBoxOrange}>
            <Ionicons name="flame" size={20} color="#ef6c00" />
            <Text style={styles.impactText}>5 Day Streak</Text>
          </View>
        </View>
      </View>

      {/* Friend Streaks Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Friend Streaks</Text>

        {/* Refactored to use a loop as suggested by my mitar */}
        {[
          { name: "🐒 Monkey D Luffy", streak: 2 },
          { name: "⚔️ Roronoa Zoro", streak: 1 },
          { name: "🤠 Nami", streak: 3 },
        ].map((friend, index) => (
          <View key={index} style={styles.friendRow}>
            <Text style={styles.friendName}>{friend.name}</Text>
            <Text style={styles.friendStreak}>🔥 {friend.streak}</Text>
          </View>
        ))}
      </View>

      {/* Achievements Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Achievements</Text>
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b3d4e0",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  level: {
    color: "gray",
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  progressFill: {
    height: "100%",
    width: "10%",
    backgroundColor: "#4caf50",
    borderRadius: 5,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  impactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  impactBoxGreen: {
    backgroundColor: "#e8f5e9",
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  impactBoxOrange: {
    backgroundColor: "#fff3e0",
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  impactText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  friendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  friendName: {
    fontSize: 14,
  },
  friendStreak: {
    fontSize: 14,
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#4caf50",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
