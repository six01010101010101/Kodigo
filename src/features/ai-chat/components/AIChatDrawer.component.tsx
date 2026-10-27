import React, { useState } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { ChatMessage } from '../ai-chat.types';
import { aiChatService } from '../ai-chat.service';
import { PythoMascot } from '../../mascot/components/PythoMascot.component';
import { soundService } from '../../../services/sound.service';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'init_1',
    sender: 'pytho',
    text: 'Sssss! Olá, eu sou o Pytho, sua cobra mentora de programação! Tem alguma dúvida sobre HTML, CSS, JavaScript, Python ou C++?',
    timestamp: 'Agora'
  }
];

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    soundService.playClick();
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Agora'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await aiChatService.askPytho(textToSend);
      soundService.playCorrect();
      setMessages((prev) => [...prev, reply]);
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Como centralizar com Flexbox?',
    'Diferença entre let e const em JS',
    'Exemplo de função em Python'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l-2 border-duo-border dark:border-slate-800 animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-duo-border dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <PythoMascot emotion={loading ? 'thinking' : 'happy'} size="sm" />
            <div>
              <h3 className="font-black text-sm text-duo-charcoal dark:text-white flex items-center gap-1.5">
                <span>Pytho IA</span>
                <Sparkles className="w-4 h-4 text-duo-yellow-dark" />
              </h3>
              <p className="text-[11px] text-duo-green font-bold">Online • Mentor de Código</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-duo-gray hover:text-duo-charcoal dark:hover:text-white">
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-bold leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-duo-blue text-white rounded-br-none shadow-duo-blue'
                    : 'bg-gray-100 dark:bg-slate-800 text-duo-charcoal dark:text-slate-100 rounded-bl-none border border-duo-border dark:border-slate-700'
                }`}
              >
                <p>{msg.text}</p>
                {msg.codeSnippet && (
                  <pre className="mt-2.5 p-2.5 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto border border-slate-800">
                    <code>{msg.codeSnippet}</code>
                  </pre>
                )}
              </div>
              <span className="text-[10px] text-duo-gray mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs font-bold text-duo-gray">
              <Bot className="w-4 h-4 animate-spin text-duo-green" />
              <span>Pytho está digitando uma explicação...</span>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-duo-border dark:border-slate-800 flex gap-1.5 overflow-x-auto">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-[11px] font-bold text-duo-charcoal dark:text-slate-200 whitespace-nowrap transition-colors flex-shrink-0"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-duo-border dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Tire uma dúvida com o Pytho..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-duo-border dark:border-slate-700 bg-duo-bg-light dark:bg-slate-800 text-xs font-bold text-duo-charcoal dark:text-white focus:outline-none focus:border-duo-green"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-2xl bg-duo-green hover:bg-duo-green-dark disabled:bg-gray-200 text-white flex items-center justify-center shadow-duo-green active:translate-y-1 transition-all"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
