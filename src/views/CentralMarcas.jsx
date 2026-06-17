import HubHeader from '../components/hub/HubHeader';

const LOJAS_LEBES = {
  tag: 'VAREJO',
  name: 'Lojas Lebes',
  cores: [
    { hex: '#5CA847', label: 'Verde' },
    { hex: '#3D7A2E', label: 'Verde Escuro' },
    { hex: '#E0913A', label: 'Laranja' },
    { hex: '#1A1A1A', label: 'Preto' },
    { hex: '#F7F6F2', label: 'Fundo', border: true },
  ],
  tipografia: 'Gantari',
  tomDeVoz: [
    'Próximo — falamos como gente',
    'Direto — foco na oferta',
    'Coloroso — reflexo do atendimento',
    'Confiável — preço sempre correto',
  ],
};

const GRUPO_LEBES = {
  tag: 'CORPORATIVO',
  name: 'Grupo Lebes',
  cores: [
    { hex: '#2E6B2E', label: 'Verde Corp.' },
    { hex: '#1A3D1A', label: 'Verde Escuro' },
    { hex: '#8BC34A', label: 'Verde Claro' },
    { hex: '#1A1A1A', label: 'Preto' },
    { hex: '#FFFFFF', label: 'Branco', border: true },
  ],
  tipografia: 'Gantari',
  tomDeVoz: [
    'Institucional — voz do grupo',
    'Sólida — transmite confiança',
    'Visionária — olha pro futuro',
    'Responsável — compromisso e ética',
  ],
};

function BrandCard({ data }) {
  const { tag, name, cores, tipografia, tomDeVoz } = data;
  return (
    <div
      className="rounded-2xl p-7 flex flex-col gap-5"
      style={{ background: 'var(--hub-card)' }}
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-semibold tracking-wider uppercase"
          style={{ color: 'var(--hub-text-subtle)' }}
        >
          {tag}
        </span>
        <div className="w-6 h-6 rounded bg-[#5CA847]" />
      </div>

      <h3 className="font-bold text-[18px]" style={{ color: 'var(--hub-text)' }}>{name}</h3>

      {/* LOGO */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--hub-text-subtle)' }}>LOGO</p>
        <div
          className="rounded-xl flex items-center justify-center py-6"
          style={{ background: 'var(--hub-surface)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#5CA847] flex items-center justify-center">
              <span className="text-white font-bold text-[11px]">L</span>
            </div>
            <span className="font-semibold text-[15px]" style={{ color: 'var(--hub-text)' }}>{name}</span>
          </div>
        </div>
      </div>

      {/* CORES */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--hub-text-subtle)' }}>CORES</p>
        <div className="flex gap-2">
          {cores.map(({ hex, border }) => (
            <div key={hex} className="flex flex-col items-center gap-1">
              <div
                className="w-11 h-11 rounded-lg"
                style={{
                  background: hex,
                  border: border ? '1.5px solid var(--hub-border)' : undefined,
                }}
              />
              <span className="text-[9px] text-center leading-tight" style={{ color: 'var(--hub-text-subtle)' }}>
                {hex}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TIPOGRAFIA */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--hub-text-subtle)' }}>TIPOGRAFIA</p>
        <div className="flex items-baseline gap-3">
          <span className="font-bold text-[22px]" style={{ color: 'var(--hub-text)' }}>{tipografia}</span>
          <span className="text-[13px]" style={{ color: 'var(--hub-text-subtle)' }}>Aa Bb Cc 0123456789</span>
        </div>
      </div>

      {/* TOM DE VOZ */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--hub-text-subtle)' }}>TOM DE VOZ</p>
        <ul className="flex flex-col gap-1.5">
          {tomDeVoz.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[13px]" style={{ color: 'var(--hub-text)' }}>
              <span className="text-[#5CA847] mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function CentralMarcas({ onMenu, onBack, onHome, isDark, onToggleTheme }) {
  return (
    <div
      className="w-full h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--hub-bg)', fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      <HubHeader
        variant="inner"
        title="Central das Marcas"
        onMenu={onMenu}
        onBack={onBack}
        onHome={onHome}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      <main className="flex-1 overflow-y-auto px-10 py-8">
        <h1 className="font-bold text-[28px] mb-1" style={{ color: 'var(--hub-text)' }}>
          Central das Marcas
        </h1>
        <p className="text-[14px] font-light mb-8" style={{ color: 'var(--hub-text-muted)' }}>
          Os fundamentos visuais e de comunicação das marcas do grupo
        </p>

        <div className="grid grid-cols-2 gap-5 max-w-[1360px]">
          <BrandCard data={LOJAS_LEBES} />
          <BrandCard data={GRUPO_LEBES} />
        </div>
      </main>
    </div>
  );
}
