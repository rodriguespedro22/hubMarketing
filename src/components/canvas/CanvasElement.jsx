import { Lock } from 'lucide-react';

import BoxContent from '../elements/BoxContent';
import ImageContent from '../elements/ImageContent';
import ProductContent from '../elements/ProductContent';
import TextContent from '../elements/TextContent';

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
const HANDLE_CURSOR = { nw: 'nwse', n: 'ns', ne: 'nesw', e: 'ew', se: 'nwse', s: 'ns', sw: 'nesw', w: 'ew' };

export default function CanvasElement({ el, selected, primary, editing, onSelect, onChange, onStartDrag, onStartResize, onCommitText, onStartEditText }) {
  if (el.hidden) return null;
  return (
    <div
      onPointerDown={(e) => { if (editing) return; e.stopPropagation(); onSelect(el.id, e.shiftKey); if (!el.locked) onStartDrag(e, el); }}
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
          {primary && !el.locked && HANDLES.map(h => {
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
