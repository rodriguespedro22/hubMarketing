import { useState } from 'react';
import { Calendar, FolderOpen, ArrowRight, ArrowDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import HubHeader from '../components/hub/HubHeader';

const OPTIONS = [
  {
    id: 'calendario',
    title: 'Calendário de Campanhas',
    desc: 'Acompanhe o calendário de campanhas e ofertas',
    Icon: Calendar,
  },
  {
    id: 'arquivos',
    title: 'Arquivos',
    desc: 'Baixe os materiais das campanhas',
    Icon: FolderOpen,
  },
];

const CAMPAIGNS = [
  {
    id: 'copa-lebes',
    name: 'Copa Lebes',
    fullName: 'Copa Lebes 2026',
    pill: { bg: '#e4eef4', text: '#3878a8' },
    hero: '#3878a8',
    heroSubtext: '#cce0f5',
    status: 'Campanha ativa',
    period: '01/06 – 31/07/2025',
    badges: [
      { label: 'Copa do Mundo', bg: '#4178b6', text: '#e4eef4' },
      { label: 'Promoção ativa', bg: '#e8f0e4', text: '#3d7a2e' },
      { label: '31 dias restantes', bg: '#fcf0e4', text: '#6b4a23' },
    ],
  },
  {
    id: 'liquida-lebes',
    name: 'Liquida Lebes',
    fullName: 'Liquida Lebes',
    pill: { bg: '#e8f0e4', text: '#3d7a2e' },
    hero: '#3d7a2e',
    heroSubtext: '#d9ead2',
    status: 'Campanha ativa',
    period: '01/07 – 15/07/2025',
    badges: [
      { label: 'Liquidação', bg: '#4a9438', text: '#e8f0e4' },
      { label: 'Promoção ativa', bg: '#e8f0e4', text: '#3d7a2e' },
      { label: '15 dias restantes', bg: '#fcf0e4', text: '#6b4a23' },
    ],
  },
  // {
  //   id: 'dia-das-maes',
  //   name: 'Dia das Mães',
  //   fullName: 'Dia das Mães 2025',
  //   pill: { bg: '#fbe8f0', text: '#d6568b' },
  //   hero: '#d6568b',
  //   heroSubtext: '#fbe0ea',
  //   status: 'Campanha encerrada',
  //   period: '01/05 – 11/05/2025',
  //   badges: [
  //     { label: 'Sazonal', bg: '#f9c9dc', text: '#a83d6c' },
  //     { label: 'Encerrada', bg: '#f1f1ee', text: '#888' },
  //   ],
  // },
  // {
  //   id: 'black-friday',
  //   name: 'Black Friday',
  //   fullName: 'Black Friday 2025',
  //   pill: { bg: '#2e2e2e', text: '#ffffff' },
  //   hero: '#2e2e2e',
  //   heroSubtext: '#cccccc',
  //   status: 'Em planejamento',
  //   period: '21/11 – 29/11/2025',
  //   badges: [
  //     { label: 'Maior campanha do ano', bg: '#444444', text: '#ffffff' },
  //     { label: 'Em planejamento', bg: '#fcf0e4', text: '#6b4a23' },
  //   ],
  // },
  {
    id: 'institucional',
    name: 'Institucional',
    fullName: 'Institucional',
    pill: { bg: '#fcf0e4', text: '#6b4a23' },
    hero: '#e0913a',
    heroSubtext: '#fce9d4',
    status: 'Sempre ativa',
    period: 'Uso contínuo',
    badges: [
      { label: 'Marca', bg: '#fde3c8', text: '#a8631f' },
      { label: 'Sempre ativa', bg: '#e8f0e4', text: '#3d7a2e' },
    ],
  },
];

const ARQUIVOS_CATEGORIES = [
  { id: 'logos', label: 'Logos', meta: 'SVG · PNG · 8 arquivos', thumbBg: '#e8f0e4' },
  { id: 'templates', label: 'Templates', meta: 'PSD · AI · 12 peças', thumbBg: '#e4eef4' },
  { id: 'audios', label: 'Áudios', meta: 'MP3 · 6 spots', thumbBg: '#fcf0e4' },
  { id: 'enxoval', label: 'Enxoval', meta: 'ZIP · 45 MB', thumbBg: '#fbe8f0' },
];

const FILE_MODULES = [
  { id: 'logos', label: 'Logos', meta: 'SVG · PNG · EPS — 8 arquivos', headerBg: '#ededeb' },
  { id: 'templates-digitais', label: 'Templates digitais', meta: 'PSD · AI · Figma — 12 peças', headerBg: '#e4eef4' },
  { id: 'templates-impressos', label: 'Templates impressos', meta: 'InDesign · PDF — 6 peças', headerBg: '#e8f0e4' },
  { id: 'fotos', label: 'Fotos e imagens', meta: 'JPG · PNG — 24 imagens', headerBg: '#fcf0e4' },
  { id: 'audios', label: 'Áudios e spots', meta: 'MP3 · WAV — 6 spots de rádio', headerBg: '#f0e8f3' },
  { id: 'videos', label: 'Vídeos e animações', meta: 'MP4 · GIF — 8 peças', headerBg: '#fce8e8' },
];

const PUBLICATIONS = {
  'copa-lebes': [
    { name: 'Feed Instagram Copa Lebes', date: '15/06', tag: 'Digital', tagBg: '#e4eef4', tagText: '#23456b' },
    { name: 'Story Oferta TV Copa', date: '18/06', tag: 'Digital', tagBg: '#e4eef4', tagText: '#23456b' },
    { name: 'Banner PDV A3', date: '20/06', tag: 'Impresso', tagBg: '#e8f0e4', tagText: '#3d7a2e' },
  ],
  'liquida-lebes': [
    { name: 'Feed Instagram Liquida Lebes', date: '01/07', tag: 'Digital', tagBg: '#e4eef4', tagText: '#23456b' },
    { name: 'Cartaz de vitrine A2', date: '03/07', tag: 'Impresso', tagBg: '#e8f0e4', tagText: '#3d7a2e' },
  ],
  'dia-das-maes': [
    { name: 'Story Oferta Dia das Mães', date: '05/05', tag: 'Digital', tagBg: '#e4eef4', tagText: '#23456b' },
  ],
  'black-friday': [
    { name: 'Teaser Black Friday', date: '10/11', tag: 'Digital', tagBg: '#e4eef4', tagText: '#23456b' },
  ],
  institucional: [
    { name: 'Apresentação institucional', date: '—', tag: 'Digital', tagBg: '#e4eef4', tagText: '#23456b' },
  ],
};

const MONTH_YEAR = 'Junho 2025';
const CALENDAR_EVENTS = {
  1: [{ label: 'Namorados', color: '#fbe8f0', text: '#d6568b' }],
  2: [{ label: 'Namorados', color: '#fbe8f0', text: '#d6568b' }],
  3: [{ label: 'Namorados', color: '#fbe8f0', text: '#d6568b' }],
  4: [{ label: 'Namorados', color: '#fbe8f0', text: '#d6568b' }],
  5: [{ label: 'Namorados', color: '#fbe8f0', text: '#d6568b' }],
  6: [{ label: 'Namorados', color: '#fbe8f0', text: '#d6568b' }],
  7: [{ label: 'Namorados', color: '#fbe8f0', text: '#d6568b' }, { label: 'Promo FDS', color: '#fcf0e4', text: '#e0913a' }],
  8: [{ label: 'Namorados', color: '#fbe8f0', text: '#d6568b' }, { label: 'Promo FDS', color: '#fcf0e4', text: '#e0913a' }],
  9: [{ label: 'Namorados', color: '#fbe8f0', text: '#d6568b' }],
  10: [{ label: 'Namorados', color: '#fbe8f0', text: '#d6568b' }],
  11: [{ label: 'Namorados', color: '#fbe8f0', text: '#d6568b' }],
  12: [{ label: 'Namorados', color: '#fbe8f0', text: '#d6568b' }],
  14: [{ label: 'Promo FDS', color: '#fcf0e4', text: '#e0913a' }],
  15: [{ label: 'Promo FDS', color: '#fcf0e4', text: '#e0913a' }],
  21: [{ label: 'Promo FDS', color: '#fcf0e4', text: '#e0913a' }],
  22: [{ label: 'Copa', color: '#e4eef4', text: '#3878a8' }, { label: 'Promo FDS', color: '#fcf0e4', text: '#e0913a' }],
  23: [{ label: 'Copa', color: '#e4eef4', text: '#3878a8' }],
  24: [{ label: 'Copa', color: '#e4eef4', text: '#3878a8' }],
  25: [{ label: 'Copa', color: '#e4eef4', text: '#3878a8' }],
  26: [{ label: 'Copa', color: '#e4eef4', text: '#3878a8' }],
  27: [{ label: 'Copa', color: '#e4eef4', text: '#3878a8' }],
  28: [{ label: 'Copa', color: '#e4eef4', text: '#3878a8' }, { label: 'Promo FDS', color: '#fcf0e4', text: '#e0913a' }],
  29: [{ label: 'Copa', color: '#e4eef4', text: '#3878a8' }, { label: 'Promo FDS', color: '#fcf0e4', text: '#e0913a' }],
  30: [{ label: 'Copa', color: '#e4eef4', text: '#3878a8' }],
};

const WEEKDAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const JUNE_START_DOW = 0;
const JUNE_DAYS = 30;

function CalendarGrid() {
  const cells = [];
  for (let i = 0; i < JUNE_START_DOW; i++) cells.push(null);
  for (let d = 1; d <= JUNE_DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(w => (
          <div key={w} className="text-center text-[11px] font-semibold py-1 text-[#999]">
            {w}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 border-t border-[#e8e8e5]">
          {week.map((day, di) => {
            const events = day ? (CALENDAR_EVENTS[day] || []) : [];
            const isToday = day === 16;
            return (
              <div
                key={di}
                className="relative min-h-[80px] p-1.5"
                style={{ borderRight: di < 6 ? '1px solid #e8e8e5' : undefined }}
              >
                {day && (
                  <>
                    <div className="absolute top-1.5 right-1.5 w-[6px] h-[6px] rounded-full" style={{ background: '#5ca847' }} />
                    <div
                      className="text-[12px] font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full"
                      style={{
                        background: isToday ? '#5ca847' : 'transparent',
                        color: isToday ? '#fff' : '#606060',
                      }}
                    >
                      {day}
                    </div>
                    {events.slice(0, 2).map((ev, ei) => (
                      <div
                        key={ei}
                        className="text-[10px] px-1.5 py-0.5 rounded mb-0.5 truncate"
                        style={{ background: ev.color, color: ev.text }}
                      >
                        {ev.label}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-[9px] text-[#999]">+{events.length - 2}</div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function OptionCards({ active, onSelect }) {
  return (
    <div className="flex gap-5 w-full">
      {OPTIONS.map(({ id, title, desc, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex-1 flex flex-col items-start pt-8 pb-7 px-7 rounded-[20px] text-left transition-all ${
              isActive
                ? 'bg-[#fcf0e4] border border-[#e0913a]'
                : 'bg-[#e8f0e4] border border-transparent hover:brightness-95'
            }`}
          >
            <div className="w-16 h-16 rounded-[17px] bg-[#e0913a] flex items-center justify-center shrink-0">
              <Icon size={26} color="#fff" />
            </div>
            <div className="h-5" />
            <p className="font-bold text-[21px] text-[#606060] tracking-[-0.42px]">{title}</p>
            <div className="h-2" />
            <p className="font-normal text-[13px] text-[#606060] leading-[19px]">{desc}</p>
            <div className="h-[22px]" />
            <div className="flex items-center gap-[7px]">
              <span className="font-semibold text-[13px] text-[#e0913a]">Acessar</span>
              {isActive
                ? <ArrowDown size={13} color="#e0913a" />
                : <ArrowRight size={13} color="#e0913a" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CalendarioContent() {
  return (
    <div className="mt-6 bg-white rounded-2xl border border-[#e8e8e5] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-semibold text-[16px] text-[#2e2e2e]">Calendário de campanhas</p>
          <p className="text-[13px] text-[#999]">{MONTH_YEAR} · visualização das campanhas do mês</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg text-[#606060] hover:bg-[#f7f6f2] transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1.5 rounded-lg text-[#606060] hover:bg-[#f7f6f2] transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1">
        <div className="min-w-[640px] px-1">
          <CalendarGrid />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[#e8e8e5]">
        {[
          { swatch: '#fbe8f0', label: 'Dia dos Namorados · até 12' },
          { swatch: '#e4eef4', label: 'Copa · 22 ao fim' },
          { swatch: '#fcf0e4', label: 'Promo de fim de semana' },
        ].map(({ swatch, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: swatch }} />
            <span className="text-[11px] text-[#999]">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-[6px] h-[6px] rounded-full" style={{ background: '#5ca847' }} />
          <span className="text-[11px] text-[#999]">Ofertas diárias (todos os dias)</span>
        </div>
      </div>
    </div>
  );
}

function FileCategoryCard({ cat }) {
  return (
    <div className="bg-white border border-[#e8e8e5] rounded-[14px] overflow-hidden">
      <div className="h-20" style={{ background: cat.thumbBg }} />
      <div className="flex items-center gap-2 px-[14px] py-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[13px] text-[#2e2e2e]">{cat.label}</p>
          <p className="font-normal text-[11px] text-[#606060]">{cat.meta}</p>
        </div>
        <button className="w-[34px] h-[34px] rounded-[9px] bg-[#f7f6f2] flex items-center justify-center shrink-0 hover:bg-[#ededeb] transition-colors">
          <Download size={14} color="#606060" />
        </button>
      </div>
    </div>
  );
}

function ArquivosContent({ activeCampaignId, onSelectCampaign, onOpenCampaign }) {
  const campaign = CAMPAIGNS.find(c => c.id === activeCampaignId);

  return (
    <div className="mt-6">
      <p className="font-semibold text-[11px] text-[#888] tracking-[0.5px] uppercase mb-3">Campanhas ativas</p>
      <div className="flex flex-wrap gap-2.5 mb-7">
        {CAMPAIGNS.map(c => (
          <button
            key={c.id}
            onClick={() => onSelectCampaign(c.id)}
            className="px-[14px] py-[9px] rounded-[10px] font-semibold text-[13px] transition-all"
            style={{
              background: c.pill.bg,
              color: c.pill.text,
              boxShadow: activeCampaignId === c.id ? `0 0 0 2px ${c.pill.text}` : 'none',
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="font-semibold text-[11px] text-[#888] tracking-[0.5px] uppercase mb-3">
        {campaign.name.toUpperCase()} — MÓDULOS DISPONÍVEIS
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {ARQUIVOS_CATEGORIES.map(cat => (
          <FileCategoryCard key={cat.id} cat={cat} />
        ))}
      </div>

      <button
        onClick={() => onOpenCampaign(activeCampaignId)}
        className="flex items-center gap-1.5 font-semibold text-[13px] text-[#e0913a] hover:underline"
      >
        Ver detalhes da campanha <ArrowRight size={13} />
      </button>
    </div>
  );
}

function ModuleCard({ mod }) {
  return (
    <div className="bg-white border border-[#e8e8e5] rounded-[14px] overflow-hidden h-[140px] flex flex-col">
      <div className="h-14" style={{ background: mod.headerBg }} />
      <div className="px-4 py-3 flex-1 flex flex-col justify-between">
        <div>
          <p className="font-semibold text-[14px] text-[#2e2e2e]">{mod.label}</p>
          <p className="font-normal text-[11px] text-[#606060] mt-0.5">{mod.meta}</p>
        </div>
        <button className="self-end px-[10px] py-[5px] rounded-[7px] border border-[#e8e8e5] bg-[#f7f6f2] font-semibold text-[11px] text-[#606060] hover:bg-[#ededeb] transition-colors">
          Baixar
        </button>
      </div>
    </div>
  );
}

function CampanhaDetail({ campaign, onBackToArquivos }) {
  const pubs = PUBLICATIONS[campaign.id] || [];

  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 text-[12px] mb-4">
        <button onClick={onBackToArquivos} className="text-[#e0913a] hover:underline">
          Central de Campanhas
        </button>
        <span className="text-[#606060]">›</span>
        <span className="font-semibold text-[#2e2e2e]">{campaign.name}</span>
      </div>

      <div className="rounded-2xl p-9 mb-8 relative overflow-hidden min-h-[200px]" style={{ background: campaign.hero }}>
        <p className="font-bold text-[32px] sm:text-[36px] text-white tracking-[-0.72px]">{campaign.fullName}</p>
        <p className="font-light text-[15px] mt-2" style={{ color: campaign.heroSubtext }}>
          {campaign.status} · {campaign.period}
        </p>
        <div className="flex flex-wrap gap-2.5 mt-4">
          {campaign.badges.map(b => (
            <span
              key={b.label}
              className="px-[10px] py-[5px] rounded-full font-semibold text-[11px]"
              style={{ background: b.bg, color: b.text }}
            >
              {b.label}
            </span>
          ))}
        </div>
        <button className="absolute right-9 bottom-9 bg-[#5ca847] text-white font-semibold text-[12px] px-[14px] py-2 rounded-[10px] hover:bg-[#4a9438] transition-colors">
          Baixar todos os arquivos
        </button>
      </div>

      <p className="font-bold text-[20px] text-[#2e2e2e] tracking-[-0.4px] mb-1">Módulos disponíveis</p>
      <p className="font-light text-[13px] text-[#606060] mb-4">Clique para baixar os materiais de cada módulo</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {FILE_MODULES.map(mod => (
          <ModuleCard key={mod.id} mod={mod} />
        ))}
      </div>

      <p className="font-bold text-[18px] text-[#2e2e2e] tracking-[-0.36px] mb-3">Publicações disponíveis</p>
      <div className="rounded-[10px] border border-[#e8e8e5] overflow-hidden bg-white">
        {pubs.map((p, i) => (
          <div
            key={p.name}
            className={`flex items-center justify-between px-[14px] h-12 ${i > 0 ? 'border-t border-[#e8e8e5]' : ''}`}
          >
            <p className="font-semibold text-[13px] text-[#2e2e2e]">{p.name}</p>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-[#606060]">{p.date}</span>
              <span
                className="px-2 py-[3px] rounded-[6px] font-semibold text-[10px]"
                style={{ background: p.tagBg, color: p.tagText }}
              >
                {p.tag}
              </span>
            </div>
          </div>
        ))}
        {pubs.length === 0 && (
          <p className="text-center text-[13px] text-[#999] py-6">Nenhuma publicação cadastrada ainda.</p>
        )}
      </div>
    </div>
  );
}

export default function CentralCampanhas({ onMenu, onBack, onHome, isDark, onToggleTheme }) {
  const [section, setSection] = useState(null); // null | 'calendario' | 'arquivos'
  const [activeCampaignId, setActiveCampaignId] = useState('copa-lebes');
  const [openCampaignId, setOpenCampaignId] = useState(null);

  const handleBack = openCampaignId
    ? () => setOpenCampaignId(null)
    : section
    ? () => setSection(null)
    : onBack;

  const openCampaign = CAMPAIGNS.find(c => c.id === openCampaignId);

  return (
    <div
      className="w-full h-screen flex flex-col overflow-hidden bg-[#f7f6f2]"
      style={{ fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      <HubHeader
        variant="inner"
        title="Central de Campanhas"
        onMenu={onMenu}
        onBack={handleBack}
        onHome={onHome}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      {openCampaign ? (
        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="w-full max-w-[1200px] mx-auto">
            <CampanhaDetail campaign={openCampaign} onBackToArquivos={() => setOpenCampaignId(null)} />
          </div>
        </main>
      ) : (
        <main className={`flex-1 overflow-y-auto px-10 ${!section ? 'flex items-center justify-center py-10' : 'py-8'}`}>
          <div className="w-full max-w-[1200px] mx-auto">
            <div className={`${!section ? 'text-center' : ''} mb-10`}>
              <h1 className="font-bold text-[34px] text-[#2e2e2e] tracking-[-0.68px] mb-2">
                Central de Campanhas
              </h1>
              <p className="font-light text-[15px] text-[#606060]">
                Acesse os materiais, calendário editorial e arquivos das campanhas
              </p>
            </div>

            <OptionCards active={section} onSelect={setSection} />

            {section === 'calendario' && <CalendarioContent />}
            {section === 'arquivos' && (
              <ArquivosContent
                activeCampaignId={activeCampaignId}
                onSelectCampaign={setActiveCampaignId}
                onOpenCampaign={setOpenCampaignId}
              />
            )}
          </div>
        </main>
      )}
    </div>
  );
}
