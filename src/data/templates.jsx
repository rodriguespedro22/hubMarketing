import { Grid3x3, Layout, Maximize2 } from 'lucide-react';

import { MARGIN, PAGE_H, PAGE_W } from '../constants/pageConfig';
import { uid } from '../utils/helpers';

export function buildGrid(cols, rows, opts = {}) {
  const pageW = opts.pageW ?? PAGE_W;
  const pageH = opts.pageH ?? PAGE_H;
  const {
    x = MARGIN,
    y = 120,
    w = pageW - MARGIN * 2,
    h = pageH - 200,
    gap = 10,
  } = opts;
  const cellW = (w - gap * (cols - 1)) / cols;
  const cellH = (h - gap * (rows - 1)) / rows;
  const els = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      els.push({
        id: uid(), type: 'product', productId: null,
        x: Math.round(x + c * (cellW + gap)),
        y: Math.round(y + r * (cellH + gap)),
        w: Math.round(cellW), h: Math.round(cellH),
        rotation: 0, opacity: 1, radius: 10, fill: '#ffffff', hidden: false, locked: false,
      });
    }
  }
  return els;
}

export const TEMPLATES = [
  {
    id: 'blank', name: 'Em branco', icon: Layout, desc: 'Página vazia',
    make: () => ({ background: 'white', elements: [] }),
  },
  {
    id: 'grid32', name: 'Grade 3 × 2', icon: Grid3x3, desc: '6 produtos',
    make: () => ({ background: 'white', elements: buildGrid(3, 2) }),
  },
  {
    id: 'grid23', name: 'Grade 2 × 3', icon: Grid3x3, desc: '6 produtos',
    make: () => ({ background: 'white', elements: buildGrid(2, 3) }),
  },
  {
    id: 'highlight', name: 'Destaque', icon: Maximize2, desc: '1 grande + 4',
    make: () => ({
      background: 'white',
      elements: [
        { id: uid(), type: 'text', text: 'OFERTA DESTAQUE', x: MARGIN, y: 36, w: 300, h: 50, rotation: 0, opacity: 1, fontSize: 34, color: '#047704ff', weight: 800, align: 'left', font: 'Gantari', hidden: false, locked: false },
        { id: uid(), type: 'product', productId: null, x: MARGIN, y: 110, w: 250, h: 300, rotation: 0, opacity: 1, radius: 12, fill: '#047704ff', hidden: false, locked: false },
        ...buildGrid(2, 2, { x: 296, y: 110, w: PAGE_W - 296 - MARGIN, h: 300, gap: 10 }),
      ],
    }),
  },
];

// ============================================================
// PRICE TAG
// ============================================================
