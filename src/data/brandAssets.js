// ============================================================
// BRAND ASSETS — imagens-padrão da identidade Lebes
// ------------------------------------------------------------
// Imagens reutilizáveis que o motor de IA (e o usuário) podem
// inserir nas páginas. Ficam embutidas como data-URI (SVG) para
// não dependerem de rede nem de upload.
//
// >>> TROCA DA LOGO OFICIAL <<<
// Quando o arquivo oficial da logo chegar, basta substituir o
// valor de LOGO_LEBES por um data-URI do arquivo real, por ex.:
//   export const LOGO_LEBES = 'data:image/png;base64,iVBORw0K...';
// Nada mais precisa mudar: o motor e o catálogo já referenciam
// esta constante. As proporções recomendadas estão em
// BRAND_ASSETS[].ratio (largura/altura) para posicionamento.
// ============================================================

import { COLORS } from '../constants/pageConfig';

// Logo placeholder — "LEBES" no verde da marca dentro de um selo.
// Proporção ~3:1 (largura:altura). SUBSTITUIR pelo arquivo oficial.
const _logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100">
  <rect x="2" y="2" width="296" height="96" rx="14" fill="#ffffff" stroke="${COLORS.green}" stroke-width="4"/>
  <text x="150" y="58" text-anchor="middle"
    font-family="Gantari, sans-serif" font-size="46" font-weight="800"
    letter-spacing="2" fill="${COLORS.green}">LEBES</text>
  <text x="150" y="80" text-anchor="middle"
    font-family="Gantari, sans-serif" font-size="13" font-weight="600"
    letter-spacing="6" fill="${COLORS.pinkSolid}">LOJAS LEBES</text>
</svg>`;

// Selo redondo de oferta — útil para capas e destaques.
const _seloSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="92" fill="${COLORS.pinkSolid}" stroke="#ffffff" stroke-width="6"/>
  <text x="100" y="88" text-anchor="middle" font-family="Gantari, sans-serif"
    font-size="26" font-weight="800" fill="#ffffff">OFERTA</text>
  <text x="100" y="128" text-anchor="middle" font-family="Gantari, sans-serif"
    font-size="40" font-weight="800" fill="#ffd400">★</text>
</svg>`;

const toDataUri = (svg) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

export const LOGO_LEBES = toDataUri(_logoSvg);
export const SELO_OFERTA = toDataUri(_seloSvg);

// Catálogo de imagens-padrão exibíveis (ex.: numa aba "Marca" do catálogo
// ou usadas pelo motor). ratio = w/h, para posicionamento proporcional.
export const BRAND_ASSETS = [
  { id: 'logo', name: 'Logo Lebes', src: LOGO_LEBES, ratio: 3,  brand: true },
  { id: 'selo', name: 'Selo Oferta', src: SELO_OFERTA, ratio: 1, brand: true },
];
