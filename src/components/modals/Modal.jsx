import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, w = 'w-[440px]' }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div onClick={e => e.stopPropagation()}
        className={`relative ${w} max-h-[85vh] overflow-y-auto bg-stone-950 border border-stone-800 rounded-xl shadow-2xl`}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-800">
          <h3 className="text-sm font-semibold text-stone-100 tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-200 transition"><X size={16} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// FORMAT MODAL — escolha do tamanho da revista
// ============================================================
