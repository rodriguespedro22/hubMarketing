import { Award, Layout, Pencil, Settings, ShoppingBag, Sparkles, UploadCloud } from 'lucide-react';

const TOOLS = [
  { id: 'modelos',   label: 'Modelos',   Icon: Layout },
  { id: 'elementos', label: 'Elementos', Icon: Pencil },
  { id: 'produtos',  label: 'Produtos',  Icon: ShoppingBag },
  { id: 'marca',     label: 'Marca',     Icon: Award },
  { id: 'uploads',   label: 'Galeria',   Icon: UploadCloud },
  { id: 'ia',        label: 'IA',        Icon: Sparkles },
];

export default function MobileBottomBar({ activePanel, onSelect, isDark, hasSelection }) {
  const tools = hasSelection
    ? [{ id: '__props', label: 'Editar', Icon: Settings }, ...TOOLS]
    : TOOLS;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t ${
        isDark ? 'bg-stone-950 border-stone-800' : 'bg-white border-[#e5e4df]'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-stretch overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {tools.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(activePanel === id ? null : id)}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2.5 min-w-[64px] flex-1 shrink-0 transition-colors ${
              activePanel === id
                ? 'text-emerald-500'
                : isDark
                  ? 'text-stone-400'
                  : 'text-[#808080]'
            }`}
          >
            <Icon size={22} strokeWidth={1.75} />
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
