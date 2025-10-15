import { View, Text, StyleSheet } from "react-native";

export default function GardenScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen ⚙</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
