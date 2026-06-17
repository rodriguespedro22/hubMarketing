import { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, ImageIcon, Music, FileText, Archive, Folder, Plus } from 'lucide-react';
import HubHeader from '../components/hub/HubHeader';

const TABS = ['Todos', 'Logos', 'Áudios', 'Fontes', 'Branding'];

const FILES = [
  { id: 1, name: 'Logos Dia dos Namorados', meta: 'SVG, PNG · 6 arquivos', Icon: ImageIcon, bg: '#E8F0E4', darkBg: '#1A2818', iconColor: '#5CA847', tab: 'Logos' },
  { id: 2, name: 'Áudios de carro de som', meta: 'MP4 · 6 áudios · 13 GB', Icon: Music, bg: '#FDF0E4', darkBg: '#282016', iconColor: '#E0913A', tab: 'Áudios' },
  { id: 3, name: 'Visual redes sociais', meta: 'Mob · 30+ peças', Icon: ImageIcon, bg: '#E4EEF5', darkBg: '#162030', iconColor: '#3878A8', tab: 'Branding' },
  { id: 4, name: 'Fotos de modelos', meta: 'JPG · 100 imagens', Icon: ImageIcon, bg: '#F0E8F3', darkBg: '#201428', iconColor: '#8B5C9E', tab: 'Branding' },
  { id: 5, name: 'Manual da campanha', meta: 'PDF · 10 MB', Icon: FileText, bg: '#E8F0E4', darkBg: '#1A2818', iconColor: '#5CA847', tab: 'Branding' },
  { id: 6, name: 'Encarte Junho 2025', meta: 'PDF · 2022 · 20 MB', Icon: Folder, bg: '#FDF0E4', darkBg: '#282016', iconColor: '#E0913A', tab: 'Branding' },
  { id: 7, name: 'Kit Dia dos Namorados', meta: 'ZIP · 30 MB', Icon: Archive, bg: '#E4EEF5', darkBg: '#162030', iconColor: '#3878A8', tab: 'Branding' },
  { id: 8, name: 'Kit Copa 2025', meta: 'ZIP · 50 MB', Icon: Archive, bg: '#F0E8F3', darkBg: '#201428', iconColor: '#8B5C9E', tab: 'Branding' },
];

const MONTH_YEAR = 'Junho 2025';
const CALENDAR_EVENTS = {
  1:  [{ label: 'Namorados', color: '#FDF0E4', text: '#C97A2E' }],
  2:  [{ label: 'Namorados', color: '#FDF0E4', text: '#C97A2E' }],
  3:  [{ label: 'Namorados', color: '#FDF0E4', text: '#C97A2E' }],
  4:  [{ label: 'Namorados', color: '#FDF0E4', text: '#C97A2E' }],
  5:  [{ label: 'Namorados', color: '#FDF0E4', text: '#C97A2E' }, { label: 'Promo FDS', color: '#E8F0E4', text: '#3D7A2E' }],
  6:  [{ label: 'Namorados', color: '#FDF0E4', text: '#C97A2E' }],
  7:  [{ label: 'Namorados', color: '#FDF0E4', text: '#C97A2E' }, { label: 'Promo FDS', color: '#E8F0E4', text: '#3D7A2E' }],
  8:  [{ label: 'Carro de som', color: '#FFE8E8', text: '#C0392B' }],
  9:  [{ label: 'Namorados', color: '#FDF0E4', text: '#C97A2E' }],
  10: [{ label: 'Namorados', color: '#FDF0E4', text: '#C97A2E' }],
  11: [{ label: 'Namorados', color: '#FDF0E4', text: '#C97A2E' }],
  12: [{ label: 'Namorados', color: '#FDF0E4', text: '#C97A2E' }, { label: 'Planejamento', color: '#F0E8F3', text: '#6A4A78' }],
  14: [{ label: 'Promo FDS', color: '#E8F0E4', text: '#3D7A2E' }],
  20: [{ label: 'Copa', color: '#E4EEF5', text: '#23456B' }],
  21: [{ label: 'Promo FDS', color: '#E8F0E4', text: '#3D7A2E' }],
  22: [{ label: 'Copa', color: '#E4EEF5', text: '#23456B' }],
  23: [{ label: 'Copa', color: '#E4EEF5', text: '#23456B' }],
  24: [{ label: 'Copa', color: '#E4EEF5', text: '#23456B' }],
  25: [{ label: 'Copa', color: '#E4EEF5', text: '#23456B' }],
  26: [{ label: 'Copa', color: '#E4EEF5', text: '#23456B' }],
  27: [{ label: 'Copa', color: '#E4EEF5', text: '#23456B' }],
  28: [{ label: 'Copa', color: '#E4EEF5', text: '#23456B' }, { label: 'Promo FDS', color: '#E8F0E4', text: '#3D7A2E' }],
  29: [{ label: 'Copa', color: '#E4EEF5', text: '#23456B' }],
  30: [{ label: 'Copa', color: '#E4EEF5', text: '#23456B' }],
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
          <div key={w} className="text-center text-[11px] font-semibold py-1" style={{ color: 'var(--hub-text-subtle)' }}>
            {w}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7" style={{ borderTop: '1px solid var(--hub-border)' }}>
          {week.map((day, di) => {
            const events = day ? (CALENDAR_EVENTS[day] || []) : [];
            const isToday = day === 16;
            return (
              <div
                key={di}
                className="min-h-[80px] p-1.5"
                style={{
                  borderRight: di < 6 ? '1px solid var(--hub-border)' : undefined,
                  cursor: day ? 'default' : undefined,
                }}
              >
                {day && (
                  <>
                    <div
                      className="text-[12px] font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full"
                      style={{
                        background: isToday ? '#5CA847' : 'transparent',
                        color: isToday ? '#fff' : 'var(--hub-text-muted)',
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
                      <div className="text-[9px]" style={{ color: 'var(--hub-text-subtle)' }}>
                        +{events.length - 2}
                      </div>
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

function FileCard({ file, isDark }) {
  const { name, meta, Icon, bg, darkBg, iconColor } = file;
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-all border"
      style={{
        background: 'var(--hub-card)',
        borderColor: 'var(--hub-border)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#5CA84750'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hub-border)'}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: isDark ? darkBg : bg }}
      >
        <Icon size={22} color={iconColor} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-[14px] leading-tight mb-1" style={{ color: 'var(--hub-text)' }}>{name}</p>
        <p className="text-[12px]" style={{ color: 'var(--hub-text-subtle)' }}>{meta}</p>
      </div>
      <button
        className="self-end p-2 rounded-lg transition-colors"
        style={{ color: 'var(--hub-text-subtle)' }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--hub-text)'; e.currentTarget.style.background = 'var(--hub-surface)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--hub-text-subtle)'; e.currentTarget.style.background = 'transparent'; }}
      >
        <Download size={16} />
      </button>
    </div>
  );
}

export default function CentralCampanhas({ onMenu, onBack, onHome, isDark, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('Todos');

  const visibleFiles = activeTab === 'Todos'
    ? FILES
    : FILES.filter(f => f.tab === activeTab);

  return (
    <div
      className="w-full h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--hub-bg)', fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      <HubHeader
        variant="inner"
        title="Central de Campanhas"
        onMenu={onMenu}
        onBack={onBack}
        onHome={onHome}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      <main className="flex-1 overflow-y-auto px-10 py-8">
        {/* title row */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-bold text-[28px] mb-1" style={{ color: 'var(--hub-text)' }}>
              Central de Campanhas
            </h1>
            <p className="text-[14px] font-light" style={{ color: 'var(--hub-text-muted)' }}>
              Repositório de materiais da marca: logos, áudios, fontes e mais.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#5CA847] text-white font-semibold text-[13px] px-4 py-2.5 rounded-xl hover:bg-[#4d9640] transition-colors">
            <Plus size={15} /> Nova campanha
          </button>
        </div>

        {/* tabs */}
        <div className="flex items-center gap-1 mb-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors border"
              style={{
                background: activeTab === tab ? '#5CA847' : 'var(--hub-card)',
                color: activeTab === tab ? '#fff' : 'var(--hub-text-muted)',
                borderColor: activeTab === tab ? '#5CA847' : 'var(--hub-border)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* calendar */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--hub-card)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-[16px]" style={{ color: 'var(--hub-text)' }}>
                Calendário de campanhas
              </p>
              <p className="text-[13px]" style={{ color: 'var(--hub-text-subtle)' }}>
                {MONTH_YEAR} · visualização da campanha do mês
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--hub-text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--hub-surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--hub-text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--hub-surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <CalendarGrid />

          {/* legend */}
          <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: '1px solid var(--hub-border)' }}>
            {[
              { color: '#FDF0E4', text: '#C97A2E', label: 'Dia dos Namorados · até 12' },
              { color: '#E4EEF5', text: '#23456B', label: 'Copa · 22 ao fim' },
              { color: '#E8F0E4', text: '#3D7A2E', label: 'Promo fim de semana' },
              { color: '#FFE8E8', text: '#C0392B', label: 'Ofertas diárias' },
            ].map(({ color, text, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ background: color, border: `1px solid ${text}40` }} />
                <span className="text-[11px]" style={{ color: 'var(--hub-text-subtle)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* files grid */}
        <div className="grid grid-cols-4 gap-4">
          {visibleFiles.map(file => (
            <FileCard key={file.id} file={file} isDark={isDark} />
          ))}
          {visibleFiles.length === 0 && (
            <p className="col-span-4 text-center py-10" style={{ color: 'var(--hub-text-subtle)' }}>
              Nenhum arquivo nesta categoria ainda.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
