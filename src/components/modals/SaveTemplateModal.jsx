import Modal from './Modal';

export default function SaveTemplateModal({ name, setName, onSave, onClose, page, format }) {
  const productCount = page.elements.filter(e => e.type === 'product').length;
  const otherCount = page.elements.length - productCount;
  return (
    <Modal title="Salvar predefinição" onClose={onClose} w="w-[420px]">
      <p className="text-[11px] text-stone-400 mb-4 leading-relaxed" style={{ fontFamily: 'Gantari,sans-serif' }}>
        Predefinições ficam guardadas só para você, e ficam disponíveis no painel "Minhas predefinições".
        Útil quando uma estrutura (ex.: cabeçalho + grade de 6 produtos) vai se repetir entre projetos.
      </p>
      <label className="block mb-3">
        <span className="text-[10px] uppercase tracking-wider text-stone-500">Nome da predefinição</span>
        <input autoFocus value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onSave(name); }}
          placeholder="Ex.: Topo Dia das Mães"
          className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-700/60 mt-1" />
      </label>
      <div className="bg-stone-900/40 border border-stone-800 rounded-md p-3 text-[11px] text-stone-400 space-y-1">
        <div className="flex justify-between"><span>Formato</span><span className="font-mono text-stone-200">{format.label} · {format.mm[0]}×{format.mm[1]}mm</span></div>
        <div className="flex justify-between"><span>Slots de produto</span><span className="font-mono text-stone-200">{productCount}</span></div>
        <div className="flex justify-between"><span>Outros elementos</span><span className="font-mono text-stone-200">{otherCount}</span></div>
      </div>
      <div className="flex justify-end gap-2 mt-5">
        <button onClick={onClose} className="text-stone-400 hover:text-stone-200 px-3 py-1.5 rounded text-xs transition">Cancelar</button>
        <button onClick={() => onSave(name)} disabled={!name.trim()}
          className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded text-xs font-semibold transition">
          Salvar
        </button>
      </div>
    </Modal>
  );
}

// ============================================================
// EXPORT MODAL
// ============================================================
