import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const htmlBackground = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>testebd1 portaç</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: black;
    }
    canvas {
      display: block;
      width: 100vw;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
    }
  </style>
</head>
<body>
  <canvas id="canv"></canvas>
  <script>
    var c = document.getElementById('canv');
    var $ = c.getContext('2d');
    var w = c.width = window.innerWidth;
    var h = c.height = window.innerHeight;
    var u = 0;
    var cnt = 10;

    function draw() {
      u -= 1.3;
      var i, b, arr, _arr, rz, x, y;
      var pts = Math.cos(Math.PI * 2 / 8 / 2);
      $.globalCompositeOperation = "source-over";
      $.fillStyle = 'hsla(0,5%,10%,1)';
      $.fillRect(0,0,w,h);
      $.globalCompositeOperation = "screen";

      var dims = 0.80 + Math.sin(cnt / 43) / 40;
      var rot = Math.sin(cnt / 73);
      var _w = Math.min(w,h);

      for(b=0;b<220;b++){
        rz = cnt/35 + b/3*rot;
        $.beginPath();
        $.lineWidth = 4;
        arr = [];
        for(i=0;i<8;i++){
          x = Math.sin(rz)*_w + w/2;
          y = Math.cos(rz)*_w + h/2;
          if(i){$.lineTo(x,y)} else {$.moveTo(x,y)}
          arr[i] = [x,y];
          rz += Math.PI*2/8;
        }
        $.strokeStyle = 'hsla(' + (u % 360) + ',100%,' + (50 + 10 * Math.sin(cnt / 5)) + '%,0.9)';
        $.closePath();
        $.stroke();

        if(b){
          for(i=0;i<8;i++){
            $.beginPath();
            $.moveTo(arr[i][0], arr[i][1]);
            $.lineTo(_arr[i][0], _arr[i][1]);
            $.stroke();
          }
        }

        _arr = [];
        rz += Math.PI*2/8/2;
        for(i=0;i<8;i++){
          x = Math.sin(rz)*_w*pts + w/2;
          y = Math.cos(rz)*_w*pts + h/2;
          _arr[i] = [x,y];
          rz += Math.PI*2/8;
        }
        _w *= dims;
      }
      cnt += .1;
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', function(){
      c.width = w = window.innerWidth;
      c.height = h = window.innerHeight;
    });

    draw();
  </script>
</body>
</html>
`;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cadastroEmail, setCadastroEmail] = useState("");
  const [cadastroSenha, setCadastroSenha] = useState("");

  const router = useRouter();

  const handleLogin = () => {
    if (senha !== "123") {
      Alert.alert("Erro", "Senha incorreta!");
      return;
    }

    if (email === "v") {
      router.push("/vendedor");
    } else if (email === "c") {
      router.push("/cliente");
    } else {
      Alert.alert("Erro", "Usuário não encontrado");
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlBackground }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.loginBox}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry={!mostrarSenha}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity
            onPress={() => setMostrarSenha(!mostrarSenha)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={mostrarSenha ? "eye-off" : "eye"}
              size={22}
              color="#1e90ff"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Entrar" color="#1e90ff" onPress={handleLogin} />
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.cadastroText}>
            Não tem uma conta?{" "}
            <Text style={{ color: "#1e90ff", textDecorationLine: "underline" }}>
              Cadastre-se
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Cadastro</Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={cadastroEmail}
              onChangeText={setCadastroEmail}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#aaa"
              secureTextEntry
              style={styles.input}
              value={cadastroSenha}
              onChangeText={setCadastroSenha}
            />
            <View style={styles.buttonWrapper}>
              <Button
                title="Cadastrar"
                color="#1e90ff"
                onPress={() => Alert.alert("Info", "cadastro??")}
              />
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.fecharModal}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loginBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -175 }, { translateY: -150 }],
    width: 350,
    padding: 30,
    borderRadius: 15,
    zIndex: 1,
    alignItems: "center",
    shadowColor: "#00ffff",
    shadowOpacity: 0.6,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 0 },
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e90ff",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",
    backgroundColor: "#111",
    color: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginBottom: 15,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    padding: 8,
  },
  buttonWrapper: {
    width: "90%",
    marginTop: 10,
    marginBottom: 10,
  },
  cadastroText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 10,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#111",
    borderRadius: 15,
    padding: 25,
    width: 320,
    alignItems: "center",
    shadowColor: "#00ffff",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e90ff",
    marginBottom: 20,
  },
  fecharModal: {
    color: "#1e90ff",
    marginTop: 15,
    textDecorationLine: "underline",
  },
});
