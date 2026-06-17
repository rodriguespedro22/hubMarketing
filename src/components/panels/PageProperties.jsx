import { Grid2x2, ImageIcon, Type } from 'lucide-react';
import { normalizeBackground } from '../../constants/background';

function detectGrid(elements) {
  const products = elements.filter(e => e.type === 'product');
  if (!products.length) return null;
  const round = v => Math.round(v / 15) * 15;
  const cols = new Set(products.map(e => round(e.x))).size;
  const rows = new Set(products.map(e => round(e.y))).size;
  return { cols, rows, total: products.length };
}

function bgBadge(bg) {
  const b = normalizeBackground(bg);
  if (b.type === 'color' && b.value === '#ffffff') return { label: 'do projeto', color: 'text-emerald-700 bg-emerald-50' };
  return { label: 'editado', color: 'text-amber-700 bg-amber-50' };
}

function bgSwatch(bg) {
  const b = normalizeBackground(bg);
  if (b.type === 'image') return { style: { background: '#ccc' } };
  if (b.type === 'gradient') return { style: { background: b.value } };
  return { style: { background: b.value || '#fff' } };
}

export default function PageProperties({ page, pageIndex, onOpenBg }) {
  const elements = page.elements || [];
  const bg = bgBadge(page.background);
  const swatch = bgSwatch(page.background);

  const hasHeader = elements.some(e => e.type === 'text');
  const grid = detectGrid(elements);

  const productEls = elements.filter(e => e.type === 'product');
  const filled = productEls.filter(e => e.productId).length;
  const total = productEls.length;
  const fillPct = total > 0 ? (filled / total) * 100 : 0;

  return (
    <div className="p-4 space-y-5 overflow-y-auto">
      {/* Seção: página */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-semibold mb-3">
          Página {pageIndex + 1}
        </p>

        <div className="space-y-1">
          {/* Fundo */}
          <button
            onClick={onOpenBg}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-stone-50 transition group text-left"
          >
            <span
              className="w-5 h-5 rounded border border-stone-200 shrink-0"
              style={swatch.style}
            />
            <span className="flex-1 text-sm text-stone-700 font-medium">Fundo</span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${bg.color}`}>
              {bg.label}
            </span>
          </button>

          {/* Cabeçalho */}
          <div className="w-full flex items-center gap-3 px-2 py-2 rounded-lg">
            <span className="w-5 h-5 rounded border border-stone-200 bg-stone-100 shrink-0 flex items-center justify-center">
              <Type size={10} className="text-stone-400" />
            </span>
            <span className="flex-1 text-sm text-stone-700 font-medium">Cabeçalho</span>
            {hasHeader
              ? <span className="text-[11px] font-medium px-2 py-0.5 rounded-full text-amber-700 bg-amber-50">editado</span>
              : <span className="text-[11px] font-medium px-2 py-0.5 rounded-full text-stone-400 bg-stone-100">vazio</span>
            }
          </div>

          {/* Grade */}
          <div className="w-full flex items-center gap-3 px-2 py-2 rounded-lg">
            <span className="w-5 h-5 rounded border border-stone-200 bg-stone-100 shrink-0 flex items-center justify-center">
              <Grid2x2 size={10} className="text-stone-400" />
            </span>
            <span className="flex-1 text-sm text-stone-700 font-medium">Grade</span>
            {grid
              ? <span className="text-[11px] font-medium px-2 py-0.5 rounded-full text-stone-500 bg-stone-100">{grid.cols} × {grid.rows}</span>
              : <span className="text-[11px] font-medium px-2 py-0.5 rounded-full text-stone-400 bg-stone-100">sem grade</span>
            }
          </div>
        </div>
      </div>

      {/* Seção: preenchimento */}
      {total > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-semibold mb-3">
            Preenchimento
          </p>
          <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${fillPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500">
              {filled} de {total} slots preenchidos nesta página
            </p>
            <span className="text-xs font-semibold text-stone-600">{filled}/{total}</span>
          </div>
        </div>
      )}

      {total === 0 && (
        <div className="flex flex-col items-center gap-2 py-6 text-stone-300">
          <ImageIcon size={28} strokeWidth={1.2} />
          <p className="text-xs text-center text-stone-400">Nenhum slot de produto nesta página</p>
        </div>
      )}
    </div>
  );
}
