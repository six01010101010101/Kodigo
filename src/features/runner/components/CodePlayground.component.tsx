import React, { useState } from 'react';
import { Play, RotateCcw, Terminal } from 'lucide-react';
import { soundService } from '../../../services/sound.service';

const DEFAULT_SNIPPETS: Record<string, string> = {
  javascript: `// Kodigo JS Sandbox
const saudacao = (nome) => {
  return "Olá " + nome + "! Bem-vindo ao Kodigo!";
};

console.log(saudacao("Dev"));
const numeros = [1, 2, 3, 4, 5];
console.log("Dobro dos números:", numeros.map(n => n * 2));`,
  html: `<!-- Preview HTML5 em tempo real -->
<div style="font-family: sans-serif; padding: 12px; background: #eef9ff; border-radius: 8px;">
  <h2 style="color: #1CB0F6; margin: 0 0 8px 0;">🚀 Kodigo Web Preview</h2>
  <p style="margin: 0; color: #333;">Experimente criar tags semânticas e componentes modernos!</p>
</div>`
};

export const CodePlayground: React.FC = () => {
  const [lang, setLang] = useState<'javascript' | 'html'>('javascript');
  const [code, setCode] = useState(DEFAULT_SNIPPETS.javascript);
  const [output, setOutput] = useState<string[]>([]);

  const handleRun = () => {
    soundService.playClick();
    if (lang === 'javascript') {
      const logs: string[] = [];
      const customConsole = {
        log: (...args: unknown[]) => {
          logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        },
        error: (...args: unknown[]) => {
          logs.push('[ERRO]: ' + args.join(' '));
        }
      };

      try {
        const runFn = new Function('console', code);
        runFn(customConsole);
        setOutput(logs.length > 0 ? logs : ['Código executado com sucesso (sem saída no console).']);
      } catch (err: unknown) {
        setOutput(['Erro de execução: ' + (err instanceof Error ? err.message : String(err))]);
      }
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_SNIPPETS[lang]);
    setOutput([]);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-duo-border shadow-sm p-5 max-w-2xl mx-auto my-8">
      <div className="flex items-center justify-between pb-3 border-b border-duo-border mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-duo-green" />
          <h3 className="font-black text-sm text-duo-charcoal">Kodigo Code Sandbox</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setLang('javascript'); setCode(DEFAULT_SNIPPETS.javascript); setOutput([]); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
              lang === 'javascript' ? 'bg-duo-yellow text-duo-charcoal' : 'text-duo-gray hover:bg-gray-100'
            }`}
          >
            JavaScript
          </button>
          <button
            onClick={() => { setLang('html'); setCode(DEFAULT_SNIPPETS.html); setOutput([]); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
              lang === 'html' ? 'bg-duo-blue text-white' : 'text-duo-gray hover:bg-gray-100'
            }`}
          >
            HTML Preview
          </button>
        </div>
      </div>

      {/* Editor Textarea */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={6}
          className="w-full bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm p-4 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-duo-green"
          spellCheck={false}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-duo-border text-xs font-bold text-duo-gray hover:text-duo-charcoal"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar</span>
        </button>

        {lang === 'javascript' && (
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-duo-green hover:bg-duo-green-dark text-white font-black text-xs uppercase tracking-wider shadow-duo-green transition-transform active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Executar</span>
          </button>
        )}
      </div>

      {/* Output / Preview Box */}
      <div className="mt-4 pt-3 border-t border-duo-border">
        {lang === 'javascript' ? (
          <div className="bg-slate-100 rounded-xl p-3 font-mono text-xs text-slate-800 min-h-[50px]">
            <span className="text-[10px] uppercase font-bold text-duo-gray block mb-1">
              Terminal de Saída:
            </span>
            {output.length === 0 ? (
              <span className="text-gray-400 italic">Clique em "Executar" para ver o resultado...</span>
            ) : (
              output.map((line, idx) => <div key={idx}>{line}</div>)
            )}
          </div>
        ) : (
          <div className="border border-duo-border rounded-xl p-3 bg-white">
            <span className="text-[10px] uppercase font-bold text-duo-gray block mb-1">
              Renderização HTML:
            </span>
            <div dangerouslySetInnerHTML={{ __html: code }} />
          </div>
        )}
      </div>
    </div>
  );
};
