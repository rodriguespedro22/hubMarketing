import { useRef, useState } from 'react';
import { FileUp, FolderOpen, Plus, Search, Tag, Trash2, X } from 'lucide-react';

function fmtDate(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return ''; }
}

function ProjectCard({ prj, onOpen, onDelete, t }) {
  const pages = prj.pages?.length || 0;
  const format = prj.format?.label || '—';
  const labels = Array.isArray(prj.labels) ? prj.labels : [];

  return (
    <div className={`group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer ${t.borderCard} hover:${t.hoverCard} ${t.card}`}
      onClick={() => onOpen(prj)}>
      <div className="relative w-full aspect-[4/3] overflow-hidden flex items-center justify-center" style={{ background: t.thumb.includes('radial') ? undefined : undefined, backgroundColor: '#00000010' }}>
        <div className="w-full h-full flex items-center justify-center p-4">
          <div
            className="rounded shadow-lg flex items-center justify-center text-[10px] font-mono"
            style={{
              width: '80%',
              aspectRatio: prj.format?.w && prj.format?.h ? `${prj.format.w}/${prj.format.h}` : '1/1',
              background: t.thumb,
              border: `1px solid ${t.thumbBorder}`,
              color: t.thumbText,
              maxHeight: '90%',
            }}
          >
            {format}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button onClick={(e) => { e.stopPropagation(); onOpen(prj); }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">
            <FolderOpen size={14} /> Abrir
          </button>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onDelete(prj.id); }}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 text-white/60 hover:bg-rose-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-150"
          title="Excluir projeto">
          <Trash2 size={13} />
        </button>
      </div>

      <div className="px-3 pt-2.5 pb-2">
        <p className={`text-xs font-medium truncate ${t.text}`}>{prj.title || 'Sem título'}</p>
        <p className={`text-[10px] mt-0.5 ${t.textSub}`}>{format} · {pages} pág. · {fmtDate(prj.updatedAt)}</p>
      </div>

      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1 px-3 pb-2.5">
          {labels.map(lbl => (
            <span key={lbl} className="bg-emerald-600/20 border border-emerald-600/40 text-emerald-600 text-[10px] px-1.5 py-0.5 rounded-full">
              {lbl}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function NewProjectCard({ onClick, t }) {
  return (
    <div onClick={onClick}
      className={`group flex flex-col rounded-xl overflow-hidden border border-dashed transition-all duration-200 cursor-pointer ${t.newCard}`}>
      <div className="flex-1 flex items-center justify-center aspect-[4/3]">
        <div className={`flex flex-col items-center gap-2 transition-colors ${t.newCardIcon}`}>
          <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
            <Plus size={24} />
          </div>
          <span className="text-xs font-medium">Novo projeto</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ projects, onNewProject, onOpenProject, onDeleteProject, onImportProject, onClose, isDark = true }) {
  const [search, setSearch] = useState('');
  const [activeLabels, setActiveLabels] = useState([]);
  const fileRef = useRef(null);
  const isModal = !!onClose;

  // tokens de tema
  const t = isDark ? {
    bg:         'radial-gradient(ellipse at top,#1c1917 0%,#0c0a09 100%)',
    border:     'border-stone-800',
    borderMid:  'border-stone-800/60',
    borderCard: 'border-stone-800',
    hoverCard:  'border-emerald-700/60',
    card:       'bg-stone-900/50 hover:bg-stone-900/80',
    input:      'bg-stone-900/80 border-stone-700/60 text-stone-100 placeholder-stone-600 focus:border-emerald-600/60',
    text:       'text-stone-100',
    textSub:    'text-stone-500',
    textMuted:  'text-stone-400',
    btnSecondary: 'text-stone-400 hover:text-stone-200 bg-stone-800/60 hover:bg-stone-800 border-stone-700/50',
    labelActive:  'bg-emerald-700 border-emerald-600 text-white',
    labelIdle:    'bg-stone-900/50 border-stone-700 text-stone-400 hover:border-emerald-700/60 hover:text-emerald-300',
    overlayModal: 'rgba(0,0,0,0.55)',
    modalBorder:  'border-stone-700/60',
    newCard:      'border-stone-700 hover:border-emerald-600 bg-stone-900/20 hover:bg-stone-900/50',
    newCardIcon:  'text-stone-600 group-hover:text-emerald-400',
    thumb:        'linear-gradient(135deg,#1c1917 0%,#292524 100%)',
    thumbBorder:  '#44403c',
    thumbText:    'rgba(255,255,255,0.25)',
  } : {
    bg:         'var(--hub-bg)',
    border:     'border-[#e5e4df]',
    borderMid:  'border-[#e5e4df]',
    borderCard: 'border-[#e0dfd9]',
    hoverCard:  'border-[#5CA847]/60',
    card:       'bg-white hover:bg-[#f9f9f7]',
    input:      'bg-white border-[#d5d4ce] text-[#1a1a1a] placeholder-[#aaa] focus:border-[#5CA847]/60',
    text:       'text-[#1a1a1a]',
    textSub:    'text-[#888]',
    textMuted:  'text-[#666]',
    btnSecondary: 'text-[#555] hover:text-[#222] bg-white hover:bg-[#f4f4f0] border-[#d5d4ce]',
    labelActive:  'bg-[#5CA847] border-[#5CA847] text-white',
    labelIdle:    'bg-white border-[#d5d4ce] text-[#666] hover:border-[#5CA847]/60 hover:text-[#5CA847]',
    overlayModal: 'rgba(0,0,0,0.30)',
    modalBorder:  'border-[#d5d4ce]',
    newCard:      'border-[#c5c4be] hover:border-[#5CA847] bg-[#f4f4f0] hover:bg-[#edf5eb]',
    newCardIcon:  'text-[#aaa] group-hover:text-[#5CA847]',
    thumb:        'linear-gradient(135deg,#e8e7e2 0%,#d5d4ce 100%)',
    thumbBorder:  '#c5c4be',
    thumbText:    'rgba(0,0,0,0.25)',
  };

  // Coleta todos os rótulos únicos de todos os projetos
  const allLabels = [...new Set(projects.flatMap(p => Array.isArray(p.labels) ? p.labels : []))].sort();

  const toggleLabel = (lbl) => {
    setActiveLabels(ls => ls.includes(lbl) ? ls.filter(l => l !== lbl) : [...ls, lbl]);
  };

  const filtered = projects.filter(p => {
    const matchSearch = !search || (p.title || '').toLowerCase().includes(search.toLowerCase());
    const matchLabels = activeLabels.length === 0 || activeLabels.every(lbl => Array.isArray(p.labels) && p.labels.includes(lbl));
    return matchSearch && matchLabels;
  });

  const hasFilter = search || activeLabels.length > 0;

  const body = (
    <>
      {/* Header */}
      <div className={`shrink-0 flex items-center justify-between gap-4 px-7 py-5 border-b ${t.border}`}>
        <div>
          <h1 className={`text-xl font-bold ${t.text}`}>Meus projetos</h1>
          <p className={`text-xs mt-0.5 ${t.textSub}`}>
            {projects.length === 0 ? 'Nenhum projeto salvo' : `${projects.length} projeto${projects.length > 1 ? 's' : ''} salvos`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fileRef.current?.click()}
            className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-xs transition ${t.btnSecondary}`}>
            <FileUp size={13} /> Importar
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { onImportProject(f); onClose?.(); } e.target.value = ''; }} />
          <button onClick={() => { onNewProject(); onClose?.(); }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition">
            <Plus size={14} /> Novo projeto
          </button>
          {isModal && (
            <button onClick={onClose}
              className={`ml-1 p-1.5 rounded-lg transition ${t.textSub} hover:${t.text}`}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Barra de busca + filtros */}
      <div className={`shrink-0 px-7 py-4 border-b ${t.borderMid} flex flex-wrap items-center gap-3`}>
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${t.textSub}`} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar projetos..."
            className={`w-full border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none transition ${t.input}`} />
        </div>
        {allLabels.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`flex items-center gap-1 text-[11px] shrink-0 ${t.textSub}`}>
              <Tag size={11} /> Rótulos:
            </span>
            {allLabels.map(lbl => (
              <button key={lbl} onClick={() => toggleLabel(lbl)}
                className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border transition ${activeLabels.includes(lbl) ? t.labelActive : t.labelIdle}`}>
                {lbl}{activeLabels.includes(lbl) && <X size={9} />}
              </button>
            ))}
            {activeLabels.length > 0 && (
              <button onClick={() => setActiveLabels([])}
                className={`text-[11px] underline transition ${t.textMuted}`}>
                Limpar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-7 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <NewProjectCard onClick={() => { onNewProject(); onClose?.(); }} t={t} />
          {filtered.map(prj => (
            <ProjectCard key={prj.id} prj={prj} t={t}
              onOpen={(p) => { onOpenProject(p); onClose?.(); }}
              onDelete={onDeleteProject} />
          ))}
          {filtered.length === 0 && hasFilter && (
            <div className={`col-span-full text-center py-16 text-sm ${t.textSub}`}>
              Nenhum projeto encontrado{search ? ` para "${search}"` : ''}.
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-6"
        style={{ backdropFilter: 'blur(6px)', background: t.overlayModal }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          className={`w-full max-w-5xl flex flex-col rounded-2xl overflow-hidden shadow-2xl border ${t.modalBorder}`}
          style={{ height: '85vh', background: t.bg, fontFamily: 'Gantari,system-ui,sans-serif' }}
          onClick={e => e.stopPropagation()}
        >
          {body}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden select-none"
      style={{ fontFamily: 'Gantari,system-ui,sans-serif', background: t.bg }}>
      {body}
    </div>
  );
}
