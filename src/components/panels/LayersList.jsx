import { useState } from 'react';
import { Eye, EyeOff, GripHorizontal, Image as ImageIcon, Lock, Square, Tag, Type } from 'lucide-react';

import { findProductById } from '../../data/ci';

const TYPE_ICON = { product: Tag, image: ImageIcon, text: Type, box: Square };

export default function LayersList({ elements, selectedId, activeIds = [], onSelect, onToggleHidden, onMoveLayer }) {
  const sel = (id) => activeIds.includes(id) || selectedId === id;
  // No array `elements`: índice 0 = atrás. Na UI mostramos do topo (frente) ao fundo, então invertemos.
  const ordered = [...elements].reverse();
  const [draggedId, setDraggedId] = useState(null);
  const [over, setOver] = useState(null);   // { id, position: 'before'|'after' }

  const onDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // necessário no Firefox
    try { e.dataTransfer.setData('text/plain', id); } catch {}
  };
  const onDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id === draggedId) { setOver(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const middle = rect.top + rect.height / 2;
    setOver({ id, position: e.clientY < middle ? 'before' : 'after' });
  };
  const onDrop = (e) => {
    e.preventDefault();
    if (!draggedId || !over) { setDraggedId(null); setOver(null); return; }
    // A lista da UI está invertida: "before" na UI = "after" no array.
    const arrayPosition = over.position === 'before' ? 'after' : 'before';
    onMoveLayer(draggedId, over.id, arrayPosition);
    setDraggedId(null); setOver(null);
  };
  const onDragEnd = () => { setDraggedId(null); setOver(null); };

  return (
    <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      {ordered.length === 0 && <div className="text-[10px] text-stone-600 italic text-center py-6">Nenhum elemento.</div>}
      {ordered.map((el) => {
        const Icon = TYPE_ICON[el.type] || Square;
        const label = el.type === 'product'
          ? (el.productId ? (findProductById(el.productId)?.name || 'Produto') : 'Slot vazio')
          : el.type === 'text' ? `"${(el.text || '').slice(0, 18)}"`
          : el.type === 'image' ? (el.src ? 'Imagem' : 'Imagem vazia') : 'Caixa';
        const isDragged = draggedId === el.id;
        const isOver = over?.id === el.id;
        return (
          <div key={el.id}
            draggable
            onDragStart={(e) => onDragStart(e, el.id)}
            onDragOver={(e) => onDragOver(e, el.id)}
            onDragEnd={onDragEnd}
            onClick={(e) => onSelect(el.id, e.shiftKey)}
            className={`group relative flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition
              ${sel(el.id) ? 'bg-emerald-950/60 border border-emerald-700/50' : 'hover:bg-stone-900/60 border border-transparent'}
              ${isDragged ? 'opacity-40' : ''}`}>
            {/* Indicador de drop */}
            {isOver && over?.position === 'before' && (
              <div className="absolute -top-0.5 left-2 right-2 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(16,185,129,.6)] pointer-events-none" />
            )}
            {isOver && over?.position === 'after' && (
              <div className="absolute -bottom-0.5 left-2 right-2 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(16,185,129,.6)] pointer-events-none" />
            )}
            <GripHorizontal size={11} className="text-stone-600 group-hover:text-stone-400 shrink-0 cursor-grab active:cursor-grabbing" />
            <Icon size={13} className={sel(el.id) ? 'text-emerald-400' : 'text-stone-500'} />
            <span className={`flex-1 text-xs truncate ${el.hidden ? 'text-stone-600 line-through' : sel(el.id) ? 'text-emerald-200' : 'text-stone-300'}`}>{label}</span>
            {el.locked && <Lock size={11} className="text-stone-500" />}
            <button onClick={(e) => { e.stopPropagation(); onToggleHidden(el.id); }} className="text-stone-500 hover:text-stone-200">
              {el.hidden ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// GRID POPOVER
// ============================================================
