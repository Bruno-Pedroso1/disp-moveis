import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

// Tipagem do produto
interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: string;
  imagem: string;
  fullDesc: string;
}

// Inicializa variável global se ainda não existe
if (!global.produtos) {
  global.produtos = [] as Produto[];
}



export default function VendedorScreen() {
  const [produtos, setProdutos] = useState<Produto[]>(global.produtos);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [fullDesc, setFull] = useState('');
  const [imagem, setImagem] = useState<string | null>(null);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const editarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco);
    setEstoque(produto.estoque);
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

  const adicionarProduto = () => {
    if (!nome || !descricao || !preco || !estoque || !imagem || !fullDesc) {
      Alert.alert("Erro", "Preencha todos os campos e selecione uma imagem");
      return;
    }

    let novosProdutos: Produto[] = [];

    if (produtoEditando) {
      // Atualizar produto existente
      novosProdutos = produtos.map((p) =>
        p.id === produtoEditando.id
          ? { ...p, nome, descricao, preco, estoque, imagem, fullDesc}
          : p
      );
    } else {
      // Adicionar novo produto
      const novoProduto: Produto = {
        id: Date.now().toString(),
        nome,
        descricao,
        preco,
        estoque,
        imagem,
        fullDesc,
      };
      novosProdutos = [novoProduto, ...produtos];
    }

    setProdutos(novosProdutos);
    global.produtos = novosProdutos; 
    setModalVisible(false);
    setProdutoEditando(null);
    setNome("");
    setDescricao("");
    setPreco("");
    setEstoque("");
    setFull('');
    setImagem(null);
  };

  const removerProduto = (id: string) => {
    const novosProdutos = produtos.filter((p) => p.id !== id);
    setProdutos(novosProdutos);
    global.produtos = novosProdutos; // salva no global
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, Vendedor 👋</Text>
      <Text style={styles.subtitle}>Gerencie seus produtos abaixo:</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagem }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardInfo}>Valor: R${item.preco},00 </Text>
              <Text style={styles.cardDesc}>Resumo: {item.descricao}</Text>
              <Text style={styles.cardInfo}>Estoque: {item.estoque}</Text>
              {<Text style={styles.cardInfo}>Descrição Completa: {'\n'}{item.fullDesc} </Text>}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#2a7", marginTop: 5 }]}
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
              value={preco}
              onChangeText={setPreco}
            />
            <TextInput
              placeholder="Estoque"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={estoque}
              onChangeText={setEstoque}
            />

            <TextInput
            placeholder='Descrição Completa'
            placeholderTextColor= '#aaa'
            style= {styles.input}
            value={fullDesc}
            onChangeText={setFull}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
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
  card: { flexDirection: "row", backgroundColor: "#f0f0f0", padding: 15, borderRadius: 8, marginBottom: 15 },
  cardImage: { width: 150, height: '100%', borderRadius: 8, marginBottom: 10, marginRight: 10 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  cardDesc: { fontSize: 14, color: "#000", marginVertical: 5 },
  cardInfo: { fontSize: 14, color: "#000", marginVertical: 5 },
  button: { backgroundColor: "#444", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
  buttonDanger: { backgroundColor: "#b33" },
  buttonAdd: { backgroundColor: "#2a7", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000000" },
  modalContent: { backgroundColor: "#111", padding: 20, borderRadius: 8, width: "90%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", padding: 20, color: "#fff", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#444", padding: 10, borderRadius: 5, marginBottom: 10, color: "#fff" },
});
