import { Square, Tag } from 'lucide-react';

import { ICONS } from '../../data/icons';
import { PRODUCTS } from '../../data/products';
import PriceTag from './PriceTag';

export default function ProductContent({ el }) {
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
        <div className="font-bold text-stone-900 leading-tight" style={{ fontFamily: 'Gantari,sans-serif', fontSize: 11 }}>{p.name}</div>
        <div className="text-stone-500" style={{ fontSize: 6 }}>cód. {p.code}</div>
        <div className="mt-1"><PriceTag p={p} scale={0.85} /></div>
      </div>
    </div>
  );
}
