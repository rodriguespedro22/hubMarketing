import { X, LayoutGrid, Folder, Star, MessageCircle, LayoutDashboard } from 'lucide-react';

const ITEMS = [
  { id: 'hub',       label: 'Hub de Marketing',    icon: LayoutDashboard, color: '#5CA847' },
  { id: 'studio',    label: 'Estúdio Criativo',     icon: LayoutGrid,      color: '#5CA847' },
  { id: 'campanhas', label: 'Central de Campanhas', icon: Folder,          color: '#E0913A' },
  { id: 'marcas',    label: 'Central das Marcas',   icon: Star,            color: '#3878A8' },
  { id: 'apoio',     label: 'Central de Apoio',     icon: MessageCircle,   color: '#8B5C9E' },
];

export default function HubDrawer({ open, currentView, onNavigate, onClose, isDark }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div
        className="fixed left-0 top-0 bottom-0 z-50 w-[260px] shadow-2xl flex flex-col"
        style={{
          fontFamily: 'Gantari, system-ui, sans-serif',
          background: 'var(--hub-card)',
          borderRight: '1px solid var(--hub-border)',
        }}
      >
        {/* header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--hub-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#5CA847] flex items-center justify-center">
              <span className="text-white font-bold text-[11px]">L</span>
            </div>
            <span
              className="font-bold text-[13px] tracking-wide"
              style={{ color: 'var(--hub-text)' }}
            >
              HUB DE MARKETING
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--hub-surface)]"
            style={{ color: 'var(--hub-text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p
            className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-2"
            style={{ color: 'var(--hub-text-subtle)' }}
          >
            Módulos
          </p>
          {ITEMS.map(({ id, label, icon: Icon, color }) => {
            const active = currentView === id;
            return (
              <button
                key={id}
                onClick={() => { onNavigate(id); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors mb-0.5"
                style={{
                  background: active
                    ? (isDark ? `${color}22` : '#E8F0E4')
                    : 'transparent',
                  color: active ? (isDark ? color : '#3D7A2E') : 'var(--hub-text-muted)',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--hub-surface)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <div
                  className="w-[18px] h-[18px] rounded flex items-center justify-center shrink-0"
                  style={{ background: active ? color : 'transparent' }}
                >
                  <Icon size={11} color={active ? '#fff' : color} />
                </div>
                <span className="text-[13px] font-medium">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* footer */}
        <div
          className="px-5 py-4 border-t"
          style={{ borderColor: 'var(--hub-border)' }}
        >
          <p className="text-[11px]" style={{ color: 'var(--hub-text-subtle)' }}>
            Grupo Lebes · Marketing
          </p>
        </div>
      </div>
    </>
  );
}
