import { ArrowRight, LayoutGrid, Folder, Star, MessageCircle, Menu, Moon, Sun } from 'lucide-react';

const MODULES = [
  {
    id: 'studio',
    title: 'Estúdio Criativo',
    desc: 'Crie cards, revistas e cartazes no padrão da marca.',
    lightBg: '#E8F0E4',
    darkBg: '#1A2818',
    iconBg: '#5CA847',
    titleColor: { light: '#2E3D27', dark: '#B8D4B0' },
    descColor: { light: '#5A6B50', dark: '#7A9A72' },
    Icon: LayoutGrid,
  },
  {
    id: 'campanhas',
    title: 'Central de Campanhas',
    desc: 'Repositório de materiais e peças para download.',
    lightBg: '#FDF0E4',
    darkBg: '#282016',
    iconBg: '#E0913A',
    titleColor: { light: '#6B4A23', dark: '#D4A472' },
    descColor: { light: '#8A6840', dark: '#9A7850' },
    Icon: Folder,
  },
  {
    id: 'marcas',
    title: 'Central das Marcas',
    desc: 'Logo, cores, tipografia e tom de voz da Lebes.',
    lightBg: '#E4EEF5',
    darkBg: '#162030',
    iconBg: '#3878A8',
    titleColor: { light: '#23456B', dark: '#7AAAD4' },
    descColor: { light: '#406084', dark: '#608AA8' },
    Icon: Star,
  },
  {
    id: 'apoio',
    title: 'Central de Apoio',
    desc: 'Tutoriais, FAQ e contatos importantes do time.',
    lightBg: '#F0E8F3',
    darkBg: '#201428',
    iconBg: '#8B5C9E',
    titleColor: { light: '#4A2D56', dark: '#C09AD0' },
    descColor: { light: '#6A4A78', dark: '#8A6A98' },
    Icon: MessageCircle,
  },
];

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
      <div
        className="relative rounded-full transition-colors shrink-0"
        style={{ width: 32, height: 18, background: isDark ? '#5CA847' : 'var(--hub-border)' }}
      >
        <div
          className="absolute top-[3px] w-3 h-3 bg-white rounded-full shadow-sm transition-transform"
          style={{ transform: isDark ? 'translateX(17px)' : 'translateX(3px)' }}
        />
      </div>
    </button>
  );
}

function ModuleBlock({ module, isDark, onClick }) {
  const { title, desc, lightBg, darkBg, iconBg, titleColor, descColor, Icon } = module;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 px-5 py-5 rounded-2xl text-left transition-all hover:brightness-95 active:scale-[0.98]"
      style={{ background: isDark ? darkBg : lightBg }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={20} color="#fff" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="font-bold text-[17px] leading-tight mb-0.5"
          style={{ color: isDark ? titleColor.dark : titleColor.light }}
        >
          {title}
        </p>
        <p
          className="text-[12.5px] leading-snug"
          style={{ color: isDark ? descColor.dark : descColor.light }}
        >
          {desc}
        </p>
      </div>

      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <ArrowRight size={14} color="#fff" />
      </div>
    </button>
  );
}

export default function HubHome({ onNavigate, onMenu, onLogin, isDark, onToggleTheme }) {
  return (
    <div
      className="hub-view w-full h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--hub-bg)', fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      {/* Header */}
      <header
        className="shrink-0 flex items-center justify-between px-4 sm:px-6 border-b"
        style={{ height: 64, background: 'var(--hub-header)', borderColor: 'var(--hub-border)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={onMenu}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--hub-surface)]"
            style={{ color: 'var(--hub-text-muted)' }}
          >
            <Menu size={17} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#5CA847] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-[11px]">L</span>
            </div>
            <span
              className="font-bold tracking-wide hidden sm:block"
              style={{ fontSize: 14, color: 'var(--hub-text)' }}
            >
              HUB DE MARKETING
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onLogin && (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 border font-semibold text-[13px] px-[14px] py-[7px] rounded-[20px] transition-colors"
              style={{
                background: 'var(--hub-card)',
                borderColor: 'var(--hub-border)',
                color: 'var(--hub-text)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--hub-surface)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--hub-card)'; }}
            >
              Entrar <ArrowRight size={13} />
            </button>
          )}
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-y-auto flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-[860px]">

          {/* eyebrow */}
          <p
            className="font-semibold uppercase tracking-widest text-[11.5px] text-center mb-3"
            style={{ color: '#5CA847' }}
          >
            GRUPO LEBES / MARKETING
          </p>

          {/* main title */}
          <h1 className="text-center font-bold leading-none mb-2.5 text-[40px] sm:text-[56px] lg:text-[64px]">
            <span style={{ color: 'var(--hub-text)' }}>HUB de </span>
            <span style={{ color: '#5CA847' }}>Marketing</span>
          </h1>

          {/* subtitle */}
          <p
            className="text-center font-light text-[15px] sm:text-[17px] mb-10"
            style={{ color: 'var(--hub-text-muted)' }}
          >
            Tudo o que o time de marketing precisa, em um só lugar
          </p>

          {/* grid 2×2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {MODULES.map(m => (
              <ModuleBlock
                key={m.id}
                module={m}
                isDark={isDark}
                onClick={() => onNavigate(m.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
