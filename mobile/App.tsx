import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { UserStats, TrackNode } from './src/types/mobile.types';
import { MobileHeader } from './src/features/header/components/MobileHeader.component';
import { MobileTrail } from './src/features/trail/components/MobileTrail.component';
import { MobileChatModal } from './src/features/ai-chat/components/MobileChatModal.component';

const INITIAL_NODES: TrackNode[] = [
  { id: 'm1', title: '1. O que é Código?', type: 'theory', completed: true, locked: false, xpReward: 20 },
  { id: 'm2', title: '2. Variáveis e Memória', type: 'challenge', completed: true, locked: false, xpReward: 25 },
  { id: 'm3', title: '3. Tipos Primitivos', type: 'challenge', completed: false, locked: false, xpReward: 30 },
  { id: 'm4', title: '4. Condicionais (if/else)', type: 'theory', completed: false, locked: true, xpReward: 35 },
  { id: 'm5', title: '5. Laços de Repetição', type: 'project', completed: false, locked: true, xpReward: 40 },
  { id: 'm6', title: '6. Desafio do Pytho', type: 'boss', completed: false, locked: true, xpReward: 50 },
];

export default function App() {
  const [stats, setStats] = useState<UserStats>({
    hearts: 5,
    maxHearts: 5,
    gems: 480,
    streak: 9,
    xp: 280,
    isPro: false,
  });

  const [nodes, setNodes] = useState<TrackNode[]>(INITIAL_NODES);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSelectNode = (selected: TrackNode) => {
    Alert.alert(
      selected.title,
      `Lição interativa Kodigo (+${selected.xpReward} XP).\nDeseja concluir agora para ganhar XP e gemas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Concluir Lição',
          onPress: () => {
            setStats((prev) => ({
              ...prev,
              xp: prev.xp + selected.xpReward,
              gems: prev.gems + 15,
            }));
            setNodes((prev) =>
              prev.map((n, idx) => {
                if (n.id === selected.id) return { ...n, completed: true };
                if (idx > 0 && prev[idx - 1].id === selected.id) return { ...n, locked: false };
                return n;
              })
            );
            Alert.alert('Sssssensacional! 🐍', `+${selected.xpReward} XP e +15 Gemas adicionados!`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <MobileHeader
        stats={stats}
        trackName="Nível 1 - Básico (Fundamentos)"
        onOpenChat={() => setIsChatOpen(true)}
      />
      <View style={styles.body}>
        <MobileTrail nodes={nodes} onSelectNode={handleSelectNode} />
      </View>
      <MobileChatModal visible={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  body: {
    flex: 1,
  },
});
