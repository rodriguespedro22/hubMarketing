import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDownToLine,
  ArrowUpToLine,
  Bold,
  Clipboard,
  Copy,
  Lock,
  MoveDown,
  MoveUp,
  Pipette,
  Trash2,
  Unlock,
  X,
} from 'lucide-react';

import { PRODUCTS } from '../../data/products';
import IconBtn from '../ui/IconBtn';
import NumField from '../ui/NumField';

const DEFAULT_FIELDS     = { image: true, brand: true, name: true, code: true, price: true };
const DEFAULT_FONT_SIZES = { brand: 7, name: 11, code: 6, priceScale: 0.85 };

function resolveLayout(el) {
  const l = el.layout || 'top';
  if (l === 'vertical')   return 'top';
  if (l === 'horizontal') return 'left';
  return l;
}

const LAYOUT_OPTIONS = [
  { id: 'top',     label: '↑ Acima' },
  { id: 'left',    label: '← Esquerda' },
  { id: 'right',   label: '→ Direita' },
  { id: 'card',    label: '◼ Card' },
  { id: 'minimal', label: '— Mínimo' },
];

const FIELD_OPTIONS = [
  { key: 'image', label: 'Imagem / ícone' },
  { key: 'brand', label: 'Marca' },
  { key: 'name',  label: 'Nome do produto' },
  { key: 'code',  label: 'Código' },
  { key: 'price', label: 'Preço' },
];

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${on ? 'bg-emerald-600' : 'bg-stone-700'}`}
    >
      <span
        className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
        style={{ left: on ? '17px' : '2px' }}
      />
    </button>
  );
}

function SizeInput({ value, min, max, onChange }) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-14 bg-stone-900 border border-stone-800 rounded px-1.5 py-0.5 text-[10px] text-stone-200 text-right focus:outline-none focus:border-emerald-700/60"
    />
  );
}

export default function Properties({ el, onChange, onLayer, onDelete, onDuplicate, onToggleLock, onCopyFormat, onPasteFormat, hasFormatClipboard, pasteCount }) {
  if (!el) return null;
  const set = (patch) => onChange(el.id, patch);

  const layout    = resolveLayout(el);
  const fields    = { ...DEFAULT_FIELDS,     ...(el.fields    || {}) };
  const fontSizes = { ...DEFAULT_FONT_SIZES, ...(el.fontSizes || {}) };

  const setField    = (key, val) => set({ fields:    { ...fields,    [key]: val } });
  const setFontSize = (key, val) => set({ fontSizes: { ...fontSizes, [key]: val } });

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

      {/* ── Produto: vínculo ───────────────────────────────────────── */}
      {el.type === 'product' && (
        <div className="text-[10px] text-stone-500 bg-stone-900/50 rounded p-2 leading-relaxed">
          {el.productId
            ? <>Vinculado a <span className="text-emerald-400 font-semibold">{PRODUCTS.find(p => p.id === el.productId)?.name}</span>. Clique noutro produto do catálogo para trocar, ou no X abaixo para esvaziar.</>
            : <>Slot vazio. Com ele selecionado, clique num produto do catálogo para preencher.</>}
          {el.productId && (
            <button onClick={() => set({ productId: null })} className="mt-1.5 text-rose-400 hover:text-rose-300 flex items-center gap-1">
              <X size={11} /> Esvaziar slot
            </button>
          )}
        </div>
      )}

      {/* ── Produto: posição da imagem ─────────────────────────────── */}
      {el.type === 'product' && (
        <div className="space-y-3">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-stone-500">Posição da imagem</span>
            <div className="grid grid-cols-3 gap-1 mt-1.5">
              {LAYOUT_OPTIONS.slice(0, 3).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => set({ layout: id })}
                  className={`text-[10px] py-1.5 rounded text-center transition ${
                    layout === id ? 'bg-emerald-700 text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {LAYOUT_OPTIONS.slice(3).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => set({ layout: id })}
                  className={`text-[10px] py-1.5 rounded text-center transition ${
                    layout === id ? 'bg-emerald-700 text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Produto: campos visíveis ──────────────────────────── */}
          <div>
            <span className="text-[9px] uppercase tracking-wider text-stone-500">Campos visíveis</span>
            <div className="mt-1.5 space-y-1.5">
              {FIELD_OPTIONS.map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between gap-2 cursor-pointer">
                  <span className="text-[10px] text-stone-300">{label}</span>
                  <Toggle on={fields[key]} onChange={() => setField(key, !fields[key])} />
                </label>
              ))}
            </div>
          </div>

          {/* ── Produto: tamanhos de fonte ────────────────────────── */}
          <div>
            <span className="text-[9px] uppercase tracking-wider text-stone-500">Tamanhos</span>
            <div className="mt-1.5 space-y-1.5">
              {fields.brand && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-stone-400">Marca</span>
                  <SizeInput value={fontSizes.brand} min={4} max={24} onChange={v => setFontSize('brand', v)} />
                </div>
              )}
              {fields.name && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-stone-400">Nome</span>
                  <SizeInput value={fontSizes.name} min={6} max={40} onChange={v => setFontSize('name', v)} />
                </div>
              )}
              {fields.code && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-stone-400">Código</span>
                  <SizeInput value={fontSizes.code} min={4} max={16} onChange={v => setFontSize('code', v)} />
                </div>
              )}
              {fields.price && (
                <label className="block">
                  <span className="text-[9px] uppercase tracking-wider text-stone-500">
                    Escala do preço · {Math.round(fontSizes.priceScale * 100)}%
                  </span>
                  <input
                    type="range" min={0.3} max={1.8} step={0.05}
                    value={fontSizes.priceScale}
                    onChange={e => setFontSize('priceScale', Number(e.target.value))}
                    className="w-full mt-1 accent-emerald-600"
                  />
                </label>
              )}
            </div>
          </div>

          {/* ── Produto: copiar / colar formatação ───────────────── */}
          <div className="flex gap-1.5 pt-1">
            <button
              onClick={onCopyFormat}
              className="flex-1 text-[10px] py-1.5 rounded bg-stone-800 text-stone-300 hover:text-white transition flex items-center justify-center gap-1"
              title="Copiar layout, campos e tamanhos desta box"
            >
              <Pipette size={11} /> Copiar formatação
            </button>
            {hasFormatClipboard && (
              <button
                onClick={onPasteFormat}
                className="flex-1 text-[10px] py-1.5 rounded bg-emerald-900/60 text-emerald-400 hover:text-emerald-300 transition flex items-center justify-center gap-1"
                title="Colar formatação nas boxes selecionadas"
              >
                <Clipboard size={11} />
                Colar{pasteCount > 1 ? ` (${pasteCount})` : ''}
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
