import { useEffect, useRef } from 'react';

export default function TextContent({ el, editing, onCommit }) {
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
        fontFamily: `${el.font || 'Gantari'},sans-serif`,
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
