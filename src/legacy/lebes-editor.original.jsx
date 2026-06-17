import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  Tv, Smartphone, Shirt, Watch, ShoppingBag, Refrigerator, Sofa, Armchair,
  Utensils, Footprints, Search, Plus, Trash2, Download, Save, ChevronLeft,
  ChevronRight, Eye, Heart, X, Layers, Type, Image as ImageIcon, Square,
  Grid3x3, MoveUp, MoveDown, ArrowUpToLine, ArrowDownToLine, Lock, Unlock,
  AlignLeft, AlignCenter, AlignRight, Bold, Tag, MousePointer2, Layout,
  Maximize2, RotateCw, Copy, EyeOff, Palette, FileImage,
  FolderOpen, FileText, FileJson, FileCheck2, GripHorizontal, Bookmark, Pencil
} from 'lucide-react';

// ============================================================
// MOCK DATA (futura API)
// ============================================================
const ICONS = { Tv, Smartphone, Shirt, Watch, ShoppingBag, Refrigerator, Sofa, Armchair, Utensils, Footprints };

const PRODUCTS = [
  { id: 'p1', name: 'Smart TV 55"', brand: 'TCL', code: '873994', iconName: 'Tv', sector: 'eletro', priceOld: 4399, priceCash: 3899, installments: 20, installmentValue: 338 },
  { id: 'p2', name: 'Galaxy A07 128GB', brand: 'SAMSUNG', code: '869682', iconName: 'Smartphone', sector: 'eletro', priceCash: 999, installments: 15, installmentValue: 103 },
  { id: 'p3', name: 'Roupeiro CB01N565', brand: 'KAPPESBERG', code: '841783', iconName: 'Sofa', sector: 'eletro', priceOld: 3799.9, priceCash: 2999, installments: 15, installmentValue: 279 },
  { id: 'p4', name: 'Lavadora 18kg', brand: 'ELECTROLUX', code: '872891', iconName: 'Refrigerator', sector: 'eletro', priceCash: 2399.9, installments: 20, installmentValue: 208 },
  { id: 'p5', name: 'Aparelho de Jantar', brand: 'FRATELLI', code: 'AP259', iconName: 'Utensils', sector: 'eletro', priceOld: 259.9, priceCash: 169.9, installments: 10, installmentValue: 16.99 },
  { id: 'p12', name: 'Poltrona Confort', brand: 'ESTOFE', code: 'PF8821', iconName: 'Armchair', sector: 'eletro', priceOld: 1899, priceCash: 1399, installments: 12, installmentValue: 119.9 },
  { id: 'p6', name: 'Jaqueta Feminina', brand: 'ENFIM', code: '32841', iconName: 'Shirt', sector: 'moda', priceCash: 319, installments: 10, installmentValue: 31.99 },
  { id: 'p7', name: 'Blusão de Tricô', brand: 'COSTÃO', code: '78211', iconName: 'Shirt', sector: 'moda', priceCash: 99.9, installments: 10, installmentValue: 9.99 },
  { id: 'p8', name: 'Bolsa Tiracolo', brand: 'CHENSON', code: 'BT9941', iconName: 'ShoppingBag', sector: 'moda', priceCash: 99.9, installments: 10, installmentValue: 9.99 },
  { id: 'p9', name: 'Relógio Feminino', brand: 'CONDOR', code: 'RC340', iconName: 'Watch', sector: 'moda', priceCash: 349.9, installments: 10, installmentValue: 34.99 },
  { id: 'p10', name: 'Calça Térmica', brand: 'LUPO', code: '47821', iconName: 'Footprints', sector: 'moda', priceCash: 79.9, installments: 10, installmentValue: 7.99 },
  { id: 'p11', name: 'Bolsa de Mão', brand: 'CHENSON', code: 'BT4302', iconName: 'ShoppingBag', sector: 'moda', priceCash: 189.9, installments: 10, installmentValue: 18.99 },
];

const SECTORS = [
  { id: 'all', label: 'Todos' },
  { id: 'eletro', label: 'Eletromóveis' },
  { id: 'moda', label: 'Moda' },
];

// Formatos de revista (proporções reais convertidas pra px em tela; 1mm ≈ 2.66px @72dpi)
// O usuário escolhe um formato ao criar a revista; vale para todas as páginas.
const PAGE_FORMATS = [
  { id: 'a4',     label: 'A4',          mm: [210, 297], w: 560, h: 792 },
  { id: 'a5',     label: 'A5',          mm: [148, 210], w: 460, h: 652 },
  { id: 'letter', label: 'Carta (US)',  mm: [216, 279], w: 560, h: 723 },
  { id: 'tabloid',label: 'Tabloide',    mm: [279, 432], w: 520, h: 805 },
  { id: 'square', label: 'Quadrado',    mm: [210, 210], w: 600, h: 600 },
];
const DEFAULT_FORMAT = PAGE_FORMATS[0];
const PAGE_W = DEFAULT_FORMAT.w, PAGE_H = DEFAULT_FORMAT.h;  // defaults usados por buildGrid quando nenhum override é passado
const MARGIN = 28;                          // margem de segurança

// Fundos de página (presets identidade Lebes)
const BACKGROUNDS = {
  pink:  'linear-gradient(180deg,#ff8cc3 0%,#e5006d 100%)',
  green: 'linear-gradient(155deg,#00813A 0%,#005224 100%)',
  white: '#ffffff',
  cream: '#f5f0e8',
};

// ============================================================
// HELPERS
// ============================================================
let _id = 1000;
const uid = () => `el_${++_id}`;
const fmt = (n) => Number(n).toFixed(2).replace('.', ',');
const splitMoney = (n) => { const [i, d] = Number(n).toFixed(2).split('.'); return { int: i, dec: d }; };
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// ============================================================
// STARTER TEMPLATES (geram conjuntos de elementos)
// ============================================================
function buildGrid(cols, rows, opts = {}) {
  const pageW = opts.pageW ?? PAGE_W;
  const pageH = opts.pageH ?? PAGE_H;
  const {
    x = MARGIN,
    y = 120,
    w = pageW - MARGIN * 2,
    h = pageH - 200,
    gap = 10,
  } = opts;
  const cellW = (w - gap * (cols - 1)) / cols;
  const cellH = (h - gap * (rows - 1)) / rows;
  const els = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      els.push({
        id: uid(), type: 'product', productId: null,
        x: Math.round(x + c * (cellW + gap)),
        y: Math.round(y + r * (cellH + gap)),
        w: Math.round(cellW), h: Math.round(cellH),
        rotation: 0, opacity: 1, radius: 10, fill: '#ffffff', hidden: false, locked: false,
      });
    }
  }
  return els;
}

const TEMPLATES = [
  {
    id: 'blank', name: 'Em branco', icon: Layout, desc: 'Página vazia',
    make: () => ({ background: 'pink', elements: [] }),
  },
  {
    id: 'grid32', name: 'Grade 3 × 2', icon: Grid3x3, desc: '6 produtos',
    make: () => ({ background: 'pink', elements: buildGrid(3, 2) }),
  },
  {
    id: 'grid23', name: 'Grade 2 × 3', icon: Grid3x3, desc: '6 produtos',
    make: () => ({ background: 'pink', elements: buildGrid(2, 3) }),
  },
  {
    id: 'highlight', name: 'Destaque', icon: Maximize2, desc: '1 grande + 4',
    make: () => ({
      background: 'pink',
      elements: [
        { id: uid(), type: 'text', text: 'OFERTA DESTAQUE', x: MARGIN, y: 36, w: 300, h: 50, rotation: 0, opacity: 1, fontSize: 34, color: '#ffffff', weight: 800, align: 'left', font: 'Fredoka', hidden: false, locked: false },
        { id: uid(), type: 'product', productId: null, x: MARGIN, y: 110, w: 250, h: 300, rotation: 0, opacity: 1, radius: 12, fill: '#ffffff', hidden: false, locked: false },
        ...buildGrid(2, 2, { x: 296, y: 110, w: PAGE_W - 296 - MARGIN, h: 300, gap: 10 }),
      ],
    }),
  },
];

// ============================================================
// PRICE TAG
// ============================================================
function PriceTag({ p, scale = 1 }) {
  const v = splitMoney(p.installmentValue);
  return (
    <div className="leading-none" style={{ transform: `scale(${scale})`, transformOrigin: 'left bottom' }}>
      <span className="font-black text-rose-700" style={{ fontSize: 9 }}>{p.installments}x R$</span>
      <div className="flex items-start text-rose-700" style={{ fontFamily: 'Fredoka,sans-serif' }}>
        <span className="font-black" style={{ fontSize: 38, lineHeight: 0.8 }}>{v.int}</span>
        <span className="font-black" style={{ fontSize: 18 }}>,{v.dec}</span>
      </div>
      <div className="text-stone-700 font-semibold" style={{ fontSize: 7 }}>no Crediário Lebes</div>
      {p.priceOld && <div className="text-stone-500 line-through" style={{ fontSize: 7 }}>De R$ {fmt(p.priceOld)}</div>}
      <div className="text-stone-700 font-semibold" style={{ fontSize: 7 }}>Por R$ {fmt(p.priceCash)} à vista</div>
    </div>
  );
}

// ============================================================
// ELEMENT CONTENT RENDERERS
// ============================================================
function ProductContent({ el }) {
  const p = el.productId ? PRODUCTS.find(x => x.id === el.productId) : null;
  if (!p) {
    return (
      <div className="w-full h-full rounded-[inherit] border-2 border-dashed border-rose-300 bg-rose-50/70 flex flex-col items-center justify-center text-rose-400 pointer-events-none">
        <Tag size={20} strokeWidth={1.5} />
        <span className="text-[9px] uppercase tracking-wider font-semibold mt-1">Slot de produto</span>
      </div>
    );
  }
  const Icon = ICONS[p.iconName] || Square;
  return (
    <div className="w-full h-full rounded-[inherit] bg-white flex flex-col p-2 overflow-hidden pointer-events-none">
      <div className="flex-1 flex items-center justify-center min-h-0">
        <Icon size={Math.min(el.h * 0.45, el.w * 0.6)} className="text-stone-700" strokeWidth={1}
          style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,.15))' }} />
      </div>
      <div className="shrink-0">
        <div className="font-bold uppercase tracking-widest text-stone-700" style={{ fontSize: 7 }}>{p.brand}</div>
        <div className="font-bold text-stone-900 leading-tight" style={{ fontFamily: 'Fredoka,sans-serif', fontSize: 11 }}>{p.name}</div>
        <div className="text-stone-500" style={{ fontSize: 6 }}>cód. {p.code}</div>
        <div className="mt-1"><PriceTag p={p} scale={0.85} /></div>
      </div>
    </div>
  );
}

function ImageContent({ el }) {
  if (!el.src) {
    return (
      <div className="w-full h-full rounded-[inherit] bg-stone-200 flex flex-col items-center justify-center text-stone-400 pointer-events-none">
        <FileImage size={22} strokeWidth={1.5} />
        <span className="text-[9px] mt-1">Imagem</span>
      </div>
    );
  }
  return <img src={el.src} alt="" className="w-full h-full rounded-[inherit] pointer-events-none select-none"
    style={{ objectFit: el.fit || 'cover' }} draggable={false} />;
}

function BoxContent({ el }) {
  return <div className="w-full h-full rounded-[inherit] pointer-events-none"
    style={{ background: el.fill, border: el.borderW ? `${el.borderW}px solid ${el.borderColor || '#000'}` : 'none' }} />;
}

function TextContent({ el, editing, onCommit }) {
  const ref = useRef(null);
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); document.execCommand?.('selectAll', false, null); } }, [editing]);
  return (
    <div
      ref={ref}
      contentEditable={editing}
      suppressContentEditableWarning
      onBlur={(e) => onCommit(e.currentTarget.textContent)}
      className="w-full h-full rounded-[inherit] flex outline-none"
      style={{
        fontFamily: `${el.font || 'Fredoka'},sans-serif`,
        fontSize: el.fontSize, color: el.color, fontWeight: el.weight,
        textAlign: el.align, lineHeight: 1.1,
        alignItems: 'center',
        justifyContent: el.align === 'center' ? 'center' : el.align === 'right' ? 'flex-end' : 'flex-start',
        cursor: editing ? 'text' : 'inherit',
        padding: 4,
        pointerEvents: editing ? 'auto' : 'none',
        userSelect: editing ? 'text' : 'none',
      }}
    >
      {el.text}
    </div>
  );
}

// ============================================================
// CANVAS ELEMENT (drag + resize + select)
// ============================================================
const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
const HANDLE_CURSOR = { nw: 'nwse', n: 'ns', ne: 'nesw', e: 'ew', se: 'nwse', s: 'ns', sw: 'nesw', w: 'ew' };

function CanvasElement({ el, selected, editing, onSelect, onChange, onStartDrag, onStartResize, onCommitText, onStartEditText }) {
  if (el.hidden) return null;
  return (
    <div
      onPointerDown={(e) => { if (editing) return; e.stopPropagation(); onSelect(el.id); if (!el.locked) onStartDrag(e, el); }}
      onDoubleClick={(e) => { if (el.type === 'text') { e.stopPropagation(); onStartEditText(el.id); } }}
      className="absolute group"
      style={{
        left: el.x, top: el.y, width: el.w, height: el.h,
        transform: `rotate(${el.rotation || 0}deg)`,
        opacity: el.opacity ?? 1,
        borderRadius: (el.type === 'image' || el.type === 'box' || el.type === 'product') ? (el.radius || 0) : 0,
        cursor: el.locked ? 'default' : 'move',
        zIndex: 1,
        boxShadow: el.type === 'product' && el.productId ? '0 4px 14px rgba(0,0,0,.18)' : 'none',
      }}
    >
      {el.type === 'product' && <ProductContent el={el} />}
      {el.type === 'image' && <ImageContent el={el} />}
      {el.type === 'box' && <BoxContent el={el} />}
      {el.type === 'text' && <TextContent el={el} editing={editing} onCommit={(t) => onCommitText(el.id, t)} />}

      {/* selection outline + handles */}
      {selected && !editing && (
        <>
          <div className="absolute -inset-px pointer-events-none" style={{ outline: '1.5px solid #10b981', outlineOffset: 1, borderRadius: 'inherit' }} />
          {!el.locked && HANDLES.map(h => {
            const pos = {};
            if (h.includes('n')) pos.top = -4; if (h.includes('s')) pos.bottom = -4;
            if (h.includes('w')) pos.left = -4; if (h.includes('e')) pos.right = -4;
            if (h === 'n' || h === 's') { pos.left = '50%'; pos.marginLeft = -4; }
            if (h === 'e' || h === 'w') { pos.top = '50%'; pos.marginTop = -4; }
            return (
              <div key={h}
                onPointerDown={(e) => { e.stopPropagation(); onStartResize(e, el, h); }}
                className="absolute w-2 h-2 bg-white border border-emerald-500 rounded-sm"
                style={{ ...pos, cursor: `${HANDLE_CURSOR[h]}-resize`, zIndex: 10 }} />
            );
          })}
        </>
      )}
      {el.locked && selected && (
        <div className="absolute top-1 right-1 text-emerald-500 pointer-events-none"><Lock size={11} /></div>
      )}
    </div>
  );
}

// ============================================================
// CATALOG PANEL
// ============================================================
function Catalog({ onAdd, placedIds }) {
  const [q, setQ] = useState('');
  const [sector, setSector] = useState('all');
  const list = useMemo(() => PRODUCTS.filter(p =>
    (sector === 'all' || p.sector === sector) &&
    (!q || (p.name + p.brand + p.code).toLowerCase().includes(q.toLowerCase()))
  ), [q, sector]);

  return (
    <aside className="w-64 shrink-0 border-r border-stone-800 bg-stone-950/40 flex flex-col">
      <div className="p-3 border-b border-stone-800/60">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold mb-2.5">Catálogo · API</h2>
        <div className="relative mb-2.5">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar…"
            className="w-full bg-stone-900/60 border border-stone-800 rounded-md pl-8 pr-2 py-1.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-700/60" />
        </div>
        <div className="flex flex-wrap gap-1">
          {SECTORS.map(s => (
            <button key={s.id} onClick={() => setSector(s.id)}
              className={`text-[9px] uppercase tracking-wider px-2 py-1 rounded-full font-semibold transition ${sector === s.id ? 'bg-emerald-700 text-white' : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        <p className="text-[10px] text-stone-500 italic px-1 mb-1" style={{ fontFamily: 'Fraunces,serif' }}>
          Selecione um slot vazio e clique no produto — ou clique para soltar um novo no canvas.
        </p>
        {list.map(p => {
          const Icon = ICONS[p.iconName] || Square;
          const placed = placedIds.has(p.id);
          return (
            <button key={p.id} onClick={() => onAdd(p)}
              className={`group w-full text-left p-2 rounded-lg border transition-all ${placed ? 'bg-emerald-950/40 border-emerald-700/40' : 'bg-stone-900/40 border-stone-700/50 hover:border-emerald-500/60 hover:bg-stone-900/80'}`}>
              <div className="flex gap-2.5 items-center">
                <div className={`shrink-0 w-11 h-11 rounded-md flex items-center justify-center ${placed ? 'bg-emerald-900/50' : 'bg-stone-800/80'}`}>
                  <Icon size={22} className={placed ? 'text-emerald-400' : 'text-stone-400'} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] uppercase tracking-widest text-stone-500 font-medium">{p.brand}</div>
                  <div className="text-xs text-stone-100 font-medium truncate leading-tight">{p.name}</div>
                  <div className="text-[11px] text-emerald-400 font-mono">R$ {fmt(p.priceCash)}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

// ============================================================
// SMALL UI HELPERS
// ============================================================
function NumField({ label, value, onChange, min = -9999, max = 9999, step = 1, w = 'w-full' }) {
  return (
    <label className="block">
      <span className="text-[9px] uppercase tracking-wider text-stone-500">{label}</span>
      <input type="number" value={Math.round(value)} step={step}
        onChange={e => onChange(clamp(Number(e.target.value), min, max))}
        className={`${w} bg-stone-900 border border-stone-800 rounded px-2 py-1 text-xs text-stone-100 focus:outline-none focus:border-emerald-700/60 mt-0.5`} />
    </label>
  );
}
function IconBtn({ children, onClick, active, title }) {
  return (
    <button title={title} onClick={onClick}
      className={`p-1.5 rounded transition ${active ? 'bg-emerald-700 text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-100 hover:bg-stone-800'}`}>
      {children}
    </button>
  );
}

// ============================================================
// PROPERTIES PANEL
// ============================================================
function Properties({ el, onChange, onLayer, onDelete, onDuplicate, onToggleLock }) {
  if (!el) {
    return <div className="p-4 text-center text-xs text-stone-600 italic" style={{ fontFamily: 'Fraunces,serif' }}>
      Selecione um elemento no canvas para editar suas propriedades.
    </div>;
  }
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
            <div className="flex gap-1 mt-1">
              {['Fredoka', 'Fraunces', 'Outfit'].map(f => (
                <button key={f} onClick={() => set({ font: f })}
                  className={`flex-1 text-[10px] py-1 rounded ${(el.font || 'Fredoka') === f ? 'bg-emerald-700 text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-200'}`}
                  style={{ fontFamily: `${f},sans-serif` }}>{f}</button>
              ))}
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
const TYPE_ICON = { product: Tag, image: ImageIcon, text: Type, box: Square };
function LayersList({ elements, selectedId, onSelect, onToggleHidden, onMoveLayer }) {
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
          ? (el.productId ? PRODUCTS.find(p => p.id === el.productId)?.name : 'Slot vazio')
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
            onClick={() => onSelect(el.id)}
            className={`group relative flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition
              ${selectedId === el.id ? 'bg-emerald-950/60 border border-emerald-700/50' : 'hover:bg-stone-900/60 border border-transparent'}
              ${isDragged ? 'opacity-40' : ''}`}>
            {/* Indicador de drop */}
            {isOver && over?.position === 'before' && (
              <div className="absolute -top-0.5 left-2 right-2 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(16,185,129,.6)] pointer-events-none" />
            )}
            {isOver && over?.position === 'after' && (
              <div className="absolute -bottom-0.5 left-2 right-2 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(16,185,129,.6)] pointer-events-none" />
            )}
            <GripHorizontal size={11} className="text-stone-600 group-hover:text-stone-400 shrink-0 cursor-grab active:cursor-grabbing" />
            <Icon size={13} className={selectedId === el.id ? 'text-emerald-400' : 'text-stone-500'} />
            <span className={`flex-1 text-xs truncate ${el.hidden ? 'text-stone-600 line-through' : selectedId === el.id ? 'text-emerald-200' : 'text-stone-300'}`}>{label}</span>
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
function GridPopover({ onGenerate, onClose }) {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const presets = [[2, 2], [3, 2], [3, 3], [4, 4], [4, 5], [6, 8]];
  return (
    <div className="absolute top-12 left-0 z-50 w-60 bg-stone-900 border border-stone-700 rounded-lg shadow-2xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Gerar grade de boxes</span>
        <button onClick={onClose} className="text-stone-500 hover:text-stone-200"><X size={13} /></button>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {presets.map(([c, r]) => (
          <button key={`${c}x${r}`} onClick={() => { setCols(c); setRows(r); }}
            className={`text-[11px] py-1.5 rounded font-mono ${cols === c && rows === r ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}>
            {c}×{r}
          </button>
        ))}
      </div>
      <div className="flex items-end gap-2 mb-3">
        <NumField label="Colunas" value={cols} min={1} max={12} onChange={setCols} />
        <span className="text-stone-600 pb-1.5">×</span>
        <NumField label="Linhas" value={rows} min={1} max={12} onChange={setRows} />
      </div>
      <div className="text-[10px] text-stone-500 mb-2">{cols * rows} boxes serão criados e poderão ser movidos livremente.</div>
      <button onClick={() => { onGenerate(cols, rows); onClose(); }}
        className="w-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold py-2 rounded transition">
        Gerar grade
      </button>
    </div>
  );
}

// ============================================================
// SAVED TEMPLATE ROW (predefinição do usuário)
// ============================================================
function SavedTemplateRow({ tpl, onApply, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(tpl.name);
  const productCount = tpl.elements.filter(e => e.type === 'product').length;
  const otherCount = tpl.elements.length - productCount;
  const commit = () => { const v = draft.trim(); if (v && v !== tpl.name) onRename(v); setEditing(false); };

  // Mini preview generation: bounding box of all elements, scale into thumb
  const thumb = useMemo(() => {
    if (tpl.elements.length === 0) return null;
    // Use saved format if exists, fall back to A4 defaults
    const w = 560, h = 792;
    return { w, h, elements: tpl.elements };
  }, [tpl.elements]);

  return (
    <div className="group flex items-center gap-2 px-1.5 py-1.5 rounded hover:bg-stone-900/60 transition">
      {/* Mini thumbnail */}
      <div className="shrink-0 w-9 h-12 rounded-sm overflow-hidden relative border border-stone-700"
        style={{ background: BACKGROUNDS[tpl.background] || '#fff' }}>
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
function Modal({ title, onClose, children, w = 'w-[440px]' }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div onClick={e => e.stopPropagation()}
        className={`relative ${w} max-h-[85vh] overflow-y-auto bg-stone-950 border border-stone-800 rounded-xl shadow-2xl`}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-800">
          <h3 className="text-sm font-semibold text-stone-100 tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-200 transition"><X size={16} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// FORMAT MODAL — escolha do tamanho da revista
// ============================================================
function FormatModal({ current, onChange, onClose }) {
  const [customW, setCustomW] = useState(current.mm[0]);
  const [customH, setCustomH] = useState(current.mm[1]);
  const applyCustom = () => {
    // Converte mm → px aproximado (~2.66 px/mm @72dpi) preservando proporção.
    const ratio = customW / customH;
    const w = ratio >= 1 ? 600 : Math.round(600 * ratio);
    const h = ratio >= 1 ? Math.round(600 / ratio) : 600;
    onChange({ id: 'custom', label: `Personalizado`, mm: [customW, customH], w, h });
  };
  return (
    <Modal title="Formato da revista" onClose={onClose} w="w-[480px]">
      <p className="text-[11px] text-stone-400 mb-4 leading-relaxed" style={{ fontFamily: 'Fraunces,serif' }}>
        O formato vale para <strong className="text-stone-200">todas as páginas</strong> da revista — como na gráfica.
        Trocar o formato pode reposicionar elementos já criados.
      </p>
      <div className="space-y-1.5 mb-4">
        {PAGE_FORMATS.map(f => (
          <button key={f.id} onClick={() => onChange(f)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-md border text-left transition
              ${current.id === f.id ? 'bg-emerald-950/50 border-emerald-700/60' : 'bg-stone-900/40 border-stone-800 hover:border-stone-700'}`}>
            {/* Mini ratio preview */}
            <div className="shrink-0 w-8 h-10 flex items-center justify-center">
              <div className="border border-stone-600 bg-stone-800" style={{
                width: 24 * (f.mm[0] / Math.max(f.mm[0], f.mm[1])),
                height: 30 * (f.mm[1] / Math.max(f.mm[0], f.mm[1])),
              }} />
            </div>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${current.id === f.id ? 'text-emerald-200' : 'text-stone-200'}`}>{f.label}</div>
              <div className="text-[10px] text-stone-500 font-mono">{f.mm[0]} × {f.mm[1]} mm</div>
            </div>
            {current.id === f.id && <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Atual</span>}
          </button>
        ))}
      </div>
      <div className="pt-3 border-t border-stone-800">
        <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Personalizado (mm)</span>
        <div className="flex items-end gap-2 mt-2">
          <NumField label="Largura" value={customW} min={50} max={1000} onChange={setCustomW} />
          <span className="text-stone-600 pb-1.5">×</span>
          <NumField label="Altura" value={customH} min={50} max={1000} onChange={setCustomH} />
          <button onClick={applyCustom}
            className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition">
            Aplicar
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
// SAVE TEMPLATE MODAL
// ============================================================
function SaveTemplateModal({ name, setName, onSave, onClose, page, format }) {
  const productCount = page.elements.filter(e => e.type === 'product').length;
  const otherCount = page.elements.length - productCount;
  return (
    <Modal title="Salvar predefinição" onClose={onClose} w="w-[420px]">
      <p className="text-[11px] text-stone-400 mb-4 leading-relaxed" style={{ fontFamily: 'Fraunces,serif' }}>
        Predefinições ficam guardadas só para você, e ficam disponíveis no painel "Minhas predefinições".
        Útil quando uma estrutura (ex.: cabeçalho + grade de 6 produtos) vai se repetir entre revistas.
      </p>
      <label className="block mb-3">
        <span className="text-[10px] uppercase tracking-wider text-stone-500">Nome da predefinição</span>
        <input autoFocus value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onSave(name); }}
          placeholder="Ex.: Topo Dia das Mães"
          className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-700/60 mt-1" />
      </label>
      <div className="bg-stone-900/40 border border-stone-800 rounded-md p-3 text-[11px] text-stone-400 space-y-1">
        <div className="flex justify-between"><span>Formato</span><span className="font-mono text-stone-200">{format.label} · {format.mm[0]}×{format.mm[1]}mm</span></div>
        <div className="flex justify-between"><span>Slots de produto</span><span className="font-mono text-stone-200">{productCount}</span></div>
        <div className="flex justify-between"><span>Outros elementos</span><span className="font-mono text-stone-200">{otherCount}</span></div>
      </div>
      <div className="flex justify-end gap-2 mt-5">
        <button onClick={onClose} className="text-stone-400 hover:text-stone-200 px-3 py-1.5 rounded text-xs transition">Cancelar</button>
        <button onClick={() => onSave(name)} disabled={!name.trim()}
          className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded text-xs font-semibold transition">
          Salvar
        </button>
      </div>
    </Modal>
  );
}

// ============================================================
// EXPORT MODAL
// ============================================================
function ExportModal({ onClose, onPdf, onCmyk, onEditable, format, pages }) {
  return (
    <Modal title="Exportar revista" onClose={onClose} w="w-[520px]">
      <div className="text-[11px] text-stone-400 mb-4 flex items-center gap-3 leading-relaxed">
        <FileText size={14} className="text-stone-500 shrink-0" />
        <span>{pages.length} {pages.length === 1 ? 'página' : 'páginas'} · formato {format.label} ({format.mm[0]}×{format.mm[1]} mm)</span>
      </div>
      <div className="space-y-2">
        <ExportOption
          icon={FileText} title="PDF (RGB)"
          desc="Para visualização e compartilhamento digital. Pronto para tela e impressão de escritório."
          onClick={onPdf} />
        <ExportOption
          icon={FileCheck2} title="PDF print-ready (CMYK)" badge="Simulação"
          desc="Para a gráfica: perfil ICC CMYK, sangria de 3mm e marcas de corte. Em produção, gerado por serviço de backend."
          onClick={onCmyk} />
        <ExportOption
          icon={FileJson} title="PDF editável (arquivo de projeto)"
          desc="Salva o estado completo da revista em .json — pode ser reaberto no editor para continuar de onde parou."
          onClick={onEditable} primary />
      </div>
      <div className="mt-4 pt-3 border-t border-stone-800 text-[10px] text-stone-500 italic leading-relaxed" style={{ fontFamily: 'Fraunces,serif' }}>
        Nota técnica: conversão CMYK e geração de PDF print-ready exigem processamento server-side
        (perfil ICC, sangria, separação de cores). Neste protótipo, essas opções geram um arquivo placeholder
        descrevendo o pipeline real.
      </div>
    </Modal>
  );
}
function ExportOption({ icon: Icon, title, desc, badge, onClick, primary }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left p-3 rounded-md border transition group flex gap-3
        ${primary
          ? 'bg-emerald-950/30 border-emerald-700/40 hover:border-emerald-600 hover:bg-emerald-950/50'
          : 'bg-stone-900/40 border-stone-800 hover:border-stone-700'}`}>
      <div className={`shrink-0 w-9 h-9 rounded flex items-center justify-center
        ${primary ? 'bg-emerald-700/40 text-emerald-300' : 'bg-stone-800 text-stone-400 group-hover:text-stone-200'}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${primary ? 'text-emerald-100' : 'text-stone-100'}`}>{title}</span>
          {badge && <span className="text-[9px] uppercase tracking-wider bg-amber-900/50 text-amber-300 px-1.5 py-0.5 rounded">{badge}</span>}
        </div>
        <div className="text-[11px] text-stone-400 mt-1 leading-snug">{desc}</div>
      </div>
    </button>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  // Formato da revista — fixo para todas as páginas, escolhido pelo usuário.
  const [format, setFormat] = useState(DEFAULT_FORMAT);
  const [showFormatModal, setShowFormatModal] = useState(false);

  const [pages, setPages] = useState([
    { id: 1, background: 'pink', elements: buildGrid(3, 2) },
  ]);
  const [currentId, setCurrentId] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showGrid, setShowGrid] = useState(false);

  // Templates do usuário (persistidos em localStorage como "do usuário logado")
  const [savedTemplates, setSavedTemplates] = useState(() => {
    try {
      const raw = localStorage.getItem('lebes:templates:v1');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem('lebes:templates:v1', JSON.stringify(savedTemplates)); } catch {}
  }, [savedTemplates]);
  const [showSaveTpl, setShowSaveTpl] = useState(false);
  const [tplName, setTplName] = useState('');

  // Modal de exportação
  const [showExport, setShowExport] = useState(false);

  // Drag de camadas (reordenação na lista)
  const [layerDrag, setLayerDrag] = useState(null);   // { id, overId, position: 'before'|'after' }

  const pageRef = useRef(null);
  const fileRef = useRef(null);
  const drag = useRef(null);

  const page = pages.find(p => p.id === currentId);
  const pageIdx = pages.findIndex(p => p.id === currentId);
  const selectedEl = page.elements.find(e => e.id === selectedId) || null;

  const placedIds = useMemo(() => {
    const s = new Set();
    pages.forEach(p => p.elements.forEach(e => e.type === 'product' && e.productId && s.add(e.productId)));
    return s;
  }, [pages]);

  // ---- element mutations ----
  const updatePage = (patch) => setPages(ps => ps.map(p => p.id === currentId ? { ...p, ...patch } : p));
  const setElements = (fn) => setPages(ps => ps.map(p => p.id === currentId ? { ...p, elements: fn(p.elements) } : p));

  const changeEl = useCallback((id, patch) => {
    setPages(ps => ps.map(p => p.id === currentId
      ? { ...p, elements: p.elements.map(e => e.id === id ? { ...e, ...patch } : e) } : p));
  }, [currentId]);

  const addEl = (el) => { setElements(els => [...els, el]); setSelectedId(el.id); };
  const deleteEl = (id) => { setElements(els => els.filter(e => e.id !== id)); setSelectedId(null); };
  const duplicateEl = (id) => {
    const src = page.elements.find(e => e.id === id); if (!src) return;
    const copy = { ...src, id: uid(), x: src.x + 16, y: src.y + 16 };
    addEl(copy);
  };
  const toggleLock = (id) => changeEl(id, { locked: !page.elements.find(e => e.id === id)?.locked });
  const toggleHidden = (id) => changeEl(id, { hidden: !page.elements.find(e => e.id === id)?.hidden });

  const layerOp = (id, op) => setElements(els => {
    const i = els.findIndex(e => e.id === id); if (i < 0) return els;
    const arr = [...els]; const [item] = arr.splice(i, 1);
    if (op === 'front') arr.push(item);
    else if (op === 'back') arr.unshift(item);
    else if (op === 'up') arr.splice(Math.min(i + 1, arr.length), 0, item);
    else if (op === 'down') arr.splice(Math.max(i - 1, 0), 0, item);
    return arr;
  });

  // ---- add tools ----
  const addText = () => addEl({ id: uid(), type: 'text', text: 'Texto editável', x: 60, y: 60, w: 220, h: 56, rotation: 0, opacity: 1, fontSize: 30, color: '#ffffff', weight: 800, align: 'left', font: 'Fredoka', hidden: false, locked: false });
  const addBox = () => addEl({ id: uid(), type: 'box', x: 70, y: 70, w: 200, h: 120, rotation: 0, opacity: 1, radius: 12, fill: '#00813A', borderW: 0, hidden: false, locked: false });
  const addProductBox = () => addEl({ id: uid(), type: 'product', productId: null, x: 80, y: 80, w: 150, h: 200, rotation: 0, opacity: 1, radius: 10, fill: '#fff', hidden: false, locked: false });

  const onPickImage = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        const w = 200, h = Math.round(200 / ratio);
        addEl({ id: uid(), type: 'image', src: ev.target.result, x: 100, y: 100, w, h, rotation: 0, opacity: 1, radius: 0, fit: 'cover', hidden: false, locked: false });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ---- catalog click ----
  const onCatalogAdd = (product) => {
    if (selectedEl && selectedEl.type === 'product') {
      changeEl(selectedEl.id, { productId: product.id });
    } else {
      // fill first empty product slot, else drop a new product box
      const empty = page.elements.find(e => e.type === 'product' && !e.productId);
      if (empty) { changeEl(empty.id, { productId: product.id }); setSelectedId(empty.id); }
      else addEl({ id: uid(), type: 'product', productId: product.id, x: 90, y: 90, w: 150, h: 210, rotation: 0, opacity: 1, radius: 10, fill: '#fff', hidden: false, locked: false });
    }
  };

  // ---- grid generation ----
  const genGrid = (cols, rows) => {
    const els = buildGrid(cols, rows, { pageW: format.w, pageH: format.h });
    setElements(prev => [...prev, ...els]);
  };

  // ---- pages ----
  const addPage = () => {
    const id = Math.max(...pages.map(p => p.id)) + 1;
    setPages([...pages, { id, background: 'pink', elements: [] }]);
    setCurrentId(id); setSelectedId(null);
  };
  const deletePage = (id) => {
    if (pages.length <= 1) return;
    const next = pages.filter(p => p.id !== id);
    setPages(next); if (currentId === id) setCurrentId(next[0].id);
  };
  const applyTemplate = (tpl) => {
    const { background, elements } = tpl.make();
    updatePage({ background, elements });
    setSelectedId(null);
  };

  // ---- templates do usuário (predefinições salvas) ----
  const saveCurrentAsTemplate = (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    // Reatribui IDs para evitar colisão ao aplicar de volta.
    const cloned = page.elements.map(el => ({ ...el }));
    const tpl = {
      id: `tpl_${Date.now()}`,
      name: trimmed,
      createdAt: new Date().toISOString(),
      background: page.background,
      elements: cloned,
    };
    setSavedTemplates(ts => [tpl, ...ts]);
    setShowSaveTpl(false);
    setTplName('');
  };
  const applySavedTemplate = (tpl) => {
    // Reatribui ids para que duplicar/aplicar a mesma predefinição múltiplas vezes não colida.
    const fresh = tpl.elements.map(el => ({ ...el, id: uid() }));
    updatePage({ background: tpl.background, elements: fresh });
    setSelectedId(null);
  };
  const deleteSavedTemplate = (id) => {
    if (!confirm('Excluir esta predefinição?')) return;
    setSavedTemplates(ts => ts.filter(t => t.id !== id));
  };
  const renameSavedTemplate = (id, name) => {
    setSavedTemplates(ts => ts.map(t => t.id === id ? { ...t, name } : t));
  };

  // ---- camadas: reordenação por drag-and-drop na lista ----
  // Move o elemento `srcId` para antes/depois de `dstId`.
  // Lembrando: no array `elements`, o primeiro item está atrás; na UI, mostramos do topo (frente) ao fundo.
  const moveLayer = (srcId, dstId, position) => {
    if (srcId === dstId) return;
    setElements(els => {
      const srcIdx = els.findIndex(e => e.id === srcId);
      const dstIdx = els.findIndex(e => e.id === dstId);
      if (srcIdx < 0 || dstIdx < 0) return els;
      const arr = [...els];
      const [item] = arr.splice(srcIdx, 1);
      // recalcula índice destino após remoção
      let target = arr.findIndex(e => e.id === dstId);
      if (position === 'after') target += 1;   // depois do destino, no array (= mais à frente visualmente, no nosso esquema)
      arr.splice(target, 0, item);
      return arr;
    });
  };

  // ---- formato da revista ----
  const changeFormat = (fmt) => {
    setFormat(fmt);
    setShowFormatModal(false);
  };

  // ---- exportação ----
  const exportEditable = () => {
    // PDF editável = arquivo de projeto (.json) que reabre tudo no editor.
    const project = {
      version: 1,
      kind: 'lebes-revista',
      exportedAt: new Date().toISOString(),
      format: { id: format.id, w: format.w, h: format.h, mm: format.mm, label: format.label },
      pages,
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revista-lebes-${new Date().toISOString().slice(0,10)}.lebes.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  };
  const exportPdfStub = (mode) => {
    // Stub honesto: explica o caminho técnico real e baixa um placeholder.
    // Em produção, isso chama um backend que renderiza com perfil ICC (CMYK) e sangria.
    const note =
`# Exportação ${mode === 'cmyk' ? 'CMYK (print-ready)' : 'PDF (RGB)'} — simulação
Este arquivo é um placeholder do protótipo.
Em produção, a exportação ${mode === 'cmyk' ? 'CMYK' : 'PDF'} é feita por um serviço de backend
(ex.: ReportLab / Ghostscript) que aplica perfil de cor ${mode === 'cmyk' ? 'ICC CMYK, sangria e marcas de corte' : 'RGB'}.

Formato: ${format.label} (${format.mm[0]} × ${format.mm[1]} mm)
Páginas: ${pages.length}
Exportado em: ${new Date().toLocaleString('pt-BR')}
`;
    const blob = new Blob([note], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revista-lebes-${mode}-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  // ---- drag / resize (pointer math in canvas coords) ----
  const toCanvas = (e) => {
    const r = pageRef.current.getBoundingClientRect();
    return { sx: format.w / r.width, sy: format.h / r.height, rect: r };
  };

  const onStartDrag = (e, el) => {
    const { sx, sy } = toCanvas(e);
    drag.current = { mode: 'move', id: el.id, startX: e.clientX, startY: e.clientY, ox: el.x, oy: el.y, sx, sy };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };
  const onStartResize = (e, el, handle) => {
    setSelectedId(el.id);
    const { sx, sy } = toCanvas(e);
    drag.current = { mode: 'resize', id: el.id, handle, startX: e.clientX, startY: e.clientY, o: { x: el.x, y: el.y, w: el.w, h: el.h }, sx, sy };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };
  const onMove = useCallback((e) => {
    const d = drag.current; if (!d) return;
    const dx = (e.clientX - d.startX) * d.sx;
    const dy = (e.clientY - d.startY) * d.sy;
    if (d.mode === 'move') {
      changeEl(d.id, { x: Math.round(d.ox + dx), y: Math.round(d.oy + dy) });
    } else {
      let { x, y, w, h } = d.o; const min = 20;
      if (d.handle.includes('e')) w = Math.max(min, d.o.w + dx);
      if (d.handle.includes('s')) h = Math.max(min, d.o.h + dy);
      if (d.handle.includes('w')) { w = Math.max(min, d.o.w - dx); x = d.o.x + (d.o.w - w); }
      if (d.handle.includes('n')) { h = Math.max(min, d.o.h - dy); y = d.o.y + (d.o.h - h); }
      changeEl(d.id, { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) });
    }
  }, [changeEl]);
  const onUp = useCallback(() => {
    drag.current = null;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  }, [onMove]);

  // keyboard: delete / escape
  useEffect(() => {
    const h = (e) => {
      if (editingId) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) { e.preventDefault(); deleteEl(selectedId); }
      if (e.key === 'Escape') { setSelectedId(null); setEditingId(null); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [selectedId, editingId]);

  const filled = page.elements.filter(e => e.type === 'product' && e.productId).length;
  const slots = page.elements.filter(e => e.type === 'product').length;

  return (
    <div className="w-full h-screen flex flex-col text-stone-200 overflow-hidden select-none"
      style={{ fontFamily: 'Outfit,system-ui,sans-serif', background: 'radial-gradient(ellipse at top,#1c1917 0%,#0c0a09 100%)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,800;1,400;1,800&family=Fredoka:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        body{background:#0c0a09}
        ::-webkit-scrollbar{width:8px;height:8px}
        ::-webkit-scrollbar-thumb{background:#44403c;border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:#57534e}
        input[type=number]::-webkit-inner-spin-button{opacity:.3}
      `}</style>

      {/* TOP BAR */}
      <header className="shrink-0 border-b border-stone-800 bg-stone-950/60 backdrop-blur px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00813A,#005224)' }}>
            <Layers size={16} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-stone-100 text-sm leading-none">Editora <span className="italic font-light" style={{ fontFamily: 'Fraunces,serif' }}>Lebes</span></div>
            <div className="text-[10px] text-stone-500 leading-none mt-0.5">Editor de Revista · v0.3 — formato, predefinições, camadas drag</div>
          </div>
          <div className="h-7 w-px bg-stone-800 mx-1" />
          <input defaultValue="Revista Dia das Mães · Maio 2026"
            className="bg-stone-900/60 border border-stone-700/50 rounded-md px-3 py-1.5 text-sm text-stone-100 w-60 focus:outline-none focus:border-emerald-600/60" />
          <button onClick={() => setShowFormatModal(true)}
            title="Formato da revista (válido para todas as páginas)"
            className="flex items-center gap-1.5 text-[11px] text-stone-300 hover:text-emerald-300 bg-stone-900/60 border border-stone-700/50 hover:border-emerald-700/60 rounded-md px-2.5 py-1.5 transition">
            <FileText size={12} /> <span className="font-mono">{format.label}</span>
            <span className="text-stone-500 text-[10px]">· {format.mm[0]}×{format.mm[1]}mm</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-stone-500 mr-1"><span className="font-mono text-emerald-400">{filled}</span>/<span className="font-mono">{slots}</span> slots</span>
          <button className="text-stone-400 hover:text-stone-200 px-3 py-1.5 rounded-md hover:bg-stone-800/60 text-xs flex items-center gap-1.5"><Eye size={13} /> Preview</button>
          <button className="text-stone-400 hover:text-stone-200 px-3 py-1.5 rounded-md hover:bg-stone-800/60 text-xs flex items-center gap-1.5"><Save size={13} /> Salvar</button>
          <button onClick={() => setShowExport(true)} className="bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-md text-xs flex items-center gap-1.5 font-semibold"><Download size={13} /> Exportar</button>
        </div>
      </header>

      {/* TOOLBAR */}
      <div className="shrink-0 border-b border-stone-800 bg-stone-950/40 px-4 py-2 flex items-center gap-2 relative">
        <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mr-1">Inserir</span>
        <button onClick={addText} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-emerald-700/60 transition"><Type size={14} /> Texto</button>
        <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-emerald-700/60 transition"><ImageIcon size={14} /> Imagem</button>
        <button onClick={addBox} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-emerald-700/60 transition"><Square size={14} /> Caixa</button>
        <button onClick={addProductBox} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-emerald-700/60 transition"><Tag size={14} /> Slot de produto</button>
        <div className="relative">
          <button onClick={() => setShowGrid(s => !s)} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-emerald-700/60 transition"><Grid3x3 size={14} /> Grade de boxes</button>
          {showGrid && <GridPopover onGenerate={genGrid} onClose={() => setShowGrid(false)} />}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickImage} />

        <div className="h-6 w-px bg-stone-800 mx-1" />
        <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mr-1">Layout</span>
        {TEMPLATES.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => applyTemplate(t)} title={t.desc}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-stone-900 border border-stone-800 text-stone-400 hover:text-emerald-300 hover:border-emerald-700/60 transition">
              <Icon size={13} /> {t.name}
            </button>
          );
        })}

        <div className="h-6 w-px bg-stone-800 mx-1" />
        <button onClick={() => setShowSaveTpl(true)} title="Salvar a página atual como predefinição reutilizável"
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-stone-900 border border-stone-800 text-stone-300 hover:text-emerald-300 hover:border-emerald-700/60 transition">
          <Bookmark size={13} /> Salvar como predefinição
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-stone-500">Fundo</span>
          {Object.entries(BACKGROUNDS).map(([k, v]) => (
            <button key={k} onClick={() => updatePage({ background: k })}
              className={`w-6 h-6 rounded border-2 ${page.background === k ? 'border-emerald-500' : 'border-stone-700'}`}
              style={{ background: v }} title={k} />
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 flex min-h-0">
        <Catalog onAdd={onCatalogAdd} placedIds={placedIds} />

        {/* CENTER CANVAS */}
        <main className="flex-1 flex flex-col min-w-0 bg-stone-900/30">
          <div className="shrink-0 px-4 py-2 border-b border-stone-800/60 bg-stone-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => pageIdx > 0 && (setCurrentId(pages[pageIdx - 1].id), setSelectedId(null))} disabled={pageIdx === 0} className="p-1.5 rounded hover:bg-stone-800 disabled:opacity-30"><ChevronLeft size={16} /></button>
              <span className="text-xs text-stone-300 px-3 py-1 bg-stone-900/60 rounded font-mono">Página {pageIdx + 1} / {pages.length}</span>
              <button onClick={() => pageIdx < pages.length - 1 && (setCurrentId(pages[pageIdx + 1].id), setSelectedId(null))} disabled={pageIdx === pages.length - 1} className="p-1.5 rounded hover:bg-stone-800 disabled:opacity-30"><ChevronRight size={16} /></button>
            </div>
            <span className="text-[10px] text-stone-500 italic flex items-center gap-1.5" style={{ fontFamily: 'Fraunces,serif' }}>
              <MousePointer2 size={12} /> Arraste para mover · alças para redimensionar · duplo-clique no texto para editar
            </span>
            <span className="text-[10px] text-stone-500 font-mono">A4 · 21 × 29,7 cm</span>
          </div>

          <div className="flex-1 overflow-auto flex items-start justify-center p-8">
            <div className="relative">
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black/40 blur-md" />
              <div
                ref={pageRef}
                onPointerDown={() => { setSelectedId(null); setEditingId(null); }}
                className="relative bg-white shadow-2xl overflow-hidden"
                style={{ width: format.w, height: format.h, background: BACKGROUNDS[page.background] }}
              >
                {/* green top band on pink pages */}
                {page.background === 'pink' && <div className="absolute top-0 left-0 right-0 h-2.5 bg-emerald-700 pointer-events-none" />}
                {/* margin guide */}
                <div className="absolute pointer-events-none border border-dashed border-black/10" style={{ inset: MARGIN }} />

                {page.elements.map(el => (
                  <CanvasElement
                    key={el.id} el={el}
                    selected={selectedId === el.id}
                    editing={editingId === el.id}
                    onSelect={setSelectedId}
                    onChange={changeEl}
                    onStartDrag={onStartDrag}
                    onStartResize={onStartResize}
                    onStartEditText={(id) => { setSelectedId(id); setEditingId(id); }}
                    onCommitText={(id, text) => { changeEl(id, { text }); setEditingId(null); }}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: PROPERTIES + LAYERS + PAGES */}
        <aside className="w-72 shrink-0 border-l border-stone-800 bg-stone-950/40 flex flex-col">
          <div className="border-b border-stone-800/60 max-h-[46%] overflow-hidden flex flex-col">
            <Properties el={selectedEl} onChange={changeEl} onLayer={layerOp} onDelete={deleteEl} onDuplicate={duplicateEl} onToggleLock={toggleLock} />
          </div>

          <div className="flex-1 flex flex-col min-h-0 border-b border-stone-800/60">
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold flex items-center gap-1.5"><Layers size={12} /> Camadas</span>
              <span className="text-[10px] text-stone-500 font-mono">{page.elements.length}</span>
            </div>
            <LayersList elements={page.elements} selectedId={selectedId} onSelect={setSelectedId} onToggleHidden={toggleHidden} onMoveLayer={moveLayer} />
          </div>

          {/* Predefinições do usuário */}
          <div className="shrink-0 border-b border-stone-800/60 max-h-[28%] overflow-hidden flex flex-col">
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold flex items-center gap-1.5">
                <Bookmark size={12} /> Minhas predefinições
              </span>
              <span className="text-[10px] text-stone-500 font-mono">{savedTemplates.length}</span>
            </div>
            <div className="px-2 pb-2 overflow-y-auto flex-1">
              {savedTemplates.length === 0 ? (
                <div className="text-[10px] text-stone-600 italic text-center py-3 px-2 leading-relaxed">
                  Nenhuma predefinição salva.<br />
                  <span className="text-stone-500">Use "Salvar como predefinição" na barra superior para guardar a página atual.</span>
                </div>
              ) : savedTemplates.map(tpl => (
                <SavedTemplateRow key={tpl.id} tpl={tpl}
                  onApply={() => applySavedTemplate(tpl)}
                  onDelete={() => deleteSavedTemplate(tpl.id)}
                  onRename={(name) => renameSavedTemplate(tpl.id, name)} />
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold">Páginas</span>
              <button onClick={addPage} className="text-stone-400 hover:text-emerald-300 flex items-center gap-1 text-[10px]"><Plus size={12} /> Nova</button>
            </div>
            <div className="px-3 pb-3 flex gap-2 overflow-x-auto">
              {pages.map((p, i) => (
                <div key={p.id} onClick={() => { setCurrentId(p.id); setSelectedId(null); }}
                  className={`group relative shrink-0 cursor-pointer rounded border-2 ${p.id === currentId ? 'border-emerald-500' : 'border-stone-700 hover:border-stone-500'}`}>
                  <div className="w-12 h-16 rounded-sm flex items-center justify-center text-[8px] text-white/70 font-mono" style={{ background: BACKGROUNDS[p.background] }}>{i + 1}</div>
                  {pages.length > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); deletePage(p.id); }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-900 text-stone-400 opacity-0 group-hover:opacity-100 hover:text-rose-400 flex items-center justify-center"><X size={10} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* STATUS */}
      <footer className="shrink-0 border-t border-stone-800 bg-stone-950/60 px-4 py-1.5 flex items-center justify-between text-[10px] text-stone-500">
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> API de produtos (mock) · {PRODUCTS.length} itens</span>
        <span className="italic font-light" style={{ fontFamily: 'Fraunces,serif' }}>Protótipo de validação — Del p/ excluir, Esc p/ desmarcar</span>
      </footer>

      {/* MODAIS */}
      {showFormatModal && (
        <FormatModal current={format} onChange={changeFormat} onClose={() => setShowFormatModal(false)} />
      )}
      {showSaveTpl && (
        <SaveTemplateModal
          name={tplName} setName={setTplName}
          onSave={saveCurrentAsTemplate}
          onClose={() => { setShowSaveTpl(false); setTplName(''); }}
          page={page} format={format} />
      )}
      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          onPdf={() => exportPdfStub('pdf')}
          onCmyk={() => exportPdfStub('cmyk')}
          onEditable={exportEditable}
          format={format} pages={pages} />
      )}
    </div>
  );
}
