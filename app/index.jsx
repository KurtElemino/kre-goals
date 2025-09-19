// app/index.jsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Notery</Text>
        <Text style={styles.subtitle}>
          A simple and efficient to-do list app to help you stay organized.
        </Text>

        {!showOptions ? (
          // ✅ First state: Only "Get Started"
          <TouchableOpacity
            style={[styles.button, styles.getStartedBtn]}
            onPress={() => setShowOptions(true)}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          // ✅ Second state: Show Login + Signup buttons
          <>
            <TouchableOpacity
              style={[styles.button, styles.loginBtn]}
              onPress={() => router.push("/Login")}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.signupBtn]}
              onPress={() => router.push("/Signup")}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowOptions(false)}>
              <Text style={styles.backLink}>⬅ Back</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  getStartedBtn: {
    backgroundColor: "#6f42c1", // violet para unique sa landing
  },
  loginBtn: {
    backgroundColor: "#007bff",
  },
  signupBtn: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  backLink: {
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
  },
});
