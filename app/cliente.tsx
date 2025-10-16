import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator, Animated,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
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

export default function ClienteScreen() {
  const [mensagem, setMensagem] = useState('');
  const [mostrarMensagem, setMostrarMensagem] = useState(false);
  const [mensagemCor, setMensagemCor] = useState<string[]>(["#0e4f2f", "#278d5cff", "#167c55ff"]);
  const [produtos] = useState<Produto[]>(global.produtos);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [carrinho, setCarrinho] = useState<Produto[]>(global.carrinho);
  const [modalCarrinho, setModalCarrinho] = useState(false);
  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const [freteSelecionado, setFreteSelecionado] = useState<'sedex' | 'correios' | null>(null);
  const [valorFrete, setValorFrete] = useState(0);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<'pix' | 'boleto' | 'cartao' | null>(null);
  const [finalizandoCompra, setFinalizandoCompra] = useState(false);
  const [pagamentoConcluido, setPagamentoConcluido] = useState(false);
  const checkScaleAnim = useRef(new Animated.Value(0)).current;
  const [modalPedidos, setModalPedidos] = useState(false);
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);

console.log("Carrinho finalizado no cliente:", global.carrinhoFinalizado);

  const mostrarToast = (texto: string, cores: string[]) => {
    setMensagem(texto);
    setMensagemCor(cores);
    setMostrarMensagem(true);
    setTimeout(() => setMostrarMensagem(false), 2000);
  };
  const adicionarAoCarrinho = (produto: Produto) => {
    const novoCarrinho = [...carrinho, produto];
    setCarrinho(novoCarrinho);
    global.carrinho = novoCarrinho;
    mostrarToast(`${produto.nome} adicionado ao carrinho!`, ["#0e4f2f", "#278d5cff", "#167c55ff"]);
  };

  const removerDoCarrinho = (index: number) => {
    const produtoRemovido = carrinho[index];
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
    global.carrinho = novoCarrinho;
    mostrarToast(`${produtoRemovido.nome} removido do carrinho!`, ["#b33", "#ff4444", "#ff8888"]);
  };

  const totalCarrinho: number = carrinho.reduce(
    (sum, p) => sum + Number(p.preco),
    0
  );
return (
  <View style={styles.container}>

    <Text style={styles.title}>Bem-vindo, Cliente 👋</Text>
    <Text style={styles.subtitle}>Confira nossos produtos disponíveis:</Text>

    <TouchableOpacity
      style={[styles.button, { backgroundColor: '#fa0', marginBottom: 15 }]}
      onPress={() => setModalCarrinho(true)}
    >
      <Text style={styles.buttonText}>Ver Carrinho ({carrinho.length})</Text>
    </TouchableOpacity>
<TouchableOpacity
  style={[styles.button, { backgroundColor: '#2a7', marginBottom: 15 }]}
  onPress={() => setModalPedidos(true)}
>
  <Text style={styles.buttonText}>Pedidos em andamento</Text>
</TouchableOpacity>
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

    <Modal
      visible={mostrarMensagem}
      transparent
      animationType="none"
      pointerEvents="box-none"
    >
      <View style={styles.toastContainer}>
        <LinearGradient
          colors={mensagemCor}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.toast}
        >
          <Text style={styles.toastText}>{mensagem}</Text>
        </LinearGradient>
      </View>
    </Modal>

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
              <Image source={{ uri: produtoSelecionado.imagem }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{produtoSelecionado.nome}</Text>
              <Text style={styles.modalPrice}>
                Preço: R${Number(produtoSelecionado.preco).toFixed(2).replace('.', ',')}
              </Text>
              <Text style={styles.modalDesc}>
                Descrição Completa:{'\n'}{produtoSelecionado.fullDesc}
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

      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
        Total: R${totalCarrinho.toFixed(2).replace('.', ',')}
      </Text>

      {carrinho.length > 0 && !mostrarCheckout && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#fa0', marginBottom: 10 }]}
          onPress={() => setMostrarCheckout(true)}
        >
          <Text style={styles.buttonText}>Finalizar Compra</Text>
        </TouchableOpacity>
      )}

      {mostrarCheckout && (
        <View style={styles.checkoutContainer}>
          <Text style={styles.checkoutTitle}>Escolha o método de envio:</Text>

          <TouchableOpacity
            style={[
              styles.checkoutOption,
              freteSelecionado === 'sedex' && styles.checkoutOptionSelected,
            ]}
            onPress={() => {
              setFreteSelecionado('sedex');
              setValorFrete(15);
            }}
          >
            <Text style={styles.checkoutOptionText}>
              SEDEX (R$15,00) - entrega em até 3 dias úteis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.checkoutOption,
              freteSelecionado === 'correios' && styles.checkoutOptionSelected,
            ]}
            onPress={() => {
              setFreteSelecionado('correios');
              setValorFrete(10);
            }}
          >
            <Text style={styles.checkoutOptionText}>
              Correios (R$10,00) - entrega em até 5 dias úteis
            </Text>
          </TouchableOpacity>

          {freteSelecionado && (
            <View style={{ marginTop: 15 }}>
              {(() => {
                const hoje = new Date();
                const dias = freteSelecionado === 'sedex' ? 3 : 5;
                const estimada = new Date(hoje);
                estimada.setDate(hoje.getDate() + dias);
                const dia = estimada.getDate().toString().padStart(2, '0');
                const mes = (estimada.getMonth() + 1).toString().padStart(2, '0');
                const ano = estimada.getFullYear();
                const dataFormatada = `${dia}/${mes}/${ano}`;
                return (
                  <Text style={{ fontSize: 15, color: '#333', marginBottom: 6 }}>
                    Previsão de entrega: <Text style={{ fontWeight: 'bold' }}>{dataFormatada}</Text>
                  </Text>
                );
              })()}

              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
                Total com frete: R${(totalCarrinho + valorFrete).toFixed(2).replace('.', ',')}
              </Text>

              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Escolha a forma de pagamento:</Text>

              <TouchableOpacity
                style={[
                  styles.checkoutOption,
                  pagamentoSelecionado === 'pix' && styles.checkoutOptionSelected,
                ]}
                onPress={() => setPagamentoSelecionado('pix')}
              >
                <Text style={styles.checkoutOptionText}>PIX</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.checkoutOption,
                  pagamentoSelecionado === 'boleto' && styles.checkoutOptionSelected,
                ]}
                onPress={() => setPagamentoSelecionado('boleto')}
              >
                <Text style={styles.checkoutOptionText}>Boleto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.checkoutOption,
                  pagamentoSelecionado === 'cartao' && styles.checkoutOptionSelected,
                  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
                ]}
                onPress={() => setPagamentoSelecionado('cartao')}
              >
                <Text style={styles.checkoutOptionText}>Cartão de Crédito</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Image source={require('./assets/images/Visa_Logo.png')} style={{ width: 40, height: 24, resizeMode: 'contain' }} />
                  <Image source={require('./assets/images/Mastercard-logo.png')} style={{ width: 40, height: 24, resizeMode: 'contain' }} />
                  <Image source={require('./assets/images/American_Express_logo_(2018).svg.png')} style={{ width: 40, height: 24, resizeMode: 'contain' }} />
                </View>
              </TouchableOpacity>

              {pagamentoSelecionado && (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#2a7', marginTop: 15 }]}
                  onPress={() => {
                    setModalCarrinho(false);

                    setMostrarPagamento(true);
                    setPagamentoConfirmado(false);

                    setTimeout(() => {
                      setPagamentoConfirmado(true);
                      Animated.timing(checkScaleAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                      }).start();
                    }, 2000);
                  }}
                >
                  <Text style={styles.buttonText}>Finalizar Compra</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#b33', marginTop: 10 }]}
        onPress={() => {
          setModalCarrinho(false);
          setMostrarCheckout(false);
          setFreteSelecionado(null);
          setValorFrete(0);
          setPagamentoSelecionado(null);
        }}
      >
        <Text style={styles.buttonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>



<Modal
  visible={modalPedidos}
  animationType="slide"
  transparent
  onRequestClose={() => setModalPedidos(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Pedidos em andamento</Text>

      <ScrollView style={{ marginBottom: 10 }}>
        {(!global.carrinhoFinalizado || global.carrinhoFinalizado.length === 0) && (
          <Text style={{ color: '#333', textAlign: 'center', marginTop: 20 }}>
            Nenhum pedido finalizado ainda.
          </Text>
        )}

    {global.carrinhoFinalizado && global.carrinhoFinalizado.map((p, index) => (
      <View key={index} style={styles.cardCarrinho}>
        <Image source={{ uri: p.imagem }} style={styles.cardImageCarrinho} />
        <View style={styles.cardContentCarrinho}>
          <Text style={styles.cardTitle}>{p.nome}</Text>
          <Text style={styles.cardPrice}>
            R${Number(p.preco).toFixed(2).replace('.', ',')}
          </Text>
          <Text style={styles.cardDesc}>{p.descricao}</Text>
          <Text style={{ color: '#333', marginTop: 5 }}>
            Data de compra: {p.dataCompra}
          </Text>
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


<Modal
  visible={mostrarPagamento}
  transparent
  animationType="fade"
  onRequestClose={() => setMostrarPagamento(false)}
>
  <View style={styles.modalOverlay}>
    <View style={[styles.modalContent, { alignItems: 'center', justifyContent: 'center' }]}>
      {!pagamentoConfirmado ? (
        <>
          <ActivityIndicator size="large" color="#2a7" style={{ marginBottom: 15 }} />
          <Text style={{ fontSize: 16, color: '#333' }}>Aguardando pagamento...</Text>
        </>
      ) : (
        <>
          <View style={{ alignItems: 'center', marginBottom: 15 }}>
            <Animated.View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#2a7',
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ scale: checkScaleAnim }],
              }}
            >
              <Text style={{ color: '#fff', fontSize: 32 }}>✓</Text>
            </Animated.View>
          </View>
          <Text style={{ fontSize: 16, color: '#333', marginBottom: 20 }}>
            Pagamento realizado com sucesso!
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#fa0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }]}
            onPress={() => {
              const dataCompra = new Date().toLocaleDateString();

global.carrinhoFinalizado = [
  ...(global.carrinhoFinalizado || []),
  ...carrinho.map(item => ({
    ...item,
    dataCompra: new Date().toLocaleDateString(),
    imagem: item.imagem, // garante que a imagem vá também
    total: item.preco,   // se quiser mostrar total do item
  }))
];


              setCarrinho([]);
              setMostrarPagamento(false);
              setMostrarCheckout(false);
              setFreteSelecionado(null);
              setValorFrete(0);
              setPagamentoSelecionado(null);
              setFinalizandoCompra(false);
              setPagamentoConcluido(false);
            }}
          >
            <Text style={[styles.buttonText]}>Fechar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
</Modal>

  </View>
);

}

const styles = StyleSheet.create({
  checkoutContainer: {
  marginTop: 10,
  padding: 10,
  backgroundColor: '#eee',
  borderRadius: 8,
},
checkoutTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#000',
  marginBottom: 10,
},
checkoutOption: {
  padding: 10,
  borderRadius: 5,
  backgroundColor: '#ccc',
  marginBottom: 8,
},
checkoutOptionSelected: {
  backgroundColor: '#fa0',
},
checkoutOptionText: {
  color: '#000',
  fontWeight: 'bold',
},

  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#ccc', marginBottom: 20 },
  card: { flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, marginBottom: 15 },
  cardImage: { width: 150, height: '100%', borderRadius: 8, marginRight: 10 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  cardPrice: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#000' },
  cardDesc: { fontSize: 14, color: '#000', marginVertical: 1 },
  button: { backgroundColor: '#444', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  buttonClose: { backgroundColor: '#b33', marginTop: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 8, width: '100%', maxHeight: '90%', padding: 20 },
  modalImage: { width: '100%', height: 250, borderRadius: 8, marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#000' },
  modalPrice: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#000' },
  modalDesc: { fontSize: 14, color: '#333' },
  cardCarrinho: { flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, marginBottom: 15 },
  cardImageCarrinho: { width: 100, height: '100%', borderRadius: 8, marginRight: 10 },
  cardContentCarrinho: { flex: 1, justifyContent: 'center' },
  toastContainer: { position: 'absolute', top: 40, left: 0, right: 0, alignItems: 'center', zIndex: 9999, elevation: 9999 },
  toast: { borderRadius: 14, paddingVertical: 12, paddingHorizontal: 28, minWidth: 200, alignItems: 'center' },
  toastText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
