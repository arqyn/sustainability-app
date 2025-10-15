import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            title: "Sustainability App",
            headerStyle: {
              backgroundColor: "#5A8A6B",
            },
            headerTintColor: "#fff",
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </>
  );
}
