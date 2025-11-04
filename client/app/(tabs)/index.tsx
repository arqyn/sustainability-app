import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FONT_SIZES, FONT_WEIGHTS, SPACING, COLORS } from "../../styles/theme";

export default function HomeScreen() {
  const friends = [
    { name: "🐒 Monkey D Luffy", streak: 2 },
    { name: "⚔️ Roronoa Zoro", streak: 1 },
    { name: "🫧 Nami", streak: 3 },
  ];

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

        {/* Refactored to use map loop as suggested by @mitarnik04 */}
        {friends.map((friend, index) => (
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
        <Ionicons name="add" size={32} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2,
  },
  name: {
    fontSize: FONT_SIZES.large,
    fontWeight: FONT_WEIGHTS.bold,
  },
  level: {
    color: COLORS.textGray,
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  progressFill: {
    height: "100%",
    width: "10%",
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  sectionTitle: {
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.medium,
    marginBottom: SPACING.sm,
  },
  impactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  impactBoxGreen: {
    backgroundColor: "#e8f5e9",
    flex: 1,
    padding: SPACING.sm,
    borderRadius: 8,
    marginRight: SPACING.sm,
    alignItems: "center",
  },
  impactBoxOrange: {
    backgroundColor: "#fff3e0",
    flex: 1,
    padding: SPACING.sm,
    borderRadius: 8,
    marginLeft: SPACING.sm,
    alignItems: "center",
  },
  impactText: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZES.regular,
    fontWeight: FONT_WEIGHTS.medium,
  },
  friendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.xs,
  },
  friendName: {
    fontSize: FONT_SIZES.regular,
  },
  friendStreak: {
    fontSize: FONT_SIZES.regular,
  },
  addButton: {
    position: "absolute",
    bottom: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
