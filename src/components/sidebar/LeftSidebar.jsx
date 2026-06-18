import { useMemo, useRef, useState } from 'react';
import {
  Award,
  ChevronDown,
  Download,
  FileUp,
  FolderOpen,
  Grid3x3,
  Image as ImageIcon,
  ImagePlus,
  Layout,
  Package,
  Pencil,
  Save,
  Search,
  ShoppingBag,
  Sparkles,
  Square,
  Trash2,
  Type,
  UploadCloud,
  X,
} from 'lucide-react';

import { ICONS } from '../../data/icons';
import { PRODUCTS, SECTORS } from '../../data/products';
import { BRAND_ASSETS } from '../../data/brandAssets';
import { TEMPLATES } from '../../data/templates';
import { fmt } from '../../utils/helpers';
import GridPopover from '../popovers/GridPopover';
import SavedTemplateRow from '../templates/SavedTemplateRow';

function fmtDate(ts) {
  if (!ts) return '';
  try { return new Date(ts).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }); }
  catch { return ''; }
}

// ---- Modelos ----
function ModelosPanel({ savedTemplates, onApplySavedTemplate, onDeleteSavedTemplate, onRenameSavedTemplate, onApplyBuiltinTemplate }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-3 pt-3 pb-2">
        <div className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-semibold mb-2">Padrões</div>
        <div className="space-y-1.5">
          {TEMPLATES.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => onApplyBuiltinTemplate(t)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left bg-stone-900/60 border border-stone-800 hover:border-emerald-600/50 hover:bg-stone-900 transition-all">
                <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-stone-300" />
                </div>
                <div>
                  <div className="text-xs text-stone-100 font-medium">{t.name}</div>
                  <div className="text-[10px] text-stone-500">{t.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-3 pt-2 pb-3">
        <div className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-semibold mb-2">
          Minhas predefinições{savedTemplates.length > 0 && <span className="font-mono text-stone-600 ml-1">({savedTemplates.length})</span>}
        </div>
        {savedTemplates.length === 0 ? (
          <div className="text-[10px] text-stone-600 italic text-center py-4 px-2 leading-relaxed border border-dashed border-stone-800/80 rounded-xl">
            Nenhuma predefinição salva.<br />
            <span className="text-stone-700">Use "Salvar predefinição" na barra à direita.</span>
          </div>
        ) : savedTemplates.map(tpl => (
          <SavedTemplateRow key={tpl.id} tpl={tpl}
            onApply={() => onApplySavedTemplate(tpl)}
            onDelete={() => onDeleteSavedTemplate(tpl.id)}
            onRename={(name) => onRenameSavedTemplate(tpl.id, name)} />
        ))}
      </div>
    </div>
  );
}

// ---- Elementos ----
function ElementosPanel({ onAddText, onAddBox, onAddProductBox, onGenGrid, onInsertImageClick }) {
  const [showGrid, setShowGrid] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const gridBtnRef = useRef(null);

  const toggleGrid = () => {
    if (!showGrid && gridBtnRef.current) {
      const rect = gridBtnRef.current.getBoundingClientRect();
      const top = Math.min(rect.top, window.innerHeight - 280);
      const left = rect.right + 8;
      setPopoverPos({ top, left });
    }
    setShowGrid(s => !s);
  };

  const items = [
    { icon: Type,      label: 'Texto',           sub: 'Caixa de texto editável',    action: onAddText },
    { icon: ImageIcon, label: 'Imagem',           sub: 'Enviar do computador',        action: onInsertImageClick },
    { icon: Square,    label: 'Caixa',            sub: 'Forma / bloco de cor',        action: onAddBox },
    { icon: Package,   label: 'Slot de produto',  sub: 'Espaço para um produto',      action: onAddProductBox },
  ];

  return (
    <div className="p-3 space-y-2">
      {items.map(item => (
        <button key={item.label} onClick={item.action}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left bg-stone-900/60 border border-stone-800 hover:border-emerald-600/50 hover:bg-stone-900 transition-all">
          <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center shrink-0">
            <item.icon size={16} className="text-stone-300" />
          </div>
          <div>
            <div className="text-xs text-stone-100 font-semibold">{item.label}</div>
            <div className="text-[10px] text-stone-500">{item.sub}</div>
          </div>
        </button>
      ))}

      <button ref={gridBtnRef} onClick={toggleGrid}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left border transition-all ${showGrid ? 'border-emerald-600/50 bg-emerald-950/30' : 'bg-stone-900/60 border-stone-800 hover:border-emerald-600/50 hover:bg-stone-900'}`}>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${showGrid ? 'bg-emerald-900/50' : 'bg-stone-800'}`}>
          <Grid3x3 size={16} className={showGrid ? 'text-emerald-300' : 'text-stone-300'} />
        </div>
        <div>
          <div className="text-xs text-stone-100 font-semibold">Grade de boxes</div>
          <div className="text-[10px] text-stone-500">Gerar vários boxes em grade</div>
        </div>
      </button>

      {showGrid && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowGrid(false)} />
          <div className="fixed z-50 w-60 shadow-2xl rounded-xl overflow-hidden"
            style={{ top: popoverPos.top, left: popoverPos.left }}>
            <GridPopover
              onGenerate={(cols, rows) => { onGenGrid(cols, rows); setShowGrid(false); }}
              onClose={() => setShowGrid(false)}
              inline
            />
          </div>
        </>
      )}
    </div>
  );
}

// ---- Produtos ----
function ProdutosPanel({ onAdd, placedIds }) {
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
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar produto…"
            className="w-full bg-stone-900/60 border border-stone-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-700/60" />
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
        <p className="text-[10px] text-stone-500 italic px-1 mb-1">
          Selecione um slot e clique no produto para preencher, ou clique para soltar novo.
        </p>
        {list.map(p => {
          const Icon = ICONS[p.iconName] || Square;
          const placed = placedIds.has(p.id);
          return (
            <button key={p.id} onClick={() => onAdd(p)}
              className={`group w-full text-left p-2 rounded-xl border transition-all ${placed ? 'bg-emerald-950/40 border-emerald-700/40' : 'bg-stone-900/40 border-stone-700/50 hover:border-emerald-500/60 hover:bg-stone-900/80'}`}>
              <div className="flex gap-2.5 items-center">
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${placed ? 'bg-emerald-900/50' : 'bg-stone-800/80'}`}>
                  <Icon size={20} className={placed ? 'text-emerald-400' : 'text-stone-400'} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] uppercase tracking-widest text-stone-500">{p.brand}</div>
                  <div className="text-xs text-stone-100 font-medium truncate">{p.name}</div>
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

// ---- Marca ----
const MARCA_TABS = [
  { id: 'logos',    label: 'Logotipos' },
  { id: 'cores',    label: 'Cores'     },
  { id: 'fontes',   label: 'Fontes'    },
  { id: 'graficos', label: 'Gráficos'  },
];

const BRANDS = {
  lebes: {
    label: 'Lojas Lebes',
    tag: 'VAREJO',
    accentClass: 'bg-[#5CA847]',
    cores: [
      { name: 'Verde',        hex: '#5CA847' },
      { name: 'Verde Escuro', hex: '#3D7A2E' },
      { name: 'Laranja',      hex: '#E0913A' },
      { name: 'Preto',        hex: '#1A1A1A' },
      { name: 'Fundo',        hex: '#F7F6F2' },
    ],
  },
  grupo: {
    label: 'Grupo Lebes',
    tag: 'CORPORATIVO',
    accentClass: 'bg-[#2E6B2E]',
    cores: [
      { name: 'Verde Corp.',  hex: '#2E6B2E' },
      { name: 'Verde Escuro', hex: '#1A3D1A' },
      { name: 'Verde Claro',  hex: '#8BC34A' },
      { name: 'Preto',        hex: '#1A1A1A' },
      { name: 'Branco',       hex: '#FFFFFF' },
    ],
  },
};

const FONT_OPTIONS = [
  { family: 'Gantari',     label: 'Gantari Regular',   weight: 400 },
  { family: 'Gantari',     label: 'Gantari SemiBold',  weight: 600 },
  { family: 'Gantari',     label: 'Gantari Bold',      weight: 700 },
  { family: 'Gantari',     label: 'Gantari ExtraBold', weight: 800 },
  { family: 'Arial',       label: 'Arial',             weight: 400 },
  { family: 'Georgia',     label: 'Georgia',           weight: 400 },
  { family: 'Verdana',     label: 'Verdana',           weight: 400 },
  { family: 'Courier New', label: 'Courier New',       weight: 400 },
];

function MarcaPanel({ onInsertAsset, selectedEl, onChangeEl, brandLogos, onUploadBrandLogo, onDeleteBrandLogo }) {
  const [tab, setTab] = useState('logos');
  const [brandId, setBrandId] = useState('lebes');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const logoInputRef = useRef(null);
  const graficos = BRAND_ASSETS.filter(a => a.id !== 'logo');
  const brand = BRANDS[brandId];

  const applyColor = (hex) => {
    if (!selectedEl || !onChangeEl) { navigator.clipboard?.writeText(hex); return; }
    if (selectedEl.type === 'text') onChangeEl(selectedEl.id, { color: hex });
    else if (selectedEl.type === 'box' || selectedEl.type === 'product') onChangeEl(selectedEl.id, { fill: hex });
    else navigator.clipboard?.writeText(hex);
  };

  const applyFont = (family, weight) => {
    if (!selectedEl || selectedEl.type !== 'text' || !onChangeEl) return;
    onChangeEl(selectedEl.id, { font: family, weight });
  };

  const canApplyColor = selectedEl && ['text', 'box', 'product'].includes(selectedEl.type);
  const canApplyFont  = selectedEl && selectedEl.type === 'text';

  return (
    <>
      {/* Seletor de marca — pill compacto */}
      <div className="px-3 pt-3 pb-2 border-b border-stone-800/60 shrink-0 relative">
        <button
          onClick={() => setDropdownOpen(o => !o)}
          className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 border border-stone-700 transition"
        >
          {/* Avatar logo */}
          <span className="w-6 h-6 rounded-full bg-[#5CA847] flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-black leading-none select-none">L</span>
          </span>
          <span className="text-[12px] font-semibold text-stone-100 leading-none">{brand.label}</span>
          <ChevronDown size={12} className={`text-stone-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div className="absolute left-3 top-full mt-1 z-20 bg-stone-900 border border-stone-700 rounded-xl shadow-xl overflow-hidden min-w-[170px]">
              {Object.entries(BRANDS).map(([id, b]) => (
                <button
                  key={id}
                  onClick={() => { setBrandId(id); setDropdownOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition hover:bg-stone-800 ${brandId === id ? 'text-emerald-300' : 'text-stone-300'}`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${b.accentClass}`} />
                  <div>
                    <div className="text-[12px] font-semibold leading-none">{b.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{b.tag}</div>
                  </div>
                  {brandId === id && <span className="ml-auto text-emerald-500 text-[10px]">✓</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Sub-abas */}
      <div className="flex border-b border-stone-800/60 shrink-0 overflow-x-auto">
        {MARCA_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`shrink-0 text-[10px] px-3 py-2.5 border-b-2 transition font-semibold tracking-wide ${tab === t.id ? 'text-emerald-300 border-emerald-500' : 'text-stone-500 border-transparent hover:text-stone-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">

        {/* ---------- LOGOTIPOS ---------- */}
        {tab === 'logos' && (
          <div className="space-y-2">
            {/* Upload de logo personalizado */}
            <button onClick={() => logoInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-stone-700 hover:border-emerald-600/60 hover:bg-stone-900/60 text-stone-500 hover:text-stone-200 text-xs transition">
              <UploadCloud size={15} /> Enviar logotipo
            </button>
            <input ref={logoInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => { const files = Array.from(e.target.files || []); if (files.length) onUploadBrandLogo(files); e.target.value = ''; }} />

            {/* Logos enviados pelo usuário */}
            {brandLogos.map(logo => (
              <div key={logo.id} className="group relative rounded-xl border border-stone-800 bg-stone-900/60 hover:border-emerald-600/50 transition overflow-hidden">
                <button onClick={() => onInsertAsset({ src: logo.src, ratio: 3, name: logo.name })} className="w-full p-4">
                  <img src={logo.src} alt={logo.name} className="w-full object-contain max-h-16" />
                  <div className="text-[10px] text-stone-400 text-center mt-2 truncate">{logo.name}</div>
                </button>
                <button onClick={() => onDeleteBrandLogo(logo.id)} title="Remover"
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-stone-950/80 text-stone-400 opacity-0 group-hover:opacity-100 hover:text-rose-400 flex items-center justify-center transition">
                  <Trash2 size={11} />
                </button>
              </div>
            ))}

            {/* Assets padrão da marca */}
            {BRAND_ASSETS.filter(a => a.id === 'logo').map(asset => (
              <button key={asset.id} onClick={() => onInsertAsset(asset)}
                className="w-full rounded-xl border border-stone-800 bg-stone-900/60 hover:border-emerald-600/50 hover:bg-stone-900 transition overflow-hidden p-4">
                <img src={asset.src} alt={asset.name} className="w-full object-contain max-h-16" />
                <div className="text-[10px] text-stone-400 text-center mt-2">{asset.name} <span className="text-stone-600">(padrão)</span></div>
              </button>
            ))}
          </div>
        )}

        {/* ---------- CORES ---------- */}
        {tab === 'cores' && (
          <div>
            <p className="text-[10px] text-stone-500 italic mb-3">
              {canApplyColor
                ? 'Clique para aplicar ao elemento selecionado.'
                : 'Selecione um elemento para aplicar. Clique para copiar o hex.'}
            </p>
            <div className="space-y-2">
              {brand.cores.map(c => (
                <button key={c.hex} onClick={() => applyColor(c.hex)} title={canApplyColor ? `Aplicar ${c.hex}` : `Copiar ${c.hex}`}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-xl bg-stone-900/40 border border-stone-800 hover:border-emerald-600/40 hover:bg-stone-900 transition group">
                  <div className="w-8 h-8 rounded-lg shrink-0 border border-stone-700/60 group-hover:border-emerald-600/40 transition"
                    style={{ background: c.hex }} />
                  <div className="text-left flex-1">
                    <div className="text-xs text-stone-100 font-medium">{c.name}</div>
                    <div className="text-[10px] text-stone-500 font-mono">{c.hex}</div>
                  </div>
                  {canApplyColor && <span className="text-[9px] text-emerald-500 opacity-0 group-hover:opacity-100">Aplicar</span>}
                </button>
              ))}
            </div>

            {/* Cor personalizada */}
            <div className="mt-3 pt-3 border-t border-stone-800">
              <div className="text-[10px] text-stone-500 mb-2">Cor personalizada</div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="color" defaultValue="#ffffff"
                  onChange={(e) => applyColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-stone-700 bg-stone-900 cursor-pointer p-0.5" />
                <span className="text-xs text-stone-400">Selecionar cor</span>
              </label>
            </div>
          </div>
        )}

        {/* ---------- FONTES ---------- */}
        {tab === 'fontes' && (
          <div className="space-y-2">
            <p className="text-[10px] text-stone-500 italic mb-2">
              {canApplyFont ? 'Clique para aplicar ao texto selecionado.' : 'Selecione um elemento de texto para aplicar.'}
            </p>
            {FONT_OPTIONS.map(f => (
              <button key={f.label} onClick={() => applyFont(f.family, f.weight)} disabled={!canApplyFont}
                className={`w-full text-left rounded-xl p-3 border transition-all ${canApplyFont
                  ? 'bg-stone-900/60 border-stone-800 hover:border-emerald-600/50 hover:bg-stone-900 cursor-pointer'
                  : 'bg-stone-900/30 border-stone-800/60 opacity-50 cursor-not-allowed'}`}>
                <div className="text-[10px] text-stone-500 mb-1">{f.label}</div>
                <div className="text-stone-100 text-base leading-none"
                  style={{ fontFamily: `${f.family}, sans-serif`, fontWeight: f.weight }}>
                  Lebes Ofertas
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ---------- GRÁFICOS ---------- */}
        {tab === 'graficos' && (
          <div className="space-y-2">
            <p className="text-[10px] text-stone-500 italic mb-3">Clique para inserir na página.</p>
            {graficos.length === 0 ? (
              <div className="text-[10px] text-stone-600 italic text-center py-6 leading-relaxed">
                Novos elementos gráficos serão adicionados em breve.
              </div>
            ) : graficos.map(asset => (
              <button key={asset.id} onClick={() => onInsertAsset(asset)}
                className="w-full rounded-xl border border-stone-800 bg-stone-900/60 hover:border-emerald-600/50 hover:bg-stone-900 transition overflow-hidden p-4">
                <img src={asset.src} alt={asset.name} className="w-16 h-16 object-contain mx-auto" />
                <div className="text-[10px] text-stone-400 text-center mt-2">{asset.name}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ---- Editor IA ----
const IA_EXAMPLES = [
  'Crie uma capa com fundo verde Lebes',
  'Grade 3×2 com produtos de móveis',
  'Página de destaque com 1 produto grande',
];

function EditorIAPanel({ onOpenAI }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <p className="text-[11px] text-stone-400 leading-relaxed">
        Descreva o projeto (Banner, Card ou Revista) que deseja criar e a IA irá gerar o layout automaticamente.
      </p>
      <button onClick={onOpenAI}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm text-stone-100 border border-stone-700/60 hover:border-emerald-600/60 transition"
        style={{ background: 'linear-gradient(135deg,rgba(229,0,109,.2),rgba(0,129,58,.2))' }}>
        <Sparkles size={16} className="text-emerald-300" />
        Abrir Editor IA
      </button>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-2">Exemplos de prompts</div>
        <div className="space-y-1.5">
          {IA_EXAMPLES.map(ex => (
            <div key={ex} className="text-[10px] text-stone-400 bg-stone-900/40 border border-stone-800 rounded-lg px-3 py-2 italic leading-relaxed">
              "{ex}"
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Uploads ----
function UploadsPanel({ uploads, onUploadFiles, onAddUpload, onDeleteUpload }) {
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
          className={`cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-6 px-3 text-center transition
            ${dragOver ? 'border-emerald-500 bg-emerald-950/30' : 'border-stone-700 hover:border-emerald-600/60 hover:bg-stone-900/60'}`}>
          <UploadCloud size={24} className={dragOver ? 'text-emerald-400' : 'text-stone-500'} />
          <span className="text-xs text-stone-200 font-medium mt-2">Enviar imagens</span>
          <span className="text-[10px] text-stone-500 mt-0.5">Clique ou arraste arquivos aqui</span>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
      </div>

      <div className="flex-1 overflow-y-auto p-2.5">
        <p className="text-[10px] text-stone-500 italic px-1 mb-2">
          Uploads ficam salvos no navegador. Clique numa imagem para inserir.
        </p>
        {uploads.length === 0 ? (
          <div className="text-[10px] text-stone-600 italic text-center py-6 px-3 leading-relaxed flex flex-col items-center gap-2">
            <ImagePlus size={22} className="text-stone-700" />
            Nenhum upload ainda.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {uploads.map(u => (
              <div key={u.id} className="group relative rounded-xl overflow-hidden border border-stone-700/60 bg-stone-900/60 aspect-square">
                <button onClick={() => onAddUpload(u)} className="w-full h-full" title={u.name}>
                  <img src={u.src} alt={u.name}
                    className="w-full h-full object-contain bg-[repeating-conic-gradient(#1c1917_0%_25%,#262320_0%_50%)] bg-[length:14px_14px]" />
                </button>
                <button onClick={() => onDeleteUpload(u.id)} title="Excluir"
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

// ---- Projetos ----
function ProjetosPanel({ savedProjects, docTitle, onSaveNew, onUpdate, onLoad, onDelete, onImport, onExport }) {
  const fileRef = useRef(null);
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-3">
        <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-2">Projeto atual</div>
        <div className="text-xs text-stone-100 mb-3 truncate font-medium">{docTitle || 'Sem título'}</div>
        <div className="flex flex-col gap-1.5">
          <button onClick={onSaveNew}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition">
            <Save size={12} /> Salvar como novo
          </button>
          <button onClick={onExport}
            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-2 rounded-lg text-xs transition">
            <Download size={12} /> Baixar .json
          </button>
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-2 rounded-lg text-xs transition">
            <FileUp size={12} /> Abrir arquivo…
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = ''; }} />
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-2 font-semibold">
          Salvos{savedProjects.length > 0 && <span className="font-mono text-stone-600 ml-1">({savedProjects.length})</span>}
        </div>
        {savedProjects.length === 0 ? (
          <div className="text-[10px] text-stone-600 italic text-center py-5 px-2 border border-dashed border-stone-800 rounded-xl leading-relaxed">
            Nenhum projeto salvo ainda.<br />Use "Salvar como novo" acima.
          </div>
        ) : (
          <div className="space-y-1.5">
            {savedProjects.map(prj => (
              <div key={prj.id}
                className="group flex items-start gap-2 bg-stone-900/40 border border-stone-800 rounded-xl px-3 py-2.5 hover:border-emerald-700/50 transition">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-stone-100 font-medium truncate">{prj.title || 'Sem título'}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    {prj.format?.label} · {prj.pages?.length || 0} pág.
                  </div>
                  <div className="text-[10px] text-stone-600 font-mono">{fmtDate(prj.updatedAt)}</div>
                </div>
                <div className="flex gap-0.5 shrink-0 mt-0.5">
                  <button onClick={() => onLoad(prj)} title="Abrir projeto"
                    className="flex items-center gap-1 text-[10px] text-emerald-300 hover:text-emerald-200 px-2 py-1 rounded-lg hover:bg-stone-800/70 transition">
                    <FolderOpen size={12} /> Abrir
                  </button>
                  <button onClick={() => onUpdate(prj.id)} title="Sobrescrever com o projeto atual"
                    className="p-1.5 text-stone-500 hover:text-stone-100 rounded-lg hover:bg-stone-800/70 transition">
                    <Save size={12} />
                  </button>
                  <button onClick={() => onDelete(prj.id)} title="Excluir"
                    className="p-1.5 text-stone-600 hover:text-rose-400 rounded-lg hover:bg-stone-800/70 transition">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Configuração do rail de ícones
// ============================================================
const PANELS_CONFIG = [
  { id: 'modelos',   Icon: Layout,      label: 'Modelos'   },
  { id: 'elementos', Icon: Pencil,      label: 'Elementos' },
  { id: 'produtos',  Icon: ShoppingBag, label: 'Produtos'  },
  { id: 'marca',     Icon: Award,       label: 'Marca'     },
  { id: 'ia',        Icon: Sparkles,    label: 'Editor IA' },
  { id: 'uploads',   Icon: UploadCloud, label: 'Uploads'   },
  { id: 'projetos',  Icon: FolderOpen,  label: 'Projetos'  },
];

// ============================================================
// LeftSidebar — componente principal
// ============================================================
export default function LeftSidebar({
  onAdd, placedIds,
  uploads, onUploadFiles, onAddUpload, onDeleteUpload,
  onAddText, onAddBox, onAddProductBox, onGenGrid, onPickImage,
  savedTemplates, onApplySavedTemplate, onDeleteSavedTemplate, onRenameSavedTemplate, onApplyBuiltinTemplate,
  savedProjects, docTitle,
  onSaveNewProject, onUpdateProject, onLoadProject, onDeleteProject, onImportProject, onExportProject,
  onOpenAI,
  onInsertAsset,
  selectedEl, onChangeEl,
  brandLogos, onUploadBrandLogo, onDeleteBrandLogo,
  sheetPanel = null,
}) {
  const [activePanel, setActivePanel] = useState(null);
  const imgFileRef = useRef(null);

  const toggle = (id) => setActivePanel(p => p === id ? null : id);
  const handleInsertImageClick = () => imgFileRef.current?.click();
  const panelTitle = PANELS_CONFIG.find(p => p.id === (sheetPanel ?? activePanel))?.label ?? '';

  // Modo sheet (mobile): renderiza apenas o conteúdo do painel, sem o rail lateral
  if (sheetPanel !== null) {
    return (
      <>
        {sheetPanel === 'modelos' && (
          <ModelosPanel
            savedTemplates={savedTemplates}
            onApplySavedTemplate={onApplySavedTemplate}
            onDeleteSavedTemplate={onDeleteSavedTemplate}
            onRenameSavedTemplate={onRenameSavedTemplate}
            onApplyBuiltinTemplate={onApplyBuiltinTemplate}
          />
        )}
        {sheetPanel === 'elementos' && (
          <ElementosPanel
            onAddText={onAddText}
            onAddBox={onAddBox}
            onAddProductBox={onAddProductBox}
            onGenGrid={onGenGrid}
            onInsertImageClick={handleInsertImageClick}
          />
        )}
        {sheetPanel === 'produtos' && (
          <ProdutosPanel onAdd={onAdd} placedIds={placedIds} />
        )}
        {sheetPanel === 'marca' && (
          <MarcaPanel
            onInsertAsset={onInsertAsset}
            selectedEl={selectedEl}
            onChangeEl={onChangeEl}
            brandLogos={brandLogos}
            onUploadBrandLogo={onUploadBrandLogo}
            onDeleteBrandLogo={onDeleteBrandLogo}
          />
        )}
        {sheetPanel === 'ia' && (
          <EditorIAPanel onOpenAI={onOpenAI} />
        )}
        {sheetPanel === 'uploads' && (
          <UploadsPanel
            uploads={uploads}
            onUploadFiles={onUploadFiles}
            onAddUpload={onAddUpload}
            onDeleteUpload={onDeleteUpload}
          />
        )}
        {sheetPanel === 'projetos' && (
          <ProjetosPanel
            savedProjects={savedProjects}
            docTitle={docTitle}
            onSaveNew={onSaveNewProject}
            onUpdate={onUpdateProject}
            onLoad={onLoadProject}
            onDelete={onDeleteProject}
            onImport={onImportProject}
            onExport={onExportProject}
          />
        )}
        <input ref={imgFileRef} type="file" accept="image/*" className="hidden" onChange={onPickImage} />
      </>
    );
  }

  return (
    <div className="flex h-full shrink-0">
      {/* ---- Icon rail ---- */}
      <div className="w-[62px] flex flex-col items-center py-2 gap-0.5 bg-stone-950 border-r border-stone-800/80 shrink-0">
        {PANELS_CONFIG.map(({ id, Icon, label }) => (
          <button key={id} onClick={() => toggle(id)}
            className={`flex flex-col items-center gap-1.5 w-[54px] py-3 rounded-xl text-[9px] font-semibold transition leading-none ${
              activePanel === id
                ? 'text-emerald-300 bg-stone-800'
                : 'text-stone-500 hover:text-stone-200 hover:bg-stone-800/60'
            }`}>
            <Icon size={18} strokeWidth={1.75} />
            <span className="text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* ---- Content panel ---- */}
      {activePanel && (
        <div className="w-60 flex flex-col bg-stone-950 border-r border-stone-800/80 shrink-0">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-stone-800/60 shrink-0">
            <span className="text-xs font-bold text-stone-100 tracking-wide">{panelTitle}</span>
            <button onClick={() => setActivePanel(null)}
              className="p-1 rounded-lg text-stone-600 hover:text-stone-300 hover:bg-stone-800 transition">
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {activePanel === 'modelos' && (
              <ModelosPanel
                savedTemplates={savedTemplates}
                onApplySavedTemplate={onApplySavedTemplate}
                onDeleteSavedTemplate={onDeleteSavedTemplate}
                onRenameSavedTemplate={onRenameSavedTemplate}
                onApplyBuiltinTemplate={onApplyBuiltinTemplate}
              />
            )}
            {activePanel === 'elementos' && (
              <ElementosPanel
                onAddText={onAddText}
                onAddBox={onAddBox}
                onAddProductBox={onAddProductBox}
                onGenGrid={onGenGrid}
                onInsertImageClick={handleInsertImageClick}
              />
            )}
            {activePanel === 'produtos' && (
              <ProdutosPanel onAdd={onAdd} placedIds={placedIds} />
            )}
            {activePanel === 'marca' && (
              <MarcaPanel
                onInsertAsset={onInsertAsset}
                selectedEl={selectedEl}
                onChangeEl={onChangeEl}
                brandLogos={brandLogos}
                onUploadBrandLogo={onUploadBrandLogo}
                onDeleteBrandLogo={onDeleteBrandLogo}
              />
            )}
            {activePanel === 'ia' && (
              <EditorIAPanel onOpenAI={onOpenAI} />
            )}
            {activePanel === 'uploads' && (
              <UploadsPanel
                uploads={uploads}
                onUploadFiles={onUploadFiles}
                onAddUpload={onAddUpload}
                onDeleteUpload={onDeleteUpload}
              />
            )}
            {activePanel === 'projetos' && (
              <ProjetosPanel
                savedProjects={savedProjects}
                docTitle={docTitle}
                onSaveNew={onSaveNewProject}
                onUpdate={onUpdateProject}
                onLoad={onLoadProject}
                onDelete={onDeleteProject}
                onImport={onImportProject}
                onExport={onExportProject}
              />
            )}
          </div>
        </div>
      )}

      {/* Input oculto para inserir imagem do computador (painel Elementos) */}
      <input ref={imgFileRef} type="file" accept="image/*" className="hidden" onChange={onPickImage} />
    </div>
  );
}
