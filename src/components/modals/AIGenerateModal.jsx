import { useMemo, useRef, useState } from 'react';
import { Sparkles, RotateCcw, Check, X, Send, Wand2, Cpu, Cloud, KeyRound, Eye, EyeOff, ExternalLink, ImagePlus, Trash2 } from 'lucide-react';

import { backgroundToCss } from '../../constants/background';
import { generateMagazine, AI_EXAMPLES } from '../../utils/aiGenerator';
import { generateMagazineBatched, getGeminiKey, setGeminiKey } from '../../utils/geminiClient';
import { uid } from '../../utils/helpers';
import BoxContent from '../elements/BoxContent';
import ImageContent from '../elements/ImageContent';
import ProductContent from '../elements/ProductContent';
import TextContent from '../elements/TextContent';

// Render estático e em escala de um elemento (para os thumbnails de preview).
function StaticEl({ el }) {
  if (el.hidden) return null;
  return (
    <div className="absolute" style={{
      left: el.x, top: el.y, width: el.w, height: el.h,
      transform: `rotate(${el.rotation || 0}deg)`, opacity: el.opacity ?? 1,
      borderRadius: ['image', 'box', 'product'].includes(el.type) ? (el.radius || 0) : 0,
      boxShadow: el.type === 'product' && el.productId ? '0 4px 14px rgba(0,0,0,.18)' : 'none',
    }}>
      {el.type === 'product' && <ProductContent el={el} />}
      {el.type === 'image' && <ImageContent el={el} />}
      {el.type === 'box' && <BoxContent el={el} />}
      {el.type === 'text' && <TextContent el={el} editing={false} onCommit={() => {}} />}
    </div>
  );
}

function PagePreview({ page, format, scale }) {
  return (
    <div className="shrink-0 relative" style={{ width: format.w * scale, height: format.h * scale }}>
      <div className="relative overflow-hidden rounded shadow-xl origin-top-left border border-stone-700"
        style={{ width: format.w, height: format.h, transform: `scale(${scale})`,
          background: backgroundToCss(page.background) }}>
        {page.elements.map((el, i) => <StaticEl key={i} el={el} />)}
      </div>
    </div>
  );
}

export default function AIGenerateModal({ format, savedTemplates = [], onApply, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState([]);   // [{ prompt, pages }]
  const [result, setResult] = useState(null);    // { pages } | { error }
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const refImgRef = useRef(null);

  // Modo de geração: 'local' (motor embutido) ou 'gemini' (API real).
  const [mode, setMode] = useState(getGeminiKey() ? 'gemini' : 'local');
  // Config de chave do Gemini (modo protótipo: localStorage).
  const [keyInput, setKeyInput] = useState(getGeminiKey());
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(!!getGeminiKey());

  // Imagens de referência (revistas antigas) — só usadas no modo Gemini.
  // Cada item: { name, mimeType, data(base64 sem prefixo), preview(dataURL) }
  const [refImages, setRefImages] = useState([]);

  // Geração de imagens decorativas (etapa 2, modelo de imagem).
  const [genImages, setGenImages] = useState(false);
  const [imgProgress, setImgProgress] = useState(null); // { done, total } | null
  // Auto-lote: fase atual e progresso por página (preview incremental).
  const [phase, setPhase] = useState(null);             // 'plan'|'pages'|'single'|'images'|null
  const [pageProgress, setPageProgress] = useState(null); // { done, total } | null

  const onPickRefImages = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    const loaded = await Promise.all(files.map(file => new Promise((res) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const data = String(dataUrl).split(',')[1] || '';
        res({ name: file.name, mimeType: file.type || 'image/png', data, preview: dataUrl });
      };
      reader.readAsDataURL(file);
    })));
    setRefImages(prev => [...prev, ...loaded].slice(0, 4));
    if (refImgRef.current) refImgRef.current.value = '';
  };
  const removeRefImage = (i) => setRefImages(prev => prev.filter((_, idx) => idx !== i));

  const saveKey = () => {
    setGeminiKey(keyInput);
    setKeySaved(!!keyInput.trim());
    if (keyInput.trim()) setMode('gemini');
  };
  const clearKey = () => {
    setGeminiKey('');
    setKeyInput('');
    setKeySaved(false);
    setMode('local');
  };

  const generate = async (text) => {
    const p = (text ?? prompt).trim();
    if (!p) return;
    setLoading(true);
    setResult(null);
    setPhase(null);
    setPageProgress(null);
    let out;
    if (mode === 'gemini') {
      setImgProgress(null);
      // Acumula páginas conforme ficam prontas (preview incremental).
      const ready = [];
      out = await generateMagazineBatched({
        prompt: p, format, savedTemplates,
        images: refImages.map(({ mimeType, data }) => ({ mimeType, data })),
        withImages: genImages,
        onImageProgress: (done, total) => setImgProgress({ done, total }),
        onPlan: (total) => setPageProgress({ done: 0, total }),
        onPhase: (ph) => setPhase(ph),
        onPageReady: (pg, i, total) => {
          ready.push(pg);
          setResult({ pages: [...ready] });          // mostra a página assim que chega
          setPageProgress({ done: ready.length, total });
        },
      });
      setImgProgress(null);
      setPhase(null);
      setPageProgress(null);
    } else {
      // Motor local é síncrono; pequeno atraso para feedback de UI.
      await new Promise(r => setTimeout(r, 200));
      out = generateMagazine({ prompt: p, format });
    }
    setResult(out);
    if (!out.error && out.pages?.length) {
      setHistory(h => [{ prompt: p, pages: out.pages }, ...h].slice(0, 8));
    }
    setLoading(false);
  };

  // Rótulo do botão durante a geração, conforme a fase do auto-lote.
  const loadingLabel = () => {
    if (imgProgress) return `Gerando imagens ${imgProgress.done}/${imgProgress.total}…`;
    if (phase === 'plan') return 'Planejando o projeto…';
    if (phase === 'pages' && pageProgress) return `Gerando página ${pageProgress.done + 1}/${pageProgress.total}…`;
    if (mode === 'gemini') return 'Consultando Gemini…';
    return 'Gerando…';
  };

  // Escala dos thumbnails para caberem lado a lado.
  const previewScale = useMemo(() => {
    const n = result?.pages?.length || 1;
    const maxPerRowW = 720;
    const target = Math.min(220, maxPerRowW / Math.min(n, 3));
    return Math.min(target / format.w, 0.42);
  }, [result, format.w]);

  // Aplica injetando ids e defaults que o editor espera.
  const apply = () => {
    if (!result?.pages?.length) return;
    const pages = result.pages.map(pg => ({
      background: pg.background,
      elements: pg.elements.map(el => ({
        id: uid(), rotation: 0, opacity: 1, hidden: false, locked: false,
        radius: el.radius ?? 0, ...el,
      })),
    }));
    onApply(pages);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div onClick={e => e.stopPropagation()}
        className="relative w-[860px] max-w-[94vw] max-h-[88vh] flex flex-col bg-stone-950 border border-stone-800 rounded-xl shadow-2xl overflow-hidden">

        {/* header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#e5006d,#00813A)' }}>
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-100 leading-none">Gerar páginas com IA</h3>
              <p className="text-[10px] text-stone-500 mt-1 leading-none">
                {mode === 'gemini' ? 'Gemini 2.5 Flash · modo protótipo (chave local)' : 'Geração local · padrão Lebes'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-200 transition"><X size={16} /></button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* seletor de modo */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mr-1">Motor</span>
            <div className="flex rounded-md border border-stone-800 overflow-hidden">
              <button onClick={() => setMode('local')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition ${mode === 'local' ? 'bg-emerald-700 text-white font-semibold' : 'bg-stone-900 text-stone-400 hover:text-stone-200'}`}>
                <Cpu size={13} /> Local
              </button>
              <button onClick={() => { if (keySaved) setMode('gemini'); }}
                disabled={!keySaved}
                title={keySaved ? '' : 'Configure a chave do Gemini abaixo'}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition ${mode === 'gemini' ? 'bg-emerald-700 text-white font-semibold' : 'bg-stone-900 text-stone-400 hover:text-stone-200 disabled:opacity-40 disabled:hover:text-stone-400'}`}>
                <Cloud size={13} /> Gemini 2.5 Flash
              </button>
            </div>
          </div>

          {/* config da chave Gemini (modo protótipo) */}
          <details className="rounded-md border border-stone-800 bg-stone-900/40" open={!keySaved}>
            <summary className="cursor-pointer select-none px-3 py-2 text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1.5">
              <KeyRound size={12} /> Chave do Gemini
              {keySaved && <span className="text-emerald-400 ml-1">· configurada</span>}
            </summary>
            <div className="px-3 pb-3 pt-1 space-y-2">
              <p className="text-[10px] text-amber-300/80 bg-amber-950/30 border border-amber-900/40 rounded px-2 py-1.5 leading-relaxed">
                Modo protótipo: a chave fica salva só no seu navegador (localStorage) e é enviada direto à API do Google. Quando o Back-end for criado, a chave será preenchida direto no código.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={keyInput}
                    onChange={e => setKeyInput(e.target.value)}
                    placeholder="AIza..."
                    className="w-full bg-stone-900 border border-stone-700/60 rounded-md pl-3 pr-9 py-1.5 text-xs text-stone-100 font-mono placeholder:text-stone-600 focus:outline-none focus:border-emerald-600/60"
                  />
                  <button onClick={() => setShowKey(s => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300">
                    {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                <button onClick={saveKey} disabled={!keyInput.trim()}
                  className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition">
                  Salvar
                </button>
                {keySaved && (
                  <button onClick={clearKey}
                    className="text-stone-400 hover:text-rose-300 text-xs px-2 py-1.5 rounded-md hover:bg-stone-800/60 transition">
                    Remover
                  </button>
                )}
              </div>
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-stone-500 hover:text-emerald-300 transition">
                Obter uma chave no Google AI Studio <ExternalLink size={10} />
              </a>
            </div>
          </details>

          {/* prompt input */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
              Descreva o projeto
            </label>
            <div className="mt-1.5 flex gap-2">
              <textarea
                ref={inputRef}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate(); }}
                rows={3}
                placeholder='Ex.: Banner de Dia das Mães, fundo rosa. Card de oferta de TV 55". Revista 2 páginas — capa verde + grade 3×2 de eletro.'
                className="flex-1 resize-none bg-stone-900/60 border border-stone-700/60 rounded-md px-3 py-2 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-emerald-600/60"
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {AI_EXAMPLES.map((ex, i) => (
                  <button key={i} onClick={() => { setPrompt(ex); generate(ex); }}
                    className="text-[10px] text-stone-400 hover:text-emerald-300 bg-stone-900/60 border border-stone-800 hover:border-emerald-700/50 rounded px-2 py-1 transition">
                    Exemplo {i + 1}
                  </button>
                ))}
              </div>
              <button onClick={() => generate()} disabled={loading || !prompt.trim()}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-semibold px-4 py-2 rounded-md transition">
                {loading ? <Wand2 size={14} className="animate-pulse" /> : <Send size={14} />}
                {loading ? loadingLabel() : 'Gerar'}
                <span className="text-emerald-200/70 text-[10px] ml-1">⌘↵</span>
              </button>
            </div>
          </div>

          {/* imagens de referência (apenas Gemini) */}
          {mode === 'gemini' && (
            <div className="rounded-md border border-stone-800 bg-stone-900/30 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                  Referências visuais <span className="text-stone-600 normal-case tracking-normal">(designs antigos — opcional)</span>
                </span>
                <button onClick={() => refImgRef.current?.click()}
                  className="flex items-center gap-1.5 text-[11px] text-stone-300 hover:text-emerald-300 bg-stone-900 border border-stone-800 hover:border-emerald-700/60 rounded px-2.5 py-1 transition">
                  <ImagePlus size={12} /> Anexar
                </button>
                <input ref={refImgRef} type="file" accept="image/*" multiple className="hidden" onChange={onPickRefImages} />
              </div>
              {refImages.length === 0 ? (
                <p className="text-[10px] text-stone-600 leading-relaxed">
                  Anexe até 4 imagens de páginas/capas antigas. O Gemini usa como referência de estilo (cores, composição). Ele não recria as imagens — gera o layout inspirado nelas.
                </p>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {refImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img.preview} alt={img.name}
                        className="w-16 h-20 object-cover rounded border border-stone-700" />
                      <button onClick={() => removeRefImage(i)}
                        className="absolute -top-1.5 -right-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Trash2 size={9} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* gerar imagens decorativas */}
          {mode === 'gemini' && (
            <label className="flex items-center gap-2.5 rounded-md border border-stone-800 bg-stone-900/30 px-3 py-2.5 cursor-pointer">
              <input type="checkbox" checked={genImages} onChange={e => setGenImages(e.target.checked)}
                className="accent-emerald-600 w-4 h-4" />
              <div className="flex-1">
                <div className="text-xs text-stone-200 font-medium">Gerar imagens decorativas</div>
                <div className="text-[10px] text-stone-500 leading-snug">
                  A IA cria banners/enfeites temáticos (não produtos). Mais lento e com custo extra por imagem. Você pode mover e ajustar depois.
                </div>
              </div>
            </label>
          )}

          {/* indicador de exemplos ativos */}
          {mode === 'gemini' && (
            <p className="text-[10px] text-stone-600">
              Aprendizado por exemplo: {3 + Math.min(savedTemplates.length, 4)} modelo(s) do padrão Lebes no contexto
              {savedTemplates.length > 0 && ` (incl. ${Math.min(savedTemplates.length, 4)} predefinição(ões) sua(s))`}.
            </p>
          )}
          {result?.error && (
            <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-900/50 rounded-md px-3 py-2">
              {result.error}
            </div>
          )}

          {/* preview */}
          {result?.pages?.length > 0 && (
            <div className="border-t border-stone-800 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                  Pré-visualização · {result.pages.length}{pageProgress && loading ? `/${pageProgress.total}` : ''} página{(pageProgress?.total || result.pages.length) > 1 ? 's' : ''}
                  {loading && phase === 'pages' && <span className="text-emerald-400 ml-2 normal-case tracking-normal">gerando…</span>}
                </span>
                <span className="text-[10px] text-stone-600 font-mono">{format.label}</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {result.pages.map((pg, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <PagePreview page={pg} format={format} scale={previewScale} />
                    <span className="text-[9px] text-stone-500 font-mono">
                      {i + 1} · {pg.kind === 'cover' ? 'capa' : 'grade'}
                    </span>
                  </div>
                ))}
                {/* esqueletos das páginas ainda em geração (auto-lote) */}
                {loading && phase === 'pages' && pageProgress && Array.from({ length: Math.max(0, pageProgress.total - result.pages.length) }).map((_, i) => (
                  <div key={`sk-${i}`} className="flex flex-col items-center gap-1">
                    <div className="rounded border border-stone-800 bg-stone-900/40 animate-pulse flex items-center justify-center"
                      style={{ width: format.w * previewScale, height: format.h * previewScale }}>
                      <Wand2 size={18} className="text-stone-700" />
                    </div>
                    <span className="text-[9px] text-stone-600 font-mono">{result.pages.length + i + 1} · …</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* history */}
          {history.length > 1 && (
            <div className="border-t border-stone-800 pt-3">
              <span className="text-[10px] uppercase tracking-wider text-stone-600 font-semibold">Histórico</span>
              <div className="mt-1.5 space-y-1">
                {history.slice(1).map((h, i) => (
                  <button key={i} onClick={() => { setPrompt(h.prompt); setResult({ pages: h.pages }); }}
                    className="block w-full text-left text-[11px] text-stone-400 hover:text-stone-200 truncate px-2 py-1 rounded hover:bg-stone-900/60 transition">
                    {h.prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="shrink-0 flex items-center justify-end gap-2 px-5 py-3 border-t border-stone-800 bg-stone-950/80">
          <button onClick={onClose}
            className="text-xs text-stone-400 hover:text-stone-200 px-3 py-2 rounded-md hover:bg-stone-800/60 transition">
            Cancelar
          </button>
          <button onClick={() => generate()} disabled={!result?.pages?.length || loading}
            className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-emerald-300 disabled:opacity-30 bg-stone-900 border border-stone-800 hover:border-emerald-700/60 px-3 py-2 rounded-md transition">
            <RotateCcw size={13} /> Regenerar
          </button>
          <button onClick={apply} disabled={!result?.pages?.length || loading}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-30 text-white text-xs font-semibold px-4 py-2 rounded-md transition">
            <Check size={14} /> Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
