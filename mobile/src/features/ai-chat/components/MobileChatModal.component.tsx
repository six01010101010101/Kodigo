import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ChatMessage } from '../../../types/mobile.types';
import { mobileChatService } from '../services/mobile-chat.service';

interface MobileChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export const MobileChatModal: React.FC<MobileChatModalProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastActiveTime, setLastActiveTime] = useState<number>(0);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      const now = Date.now();
      if (!lastActiveTime || now - lastActiveTime > 30 * 60 * 1000) {
        setMessages([]);
      }
      setLastActiveTime(now);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [visible]);

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = { id: `u_${Date.now()}`, sender: 'user', text: q.trim(), createdAt: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await mobileChatService.askPytho(q.trim(), [...messages, userMsg]);
      setMessages((prev) => [...prev, reply]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ['Oi, tudo bem?', 'Que horas são agora?', 'Estou bem!', 'Código em Python'];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.mascotEmoji}>🐍</Text>
            <View>
              <Text style={styles.titleText}>Pytho IA</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Pytho Online</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView ref={scrollRef} style={styles.messagesList} contentContainerStyle={styles.messagesContent}>
          {messages.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🐍</Text>
              <Text style={{ color: '#F8FAFC', fontSize: 16, fontWeight: '900', marginBottom: 6 }}>Nova Conversa com Pytho IA</Text>
              <Text style={{ color: '#94A3B8', fontSize: 12, textAlign: 'center', lineHeight: 18 }}>Pergunte qualquer coisa sobre ciência, tecnologia, programação, cotidiano ou sobre o seu dia!</Text>
            </View>
          )}
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <View key={m.id} style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.pythoWrapper]}>
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.pythoBubble]}>
                  <Text style={[styles.bubbleText, isUser ? styles.userText : styles.pythoText]}>{m.text}</Text>
                  {m.codeSnippet && (
                    <View style={styles.codeSnippetBox}>
                      <Text style={styles.codeSnippetText}>{m.codeSnippet}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.timeText}>{isUser ? 'Enviado agora' : 'agora'}</Text>
              </View>
            );
          })}
          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#10B981" />
              <Text style={styles.loadingText}>Pytho IA está digitando...</Text>
            </View>
          )}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsContainer}>
          {suggestions.map((s) => (
            <TouchableOpacity key={s} onPress={() => handleSend(s)} style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Pergunte ao Pytho..."
            placeholderTextColor="#64748B"
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.disabledButton]}
            onPress={() => handleSend()}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendButtonText}>➔</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 14,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  mascotEmoji: { fontSize: 26, marginRight: 10 },
  titleText: { color: '#F8FAFC', fontSize: 16, fontWeight: '900' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 },
  statusText: { color: '#10B981', fontSize: 11, fontWeight: '700' },
  closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { color: '#F8FAFC', fontSize: 16, fontWeight: '800' },
  messagesList: { flex: 1, paddingHorizontal: 14 },
  messagesContent: { paddingVertical: 16 },
  bubbleWrapper: { marginBottom: 12, maxWidth: '85%' },
  userWrapper: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  pythoWrapper: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { padding: 12, borderRadius: 18 },
  userBubble: { backgroundColor: '#2563EB', borderBottomRightRadius: 2 },
  pythoBubble: { backgroundColor: '#1E293B', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#334155' },
  bubbleText: { fontSize: 13, lineHeight: 19, fontWeight: '600' },
  userText: { color: '#FFFFFF' },
  pythoText: { color: '#E2E8F0' },
  codeSnippetBox: { marginTop: 8, backgroundColor: '#020617', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#1E293B' },
  codeSnippetText: { color: '#34D399', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 11 },
  timeText: { color: '#64748B', fontSize: 10, marginTop: 4, fontWeight: '600' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  loadingText: { color: '#94A3B8', fontSize: 12, fontWeight: '700', marginLeft: 8 },
  suggestionsContainer: { paddingHorizontal: 12, paddingVertical: 8, maxHeight: 46 },
  suggestionChip: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, marginRight: 8, borderWidth: 1, borderColor: '#334155' },
  suggestionText: { color: '#CBD5E1', fontSize: 11, fontWeight: '700' },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#1E293B', borderTopWidth: 1, borderTopColor: '#334155', alignItems: 'center' },
  textInput: { flex: 1, backgroundColor: '#0F172A', color: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, fontSize: 13, borderWidth: 1, borderColor: '#334155', marginRight: 8 },
  sendButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  disabledButton: { backgroundColor: '#334155', opacity: 0.5 },
  sendButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
});
