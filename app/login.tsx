import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { WebView } from "react-native-webview";

const htmlBackground = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>testebd1 portaç </title>
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
  const router = useRouter();

  const handleLogin = () => {
    if (senha !== "123") {
      Alert.alert("Erro", "Senha incorreta!");
      return;
    }

    if (email === "vendedor@uno.com") {
      router.push("/vendedor");
    } else if (email === "cliente@uno.com") {
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
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />
        <View style={styles.buttonWrapper}>
          <Button title="Entrar" color="#1e90ff" onPress={handleLogin} />
        </View>
      </View>
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
  buttonWrapper: {
    width: "90%",
    marginTop: 10,
  },
});
