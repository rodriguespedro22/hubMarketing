import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { backgroundToCss } from '../../constants/background';
import BackgroundLayer from '../canvas/BackgroundLayer';
import { StaticElement } from '../canvas/StaticPage';

export default function PresentationMode({ pages, format, startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const page = pages[idx];

  const go = (dir) => setIdx(i => Math.max(0, Math.min(pages.length - 1, i + dir)));

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [pages.length, onClose]);

  // Escala a página para caber na viewport, deixando espaço para os controles.
  const availW = typeof window !== 'undefined' ? window.innerWidth - 200 : format.w;
  const availH = typeof window !== 'undefined' ? window.innerHeight - 160 : format.h;
  const scale = Math.min(availW / format.w, availH / format.h, 1.6);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-stone-950/95 backdrop-blur-sm select-none">
      {/* top bar */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3">
        <span className="text-xs uppercase tracking-[0.25em] text-stone-400 font-semibold">Modo apresentação</span>
        <span className="text-xs text-stone-300 font-mono px-3 py-1 bg-stone-900/70 rounded-full">
          {idx + 1} / {pages.length} · {format.label}
        </span>
        <button onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white bg-stone-900/70 hover:bg-stone-800 rounded-md px-3 py-1.5 transition">
          <X size={14} /> Sair (Esc)
        </button>
      </div>

      {/* stage */}
      <div className="flex-1 flex items-center justify-center min-h-0 px-4 relative">
        <button onClick={() => go(-1)} disabled={idx === 0}
          className="absolute left-4 z-10 w-12 h-12 rounded-full bg-stone-900/80 border border-stone-700 text-stone-200 hover:bg-emerald-700 hover:border-emerald-600 disabled:opacity-20 disabled:hover:bg-stone-900/80 flex items-center justify-center transition">
          <ChevronLeft size={24} />
        </button>

        <div style={{ width: format.w * scale, height: format.h * scale }} className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-5 bg-black/50 blur-xl rounded" />
          <div
            className="relative overflow-hidden shadow-2xl origin-top-left"
            style={{
              width: format.w, height: format.h,
              transform: `scale(${scale})`,
              background: '#ffffff',
            }}
          >
            <BackgroundLayer background={page.background} />
            {page.elements.map(el => <StaticElement key={el.id} el={el} />)}
          </div>
        </div>

        <button onClick={() => go(1)} disabled={idx === pages.length - 1}
          className="absolute right-4 z-10 w-12 h-12 rounded-full bg-stone-900/80 border border-stone-700 text-stone-200 hover:bg-emerald-700 hover:border-emerald-600 disabled:opacity-20 disabled:hover:bg-stone-900/80 flex items-center justify-center transition">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* thumbnail strip */}
      <div className="shrink-0 flex items-center justify-center gap-2 px-4 py-3 overflow-x-auto">
        {pages.map((p, i) => (
          <button key={p.id} onClick={() => setIdx(i)}
            className={`shrink-0 rounded border-2 transition ${i === idx ? 'border-emerald-500' : 'border-stone-700 hover:border-stone-500 opacity-70 hover:opacity-100'}`}>
            <div className="w-10 h-14 rounded-sm flex items-center justify-center text-[8px] text-white/70 font-mono"
              style={{ background: backgroundToCss(p.background) }}>{i + 1}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
