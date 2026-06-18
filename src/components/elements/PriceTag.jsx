import { fmt, splitMoney } from '../../utils/helpers';

export default function PriceTag({ p, scale = 1, light = false }) {
  const v = splitMoney(p.installmentValue);
  const priceColor = light ? '#fca5a5' : '#be123c';
  const labelColor = light ? '#d6d3d1' : '#44403c';
  const subtleColor = light ? '#a8a29e' : '#78716c';
  return (
    <div className="leading-none" style={{ transform: `scale(${scale})`, transformOrigin: 'left bottom' }}>
      <span className="font-black" style={{ fontSize: 9, color: priceColor }}>{p.installments}x R$</span>
      <div className="flex items-start" style={{ fontFamily: 'Gantari,sans-serif', color: priceColor }}>
        <span className="font-black" style={{ fontSize: 38, lineHeight: 0.8 }}>{v.int}</span>
        <span className="font-black" style={{ fontSize: 18 }}>,{v.dec}</span>
      </div>
      <div className="font-semibold" style={{ fontSize: 7, color: labelColor }}>no Crediário Lebes</div>
      {p.priceOld && <div className="line-through" style={{ fontSize: 7, color: subtleColor }}>De R$ {fmt(p.priceOld)}</div>}
      <div className="font-semibold" style={{ fontSize: 7, color: labelColor }}>Por R$ {fmt(p.priceCash)} à vista</div>
    </div>
  );
}
