import { fmt, splitMoney } from '../../utils/helpers';

export default function PriceTag({ p, scale = 1 }) {
  const v = splitMoney(p.installmentValue);
  return (
    <div className="leading-none" style={{ transform: `scale(${scale})`, transformOrigin: 'left bottom' }}>
      <span className="font-black text-rose-700" style={{ fontSize: 9 }}>{p.installments}x R$</span>
      <div className="flex items-start text-rose-700" style={{ fontFamily: 'Gantari,sans-serif' }}>
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
