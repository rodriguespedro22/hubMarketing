import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { getCIStatus } from '../../data/ci';
import { AdminNav } from './shared';

const STATUS_BADGE = {
  Ativa: { bg: '#e8f0e4', color: '#3d7a2e' },
  Encerrada: { bg: '#ededeb', color: '#606060' },
  Prevista: { bg: '#fcf0e4', color: '#e0913a' },
};

const FILTROS = ['Todas', 'Ativas', 'Encerradas', 'Previstas'];
const FILTRO_STATUS = { Ativas: 'Ativa', Encerradas: 'Encerrada', Previstas: 'Prevista' };

function fmtPeriodo(inicio, fim) {
  const f = (d) => d?.slice(8, 10) + '/' + d?.slice(5, 7);
  return `${f(inicio)} – ${f(fim)}`;
}

export default function ControleCI({ cis, onVerOfertas, onNovaCI, onBack, onHome }) {
  const [filtro, setFiltro] = useState('Todas');
  const [categoria, setCategoria] = useState('Todas');
  const [q, setQ] = useState('');

  const categorias = useMemo(() => ['Todas', ...new Set(cis.map(c => c.material))], [cis]);

  const rows = useMemo(() => cis
    .map(ci => ({ ci, status: getCIStatus(ci) }))
    .filter(({ status }) => filtro === 'Todas' || status === FILTRO_STATUS[filtro])
    .filter(({ ci }) => categoria === 'Todas' || ci.material === categoria)
    .filter(({ ci }) => !q || ci.nome.toLowerCase().includes(q.toLowerCase())),
    [cis, filtro, categoria, q]);

  const totalAtivas = cis.filter(ci => getCIStatus(ci) === 'Ativa').length;
  const totalEncerradas = cis.filter(ci => getCIStatus(ci) === 'Encerrada').length;

  return (
    <div className="flex flex-col gap-[18px] px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />

      <div>
        <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">Controle de CI</h1>
        <p className="font-light text-[14px] text-[#606060] mt-1">Gerencie a visibilidade e vigência das ofertas enviadas pelos setores</p>
      </div>

      {/* Stat cards */}
      <div className="flex items-start gap-[14px]">
        <div className="flex-1 flex flex-col gap-1 rounded-[12px] border border-[#e8e8e5] bg-white px-[16px] py-3">
          <span className="font-normal text-[12px] text-[#606060]">Total de CIs</span>
          <span className="font-bold text-[28px] tracking-[-0.5px] text-[#2e2e2e]">{cis.length}</span>
        </div>
        <div className="flex-1 flex flex-col gap-1 rounded-[12px] border border-[#e8e8e5] px-[16px] py-3" style={{ background: '#e8f0e4' }}>
          <span className="font-normal text-[12px] text-[#606060]">CIs ativas</span>
          <span className="font-bold text-[28px] tracking-[-0.5px] text-[#3d7a2e]">{totalAtivas}</span>
          <span className="font-normal text-[10.5px] text-[#606060]">publicando ofertas</span>
        </div>
        <div className="flex-1 flex flex-col gap-1 rounded-[12px] border border-[#e8e8e5] px-[16px] py-3" style={{ background: '#ededeb' }}>
          <span className="font-normal text-[12px] text-[#606060]">CIs encerradas</span>
          <span className="font-bold text-[28px] tracking-[-0.5px] text-[#606060]">{totalEncerradas}</span>
          <span className="font-normal text-[10.5px] text-[#606060]">fora da vigência</span>
        </div>
      </div>

      {/* Filtros + busca */}
      <div className="flex items-center justify-between flex-wrap gap-2">
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
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="h-[30px] bg-white border border-[#e8e8e5] rounded-[20px] px-3 text-[12px] text-[#606060]"
          >
            {categorias.map(c => <option key={c} value={c}>{c === 'Todas' ? 'Categoria: Todas' : c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Buscar CI..."
              className="h-9 w-[220px] bg-white border border-[#e8e8e5] rounded-[10px] pl-8 pr-3 text-[12px] text-[#2e2e2e] placeholder-[#888]"
            />
          </div>
          <button
            onClick={onNovaCI}
            className="bg-[#5ca847] text-white font-semibold text-[13px] px-4 py-[10px] rounded-[10px] hover:bg-[#4a9438] transition-colors whitespace-nowrap"
          >
            + Nova CI
          </button>
        </div>
      </div>

      {/* Cabeçalho da tabela */}
      <div className="bg-[#ededeb] rounded-[8px] px-4 py-[10px] flex items-center">
        <div className="w-[220px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">CI</span></div>
        <div className="w-[160px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Material</span></div>
        <div className="w-[100px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Ofertas</span></div>
        <div className="w-[130px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Período</span></div>
        <div className="w-[100px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Status</span></div>
        <div className="w-[130px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Criado por</span></div>
        <div className="flex-1"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Ações</span></div>
      </div>

      {/* Linhas */}
      <div className="flex flex-col gap-2">
        {rows.map(({ ci, status }) => {
          const badge = STATUS_BADGE[status];
          return (
            <button
              key={ci.id}
              onClick={() => onVerOfertas(ci.id)}
              className="bg-white border border-[#e8e8e5] rounded-[10px] px-4 py-3 flex items-center text-left hover:border-[#5ca847]/50 transition-colors"
            >
              <div className="w-[220px] shrink-0"><span className="font-semibold text-[13px] text-[#2e2e2e]">{ci.nome}</span></div>
              <div className="w-[160px] shrink-0">
                <span className="bg-[#ededeb] text-[#606060] font-normal text-[10px] px-[7px] py-[2px] rounded-[6px]">{ci.material}</span>
              </div>
              <div className="w-[100px] shrink-0"><span className="font-semibold text-[12px] text-[#2e2e2e]">{ci.ofertas.length} ofertas</span></div>
              <div className="w-[130px] shrink-0"><span className="font-normal text-[11px] text-[#606060]">{fmtPeriodo(ci.inicioVigencia, ci.fimVigencia)}</span></div>
              <div className="w-[100px] shrink-0">
                <span className="font-semibold text-[10px] px-2 py-[3px] rounded-[6px]" style={{ background: badge.bg, color: badge.color }}>{status}</span>
              </div>
              <div className="w-[130px] shrink-0"><span className="font-normal text-[12px] text-[#606060]">{ci.criadoPor}</span></div>
              <div className="flex-1"><span className="font-semibold text-[12px] text-[#3d7a2e]">Ver ofertas →</span></div>
            </button>
          );
        })}
        {rows.length === 0 && (
          <div className="text-center py-8 text-[13px] text-[#888]">Nenhuma CI encontrada.</div>
        )}
      </div>

      <div className="bg-[#e4eef4] border border-[#3878a8] rounded-[10px] px-4 py-3">
        <p className="font-normal text-[12px] text-[#23456b]">
          ℹ Cada CI reúne um grupo de ofertas recebidas via planilha. Clique em uma CI para ver as ofertas individuais.
        </p>
      </div>
    </div>
  );
}
