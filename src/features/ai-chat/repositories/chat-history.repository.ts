import { supabase } from '../../../services/supabase.client';
import { ChatMessageTurn } from '../types/chat-session.types';

const LOCAL_STORAGE_KEY = 'kodigo_chat_history_v2';
const SESSION_KEY = 'kodigo_active_chat_session';

class ChatHistoryRepository {
  private localMessages: ChatMessageTurn[] = [];

  constructor() {
    this.loadFromLocal();
  }

  private loadFromLocal(): void {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        this.localMessages = JSON.parse(raw) as ChatMessageTurn[];
      } catch {
        this.localMessages = [];
      }
    }
  }

  getMessages(): ChatMessageTurn[] {
    return [...this.localMessages];
  }

  private async getOrCreateSession(userId: string): Promise<string | null> {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const { data } = await supabase
      .from('chat_sessions')
      .insert({ user_id: userId, title: 'Conversa com Pytho' })
      .select('id')
      .single();

    if (data?.id) {
      localStorage.setItem(SESSION_KEY, data.id);
      return data.id;
    }
    return null;
  }

  async saveMessage(msg: ChatMessageTurn): Promise<void> {
    this.localMessages.push(msg);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.localMessages));

    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) return;

      const sessionId = await this.getOrCreateSession(user.id);
      if (!sessionId) return;

      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(msg.id);

      await supabase.from('chat_messages').insert({
        ...(isValidUuid ? { id: msg.id } : {}),
        session_id: sessionId,
        user_id: user.id,
        sender: msg.sender,
        message: msg.text,
        code_snippet: msg.codeSnippet || null,
        created_at: new Date(msg.createdAt).toISOString()
      });
    } catch {
      // Local copy guarantees uninterrupted UI responsiveness
    }
  }

  subscribeToRealtime(onNewMessage: (msg: ChatMessageTurn) => void): () => void {
    const channel = supabase
      .channel('chat_messages_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const row = payload.new as {
            id: string;
            sender: 'user' | 'pytho';
            message: string;
            code_snippet?: string;
            created_at: string;
          };
          if (row && !this.localMessages.some((m) => m.id === row.id)) {
            const incoming: ChatMessageTurn = {
              id: row.id,
              sender: row.sender,
              text: row.message,
              codeSnippet: row.code_snippet,
              createdAt: new Date(row.created_at).getTime()
            };
            this.localMessages.push(incoming);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.localMessages));
            onNewMessage(incoming);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  clearHistory(): void {
    this.localMessages = [];
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
  }
}

export const chatHistoryRepository = new ChatHistoryRepository();
