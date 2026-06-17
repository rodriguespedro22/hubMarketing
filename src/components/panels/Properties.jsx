import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDownToLine,
  ArrowUpToLine,
  Bold,
  Copy,
  Lock,
  MoveDown,
  MoveUp,
  Trash2,
  Unlock,
  X,
} from 'lucide-react';

import { PRODUCTS } from '../../data/products';
import IconBtn from '../ui/IconBtn';
import NumField from '../ui/NumField';

export default function Properties({ el, onChange, onLayer, onDelete, onDuplicate, onToggleLock }) {
  if (!el) return null;
  const set = (patch) => onChange(el.id, patch);
  return (
    <div className="p-3 space-y-3 overflow-y-auto">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold">
          {el.type === 'product' ? 'Produto' : el.type === 'image' ? 'Imagem' : el.type === 'text' ? 'Texto' : 'Caixa'}
        </span>
        <div className="flex gap-1">
          <IconBtn title="Duplicar" onClick={() => onDuplicate(el.id)}><Copy size={13} /></IconBtn>
          <IconBtn title={el.locked ? 'Desbloquear' : 'Bloquear'} active={el.locked} onClick={() => onToggleLock(el.id)}>
            {el.locked ? <Lock size={13} /> : <Unlock size={13} />}
          </IconBtn>
          <IconBtn title="Excluir" onClick={() => onDelete(el.id)}><Trash2 size={13} /></IconBtn>
        </div>
      </div>

      {/* Position & size */}
      <div className="grid grid-cols-2 gap-2">
        <NumField label="X" value={el.x} onChange={v => set({ x: v })} />
        <NumField label="Y" value={el.y} onChange={v => set({ y: v })} />
        <NumField label="Largura" value={el.w} min={10} onChange={v => set({ w: v })} />
        <NumField label="Altura" value={el.h} min={10} onChange={v => set({ h: v })} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <NumField label="Rotação°" value={el.rotation || 0} min={-180} max={180} onChange={v => set({ rotation: v })} />
        <label className="block">
          <span className="text-[9px] uppercase tracking-wider text-stone-500">Opacidade</span>
          <input type="range" min={0} max={1} step={0.05} value={el.opacity ?? 1}
            onChange={e => set({ opacity: Number(e.target.value) })} className="w-full mt-1 accent-emerald-600" />
        </label>
      </div>

      {/* Border radius for image/box/product */}
      {(el.type === 'image' || el.type === 'box' || el.type === 'product') && (
        <label className="block">
          <span className="text-[9px] uppercase tracking-wider text-stone-500">Arredondamento · {el.radius || 0}px</span>
          <input type="range" min={0} max={120} value={el.radius || 0}
            onChange={e => set({ radius: Number(e.target.value) })} className="w-full mt-1 accent-emerald-600" />
        </label>
      )}

      {/* Image fit */}
      {el.type === 'image' && (
        <div>
          <span className="text-[9px] uppercase tracking-wider text-stone-500">Ajuste</span>
          <div className="flex gap-1 mt-1">
            {['cover', 'contain', 'fill'].map(f => (
              <button key={f} onClick={() => set({ fit: f })}
                className={`flex-1 text-[10px] py-1 rounded ${(el.fit || 'cover') === f ? 'bg-emerald-700 text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-200'}`}>{f}</button>
            ))}
          </div>
        </div>
      )}

      {/* Box fill */}
      {el.type === 'box' && (
        <label className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-wider text-stone-500">Cor de preenchimento</span>
          <input type="color" value={el.fill || '#e5006d'} onChange={e => set({ fill: e.target.value })}
            className="w-8 h-7 rounded bg-transparent border border-stone-700 cursor-pointer" />
        </label>
      )}

      {/* Text props */}
      {el.type === 'text' && (
        <div className="space-y-2.5">
          <label className="block">
            <span className="text-[9px] uppercase tracking-wider text-stone-500">Conteúdo</span>
            <textarea value={el.text} onChange={e => set({ text: e.target.value })} rows={2}
              className="w-full bg-stone-900 border border-stone-800 rounded px-2 py-1 text-xs text-stone-100 focus:outline-none focus:border-emerald-700/60 mt-0.5 resize-none" />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <NumField label="Tamanho" value={el.fontSize} min={6} max={120} onChange={v => set({ fontSize: v })} />
            <label className="block">
              <span className="text-[9px] uppercase tracking-wider text-stone-500">Cor</span>
              <input type="color" value={el.color} onChange={e => set({ color: e.target.value })}
                className="w-full h-7 rounded bg-transparent border border-stone-700 cursor-pointer mt-0.5" />
            </label>
          </div>
          <div className="flex items-center gap-1.5">
            <IconBtn title="Negrito" active={el.weight >= 700} onClick={() => set({ weight: el.weight >= 700 ? 400 : 800 })}><Bold size={13} /></IconBtn>
            <div className="w-px h-5 bg-stone-800" />
            <IconBtn title="Esquerda" active={el.align === 'left'} onClick={() => set({ align: 'left' })}><AlignLeft size={13} /></IconBtn>
            <IconBtn title="Centro" active={el.align === 'center'} onClick={() => set({ align: 'center' })}><AlignCenter size={13} /></IconBtn>
            <IconBtn title="Direita" active={el.align === 'right'} onClick={() => set({ align: 'right' })}><AlignRight size={13} /></IconBtn>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-stone-500">Fonte</span>
            <div className="mt-1">
              <div className="text-[10px] py-1 px-2 rounded bg-emerald-700 text-white inline-block"
                style={{ fontFamily: 'Gantari,sans-serif' }}>Gantari</div>
            </div>
          </div>
        </div>
      )}

      {/* Product assignment */}
      {el.type === 'product' && (
        <div className="text-[10px] text-stone-500 bg-stone-900/50 rounded p-2 leading-relaxed">
          {el.productId
            ? <>Vinculado a <span className="text-emerald-400 font-semibold">{PRODUCTS.find(p => p.id === el.productId)?.name}</span>. Clique noutro produto do catálogo para trocar, ou no X abaixo para esvaziar.</>
            : <>Slot vazio. Com ele selecionado, clique num produto do catálogo para preencher.</>}
          {el.productId && <button onClick={() => set({ productId: null })} className="mt-1.5 text-rose-400 hover:text-rose-300 flex items-center gap-1"><X size={11} /> Esvaziar slot</button>}
        </div>
      )}

      {/* Layer controls */}
      <div className="pt-2 border-t border-stone-800/60">
        <span className="text-[9px] uppercase tracking-wider text-stone-500">Camada</span>
        <div className="flex gap-1 mt-1.5">
          <IconBtn title="Trazer para frente" onClick={() => onLayer(el.id, 'front')}><ArrowUpToLine size={13} /></IconBtn>
          <IconBtn title="Avançar" onClick={() => onLayer(el.id, 'up')}><MoveUp size={13} /></IconBtn>
          <IconBtn title="Recuar" onClick={() => onLayer(el.id, 'down')}><MoveDown size={13} /></IconBtn>
          <IconBtn title="Enviar para trás" onClick={() => onLayer(el.id, 'back')}><ArrowDownToLine size={13} /></IconBtn>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LAYERS PANEL — com drag-and-drop para reordenar camadas
// ============================================================
