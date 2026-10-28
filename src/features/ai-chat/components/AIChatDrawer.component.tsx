import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Key } from 'lucide-react';
import { ChatMessage } from '../ai-chat.types';
import { aiChatService } from '../ai-chat.service';
import { PythoMascot } from '../../mascot/components/PythoMascot.component';
import { soundService } from '../../../services/sound.service';
import { formatRelativeTime } from '../../../utils/time.utils';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (aiChatService.checkAndResetExpiredSession()) return [];
    return aiChatService.getHistory();
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setTick] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (aiChatService.checkAndResetExpiredSession()) {
        setMessages([]);
      } else {
        setMessages(aiChatService.getHistory());
      }
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    const unsub = aiChatService.subscribeRealtime((incoming) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) => m.id === incoming.id || (m.sender === incoming.sender && m.text.trim() === incoming.text.trim())
        );
        return isDuplicate ? prev : [...prev, incoming];
      });
    });
    return () => { clearInterval(timer); unsub(); };
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    aiChatService.touchActivity();
    onClose();
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    soundService.playClick();
    aiChatService.touchActivity();
    const userMsg: ChatMessage = { id: `usr_${Date.now()}`, sender: 'user', text: textToSend, createdAt: Date.now() };
    setMessages((prev) => {
      const isDuplicate = prev.some(
        (m) => m.id === userMsg.id || (m.sender === userMsg.sender && m.text.trim() === userMsg.text.trim())
      );
      return isDuplicate ? prev : [...prev, userMsg];
    });
    setInput('');
    setLoading(true);

    try {
      const reply = await aiChatService.askPytho(textToSend);
      soundService.playCorrect();
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) => m.id === reply.id || (m.sender === reply.sender && m.text.trim() === reply.text.trim())
        );
        return isDuplicate ? prev : [...prev, reply];
      });
    } catch {
      // Handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleConfigureApiKey = () => {
    const current = localStorage.getItem('kodigo_gemini_api_key') || '';
    const entered = window.prompt('Configuração de Chave Pytho IA (opcional):', current);
    if (entered !== null) {
      if (entered.trim()) {
        localStorage.setItem('kodigo_gemini_api_key', entered.trim());
        alert('Chave configurada com sucesso para o Pytho IA!');
      } else {
        localStorage.removeItem('kodigo_gemini_api_key');
        alert('Chave removida. Usando servidor Pytho IA oficial.');
      }
    }
  };

  const suggestions = ['Oi, tudo bem?', 'Que horas são agora?', 'Estou bem!', 'Explique buraco negro', 'Código em Python'];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l-2 border-duo-border dark:border-slate-800 animate-slide-left">
        <div className="p-4 border-b border-duo-border dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <PythoMascot emotion={loading ? 'thinking' : 'happy'} size="sm" />
            <div>
              <h3 className="font-black text-sm text-duo-charcoal dark:text-white flex items-center gap-1.5">
                <span>Pytho IA</span>
                <Sparkles className="w-4 h-4 text-duo-yellow-dark" />
              </h3>
              <p className="text-[11px] text-duo-green font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-duo-green animate-pulse" />
                <span>Pytho Online</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleConfigureApiKey} className="p-1.5 rounded-xl border border-duo-border dark:border-slate-700 text-duo-gray hover:text-duo-charcoal dark:hover:text-white" title="Configurar Chave Pytho IA">
              <Key className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1 text-duo-gray hover:text-duo-charcoal dark:hover:text-white">
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
              <PythoMascot emotion="happy" size="md" />
              <h4 className="font-black text-sm text-duo-charcoal dark:text-white mt-3">
                Nova Conversa com Pytho IA
              </h4>
              <p className="text-xs text-duo-gray dark:text-slate-400 max-w-xs mt-1">
                Pergunte qualquer coisa sobre ciência, tecnologia, programação, cotidiano ou sobre o seu dia!
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-bold leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-duo-blue text-white rounded-br-none shadow-duo-blue' : 'bg-gray-100 dark:bg-slate-800 text-duo-charcoal dark:text-slate-100 rounded-bl-none border border-duo-border dark:border-slate-700'}`}>
                <p>{msg.text}</p>
                {msg.codeSnippet && (
                  <pre className="mt-2.5 p-2.5 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto border border-slate-800">
                    <code>{msg.codeSnippet}</code>
                  </pre>
                )}
              </div>
              <span className="text-[10px] text-duo-gray mt-1 px-1">{msg.sender === 'user' ? `Enviado ${formatRelativeTime(msg.createdAt)}` : formatRelativeTime(msg.createdAt)}</span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs font-bold text-duo-gray">
              <Bot className="w-4 h-4 animate-spin text-duo-green" />
              <span>Pytho IA está digitando...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 py-2 border-t border-duo-border dark:border-slate-800 flex gap-1.5 overflow-x-auto">
          {suggestions.map((s) => (
            <button key={s} onClick={() => handleSend(s)} className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-[11px] font-bold text-duo-charcoal dark:text-slate-200 whitespace-nowrap transition-colors flex-shrink-0">
              {s}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-duo-border dark:border-slate-800 bg-white dark:bg-slate-900">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <input type="text" placeholder="Fale com o Pytho ou tire qualquer dúvida..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-duo-border dark:border-slate-700 bg-duo-bg-light dark:bg-slate-800 text-xs font-bold text-duo-charcoal dark:text-white focus:outline-none focus:border-duo-green" />
            <button type="submit" disabled={!input.trim() || loading} className="w-10 h-10 rounded-2xl bg-duo-green hover:bg-duo-green-dark disabled:bg-gray-200 text-white flex items-center justify-center shadow-duo-green active:translate-y-1 transition-all">
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
