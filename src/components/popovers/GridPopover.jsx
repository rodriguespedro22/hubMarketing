import { useState } from 'react';
import { X } from 'lucide-react';

import NumField from '../ui/NumField';

export default function GridPopover({ onGenerate, onClose, inline = false }) {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const presets = [[2, 2], [3, 2], [3, 3], [4, 4], [4, 5], [6, 8]];
  return (
    <div className={inline
      ? 'mt-1 w-full bg-stone-900 border border-stone-800 rounded-lg p-3'
      : 'absolute top-12 left-0 z-50 w-60 bg-stone-900 border border-stone-700 rounded-lg shadow-2xl p-3'}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Gerar grade de boxes</span>
        <button onClick={onClose} className="text-stone-500 hover:text-stone-200"><X size={13} /></button>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {presets.map(([c, r]) => (
          <button key={`${c}x${r}`} onClick={() => { setCols(c); setRows(r); }}
            className={`text-[11px] py-1.5 rounded font-mono ${cols === c && rows === r ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}>
            {c}×{r}
          </button>
        ))}
      </div>
      <div className="flex items-end gap-2 mb-3">
        <NumField label="Colunas" value={cols} min={1} max={12} onChange={setCols} />
        <span className="text-stone-600 pb-1.5">×</span>
        <NumField label="Linhas" value={rows} min={1} max={12} onChange={setRows} />
      </div>
      <div className="text-[10px] text-stone-500 mb-2">{cols * rows} boxes serão criados e poderão ser movidos livremente.</div>
      <button onClick={() => { onGenerate(cols, rows); onClose(); }}
        className="w-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold py-2 rounded transition">
        Gerar grade
      </button>
    </div>
  );
}

// ============================================================
// SAVED TEMPLATE ROW (predefinição do usuário)
// ============================================================
