import { useMemo, useRef, useState } from 'react';
import { ImagePlus, Search, Square, Trash2, UploadCloud, X } from 'lucide-react';

import { ICONS } from '../../data/icons';
import { PRODUCTS, SECTORS } from '../../data/products';
import { fmt } from '../../utils/helpers';

function CatalogTab({ onAdd, placedIds }) {
  const [q, setQ] = useState('');
  const [sector, setSector] = useState('all');
  const list = useMemo(() => PRODUCTS.filter(p =>
    (sector === 'all' || p.sector === sector) &&
    (!q || (p.name + p.brand + p.code).toLowerCase().includes(q.toLowerCase()))
  ), [q, sector]);

  return (
    <>
      <div className="p-3 border-b border-stone-800/60">
        <div className="relative mb-2.5">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar…"
            className="w-full bg-stone-900/60 border border-stone-800 rounded-md pl-8 pr-2 py-1.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-700/60" />
        </div>
        <div className="flex flex-wrap gap-1">
          {SECTORS.map(s => (
            <button key={s.id} onClick={() => setSector(s.id)}
              className={`text-[9px] uppercase tracking-wider px-2 py-1 rounded-full font-semibold transition ${sector === s.id ? 'bg-emerald-700 text-white' : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        <p className="text-[10px] text-stone-500 italic px-1 mb-1" style={{ fontFamily: 'Gantari,sans-serif' }}>
          Selecione um slot vazio e clique no produto — ou clique para soltar um novo no canvas.
        </p>
        {list.map(p => {
          const Icon = ICONS[p.iconName] || Square;
          const placed = placedIds.has(p.id);
          return (
            <button key={p.id} onClick={() => onAdd(p)}
              className={`group w-full text-left p-2 rounded-lg border transition-all ${placed ? 'bg-emerald-950/40 border-emerald-700/40' : 'bg-stone-900/40 border-stone-700/50 hover:border-emerald-500/60 hover:bg-stone-900/80'}`}>
              <div className="flex gap-2.5 items-center">
                <div className={`shrink-0 w-11 h-11 rounded-md flex items-center justify-center ${placed ? 'bg-emerald-900/50' : 'bg-stone-800/80'}`}>
                  <Icon size={22} className={placed ? 'text-emerald-400' : 'text-stone-400'} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] uppercase tracking-widest text-stone-500 font-medium">{p.brand}</div>
                  <div className="text-xs text-stone-100 font-medium truncate leading-tight">{p.name}</div>
                  <div className="text-[11px] text-emerald-400 font-mono">R$ {fmt(p.priceCash)}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function UploadsTab({ uploads, onUploadFiles, onAddUpload, onDeleteUpload }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []).filter(f => f.type.startsWith('image/'));
    if (files.length) onUploadFiles(files);
  };

  return (
    <>
      <div className="p-3 border-b border-stone-800/60">
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          className={`cursor-pointer rounded-lg border-2 border-dashed flex flex-col items-center justify-center py-6 px-3 text-center transition
            ${dragOver ? 'border-emerald-500 bg-emerald-950/30' : 'border-stone-700 hover:border-emerald-600/60 hover:bg-stone-900/60'}`}>
          <UploadCloud size={26} className={dragOver ? 'text-emerald-400' : 'text-stone-500'} />
          <span className="text-xs text-stone-300 font-medium mt-2">Enviar imagens</span>
          <span className="text-[10px] text-stone-500 mt-0.5">Clique ou arraste arquivos aqui</span>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
      </div>

      <div className="flex-1 overflow-y-auto p-2.5">
        <p className="text-[10px] text-stone-500 italic px-1 mb-2" style={{ fontFamily: 'Gantari,sans-serif' }}>
          Seus uploads ficam salvos no navegador e disponíveis entre projetos. Clique numa imagem para inseri-la na página.
        </p>
        {uploads.length === 0 ? (
          <div className="text-[10px] text-stone-600 italic text-center py-6 px-3 leading-relaxed flex flex-col items-center gap-2">
            <ImagePlus size={22} className="text-stone-700" />
            Nenhum upload ainda.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {uploads.map(u => (
              <div key={u.id} className="group relative rounded-md overflow-hidden border border-stone-700/60 bg-stone-900/60 aspect-square">
                <button onClick={() => onAddUpload(u)} className="w-full h-full" title={`Inserir ${u.name}`}>
                  <img src={u.src} alt={u.name}
                    className="w-full h-full object-contain bg-[repeating-conic-gradient(#1c1917_0%_25%,#262320_0%_50%)] bg-[length:14px_14px]" />
                </button>
                <button onClick={() => onDeleteUpload(u.id)} title="Excluir upload"
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-stone-950/80 text-stone-300 opacity-0 group-hover:opacity-100 hover:text-rose-400 flex items-center justify-center transition">
                  <Trash2 size={11} />
                </button>
                <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-[9px] text-stone-200 truncate">{u.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function Catalog({ onAdd, placedIds, uploads, onUploadFiles, onAddUpload, onDeleteUpload, onClose }) {
  const [tab, setTab] = useState('catalog');
  return (
    <aside className="w-64 shrink-0 border-r border-stone-800 bg-stone-950 lg:bg-stone-950/40 flex flex-col h-full">
      <div className="flex border-b border-stone-800/60 shrink-0 items-center">
        <button onClick={() => setTab('catalog')}
          className={`flex-1 text-[10px] uppercase tracking-[0.15em] font-semibold py-2.5 transition border-b-2 ${tab === 'catalog' ? 'text-emerald-300 border-emerald-500' : 'text-stone-500 border-transparent hover:text-stone-300'}`}>
          Catálogo
        </button>
        <button onClick={() => setTab('uploads')}
          className={`flex-1 text-[10px] uppercase tracking-[0.15em] font-semibold py-2.5 transition border-b-2 flex items-center justify-center gap-1 ${tab === 'uploads' ? 'text-emerald-300 border-emerald-500' : 'text-stone-500 border-transparent hover:text-stone-300'}`}>
          Uploads {uploads.length > 0 && <span className="text-[9px] font-mono text-stone-500">({uploads.length})</span>}
        </button>
        {onClose && (
          <button onClick={onClose} title="Fechar catálogo"
            className="lg:hidden shrink-0 p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 transition">
            <X size={15} />
          </button>
        )}
      </div>

      {tab === 'catalog'
        ? <CatalogTab onAdd={onAdd} placedIds={placedIds} />
        : <UploadsTab uploads={uploads} onUploadFiles={onUploadFiles} onAddUpload={onAddUpload} onDeleteUpload={onDeleteUpload} />}
    </aside>
  );
}
