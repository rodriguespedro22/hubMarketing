import { useState } from 'react';
import { useCIStore } from '../data/ci';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import ControleCI from '../components/admin/ControleCI';
import CIOfertas from '../components/admin/CIOfertas';
import CadastrarCI from '../components/admin/CadastrarCI';
import CadastrarOfertaIndividual from '../components/admin/CadastrarOfertaIndividual';
import RepositorioArquivos, { REPOSITORIOS } from '../components/admin/RepositorioArquivos';
import EnviarArquivo from '../components/admin/EnviarArquivo';
import { AdminNav, Toggle, Placeholder } from '../components/admin/shared';

// ── Dados mockados ──────────────────────────────────────────────────────────

const USERS = [
  {
    name: 'Ana Souza', email: 'ana.souza@grupolebes.com.br', initials: 'AS', sector: 'MKT Criação',
    role: 'Admin', status: 'Ativo',
    avatarBg: '#e8f0e4', avatarColor: '#3d7a2e',
    roleBg: '#e8f0e4', roleColor: '#3d7a2e',
    statusBg: '#e8f0e4', statusColor: '#3d7a2e',
    modules: { studio: true, campanhas: true, marca: true, apoio: true, conteudo: false, dashboard: false },
    formats: ['Feed 1:1', 'Stories', 'Banner loja'],
    cargo: 'Coordenadora de Marketing',
    loja: '',
  },
  {
    name: 'João Pedro de Lima Pereira', email: 'joao.lima@grupolebes.com.br', initials: 'JL', sector: 'MKT Criação',
    role: 'Admin', status: 'Ativo',
    avatarBg: '#e4eef4', avatarColor: '#3878a8',
    roleBg: '#e4eef4', roleColor: '#3878a8',
    statusBg: '#e8f0e4', statusColor: '#3d7a2e',
    modules: { studio: true, campanhas: true, marca: false, apoio: true, conteudo: false, dashboard: false },
    formats: ['Feed 1:1', 'Stories'],
    cargo: 'Analista de Compras',
    loja: '',
  },
  {
    name: 'Fernanda Rüdi', email: 'f.rudi@lebes.com.br', initials: 'FR', sector: 'Loja Novo Hamburgo',
    role: 'Gestor de Loja', status: 'Ativo',
    avatarBg: '#fcf0e4', avatarColor: '#e0913a',
    roleBg: '#fcf0e4', roleColor: '#e0913a',
    statusBg: '#e8f0e4', statusColor: '#3d7a2e',
    modules: { studio: true, campanhas: true, marca: true, apoio: true, conteudo: false, dashboard: false },
    formats: ['Feed 1:1', 'Stories', 'Banner loja'],
    cargo: 'Gestora de Loja',
    loja: 'Loja Novo Hamburgo',
  },
  {
    name: 'Paulo Gomes', email: 'p.gomes@lebes.com.br', initials: 'PG', sector: 'Loja Sapucaia do Sul',
    role: 'Usuário Loja', status: 'Pendente',
    avatarBg: '#fcf0e4', avatarColor: '#e0913a',
    roleBg: '#fcf0e4', roleColor: '#e0913a',
    statusBg: '#fcf0e4', statusColor: '#e0913a',
    modules: { studio: true, campanhas: false, marca: false, apoio: true, conteudo: false, dashboard: false },
    formats: ['Stories'],
    cargo: '',
    loja: 'Loja Sapucaia do Sul',
  },
  {
    name: 'Tatiane Lima', email: 't.lima@lebes.com.br', initials: 'TL', sector: 'RH',
    role: 'Setorial', status: 'Inativo',
    avatarBg: '#e4eef4', avatarColor: '#3878a8',
    roleBg: '#e4eef4', roleColor: '#3878a8',
    statusBg: '#fce8e8', statusColor: '#c0392b',
    modules: { studio: false, campanhas: true, marca: false, apoio: true, conteudo: false, dashboard: false },
    formats: [],
    cargo: 'Analista de RH',
    loja: '',
  },
  {
    name: 'Diego Fagundes', email: 'd.fagundes@lebes.com.br', initials: 'DF', sector: 'DM',
    role: 'Setorial', status: 'Ativo',
    avatarBg: '#e4eef4', avatarColor: '#3878a8',
    roleBg: '#e4eef4', roleColor: '#3878a8',
    statusBg: '#e8f0e4', statusColor: '#3d7a2e',
    modules: { studio: true, campanhas: true, marca: true, apoio: true, conteudo: false, dashboard: false },
    formats: ['Feed 1:1', 'Stories', 'Banner web'],
    cargo: 'Coordenador DM',
    loja: '',
  },
];

const ROLE_FILTERS = ['Todos', 'MKT Criação', 'Setorial', 'Gestor de Loja', 'Usuário Loja'];

const ALL_FORMATS = ['Feed 1:1', 'Stories', 'Banner web', 'Impresso A4', 'Banner loja', 'Panfleto'];

const PERFIL_COLUNAS = ['MKT Criação', 'Setorial', 'Gestor Loja', 'Usuário Loja'];

const PERMISSOES_BADGE = {
  Total: { bg: '#e8f0e4', color: '#3d7a2e' },
  Parcial: { bg: '#fcf0e4', color: '#6b4a23' },
  '—': { bg: '#f7f6f2', color: '#888' },
};

const PERMISSOES_MATRIX = [
  { modulo: 'Estúdio Criativo', acessos: ['Total', 'Parcial', 'Parcial', 'Parcial'] },
  { modulo: 'Campanhas', acessos: ['Total', 'Parcial', 'Parcial', '—'] },
  { modulo: 'Hub da Marca', acessos: ['Total', 'Total', 'Total', '—'] },
  { modulo: 'Central de Apoio', acessos: ['Total', 'Total', 'Total', '—'] },
  { modulo: 'Módulo de Ofertas', acessos: ['Total', '—', 'Total', 'Total'] },
  { modulo: 'Upload de Arquivos', acessos: ['Total', '—', '—', '—'] },
  { modulo: 'Gestão de Usuários', acessos: ['Total', '—', '—', '—'] },
  { modulo: 'Dashboard Admin', acessos: ['Total', '—', '—', '—'] },
];

const MODULES_INFO = [
  { id: 'studio', label: 'Estúdio Criativo', desc: 'Acesso ao editor e templates', iconBg: '#f0e8f3' },
  { id: 'campanhas', label: 'Campanhas', desc: 'Ver e baixar arquivos de campanhas', iconBg: '#e4eef4' },
  { id: 'marca', label: 'Hub da Marca', desc: 'Brandbook e diretrizes visuais', iconBg: '#e8f0e4' },
  { id: 'apoio', label: 'Central de Apoio', desc: 'FAQ, tutoriais e contatos', iconBg: '#fcf0e4' },
  { id: 'conteudo', label: 'Gestão de Conteúdo', desc: 'Upload de materiais e classificação', iconBg: '#fce8e8' },
  { id: 'dashboard', label: 'Dashboard Admin', desc: 'Painel administrativo completo', iconBg: '#fce8e8' },
];

// ── Perfis e Permissões ─────────────────────────────────────────────────────

function PerfisPermissoes({ onBack, onHome }) {
  return (
    <div className="flex flex-col gap-[14px] px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />

      <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">Perfis e Permissões</h1>
      <p className="font-light text-[14px] text-[#606060] -mt-3">Defina quais módulos cada perfil pode acessar</p>

      {/* Cabeçalho */}
      <div className="bg-[#f7f6f2] rounded-[10px] px-[14px] py-[10px] flex items-center">
        <div className="w-[260px] shrink-0">
          <span className="font-semibold text-[11px] text-[#888] tracking-[0.4px] uppercase">Módulo</span>
        </div>
        {PERFIL_COLUNAS.map(col => (
          <div key={col} className="flex-1 text-center">
            <span className="font-semibold text-[11px] text-[#888] tracking-[0.4px] uppercase">{col}</span>
          </div>
        ))}
      </div>

      {/* Linhas */}
      <div className="flex flex-col gap-[10px]">
        {PERMISSOES_MATRIX.map(({ modulo, acessos }) => (
          <div
            key={modulo}
            className="bg-white border border-[#e8e8e5] rounded-[10px] px-[14px] py-3 flex items-center"
          >
            <div className="w-[260px] shrink-0">
              <span className="font-medium text-[13px] text-[#2e2e2e]">{modulo}</span>
            </div>
            {acessos.map((nivel, i) => {
              const { bg, color } = PERMISSOES_BADGE[nivel];
              return (
                <div key={i} className="flex-1 flex justify-center">
                  <span
                    className="font-semibold text-[11px] px-2 py-[3px] rounded-[6px]"
                    style={{ background: bg, color }}
                  >
                    {nivel}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="bg-[#fcf0e4] border border-[#e0913a] rounded-[10px] px-[14px] py-3">
        <p className="font-normal text-[12px] text-[#6b4a23]">
          Parcial = acesso configurável por usuário. O Admin Criação define os módulos e formatos específicos de cada pessoa.
        </p>
      </div>
    </div>
  );
}

// ── Gestão de Usuários ──────────────────────────────────────────────────────

function GestaoUsuarios({ onConvidar, onEditUser, onBack, onHome }) {
  const [filter, setFilter] = useState('Todos');

  const filtered = filter === 'Todos' ? USERS : USERS.filter(u => u.role === filter);

  return (
    <div className="flex flex-col gap-[18px] h-full overflow-y-auto px-7 py-6">
      <AdminNav onBack={onBack} onHome={onHome} />
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">Gestão de Usuários</h1>
        <button
          onClick={onConvidar}
          className="bg-[#5ca847] text-white font-semibold text-[13px] px-4 py-[10px] rounded-[10px] hover:bg-[#4a9438] transition-colors"
        >
          + Convidar usuário
        </button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        {ROLE_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-[14px] py-[7px] rounded-[20px] text-[12px] transition-colors ${
              filter === f
                ? 'bg-[#2e2e2e] text-white font-semibold'
                : 'bg-white border border-[#e8e8e5] text-[#606060] font-medium hover:bg-[#f7f6f2]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cabeçalho da tabela */}
      <div className="bg-[#f7f6f2] rounded-[10px] px-4 py-[10px] flex items-center">
        <div className="w-[260px] shrink-0">
          <span className="font-semibold text-[11px] text-[#888] tracking-[0.4px] uppercase">Usuário</span>
        </div>
        <div className="w-[180px] shrink-0">
          <span className="font-semibold text-[11px] text-[#888] tracking-[0.4px] uppercase">Setor / Loja</span>
        </div>
        <div className="w-[160px] shrink-0">
          <span className="font-semibold text-[11px] text-[#888] tracking-[0.4px] uppercase">Perfil</span>
        </div>
        <div className="w-[140px] shrink-0">
          <span className="font-semibold text-[11px] text-[#888] tracking-[0.4px] uppercase">Status</span>
        </div>
        <div className="shrink-0">
          <span className="font-semibold text-[11px] text-[#888] tracking-[0.4px] uppercase">Ações</span>
        </div>
      </div>

      {/* Linhas */}
      <div className="flex flex-col gap-3">
        {filtered.map(user => (
          <div
            key={user.email}
            className="bg-white border border-[#e8e8e5] rounded-[12px] px-4 py-[14px] flex items-center"
          >
            {/* Avatar + nome */}
            <div className="w-[260px] shrink-0 flex items-center gap-[10px]">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: user.avatarBg }}
              >
                <span className="font-bold text-[11px]" style={{ color: user.avatarColor }}>{user.initials}</span>
              </div>
              <div>
                <p className="font-semibold text-[13px] text-[#2e2e2e] leading-tight">{user.name}</p>
                <p className="font-normal text-[11px] text-[#606060] leading-tight">{user.email}</p>
              </div>
            </div>
            {/* Setor */}
            <div className="w-[180px] shrink-0">
              <span className="font-normal text-[13px] text-[#606060]">{user.sector}</span>
            </div>
            {/* Perfil */}
            <div className="w-[160px] shrink-0">
              <span
                className="font-semibold text-[11px] px-[10px] py-1 rounded-[6px]"
                style={{ background: user.roleBg, color: user.roleColor }}
              >
                {user.role}
              </span>
            </div>
            {/* Status */}
            <div className="w-[140px] shrink-0">
              <span
                className="font-semibold text-[11px] px-[10px] py-1 rounded-[6px]"
                style={{ background: user.statusBg, color: user.statusColor }}
              >
                {user.status}
              </span>
            </div>
            {/* Ações */}
            <div className="flex items-center gap-[6px]">
              <button
                onClick={() => onEditUser(user)}
                className="bg-[#f7f6f2] border border-[#e8e8e5] text-[#606060] font-medium text-[11px] px-[10px] py-[5px] rounded-[7px] hover:bg-[#edece7] transition-colors"
              >
                Editar
              </button>
              <button className="bg-[#f7f6f2] border border-[#e8e8e5] text-[#606060] font-medium text-[11px] px-[10px] py-[5px] rounded-[7px] hover:bg-[#edece7] transition-colors">
                ···
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Convidar Usuário ────────────────────────────────────────────────────────

function ConvidarUsuario({ onBack, onHome }) {
  const [form, setForm] = useState({ nome: '', email: '', perfil: '', setor: '', cargo: '' });
  const [modulos, setModulos] = useState({ Estúdio: true, Campanhas: true, 'Hub da Marca': false, Apoio: false });

  const toggleModulo = (m) => setModulos(prev => ({ ...prev, [m]: !prev[m] }));

  return (
    <div className="flex flex-col gap-[22px] px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />

      <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">Convidar novo usuário</h1>
      <p className="font-light text-[14px] text-[#606060] -mt-4">Preencha os dados para enviar o convite por e-mail</p>

      <div className="bg-white border border-[#e8e8e5] rounded-[16px] px-7 py-6 flex flex-col gap-5">
        {/* Linha 1: nome + email */}
        <div className="flex gap-5">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Nome completo <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input
              value={form.nome}
              onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
              placeholder="ex: Ana Souza"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]"
            />
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              E-mail corporativo <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="ex: ana.souza@lebes.com.br"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]"
            />
          </div>
        </div>

        {/* Linha 2: perfil + setor */}
        <div className="flex gap-5">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Perfil de acesso <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <select
              value={form.perfil}
              onChange={e => setForm(p => ({ ...p, perfil: e.target.value }))}
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#606060]"
            >
              <option value="">MKT Criação / Setorial / Gestor de Loja / Usuário Loja</option>
              <option value="mkt">MKT Criação</option>
              <option value="setorial">Setorial</option>
              <option value="gestor">Gestor de Loja</option>
              <option value="usuario">Usuário Loja</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Setor ou Loja <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input
              value={form.setor}
              onChange={e => setForm(p => ({ ...p, setor: e.target.value }))}
              placeholder="Compras / RH / DM / Loja Novo Hamburgo..."
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]"
            />
          </div>
        </div>

        {/* Linha 3: cargo + módulos */}
        <div className="flex gap-5">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e]">Cargo (opcional)</label>
            <input
              value={form.cargo}
              onChange={e => setForm(p => ({ ...p, cargo: e.target.value }))}
              placeholder="ex: Analista de Compras"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]"
            />
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e]">Módulos liberados</label>
            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries(modulos).map(([m, on]) => (
                <button
                  key={m}
                  onClick={() => toggleModulo(m)}
                  className={`text-[11px] font-medium px-[10px] py-[5px] rounded-[6px] border transition-colors ${
                    on
                      ? 'bg-[#e8f0e4] border-[#5ca847] text-[#3d7a2e]'
                      : 'bg-[#f7f6f2] border-[#e8e8e5] text-[#606060] hover:bg-[#edece7]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#e8e8e5]" />

        {/* Preview convite */}
        <div className="bg-[#e8f0e4] border border-[#5ca847] rounded-[12px] px-4 py-[14px] flex flex-col gap-1">
          <p className="font-semibold text-[12px] text-[#3d7a2e]">📧  Preview do convite</p>
          <p className="font-normal text-[12px] text-[#3d7a2e]">
            Será enviado um e-mail para o endereço informado com um link para criar senha e acessar o HUB de Marketing.
          </p>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onBack}
            className="bg-white border border-[#e8e8e5] text-[#606060] font-medium text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#f7f6f2] transition-colors"
          >
            Cancelar
          </button>
          <button className="bg-[#5ca847] text-white font-semibold text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#4a9438] transition-colors">
            Enviar convite →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Perfil de Usuário (Edição) ───────────────────────────────────────────────

function PerfilUsuario({ user, onBack, onHome }) {
  const [modules, setModules] = useState(user.modules || {});
  const [formats, setFormats] = useState(new Set(user.formats || []));

  const toggleModule = (id) => setModules(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleFormat = (f) => setFormats(prev => {
    const next = new Set(prev);
    next.has(f) ? next.delete(f) : next.add(f);
    return next;
  });

  return (
    <div className="flex flex-col gap-5 px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />

      <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">
        {user.name} — Perfil de acesso
      </h1>

      {/* Info do usuário */}
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ background: user.avatarBg }}
        >
          <span className="font-bold text-[14px]" style={{ color: user.avatarColor }}>{user.initials}</span>
        </div>
        <div>
          <p className="font-normal text-[13px] text-[#606060]">{user.email}</p>
          <p className="font-light text-[12px] text-[#606060]">
            {[user.sector, user.role].filter(Boolean).join(' · ')}
          </p>
        </div>
        <span
          className="font-semibold text-[12px] px-[10px] py-[5px] rounded-[8px]"
          style={{ background: user.statusBg, color: user.statusColor }}
        >
          ● {user.status}
        </span>
      </div>

      {/* Cards de módulos */}
      <div className="flex gap-4 flex-wrap">
        {MODULES_INFO.map(({ id, label, desc, iconBg }) => {
          const on = modules[id] ?? false;
          return (
            <div
              key={id}
              className="bg-white border border-[#e8e8e5] rounded-[14px] p-4 flex flex-col gap-3 w-[180px]"
            >
              <div className="w-9 h-9 rounded-[10px]" style={{ background: iconBg }} />
              <p className="font-semibold text-[12px] text-[#2e2e2e]">{label}</p>
              <p className="font-normal text-[11px] text-[#606060] leading-tight">{desc}</p>
              <div className="flex items-center justify-between">
                <span className={`font-medium text-[11px] ${on ? 'text-[#3d7a2e]' : 'text-[#606060]'}`}>
                  {on ? 'Liberado' : 'Bloqueado'}
                </span>
                <Toggle checked={on} onChange={() => toggleModule(id)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Formatos */}
      <div className="bg-white border border-[#e8e8e5] rounded-[14px] px-5 py-[18px] flex flex-col gap-[14px]">
        <p className="font-semibold text-[13px] text-[#2e2e2e]">
          Estúdio Criativo — Formatos liberados para este perfil
        </p>
        <p className="font-light text-[12px] text-[#606060] -mt-2">
          O usuário pode criar materiais somente nos formatos marcados abaixo
        </p>
        <div className="flex items-center gap-[10px] flex-wrap">
          {ALL_FORMATS.map(f => {
            const on = formats.has(f);
            return (
              <button
                key={f}
                onClick={() => toggleFormat(f)}
                className={`text-[12px] font-medium px-3 py-[7px] rounded-[8px] border transition-colors ${
                  on
                    ? 'bg-[#e8f0e4] border-[#5ca847] text-[#3d7a2e]'
                    : 'bg-[#f7f6f2] border-[#e8e8e5] text-[#606060] hover:bg-[#edece7]'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botões */}
      <div className="flex items-center justify-end gap-[10px]">
        <button className="bg-[#fce8e8] border border-[#e5cccc] text-[#c0392b] font-medium text-[13px] px-4 py-[11px] rounded-[10px] hover:bg-[#f8d0d0] transition-colors">
          Desativar usuário
        </button>
        <button className="bg-[#5ca847] text-white font-semibold text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#4a9438] transition-colors">
          Salvar alterações
        </button>
      </div>
    </div>
  );
}

// ── View principal ───────────────────────────────────────────────────────────

const REPO_ID_BY_VIEW = {
  'repo-apoio': 'apoio',
  'repo-campanhas': 'campanhas',
  'repo-marcas': 'marcas',
  'repo-estudio': 'estudio',
};

const VIEW_BY_REPO_ID = Object.fromEntries(
  Object.entries(REPO_ID_BY_VIEW).map(([view, repoId]) => [repoId, view])
);

const PLACEHOLDER_TITLES = {
  'campanhas-admin': 'Campanhas',
};

export default function AdminLebes({ onBack, onHome }) {
  const [adminView, setAdminView] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCIId, setSelectedCIId] = useState(null);
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const [prevView, setPrevView] = useState(null);
  const { cis, addCI, addOfertaToCI, toggleOfertaVisivel, aprovarOferta } = useCIStore();
  const [repoFiles, setRepoFiles] = useState(() => {
    const init = {};
    for (const id in REPOSITORIOS) init[id] = REPOSITORIOS[id].arquivosIniciais;
    return init;
  });

  const navigate = (view) => {
    setPrevView(adminView);
    setAdminView(view);
  };

  const goBack = () => {
    if (prevView) {
      setAdminView(prevView);
      setPrevView(null);
    } else {
      onBack();
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    navigate('perfil');
  };

  const handleConvidar = () => navigate('convidar');

  const handleVerOfertas = (ciId) => {
    setSelectedCIId(ciId);
    navigate('ci-ofertas');
  };

  const handlePublishCI = (ci) => {
    addCI(ci);
    navigate('controle-ci');
  };

  const handleEnviarArquivo = (repoId) => {
    setSelectedRepoId(repoId);
    navigate('enviar-arquivo');
  };

  const addRepoFile = (repoId, arquivo) => setRepoFiles(prev => ({ ...prev, [repoId]: [arquivo, ...prev[repoId]] }));
  const removeRepoFile = (repoId, nome) => setRepoFiles(prev => ({ ...prev, [repoId]: prev[repoId].filter(a => a.nome !== nome) }));

  const handlePublishArquivo = (repoId, arquivo) => {
    addRepoFile(repoId, arquivo);
    navigate(VIEW_BY_REPO_ID[repoId] || 'controle-ci');
  };

  const selectedCI = cis.find(c => c.id === selectedCIId) || null;

  return (
    <div
      className="w-full h-screen flex overflow-hidden bg-[#f7f6f2]"
      style={{ fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      <AdminSidebar activeView={adminView} onNavigate={navigate} />

      <main className="flex-1 min-w-0 overflow-hidden">
        {adminView === 'dashboard' && (
          <AdminDashboard onNovaOferta={() => navigate('controle-ci')} onBack={goBack} onHome={onHome} />
        )}
        {adminView === 'usuarios' && (
          <GestaoUsuarios onConvidar={handleConvidar} onEditUser={handleEditUser} onBack={goBack} onHome={onHome} />
        )}
        {adminView === 'convidar' && (
          <ConvidarUsuario onBack={goBack} onHome={onHome} />
        )}
        {adminView === 'perfil' && selectedUser && (
          <PerfilUsuario user={selectedUser} onBack={goBack} onHome={onHome} />
        )}
        {adminView === 'perfis' && (
          <PerfisPermissoes onBack={goBack} onHome={onHome} />
        )}
        {adminView === 'controle-ci' && (
          <ControleCI cis={cis} onVerOfertas={handleVerOfertas} onNovaCI={() => navigate('cadastrar-ci')} onBack={goBack} onHome={onHome} />
        )}
        {adminView === 'ci-ofertas' && selectedCI && (
          <CIOfertas
            ci={selectedCI}
            onNovaOferta={() => navigate('nova-oferta')}
            onToggleVisivel={(ofertaId) => toggleOfertaVisivel(selectedCI.id, ofertaId)}
            onAprovar={(ofertaId) => aprovarOferta(selectedCI.id, ofertaId)}
            onBack={goBack}
            onHome={onHome}
          />
        )}
        {adminView === 'cadastrar-ci' && (
          <CadastrarCI onPublish={handlePublishCI} onBack={goBack} onHome={onHome} />
        )}
        {adminView === 'nova-oferta' && (
          <CadastrarOfertaIndividual
            ci={selectedCI}
            onImportarCI={() => navigate('cadastrar-ci')}
            onSubmit={(oferta) => {
              if (selectedCI) addOfertaToCI(selectedCI.id, oferta);
              navigate(selectedCI ? 'ci-ofertas' : 'controle-ci');
            }}
            onBack={goBack}
            onHome={onHome}
          />
        )}
        {REPO_ID_BY_VIEW[adminView] && (
          <RepositorioArquivos
            repoId={REPO_ID_BY_VIEW[adminView]}
            arquivos={repoFiles[REPO_ID_BY_VIEW[adminView]]}
            onExcluir={(nome) => removeRepoFile(REPO_ID_BY_VIEW[adminView], nome)}
            onEnviarArquivo={() => handleEnviarArquivo(REPO_ID_BY_VIEW[adminView])}
            onBack={goBack}
            onHome={onHome}
          />
        )}
        {(adminView === 'enviar-arquivo' || adminView === 'templates') && (
          <EnviarArquivo
            repoIdInicial={adminView === 'templates' ? null : selectedRepoId}
            onPublish={handlePublishArquivo}
            onBack={goBack}
            onHome={onHome}
          />
        )}
        {PLACEHOLDER_TITLES[adminView] && (
          <Placeholder title={PLACEHOLDER_TITLES[adminView]} onBack={goBack} onHome={onHome} />
        )}
      </main>
    </div>
  );
}
