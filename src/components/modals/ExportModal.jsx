import { useState } from 'react';
import { Archive, Check, ChevronDown, FileCheck2, FileImage, FileJson, FileText } from 'lucide-react';

import Modal from './Modal';
import { backgroundToCss } from '../../constants/background';

const FORMATS = [
  {
    key: 'pdf-graphic', title: 'PDF Gráfica', icon: FileCheck2, disabled: true, badge: 'Em breve',
    desc: 'Alta resolução · 300 DPI · CMYK · pronto para impressão',
    iconClass: 'bg-stone-800 text-stone-400',
  },
  {
    key: 'pdf-digital', title: 'PDF Digital', icon: FileText,
    desc: 'Comprimido · RGB · ideal para compartilhar online',
    iconClass: 'bg-sky-600/30 text-sky-300',
  },
  {
    key: 'zip-png', title: 'ZIP (páginas separadas)', icon: FileImage,
    desc: 'Cada página como PNG individual · 72 DPI · RGB',
    iconClass: 'bg-amber-600/30 text-amber-300',
  },
  {
    key: 'zip-pdf', title: 'ZIP (PDF por página)', icon: Archive,
    desc: 'Cada página como PDF separado · pronto para impressão parcelada',
    iconClass: 'bg-violet-600/30 text-violet-300',
  },
];

export default function ExportModal({
  onClose, format, pages, docTitle, currentPageId,
  onExportAll, onExportPages, onEditable,
}) {
  const [tab, setTab] = useState('project'); // 'project' | 'pages'
  const title = (docTitle || '').trim() || 'Projeto sem título';

  return (
    <Modal title="Baixar Projeto" onClose={onClose} w="w-[560px]">
      <div className="text-[11px] text-stone-400 mb-4 leading-relaxed">
        {title} · {pages.length} {pages.length === 1 ? 'página' : 'páginas'} · formato {format.label} ({format.mm[0]}×{format.mm[1]} mm)
      </div>

      <div className="flex gap-1 mb-4 p-1 rounded-lg bg-stone-900/60 border border-stone-800">
        <button onClick={() => setTab('project')}
          className={`flex-1 text-xs font-medium py-1.5 rounded-md transition ${tab === 'project' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>
          Projeto completo
        </button>
        <button onClick={() => setTab('pages')}
          className={`flex-1 text-xs font-medium py-1.5 rounded-md transition ${tab === 'pages' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}>
          Páginas individuais
        </button>
      </div>

      {tab === 'project' && (
        <ProjectTab
          onDownload={(key) => { onExportAll(key); onClose(); }}
          onEditable={() => { onEditable(); onClose(); }}
        />
      )}

      {tab === 'pages' && (
        <PagesTab
          pages={pages} format={format} currentPageId={currentPageId}
          onDownload={(key, pageIds) => { onExportPages(key, pageIds); onClose(); }}
        />
      )}
    </Modal>
  );
}

// ============================================================
// ABA "PROJETO COMPLETO"
// ============================================================

function ProjectTab({ onDownload, onEditable }) {
  return (
    <>
      <div className="space-y-2">
        {FORMATS.map(f => (
          <FormatRow key={f.key} format={f} onDownload={() => onDownload(f.key)} />
        ))}
      </div>
      <button onClick={onEditable}
        className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-500 hover:text-emerald-400 transition">
        <FileJson size={12} /> Salvar arquivo do projeto editável (.json)
      </button>
      <div className="mt-4 pt-3 border-t border-stone-800 text-[10px] text-stone-500 italic leading-relaxed" style={{ fontFamily: 'Gantari,sans-serif' }}>
        Nota técnica: PDF Gráfica (CMYK, perfil ICC) ainda não está disponível — em breve.
      </div>
    </>
  );
}

function FormatRow({ format: f, onDownload }) {
  const Icon = f.icon;
  return (
    <div className={`w-full p-3 rounded-md border flex items-center gap-3
      ${f.disabled ? 'bg-stone-900/20 border-stone-800/60 opacity-60' : 'bg-stone-900/40 border-stone-800'}`}>
      <div className={`shrink-0 w-9 h-9 rounded flex items-center justify-center ${f.iconClass}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-stone-100">{f.title}</span>
          {f.badge && <span className="text-[9px] uppercase tracking-wider bg-amber-900/50 text-amber-300 px-1.5 py-0.5 rounded">{f.badge}</span>}
        </div>
        <div className="text-[11px] text-stone-400 mt-1 leading-snug">{f.desc}</div>
      </div>
      <button onClick={onDownload} disabled={f.disabled}
        className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-md bg-emerald-700/40 text-emerald-200 hover:bg-emerald-700/60 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-700/40 transition">
        ↓ Baixar
      </button>
    </div>
  );
}

// ============================================================
// ABA "PÁGINAS INDIVIDUAIS" — fluxo estilo Canva
// ============================================================

function PagesTab({ pages, format, currentPageId, onDownload }) {
  const [formatKey, setFormatKey] = useState('pdf-digital');
  const [formatOpen, setFormatOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => (currentPageId != null ? [currentPageId] : pages.slice(0, 1).map(p => p.id)));

  const selectedFormat = FORMATS.find(f => f.key === formatKey);
  const currentPageNumber = pages.findIndex(p => p.id === currentPageId) + 1;
  const allSelected = pages.length > 0 && selectedIds.length === pages.length;

  const toggleAll = () => setSelectedIds(allSelected ? [] : pages.map(p => p.id));
  const toggleCurrent = () => setSelectedIds(ids => ids.includes(currentPageId) ? ids.filter(id => id !== currentPageId) : [...ids, currentPageId]);
  const togglePage = (id) => setSelectedIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);

  const pagesSummary = () => {
    if (pages.length === 0) return 'Nenhuma página';
    if (allSelected) return `Todas as páginas (1–${pages.length})`;
    if (selectedIds.length === 0) return 'Nenhuma página selecionada';
    if (selectedIds.length === 1 && selectedIds[0] === currentPageId) return `Página atual (Página ${currentPageNumber})`;
    return `${selectedIds.length} ${selectedIds.length === 1 ? 'página selecionada' : 'páginas selecionadas'}`;
  };

  return (
    <>
      <div className="mb-3">
        <label className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Formato de arquivo</label>
        <div className="relative mt-1.5">
          <button onClick={() => { setFormatOpen(o => !o); setPagesOpen(false); }}
            className="w-full flex items-center gap-2 p-2.5 rounded-md border border-stone-800 bg-stone-900/40 hover:border-stone-700 transition">
            <div className={`shrink-0 w-7 h-7 rounded flex items-center justify-center ${selectedFormat.iconClass}`}>
              <selectedFormat.icon size={14} />
            </div>
            <span className="text-sm text-stone-100 font-medium flex-1 text-left">{selectedFormat.title}</span>
            <ChevronDown size={14} className={`text-stone-500 transition-transform ${formatOpen ? 'rotate-180' : ''}`} />
          </button>
          {formatOpen && (
            <div className="absolute z-10 mt-1 w-full bg-stone-900 border border-stone-700 rounded-md shadow-xl overflow-hidden">
              {FORMATS.map(f => (
                <button key={f.key} disabled={f.disabled}
                  onClick={() => { setFormatKey(f.key); setFormatOpen(false); }}
                  className={`w-full flex items-center gap-2 p-2.5 text-left hover:bg-stone-800 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
                    ${f.key === formatKey ? 'bg-stone-800/60' : ''}`}>
                  <div className={`shrink-0 w-7 h-7 rounded flex items-center justify-center ${f.iconClass}`}>
                    <f.icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-stone-100">{f.title}</span>
                      {f.badge && <span className="text-[9px] uppercase tracking-wider bg-amber-900/50 text-amber-300 px-1.5 py-0.5 rounded">{f.badge}</span>}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{f.desc}</div>
                  </div>
                  {f.key === formatKey && <Check size={14} className="text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Selecionar páginas</label>
        <div className="relative mt-1.5">
          <button onClick={() => { setPagesOpen(o => !o); setFormatOpen(false); }}
            className="w-full flex items-center gap-2 p-2.5 rounded-md border border-stone-800 bg-stone-900/40 hover:border-stone-700 transition">
            <span className="text-sm text-stone-100 font-medium flex-1 text-left truncate">{pagesSummary()}</span>
            <ChevronDown size={14} className={`text-stone-500 transition-transform ${pagesOpen ? 'rotate-180' : ''}`} />
          </button>
          {pagesOpen && (
            <div className="absolute z-10 mt-1 w-full bg-stone-900 border border-stone-700 rounded-md shadow-xl max-h-64 overflow-y-auto">
              <label onClick={toggleAll} className="flex items-center gap-2.5 p-2.5 hover:bg-stone-800 cursor-pointer transition">
                <Checkbox checked={allSelected} />
                <span className="text-xs text-stone-200">Todas as páginas (1–{pages.length})</span>
              </label>
              {currentPageId != null && (
                <label onClick={toggleCurrent} className="flex items-center gap-2.5 p-2.5 hover:bg-stone-800 cursor-pointer transition">
                  <Checkbox checked={selectedIds.includes(currentPageId)} />
                  <span className="text-xs text-stone-200">Página atual (Página {currentPageNumber})</span>
                </label>
              )}
              <div className="border-t border-stone-800" />
              {pages.map((p, i) => (
                <label key={p.id} onClick={() => togglePage(p.id)} className="flex items-center gap-2.5 p-2.5 hover:bg-stone-800 cursor-pointer transition">
                  <Checkbox checked={selectedIds.includes(p.id)} />
                  <span className="w-6 h-8 rounded-sm shrink-0 border border-stone-700" style={{ background: backgroundToCss(p.background) }} />
                  <div className="min-w-0">
                    <div className="text-xs text-stone-200">Página {i + 1}</div>
                    <div className="text-[10px] text-stone-500">{format.w}×{format.h} px</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={() => onDownload(formatKey, selectedIds)} disabled={selectedIds.length === 0 || selectedFormat.disabled}
        className="w-full text-sm font-semibold py-2.5 rounded-md bg-emerald-700/50 text-emerald-100 hover:bg-emerald-700/70 disabled:opacity-40 disabled:cursor-not-allowed transition">
        ↓ Baixar {selectedIds.length > 0 ? `${selectedIds.length} ${selectedIds.length === 1 ? 'página' : 'páginas'}` : ''}
      </button>
    </>
  );
}

function Checkbox({ checked }) {
  return (
    <span className={`shrink-0 w-4 h-4 rounded flex items-center justify-center border transition
        ${checked ? 'bg-emerald-600 border-emerald-600' : 'border-stone-600 bg-stone-950'}`}>
      {checked && <Check size={11} className="text-white" />}
    </span>
  );
}
