import { useState } from 'react';

import { PAGE_FORMATS } from '../../constants/pageConfig';
import Modal from './Modal';
import NumField from '../ui/NumField';

export default function FormatModal({ current, onChange, onClose }) {
  const [customW, setCustomW] = useState(current.mm[0]);
  const [customH, setCustomH] = useState(current.mm[1]);
  const applyCustom = () => {
    // Converte mm → px aproximado (~2.66 px/mm @72dpi) preservando proporção.
    const ratio = customW / customH;
    const w = ratio >= 1 ? 600 : Math.round(600 * ratio);
    const h = ratio >= 1 ? Math.round(600 / ratio) : 600;
    onChange({ id: 'custom', label: `Personalizado`, mm: [customW, customH], w, h });
  };
  return (
    <Modal title="Formato do projeto" onClose={onClose} w="w-[480px]">
      <p className="text-[11px] text-stone-400 mb-4 leading-relaxed" style={{ fontFamily: 'Gantari,sans-serif' }}>
        O formato vale para <strong className="text-stone-200">todas as páginas</strong> do projeto — como na gráfica.
        Trocar o formato pode reposicionar elementos já criados.
      </p>
      <div className="space-y-1.5 mb-4">
        {PAGE_FORMATS.map(f => (
          <button key={f.id} onClick={() => onChange(f)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-md border text-left transition
              ${current.id === f.id ? 'bg-emerald-950/50 border-emerald-700/60' : 'bg-stone-900/40 border-stone-800 hover:border-stone-700'}`}>
            {/* Mini ratio preview */}
            <div className="shrink-0 w-8 h-10 flex items-center justify-center">
              <div className="border border-stone-600 bg-stone-800" style={{
                width: 24 * (f.mm[0] / Math.max(f.mm[0], f.mm[1])),
                height: 30 * (f.mm[1] / Math.max(f.mm[0], f.mm[1])),
              }} />
            </div>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${current.id === f.id ? 'text-emerald-200' : 'text-stone-200'}`}>{f.label}</div>
              <div className="text-[10px] text-stone-500 font-mono">{f.mm[0]} × {f.mm[1]} mm</div>
            </div>
            {current.id === f.id && <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Atual</span>}
          </button>
        ))}
      </div>
      <div className="pt-3 border-t border-stone-800">
        <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Personalizado (mm)</span>
        <div className="flex items-end gap-2 mt-2">
          <NumField label="Largura" value={customW} min={50} max={1000} onChange={setCustomW} />
          <span className="text-stone-600 pb-1.5">×</span>
          <NumField label="Altura" value={customH} min={50} max={1000} onChange={setCustomH} />
          <button onClick={applyCustom}
            className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition">
            Aplicar
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
// SAVE TEMPLATE MODAL
// ============================================================
