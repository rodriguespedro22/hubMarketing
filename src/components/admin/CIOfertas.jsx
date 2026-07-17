import { useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { getOfertaStatus } from '../../data/ci';
import { fmt } from '../../utils/helpers';
import { AdminNav, Toggle } from './shared';

const STATUS_BADGE = {
  Ativa: { bg: '#e8f0e4', color: '#3d7a2e' },
  Pendente: { bg: '#fcf0e4', color: '#6b4a23' },
  Expirada: { bg: '#ededeb', color: '#606060' },
  Futura: { bg: '#e4eef4', color: '#23456b' },
};

const FILTROS = ['Todas', 'Ativas', 'Pendentes', 'Expiradas', 'Futuras'];
const FILTRO_STATUS = { Ativas: 'Ativa', Pendentes: 'Pendente', Expiradas: 'Expirada', Futuras: 'Futura' };

function fmtPeriodo(inicio, fim) {
  const f = (d) => d ? d.slice(8, 10) + '/' + d.slice(5, 7) : '—';
  return `${f(inicio)} – ${f(fim)}`;
}

// número de lojas mock, estável por oferta (só exibido quando a oferta está ativa e visível)
function lojasAlcancadas(id) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 1000;
  return 20 + (h % 80);
}

export default function CIOfertas({ ci, onNovaOferta, onToggleVisivel, onAprovar, onBack, onHome }) {
  const [filtro, setFiltro] = useState('Todas');
  const [q, setQ] = useState('');

  const ofertas = useMemo(() => ci.ofertas.map(o => ({ oferta: o, status: getOfertaStatus(o) })), [ci]);

  const filtered = ofertas
    .filter(({ status }) => filtro === 'Todas' || status === FILTRO_STATUS[filtro])
    .filter(({ oferta }) => !q || oferta.nome.toLowerCase().includes(q.toLowerCase()));

  const ativasVisiveis = ofertas.filter(({ status }) => status === 'Ativa').length;
  const pendentes = ofertas.filter(({ status }) => status === 'Pendente').length;
  const expiradas = ofertas.filter(({ status }) => status === 'Expirada').length;

  return (
    <div className="flex flex-col gap-[18px] px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">{ci.nome} — Ofertas</h1>
          <p className="font-light text-[14px] text-[#606060] mt-1">Todas as ofertas individuais desta CI, prontas para publicação</p>
        </div>
        <button
          onClick={onNovaOferta}
          className="bg-[#5ca847] text-white font-semibold text-[13px] px-4 py-[10px] rounded-[10px] hover:bg-[#4a9438] transition-colors"
        >
          + Nova oferta
        </button>
      </div>

      {/* Estatísticas */}
      <div className="flex items-start gap-[14px]">
        <div className="flex-1 flex flex-col gap-1 rounded-[12px] border border-[#e8e8e5] bg-white px-[16px] py-3">
          <span className="font-normal text-[12px] text-[#606060]">Total de ofertas</span>
          <span className="font-bold text-[28px] tracking-[-0.5px] text-[#2e2e2e]">{ci.ofertas.length}</span>
        </div>
        <div className="flex-1 flex flex-col gap-1 rounded-[12px] border border-[#e8e8e5] px-[16px] py-3" style={{ background: '#e8f0e4' }}>
          <span className="font-normal text-[12px] text-[#606060]">Ativas e visíveis</span>
          <span className="font-bold text-[28px] tracking-[-0.5px] text-[#5ca847]">{ativasVisiveis}</span>
          <span className="font-normal text-[10.5px] text-[#606060]">aparecendo nas lojas</span>
        </div>
        <div className="flex-1 flex flex-col gap-1 rounded-[12px] border border-[#e8e8e5] px-[16px] py-3" style={{ background: '#fcf0e4' }}>
          <span className="font-normal text-[12px] text-[#606060]">Pendentes</span>
          <span className="font-bold text-[28px] tracking-[-0.5px] text-[#e0913a]">{pendentes}</span>
          <span className="font-normal text-[10.5px] text-[#606060]">aguardando aprovação</span>
        </div>
        <div className="flex-1 flex flex-col gap-1 rounded-[12px] border border-[#e8e8e5] px-[16px] py-3" style={{ background: '#ededeb' }}>
          <span className="font-normal text-[12px] text-[#606060]">Expiradas</span>
          <span className="font-bold text-[28px] tracking-[-0.5px] text-[#606060]">{expiradas}</span>
          <span className="font-normal text-[10.5px] text-[#606060]">fora da vigência</span>
        </div>
      </div>

      {/* Filtros + busca */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {FILTROS.map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-[12px] py-[6px] rounded-[20px] text-[12px] transition-colors ${
                filtro === f
                  ? 'bg-[#5ca847] text-white font-semibold'
                  : 'bg-white border border-[#e8e8e5] text-[#606060] font-medium hover:bg-[#f7f6f2]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar produto..."
            className="h-9 w-[260px] bg-white border border-[#e8e8e5] rounded-[10px] pl-8 pr-3 text-[12px] text-[#2e2e2e] placeholder-[#888]"
          />
        </div>
      </div>

      {/* Cabeçalho da tabela */}
      <div className="bg-[#ededeb] rounded-[8px] px-4 py-[10px] flex items-center">
        <div className="w-[220px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Produto</span></div>
        <div className="w-[120px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Setor</span></div>
        <div className="w-[110px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Preço</span></div>
        <div className="w-[120px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Vigência</span></div>
        <div className="w-[90px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Status</span></div>
        <div className="w-[110px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Visibilidade</span></div>
        <div className="flex-1"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Lojas alcançadas</span></div>
        <div className="w-[90px] shrink-0" />
      </div>

      {/* Linhas */}
      <div className="flex flex-col gap-2">
        {filtered.map(({ oferta, status }) => {
          const badge = STATUS_BADGE[status];
          return (
            <div key={oferta.id} className="bg-white border border-[#e8e8e5] rounded-[10px] px-4 py-3 flex items-center">
              <div className="w-[220px] shrink-0"><span className="font-semibold text-[12px] text-[#2e2e2e]">{oferta.nome}</span></div>
              <div className="w-[120px] shrink-0">
                <span className="bg-[#ededeb] text-[#606060] font-normal text-[10px] px-[7px] py-[2px] rounded-[6px]">{oferta.setor}</span>
              </div>
              <div className="w-[110px] shrink-0"><span className="font-semibold text-[12px] text-[#2e2e2e]">R$ {fmt(oferta.precoPor)}</span></div>
              <div className="w-[120px] shrink-0"><span className="font-normal text-[11px] text-[#606060]">{fmtPeriodo(oferta.inicioVigencia, oferta.fimVigencia)}</span></div>
              <div className="w-[90px] shrink-0">
                <span className="font-semibold text-[10px] px-2 py-[3px] rounded-[6px]" style={{ background: badge.bg, color: badge.color }}>{status}</span>
              </div>
              <div className="w-[110px] shrink-0 flex items-center gap-2">
                <Toggle checked={oferta.visivel} onChange={() => onToggleVisivel(oferta.id)} />
                <span className={`font-normal text-[10px] ${oferta.visivel ? 'text-[#3d7a2e]' : 'text-[#606060]'}`}>
                  {oferta.visivel ? 'Visível' : 'Oculta'}
                </span>
              </div>
              <div className="flex-1">
                {status === 'Ativa' ? (
                  <span className="bg-[#e8f0e4] text-[#3d7a2e] font-semibold text-[10px] px-[7px] py-[3px] rounded-[6px]">{lojasAlcancadas(oferta.id)} lojas</span>
                ) : (
                  <span className="text-[#888] text-[11px]">—</span>
                )}
              </div>
              <div className="w-[90px] shrink-0 flex justify-end">
                {status === 'Pendente' && (
                  <button
                    onClick={() => onAprovar(oferta.id)}
                    className="flex items-center gap-1 bg-[#e8f0e4] border border-[#5ca847] text-[#3d7a2e] font-semibold text-[10px] px-2 py-[4px] rounded-[7px] hover:bg-[#d9ead4] transition-colors"
                  >
                    <Check size={10} /> Aprovar
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-[13px] text-[#888]">Nenhuma oferta encontrada.</div>
        )}
      </div>

      <div className="bg-[#e4eef4] border border-[#3878a8] rounded-[10px] px-4 py-3">
        <p className="font-normal text-[12px] text-[#23456b]">
          ℹ A visibilidade controla se a oferta aparece no Estúdio das Lojas. Ofertas inativas não são exibidas mesmo dentro do período de vigência.
        </p>
      </div>
    </div>
  );
}
