// ============================================================
// AI GENERATOR — motor de geração de páginas (v0, 100% front-end)
// ------------------------------------------------------------
// Interpreta uma descrição em português e monta UMA OU MAIS
// páginas no "padrão Lebes" (tamanhos, paleta, fonte Gantari,
// logo no topo, margens de segurança).
//
// Não depende de rede, chave de API nem Gemini. O ponto de
// entrada é generateMagazine({ prompt, format, products }):
// quando o proxy/Gemini existir, basta criar um adapter com a
// MESMA assinatura e trocar a importação na UI — o restante do
// app continua igual, pois a saída segil o schema do editor.
//
// SCHEMA DE SAÍDA:
//   { pages: [ { background, kind, elements: [...] } ] }
// Cada elemento já vem no formato que o editor entende; o App
// injeta id/rotation/opacity/hidden/locked ao aplicar.
// ============================================================

import { COLORS, MARGIN } from '../constants/pageConfig';
import { LOGO_LEBES } from '../data/brandAssets';
import { PRODUCTS } from '../data/products';

// Presets de fundo (string-chave compatível com o sistema atual).
const BG_KEYWORDS = [
  { re: /\b(rosa|pink|magenta)\b/i, bg: 'pink' },
  { re: /\b(verde|green)\b/i, bg: 'green' },
  { re: /\b(branco|branca|white)\b/i, bg: 'white' },
  { re: /\b(creme|bege|cream)\b/i, bg: 'cream' },
];

// Cor de texto que contrasta com cada fundo.
const TEXT_ON_BG = { pink: '#ffffff', green: '#ffffff', white: COLORS.pinkSolid, cream: COLORS.green };

// ---- utilitários de parsing -------------------------------

function detectBackground(text, fallback = 'pink') {
  for (const k of BG_KEYWORDS) if (k.re.test(text)) return k.bg;
  return fallback;
}

function detectSector(text) {
  if (/\b(eletro|eletrom[óo]veis|eletrod|tv|geladeira|m[óo]vel|m[óo]veis|sof[áa]|lavadora|celular)\b/i.test(text)) return 'eletro';
  if (/\b(moda|roupa|roupas|vestu[áa]rio|bolsa|jaqueta|cal[çc]a|rel[óo]gio)\b/i.test(text)) return 'moda';
  return null;
}

// Reconhece "grade 3x2", "3 x 2", "3 colunas 2 linhas", "3 colunas e 5 linhas".
function detectGrid(text) {
  let m = text.match(/(\d+)\s*[x×]\s*(\d+)/i);
  if (m) return { cols: +m[1], rows: +m[2] };
  m = text.match(/(\d+)\s*colunas?.*?(\d+)\s*linhas?/i);
  if (m) return { cols: +m[1], rows: +m[2] };
  m = text.match(/(\d+)\s*linhas?.*?(\d+)\s*colunas?/i);
  if (m) return { rows: +m[1], cols: +m[2] };
  return null;
}

// Reconhece "6 produtos", "com 8 itens".
function detectCount(text) {
  const m = text.match(/(\d+)\s*(produtos?|itens?|ofertas?)/i);
  return m ? +m[1] : null;
}

// Extrai textos entre aspas: "OFERTAS", 'Dia das Mães', “smart quotes”.
function extractQuoted(text) {
  const out = [];
  const re = /["“'']([^"”'']{2,60})["”'']/g;
  let m;
  while ((m = re.exec(text))) out.push(m[1].trim());
  return out;
}

function detectCover(text) {
  return /\b(capa|banner|frontal|abertura|portada)\b/i.test(text);
}

function wantsLogo(text) {
  return /\b(logo|marca|logotipo)\b/i.test(text) || detectCover(text);
}

// Escolhe N produtos reais do catálogo, filtrando por setor quando houver.
// Evita repetir até esgotar o pool.
function pickProducts(sector, n, pool) {
  const src = sector ? pool.filter(p => p.sector === sector) : pool;
  const list = src.length ? src : pool;
  const ids = [];
  for (let i = 0; i < n; i++) ids.push(list[i % list.length].id);
  return ids;
}

// ---- builders de elementos --------------------------------

function txt(text, x, y, w, h, { size = 30, color = '#fff', weight = 800, align = 'left' } = {}) {
  return { type: 'text', text, x, y, w, h, fontSize: size, color, weight, align, font: 'Gantari' };
}

function logoEl(format) {
  const w = 120, h = 40;
  return { type: 'image', src: LOGO_LEBES, x: Math.round((format.w - w) / 2), y: 26, w, h, fit: 'contain', radius: 0 };
}

// Grade de slots de produto, respeitando MARGIN e a área útil da página.
function productGrid(cols, rows, productIds, format, topY) {
  const gap = 10;
  const x0 = MARGIN;
  const y0 = topY;
  const areaW = format.w - MARGIN * 2;
  const areaH = format.h - y0 - MARGIN;
  const cellW = (areaW - gap * (cols - 1)) / cols;
  const cellH = (areaH - gap * (rows - 1)) / rows;
  const els = [];
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      els.push({
        type: 'product',
        productId: productIds[i] ?? null,
        x: Math.round(x0 + c * (cellW + gap)),
        y: Math.round(y0 + r * (cellH + gap)),
        w: Math.round(cellW),
        h: Math.round(cellH),
        radius: 10,
        fill: '#ffffff',
      });
      i++;
    }
  }
  return els;
}

// ---- montadores de página ---------------------------------

function buildCoverPage(spec, format) {
  const bg = spec.background;
  const color = TEXT_ON_BG[bg] || '#fff';
  const els = [logoEl(format)];
  const quotes = spec.quotes.length ? spec.quotes : [spec.title || 'OFERTAS IMPERDÍVEIS'];

  // Título grande centralizado no meio-baixo da capa.
  const main = quotes[0];
  els.push(txt(main, MARGIN, Math.round(format.h * 0.40), format.w - MARGIN * 2, 90,
    { size: 52, color, weight: 800, align: 'center' }));

  // Subtítulo (segunda frase, se houver).
  if (quotes[1]) {
    els.push(txt(quotes[1], MARGIN, Math.round(format.h * 0.40) + 96, format.w - MARGIN * 2, 50,
      { size: 26, color, weight: 600, align: 'center' }));
  }
  // Rodapé de marca.
  els.push(txt('LOJAS LEBES', MARGIN, format.h - MARGIN - 28, format.w - MARGIN * 2, 28,
    { size: 16, color, weight: 600, align: 'center' }));
  return { background: bg, kind: 'cover', elements: els };
}

// ---- parsing do prompt em "specs" de página ----------------

// Divide o prompt em blocos por página. Reconhece "página N", "pag N",
// "pg N" e quebras de linha numeradas. Sem numeração → 1 página única.
function splitIntoPageSpecs(prompt) {
  const cleaned = prompt.replace(/\r/g, '');
  const re = /(?:^|\n|\.|;)\s*(?:p[áa]gina|pag\.?|pg\.?)\s*\d+\s*[:\-–—]?/gi;
  const matches = [...cleaned.matchAll(re)];
  if (matches.length === 0) return [cleaned.trim()];

  const blocks = [];
  // Conteúdo antes do primeiro marcador "Página N" também é uma página.
  const lead = cleaned.slice(0, matches[0].index).trim();
  if (lead) blocks.push(lead);
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : cleaned.length;
    const body = cleaned.slice(start, end).trim();
    if (body) blocks.push(body);
  }
  return blocks.length ? blocks : [cleaned.trim()];
}

function parseSpec(block, globalBg) {
  const cover = detectCover(block);
  return {
    cover,
    background: detectBackground(block, globalBg),
    sector: detectSector(block),
    grid: detectGrid(block),
    count: detectCount(block),
    quotes: extractQuoted(block),
    title: extractQuoted(block)[0] || null,
    logo: wantsLogo(block),
  };
}

// ============================================================
// API PÚBLICA
// ============================================================
// generateMagazine({ prompt, format, products? }) -> { pages: [...] }
// `products` é opcional (default: catálogo do app), permitindo que a
// mesma assinatura seja reusada quando vier do proxy/Gemini.
export function generateMagazine({ prompt, format, products = PRODUCTS }) {
  if (!prompt || !prompt.trim()) {
    return { pages: [], error: 'Descreva o projeto que você quer gerar.' };
  }
  const globalBg = detectBackground(prompt, 'pink');
  const blocks = splitIntoPageSpecs(prompt);
  // PRODUCTS é o pool default; products param permite override futuro.
  const pool = products && products.length ? products : PRODUCTS;
  const pages = blocks.map(b => {
    const spec = parseSpec(b, globalBg);
    return buildPageWithPool(spec, format, pool);
  });
  return { pages };
}

// variante de buildPage que usa o pool informado (para override de catálogo)
function buildPageWithPool(spec, format, pool) {
  if (spec.cover) return buildCoverPage(spec, format);
  // grid com pool customizado
  const bg = spec.background;
  const headColor = TEXT_ON_BG[bg] || '#fff';
  const els = [];
  let topY = MARGIN;
  if (spec.logo) { els.push(logoEl(format)); topY = 80; }
  if (spec.quotes[0]) {
    els.push(txt(spec.quotes[0], MARGIN, topY, format.w - MARGIN * 2, 48,
      { size: 30, color: headColor, weight: 800, align: spec.logo ? 'center' : 'left' }));
    topY += 60;
  }
  let { cols, rows } = spec.grid || {};
  if (!cols || !rows) {
    const n = spec.count || 4;
    cols = n <= 2 ? n : n <= 6 ? 3 : 4;
    rows = Math.ceil(n / cols);
  }
  const ids = pickProducts(spec.sector, cols * rows, pool);
  els.push(...productGrid(cols, rows, ids, format, topY));
  return { background: bg, kind: 'grid', elements: els };
}

// Exemplos rápidos para o usuário (mostrados no modal).
export const AI_EXAMPLES = [
  'Página 1 — capa de Dia das Mães, fundo rosa, título "OFERTAS PARA ELA". Página 2 — grade 3×2 de eletro com título "ELETRO EM OFERTA".',
  'Capa fundo verde com título "LIQUIDA LEBES". Página 2 — 3 colunas e 5 linhas de produtos de moda.',
  'Uma página com 6 produtos eletro em grade 3×2, fundo branco, texto "IMPERDÍVEL".',
];
