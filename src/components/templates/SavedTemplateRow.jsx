import { useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import { backgroundToCss } from '../../constants/background';

export default function SavedTemplateRow({ tpl, onApply, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(tpl.name);
  const productCount = tpl.elements.filter(e => e.type === 'product').length;
  const otherCount = tpl.elements.length - productCount;
  const commit = () => { const v = draft.trim(); if (v && v !== tpl.name) onRename(v); setEditing(false); };


  const thumb = useMemo(() => {
    if (tpl.elements.length === 0) return null;

    const w = 560, h = 792;
    return { w, h, elements: tpl.elements };
  }, [tpl.elements]);

  return (
    <div className="group flex items-center gap-2 px-1.5 py-1.5 rounded hover:bg-stone-900/60 transition">
      {/* Mini thumbnail */}
      <div className="shrink-0 w-9 h-12 rounded-sm overflow-hidden relative border border-stone-700"
        style={{ background: backgroundToCss(tpl.background) }}>
        {thumb && thumb.elements.slice(0, 12).map((el, i) => (
          <div key={i} className="absolute"
            style={{
              left: `${(el.x / thumb.w) * 100}%`,
              top: `${(el.y / thumb.h) * 100}%`,
              width: `${(el.w / thumb.w) * 100}%`,
              height: `${(el.h / thumb.h) * 100}%`,
              background: el.type === 'box' ? el.fill : el.type === 'text' ? 'transparent' : 'rgba(255,255,255,.9)',
              border: el.type === 'text' ? `1px solid ${el.color || '#fff'}` : 'none',
              borderRadius: el.radius ? 1 : 0,
            }} />
        ))}
      </div>
      <div className="flex-1 min-w-0">
        {editing ? (
          <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
            onBlur={commit} onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(tpl.name); setEditing(false); } }}
            className="w-full bg-stone-900 border border-emerald-700/60 rounded px-1.5 py-0.5 text-xs text-stone-100 focus:outline-none" />
        ) : (
          <div className="text-xs text-stone-200 truncate font-medium">{tpl.name}</div>
        )}
        <div className="text-[9px] text-stone-500 mt-0.5">
          {productCount} produtos · {otherCount} elementos
        </div>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
        <button onClick={() => setEditing(true)} title="Renomear" className="p-1 text-stone-500 hover:text-stone-200"><Pencil size={11} /></button>
        <button onClick={onDelete} title="Excluir" className="p-1 text-stone-500 hover:text-rose-400"><Trash2 size={11} /></button>
      </div>
      <button onClick={onApply} title="Aplicar à página atual"
        className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white transition">
        Aplicar
      </button>
    </div>
  );
}

// ============================================================
// MODAL SHELL
// ============================================================
