import { ArrowRight, BookOpen, LayoutGrid, Play, Tag, Zap, Layers, CheckCircle } from 'lucide-react';
import HubHeader from '../components/hub/HubHeader';

function fmtDate(ts) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'hoje';
    if (days === 1) return 'há 1 dia';
    if (days < 30) return `há ${days} dias`;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  } catch { return ''; }
}

const FORMATS = [
  {
    id: 'cards',
    formatId: 'square',
    rotulo: 'Cards',
    label: 'Cards',
    sub: 'Posts e peças para redes sociais',
    Icon: LayoutGrid,
    iconBg: '#5CA847',
    lightBg: '#E8F0E4',
    darkBg: '#1A2818',
    tag: null,
    available: true,
  },
  {
    id: 'revista',
    formatId: 'lebes',
    rotulo: 'Revista',
    label: 'Revista',
    sub: 'Catálogo multipágina completo',
    Icon: BookOpen,
    iconBg: '#E0913A',
    lightBg: '#FDF0E4',
    darkBg: '#282016',
    tag: 'Popular',
    tagColor: '#E0913A',
    available: true,
  },
  {
    id: 'pdv',
    formatId: null,
    rotulo: null,
    label: 'PDV · Cartazes',
    sub: 'Cartazes para ponto de venda',
    Icon: Tag,
    iconBg: '#78716c',
    lightBg: '#F5F4F2',
    darkBg: '#232220',
    tag: 'Em breve',
    tagColor: '#78716c',
    available: false,
  },
];

const HERO_TAGS = [
  { label: 'Rápido', Icon: Zap, color: '#E0913A', bg: '#FEF3E2' },
  { label: 'Multipágina', Icon: Layers, color: '#3878A8', bg: '#E8F1F9' },
  { label: 'No padrão de marca', Icon: CheckCircle, color: '#5CA847', bg: '#E8F0E4' },
];

const LABEL_COLORS = {
  'Mídia': '#5CA847',
  'Carro': '#E0913A',
  'Social': '#3878A8',
  'Campanha': '#8B5C9E',
};

function labelColor(label) {
  return LABEL_COLORS[label] || '#5CA847';
}

export default function StudioHome({
  projects,
  onNewProject,
  onOpenProject,
  onShowAllProjects,
  onMenu,
  onBack,
  onHome,
  onNavigate,
  isDark,
  onToggleTheme,
}) {
  const recents = [...(projects || [])]
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .slice(0, 4);

  return (
    <div
      className="hub-view w-full h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--hub-bg)', fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      <HubHeader
        variant="inner"
        title="Estúdio Criativo"
        onMenu={onMenu}
        onBack={onBack}
        onHome={onHome}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      <main className="flex-1 overflow-y-auto">

        {/* Hero banner */}
        <div className="px-4 sm:px-5 py-4 sm:py-5">
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: isDark ? '#0E2A0A' : '#3D7A2E',
              minHeight: 172,
            }}
          >
            {/* Geometric accent circles — deliberate, não blobs de aurora */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute" style={{
                width: 340, height: 340,
                borderRadius: '50%',
                border: '1.5px solid rgba(255,255,255,0.09)',
                right: -70, top: '50%', transform: 'translateY(-50%)',
              }} />
              <div className="absolute" style={{
                width: 210, height: 210,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.06)',
                right: 45, top: '50%', transform: 'translateY(-50%)',
              }} />
              <div className="absolute" style={{
                width: 90, height: 90,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                right: 105, top: '50%', transform: 'translateY(-50%)',
              }} />
            </div>

            <div className="relative px-6 sm:px-10 py-7 sm:py-9">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-8">
                <div className="max-w-sm">
                  <h2 className="text-white font-bold text-[22px] sm:text-[28px] leading-tight mb-2">
                    O que vamos criar hoje?
                  </h2>
                  <p className="text-white/75 text-[13px] sm:text-[14px] mb-5 sm:mb-6 leading-relaxed">
                    Monte cards, revistas e cartazes com a cara da Lebes em poucos cliques.
                  </p>
                  <button
                    onClick={onNewProject}
                    className="inline-flex items-center gap-2 bg-white font-semibold text-[13px] sm:text-[14px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                    style={{ color: '#3D7A2E' }}
                  >
                    Começar a criar <ArrowRight size={13} />
                  </button>
                </div>

                <div className="hidden sm:flex flex-col gap-2.5 shrink-0">
                  {HERO_TAGS.map(({ label, Icon, color, bg }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-2.5"
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: bg }}
                      >
                        <Icon size={13} color={color} />
                      </div>
                      <span className="text-[13px] font-semibold text-[#2E2E2E]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formatos */}
        <div className="px-4 sm:px-5 pb-5">
          <h3
            className="font-semibold text-[17px] sm:text-[18px] mb-3 sm:mb-4"
            style={{ color: 'var(--hub-text)' }}
          >
            Escolha um formato
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {FORMATS.map(({ id, formatId, rotulo, label, sub, Icon, iconBg, lightBg, darkBg, tag, tagColor, available }) => (
              <div
                key={id}
                className={`rounded-2xl p-5 flex flex-col gap-4 ${available ? 'cursor-pointer hover:brightness-95 transition-all' : 'opacity-60'}`}
                style={{ background: isDark ? darkBg : lightBg }}
                onClick={() => available && onNewProject(formatId, rotulo)}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: iconBg }}
                  >
                    <Icon size={18} color="#fff" />
                  </div>
                  {tag && (
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{ background: tagColor }}
                    >
                      {tag}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-[16px] mb-0.5" style={{ color: 'var(--hub-text)' }}>{label}</p>
                  <p className="text-[13px]" style={{ color: 'var(--hub-text-muted)' }}>{sub}</p>
                </div>
                {available && (
                  <button
                    className="self-start flex items-center gap-1.5 font-semibold text-[13px] px-4 py-1.5 rounded-lg text-white"
                    style={{ background: iconBg }}
                    onClick={e => { e.stopPropagation(); onNewProject(formatId, rotulo); }}
                  >
                    Criar <ArrowRight size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recentes */}
        <div className="px-4 sm:px-5 pb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-[17px] sm:text-[18px]" style={{ color: 'var(--hub-text)' }}>
              Continue de onde parou
            </h3>
            {recents.length > 0 && (
              <button
                onClick={onShowAllProjects}
                className="text-[12.5px] font-semibold text-[#5CA847] hover:underline"
              >
                Ver todos →
              </button>
            )}
          </div>

          {recents.length === 0 ? (
            <p className="text-[14px]" style={{ color: 'var(--hub-text-subtle)' }}>
              Nenhum projeto salvo ainda. Crie seu primeiro projeto!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {recents.map(prj => {
                const labels = Array.isArray(prj.labels) ? prj.labels : [];
                return (
                  <button
                    key={prj.id}
                    onClick={() => onOpenProject(prj)}
                    className="rounded-xl p-3.5 sm:p-4 text-left transition-all border"
                    style={{
                      background: 'var(--hub-card)',
                      borderColor: 'var(--hub-border)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#5CA84760'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hub-border)'}
                  >
                    {labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {labels.map(lbl => (
                          <span
                            key={lbl}
                            className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                            style={{ background: labelColor(lbl) }}
                          >
                            {lbl}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="font-semibold text-[13px] sm:text-[14px] truncate" style={{ color: 'var(--hub-text)' }}>
                      {prj.title || 'Sem título'}
                    </p>
                    <p className="text-[11px] sm:text-[12px] mt-0.5" style={{ color: 'var(--hub-text-subtle)' }}>
                      {fmtDate(prj.updatedAt)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tutoriais */}
        <div className="px-4 sm:px-5 pb-8">
          <div
            className="rounded-2xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{ background: isDark ? '#1A3014' : '#3D7A2E' }}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Play size={15} color="#fff" fill="#fff" />
              </div>
              <div>
                <p className="font-semibold text-white text-[14px] sm:text-[15px]">Tutoriais e dicas</p>
                <p className="text-white/70 text-[12px] sm:text-[13px]">Aprofunde seus materiais no padrão Lebes por setor</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('apoio')}
              className="flex items-center gap-1.5 text-white font-semibold text-[13px] bg-white/15 px-4 py-2 rounded-lg hover:bg-white/25 transition-colors self-start sm:self-auto shrink-0"
            >
              Explorar tutoriais <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
