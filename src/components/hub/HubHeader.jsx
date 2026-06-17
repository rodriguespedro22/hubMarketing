import { ArrowLeft, Home, Menu, Sun, Moon } from 'lucide-react';

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors"
      style={{ background: 'var(--hub-surface)', color: 'var(--hub-text-muted)' }}
    >
      {isDark
        ? <Sun size={14} style={{ color: '#E0913A' }} />
        : <Moon size={14} style={{ color: '#3878A8' }} />}
      {/* pill toggle */}
      <div
        className="relative rounded-full transition-colors shrink-0"
        style={{
          width: 32,
          height: 18,
          background: isDark ? '#5CA847' : 'var(--hub-border)',
        }}
      >
        <div
          className="absolute top-[3px] w-3 h-3 bg-white rounded-full shadow-sm transition-transform"
          style={{ transform: isDark ? 'translateX(17px)' : 'translateX(3px)' }}
        />
      </div>
    </button>
  );
}

// variant='hub'   → sem botões back/home (HubHome e StudioHome)
// variant='inner' → exibe back e home (demais módulos)
export default function HubHeader({
  variant = 'inner',
  title,
  onMenu,
  onBack,
  onHome,
  nav,
  rightSlot,
  isDark,
  onToggleTheme,
}) {
  return (
    <header
      className="shrink-0 flex items-center justify-between px-4 sm:px-6 border-b"
      style={{
        height: 64,
        fontFamily: 'Gantari, system-ui, sans-serif',
        background: 'var(--hub-header)',
        borderColor: 'var(--hub-border)',
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onMenu}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--hub-surface)] shrink-0"
          style={{ color: 'var(--hub-text-muted)' }}
        >
          <Menu size={17} />
        </button>

        {variant === 'inner' && (
          <>
            <button
              onClick={onBack}
              className="w-7 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--hub-surface)] shrink-0"
              style={{ color: 'var(--hub-text-muted)' }}
            >
              <ArrowLeft size={15} />
            </button>
            <button
              onClick={onHome}
              className="w-7 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--hub-surface)] shrink-0"
              style={{ color: 'var(--hub-text-muted)' }}
            >
              <Home size={15} />
            </button>
          </>
        )}

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#5CA847] shrink-0 flex items-center justify-center">
            <span className="text-white font-bold text-[11px]">L</span>
          </div>
          <span
            className="font-bold hidden sm:block truncate"
            style={{ fontSize: 14, color: 'var(--hub-text)' }}
          >
            {title}
          </span>
        </div>
      </div>

      {/* CENTER nav (optional) */}
      {nav && <div className="hidden md:flex items-center gap-1">{nav}</div>}

      {/* RIGHT */}
      <div className="flex items-center gap-2 shrink-0">
        {rightSlot}
        {onToggleTheme && (
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        )}
      </div>
    </header>
  );
}
