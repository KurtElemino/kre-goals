// app/_layout.jsx
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../core/AuthContext";
import { ActivityIndicator, View } from "react-native";

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Home" />
      ) : (
        <>
          <Stack.Screen name="GetStarted" />
          <Stack.Screen name="Login" />
          <Stack.Screen name="Signup" />
        </>
      )}
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
