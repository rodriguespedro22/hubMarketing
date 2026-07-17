import { useEffect, useRef } from 'react';

// Antes de `editing` virar true, o texto tem pointer-events/user-select desligados
// (para permitir arrastar a caixa), então o duplo-clique nativo do navegador nunca
// chega a selecionar a palavra sob o cursor. Por isso replicamos manualmente a seleção
// de palavra a partir das coordenadas do clique (`caretHint`), assim que a edição começa.
function selectWordAtPoint(container, x, y) {
  const doc = container.ownerDocument;
  let range = null;
  if (doc.caretRangeFromPoint) {
    range = doc.caretRangeFromPoint(x, y);
  } else if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(x, y);
    if (pos) { range = doc.createRange(); range.setStart(pos.offsetNode, pos.offset); range.collapse(true); }
  }
  if (!range) return false;
  const node = range.startContainer;
  if (node.nodeType !== Node.TEXT_NODE || !container.contains(node)) return false;

  const text = node.textContent;
  const isWordChar = (ch) => !!ch && !/\s/.test(ch);
  let start = range.startOffset;
  let end = start;
  while (start > 0 && isWordChar(text[start - 1])) start--;
  while (end < text.length && isWordChar(text[end])) end++;
  if (start === end) return false; // clique em espaço/vazio: deixa o cursor onde o navegador colocou

  const wordRange = doc.createRange();
  wordRange.setStart(node, start);
  wordRange.setEnd(node, end);
  const sel = doc.defaultView.getSelection();
  sel.removeAllRanges();
  sel.addRange(wordRange);
  return true;
}

export default function TextContent({ el, editing, caretHint, onCommit }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!editing || !ref.current) return;
    ref.current.focus();
    if (caretHint) selectWordAtPoint(ref.current, caretHint.x, caretHint.y);
  }, [editing]);
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
        textDecoration: el.strike ? 'line-through' : 'none',
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
