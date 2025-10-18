import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from "react";
import { Alert, Animated, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagem: string;
  fullDesc: string;
}

if (!global.produtos) {
  global.produtos = [] as Produto[];
}

export default function VendedorScreen() {
  const [produtos, setProdutos] = useState<Produto[]>(global.produtos || []);

  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [fullDesc, setFull] = useState('');
  const [imagem, setImagem] = useState<string | null>(null);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const [mensagem, setMensagem] = useState('');
  const [mostrarMensagem, setMostrarMensagem] = useState(false);
  const animToast = useRef(new Animated.Value(0)).current;
  const [toastType, setToastType] = useState<'default' | 'edit' | 'remove'>('default');
  const [modalPedidos, setModalPedidos] = useState(false);
  const [enviados, setEnviados] = useState({});
  const marcarComoEnviado = (index) => {
    setEnviados(prev => ({ ...prev, [index]: true }));
  };
  const mostrarToast = (texto: string, tipo: 'default' | 'edit' | 'remove' = 'default') => {
      setMensagem(texto);
      setToastType(tipo);
      setMostrarMensagem(true);

      Animated.timing(animToast, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(animToast, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setMostrarMensagem(false));
        }, tipo === 'remove' ? 3000 : 2000);
      });
    };

  const editarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco > 0 ? (produto.preco * 100).toString() : ''); 
    setEstoque(produto.estoque.toString());
    setImagem(produto.imagem);
    setFull(produto.fullDesc);
    setModalVisible(true);
  };

  const selecionarImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const handlePrecoChange = (valor: string) => {
    if (!valor) {
      setPreco("");
      return;
    }

    const numeros = valor.replace(/\D/g, "");
    const numeroCentavos = Number(numeros);
    const valorFormatado = (numeroCentavos / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setPreco(valorFormatado);
  };

  const adicionarProduto = () => {
    if (!nome || !descricao || !preco || !estoque || !imagem || !fullDesc) {
      Alert.alert("Erro", "Preencha todos os campos e selecione uma imagem");
      return;
    }

    const precoNumero = Number(preco.replace(/\D/g, "")) / 100;

    let novosProdutos: Produto[] = [];

    if (produtoEditando) {
      novosProdutos = produtos.map((p) =>
        p.id === produtoEditando.id
          ? { ...p, nome, descricao, preco: precoNumero, estoque: Number(estoque), imagem, fullDesc }
          : p
      );
      mostrarToast("Produto editado com sucesso!", "edit");
    } else {
      const novoProduto: Produto = {
        id: Date.now().toString(),
        nome,
        descricao,
        preco: precoNumero,
        estoque: Number(estoque),
        imagem,
        fullDesc,
      };
      novosProdutos = [novoProduto, ...produtos];
      mostrarToast("Produto cadastrado com sucesso!", "default");
    }

    setProdutos(novosProdutos);
    global.produtos = novosProdutos; 
    setModalVisible(false);
    setProdutoEditando(null);
    setNome("");
    setDescricao("");
    setPreco('');
    setEstoque("");
    setFull('');
    setImagem(null);
  };

  const removerProduto = (id: string) => {
  const novosProdutos = produtos.filter((p) => p.id !== id);
  setProdutos(novosProdutos);
  global.produtos = novosProdutos;
  mostrarToast("Produto removido!", "remove");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, Vendedor 👋</Text>
      <Text style={styles.subtitle}>Gerencie seus produtos abaixo:</Text>
<TouchableOpacity
  style={[styles.button, { backgroundColor: '#2a7', marginTop: 0, marginBottom: 10 }]}
  onPress={() => setModalPedidos(true)}
>
  <Text style={styles.buttonText}>Pedidos Finalizados</Text>
</TouchableOpacity>

    <Modal
      visible={modalPedidos}
      animationType="slide"
      transparent
      onRequestClose={() => setModalPedidos(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Pedidos finalizados</Text>

          <ScrollView style={{ marginBottom: 10 }}>
            {(!global.carrinhoFinalizado || global.carrinhoFinalizado.length === 0) && (
              <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
                Nenhum pedido finalizado ainda.
              </Text>
            )}

{global.carrinhoFinalizado && global.carrinhoFinalizado.map((p, index) => (
  <View
    key={index}
    style={[
      styles.cardCarrinho,
      enviados[index] && { backgroundColor: '#d4d4d4' }
    ]}
  >
    <Image source={{ uri: p.imagem }} style={styles.cardImageCarrinho} />
    <View style={styles.cardContentCarrinho}>
      <Text style={styles.cardTitle}>{p.nome}</Text>
      <Text style={styles.cardPrice}>
        Valor: R${Number(p.preco).toFixed(2).replace('.', ',')}
      </Text>
      <Text style={styles.cardDesc}>{p.descricao}</Text>
      <Text style={{ fontSize: 12, color: '#333' }}>
        Data da compra: {p.dataCompra}
      </Text>
      <Text style={{ fontSize: 12, color: '#333' }}>
        Valor do item: R${Number(p.total || p.preco).toFixed(2).replace('.', ',')}
      </Text>

      {enviados[index] ? (
        <Text style={[styles.buttonText, { color: '#000', textAlign: 'center', marginTop: 8 }]}>
          Em rota de entrega
        </Text>
      ) : (
        <TouchableOpacity
          style={[styles.button, { marginTop: 8, alignSelf: 'flex-start', width: '100%', backgroundColor: '#2a7' }]}
          onPress={() => marcarComoEnviado(index)}
        >
          <Text style={styles.buttonText}>Marcar como enviado</Text>
        </TouchableOpacity>
      )}

    </View>
  </View>
))}

          </ScrollView>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#b33', marginTop: 10 }]}
            onPress={() => setModalPedidos(false)}
          >
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>


{mostrarMensagem && (
  <Animated.View
    style={[styles.toast, {
      opacity: animToast,
      transform: [
        {
          translateY: animToast.interpolate({
            inputRange: [0, 1],
            outputRange: [-80, 0],
          }),
        },
      ],
    }]}
  >
    {toastType === 'remove' ? (
      <LinearGradient
        colors={["#b33", "#ff4444", "#ff8888"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.toastGradient}
      >
        <Text style={styles.toastText}>{mensagem}</Text>
      </LinearGradient>
    ) : (
      <LinearGradient
        colors={["#0e4f2f", "#278d5cff", "#167c55ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.toastGradient}
      >
        <Text style={styles.toastText}>{mensagem}</Text>
      </LinearGradient>
    )}
  </Animated.View>
)}
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagem }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardInfo}>
                Valor: {item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </Text>
              <Text style={styles.cardDesc}>Resumo: {item.descricao}</Text>
              <Text style={styles.cardInfo}>Estoque: {item.estoque}</Text>
              <Text style={styles.cardInfo}>Descrição Completa: {'\n'}{item.fullDesc}</Text>

              <TouchableOpacity
                style={[styles.button, styles.buttonEdit]}
                onPress={() => editarProduto(item)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonDanger]}
                onPress={() => removerProduto(item.id)}
              >
                <Text style={styles.buttonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
            Nenhum produto cadastrado.
          </Text>
        }
      />

      <TouchableOpacity
        style={[styles.button, styles.buttonAdd]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Cadastrar Produto</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {produtoEditando ? "Editar Produto" : "Novo Produto"}
            </Text>

            <TouchableOpacity
              style={[styles.button, { marginBottom: 10 }]}
              onPress={selecionarImagem}
            >
              <Text style={styles.buttonText}>
                {imagem ? "Imagem Selecionada ✅" : "Selecionar Imagem"}
              </Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Nome"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              placeholder="Descrição"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={descricao}
              onChangeText={setDescricao}
            />
            <TextInput
              placeholder="Preço"
              placeholderTextColor="#aaa"
              style={styles.input}
              keyboardType="numeric"
              value={preco}
              onChangeText={handlePrecoChange}
            />
            <TextInput
              placeholder="Estoque"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={estoque}
              keyboardType="numeric"
              onChangeText={setEstoque}
            />
            <TextInput
              placeholder="Descrição Completa"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={fullDesc}
              onChangeText={setFull}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { flex: 1, marginRight: 5 }]}
                onPress={adicionarProduto}
              >
                <Text style={styles.buttonText}>
                  {produtoEditando ? "Salvar" : "Adicionar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonDanger, { flex: 1, marginLeft: 5 }]}
                onPress={() => {
                  setModalVisible(false);
                  setProdutoEditando(null);
                  setImagem(null);
                  setPreco('');
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#ccc", marginBottom: 20 },

  card: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  cardImage: { width: 150, height: "100%", borderRadius: 8, marginBottom: 10, marginRight: 10 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  cardDesc: { fontSize: 14, color: "#000", marginVertical: 5 },
  cardInfo: { fontSize: 14, color: "#000", marginVertical: 5 },

  button: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonEdit: { backgroundColor: "#2a7" },
  buttonDanger: { backgroundColor: "#b33" },
  buttonAdd: { backgroundColor: "#2a7", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },

  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000000" },
  modalContent: { backgroundColor: "#111", padding: 20, borderRadius: 8, width: "90%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", padding: 20, color: "#fff", marginBottom: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: "#fff",
  },
  toast: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    zIndex: 999,
  },
  toastGradient: {
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 28,
    shadowColor: "#222",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  toastText: {
    color: "#e0e0e0",
    fontWeight: "500",
    fontSize: 15,
    textAlign: "center",
    textShadowColor: "#222",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.2,
  },
cardCarrinho: { flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, marginBottom: 15 },
  cardImageCarrinho: { width: 100, height: '100%', borderRadius: 8, marginRight: 10 },
  cardContentCarrinho: { flex: 1, justifyContent: 'center' },
});