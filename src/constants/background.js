// ============================================================
// MODELO DE FUNDO DE PÁGINA (page.background)
// ------------------------------------------------------------
// O fundo deixou de ser uma string-chave de BACKGROUNDS e passou
// a ser um objeto descritivo. Formas suportadas:
//
//   { type: 'color',    value: '#e5006d', opacity: 1 }
//   { type: 'gradient', value: 'linear-gradient(...)', opacity: 1,
//       stops: [{ color, at }], angle: 180 }   // metadados editáveis
//   { type: 'image',    src: 'data:image/...', fit: 'cover'|'contain'|'tile',
//       opacity: 0.8 }
//
// RETROCOMPATIBILIDADE: projetos/predefinições/templates antigos e a
// saída atual do motor de IA usam `background` como string ('pink',
// 'green', 'white', 'cream'). normalizeBackground() converte qualquer
// entrada (string legada OU objeto) para o objeto novo, de forma
// idempotente. Use SEMPRE normalizeBackground() ao ler e backgroundToCss()
// ao renderizar.
// ============================================================

import { BACKGROUNDS } from './pageConfig';

// Presets de identidade Lebes — atalhos de 1 clique.
// Cada preset descreve o objeto-fundo completo que ele representa.
export const BG_PRESETS = [
  {
    id: 'pink',
    label: 'Rosa Lebes',
    swatch: BACKGROUNDS.pink,
    make: () => ({
      type: 'gradient',
      value: BACKGROUNDS.pink,
      opacity: 1,
      angle: 180,
      stops: [{ color: '#ff8cc3', at: 0 }, { color: '#e5006d', at: 100 }],
    }),
  },
  {
    id: 'green',
    label: 'Verde Lebes',
    swatch: BACKGROUNDS.green,
    make: () => ({
      type: 'gradient',
      value: BACKGROUNDS.green,
      opacity: 1,
      angle: 155,
      stops: [{ color: '#00813A', at: 0 }, { color: '#005224', at: 100 }],
    }),
  },
  {
    id: 'white',
    label: 'Branco',
    swatch: BACKGROUNDS.white,
    make: () => ({ type: 'color', value: '#ffffff', opacity: 1 }),
  },
  {
    id: 'cream',
    label: 'Creme',
    swatch: BACKGROUNDS.cream,
    make: () => ({ type: 'color', value: '#f5f0e8', opacity: 1 }),
  },
];

const PRESET_BY_ID = Object.fromEntries(BG_PRESETS.map(p => [p.id, p]));

// Fundo padrão de páginas novas (branco).
export const defaultBackground = () => PRESET_BY_ID.white.make();

const clamp01 = (n) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 1));

// Converte QUALQUER entrada (string legada, objeto novo, nulo) no objeto-fundo.
// Idempotente: normalizeBackground(normalizeBackground(x)) === equivalente.
export function normalizeBackground(bg) {
  // Legado: string-chave de preset.
  if (typeof bg === 'string') {
    const preset = PRESET_BY_ID[bg];
    if (preset) return preset.make();
    // String solta não reconhecida: trata como gradiente/cor crua.
    if (/gradient\(/i.test(bg)) return { type: 'gradient', value: bg, opacity: 1 };
    return { type: 'color', value: bg || '#ffffff', opacity: 1 };
  }
  if (bg && typeof bg === 'object') {
    const opacity = clamp01(bg.opacity ?? 1);
    if (bg.type === 'image') {
      return {
        type: 'image',
        src: bg.src || '',
        fit: ['cover', 'contain', 'tile'].includes(bg.fit) ? bg.fit : 'cover',
        opacity,
      };
    }
    if (bg.type === 'gradient') {
      return {
        type: 'gradient',
        value: bg.value || BACKGROUNDS.pink,
        opacity,
        angle: Number.isFinite(bg.angle) ? bg.angle : 180,
        stops: Array.isArray(bg.stops) && bg.stops.length >= 2
          ? bg.stops.map(s => ({ color: s.color || '#000000', at: Number.isFinite(s.at) ? s.at : 0 }))
          : [{ color: '#ff8cc3', at: 0 }, { color: '#e5006d', at: 100 }],
      };
    }
    // type 'color' (ou desconhecido) → cor sólida
    return { type: 'color', value: bg.value || '#ffffff', opacity };
  }
  // Nulo/indefinido → padrão.
  return defaultBackground();
}

// Reconstrói a string CSS de um gradiente a partir de stops + angle.
export function gradientCss(angle, stops) {
  const a = Number.isFinite(angle) ? angle : 180;
  const parts = (stops && stops.length ? stops : [{ color: '#ff8cc3', at: 0 }, { color: '#e5006d', at: 100 }])
    .map(s => `${s.color} ${s.at}%`)
    .join(',');
  return `linear-gradient(${a}deg,${parts})`;
}

// Devolve um objeto de estilo CSS pronto para o <div> da página.
// Compositamos sobre branco para que a opacidade "clareie" o fundo
// (em vez de deixar a página transparente). Para isso usamos o branco
// como camada base e o fundo escolhido por cima com a opacidade dada.
export function backgroundToStyle(bg) {
  const b = normalizeBackground(bg);
  const op = clamp01(b.opacity ?? 1);

  if (b.type === 'image' && b.src) {
    const base = { backgroundColor: '#ffffff' };
    if (b.fit === 'tile') {
      return {
        ...base,
        backgroundImage: `url(${b.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundPosition: 'center',
        opacity: 1, // a opacidade da imagem é tratada via camada (ver canvas)
        '--bg-opacity': op,
      };
    }
    return {
      ...base,
      backgroundImage: `url(${b.src})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: b.fit === 'contain' ? 'contain' : 'cover',
      backgroundPosition: 'center',
      '--bg-opacity': op,
    };
  }

  if (b.type === 'gradient') {
    const value = b.stops ? gradientCss(b.angle, b.stops) : (b.value || BACKGROUNDS.pink);
    return { backgroundColor: '#ffffff', backgroundImage: value, '--bg-opacity': op };
  }

  // cor sólida
  return { backgroundColor: '#ffffff', backgroundImage: 'none', '--bg-opacity': op, '--bg-color': b.value || '#ffffff' };
}

// Para casos em que só precisamos de UMA string CSS (thumbnails pequenos),
// devolve o "background" composto simples (sem camada de opacidade fina).
export function backgroundToCss(bg) {
  const b = normalizeBackground(bg);
  if (b.type === 'image' && b.src) {
    const size = b.fit === 'contain' ? 'contain' : b.fit === 'tile' ? 'auto' : 'cover';
    const repeat = b.fit === 'tile' ? 'repeat' : 'no-repeat';
    return `#fff url(${b.src}) center/${size} ${repeat}`;
  }
  if (b.type === 'gradient') return b.stops ? gradientCss(b.angle, b.stops) : (b.value || BACKGROUNDS.pink);
  return b.value || '#ffffff';
}
