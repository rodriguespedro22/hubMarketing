import { useRef, useEffect } from 'react';
import { ArrowRight, BookOpen, LayoutGrid, Play, Tag, Zap, Layers, CheckCircle } from 'lucide-react';
import HubHeader from '../components/hub/HubHeader';

function HeroAurora({ isDark }) {
  const grainRef = useRef(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    function draw() {
      const w = canvas.width, h = canvas.height;
      if (!w || !h) { raf = requestAnimationFrame(draw); return; }
      const id = ctx.createImageData(w, h);
      const d  = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 20;
      }
      ctx.putImageData(id, 0, 0);
      raf = requestAnimationFrame(draw);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const light = !isDark;

  return (
    <>
      {/* Orb esquerdo — verde claro */}
      <div className="absolute pointer-events-none" style={{
        width: 520, height: 520,
        borderRadius: '50%',
        background: light
          ? 'radial-gradient(circle, rgba(180,240,140,0.55) 0%, transparent 65%)'
          : 'radial-gradient(circle, rgba(80,155,55,0.60) 0%, transparent 65%)',
        left: -80, top: '50%',
        transform: 'translateY(-50%)',
        filter: 'blur(2px)',
        animation: 'aurora-1 13s ease-in-out infinite',
      }} />

      {/* Orb direito — verde escuro */}
      <div className="absolute pointer-events-none" style={{
        width: 460, height: 460,
        borderRadius: '50%',
        background: light
          ? 'radial-gradient(circle, rgba(28,85,18,0.50) 0%, transparent 65%)'
          : 'radial-gradient(circle, rgba(12,40,8,0.70) 0%, transparent 65%)',
        right: -60, top: '50%',
        transform: 'translateY(-50%)',
        filter: 'blur(2px)',
        animation: 'aurora-2 17s ease-in-out infinite',
      }} />

      {/* Orb âmbar — sotaque, canto inferior central */}
      <div className="absolute pointer-events-none" style={{
        width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(224,145,58,0.28) 0%, transparent 65%)',
        right: '22%', bottom: -80,
        filter: 'blur(4px)',
        animation: 'aurora-3 10s ease-in-out infinite',
      }} />

      {/* Orb central topo — highlight */}
      <div className="absolute pointer-events-none" style={{
        width: 380, height: 380,
        borderRadius: '50%',
        background: light
          ? 'radial-gradient(circle, rgba(210,255,170,0.38) 0%, transparent 60%)'
          : 'radial-gradient(circle, rgba(95,165,72,0.42) 0%, transparent 60%)',
        left: '33%', top: '50%',
        transform: 'translateY(-65%)',
        filter: 'blur(2px)',
        animation: 'aurora-4 22s ease-in-out infinite',
      }} />

      {/* Grain */}
      <canvas
        ref={grainRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'soft-light', opacity: 0.45 }}
      />
    </>
  );
}

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

  const nav = (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onNavigate('marcas')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] transition-colors"
        style={{ color: 'var(--hub-text-muted)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--hub-surface)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        Central das Marcas
      </button>
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold"
        style={{ color: '#3D7A2E', background: isDark ? '#1A2818' : '#E8F0E4' }}
      >
        <Play size={12} fill="#3D7A2E" />
        Estúdio Criativo
      </div>
      <button
        onClick={() => onNavigate('campanhas')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] transition-colors"
        style={{ color: 'var(--hub-text-muted)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--hub-surface)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        Central de Campanhas
      </button>
    </div>
  );

  return (
    <div
      className="w-full h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--hub-bg)', fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      <HubHeader
        variant="hub"
        title="Estúdio Criativo"
        onMenu={onMenu}
        onBack={onBack}
        onHome={onHome}
        nav={nav}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      <main className="flex-1 overflow-y-auto">

        {/* Hero banner */}
        <div className="px-5 py-5">
          <div
            className="relative overflow-hidden rounded-2xl px-10 py-9"
            style={{
              background: isDark ? '#0E2A0A' : '#4A9A3C',
              minHeight: 200,
            }}
          >
            <HeroAurora isDark={isDark} />
            <div className="absolute right-48 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-[40px] border-white/10 pointer-events-none" />
            <div className="absolute right-32 top-1/2 -translate-y-1/2 w-44 h-44 rounded-full border-[30px] border-white/10 pointer-events-none" />

            <div className="flex items-center justify-between gap-8 relative">
              <div className="max-w-sm">
                <h2 className="text-white font-bold text-[28px] leading-tight mb-2">
                  O que vamos criar hoje?
                </h2>
                <p className="text-white/80 text-[14px] mb-6 leading-relaxed">
                  Monte cards, revistas e cartazes com a cara da Lebes em poucos cliques.
                </p>
                <button
                  onClick={onNewProject}
                  className="inline-flex items-center gap-2 bg-white font-semibold text-[14px] px-5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                  style={{ color: '#3D7A2E' }}
                >
                  Começar a criar <ArrowRight size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-3 shrink-0 mr-10">
                {HERO_TAGS.map(({ label, Icon, color, bg }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-2.5 shadow-sm"
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

        {/* Formatos */}
        <div className="px-5 pb-5">
          <h3
            className="font-semibold text-[18px] mb-4"
            style={{ color: 'var(--hub-text)' }}
          >
            Escolha um formato
          </h3>
          <div className="grid grid-cols-3 gap-4">
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
        <div className="px-5 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[18px]" style={{ color: 'var(--hub-text)' }}>
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
            <div className="grid grid-cols-4 gap-3">
              {recents.map(prj => {
                const labels = Array.isArray(prj.labels) ? prj.labels : [];
                return (
                  <button
                    key={prj.id}
                    onClick={() => onOpenProject(prj)}
                    className="rounded-xl p-4 text-left transition-all border"
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
                    <p className="font-semibold text-[14px] truncate" style={{ color: 'var(--hub-text)' }}>
                      {prj.title || 'Sem título'}
                    </p>
                    <p className="text-[12px] mt-0.5" style={{ color: 'var(--hub-text-subtle)' }}>
                      {fmtDate(prj.updatedAt)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tutoriais */}
        <div className="px-5 pb-8">
          <div
            className="rounded-2xl px-8 py-5 flex items-center justify-between"
            style={{ background: isDark ? '#1A3014' : '#3D7A2E' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Play size={15} color="#fff" fill="#fff" />
              </div>
              <div>
                <p className="font-semibold text-white text-[15px]">Tutoriais e dicas</p>
                <p className="text-white/70 text-[13px]">Aprofunde seus materiais no padrão Lebes por setor</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('apoio')}
              className="flex items-center gap-1.5 text-white font-semibold text-[13px] bg-white/15 px-4 py-2 rounded-lg hover:bg-white/25 transition-colors"
            >
              Explorar tutoriais <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
