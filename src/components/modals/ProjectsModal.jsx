import { useRef } from 'react';
import { Download, FileUp, FolderOpen, Save, Trash2 } from 'lucide-react';

import Modal from './Modal';

function fmtDate(ts) {
  if (!ts) return '';
  try { return new Date(ts).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }); }
  catch { return ''; }
}

export default function ProjectsModal({
  onClose, title, projects,
  onSaveNew, onUpdate, onLoad, onDelete, onImport, onExport,
}) {
  const fileRef = useRef(null);
  return (
    <Modal title="Meus projetos" onClose={onClose} w="w-[520px]">
      <p className="text-[11px] text-stone-400 mb-4 leading-relaxed" style={{ fontFamily: 'Gantari,sans-serif' }}>
        Salve o projeto atual para reabri-lo depois. Os projetos ficam guardados neste navegador.
        Você também pode baixar um arquivo <span className="font-mono text-stone-300">.json</span> para backup ou abrir um existente.
      </p>

      {/* Ações sobre o projeto atual */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-md p-3 mb-4">
        <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-2">Projeto atual</div>
        <div className="text-sm text-stone-100 mb-3 truncate">{title || 'Sem título'}</div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onSaveNew}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-semibold transition">
            <Save size={13} /> Salvar como novo
          </button>
          <button onClick={onExport}
            className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded text-xs transition">
            <Download size={13} /> Baixar .json
          </button>
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded text-xs transition">
            <FileUp size={13} /> Abrir arquivo…
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = ''; }} />
        </div>
      </div>

      {/* Lista de projetos salvos */}
      <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-2">Salvos ({projects.length})</div>
      {projects.length === 0 ? (
        <div className="text-[11px] text-stone-600 italic text-center py-6 px-3 border border-dashed border-stone-800 rounded-md leading-relaxed">
          Nenhum projeto salvo ainda.<br />Use “Salvar como novo” para guardar o projeto atual.
        </div>
      ) : (
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {projects.map(prj => (
            <div key={prj.id}
              className="group flex items-center gap-2 bg-stone-900/40 border border-stone-800 rounded-md px-3 py-2 hover:border-emerald-700/50 transition">
              <div className="min-w-0 flex-1">
                <div className="text-xs text-stone-100 font-medium truncate">{prj.title || 'Sem título'}</div>
                <div className="text-[10px] text-stone-500 font-mono">
                  {prj.format?.label} · {prj.pages?.length || 0} pág. · {fmtDate(prj.updatedAt)}
                </div>
              </div>
              <button onClick={() => onLoad(prj)} title="Abrir este projeto"
                className="flex items-center gap-1 text-[11px] text-emerald-300 hover:text-emerald-200 px-2 py-1 rounded hover:bg-stone-800/70 transition">
                <FolderOpen size={13} /> Abrir
              </button>
              <button onClick={() => onUpdate(prj.id)} title="Sobrescrever com o projeto atual"
                className="text-stone-400 hover:text-stone-100 px-1.5 py-1 rounded hover:bg-stone-800/70 transition"><Save size={13} /></button>
              <button onClick={() => onDelete(prj.id)} title="Excluir"
                className="text-stone-500 hover:text-rose-400 px-1.5 py-1 rounded hover:bg-stone-800/70 transition"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
