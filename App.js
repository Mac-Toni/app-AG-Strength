import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, ScrollView, 
  SafeAreaView, StatusBar, Alert, TextInput, KeyboardAvoidingView, 
  Platform, Clipboard 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExercicioItem = React.memo(({ item, onToggle, onWeightChange }) => {
  return (
    <View style={[styles.item, item.selecionado && styles.itemSelecionado]}>
      <TouchableOpacity 
        style={styles.areaTextoItem}
        onPress={() => onToggle(item.id)}
      >
        <Text style={[styles.textoItem, item.selecionado && styles.textoSelecionado]}>
          {item.nome}
        </Text>
        {item.selecionado && <Text style={styles.check}>✅</Text>}
      </TouchableOpacity>

      <View style={styles.containerPeso}>
        <TextInput
          style={styles.inputPeso}
          value={item.peso}
          onChangeText={(texto) => onWeightChange(item.id, texto)}
          placeholder="00"
          placeholderTextColor="#666"
          keyboardType="numeric"
          maxLength={3}
        />
        <Text style={styles.labelPeso}>kg</Text>
      </View>
    </View>
  );
});

export default function App() {
  const [grupoAtual, setGrupoAtual] = useState('Treino A');
  const [carregando, setCarregando] = useState(true);
  
  const [treinos, setTreinos] = useState({
    'Treino A': [
      { id: 'a1', nome: 'Supino Reto', selecionado: false, peso: '' },
      { id: 'a2', nome: 'Rosca direta c/ barra', selecionado: false, peso: '' },
      { id: 'a3', nome: 'Supino inclinado', selecionado: false, peso: '' },
      { id: 'a4', nome: 'Rosca alternada', selecionado: false, peso: '' },
      { id: 'a5', nome: 'Supino declinado', selecionado: false, peso: '' },
      { id: 'a6', nome: 'Rosca concentrada', selecionado: false, peso: '' },
      { id: 'a7', nome: 'Supino mãos aproximadas', selecionado: false, peso: '' },
      { id: 'a8', nome: 'Antebraços c/ barra', selecionado: false, peso: '' },
      { id: 'a9', nome: 'Rosca martelo', selecionado: false, peso: '' },
      { id: 'a10', nome: 'Supino c/ halteres', selecionado: false, peso: '' },
      { id: 'a11', nome: 'Crucifixo c/ halteres', selecionado: false, peso: '' },
      { id: 'a12', nome: 'Supino inclinado c/ halteres', selecionado: false, peso: '' },
      { id: 'a13', nome: 'Crucifixo incli. c/ halteres', selecionado: false, peso: '' },
      { id: 'a14', nome: 'Peito estação', selecionado: false, peso: '' },
      { id: 'a15', nome: 'Abdominal', selecionado: false, peso: '' },
    ],
    'Treino B': [
      { id: 'b1', nome: 'Puxada alta frontal', selecionado: false, peso: '' },
      { id: 'b2', nome: 'Puxada alta mãos prox.', selecionado: false, peso: '' },
      { id: 'b3', nome: 'Tríceps barra reta', selecionado: false, peso: '' },
      { id: 'b4', nome: 'Puxada braços esticados', selecionado: false, peso: '' },
      { id: 'b5', nome: 'Tríceps corda', selecionado: false, peso: '' },
      { id: 'b6', nome: 'Remada sentado', selecionado: false, peso: '' },
      { id: 'b7', nome: 'Tríceps coice', selecionado: false, peso: '' },
      { id: 'b8', nome: 'Serrote', selecionado: false, peso: '' },
      { id: 'b9', nome: 'Pux. vert. c/ barra mãos juntas', selecionado: false, peso: '' },
      { id: 'b10', nome: 'Puxada cavalinho', selecionado: false, peso: '' },
      { id: 'b11', nome: 'Levantamento terra', selecionado: false, peso: '' },
      { id: 'b12', nome: 'Elev/abdução escápulas', selecionado: false, peso: '' },
      { id: 'b13', nome: 'Remada curvada pronada', selecionado: false, peso: '' },
      { id: 'b14', nome: 'Remada curvada', selecionado: false, peso: '' },
      { id: 'b15', nome: 'Abdominal', selecionado: false, peso: '' },
    ],
    'Treino C': [
      { id: 'c1', nome: 'Ombro estação', selecionado: false, peso: '' },
      { id: 'c2', nome: 'Extensão pernas', selecionado: false, peso: '' },
      { id: 'c3', nome: 'Des. sentado c/ halteres', selecionado: false, peso: '' },
      { id: 'c4', nome: 'Flexão pernas', selecionado: false, peso: '' },
      { id: 'c5', nome: 'Elev. frontal c/ halteres', selecionado: false, peso: '' },
      { id: 'c6', nome: 'Prensa hack squat', selecionado: false, peso: '' },
      { id: 'c7', nome: 'Elev. lateral c/ halteres', selecionado: false, peso: '' },
      { id: 'c8', nome: 'Leg press inclinado', selecionado: false, peso: '' },
      { id: 'c9', nome: 'Panturrilha', selecionado: false, peso: '' },
      { id: 'c10', nome: 'Elev. lateral tronco p/ frente', selecionado: false, peso: '' },
      { id: 'c11', nome: 'Agachamento c/ barra', selecionado: false, peso: '' },
      { id: 'c12', nome: 'Des. c/ barra atrás da nuca', selecionado: false, peso: '' },
      { id: 'c13', nome: 'Des. c/ barra frente', selecionado: false, peso: '' },
      { id: 'c14', nome: 'Deltóide sent. rot. do punho', selecionado: false, peso: '' },
      { id: 'c15', nome: 'Abdominal', selecionado: false, peso: '' },
    ]
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem('@meu_treino_dados');
        if (dadosSalvos !== null) setTreinos(JSON.parse(dadosSalvos));
      } catch (e) { console.log("Erro ao carregar"); }
      finally { setCarregando(false); }
    };
    carregarDados();
  }, []);

  useEffect(() => {
    if (!carregando) {
      AsyncStorage.setItem('@meu_treino_dados', JSON.stringify(treinos));
    }
  }, [treinos, carregando]);

  const alternarSelecao = useCallback((id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTreinos(prev => ({
      ...prev,
      [grupoAtual]: prev[grupoAtual].map(ex => 
        ex.id === id ? { ...ex, selecionado: !ex.selecionado } : ex
      )
    }));
  }, [grupoAtual]);

  const atualizarPeso = useCallback((id, novoPeso) => {
    setTreinos(prev => ({
      ...prev,
      [grupoAtual]: prev[grupoAtual].map(ex => 
        ex.id === id ? { ...ex, peso: novoPeso } : ex
      )
    }));
  }, [grupoAtual]);

  const exportarBackup = () => {
    Clipboard.setString(JSON.stringify(treinos));
    Alert.alert("Backup Copiado! 📤", "Cole o código em um local seguro.");
  };

  const importarBackup = () => {
    Alert.prompt("Importar Backup 📥", "Cole o código de backup:", [
      { text: "Cancelar", style: "cancel" },
      { text: "Confirmar", onPress: (texto) => {
          try {
            const dados = JSON.parse(texto);
            if (dados['Treino A']) { setTreinos(dados); Alert.alert("Sucesso!"); }
          } catch (e) { Alert.alert("Erro no código."); }
      }}
    ], "plain-text");
  };

  const resetarTreino = () => {
    Alert.alert("Limpar Treino", `Deseja resetar o ${grupoAtual}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Sim", onPress: () => {
          setTreinos(prev => ({
            ...prev,
            [grupoAtual]: prev[grupoAtual].map(ex => ({ ...ex, selecionado: false }))
          }));
      }}
    ]);
  };

  const progresso = useMemo(() => {
    const lista = treinos[grupoAtual] || [];
    const concluidos = lista.filter(ex => ex.selecionado).length;
    return { total: lista.length, concluidos, percentual: lista.length > 0 ? (concluidos / lista.length) * 100 : 0 };
  }, [treinos, grupoAtual]);

  if (carregando) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.titulo}>🏋️ Meu Treino</Text>
          <TouchableOpacity style={styles.botaoLimparTopo} onPress={resetarTreino}>
            <Text style={styles.textoLimparTopo}>Limpar</Text>
          </TouchableOpacity>
        </View>

        {/* Nossos novos botões de Backup */}
        <View style={styles.containerBackup}>
          <TouchableOpacity style={styles.botaoBackup} onPress={exportarBackup}>
            <Text style={styles.textoBackup}>📤 Exportar Dados</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoBackup} onPress={importarBackup}>
            <Text style={styles.textoBackup}>📥 Importar Dados</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.containerProgresso}>
          <View style={styles.barraFundo}><View style={[styles.barraPreenchida, { width: `${progresso.percentual}%` }]} /></View>
          <Text style={styles.textoProgresso}>{progresso.concluidos} de {progresso.total} feitos</Text>
        </View>

        <View style={styles.menu}>
          {Object.keys(treinos).map(grupo => (
            <TouchableOpacity key={grupo} onPress={() => setGrupoAtual(grupo)} style={[styles.botaoMenu, grupoAtual === grupo && styles.botaoAtivo]}>
              <Text style={[styles.textoMenu, grupoAtual === grupo && styles.textoAtivo]}>{grupo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
          {treinos[grupoAtual]?.map((item) => (
            <ExercicioItem key={item.id} item={item} onToggle={alternarSelecao} onWeightChange={atualizarPeso} />
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 20, paddingTop: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 10 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  containerBackup: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  botaoBackup: { backgroundColor: '#252525', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: '#444' },
  textoBackup: { color: '#aaa', fontSize: 11, fontWeight: 'bold' },
  botaoLimparTopo: { backgroundColor: '#252525', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ff3b30' },
  textoLimparTopo: { color: '#ff3b30', fontWeight: 'bold', fontSize: 14 },
  containerProgresso: { marginBottom: 15 },
  barraFundo: { height: 6, backgroundColor: '#333', borderRadius: 3 },
  barraPreenchida: { height: '100%', backgroundColor: '#007AFF', borderRadius: 3 },
  textoProgresso: { color: '#888', fontSize: 12, marginTop: 5, textAlign: 'right' },
  menu: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  botaoMenu: { paddingVertical: 12, borderRadius: 10, backgroundColor: '#252525', flex: 1, marginHorizontal: 4, alignItems: 'center' },
  botaoAtivo: { backgroundColor: '#007AFF' },
  textoMenu: { color: '#888', fontWeight: 'bold' },
  textoAtivo: { color: '#fff' },
  item: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemSelecionado: { backgroundColor: '#1c3d5a', borderColor: '#007AFF', borderWidth: 1 },
  areaTextoItem: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  textoItem: { color: '#fff', fontSize: 15, flexShrink: 1 },
  textoSelecionado: { color: '#007AFF', fontWeight: 'bold' },
  check: { fontSize: 14, marginLeft: 8 },
  containerPeso: { flexDirection: 'row', alignItems: 'center', marginLeft: 10, backgroundColor: '#252525', paddingHorizontal: 8, borderRadius: 6, height: 40 },
  inputPeso: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', width: 42 },
  labelPeso: { color: '#888', fontSize: 12, marginLeft: 2 }
});