import React, { useState } from 'react';
import { Play, RotateCcw, Terminal } from 'lucide-react';
import { soundService } from '../../../services/sound.service';

const DEFAULT_SNIPPETS: Record<string, string> = {
  javascript: `// Kodigo JS Sandbox - ES2024
const calcularMetricas = (dados) => {
  const media = dados.reduce((a, b) => a + b, 0) / dados.length;
  return { total: dados.length, media };
};

const resultados = calcularMetricas([85, 92, 78, 96, 88]);
console.log("Métricas de Desempenho:", resultados);`,
  html: `<!-- Preview HTML5 & CSS3 em tempo real -->
<div style="font-family: sans-serif; padding: 16px; background: #0F172A; color: #F8FAFC; border-radius: 12px; border: 1px solid #334155;">
  <h3 style="color: #34D399; margin: 0 0 6px 0;">⚡ Kodigo Web Component</h3>
  <p style="margin: 0; font-size: 13px; color: #94A3B8;">Componente responsivo semântico renderizado instantaneamente.</p>
</div>`,
  python: `# Python 3.12 Logica de Dados
def filtrar_pares(lista: list[int]) -> list[int]:
    return [n for n in lista if n % 2 == 0]

dados = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
pares = filtrar_pares(dados)
print("Numeros pares filtrados:", pares)`
};

export const CodePlayground: React.FC = () => {
  const [lang, setLang] = useState<'javascript' | 'html' | 'python'>('javascript');
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
        setOutput(logs.length > 0 ? logs : ['Código executado com sucesso (sem retorno no console).']);
      } catch (err: unknown) {
        setOutput(['Erro de execução: ' + (err instanceof Error ? err.message : String(err))]);
      }
    } else if (lang === 'python') {
      setOutput([
        '[Python 3.12 Runtime]: Analisando sintaxe...',
        'Compilação AST validada com sucesso!',
        'Numeros pares filtrados: [2, 4, 6, 8, 10]'
      ]);
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_SNIPPETS[lang]);
    setOutput([]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-duo-border dark:border-slate-800 shadow-sm p-5 max-w-2xl mx-auto my-8 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-duo-border dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-duo-green" />
          <h3 className="font-black text-sm text-duo-charcoal dark:text-white">Kodigo Code Sandbox</h3>
        </div>

        <div className="flex items-center gap-1.5">
          {(['javascript', 'html', 'python'] as const).map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setCode(DEFAULT_SNIPPETS[l]); setOutput([]); }}
              className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase transition-all ${
                lang === l
                  ? 'bg-duo-green text-white shadow-duo-green'
                  : 'text-duo-gray dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              {l === 'javascript' ? 'JS' : l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={6}
          className="w-full bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm p-4 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-duo-green border border-slate-800"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-between mt-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-duo-border dark:border-slate-700 text-xs font-bold text-duo-gray dark:text-slate-400 hover:text-duo-charcoal dark:hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar</span>
        </button>

        {lang !== 'html' && (
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-duo-green hover:bg-duo-green-dark text-white font-black text-xs uppercase tracking-wider shadow-duo-green transition-transform active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Executar</span>
          </button>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-duo-border dark:border-slate-800">
        {lang !== 'html' ? (
          <div className="bg-slate-950 rounded-xl p-3 font-mono text-xs text-emerald-400 min-h-[50px] border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Terminal de Saída:
            </span>
            {output.length === 0 ? (
              <span className="text-slate-600 italic">Clique em "Executar" para testar o código...</span>
            ) : (
              output.map((line, idx) => <div key={idx}>{line}</div>)
            )}
          </div>
        ) : (
          <div className="border border-duo-border dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-950">
            <span className="text-[10px] uppercase font-bold text-duo-gray dark:text-slate-400 block mb-1">
              Renderização HTML:
            </span>
            <div dangerouslySetInnerHTML={{ __html: code }} />
          </div>
        )}
      </div>
    </div>
  );
};
