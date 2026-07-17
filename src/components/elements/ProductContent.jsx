import { Square, Tag } from 'lucide-react';

import { ICONS } from '../../data/icons';
import { findProductById } from '../../data/ci';
import PriceTag from './PriceTag';

export const DEFAULT_FIELDS    = { image: true, brand: true, name: true, code: true, price: true };
export const DEFAULT_FONT_SIZES = { brand: 7, name: 11, code: 6, priceScale: 0.85 };

// backward compat: 'vertical' → 'top', 'horizontal' → 'left'
export function resolveLayout(el) {
  const l = el.layout || 'top';
  if (l === 'vertical')   return 'top';
  if (l === 'horizontal') return 'left';
  return l;
}

export function resolveFields(el)    { return { ...DEFAULT_FIELDS,     ...(el.fields    || {}) }; }
export function resolveFontSizes(el) { return { ...DEFAULT_FONT_SIZES, ...(el.fontSizes || {}) }; }
// fundo do slot: 'transparent' explícito, senão a cor definida (ou branco padrão)
function resolveBg(el) { return el.fill === 'transparent' ? 'transparent' : (el.fill || '#fff'); }

function TextBlock({ p, fields, fs, priceVariant = 'lead' }) {
  return (
    <div className="overflow-hidden min-w-0">
      {fields.brand && (
        <div className="font-bold uppercase tracking-widest text-stone-700" style={{ fontSize: fs.brand }}>
          {p.brand}
        </div>
      )}
      {fields.name && (
        <div className="font-bold text-stone-900 leading-tight" style={{ fontFamily: 'Gantari,sans-serif', fontSize: fs.name }}>
          {p.name}
        </div>
      )}
      {fields.code && (
        <div className="text-stone-500" style={{ fontSize: fs.code }}>cód. {p.code}</div>
      )}
      {fields.price && (
        <div className="mt-1"><PriceTag p={p} scale={fs.priceScale} variant={priceVariant} /></div>
      )}
    </div>
  );
}

export default function ProductContent({ el }) {
  const p      = el.productId ? findProductById(el.productId) : null;
  const layout = resolveLayout(el);
  const fields = resolveFields(el);
  const fs     = resolveFontSizes(el);
  const bg     = resolveBg(el);

  if (!p) {
    return (
      <div className="w-full h-full rounded-[inherit] border-2 border-dashed border-rose-300 bg-rose-50/70 flex flex-col items-center justify-center text-rose-400 pointer-events-none">
        <Tag size={20} strokeWidth={1.5} />
        <span className="text-[9px] uppercase tracking-wider font-semibold mt-1">Slot de produto</span>
      </div>
    );
  }

  const Icon   = ICONS[p.iconName] || Square;
  const iconSz = Math.min(el.h * 0.45, el.w * 0.6);

  // ── top: image above, text below ──────────────────────────────
  if (layout === 'top') {
    return (
      <div className="w-full h-full rounded-[inherit] flex flex-col p-2 overflow-hidden pointer-events-none" style={{ background: bg }}>
        {fields.image && (
          <div className="flex-1 flex items-center justify-center min-h-0">
            <Icon size={iconSz} className="text-stone-700" strokeWidth={1}
              style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,.15))' }} />
          </div>
        )}
        <div className="shrink-0">
          <TextBlock p={p} fields={fields} fs={fs} />
        </div>
      </div>
    );
  }

  // ── left: image on left, text on right ────────────────────────
  if (layout === 'left') {
    return (
      <div className="w-full h-full rounded-[inherit] flex flex-row p-2 gap-2 overflow-hidden pointer-events-none" style={{ background: bg }}>
        {fields.image && (
          <div className="flex items-center justify-center shrink-0" style={{ width: '40%' }}>
            <Icon size={Math.min(el.h * 0.55, el.w * 0.35)} className="text-stone-700" strokeWidth={1}
              style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,.15))' }} />
          </div>
        )}
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <TextBlock p={p} fields={fields} fs={fs} priceVariant="trail" />
        </div>
      </div>
    );
  }

  // ── right: image on right, text on left ───────────────────────
  if (layout === 'right') {
    return (
      <div className="w-full h-full rounded-[inherit] flex flex-row p-2 gap-2 overflow-hidden pointer-events-none" style={{ background: bg }}>
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <TextBlock p={p} fields={fields} fs={fs} priceVariant="trail" />
        </div>
        {fields.image && (
          <div className="flex items-center justify-center shrink-0" style={{ width: '40%' }}>
            <Icon size={Math.min(el.h * 0.55, el.w * 0.35)} className="text-stone-700" strokeWidth={1}
              style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,.15))' }} />
          </div>
        )}
      </div>
    );
  }

  // ── card: dark background, ghost icon, text overlay ───────────
  if (layout === 'card') {
    return (
      <div className="w-full h-full rounded-[inherit] overflow-hidden relative pointer-events-none"
        style={{ background: '#1a1a1a' }}>
        {fields.image && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0.18 }}>
            <Icon size={Math.min(el.h * 0.65, el.w * 0.65)} className="text-white" strokeWidth={0.8} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-2"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)' }}>
          {fields.brand && (
            <div className="font-bold uppercase tracking-widest text-white/60" style={{ fontSize: fs.brand }}>
              {p.brand}
            </div>
          )}
          {fields.name && (
            <div className="font-bold text-white leading-tight" style={{ fontFamily: 'Gantari,sans-serif', fontSize: fs.name }}>
              {p.name}
            </div>
          )}
          {fields.code && (
            <div className="text-white/40" style={{ fontSize: fs.code }}>cód. {p.code}</div>
          )}
          {fields.price && (
            <div className="mt-0.5"><PriceTag p={p} scale={fs.priceScale * 0.85} light /></div>
          )}
        </div>
      </div>
    );
  }

  // ── minimal: no image area, text centered ─────────────────────
  return (
    <div className="w-full h-full rounded-[inherit] flex flex-col items-center justify-center p-2 text-center overflow-hidden pointer-events-none" style={{ background: bg }}>
      {fields.brand && (
        <div className="font-bold uppercase tracking-widest text-stone-400" style={{ fontSize: fs.brand }}>
          {p.brand}
        </div>
      )}
      {fields.name && (
        <div className="font-bold text-stone-900 leading-tight mb-2" style={{ fontFamily: 'Gantari,sans-serif', fontSize: fs.name }}>
          {p.name}
        </div>
      )}
      {fields.code && (
        <div className="text-stone-400 mb-1" style={{ fontSize: fs.code }}>cód. {p.code}</div>
      )}
      {fields.price && <PriceTag p={p} scale={fs.priceScale} />}
    </div>
  );
}
