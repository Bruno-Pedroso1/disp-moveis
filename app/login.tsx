import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (senha !== "123") {
      Alert.alert("Erro", "Senha incorreta!");
      return;
    }

    if (email === "vendedor@uno.com") {
      router.push("/vendedor"); // vai pra tela do vendedor
    } else if (email === "cliente@uno.com") {
      router.push("/cliente"); // vai pra tela do cliente
    } else {
      Alert.alert("Erro", "Usuário não encontrado");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#000" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center", color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    color: "#fff",
  },
});
