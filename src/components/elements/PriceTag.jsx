import { fmt, splitMoney } from '../../utils/helpers';

// variant 'lead'  → preço parcelado em destaque primeiro, depois a letra miúda (usado no
//                    layout "Acima", onde sobra espaço vertical abaixo da imagem).
// variant 'trail' → letra miúda (de/por) primeiro, preço parcelado em destaque por último
//                    (usado nos layouts "Esquerda"/"Direita", com a imagem ocupando a altura
//                    toda ao lado — o preço em destaque funciona como fechamento do bloco).
export default function PriceTag({ p, scale = 1, light = false, variant = 'lead' }) {
  const v = splitMoney(p.installmentValue);
  const priceColor = light ? '#fca5a5' : '#be123c';
  const labelColor = light ? '#d6d3d1' : '#44403c';
  const subtleColor = light ? '#a8a29e' : '#78716c';

  const highlight = (
    <>
      <span className="font-black" style={{ fontSize: 9, color: priceColor }}>{p.installments}x R$</span>
      <div className="flex items-start" style={{ fontFamily: 'Gantari,sans-serif', color: priceColor }}>
        <span className="font-black" style={{ fontSize: 38, lineHeight: 0.8 }}>{v.int}</span>
        <span className="font-black" style={{ fontSize: 18 }}>,{v.dec}</span>
      </div>
    </>
  );
  const caption = <div className="font-semibold" style={{ fontSize: 7, color: labelColor }}>no Crediário Lebes</div>;
  const oldPrice = p.priceOld && <div className="line-through" style={{ fontSize: 7, color: subtleColor }}>De R$ {fmt(p.priceOld)}</div>;
  const cashPrice = <div className="font-semibold" style={{ fontSize: 7, color: labelColor }}>Por R$ {fmt(p.priceCash)} à vista</div>;

  return (
    <div className="leading-none" style={{ transform: `scale(${scale})`, transformOrigin: 'left bottom' }}>
      {variant === 'trail' ? (
        <>
          {oldPrice}
          {cashPrice}
          <div className="mt-1">{highlight}</div>
          {caption}
        </>
      ) : (
        <>
          {highlight}
          {caption}
          {oldPrice}
          {cashPrice}
        </>
      )}
    </div>
  );
}
