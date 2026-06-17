export const PAGE_FORMATS = [
  { id: 'lebes',  label: 'Padrão Lebes', mm: [206, 225], w: 548, h: 599 },
  { id: 'a4',     label: 'A4',          mm: [210, 297], w: 560, h: 792 },
  { id: 'a5',     label: 'A5',          mm: [148, 210], w: 460, h: 652 },
  { id: 'letter', label: 'Carta (US)',  mm: [216, 279], w: 560, h: 723 },
  { id: 'tabloid',label: 'Tabloide',    mm: [279, 432], w: 520, h: 805 },
  { id: 'square', label: 'Quadrado',    mm: [210, 210], w: 600, h: 600 },
];
export const DEFAULT_FORMAT = PAGE_FORMATS.find(f => f.id === 'lebes') || PAGE_FORMATS[0];
export const PAGE_W = DEFAULT_FORMAT.w, PAGE_H = DEFAULT_FORMAT.h;  // defaults usados por buildGrid quando nenhum override é passado
export const MARGIN = 28;                          // margem de segurança

// Paleta nomeada da identidade Lebes (usada por assets de marca e pelo motor de IA)
export const COLORS = {
  pinkSolid: '#e5006d',
  pinkLight: '#ff8cc3',
  green:     '#00813A',
  greenDark: '#005224',
  white:     '#ffffff',
  cream:     '#f5f0e8',
  gold:      '#ffd400',
};

// Fundos de página (presets identidade Lebes)
export const BACKGROUNDS = {
  pink:  'linear-gradient(180deg,#ff8cc3 0%,#e5006d 100%)',
  green: 'linear-gradient(155deg,#00813A 0%,#005224 100%)',
  white: '#ffffff',
  cream: '#f5f0e8',
};

// ============================================================
// HELPERS
// ============================================================
let _id = 1000;
