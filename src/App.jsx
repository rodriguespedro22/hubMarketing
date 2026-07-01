import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  EyeOff,
  FileText,
  Home,
  LayoutGrid,
  Layers,
  Menu,
  Moon,
  Sun,
  Tag,
  Play,
  Plus,
  Save,
  Undo2,
  Redo2,
  X,
} from 'lucide-react';
import HomePage from './components/HomePage';
import HubHome from './views/HubHome';
import StudioHome from './views/StudioHome';
import CentralMarcas from './views/CentralMarcas';
import CentralCampanhas from './views/CentralCampanhas';
import CentralApoio from './views/CentralApoio';
import AdminLebes from './views/AdminLebes';
import Error404 from './views/Error404';
import LoginScreen from './views/LoginScreen';
import HubDrawer from './components/hub/HubDrawer';

import CanvasElement from './components/canvas/CanvasElement';
import BackgroundLayer from './components/canvas/BackgroundLayer';
import LeftSidebar from './components/sidebar/LeftSidebar';
import MobileBottomBar from './components/mobile/MobileBottomBar';
import MobileBottomSheet from './components/mobile/MobileBottomSheet';
import ExportModal from './components/modals/ExportModal';
import FormatModal from './components/modals/FormatModal';
import AIGenerateModal from './components/modals/AIGenerateModal';
import ProjectsModal from './components/modals/ProjectsModal';
import SaveTemplateModal from './components/modals/SaveTemplateModal';
import LayersList from './components/panels/LayersList';
import Properties from './components/panels/Properties';
import BackgroundPopover from './components/popovers/BackgroundPopover';
import PresentationMode from './components/preview/PresentationMode';
import { DEFAULT_FORMAT, MARGIN, PAGE_FORMATS } from './constants/pageConfig';
import { backgroundToCss, defaultBackground, normalizeBackground } from './constants/background';
import { buildGrid } from './data/templates';
import { readImageScaled, uid } from './utils/helpers';
import { exportAllPagesAsJpg, exportAllPagesAsPdf } from './utils/pdfExport';
import { Analytics } from "@vercel/analytics/react";

// Páginas iniciais — função de inicialização do useState (executada uma vez).
// Centraliza a criação para que o snapshot inicial do histórico use exatamente
// os mesmos ids de elemento.
function makeInitialPages() {
  return [{ id: 1, background: defaultBackground(), elements: [] }];
}

export default function App() {
  // 'hub' | 'studio' | 'home' | 'editor' | 'marcas' | 'campanhas' | 'apoio'
  const [view, setView] = useState('hub');
  const navHistoryRef = useRef([]);
  const [showDrawer, setShowDrawer] = useState(false);

  // ── Tema do Hub (dark / light) ──────────────────────────────────────
  const [isDark, setIsDark] = useState(() => localStorage.getItem('hubTheme') === 'dark');
  const toggleTheme = useCallback(() => {
    setIsDark(d => {
      const next = !d;
      localStorage.setItem('hubTheme', next ? 'dark' : 'light');
      return next;
    });
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark-hub', isDark);
  }, [isDark]);

  const navigate = (nextView) => {
    navHistoryRef.current.push(view);
    setView(nextView);
  };
  const navBack = () => {
    const prev = navHistoryRef.current.pop();
    setView(prev || 'hub');
  };
  const navHome = () => {
    navHistoryRef.current = [];
    setView('hub');
  };

  // Formato da revista — fixo para todas as páginas, escolhido pelo usuário.
  const [format, setFormat] = useState(DEFAULT_FORMAT);
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);

  const [pages, setPages] = useState(makeInitialPages);

  // ---- histórico de undo/redo (Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y) ----
  // Guardamos snapshots imutáveis do array `pages`. O índice aponta para o
  // estado atual dentro da pilha. Undo recua o índice; redo avança.
  const HISTORY_LIMIT = 100;
  const cloneSnapshot = (ps) => JSON.parse(JSON.stringify(ps));
  const historyRef = useRef(null);
  if (historyRef.current === null) {
    // IMPORTANTE: o snapshot inicial deve ser uma cópia do MESMO `pages`
    // inicial (mesmos ids), senão o primeiro undo restauraria elementos
    // com ids fantasmas e o efeito gravaria um passo espúrio na montagem.
    historyRef.current = { stack: [cloneSnapshot(pages)], index: 0 };
  }
  // Quando true, a próxima mudança de `pages` veio de undo/redo e NÃO deve ser gravada.
  const skipRecordRef = useRef(false);
  // Quando > 0, há uma interação contínua em andamento (drag/resize). Mudanças de
  // `pages` durante esse período não geram snapshots; gravamos um único ao soltar.
  const txnDepthRef = useRef(0);
  const [histVersion, setHistVersion] = useState(0); // força re-render dos botões undo/redo

  const recordHistory = useCallback((ps) => {
    const h = historyRef.current;
    // descarta qualquer "futuro" (redo) ao gravar um novo passo
    const base = h.stack.slice(0, h.index + 1);
    base.push(cloneSnapshot(ps));
    // limita o tamanho da pilha
    while (base.length > HISTORY_LIMIT) base.shift();
    h.stack = base;
    h.index = base.length - 1;
    setHistVersion(v => v + 1);
  }, []);

  // Observa toda mudança em `pages` e grava no histórico, exceto quando:
  //  - a mudança veio de undo/redo (skipRecordRef)
  //  - há uma transação contínua aberta (txnDepthRef > 0)
  const [currentId, setCurrentId] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  // Seleção múltipla (bug 6). selectedIds é a fonte de verdade; selectedId = elemento "primário".
  const [selectedIds, setSelectedIds] = useState([]);
  const [marquee, setMarquee] = useState(null); // { x, y, w, h } em coords da página, durante o arraste
  const [editingId, setEditingId] = useState(null);
  // Popover do editor de fundo (cor/gradiente/imagem).
  const [showBg, setShowBg] = useState(false);

  // Aba ativa do painel direito: 'props' | 'layers' | 'pages'
  const [rightTab, setRightTab] = useState('props');

  // Zoom do canvas (Ctrl+scroll, botões, Ctrl++/−/0)
  const [canvasZoom, setCanvasZoom] = useState(1);
  const zoomBy = (delta) => setCanvasZoom(z => Math.min(2, Math.max(0.25, Math.round((z + delta) * 100) / 100)));
  const zoomTo = (v) => setCanvasZoom(Math.min(2, Math.max(0.25, v)));
  const [pendingZoomScroll, setPendingZoomScroll] = useState(null);

  // Templates do usuário (persistidos em localStorage como "do usuário logado")
  const [savedTemplates, setSavedTemplates] = useState(() => {
    try {
      const raw = localStorage.getItem('lebes:templates:v1');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem('lebes:templates:v1', JSON.stringify(savedTemplates)); } catch {}
  }, [savedTemplates]);
  const [showSaveTpl, setShowSaveTpl] = useState(false);
  const [tplName, setTplName] = useState('');

  // Modal de exportação
  const [showExport, setShowExport] = useState(false);

  // Modal de geração por IA (v0 front-end)
  const [showAI, setShowAI] = useState(false);

  // Projeto: título + rótulos + "Meus projetos" (revistas salvas), persistidos no navegador.
  const [docTitle, setDocTitle] = useState('');
  const [projectLabels, setProjectLabels] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null); // id do projeto aberto no editor, ou null para projeto novo
  const [saveToast, setSaveToast] = useState(false);
  const saveToastTimer = useRef(null);
  const [showLabels, setShowLabels] = useState(false);
  const [labelInput, setLabelInput] = useState('');
  const [showProjects, setShowProjects] = useState(false);
  const [showProjectsOverlay, setShowProjectsOverlay] = useState(false);
  const [savedProjects, setSavedProjects] = useState(() => {
    try {
      const raw = localStorage.getItem('lebes:projects:v1');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem('lebes:projects:v1', JSON.stringify(savedProjects)); }
    catch { alert('Não foi possível salvar o projeto: o armazenamento do navegador está cheio.'); }
  }, [savedProjects]);

  // Visibilidade dos 3 menus (esquerda / topo / direita) + dropdown de controle
  // Em telas pequenas (< 1024px) os sidebars começam fechados para não cobrir o canvas.
  const [panels, setPanels] = useState(() => {
    const mobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    return { left: !mobile, top: true, right: !mobile };
  });

  // Detecção de mobile (< 768px) para layout de barra inferior estilo Canva
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [mobilePanel, setMobilePanel] = useState(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Modo apresentação (preview)
  const [showPreview, setShowPreview] = useState(false);

  // Uploads do usuário (imagens pré-salvas, estilo Canva) — persistidos no navegador.
  const [uploads, setUploads] = useState(() => {
    try {
      const raw = localStorage.getItem('lebes:uploads:v1');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem('lebes:uploads:v1', JSON.stringify(uploads)); }
    catch { alert('Não foi possível salvar os uploads: o armazenamento do navegador está cheio. Remova alguns uploads antigos.'); }
  }, [uploads]);

  // Logotipos personalizados da marca (persistidos em localStorage)
  const [brandLogos, setBrandLogos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lebes:brand-logos:v1') || '[]'); }
    catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem('lebes:brand-logos:v1', JSON.stringify(brandLogos)); } catch {}
  }, [brandLogos]);
  const uploadBrandLogo = async (files) => {
    for (const file of files) {
      try {
        const { src } = await readImageScaled(file);
        setBrandLogos(ls => [{ id: `bl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, name: file.name, src }, ...ls]);
      } catch { alert(`Não foi possível carregar "${file.name}".`); }
    }
  };
  const deleteBrandLogo = (id) => setBrandLogos(ls => ls.filter(l => l.id !== id));

  // Drag de camadas (reordenação na lista)
  const [layerDrag, setLayerDrag] = useState(null);   // { id, overId, position: 'before'|'after' }

  const pageRef = useRef(null);
  const drag = useRef(null);
  const scrollAreaRef = useRef(null);
  const zoomByRef = useRef(null);
  zoomByRef.current = zoomBy;
  const canvasZoomRef = useRef(canvasZoom);
  canvasZoomRef.current = canvasZoom;
  const pageBgBtnRef = useRef(null);

  const page = pages.find(p => p.id === currentId);
  const pageIdx = pages.findIndex(p => p.id === currentId);
  const selectedEl = page.elements.find(e => e.id === selectedId) || null;
  // Conjunto efetivo de ids selecionados (primário + múltiplos).
  const activeIds = selectedIds.length ? selectedIds : (selectedId ? [selectedId] : []);

  // ── Clipboard de formatação de produto ──────────────────────────────
  const [formatClipboard, setFormatClipboard] = useState(null);

  const placedIds = useMemo(() => {
    const s = new Set();
    pages.forEach(p => p.elements.forEach(e => e.type === 'product' && e.productId && s.add(e.productId)));
    return s;
  }, [pages]);

  // ---- element mutations ----
  // Efeito que grava o histórico a cada mudança de `pages`, respeitando os
  // guardas de undo/redo (skipRecordRef) e de interação contínua (txnDepthRef).
  useEffect(() => {
    if (skipRecordRef.current) { skipRecordRef.current = false; return; }
    if (txnDepthRef.current > 0) return; // drag/resize em andamento: agrupa
    const h = historyRef.current;
    const top = h.stack[h.index];
    // evita gravar snapshots idênticos (ex.: cliques que não mudam nada)
    if (top && JSON.stringify(top) === JSON.stringify(pages)) return;
    recordHistory(pages);
  }, [pages, recordHistory]);

  const canUndo = historyRef.current.index > 0;
  const canRedo = historyRef.current.index < historyRef.current.stack.length - 1;

  const restoreSnapshot = (snap) => {
    skipRecordRef.current = true;
    const restored = cloneSnapshot(snap);
    setPages(restored);
    // mantém a página atual se ainda existir; senão cai na primeira
    setCurrentId(cur => restored.some(p => p.id === cur) ? cur : restored[0].id);
    setSelectedId(null);
    setSelectedIds([]);
    setEditingId(null);
  };
  const undo = useCallback(() => {
    const h = historyRef.current;
    if (h.index <= 0) return;
    h.index -= 1;
    restoreSnapshot(h.stack[h.index]);
    setHistVersion(v => v + 1);
  }, []);
  const redo = useCallback(() => {
    const h = historyRef.current;
    if (h.index >= h.stack.length - 1) return;
    h.index += 1;
    restoreSnapshot(h.stack[h.index]);
    setHistVersion(v => v + 1);
  }, []);

  // Abre/fecha uma "transação" para agrupar mutações contínuas (arrastar/redimensionar)
  // num único passo de histórico. As mudanças intermediárias não geram snapshots;
  // ao fechar, gravamos o estado final uma única vez (se algo mudou de fato).
  const beginTxn = useCallback(() => { txnDepthRef.current += 1; }, []);
  const endTxn = useCallback(() => {
    txnDepthRef.current = Math.max(0, txnDepthRef.current - 1);
    if (txnDepthRef.current === 0) {
      // grava o estado final atual (acessamos via setter para pegar o valor mais recente)
      setPages(ps => {
        const h = historyRef.current;
        const top = h.stack[h.index];
        if (!top || JSON.stringify(top) !== JSON.stringify(ps)) recordHistory(ps);
        return ps;
      });
    }
  }, [recordHistory]);

  const updatePage = (patch) => setPages(ps => ps.map(p => p.id === currentId ? { ...p, ...patch } : p));
  const setElements = (fn) => setPages(ps => ps.map(p => p.id === currentId ? { ...p, elements: fn(p.elements) } : p));

  const changeEl = useCallback((id, patch) => {
    setPages(ps => ps.map(p => p.id === currentId
      ? { ...p, elements: p.elements.map(e => e.id === id ? { ...e, ...patch } : e) } : p));
  }, [currentId]);

  const addEl = (el) => { setElements(els => [...els, el]); setSelectedId(el.id); setSelectedIds([el.id]); };
  const deleteEl = (id) => { setElements(els => els.filter(e => e.id !== id)); setSelectedId(null); setSelectedIds([]); };

  // Seleção (bug 6): clique simples seleciona um; com Shift, alterna no conjunto.
  const selectEl = (id, additive = false) => {
    if (additive) {
      setSelectedIds(prev => {
        const base = prev.length ? prev : (selectedId ? [selectedId] : []);
        const next = base.includes(id) ? base.filter(x => x !== id) : [...base, id];
        setSelectedId(next[next.length - 1] ?? null);
        return next;
      });
    } else {
      setSelectedId(id);
      setSelectedIds([id]);
    }
  };
  const clearSelection = () => { setSelectedId(null); setSelectedIds([]); };
  const duplicateEl = (id) => {
    const src = page.elements.find(e => e.id === id); if (!src) return;
    const copy = { ...src, id: uid(), x: src.x + 16, y: src.y + 16 };
    addEl(copy);
  };
  const toggleLock = (id) => changeEl(id, { locked: !page.elements.find(e => e.id === id)?.locked });
  const toggleHidden = (id) => changeEl(id, { hidden: !page.elements.find(e => e.id === id)?.hidden });

  const copyFormat = useCallback(() => {
    if (!selectedEl || selectedEl.type !== 'product') return;
    setFormatClipboard({
      layout:    selectedEl.layout,
      fields:    selectedEl.fields,
      fontSizes: selectedEl.fontSizes,
    });
  }, [selectedEl]);

  const pasteFormat = useCallback(() => {
    if (!formatClipboard) return;
    activeIds.forEach(id => {
      const el = page.elements.find(e => e.id === id);
      if (el?.type === 'product') changeEl(id, formatClipboard);
    });
  }, [formatClipboard, activeIds, page.elements, changeEl]);

  const pasteCount = activeIds.filter(id => page.elements.find(e => e.id === id)?.type === 'product').length;

  const layerOp = (id, op) => setElements(els => {
    const i = els.findIndex(e => e.id === id); if (i < 0) return els;
    const arr = [...els]; const [item] = arr.splice(i, 1);
    if (op === 'front') arr.push(item);
    else if (op === 'back') arr.unshift(item);
    else if (op === 'up') arr.splice(Math.min(i + 1, arr.length), 0, item);
    else if (op === 'down') arr.splice(Math.max(i - 1, 0), 0, item);
    return arr;
  });

  // ---- add tools ----
  const addText = () => addEl({ id: uid(), type: 'text', text: 'Texto editável', x: 60, y: 60, w: 220, h: 56, rotation: 0, opacity: 1, fontSize: 30, color: '#ffffff', weight: 800, align: 'left', font: 'Gantari', hidden: false, locked: false });
  const addBox = () => addEl({ id: uid(), type: 'box', x: 70, y: 70, w: 200, h: 120, rotation: 0, opacity: 1, radius: 12, fill: '#00813A', borderW: 0, hidden: false, locked: false });
  const addProductBox = () => addEl({ id: uid(), type: 'product', productId: null, x: 80, y: 80, w: 150, h: 200, rotation: 0, opacity: 1, radius: 10, fill: '#fff', layout: 'top', fields: { image: true, brand: true, name: true, code: true, price: true }, fontSizes: { brand: 7, name: 11, code: 6, priceScale: 0.85 }, hidden: false, locked: false });

  const insertBrandAsset = (asset) => {
    const ratio = asset.ratio || 1;
    const w = ratio >= 1 ? 200 : Math.round(200 * ratio);
    const h = ratio >= 1 ? Math.round(200 / ratio) : 200;
    addEl({ id: uid(), type: 'image', src: asset.src, x: 100, y: 100, w, h, rotation: 0, opacity: 1, radius: 0, fit: 'contain', hidden: false, locked: false });
  };

  const onPickImage = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        const w = 200, h = Math.round(200 / ratio);
        addEl({ id: uid(), type: 'image', src: ev.target.result, x: 100, y: 100, w, h, rotation: 0, opacity: 1, radius: 0, fit: 'cover', hidden: false, locked: false });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ---- catalog click ----
  const onCatalogAdd = (product) => {
    if (selectedEl && selectedEl.type === 'product') {
      changeEl(selectedEl.id, { productId: product.id });
    } else {
      // fill first empty product slot, else drop a new product box
      const empty = page.elements.find(e => e.type === 'product' && !e.productId);
      if (empty) { changeEl(empty.id, { productId: product.id }); setSelectedId(empty.id); }
      else addEl({ id: uid(), type: 'product', productId: product.id, x: 90, y: 90, w: 150, h: 210, rotation: 0, opacity: 1, radius: 10, fill: '#fff', layout: 'top', fields: { image: true, brand: true, name: true, code: true, price: true }, fontSizes: { brand: 7, name: 11, code: 6, priceScale: 0.85 }, hidden: false, locked: false });
    }
  };

  // ---- uploads do usuário (imagens pré-salvas) ----
  const onUploadFiles = async (files) => {
    for (const file of files) {
      try {
        const { src } = await readImageScaled(file);
        setUploads(us => [{ id: `up_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, name: file.name, src, addedAt: Date.now() }, ...us]);
      } catch {
        alert(`Não foi possível processar a imagem "${file.name}".`);
      }
    }
  };
  const addUploadToCanvas = (u) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height || 1;
      const w = 220, h = Math.round(220 / ratio);
      addEl({ id: uid(), type: 'image', src: u.src, x: 100, y: 100, w, h, rotation: 0, opacity: 1, radius: 0, fit: 'cover', hidden: false, locked: false });
    };
    img.src = u.src;
  };
  const deleteUpload = (id) => setUploads(us => us.filter(u => u.id !== id));

  // ---- grid generation ----
  const genGrid = (cols, rows) => {
    const els = buildGrid(cols, rows, { pageW: format.w, pageH: format.h });
    setElements(prev => [...prev, ...els]);
  };

  // ---- pages ----
  const addPage = () => {
    const id = Math.max(...pages.map(p => p.id)) + 1;
    setPages([...pages, { id, background: defaultBackground(), elements: [] }]);
    setCurrentId(id); setSelectedId(null);
  };
  const deletePage = (id) => {
    if (pages.length <= 1) return;
    const next = pages.filter(p => p.id !== id);
    setPages(next); if (currentId === id) setCurrentId(next[0].id);
  };
  const duplicatePage = () => {
    const cloned = JSON.parse(JSON.stringify(page));
    const id = Math.max(...pages.map(p => p.id)) + 1;
    cloned.id = id;
    cloned.elements = cloned.elements.map(el => ({ ...el, id: uid() }));
    setPages(prev => {
      const idx = prev.findIndex(p => p.id === currentId);
      const next = [...prev];
      next.splice(idx + 1, 0, cloned);
      return next;
    });
    setCurrentId(id);
    setSelectedId(null);
  };
  const applyTemplate = (tpl) => {
    const { background, elements } = tpl.make();
    updatePage({ background: normalizeBackground(background), elements });
    setSelectedId(null);
  };

  // ---- IA: aplica páginas geradas (pergunta acrescentar ou substituir) ----
  const applyGeneratedPages = (genPages) => {
    if (!genPages || !genPages.length) return;
    const substituir = window.confirm(
      `A IA gerou ${genPages.length} página(s).\n\n` +
      'OK = Substituir todas as páginas atuais\n' +
      'Cancelar = Acrescentar ao final do projeto'
    );
    let nextId = Math.max(0, ...pages.map(p => p.id));
    const novas = genPages.map(pg => ({ id: ++nextId, background: normalizeBackground(pg.background), elements: pg.elements }));
    if (substituir) {
      setPages(novas);
      setCurrentId(novas[0].id);
    } else {
      setPages([...pages, ...novas]);
      setCurrentId(novas[0].id);
    }
    setSelectedId(null);
    setSelectedIds([]);
    setShowAI(false);
  };

  // ---- templates do usuário (predefinições salvas) ----
  const saveCurrentAsTemplate = (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    // Reatribui IDs para evitar colisão ao aplicar de volta.
    const cloned = page.elements.map(el => ({ ...el }));
    const tpl = {
      id: `tpl_${Date.now()}`,
      name: trimmed,
      createdAt: new Date().toISOString(),
      background: page.background,
      // Guarda o formato da revista junto da predefinição, para restaurá-lo ao aplicar.
      format: { id: format.id, label: format.label, w: format.w, h: format.h, mm: format.mm },
      elements: cloned,
    };
    setSavedTemplates(ts => [tpl, ...ts]);
    setShowSaveTpl(false);
    setTplName('');
  };
  const applySavedTemplate = (tpl) => {
    // Restaura o formato salvo na predefinição (se houver), trocando o formato global.
    if (tpl.format) {
      const match = PAGE_FORMATS.find(f => f.id === tpl.format.id);
      setFormat(match || tpl.format);
    }
    // Reatribui ids para que duplicar/aplicar a mesma predefinição múltiplas vezes não colida.
    const fresh = tpl.elements.map(el => ({ ...el, id: uid() }));
    updatePage({ background: normalizeBackground(tpl.background), elements: fresh });
    setSelectedId(null);
  };
  const deleteSavedTemplate = (id) => {
    if (!confirm('Excluir esta predefinição?')) return;
    setSavedTemplates(ts => ts.filter(t => t.id !== id));
  };
  const renameSavedTemplate = (id, name) => {
    setSavedTemplates(ts => ts.map(t => t.id === id ? { ...t, name } : t));
  };

  // ---- camadas: reordenação por drag-and-drop na lista ----
  // Move o elemento `srcId` para antes/depois de `dstId`.
  // Lembrando: no array `elements`, o primeiro item está atrás; na UI, mostramos do topo (frente) ao fundo.
  const moveLayer = (srcId, dstId, position) => {
    if (srcId === dstId) return;
    setElements(els => {
      const srcIdx = els.findIndex(e => e.id === srcId);
      const dstIdx = els.findIndex(e => e.id === dstId);
      if (srcIdx < 0 || dstIdx < 0) return els;
      const arr = [...els];
      const [item] = arr.splice(srcIdx, 1);
      // recalcula índice destino após remoção
      let target = arr.findIndex(e => e.id === dstId);
      if (position === 'after') target += 1;   // depois do destino, no array (= mais à frente visualmente, no nosso esquema)
      arr.splice(target, 0, item);
      return arr;
    });
  };

  // ---- formato da revista ----
  const changeFormat = (fmt) => {
    setFormat(fmt);
    setShowFormatModal(false);
  };

  // ---- exportação ----
  const exportEditable = () => {
    // PDF editável = arquivo de projeto (.json) que reabre tudo no editor.
    const project = {
      version: 1,
      kind: 'lebes-editor',
      exportedAt: new Date().toISOString(),
      format: { id: format.id, w: format.w, h: format.h, mm: format.mm, label: format.label },
      pages,
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `editor-lebes-${new Date().toISOString().slice(0,10)}.lebes.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  // ---- projetos (Meus projetos / salvar o projeto) — bug 4 e 5 ----
  // Monta o objeto de projeto a partir do estado atual.
  const buildProjectSnapshot = () => ({
    version: 1,
    kind: 'lebes-editor',
    title: docTitle,
    labels: projectLabels,
    format: { id: format.id, label: format.label, w: format.w, h: format.h, mm: format.mm },
    pages,
  });
  // Salva (ou atualiza, se já existir um projeto com mesmo id) no "Meus projetos".
  const saveProject = (existingId = null) => {
    const snapshot = buildProjectSnapshot();
    const now = Date.now();
    if (existingId) {
      setSavedProjects(ps => ps.map(p => p.id === existingId ? { ...p, ...snapshot, updatedAt: now } : p));
      setCurrentProjectId(existingId);
    } else {
      const id = `prj_${now}`;
      setSavedProjects(ps => [{ id, ...snapshot, createdAt: now, updatedAt: now }, ...ps]);
      setCurrentProjectId(id);
    }
  };

  const showSaveToast = useCallback(() => {
    setSaveToast(true);
    clearTimeout(saveToastTimer.current);
    saveToastTimer.current = setTimeout(() => setSaveToast(false), 3000);
  }, []);

  // Salva o projeto atual: atualiza se já tem ID, cria novo caso contrário.
  const quickSave = useCallback(() => {
    saveProject(currentProjectId);
    showSaveToast();
  }, [currentProjectId, docTitle, projectLabels, format, pages]);
  const loadProject = (prj) => {
    if (prj.format) {
      const match = PAGE_FORMATS.find(f => f.id === prj.format.id);
      setFormat(match || prj.format);
    }
    if (prj.title) setDocTitle(prj.title);
    setProjectLabels(Array.isArray(prj.labels) ? prj.labels : []);
    setCurrentProjectId(prj.id ?? null);
    // Garante ao menos uma página válida e converte fundos legados (string) em objeto.
    const raw = Array.isArray(prj.pages) && prj.pages.length ? prj.pages : [{ id: 1, background: defaultBackground(), elements: [] }];
    const restored = raw.map(p => ({ ...p, background: normalizeBackground(p.background) }));
    setPages(restored);
    setCurrentId(restored[0].id);
    setSelectedId(null);
    setShowProjects(false);
    navigate('editor');
  };
  const deleteProject = (id) => {
    if (!confirm('Excluir este projeto salvo?')) return;
    setSavedProjects(ps => ps.filter(p => p.id !== id));
  };
  // Cria um projeto novo em branco e vai para o editor.
  // formatId: id de PAGE_FORMATS a pré-selecionar; rotulo: rótulo a adicionar automaticamente.
  const newProject = (formatId, rotulo) => {
    const fmt = formatId ? PAGE_FORMATS.find(f => f.id === formatId) || DEFAULT_FORMAT : DEFAULT_FORMAT;
    setFormat(fmt);
    setDocTitle('');
    setProjectLabels(rotulo ? [rotulo] : []);
    setCurrentProjectId(null);
    const initial = makeInitialPages();
    setPages(initial);
    setCurrentId(initial[0].id);
    setSelectedId(null);
    setSelectedIds([]);
    navigate('editor');
  };

  // Importa um arquivo .json de projeto (gerado pelo exportEditable ou "Baixar projeto").
  const importProjectFile = (file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!['lebes-editor', 'lebes-revista'].includes(data.kind) || !Array.isArray(data.pages)) throw new Error('formato inválido');
        loadProject(data);
      } catch {
        alert('Arquivo de projeto inválido. Selecione um .json exportado pelo editor.');
      }
    };
    reader.readAsText(file);
  };

  const [pdfExporting, setPdfExporting] = useState(false);
  const [jpgExporting, setJpgExporting] = useState(false);

  const exportPdf = async () => {
    setPdfExporting(true);
    setShowExport(false);
    try {
      const filename = (docTitle.trim() || 'editor-lebes').replace(/[/\\:*?"<>|]/g, '-');
      await exportAllPagesAsPdf({ pages, format, filename });
    } catch (err) {
      alert(`Erro ao gerar PDF: ${err.message}`);
    } finally {
      setPdfExporting(false);
    }
  };

  const exportJpg = async () => {
    setJpgExporting(true);
    setShowExport(false);
    try {
      const filename = (docTitle.trim() || 'editor-lebes').replace(/[/\\:*?"<>|]/g, '-');
      await exportAllPagesAsJpg({ pages, format, filename });
    } catch (err) {
      alert(`Erro ao gerar JPGs: ${err.message}`);
    } finally {
      setJpgExporting(false);
    }
  };

  const exportPdfStub = (mode) => {
    // Stub para CMYK — ainda requer serviço dedicado com perfil ICC.
    const note =
`# Exportação CMYK (print-ready) — simulação
Em produção, gerado por serviço de backend com perfil ICC CMYK, sangria e marcas de corte.

Formato: ${format.label} (${format.mm[0]} × ${format.mm[1]} mm)
Páginas: ${pages.length}
Exportado em: ${new Date().toLocaleString('pt-BR')}
`;
    const blob = new Blob([note], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `editor-lebes-${mode}-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  // ---- marquee (seleção por arraste em área vazia do canvas) — bug 6 ----
  const marqueeRef = useRef(null);
  const onMarqueeMove = useCallback((e) => {
    const m = marqueeRef.current; if (!m) return;
    const curX = (e.clientX - m.rect.left) * m.sx;
    const curY = (e.clientY - m.rect.top) * m.sy;
    const x = Math.min(m.startX, curX), y = Math.min(m.startY, curY);
    const w = Math.abs(curX - m.startX), h = Math.abs(curY - m.startY);
    if (w > 3 || h > 3) m.moved = true;
    setMarquee({ x, y, w, h });
  }, []);
  const onMarqueeUp = useCallback(() => {
    const m = marqueeRef.current;
    window.removeEventListener('pointermove', onMarqueeMove);
    window.removeEventListener('pointerup', onMarqueeUp);
    setMarquee(box => {
      if (m && m.moved && box) {
        const x2 = box.x + box.w, y2 = box.y + box.h;
        const hits = page.elements.filter(el => !el.hidden &&
          el.x < x2 && el.x + el.w > box.x && el.y < y2 && el.y + el.h > box.y).map(el => el.id);
        if (hits.length) { setSelectedIds(hits); setSelectedId(hits[hits.length - 1]); }
      }
      return null;
    });
    marqueeRef.current = null;
  }, [onMarqueeMove, page]);
  const onCanvasPointerDown = (e) => {
    // Só inicia marquee se o clique foi no fundo da página (não num elemento).
    if (e.target !== pageRef.current) return;
    setEditingId(null);
    const rect = pageRef.current.getBoundingClientRect();
    const sx = format.w / rect.width, sy = format.h / rect.height;
    const startX = (e.clientX - rect.left) * sx;
    const startY = (e.clientY - rect.top) * sy;
    marqueeRef.current = { startX, startY, sx, sy, rect, moved: false };
    if (!e.shiftKey) clearSelection();
    window.addEventListener('pointermove', onMarqueeMove);
    window.addEventListener('pointerup', onMarqueeUp);
  };

  // ---- drag / resize (pointer math in canvas coords) ----
  const toCanvas = (e) => {
    const r = pageRef.current.getBoundingClientRect();
    return { sx: format.w / r.width, sy: format.h / r.height, rect: r };
  };

  const onStartDrag = (e, el) => {
    beginTxn();
    const { sx, sy } = toCanvas(e);
    // Se o elemento arrastado faz parte de uma seleção múltipla, move todos juntos.
    const ids = activeIds.includes(el.id) && activeIds.length > 1 ? activeIds : [el.id];
    const origins = ids.map(id => { const it = page.elements.find(x => x.id === id); return { id, ox: it.x, oy: it.y }; });
    drag.current = { mode: 'move', ids, origins, startX: e.clientX, startY: e.clientY, sx, sy };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };
  const onStartResize = (e, el, handle) => {
    beginTxn();
    setSelectedId(el.id);
    const { sx, sy } = toCanvas(e);
    drag.current = { mode: 'resize', id: el.id, handle, startX: e.clientX, startY: e.clientY, o: { x: el.x, y: el.y, w: el.w, h: el.h }, sx, sy };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };
  const onMove = useCallback((e) => {
    const d = drag.current; if (!d) return;
    const dx = (e.clientX - d.startX) * d.sx;
    const dy = (e.clientY - d.startY) * d.sy;
    if (d.mode === 'move') {
      // Move todos os elementos do grupo de uma vez (uma única atualização de estado).
      const deltas = new Map(d.origins.map(o => [o.id, { x: Math.round(o.ox + dx), y: Math.round(o.oy + dy) }]));
      setPages(ps => ps.map(p => p.id === currentId
        ? { ...p, elements: p.elements.map(el => deltas.has(el.id) ? { ...el, ...deltas.get(el.id) } : el) }
        : p));
    } else {
      let { x, y, w, h } = d.o; const min = 20;
      if (d.handle.includes('e')) w = Math.max(min, d.o.w + dx);
      if (d.handle.includes('s')) h = Math.max(min, d.o.h + dy);
      if (d.handle.includes('w')) { w = Math.max(min, d.o.w - dx); x = d.o.x + (d.o.w - w); }
      if (d.handle.includes('n')) { h = Math.max(min, d.o.h - dy); y = d.o.y + (d.o.h - h); }
      changeEl(d.id, { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) });
    }
  }, [changeEl, currentId]);
  const onUp = useCallback(() => {
    drag.current = null;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    endTxn();
  }, [onMove, endTxn]);

  // keyboard: delete / escape
  useEffect(() => {
    const h = (e) => {
      // Undo/Redo — funciona mesmo durante edição de texto? Não: deixamos o
      // contentEditable lidar com seu próprio undo enquanto edita.
      const meta = e.ctrlKey || e.metaKey;
      if (meta && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        if (editingId) return;
        e.preventDefault(); undo(); return;
      }
      if (meta && ((e.key === 'z' || e.key === 'Z') && e.shiftKey || e.key === 'y' || e.key === 'Y')) {
        if (editingId) return;
        e.preventDefault(); redo(); return;
      }
      if (editingId) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeIds.length) {
        e.preventDefault();
        const ids = new Set(activeIds);
        setElements(els => els.filter(el => !ids.has(el.id)));
        clearSelection();
      }
      if (e.key === 'Escape') { clearSelection(); setEditingId(null); setShowLabels(false); }
      if (meta && e.key === 's') { e.preventDefault(); quickSave(); return; }
      if (meta && (e.key === '=' || e.key === '+')) { e.preventDefault(); zoomBy(0.25); return; }
      if (meta && e.key === '-') { e.preventDefault(); zoomBy(-0.25); return; }
      if (meta && e.key === '0') { e.preventDefault(); zoomTo(1); return; }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [activeIds, editingId, undo, redo, quickSave]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const z_old = canvasZoomRef.current;
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      const z_new = Math.min(2, Math.max(0.25, Math.round((z_old + delta) * 100) / 100));
      if (z_new === z_old) return;

      const scrollEl = scrollAreaRef.current;
      const pageEl = pageRef.current;
      if (scrollEl && pageEl) {
        const containerRect = scrollEl.getBoundingClientRect();
        const pageRect = pageEl.getBoundingClientRect();
        // ponto do canvas (em unidades não escaladas) sob o cursor
        const cx = (e.clientX - pageRect.left) / z_old;
        const cy = (e.clientY - pageRect.top) / z_old;
        // posição do cursor relativa ao scroll container (viewport)
        const mx = e.clientX - containerRect.left;
        const my = e.clientY - containerRect.top;
        setPendingZoomScroll({ cx, cy, mx, my });
      }

      setCanvasZoom(z_new);
    };
    window.addEventListener('wheel', handler, { passive: false });
    return () => window.removeEventListener('wheel', handler);
  }, []);

  // Ajusta scroll após render para manter o ponto do canvas sob o cursor
  useLayoutEffect(() => {
    if (!pendingZoomScroll) return;
    const { cx, cy, mx, my } = pendingZoomScroll;
    const scrollEl = scrollAreaRef.current;
    const pageEl = pageRef.current;
    if (!scrollEl || !pageEl) { setPendingZoomScroll(null); return; }

    const containerRect = scrollEl.getBoundingClientRect();
    const pageRect = pageEl.getBoundingClientRect();

    // posição atual do ponto no viewport após o re-render com novo zoom
    const currentMx = pageRect.left - containerRect.left + cx * canvasZoomRef.current;
    const currentMy = pageRect.top - containerRect.top + cy * canvasZoomRef.current;

    // desloca o scroll para alinhar esse ponto com a posição original do cursor
    scrollEl.scrollLeft += currentMx - mx;
    scrollEl.scrollTop  += currentMy - my;

    setPendingZoomScroll(null);
  }, [pendingZoomScroll]);


  const hubProps = { isDark, onToggleTheme: toggleTheme };

  const drawerEl = (
    <HubDrawer
      open={showDrawer}
      currentView={view}
      onNavigate={navigate}
      onClose={() => setShowDrawer(false)}
      isDark={isDark}
    />
  );

  if (view === 'login') {
    return <LoginScreen onLogin={(role) => navigate(role)} />;
  }

  if (view === 'hub') {
    return (
      <>
        {drawerEl}
        <HubHome
          onNavigate={navigate}
          onMenu={() => setShowDrawer(true)}
          onLogin={() => navigate('login')}
          {...hubProps}
        />
      </>
    );
  }

  if (view === 'studio') {
    return (
      <>
        {drawerEl}
        <StudioHome
          projects={savedProjects}
          onNewProject={newProject}
          onOpenProject={loadProject}
          onDeleteProject={deleteProject}
          onShowAllProjects={() => setShowProjectsOverlay(true)}
          onMenu={() => setShowDrawer(true)}
          onBack={navBack}
          onHome={navHome}
          onNavigate={navigate}
          {...hubProps}
        />
        {showProjectsOverlay && (
          <HomePage
            projects={savedProjects}
            onNewProject={newProject}
            onOpenProject={loadProject}
            onDeleteProject={deleteProject}
            onImportProject={importProjectFile}
            onClose={() => setShowProjectsOverlay(false)}
            isDark={isDark}
          />
        )}
      </>
    );
  }

  if (view === 'marcas') {
    return (
      <>
        {drawerEl}
        <CentralMarcas
          onMenu={() => setShowDrawer(true)}
          onBack={navBack}
          onHome={navHome}
          {...hubProps}
        />
      </>
    );
  }

  if (view === 'campanhas') {
    return (
      <>
        {drawerEl}
        <CentralCampanhas
          onMenu={() => setShowDrawer(true)}
          onBack={navBack}
          onHome={navHome}
          {...hubProps}
        />
      </>
    );
  }

  if (view === 'apoio') {
    return (
      <>
        {drawerEl}
        <CentralApoio
          onMenu={() => setShowDrawer(true)}
          onBack={navBack}
          onHome={navHome}
          {...hubProps}
        />
      </>
    );
  }

  if (view === 'admin') {
    return <AdminLebes onBack={navBack} onHome={navHome} />;
  }

  if (view === '404') {
    return <Error404 code={404} onHome={navHome} />;
  }

  if (view === '403') {
    return <Error404 code={403} onHome={navHome} />;
  }

  if (view === 'home') {
    return (
      <>
        {drawerEl}
        <HomePage
          projects={savedProjects}
          onNewProject={newProject}
          onOpenProject={loadProject}
          onDeleteProject={deleteProject}
          onImportProject={importProjectFile}
        />
      </>
    );
  }

  return (
    <div
      className={`w-full h-screen flex flex-col overflow-hidden select-none ${isDark ? '' : 'editor-light'}`}
      style={{ fontFamily: 'Gantari,system-ui,sans-serif', background: isDark ? 'radial-gradient(ellipse at top,#1c1917 0%,#0c0a09 100%)' : '#eeede8' }}
    >

      {/* TOP BAR */}
      <header className={`relative z-50 shrink-0 border-b px-3 sm:px-4 py-2 flex items-center justify-between gap-2 ${
        isDark ? 'border-stone-800 bg-stone-950/60 backdrop-blur' : 'border-[#ecece7] bg-white'
      }`}>

        {/* LEFT: hamburger, logo, Voltar, Início, chip do projeto */}
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={() => setPanels(p => ({ ...p, left: !p.left }))}
            title="Menu lateral"
            className={`hidden md:block p-1.5 rounded-md shrink-0 transition ${isDark ? 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60' : 'text-[#606060] hover:bg-[#f0efe9]'}`}
          >
            <Menu size={16} />
          </button>

          <div className="w-7 h-7 rounded-lg bg-[#5CA847] shrink-0 flex items-center justify-center">
            <span className="text-white text-[10px] font-black leading-none select-none">L</span>
          </div>

          <button
            onClick={navBack}
            className={`flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-full border transition shrink-0 ${
              isDark
                ? 'bg-stone-900/60 border-stone-700/50 text-stone-300 hover:text-stone-100 hover:border-stone-600'
                : 'bg-white border-[#e5e5e0] text-[#606060] hover:bg-[#f4f4f0]'
            }`}
          >
            <ArrowLeft size={13} /><span className="hidden sm:inline">Voltar</span>
          </button>

          <button
            onClick={navHome}
            className={`hidden sm:flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-full border transition shrink-0 ${
              isDark
                ? 'bg-stone-900/60 border-stone-700/50 text-stone-300 hover:text-stone-100 hover:border-stone-600'
                : 'bg-white border-[#e5e5e0] text-[#606060] hover:bg-[#f4f4f0]'
            }`}
          >
            <Home size={13} /> Início
          </button>

          {/* Chip: título do projeto + dimensões */}
          <div className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 min-w-0 ${
            isDark ? 'bg-stone-900/60 border border-stone-700/50' : 'bg-[#f4f4f0]'
          }`}>
            <input
              value={docTitle}
              onChange={e => setDocTitle(e.target.value)}
              placeholder="Sem título"
              className={`text-[12.5px] font-medium bg-transparent outline-none min-w-0 ${
                isDark ? 'text-stone-100 placeholder-stone-600' : 'text-[#2e2e2e] placeholder-stone-400'
              }`}
              style={{ width: Math.max(60, Math.min(180, (docTitle || '').length * 8 + 20)) }}
            />
            <span className={`text-[11px] shrink-0 whitespace-nowrap ${isDark ? 'text-stone-500' : 'text-[#bbb]'}`}>
              · {format.mm[0]}×{format.mm[1]}mm
            </span>
          </div>
        </div>

        {/* RIGHT: undo/redo, formato, rótulos, preview, salvar, exportar, tema */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <div className="flex items-center gap-0.5 sm:mr-1">
            <button onClick={undo} disabled={!canUndo} title="Desfazer (Ctrl+Z)"
              className={`p-1.5 rounded-md disabled:opacity-25 transition ${isDark ? 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60 disabled:hover:bg-transparent disabled:hover:text-stone-400' : 'text-[#606060] hover:bg-[#f0efe9] disabled:hover:bg-transparent'}`}>
              <Undo2 size={15} />
            </button>
            <button onClick={redo} disabled={!canRedo} title="Refazer (Ctrl+Shift+Z / Ctrl+Y)"
              className={`p-1.5 rounded-md disabled:opacity-25 transition ${isDark ? 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60 disabled:hover:bg-transparent disabled:hover:text-stone-400' : 'text-[#606060] hover:bg-[#f0efe9] disabled:hover:bg-transparent'}`}>
              <Redo2 size={15} />
            </button>
          </div>

          {/* Format picker */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowFormatPicker(v => !v)}
              title="Formato do projeto"
              className={`flex items-center gap-1.5 text-[11px] rounded-md border px-2.5 py-1.5 transition shrink-0 ${
                isDark
                  ? 'text-stone-300 bg-stone-900/60 border-stone-700/50 hover:border-stone-600'
                  : 'text-[#606060] bg-white border-[#e5e5e0] hover:bg-[#f4f4f0]'
              }`}
            >
              <FileText size={12} />
              <span className="font-mono">{format.label}</span>
            </button>
            {showFormatPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFormatPicker(false)} />
                <div
                  className={`absolute top-full right-0 mt-1 z-50 rounded-xl shadow-xl border overflow-hidden min-w-[200px] ${
                    isDark ? 'bg-stone-900 border-stone-700' : 'bg-white border-[#e8e7e2]'
                  }`}
                  onMouseDown={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => { changeFormat(PAGE_FORMATS.find(f => f.id === 'square')); setShowFormatPicker(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${isDark ? 'hover:bg-stone-800 text-stone-200' : 'hover:bg-[#f7f6f2] text-[#2e2e2e]'}`}
                  >
                    <LayoutGrid size={16} className="text-[#5CA847] shrink-0" />
                    <div>
                      <div className="text-[13px] font-semibold">Cards</div>
                      <div className={`text-[11px] ${isDark ? 'text-stone-500' : 'text-[#aaa]'}`}>Posts e redes sociais</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { changeFormat(PAGE_FORMATS.find(f => f.id === 'lebes')); setShowFormatPicker(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${isDark ? 'hover:bg-stone-800 text-stone-200' : 'hover:bg-[#f7f6f2] text-[#2e2e2e]'}`}
                  >
                    <BookOpen size={16} className="text-[#E0913A] shrink-0" />
                    <div>
                      <div className="text-[13px] font-semibold">Revista</div>
                      <div className={`text-[11px] ${isDark ? 'text-stone-500' : 'text-[#aaa]'}`}>Catálogo multipágina</div>
                    </div>
                  </button>
                  <button
                    disabled
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left opacity-40 cursor-not-allowed ${isDark ? 'text-stone-400' : 'text-[#606060]'}`}
                  >
                    <Tag size={16} className="text-stone-400 shrink-0" />
                    <div>
                      <div className="text-[13px] font-semibold">PDV - Cartazes</div>
                      <div className={`text-[11px] ${isDark ? 'text-stone-600' : 'text-[#ccc]'}`}>Em breve</div>
                    </div>
                  </button>
                  <div className={`mx-4 border-t ${isDark ? 'border-stone-700' : 'border-[#f0efe9]'}`} />
                  <button
                    onClick={() => { setShowFormatPicker(false); setShowFormatModal(true); }}
                    className={`w-full px-4 py-2.5 text-left text-[12px] transition ${isDark ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-[#f7f6f2] text-[#888]'}`}
                  >
                    Personalizado...
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Rótulos do projeto */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => { setShowLabels(v => !v); setLabelInput(''); }}
              title="Rótulos do projeto"
              className={`flex items-center gap-1.5 text-[11px] rounded-md border px-2.5 py-1.5 transition shrink-0 ${
                projectLabels.length > 0
                  ? isDark
                    ? 'text-emerald-300 border-emerald-700/60 bg-stone-900/60'
                    : 'text-emerald-700 border-emerald-400/60 bg-emerald-50'
                  : isDark
                    ? 'text-stone-400 bg-stone-900/60 border-stone-700/50 hover:text-emerald-300 hover:border-emerald-700/60'
                    : 'text-[#606060] bg-white border-[#e5e5e0] hover:bg-[#f4f4f0]'
              }`}
            >
              <Tag size={12} />
              <span className="hidden lg:inline">{projectLabels.length > 0 ? projectLabels.join(', ') : 'Rótulos'}</span>
              {projectLabels.length > 0 && <span className="lg:hidden">{projectLabels.length}</span>}
            </button>
            {showLabels && (
              <div
                className={`absolute top-full left-0 mt-1 z-50 rounded-lg shadow-xl p-3 w-64 border ${
                  isDark ? 'bg-stone-900 border-stone-700' : 'bg-white border-[#e8e7e2]'
                }`}
                onMouseDown={e => e.stopPropagation()}
              >
                <p className={`text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-stone-500' : 'text-[#aaa]'}`}>Rótulos do projeto</p>
                <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
                  {projectLabels.map(lbl => (
                    <span key={lbl} className={`flex items-center gap-1 border text-[11px] px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-emerald-900/50 border-emerald-700/50 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    }`}>
                      {lbl}
                      <button onClick={() => setProjectLabels(ls => ls.filter(l => l !== lbl))}
                        className={`hover:text-white transition leading-none ${isDark ? 'text-emerald-500' : 'text-emerald-400'}`}>×</button>
                    </span>
                  ))}
                  {projectLabels.length === 0 && <span className={`text-[11px] italic ${isDark ? 'text-stone-600' : 'text-[#ccc]'}`}>Sem rótulos</span>}
                </div>
                <div className="flex gap-1">
                  <input
                    value={labelInput}
                    onChange={e => setLabelInput(e.target.value)}
                    onKeyDown={e => {
                      if ((e.key === 'Enter' || e.key === ',') && labelInput.trim()) {
                        e.preventDefault();
                        const novo = labelInput.trim().replace(/,/g, '');
                        if (novo && !projectLabels.includes(novo)) setProjectLabels(ls => [...ls, novo]);
                        setLabelInput('');
                      }
                    }}
                    placeholder="Novo rótulo + Enter"
                    className={`flex-1 rounded-md px-2 py-1 text-xs focus:outline-none ${
                      isDark
                        ? 'bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-600 focus:border-emerald-600/60'
                        : 'bg-[#f4f4f0] border border-[#e0e0dc] text-[#2e2e2e] placeholder-stone-400 focus:border-[#5CA847]/60'
                    }`}
                  />
                  <button
                    onClick={() => {
                      const novo = labelInput.trim().replace(/,/g, '');
                      if (novo && !projectLabels.includes(novo)) setProjectLabels(ls => [...ls, novo]);
                      setLabelInput('');
                    }}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-1 rounded-md text-xs transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setShowPreview(true)}
            className={`px-2 sm:px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition ${isDark ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60' : 'text-[#606060] hover:bg-[#f0efe9]'}`}
            title="Preview">
            <Play size={13} /><span className="hidden md:inline">Preview</span>
          </button>
          <button onClick={quickSave}
            title={currentProjectId ? 'Salvar projeto (Ctrl+S)' : 'Salvar como novo projeto'}
            className={`px-2 sm:px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition ${isDark ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60' : 'text-[#606060] hover:bg-[#f0efe9]'}`}>
            <Save size={13} /><span className="hidden md:inline">Salvar</span>
          </button>
          <button onClick={() => setShowExport(true)}
            title="Exportar"
            className="bg-[#5CA847] hover:bg-[#4a9739] text-white px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1.5 font-semibold transition">
            <Download size={13} /><span className="hidden sm:inline">Exportar</span>
          </button>
          <button onClick={() => setPanels(p => ({ ...p, right: !p.right }))}
            title={panels.right ? 'Ocultar painel' : 'Mostrar painel'}
            className={`hidden md:block p-1.5 rounded-md transition ${isDark ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60' : 'text-[#606060] hover:bg-[#f0efe9]'}`}>
            <Layers size={15} />
          </button>
          <button onClick={toggleTheme}
            title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            className={`hidden sm:block p-1.5 rounded-md transition ${isDark ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60' : 'text-[#606060] hover:bg-[#f0efe9]'}`}>
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>


      {/* BODY */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Backdrop: cobre o canvas quando um sidebar está aberto no tablet/desktop */}
        {!isMobile && (panels.left || panels.right) && (
          <div className="absolute inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setPanels(p => ({ ...p, left: false, right: false }))} />
        )}

        {!isMobile && panels.left && (
          <div className="absolute top-0 left-0 bottom-0 z-40 overflow-hidden lg:contents">
            <LeftSidebar
              onAdd={onCatalogAdd}
              placedIds={placedIds}
              uploads={uploads}
              onUploadFiles={onUploadFiles}
              onAddUpload={addUploadToCanvas}
              onDeleteUpload={deleteUpload}
              onAddText={addText}
              onAddBox={addBox}
              onAddProductBox={addProductBox}
              onGenGrid={genGrid}
              onPickImage={onPickImage}
              savedTemplates={savedTemplates}
              onApplySavedTemplate={applySavedTemplate}
              onDeleteSavedTemplate={deleteSavedTemplate}
              onRenameSavedTemplate={renameSavedTemplate}
              onApplyBuiltinTemplate={applyTemplate}
              savedProjects={savedProjects}
              docTitle={docTitle}
              onSaveNewProject={() => saveProject()}
              onUpdateProject={(id) => saveProject(id)}
              onLoadProject={loadProject}
              onDeleteProject={deleteProject}
              onImportProject={importProjectFile}
              onExportProject={exportEditable}
              onOpenAI={() => setShowAI(true)}
              onInsertAsset={insertBrandAsset}
              selectedEl={selectedEl}
              onChangeEl={changeEl}
              brandLogos={brandLogos}
              onUploadBrandLogo={uploadBrandLogo}
              onDeleteBrandLogo={deleteBrandLogo}
            />
          </div>
        )}

        {/* CENTER CANVAS */}
        <main className={`flex-1 flex flex-col min-w-0 relative ${isDark ? 'bg-stone-900/30' : 'bg-[#eeede8]'}`}>

          <div ref={scrollAreaRef} className={`flex-1 overflow-auto flex flex-col items-center px-6 pt-5 gap-5 ${isMobile ? 'pb-32' : 'pb-20'}`}>

            {/* Pill: navegação de páginas + zoom */}
            <div className={`flex items-center gap-1 rounded-2xl px-3 py-1.5 shrink-0 text-[11px] border shadow ${
              isDark
                ? 'bg-stone-900/95 border-stone-700/60 text-stone-300'
                : 'bg-white border-[#e5e4df] text-[#606060]'
            }`}>
              <button
                onClick={() => pageIdx > 0 && (setCurrentId(pages[pageIdx - 1].id), setSelectedId(null))}
                disabled={pageIdx === 0}
                className="p-1 disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <span className={`font-semibold px-1 ${isDark ? 'text-stone-200' : 'text-[#2e2e2e]'}`}>
                Página {pageIdx + 1} / {pages.length}
              </span>
              <button
                onClick={() => pageIdx < pages.length - 1 && (setCurrentId(pages[pageIdx + 1].id), setSelectedId(null))}
                disabled={pageIdx === pages.length - 1}
                className="p-1 disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
              <div className={`w-px h-4 mx-1 ${isDark ? 'bg-stone-700' : 'bg-[#e0dfd9]'}`} />
              <button onClick={() => zoomBy(-0.25)} disabled={canvasZoom <= 0.25}
                className="p-1 disabled:opacity-30 font-mono text-[14px] font-bold leading-none" title="Reduzir zoom (Ctrl+−)">
                −
              </button>
              <button onClick={() => zoomTo(1)} title="Redefinir zoom (Ctrl+0)"
                className={`font-mono min-w-[3.5rem] text-center py-0.5 px-1 rounded text-[11px] transition ${isDark ? 'hover:bg-stone-800/60' : 'hover:bg-[#f0efe9]'}`}>
                {Math.round(canvasZoom * 100)}%
              </button>
              <button onClick={() => zoomBy(0.25)} disabled={canvasZoom >= 2}
                className="p-1 disabled:opacity-30 font-mono text-[14px] font-bold leading-none" title="Aumentar zoom (Ctrl++)">
                +
              </button>
            </div>
            {/* spacer com dimensões reais para o scroll funcionar corretamente */}
            <div style={{ width: format.w * canvasZoom, height: format.h * canvasZoom, position: 'relative', flexShrink: 0 }}>
              <div style={{ transform: `scale(${canvasZoom})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
            <div className="relative">
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black/40 blur-md" />
              <div
                ref={pageRef}
                onPointerDown={onCanvasPointerDown}
                className="relative bg-white shadow-2xl overflow-hidden"
                style={{ width: format.w, height: format.h }}
              >
                {/* camada de fundo (cor / gradiente / imagem + opacidade) */}
                <BackgroundLayer background={page.background} />
                {/* margin guide */}
                <div className="absolute pointer-events-none border border-dashed border-black/10" style={{ inset: MARGIN }} />

                {page.elements.map(el => (
                  <CanvasElement
                    key={el.id} el={el}
                    selected={activeIds.includes(el.id)}
                    primary={selectedId === el.id}
                    editing={editingId === el.id}
                    onSelect={selectEl}
                    onChange={changeEl}
                    onStartDrag={onStartDrag}
                    onStartResize={onStartResize}
                    onStartEditText={(id) => { selectEl(id); setEditingId(id); }}
                    onCommitText={(id, text) => { changeEl(id, { text }); setEditingId(null); }}
                  />
                ))}

                {/* retângulo de seleção (marquee) */}
                {marquee && (
                  <div className="absolute pointer-events-none border border-emerald-500 bg-emerald-500/10"
                    style={{ left: marquee.x, top: marquee.y, width: marquee.w, height: marquee.h }} />
                )}
              </div>
            </div>
              </div>{/* fecha scale wrapper */}
            </div>{/* fecha spacer */}
          </div>

          {/* Barra flutuante de página — aparece quando nenhum elemento está selecionado */}
          {!selectedId && !selectedIds.length && (
            <div className={`absolute ${isMobile ? 'bottom-20' : 'bottom-6'} left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-2xl shadow-2xl px-3 py-2 backdrop-blur pointer-events-auto border ${
              isDark ? 'bg-stone-900/95 border-stone-700/60' : 'bg-white/90 border-[#e0dfd9]'
            }`}>
              <div className="relative">
                <button ref={pageBgBtnRef} onClick={() => setShowBg(v => !v)} title="Editar fundo da página"
                  className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border transition ${showBg ? 'bg-emerald-700/20 border-emerald-600/60 text-emerald-200' : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:text-emerald-300 hover:border-emerald-700/60'}`}>
                  <span className="w-4 h-4 rounded border border-stone-600 shrink-0" style={{ background: backgroundToCss(page.background) }} />
                  Fundo
                </button>
                {showBg && (
                  <BackgroundPopover
                    background={page.background}
                    onChange={(bg) => updatePage({ background: bg })}
                    onClose={() => setShowBg(false)}
                    uploads={uploads}
                    onUploadFiles={onUploadFiles}
                    anchorRef={pageBgBtnRef}
                  />
                )}
              </div>
              <div className="h-5 w-px bg-stone-700" />
              <button onClick={duplicatePage} title="Duplicar esta página"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-stone-800/60 border border-stone-700 text-stone-300 hover:text-stone-100 hover:border-stone-500 transition">
                <Copy size={13} /> Duplicar página
              </button>
            </div>
          )}
        </main>

        {/* RIGHT: PROPERTIES + LAYERS + PAGES — com abas */}
        {!isMobile && panels.right && (
        <div className="absolute top-0 right-0 bottom-0 z-40 w-72 overflow-hidden lg:contents">
        <aside className={`w-72 shrink-0 border-l flex flex-col h-full ${
          isDark ? 'border-stone-800 bg-stone-950 lg:bg-stone-950/40' : 'border-[#ecece7] bg-white'
        }`}>

          {/* Tab bar */}
          <div className={`shrink-0 flex border-b ${isDark ? 'border-stone-800' : 'border-[#ecece7]'}`}>
            {[
              { id: 'props',  label: 'Propriedades' },
              { id: 'layers', label: 'Camadas' },
              { id: 'pages',  label: 'Páginas' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRightTab(tab.id)}
                className={`flex-1 text-[11px] font-medium py-2.5 transition border-b-2 ${
                  rightTab === tab.id
                    ? isDark
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-emerald-600 text-emerald-700'
                    : isDark
                      ? 'border-transparent text-stone-500 hover:text-stone-300'
                      : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button onClick={() => setPanels(p => ({ ...p, right: false }))} title="Ocultar painel"
              className={`px-2 py-2.5 transition ${isDark ? 'text-stone-600 hover:text-stone-300' : 'text-stone-300 hover:text-stone-500'}`}>
              <EyeOff size={13} />
            </button>
          </div>

          {/* Aba: Propriedades */}
          {rightTab === 'props' && (
            <div className="flex-1 overflow-y-auto min-h-0">
              {selectedEl
                ? <Properties el={selectedEl} onChange={changeEl} onLayer={layerOp} onDelete={deleteEl} onDuplicate={duplicateEl} onToggleLock={toggleLock} onCopyFormat={copyFormat} onPasteFormat={pasteFormat} hasFormatClipboard={!!formatClipboard} pasteCount={pasteCount} />
                : (
                  <div className={`flex flex-col items-center justify-center h-40 gap-1 ${isDark ? 'text-stone-600' : 'text-stone-400'}`}>
                    <p className="text-[12px]">Selecione um elemento</p>
                  </div>
                )
              }
            </div>
          )}

          {/* Aba: Camadas */}
          {rightTab === 'layers' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className={`px-3 py-2 flex items-center justify-between border-b ${isDark ? 'border-stone-800/60' : 'border-[#ecece7]'}`}>
                <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  <Layers size={12} /> {page.elements.length} {page.elements.length === 1 ? 'elemento' : 'elementos'}
                </span>
              </div>
              <LayersList elements={page.elements} selectedId={selectedId} activeIds={activeIds} onSelect={selectEl} onToggleHidden={toggleHidden} onMoveLayer={moveLayer} />
            </div>
          )}

          {/* Aba: Páginas */}
          {rightTab === 'pages' && (
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              <div className={`px-3 py-2 flex items-center justify-between border-b shrink-0 ${isDark ? 'border-stone-800/60' : 'border-[#ecece7]'}`}>
                <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {pages.length} {pages.length === 1 ? 'página' : 'páginas'}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowSaveTpl(true)} title="Salvar página atual como predefinição"
                    className={`flex items-center gap-1 text-[10px] transition ${isDark ? 'text-stone-500 hover:text-emerald-300' : 'text-stone-400 hover:text-emerald-600'}`}>
                    <Bookmark size={11} /> Salvar predefinição
                  </button>
                  <button onClick={addPage} className={`flex items-center gap-1 text-[10px] transition ${isDark ? 'text-stone-400 hover:text-emerald-300' : 'text-stone-400 hover:text-emerald-600'}`}>
                    <Plus size={12} /> Nova
                  </button>
                </div>
              </div>
              <div className="p-3 grid grid-cols-3 gap-2">
                {pages.map((p, i) => (
                  <div key={p.id} onClick={() => { setCurrentId(p.id); setSelectedId(null); }}
                    className={`group relative cursor-pointer rounded border-2 ${p.id === currentId ? 'border-emerald-500' : isDark ? 'border-stone-700 hover:border-stone-500' : 'border-[#e0dfd9] hover:border-stone-400'}`}>
                    <div className="w-full aspect-[3/4] rounded-sm flex items-end justify-center pb-1 text-[8px] font-mono"
                      style={{ background: backgroundToCss(p.background), color: 'rgba(0,0,0,0.4)' }}>
                      {i + 1}
                    </div>
                    {pages.length > 1 && (
                      <button onClick={(e) => { e.stopPropagation(); deletePage(p.id); }}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-900 text-stone-400 opacity-0 group-hover:opacity-100 hover:text-rose-400 flex items-center justify-center"><X size={10} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </aside>
        </div>
        )}
      </div>

      {/* MODAIS */}
      {showFormatModal && (
        <FormatModal current={format} onChange={changeFormat} onClose={() => setShowFormatModal(false)} />
      )}
      {showSaveTpl && (
        <SaveTemplateModal
          name={tplName} setName={setTplName}
          onSave={saveCurrentAsTemplate}
          onClose={() => { setShowSaveTpl(false); setTplName(''); }}
          page={page} format={format} />
      )}
      {showProjects && (
        <ProjectsModal
          onClose={() => setShowProjects(false)}
          title={docTitle}
          projects={savedProjects}
          onSaveNew={() => saveProject(null)}
          onUpdate={(id) => saveProject(id)}
          onLoad={loadProject}
          onDelete={deleteProject}
          onImport={importProjectFile}
          onExport={exportEditable}
        />
      )}
      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          onPdf={exportPdf}
          onJpg={exportJpg}
          onCmyk={() => exportPdfStub('cmyk')}
          onEditable={exportEditable}
          format={format} pages={pages}
          exporting={pdfExporting} exportingJpg={jpgExporting} />
      )}
      {showPreview && (
        <PresentationMode
          pages={pages} format={format}
          startIndex={pageIdx}
          onClose={() => setShowPreview(false)} />
      )}
      {showAI && (
        <AIGenerateModal
          format={format}
          savedTemplates={savedTemplates}
          onApply={applyGeneratedPages}
          onClose={() => setShowAI(false)} />
      )}

      {/* MOBILE: barra de navegação inferior + bottom sheet (estilo Canva) */}
      {isMobile && (
        <>
          <MobileBottomBar
            activePanel={mobilePanel}
            onSelect={(id) => setMobilePanel(p => p === id ? null : id)}
            isDark={isDark}
            hasSelection={!!selectedEl}
          />
          <MobileBottomSheet
            open={mobilePanel !== null}
            onClose={() => setMobilePanel(null)}
            isDark={isDark}
          >
            {mobilePanel !== null && (mobilePanel === '__props' ? (
              <div className="flex-1 overflow-y-auto min-h-0">
                {selectedEl
                  ? <Properties el={selectedEl} onChange={changeEl} onLayer={layerOp} onDelete={deleteEl} onDuplicate={duplicateEl} onToggleLock={toggleLock} onCopyFormat={copyFormat} onPasteFormat={pasteFormat} hasFormatClipboard={!!formatClipboard} pasteCount={pasteCount} />
                  : <div className="flex items-center justify-center h-40 text-stone-500 text-sm">Selecione um elemento</div>
                }
              </div>
            ) : (
              <LeftSidebar
                sheetPanel={mobilePanel}
                onAdd={onCatalogAdd}
                placedIds={placedIds}
                uploads={uploads}
                onUploadFiles={onUploadFiles}
                onAddUpload={addUploadToCanvas}
                onDeleteUpload={deleteUpload}
                onAddText={addText}
                onAddBox={addBox}
                onAddProductBox={addProductBox}
                onGenGrid={genGrid}
                onPickImage={onPickImage}
                savedTemplates={savedTemplates}
                onApplySavedTemplate={applySavedTemplate}
                onDeleteSavedTemplate={deleteSavedTemplate}
                onRenameSavedTemplate={renameSavedTemplate}
                onApplyBuiltinTemplate={applyTemplate}
                savedProjects={savedProjects}
                docTitle={docTitle}
                onSaveNewProject={() => saveProject()}
                onUpdateProject={(id) => saveProject(id)}
                onLoadProject={loadProject}
                onDeleteProject={deleteProject}
                onImportProject={importProjectFile}
                onExportProject={exportEditable}
                onOpenAI={() => setShowAI(true)}
                onInsertAsset={insertBrandAsset}
                selectedEl={selectedEl}
                onChangeEl={changeEl}
                brandLogos={brandLogos}
                onUploadBrandLogo={uploadBrandLogo}
                onDeleteBrandLogo={deleteBrandLogo}
              />
            ))}
          </MobileBottomSheet>
        </>
      )}

      {/* Toast de salvamento */}
      <div className={`fixed ${isMobile ? 'bottom-20' : 'bottom-5'} right-5 z-[9999] transition-all duration-300 ${saveToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <div className="flex items-center gap-3 bg-stone-800 border border-stone-700 text-stone-100 text-xs px-4 py-3 rounded-xl shadow-xl">
          <Save size={14} className="text-emerald-400 shrink-0" />
          <span>Projeto salvo com sucesso.</span>
          <button onClick={() => { setSaveToast(false); clearTimeout(saveToastTimer.current); }}
            className="ml-1 text-stone-500 hover:text-stone-200 transition">
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
