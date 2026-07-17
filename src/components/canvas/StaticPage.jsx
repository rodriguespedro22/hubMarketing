import BoxContent from '../elements/BoxContent';
import IconContent from '../elements/IconContent';
import ImageContent from '../elements/ImageContent';
import ProductContent from '../elements/ProductContent';
import TextContent from '../elements/TextContent';
import BackgroundLayer from './BackgroundLayer';

export function StaticElement({ el }) {
  if (el.hidden) return null;
  return (
    <div
      className="absolute"
      style={{
        left: el.x, top: el.y, width: el.w, height: el.h,
        transform: `rotate(${el.rotation || 0}deg)`,
        opacity: el.opacity ?? 1,
        borderRadius: (el.type === 'image' || el.type === 'box' || el.type === 'product') ? (el.radius || 0) : 0,
        boxShadow: 'none',
      }}
    >
      {el.type === 'product' && <ProductContent el={el} />}
      {el.type === 'image'   && <ImageContent el={el} />}
      {el.type === 'box'     && <BoxContent el={el} />}
      {el.type === 'icon'    && <IconContent el={el} />}
      {el.type === 'text'    && <TextContent el={el} editing={false} onCommit={() => {}} />}
    </div>
  );
}

export default function StaticPage({ page, format }) {
  return (
    <div style={{ position: 'relative', width: format.w, height: format.h, overflow: 'hidden', background: '#ffffff' }}>
      <BackgroundLayer background={page.background} />
      {page.elements.map(el => <StaticElement key={el.id} el={el} />)}
    </div>
  );
}
