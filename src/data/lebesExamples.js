// ============================================================
// LEBES EXAMPLES — páginas "padrão de ouro" (few-shot)
// ------------------------------------------------------------
// Exemplos de páginas BEM montadas no padrão Lebes, no mesmo
// schema que o editor entende. São injetados no prompt do
// Gemini como referência de estilo: espaçamento, hierarquia de
// títulos, organização de grade e uso de cor. O modelo aprende
// o padrão COPIANDO estes exemplos a cada chamada (few-shot),
// já que a API não tem memória entre requisições.
//
// Dimensões de referência: Padrão Lebes 548 x 599, margem 28.
// Para adicionar um novo exemplo, salve uma página boa no editor
// e cole aqui o objeto { background, kind, elements:[...] }.
// ============================================================

export const LEBES_EXAMPLES = [
  {
    titulo: 'Capa — fundo cheio, logo no topo, título grande centralizado',
    page: {
      background: 'pink',
      kind: 'cover',
      elements: [
        { type: 'text', text: 'OFERTAS DO MÊS', x: 28, y: 250, w: 492, h: 90, fontSize: 52, color: '#ffffff', weight: 800, align: 'center', font: 'Gantari' },
        { type: 'text', text: 'até 50% OFF em eletro e moda', x: 28, y: 346, w: 492, h: 44, fontSize: 24, color: '#ffffff', weight: 600, align: 'center', font: 'Gantari' },
        { type: 'text', text: 'LOJAS LEBES', x: 28, y: 543, w: 492, h: 28, fontSize: 16, color: '#ffffff', weight: 600, align: 'center', font: 'Gantari' },
      ],
    },
  },
  {
    titulo: 'Grade 3×2 — título de seção à esquerda, slots uniformes com gap 10',
    page: {
      background: 'white',
      kind: 'grid',
      elements: [
        { type: 'text', text: 'ELETRO EM OFERTA', x: 28, y: 28, w: 492, h: 48, fontSize: 30, color: '#e5006d', weight: 800, align: 'left', font: 'Gantari' },
        { type: 'product', productId: 'p1', x: 28, y: 96, w: 157, h: 215, radius: 10, fill: '#ffffff' },
        { type: 'product', productId: 'p2', x: 195, y: 96, w: 157, h: 215, radius: 10, fill: '#ffffff' },
        { type: 'product', productId: 'p4', x: 362, y: 96, w: 158, h: 215, radius: 10, fill: '#ffffff' },
        { type: 'product', productId: 'p3', x: 28, y: 321, w: 157, h: 215, radius: 10, fill: '#ffffff' },
        { type: 'product', productId: 'p12', x: 195, y: 321, w: 157, h: 215, radius: 10, fill: '#ffffff' },
        { type: 'product', productId: 'p5', x: 362, y: 321, w: 158, h: 215, radius: 10, fill: '#ffffff' },
      ],
    },
  },
  {
    titulo: 'Destaque — 1 produto grande + grade 2×2, fundo verde',
    page: {
      background: 'green',
      kind: 'grid',
      elements: [
        { type: 'text', text: 'SUPER DESTAQUE', x: 28, y: 32, w: 320, h: 50, fontSize: 34, color: '#ffffff', weight: 800, align: 'left', font: 'Gantari' },
        { type: 'product', productId: 'p1', x: 28, y: 100, w: 250, h: 436, radius: 12, fill: '#ffffff' },
        { type: 'product', productId: 'p2', x: 288, y: 100, w: 116, h: 213, radius: 10, fill: '#ffffff' },
        { type: 'product', productId: 'p4', x: 414, y: 100, w: 106, h: 213, radius: 10, fill: '#ffffff' },
        { type: 'product', productId: 'p3', x: 288, y: 323, w: 116, h: 213, radius: 10, fill: '#ffffff' },
        { type: 'product', productId: 'p12', x: 414, y: 323, w: 106, h: 213, radius: 10, fill: '#ffffff' },
      ],
    },
  },
];
