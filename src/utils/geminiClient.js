// ============================================================
// GEMINI CLIENT — geração de páginas via Gemini 2.5 Flash
// ------------------------------------------------------------
// MODO PROTÓTIPO (v0): a chave da API é fornecida pelo usuário e
// guardada apenas em localStorage (lebes:gemini:key). NUNCA é
// commitada. A chamada sai direto do navegador para a API do
// Google AI. Em produção, isto deve ser movido para um proxy
// backend que guarda a chave em variável de ambiente — a
// assinatura de generateMagazineGemini() é a mesma de
// generateMagazine() (motor local), então trocar o destino da
// chamada não afeta a UI.
//
// Endpoint REST:
//   POST https://generativelanguage.googleapis.com/v1beta/models/
//        gemini-2.5-flash:generateContent?key=API_KEY
// Saída estruturada via generationConfig.responseSchema +
// responseMimeType "application/json".
// ============================================================

import { COLORS, MARGIN } from '../constants/pageConfig';
import { PRODUCTS } from '../data/products';
import { LEBES_EXAMPLES } from '../data/lebesExamples';

const KEY_STORAGE = 'lebes:gemini:key';
const MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';
const ENDPOINT = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(key)}`;
const IMAGE_ENDPOINT = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${encodeURIComponent(key)}`;

// fetch com timeout (evita o bug conhecido do 2.5-flash de "pendurar" o socket
// indefinidamente em pico, sem nunca retornar erro). Aborta após ms e lança.
async function fetchWithTimeout(url, options, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

// ---- chave (localStorage) ---------------------------------
export const getGeminiKey = () => {
  try { return localStorage.getItem(KEY_STORAGE) || ''; } catch { return ''; }
};
export const setGeminiKey = (k) => {
  try {
    if (k) localStorage.setItem(KEY_STORAGE, k.trim());
    else localStorage.removeItem(KEY_STORAGE);
  } catch {}
};
export const hasGeminiKey = () => !!getGeminiKey();

// ---- schema de saída (responseSchema do Gemini) ------------
// Tipos em MAIÚSCULAS conforme a API do Google AI.
const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    pages: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          background: { type: 'STRING', enum: ['pink', 'green', 'white', 'cream'] },
          kind: { type: 'STRING', enum: ['cover', 'grid'] },
          elements: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                type: { type: 'STRING', enum: ['text', 'product', 'box', 'image'] },
                text: { type: 'STRING' },
                productId: { type: 'STRING' },
                imagePrompt: { type: 'STRING' },
                x: { type: 'NUMBER' },
                y: { type: 'NUMBER' },
                w: { type: 'NUMBER' },
                h: { type: 'NUMBER' },
                fontSize: { type: 'NUMBER' },
                color: { type: 'STRING' },
                weight: { type: 'NUMBER' },
                align: { type: 'STRING', enum: ['left', 'center', 'right'] },
                radius: { type: 'NUMBER' },
                fill: { type: 'STRING' },
              },
              required: ['type', 'x', 'y', 'w', 'h'],
            },
          },
        },
        required: ['background', 'kind', 'elements'],
      },
    },
  },
  required: ['pages'],
};

// ---- system prompt ----------------------------------------
// Reduz uma predefinição salva (lebes:templates:v1) ao formato de exemplo.
function templateToExample(tpl) {
  const elements = (tpl.elements || []).map(el => {
    const o = { type: el.type, x: Math.round(el.x), y: Math.round(el.y), w: Math.round(el.w), h: Math.round(el.h) };
    if (el.type === 'text') { o.text = el.text; o.fontSize = el.fontSize; o.color = el.color; o.weight = el.weight; o.align = el.align; }
    if (el.type === 'product') { o.productId = el.productId; o.radius = el.radius; o.fill = el.fill; }
    if (el.type === 'box') { o.radius = el.radius; o.fill = el.fill; }
    return o;
  });
  // background salvo pode ser string (legado) — mantemos como veio.
  const bg = typeof tpl.background === 'string' ? tpl.background : 'pink';
  return { titulo: `Predefinição salva: ${tpl.name || 'sem nome'}`, page: { background: bg, kind: 'grid', elements } };
}

function buildExamplesBlock(savedTemplates = []) {
  const fromSaved = (savedTemplates || []).slice(0, 4).map(templateToExample);
  // Fixos primeiro (padrão de ouro), depois os salvos pelo usuário.
  const all = [...LEBES_EXAMPLES, ...fromSaved];
  if (!all.length) return '';
  const blocks = all.map((ex, i) =>
    `# Exemplo ${i + 1} — ${ex.titulo}\n${JSON.stringify(ex.page)}`
  ).join('\n\n');
  return `\n\nEXEMPLOS DO PADRÃO LEBES (copie o estilo: espaçamento, hierarquia, grade, cor):\n${blocks}\n`;
}

function buildSystemPrompt(format, savedTemplates = [], hasImages = false) {
  const catalog = PRODUCTS.map(p =>
    `- ${p.id}: ${p.name} (${p.brand}, setor ${p.sector}, R$ ${p.priceCash})`
  ).join('\n');

  const imagesNote = hasImages
    ? '\n\nIMAGENS DE REFERÊNCIA: o usuário anexou imagens de designs Lebes antigos. Use-as como referência VISUAL de estilo (cores, hierarquia, composição). Você NÃO recria as imagens — apenas devolve o layout em JSON inspirado nesse estilo.'
    : '';

  return `Você é um designer de peças de comunicação visual do Grupo Lebes (varejo brasileiro). O Estúdio Criativo do Hub de Marketing cria Banners, Cards e Revistas de oferta.
Monte páginas de projeto seguindo RIGOROSAMENTE o padrão Lebes e devolva APENAS JSON no schema fornecido.

PADRÃO LEBES (obrigatório):
- Dimensões da página: ${format.w} x ${format.h} px (formato "${format.label}", ${format.mm[0]}x${format.mm[1]}mm). Todos os elementos devem caber DENTRO dessas dimensões.
- Margem de segurança: ${MARGIN}px em todas as bordas. NÃO posicione elementos fora da área útil (de ${MARGIN} até ${format.w - MARGIN} na horizontal, ${MARGIN} a ${format.h - MARGIN} na vertical).
- Fonte de TODO texto: "Gantari". Títulos com weight 800.
- Paleta de cores Lebes: rosa ${COLORS.pinkSolid}, rosa claro ${COLORS.pinkLight}, verde ${COLORS.green}, verde escuro ${COLORS.greenDark}, branco ${COLORS.white}, creme ${COLORS.cream}, dourado ${COLORS.gold}.
- Em fundo rosa ou verde, o texto deve ser branco (#ffffff). Em fundo branco, use rosa ${COLORS.pinkSolid}. Em fundo creme, use verde ${COLORS.green}.
- Slots de produto: type "product" com radius 10 e fill "#ffffff".
- Organize produtos em GRADES alinhadas, com espaçamento uniforme (~10px de gap) e respeitando a margem.

IMAGENS DECORATIVAS (type "image"):
- Use APENAS para decoração/tema (banner, fundo temático, faixa de natal, selo, enfeites). NUNCA para representar um produto — produtos são sempre type "product".
- Para um slot de imagem, inclua o campo "imagePrompt": descrição CURTA e visual em português do que desenhar (ex.: "faixa decorativa de natal com pinheiros, neve e enfeites vermelhos e dourados, estilo flat"). NÃO inclua "src".
- Posicione a imagem no layout como qualquer elemento (x/y/w/h). Boas práticas: faixa/banner no topo, ou fundo decorativo atrás de uma grade.
- Use no MÁXIMO 2 imagens por página (custo e tempo).

TIPOS DE PÁGINA (campo "kind"):
- "cover": capa/banner. Título grande centralizado, fundo cheio de cor.
- "grid": grade de produtos com título de seção no topo.

PRODUTOS DISPONÍVEIS (use SOMENTE estes id no campo productId):
${catalog}${buildExamplesBlock(savedTemplates)}${imagesNote}

REGRAS DE SAÍDA:
- Responda SOMENTE com JSON válido no schema. Sem comentários, sem markdown.
- productId DEVE ser um id real da lista acima. Nunca invente ids.
- O catálogo tem poucos produtos: pode REPETIR o mesmo productId em slots diferentes quando faltarem produtos para preencher a grade.
- Coordenadas x/y/w/h em pixels, inteiras, dentro das dimensões da página.
- Siga o estilo dos exemplos acima sempre que possível.
- Seja EFICIENTE: gere o JSON direto, sem texto extra. Para projetos muito grandes (mais de ~5 páginas), priorize concluir todas as páginas pedidas.
- Se o usuário pedir N páginas, gere N páginas na ordem pedida.`;
}

// ---- validação / saneamento -------------------------------
const VALID_BG = new Set(['pink', 'green', 'white', 'cream']);
const VALID_IDS = new Set(PRODUCTS.map(p => p.id));

function clampNum(v, min, max, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

// Valida e saneia a resposta do modelo contra as regras do editor.
function sanitize(parsed, format) {
  if (!parsed || !Array.isArray(parsed.pages) || !parsed.pages.length) {
    throw new Error('Resposta da IA sem páginas válidas.');
  }
  const pages = parsed.pages.map((pg) => {
    const background = VALID_BG.has(pg.background) ? pg.background : 'pink';
    const els = Array.isArray(pg.elements) ? pg.elements : [];
    const elements = els
      .filter(el => el && ['text', 'product', 'box', 'image'].includes(el.type))
      .map((el) => {
        const base = {
          type: el.type,
          x: clampNum(el.x, 0, format.w, MARGIN),
          y: clampNum(el.y, 0, format.h, MARGIN),
          w: clampNum(el.w, 10, format.w, 100),
          h: clampNum(el.h, 10, format.h, 100),
        };
        if (el.type === 'text') {
          return {
            ...base,
            text: String(el.text ?? 'Texto'),
            fontSize: clampNum(el.fontSize, 8, 120, 30),
            color: typeof el.color === 'string' ? el.color : '#ffffff',
            weight: clampNum(el.weight, 100, 900, 800),
            align: ['left', 'center', 'right'].includes(el.align) ? el.align : 'left',
            font: 'Gantari',
          };
        }
        if (el.type === 'product') {
          const productId = VALID_IDS.has(el.productId) ? el.productId : null;
          return { ...base, productId, radius: clampNum(el.radius, 0, 40, 10), fill: el.fill || '#ffffff' };
        }
        if (el.type === 'image') {
          // src é preenchido depois (etapa 2). Por ora carrega só o imagePrompt.
          return {
            ...base,
            src: null,
            imagePrompt: typeof el.imagePrompt === 'string' ? el.imagePrompt.slice(0, 300) : '',
            fit: 'cover',
            radius: clampNum(el.radius, 0, 40, 0),
          };
        }
        // box
        return { ...base, radius: clampNum(el.radius, 0, 40, 12), fill: el.fill || COLORS.green };
      });
    return { background, kind: pg.kind === 'cover' ? 'cover' : 'grid', elements };
  });
  return { pages };
}

// Extrai o texto JSON da resposta do Gemini (tolerante a cercas markdown).
function extractJson(data) {
  const cand = data?.candidates?.[0];
  const parts = cand?.content?.parts || [];
  const text = parts.map(p => p.text || '').join('').trim();
  const finish = cand?.finishReason;

  if (!text) {
    const reason = finish || data?.promptFeedback?.blockReason;
    throw new Error(reason ? `A IA não retornou conteúdo (${reason}).` : 'A IA retornou resposta vazia.');
  }
  // Resposta cortada por limite de tokens → JSON incompleto. Avisar em vez
  // de tentar parsear (causaria "Unexpected end of JSON input").
  if (finish === 'MAX_TOKENS') {
    throw new Error('o projeto pedido é grande demais para uma resposta só. Tente gerar menos páginas por vez (ex.: 2 a 3).');
  }
  const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(clean);
}

// ============================================================
// API PÚBLICA — mesma assinatura do motor local (+ extras opcionais)
// images: [{ mimeType, data(base64 sem prefixo) }] — referências visuais
// savedTemplates: predefinições do usuário (lebes:templates:v1)
// ============================================================
export async function generateMagazineGemini({ prompt, format, savedTemplates = [], images = [], withImages = false, onImageProgress }) {
  const key = getGeminiKey();
  if (!key) return { pages: [], error: 'Configure sua chave do Gemini para usar este modo.' };
  if (!prompt || !prompt.trim()) return { pages: [], error: 'Descreva o projeto que você quer gerar.' };

  // Partes do turno do usuário: imagens de referência (se houver) + texto.
  const userParts = [];
  for (const img of images) {
    if (img?.data && img?.mimeType) {
      userParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
    }
  }
  userParts.push({ text: prompt.trim() });

  const layout = await postLayout(key, {
    systemInstruction: { parts: [{ text: buildSystemPrompt(format, savedTemplates, images.length > 0) }] },
    contents: [{ role: 'user', parts: userParts }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.6,
      maxOutputTokens: 16384,
      thinkingConfig: { thinkingBudget: 0 },
    },
  }, format);

  if (layout.error) return layout;

  // Etapa 2 (opcional): preencher slots de imagem decorativa com o modelo de imagem.
  if (withImages) {
    await fillImageSlots(layout, key, onImageProgress);
  }
  return layout;
}

// ---- chamada de baixo nível: POST → parse → sanitize ------
// Faz uma requisição de layout e devolve { pages } ou { pages:[], error }.
// Reutilizada pela chamada única, pelo planejador e pela geração por página.
async function postLayout(key, body, format) {
  let resp;
  try {
    resp = await fetchWithTimeout(ENDPOINT(key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }, 90000);
  } catch (e) {
    if (e?.name === 'AbortError') {
      return { pages: [], error: 'O Gemini demorou demais para responder (provável sobrecarga ou pedido grande demais). Tente novamente, ou gere menos páginas por vez (2 a 3).' };
    }
    return { pages: [], error: 'Falha de rede ao chamar o Gemini. Verifique sua conexão.' };
  }
  if (!resp.ok) {
    let detail = '';
    try { const j = await resp.json(); detail = j?.error?.message || ''; } catch {}
    if (resp.status === 400 && /API key/i.test(detail)) return { pages: [], error: 'Chave do Gemini inválida.' };
    if (resp.status === 429) return { pages: [], error: 'Limite de uso do Gemini atingido. Tente novamente em instantes.' };
    return { pages: [], error: `Erro do Gemini (${resp.status}). ${detail}`.trim() };
  }
  try {
    const data = await resp.json();
    const parsed = extractJson(data);
    return sanitize(parsed, format);
  } catch (e) {
    return { pages: [], error: `Não foi possível interpretar a resposta da IA: ${e.message}` };
  }
}

// ---- PLANO LEVE -------------------------------------------
// Schema mínimo só para descobrir quantas páginas e um resumo de cada uma.
const PLAN_SCHEMA = {
  type: 'OBJECT',
  properties: {
    pages: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          kind: { type: 'STRING', enum: ['cover', 'grid'] },
          background: { type: 'STRING', enum: ['pink', 'green', 'white', 'cream'] },
          resumo: { type: 'STRING' }, // descrição curta do conteúdo da página
        },
        required: ['kind', 'resumo'],
      },
    },
  },
  required: ['pages'],
};

// Pede ao modelo um plano enxuto (sem elementos). Barato e rápido.
// Devolve { plan: [{ kind, background, resumo }] } ou { error }.
async function planMagazine(key, prompt, format, savedTemplates) {
  const sys = `Você é um diretor de arte do Estúdio Criativo do Hub de Marketing. Dado o pedido do usuário, planeje o projeto (Banner, Card ou Revista) listando as PÁGINAS na ordem, SEM detalhar elementos. Para cada página informe: kind ("cover" ou "grid"), background ("pink"|"green"|"white"|"cream") e um "resumo" curto (1 frase) do conteúdo. Se o usuário pedir N páginas, devolva exatamente N. Responda SOMENTE JSON no schema.`;
  let resp;
  try {
    resp = await fetchWithTimeout(ENDPOINT(key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sys }] },
        contents: [{ role: 'user', parts: [{ text: prompt.trim() }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: PLAN_SCHEMA,
          temperature: 0.3,
          maxOutputTokens: 2048,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    }, 45000);
  } catch (e) {
    return { error: e?.name === 'AbortError' ? 'O planejamento da IA demorou demais.' : 'Falha de rede ao planejar o projeto.' };
  }
  if (!resp.ok) return { error: `Erro do Gemini ao planejar (${resp.status}).` };
  try {
    const data = await resp.json();
    const parsed = extractJson(data);
    const plan = Array.isArray(parsed?.pages) ? parsed.pages.filter(Boolean) : [];
    if (!plan.length) return { error: 'O plano da IA veio vazio.' };
    return { plan };
  } catch (e) {
    return { error: `Não foi possível interpretar o plano: ${e.message}` };
  }
}

// Gera UMA página a partir de um item do plano. Reaproveita o schema/sistema
// completos, mas instrui o modelo a produzir exatamente 1 página.
async function generateSinglePage(key, planItem, idx, total, format, savedTemplates, images) {
  const userParts = [];
  for (const img of images) {
    if (img?.data && img?.mimeType) userParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
  }
  userParts.push({ text:
    `Gere APENAS a página ${idx + 1} de ${total} do projeto.\n` +
    `Tipo: ${planItem.kind}. Fundo: ${planItem.background || 'pink'}.\n` +
    `Conteúdo desta página: ${planItem.resumo}\n` +
    `Devolva um objeto "pages" com EXATAMENTE 1 página.` });

  const layout = await postLayout(key, {
    systemInstruction: { parts: [{ text: buildSystemPrompt(format, savedTemplates, images.length > 0) }] },
    contents: [{ role: 'user', parts: userParts }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.6,
      maxOutputTokens: 8192,
      thinkingConfig: { thinkingBudget: 0 },
    },
  }, format);

  if (layout.error) return layout;
  // pega a primeira (e única esperada) página
  const page = layout.pages[0];
  if (!page) return { pages: [], error: 'A IA não retornou a página.' };
  // respeita o fundo planejado se o modelo divergir sem motivo
  if (planItem.background && page.background !== planItem.background) page.background = planItem.background;
  return { pages: [page] };
}

// ============================================================
// AUTO-LOTE — planeja primeiro; se ≥4 páginas, gera uma a uma
// (preview incremental via onPageReady); senão, chamada única.
//   onPageReady(page, index, total)  — emite cada página pronta
//   onPlan(total)                    — total de páginas previsto
// Mantém a mesma forma de retorno: { pages } | { pages:[], error }.
// ============================================================
export async function generateMagazineBatched({
  prompt, format, savedTemplates = [], images = [], withImages = false,
  onImageProgress, onPageReady, onPlan, onPhase,
}) {
  const key = getGeminiKey();
  if (!key) return { pages: [], error: 'Configure sua chave do Gemini para usar este modo.' };
  if (!prompt || !prompt.trim()) return { pages: [], error: 'Descreva o projeto que você quer gerar.' };

  // 1) Plano leve.
  onPhase?.('plan');
  const planned = await planMagazine(key, prompt, format, savedTemplates);

  // Se o plano falhar, cai no caminho de chamada única (resiliência).
  if (planned.error || !planned.plan) {
    onPhase?.('single');
    const single = await generateMagazineGemini({ prompt, format, savedTemplates, images, withImages, onImageProgress });
    if (!single.error) single.pages?.forEach((pg, i) => onPageReady?.(pg, i, single.pages.length));
    return single;
  }

  const total = planned.plan.length;
  onPlan?.(total);

  // 2) Projeto pequeno (<4 páginas): mantém a chamada única atual.
  if (total < 4) {
    onPhase?.('single');
    const single = await generateMagazineGemini({ prompt, format, savedTemplates, images, withImages, onImageProgress });
    if (!single.error) single.pages?.forEach((pg, i) => onPageReady?.(pg, i, single.pages.length));
    return single;
  }

  // 3) Projeto grande (≥4 páginas): gera página a página, emitindo cada uma.
  onPhase?.('pages');
  const pages = [];
  for (let i = 0; i < total; i++) {
    const res = await generateSinglePage(key, planned.plan[i], i, total, format, savedTemplates, images);
    if (res.error) {
      // erro no meio: devolve o que já temos + a mensagem (não perde o progresso)
      return pages.length ? { pages, partial: true, error: `Página ${i + 1}: ${res.error}` } : res;
    }
    const page = res.pages[0];
    pages.push(page);
    onPageReady?.(page, i, total);
  }

  const layout = { pages };
  // Etapa 2 (opcional): imagens decorativas, agora sobre todas as páginas.
  if (withImages) {
    onPhase?.('images');
    await fillImageSlots(layout, key, onImageProgress);
  }
  return layout;
}

// Gera UMA imagem decorativa via gemini-2.5-flash-image. Retorna dataURL ou null.
async function generateImage(promptText, key) {
  const body = {
    contents: [{ role: 'user', parts: [{ text:
      `Ilustração decorativa para peça de oferta Lebes (sem texto, sem logotipo, sem palavras na imagem): ${promptText}. Estilo limpo, cores vivas, fundo adequado para sobrepor produtos.` }] }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
  };
  let resp;
  try {
    resp = await fetchWithTimeout(IMAGE_ENDPOINT(key), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    }, 60000);
  } catch { return null; }
  if (!resp.ok) return null;
  try {
    const data = await resp.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const img = parts.find(p => p.inlineData?.data);
    if (!img) return null;
    const mime = img.inlineData.mimeType || 'image/png';
    return `data:${mime};base64,${img.inlineData.data}`;
  } catch { return null; }
}

// Percorre as páginas e preenche cada elemento image com imagePrompt.
// Sequencial para não estourar limite de taxa. onProgress(done, total).
async function fillImageSlots(layout, key, onProgress) {
  const slots = [];
  layout.pages.forEach((pg, pi) => {
    pg.elements.forEach((el, ei) => {
      if (el.type === 'image' && el.imagePrompt && !el.src) slots.push({ pi, ei });
    });
  });
  if (!slots.length) return;
  let done = 0;
  onProgress?.(0, slots.length);
  for (const { pi, ei } of slots) {
    const el = layout.pages[pi].elements[ei];
    const src = await generateImage(el.imagePrompt, key);
    if (src) el.src = src;        // preenche; se falhar, slot fica vazio (editável)
    done += 1;
    onProgress?.(done, slots.length);
  }
}
