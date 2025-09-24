interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: string;
  imagem: string;
  fullDesc: string;
}

if (!global.produtos) global.produtos = [] as Produto[];
if (!global.carrinho) global.carrinho = [] as Produto[];

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

export default function ClienteScreen() {
  const [produtos] = useState<Produto[]>(global.produtos);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [carrinho, setCarrinho] = useState<Produto[]>(global.carrinho);
  const [modalCarrinho, setModalCarrinho] = useState(false);

  // Adiciona produto ao carrinho
  const adicionarAoCarrinho = (produto: Produto) => {
    const novoCarrinho = [...carrinho, produto];
    setCarrinho(novoCarrinho);
    global.carrinho = novoCarrinho;
    alert(`${produto.nome} foi adicionado ao carrinho!`);
  };

  // Remove produto do carrinho pelo índice
  const removerDoCarrinho = (index: number) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
    global.carrinho = novoCarrinho;
  };

  // leembrar de testar direito
const totalCarrinho: number = carrinho.reduce(
  (sum, p) => sum + Number(p.preco),
  0
);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, Cliente 👋</Text>
      <Text style={styles.subtitle}>Confira nossos produtos disponíveis:</Text>

      {/* Botão abrir carrinho */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#fa0', marginBottom: 15 }]}
        onPress={() => setModalCarrinho(true)}
      >
        <Text style={styles.buttonText}>Ver Carrinho ({carrinho.length})</Text>
      </TouchableOpacity>

      {/* Lista de produtos */}
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagem }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardPrice}>
                Valor: R${Number(item.preco).toFixed(2).replace('.', ',')}
              </Text>
              <Text style={styles.cardDesc}>Descrição:{'\n'}{item.descricao}</Text>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#2a7' }]}
                onPress={() => setProdutoSelecionado(item)}
              >
                <Text style={styles.buttonText}>Ver mais detalhes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
            Nenhum produto disponível no momento.
          </Text>
        }
      />

      {/* Modal de detalhes */}
      <Modal
        visible={!!produtoSelecionado}
        animationType="slide"
        transparent
        onRequestClose={() => setProdutoSelecionado(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {produtoSelecionado && (
              <ScrollView>
                <Image
                  source={{ uri: produtoSelecionado.imagem }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{produtoSelecionado.nome}</Text>
                <Text style={styles.modalPrice}>
                  Preço: R${Number(produtoSelecionado.preco).toFixed(2).replace('.', ',')}
                </Text>
                <Text style={styles.modalDesc}>
                  Descrição Completa:{'\n'}
                  {produtoSelecionado.fullDesc}
                </Text>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#2a7', marginTop: 10 }]}
                  onPress={() => adicionarAoCarrinho(produtoSelecionado)}
                >
                  <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setProdutoSelecionado(null)}
                >
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal do carrinho */}
      <Modal
        visible={modalCarrinho}
        animationType="slide"
        transparent
        onRequestClose={() => setModalCarrinho(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seu Carrinho</Text>

            <ScrollView style={{ marginBottom: 10 }}>
              {carrinho.length === 0 && (
                <Text style={{ color: '#333', textAlign: 'center', marginTop: 20 }}>
                  Seu carrinho está vazio.
                </Text>
              )}
{carrinho.map((p, index) => {
  const produtoExiste = global.produtos.some(prod => prod.id === p.id);

  return (
    <View key={index} style={styles.cardCarrinho}>
      <Image source={{ uri: p.imagem }} style={styles.cardImageCarrinho} />
      <View style={styles.cardContentCarrinho}>
        <Text style={styles.cardTitle}>{p.nome}</Text>
        <Text style={styles.cardPrice}>
          R${Number(p.preco).toFixed(2).replace('.', ',')}
        </Text>
        <Text style={styles.cardDesc}>{p.descricao}</Text>

        {produtoExiste ? (
          <>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#2a7', marginTop: 5 }]}
              onPress={() => setProdutoSelecionado(p)}
            >
              <Text style={styles.buttonText}>Ver item</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#b33', marginTop: 5 }]}
              onPress={() => removerDoCarrinho(index)}
            >
              <Text style={styles.buttonText}>Remover</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={{ color: '#b33', marginTop: 10 }}>Produto indisponível</Text>
        )}
      </View>
    </View>
  );
})}

            </ScrollView>

            {/* Total */}
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
              Total: R${totalCarrinho.toFixed(2).replace('.', ',')}
            </Text>

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalCarrinho(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos indentados corretamente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },

  cardImage: {
    width: 150,
    height: '100%',
    borderRadius: 8,
    marginRight: 10,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },

  cardDesc: {
    fontSize: 14,
    color: '#000',
    marginVertical: 1,
  },

  button: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonClose: {
    backgroundColor: '#b33',
    marginTop: 5,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    maxHeight: '90%',
    padding: 20,
  },

  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },

  modalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },

  modalDesc: {
    fontSize: 14,
    color: '#333',
  },

  cardCarrinho: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },

  cardImageCarrinho: {
    width: 100,
    height: '100%',
    borderRadius: 8,
    marginRight: 10,
  },

  cardContentCarrinho: {
    flex: 1,
    justifyContent: 'center',
  },
});
