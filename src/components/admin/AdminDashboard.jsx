import { ICONS } from '../../data/icons';
import { AdminNav } from './shared';

const STATS = [
  { label: 'Materiais no total', value: '348', accent: true },
  { label: 'Ofertas ativas', value: '126' },
  { label: 'Templates', value: '18' },
  { label: 'Campanhas', value: '7' },
];

const MATERIAIS_CATEGORIA = [
  { label: 'Cards', value: 214, max: 214, color: '#5ca847' },
  { label: 'Revista', value: 98, max: 214, color: '#e0913a' },
  { label: 'PDV - Cartazes', value: 36, max: 214, color: '#2e2e2e' },
];

const OFERTAS_MAIS_USADAS = [
  { nome: 'Geladeira Brastemp', usos: 28, iconName: 'Refrigerator' },
  { nome: 'Smart TV 50"', usos: 21, iconName: 'Tv' },
  { nome: 'Sofá Retrátil', usos: 17, iconName: 'Sofa' },
  { nome: 'Lava e Seca LG', usos: 14, iconName: 'Refrigerator' },
];

const CALENDAR_EVENTS = {
  1: [{ label: 'Namorados', bg: '#fbe8f0', color: '#d6568b' }],
  7: [{ label: 'Namorados', bg: '#fbe8f0', color: '#d6568b' }, { label: 'Promo FDS', bg: '#fcf0e4', color: '#e0913a' }],
  8: [{ label: 'Namorados', bg: '#fbe8f0', color: '#d6568b' }, { label: 'Promo FDS', bg: '#fcf0e4', color: '#e0913a' }],
  14: [{ label: 'Promo FDS', bg: '#fcf0e4', color: '#e0913a' }],
  15: [{ label: 'Promo FDS', bg: '#fcf0e4', color: '#e0913a' }],
  21: [{ label: 'Promo FDS', bg: '#fcf0e4', color: '#e0913a' }],
  22: [{ label: 'Copa', bg: '#e4eef4', color: '#3878a8' }, { label: 'Promo FDS', bg: '#fcf0e4', color: '#e0913a' }],
  23: [{ label: 'Copa', bg: '#e4eef4', color: '#3878a8' }],
  28: [{ label: 'Copa', bg: '#e4eef4', color: '#3878a8' }, { label: 'Promo FDS', bg: '#fcf0e4', color: '#e0913a' }],
};

const WEEKDAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

function DashboardCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow = new Date(year, month, 1).getDay();
  const monthLabel = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div className="bg-white border border-[#e8e8e5] rounded-[16px] p-5">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="font-bold text-[16px] text-[#2e2e2e]">Calendário de campanhas</h2>
          <p className="font-normal text-[12px] text-[#606060] capitalize">{monthLabel} · campanhas vigentes</p>
        </div>
        <button className="bg-[#5ca847] text-white font-semibold text-[12.5px] px-[14px] py-[9px] rounded-[10px] hover:bg-[#4a9438] transition-colors">
          + Nova campanha
        </button>
      </div>

      <div className="grid grid-cols-7 mt-3">
        {WEEKDAYS.map(w => (
          <div key={w} className="text-center text-[11px] font-semibold py-1 text-[#999]">{w}</div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 border-t border-[#e8e8e5]">
          {week.map((day, di) => {
            const events = day ? (CALENDAR_EVENTS[day] || []) : [];
            const isToday = day === today.getDate();
            return (
              <div key={di} className="relative min-h-[72px] p-1.5" style={{ borderRight: di < 6 ? '1px solid #e8e8e5' : undefined }}>
                {day && (
                  <>
                    <div className="absolute top-1.5 right-1.5 w-[6px] h-[6px] rounded-full" style={{ background: '#5ca847' }} />
                    <div
                      className="text-[12px] font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full"
                      style={{ background: isToday ? '#5ca847' : 'transparent', color: isToday ? '#fff' : '#606060' }}
                    >
                      {day}
                    </div>
                    {events.map((ev, ei) => (
                      <div key={ei} className="text-[10px] px-1.5 py-0.5 rounded mb-0.5 truncate" style={{ background: ev.bg, color: ev.color }}>
                        {ev.label}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div className="flex items-center gap-4 mt-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-[11px] text-[#606060]"><span className="w-2 h-2 rounded-full" style={{ background: '#fbe8f0', border: '1px solid #d6568b' }} /> Dia dos Namorados</span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#606060]"><span className="w-2 h-2 rounded-full" style={{ background: '#e4eef4', border: '1px solid #3878a8' }} /> Copa</span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#606060]"><span className="w-2 h-2 rounded-full" style={{ background: '#fcf0e4', border: '1px solid #e0913a' }} /> Promo de fim de semana</span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#606060]"><span className="w-2 h-2 rounded-full bg-[#5ca847]" /> Ofertas diárias (todos os dias)</span>
      </div>
    </div>
  );
}

export default function AdminDashboard({ onNovaOferta, onBack, onHome }) {
  return (
    <div className="flex flex-col gap-5 px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">Dashboard</h1>
          <p className="font-light text-[14px] text-[#606060] mt-1">Visão geral dos materiais e ofertas</p>
        </div>
        <button
          onClick={onNovaOferta}
          className="bg-[#5ca847] text-white font-semibold text-[13px] px-4 py-[10px] rounded-[10px] hover:bg-[#4a9438] transition-colors"
        >
          + Nova oferta
        </button>
      </div>

      {/* Stat cards */}
      <div className="flex items-start gap-[14px]">
        {STATS.map(({ label, value, accent }) => (
          <div
            key={label}
            className="flex-1 flex flex-col gap-1 rounded-[14px] px-[18px] py-4"
            style={accent ? { background: '#5ca847', color: '#fff' } : { background: '#fff', border: '1px solid #e8e8e5', color: '#2e2e2e' }}
          >
            <span className="font-medium text-[11px]" style={{ opacity: accent ? 0.9 : 0.6 }}>{label}</span>
            <span className="font-bold text-[28px]">{value}</span>
          </div>
        ))}
      </div>

      {/* Materiais por categoria + Ofertas mais usadas */}
      <div className="flex items-start gap-[14px]">
        <div className="flex-1 bg-white border border-[#e8e8e5] rounded-[16px] p-5 flex flex-col gap-4">
          <h2 className="font-bold text-[16px] text-[#2e2e2e]">Materiais por categoria</h2>
          {MATERIAIS_CATEGORIA.map(({ label, value, max, color }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[13px] text-[#2e2e2e]">{label}</span>
                <span className="font-semibold text-[13px] text-[#2e2e2e]">{value}</span>
              </div>
              <div className="h-2 bg-[#f0efec] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 bg-white border border-[#e8e8e5] rounded-[16px] p-5 flex flex-col gap-3">
          <h2 className="font-bold text-[16px] text-[#2e2e2e]">Ofertas mais usadas</h2>
          {OFERTAS_MAIS_USADAS.map(({ nome, usos, iconName }) => {
            const Icon = ICONS[iconName];
            return (
              <div key={nome} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[9px] bg-[#e8f0e4] flex items-center justify-center shrink-0">
                  {Icon && <Icon size={15} className="text-[#3d7a2e]" />}
                </div>
                <span className="font-medium text-[13px] text-[#2e2e2e] flex-1">{nome}</span>
                <span className="font-semibold text-[12px] text-[#3d7a2e]">{usos} usos</span>
              </div>
            );
          })}
        </div>
      </div>

      <DashboardCalendar />
    </div>
  );
}
