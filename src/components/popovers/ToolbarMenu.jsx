import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

export default function ToolbarMenu({ icon: Icon, label, open, onOpen, children, width = 'w-56' }) {
  const btnRef = useRef(null);
  const dropRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left });
    }
    const h = (e) => {
      if (btnRef.current?.contains(e.target) || dropRef.current?.contains(e.target)) return;
      onOpen(false);
    };
    const esc = (e) => { if (e.key === 'Escape') onOpen(false); };
    window.addEventListener('pointerdown', h);
    window.addEventListener('keydown', esc);
    return () => { window.removeEventListener('pointerdown', h); window.removeEventListener('keydown', esc); };
  }, [open, onOpen]);

  return (
    <div className="relative" ref={btnRef}>
      <button onClick={() => onOpen(!open)}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition
          ${open ? 'bg-stone-800/70 border-emerald-700/60 text-emerald-200'
                 : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white hover:border-emerald-700/60'}`}>
        {Icon && <Icon size={14} />} {label}
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && createPortal(
        <div ref={dropRef}
          className={`fixed z-[9999] ${width} bg-stone-900 border border-stone-700 rounded-lg shadow-2xl p-1.5`}
          style={{ top: pos.top, left: pos.left }}>
          {children}
        </div>,
        document.body
      )}
    </div>
  );
}

export function ToolbarMenuItem({ icon: Icon, label, sub, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-stone-800/70 transition text-left text-stone-300 hover:text-white">
      {Icon && <Icon size={15} className="shrink-0 text-stone-400" />}
      <div className="min-w-0">
        <div className="text-xs font-medium leading-tight">{label}</div>
        {sub && <div className="text-[10px] text-stone-500">{sub}</div>}
      </div>
    </button>
  );
}
