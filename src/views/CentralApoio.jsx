import { useState } from 'react';
import { ArrowRight, Play, MessageSquare, Mail, ChevronRight, Phone } from 'lucide-react';
import HubHeader from '../components/hub/HubHeader';

const OPTIONS = [
  {
    id: 'tutoriais',
    title: 'Tutoriais',
    desc: 'Vídeos, dicas e guias por setor: redes sociais, comunicação e campanhas',
    Icon: Play,
    lightBg: '#E8F0E4',
    darkBg: '#1A2818',
    iconBg: '#5CA847',
    titleColor: { light: '#2E3D27', dark: '#B8D4B0' },
    descColor: { light: '#5A6B50', dark: '#7A9A72' },
    linkColor: '#5CA847',
  },
  {
    id: 'faq',
    title: 'FAQ',
    desc: 'Não achou o que precisava? Mande sua dúvida pro time de marketing',
    Icon: MessageSquare,
    lightBg: '#FDF0E4',
    darkBg: '#282016',
    iconBg: '#E0913A',
    titleColor: { light: '#6B4A23', dark: '#D4A472' },
    descColor: { light: '#8A6840', dark: '#9A7850' },
    linkColor: '#E0913A',
  },
  {
    id: 'contatos',
    title: 'Contatos',
    desc: 'Emails e telefones dos setores e pessoas importantes do time',
    Icon: Mail,
    lightBg: '#E4EEF5',
    darkBg: '#162030',
    iconBg: '#3878A8',
    titleColor: { light: '#23456B', dark: '#7AAAD4' },
    descColor: { light: '#406084', dark: '#608AA8' },
    linkColor: '#3878A8',
  },
];

const TUTORIAIS = [
  { id: 1, sector: 'Redes Sociais', title: 'Como criar um card para Instagram no padrão Lebes', duration: '8 min' },
  { id: 2, sector: 'Redes Sociais', title: 'Tamanhos e formatos para Stories e Feed', duration: '5 min' },
  { id: 3, sector: 'Comunicação', title: 'Hierarquia de oferta: preço, produto e marca', duration: '12 min' },
  { id: 4, sector: 'Campanhas', title: 'Como usar o Estúdio Criativo para criar revistas', duration: '15 min' },
  { id: 5, sector: 'Campanhas', title: 'Exportando peças para gráfica (PDF/CMYK)', duration: '7 min' },
  { id: 6, sector: 'Comunicação', title: 'Tom de voz Lebes: como escrever textos de oferta', duration: '10 min' },
];

const CONTATOS = [
  { name: 'Coordenação de Marketing', email: 'marketing@lebes.com.br', phone: '(51) 3300-0000' },
  { name: 'Criação & Design', email: 'criacao@lebes.com.br', phone: '(51) 3300-0001' },
  { name: 'Trade Marketing', email: 'trade@lebes.com.br', phone: '(51) 3300-0002' },
  { name: 'Mídias Sociais', email: 'social@lebes.com.br', phone: '(51) 3300-0003' },
  { name: 'Campanhas & Promoções', email: 'campanhas@lebes.com.br', phone: '(51) 3300-0004' },
];

const SECTOR_COLORS = {
  'Redes Sociais': '#5CA847',
  'Comunicação': '#3878A8',
  'Campanhas': '#E0913A',
};

function TutoriaisContent() {
  const sectors = [...new Set(TUTORIAIS.map(t => t.sector))];
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      {sectors.map(sector => (
        <div key={sector}>
          <h3 className="font-semibold text-[15px] mb-3 flex items-center gap-2" style={{ color: 'var(--hub-text)' }}>
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: SECTOR_COLORS[sector] || '#5CA847' }}
            />
            {sector}
          </h3>
          <div className="flex flex-col gap-2">
            {TUTORIAIS.filter(t => t.sector === sector).map(tut => (
              <div
                key={tut.id}
                className="flex items-center gap-4 rounded-xl p-4 border cursor-pointer transition-all group"
                style={{ background: 'var(--hub-card)', borderColor: 'var(--hub-border)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#5CA84760'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hub-border)'}
              >
                <div className="w-10 h-10 rounded-lg bg-[#E8F0E4] flex items-center justify-center shrink-0">
                  <Play size={14} color="#5CA847" fill="#5CA847" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[14px] truncate" style={{ color: 'var(--hub-text)' }}>{tut.title}</p>
                  <p className="text-[12px]" style={{ color: 'var(--hub-text-subtle)' }}>{tut.duration}</p>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--hub-text-subtle)' }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FAQContent() {
  const [open, setOpen] = useState(null);
  const FAQS = [
    { q: 'Como acesso o Estúdio Criativo?', a: 'No Hub de Marketing, clique em "Estúdio Criativo". Você poderá criar cards, revistas e cartazes no padrão Lebes.' },
    { q: 'Posso exportar as peças em PDF?', a: 'Sim! No editor, use o botão "Exportar" no topo e selecione PDF. O sistema gera um arquivo pronto para impressão.' },
    { q: 'Onde encontro os materiais das campanhas?', a: 'Na Central de Campanhas você encontra todos os arquivos (logos, áudios, kits) organizados por categoria.' },
    { q: 'Qual fonte devo usar nas comunicações?', a: 'A fonte padrão da Lebes é Gantari. Consulte a Central das Marcas para ver o guia completo de tipografia.' },
    { q: 'Como solicitar um novo material?', a: 'Entre em contato com o time de Criação & Design pelo email criacao@lebes.com.br ou use o formulário na aba Contatos.' },
  ];
  return (
    <div className="flex flex-col gap-2 max-w-3xl mx-auto">
      {FAQS.map((faq, i) => (
        <div key={i} className="rounded-xl border overflow-hidden" style={{ background: 'var(--hub-card)', borderColor: 'var(--hub-border)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left transition-colors"
            style={{ color: 'var(--hub-text)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hub-surface)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span className="font-medium text-[14px]">{faq.q}</span>
            <ChevronRight
              size={16}
              style={{
                color: 'var(--hub-text-subtle)',
                transform: open === i ? 'rotate(90deg)' : undefined,
                transition: 'transform 0.15s',
                flexShrink: 0,
              }}
            />
          </button>
          {open === i && (
            <div
              className="px-5 pb-5 pt-0 text-[13px] leading-relaxed"
              style={{ borderTop: '1px solid var(--hub-border)', color: 'var(--hub-text-muted)' }}
            >
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ContatosContent() {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
      {CONTATOS.map(c => (
        <div
          key={c.name}
          className="rounded-xl p-5 border"
          style={{ background: 'var(--hub-card)', borderColor: 'var(--hub-border)' }}
        >
          <p className="font-semibold text-[14px] mb-3" style={{ color: 'var(--hub-text)' }}>{c.name}</p>
          <div className="flex flex-col gap-1.5">
            <a
              href={`mailto:${c.email}`}
              className="flex items-center gap-2 text-[13px] hover:underline"
              style={{ color: '#3878A8' }}
            >
              <Mail size={13} /> {c.email}
            </a>
            <div className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--hub-text-muted)' }}>
              <Phone size={13} /> {c.phone}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CentralApoio({ onMenu, onBack, onHome, isDark, onToggleTheme }) {
  const [section, setSection] = useState(null);

  if (!section) {
    return (
      <div
        className="w-full h-screen flex flex-col overflow-hidden"
        style={{ background: 'var(--hub-bg)', fontFamily: 'Gantari, system-ui, sans-serif' }}
      >
        <HubHeader
          variant="inner"
          title="Central de Apoio"
          onMenu={onMenu}
          onBack={onBack}
          onHome={onHome}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
        />

        <main className="flex-1 flex items-center justify-center px-10">
          <div className="text-center w-full max-w-[1040px]">
            <h1 className="font-bold text-[34px] mb-2" style={{ color: 'var(--hub-text)' }}>
              Central de Apoio
            </h1>
            <p className="text-[15px] font-light mb-12" style={{ color: 'var(--hub-text-muted)' }}>
              Como podemos te ajudar? Escolha uma opção abaixo
            </p>

            <div className="grid grid-cols-3 gap-4">
              {OPTIONS.map(({ id, title, desc, Icon, lightBg, darkBg, iconBg, titleColor, descColor, linkColor }) => (
                <div
                  key={id}
                  className="rounded-2xl p-7 flex flex-col gap-4 text-left cursor-pointer hover:brightness-95 transition-all"
                  style={{ background: isDark ? darkBg : lightBg }}
                  onClick={() => setSection(id)}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: iconBg }}
                  >
                    <Icon size={20} color="#fff" fill={id === 'tutoriais' ? '#fff' : undefined} />
                  </div>
                  <div>
                    <p className="font-bold text-[18px] mb-1" style={{ color: isDark ? titleColor.dark : titleColor.light }}>
                      {title}
                    </p>
                    <p className="text-[13px] leading-relaxed" style={{ color: isDark ? descColor.dark : descColor.light }}>
                      {desc}
                    </p>
                  </div>
                  <button
                    className="self-start flex items-center gap-1.5 font-semibold text-[13px] hover:underline"
                    style={{ color: linkColor }}
                    onClick={() => setSection(id)}
                  >
                    Acessar <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const tabs = ['Tutoriais', 'FAQ', 'Contatos'];
  const tabIds = { 'Tutoriais': 'tutoriais', 'FAQ': 'faq', 'Contatos': 'contatos' };

  return (
    <div
      className="w-full h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--hub-bg)', fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      <HubHeader
        variant="inner"
        title="Central de Apoio"
        onMenu={onMenu}
        onBack={() => setSection(null)}
        onHome={onHome}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      <main className="flex-1 overflow-y-auto px-10 py-8">
        <h1 className="font-bold text-[28px] mb-1" style={{ color: 'var(--hub-text)' }}>
          Central de Apoio
        </h1>
        <p className="text-[14px] font-light mb-6" style={{ color: 'var(--hub-text-muted)' }}>
          Encontre tutoriais, tire dúvidas ou fale com o time de marketing.
        </p>

        {/* tabs */}
        <div className="flex items-center gap-1 mb-8">
          {tabs.map(tab => {
            const id = tabIds[tab];
            const isActive = section === id;
            return (
              <button
                key={tab}
                onClick={() => setSection(id)}
                className="px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors border"
                style={{
                  background: isActive ? '#5CA847' : 'var(--hub-card)',
                  color: isActive ? '#fff' : 'var(--hub-text-muted)',
                  borderColor: isActive ? '#5CA847' : 'var(--hub-border)',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {section === 'tutoriais' && <TutoriaisContent />}
        {section === 'faq' && <FAQContent />}
        {section === 'contatos' && <ContatosContent />}
      </main>
    </div>
  );
}
