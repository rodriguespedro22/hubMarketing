import { useState } from 'react';
import { ArrowLeft, Home, MessageCircle, Folder, Star, LayoutGrid, UploadCloud, Check, Download, Search } from 'lucide-react';

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

const DASHBOARD_STATS = [
  { label: 'Usuários ativos', value: '347', bg: '#e8f0e4', color: '#3d7a2e' },
  { label: 'Materiais publicados', value: '1.243', bg: '#e4eef4', color: '#3878a8' },
  { label: 'Ofertas pendentes', value: '18', bg: '#fcf0e4', color: '#6b4a23' },
  { label: 'Campanhas ativas', value: '5', bg: '#fbe8f0', color: '#d6568b' },
];

const DASHBOARD_ACTIVITY = [
  { name: 'Ana Souza', initials: 'AS', avatarBg: '#e8f0e4', avatarColor: '#3d7a2e', action: 'subiu 3 arquivos na Copa Lebes', time: 'há 12 min' },
  { name: 'Carlos Melo', initials: 'CM', avatarBg: '#e4eef4', avatarColor: '#3878a8', action: 'baixou templates de campanha', time: 'há 34 min' },
  { name: 'Fernanda Rüdi', initials: 'FR', avatarBg: '#fcf0e4', avatarColor: '#e0913a', action: 'cadastrou 2 novas ofertas', time: 'há 1h' },
  { name: 'Paulo Gomes', initials: 'PG', avatarBg: '#fcf0e4', avatarColor: '#e0913a', action: 'oferta aguardando aprovação', time: 'há 2h' },
  { name: 'Diego Fagundes', initials: 'DF', avatarBg: '#e4eef4', avatarColor: '#3878a8', action: 'acessou Hub da Marca', time: 'há 3h' },
];

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

const OFERTAS_STATS = [
  { label: 'Total de ofertas', value: '24', note: '+3 esta semana', bg: '#ffffff', color: '#2e2e2e' },
  { label: 'Ativas e visíveis', value: '8', note: 'aparecendo nas lojas', bg: '#e8f0e4', color: '#5ca847' },
  { label: 'Pendentes', value: '6', note: 'aguardando aprovação', bg: '#fcf0e4', color: '#e0913a' },
  { label: 'Expiradas', value: '10', note: 'fora da vigência', bg: '#ededeb', color: '#606060' },
];

const OFERTAS_FILTROS = ['Todas', 'Ativas', 'Pendentes', 'Expiradas', 'Futuras'];

const OFERTAS_STATUS_BADGE = {
  Ativa: { bg: '#e8f0e4', color: '#3d7a2e' },
  Pendente: { bg: '#fcf0e4', color: '#6b4a23' },
  Expirada: { bg: '#ededeb', color: '#606060' },
  Futura: { bg: '#e4eef4', color: '#23456b' },
};

const OFERTAS_INICIAIS = [
  { id: 1, produto: 'Smart TV 55" 4K LG', setor: 'Tecnologia', preco: 'R$ 2.499,00', vigencia: '01/07–07/07', status: 'Ativa', visivel: true, lojas: '87 lojas' },
  { id: 2, produto: 'Estofado Verona Bressiani', setor: 'Móveis', preco: 'R$ 1.399,90', vigencia: '01/07–14/07', status: 'Ativa', visivel: false, lojas: null },
  { id: 3, produto: 'Geladeira Brastemp 400L', setor: 'Linha Branca', preco: 'R$ 2.149,00', vigencia: '05/07–12/07', status: 'Pendente', visivel: false, lojas: null },
  { id: 4, produto: 'Tênis Nike Air Max 270', setor: 'Moda', preco: 'R$ 649,90', vigencia: '08/07–21/07', status: 'Pendente', visivel: false, lojas: null },
  { id: 5, produto: 'Samsung Galaxy A07', setor: 'Tecnologia', preco: 'R$ 999,00', vigencia: '15/06–30/06', status: 'Expirada', visivel: false, lojas: null },
  { id: 6, produto: 'Sofá Retrátil 3 Lugares', setor: 'Móveis', preco: 'R$ 1.890,00', vigencia: '01/08–31/08', status: 'Futura', visivel: false, lojas: null },
];

const CENTRAIS_UPLOAD = [
  { id: 'apoio', title: 'Central de Apoio', desc: 'Tutoriais, vídeos e guias por setor', icon: MessageCircle, accent: '#5ca847', bg: '#e8f0e4', hint: 'MP4, PDF, PNG · até 200 MB' },
  { id: 'campanhas', title: 'Central de Campanhas', desc: 'Materiais e peças para download', icon: Folder, accent: '#e0913a', bg: '#fcf0e4', hint: 'PDF, MP3, ZIP, JPG · até 200 MB' },
  { id: 'marcas', title: 'Central das Marcas', desc: 'Logo, fontes e identidade visual', icon: Star, accent: '#3878a8', bg: '#e4eef4', hint: 'SVG, PNG, PDF, TTF · até 100 MB' },
  { id: 'estudio', title: 'Estúdio Criativo', desc: 'Templates e modelos para o editor', icon: LayoutGrid, accent: '#8b5c9e', bg: '#f0e8f3', hint: 'PNG, JPG, JSON · até 100 MB' },
];

const MODULES_INFO = [
  { id: 'studio', label: 'Estúdio Criativo', desc: 'Acesso ao editor e templates', iconBg: '#f0e8f3' },
  { id: 'campanhas', label: 'Campanhas', desc: 'Ver e baixar arquivos de campanhas', iconBg: '#e4eef4' },
  { id: 'marca', label: 'Hub da Marca', desc: 'Brandbook e diretrizes visuais', iconBg: '#e8f0e4' },
  { id: 'apoio', label: 'Central de Apoio', desc: 'FAQ, tutoriais e contatos', iconBg: '#fcf0e4' },
  { id: 'conteudo', label: 'Gestão de Conteúdo', desc: 'Upload de materiais e classificação', iconBg: '#fce8e8' },
  { id: 'dashboard', label: 'Dashboard Admin', desc: 'Painel administrativo completo', iconBg: '#fce8e8' },
];

// ── Sidebar ─────────────────────────────────────────────────────────────────

function SidebarItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-[9px] px-[10px] py-[9px] rounded-[9px] text-left transition-colors ${
        active ? 'bg-[#e8f0e4]' : 'hover:bg-[#f7f6f2]'
      }`}
    >
      <div
        className="w-[6px] h-[6px] rounded-full shrink-0"
        style={{ background: active ? '#3d7a2e' : '#ccc' }}
      />
      <span
        className={`text-[13px] ${active ? 'font-semibold text-[#3d7a2e]' : 'font-medium text-[#606060]'}`}
      >
        {label}
      </span>
    </button>
  );
}

function AdminSidebar({ activeView, onNavigate }) {
  const isUsuariosSection = ['usuarios', 'convidar', 'perfil'].includes(activeView);

  return (
    <aside className="w-[220px] h-full bg-white border-r border-[#e8e8e5] flex flex-col px-[14px] py-5 shrink-0">
      <div className="flex items-center gap-2 pl-[6px] pb-[18px]">
        <div className="w-7 h-7 bg-[#5ca847] rounded-[8px]" />
        <span className="font-bold text-[13px] text-[#2e2e2e]">Admin Lebes</span>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="px-[8px] py-[10px] pb-[8px]">
          <span className="font-semibold text-[10px] text-[#888] tracking-[0.5px] uppercase">Geral</span>
        </div>
        <SidebarItem label="Dashboard" active={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
        <SidebarItem label="Gestão de Conteúdo" active={activeView === 'conteudo'} onClick={() => onNavigate('conteudo')} />

        <div className="px-[8px] pt-[10px] pb-[8px]">
          <span className="font-semibold text-[10px] text-[#888] tracking-[0.5px] uppercase">Usuários</span>
        </div>
        <SidebarItem label="Gestão de Usuários" active={isUsuariosSection} onClick={() => onNavigate('usuarios')} />
        <SidebarItem label="Perfis e Permissões" active={activeView === 'perfis'} onClick={() => onNavigate('perfis')} />

        <div className="px-[8px] pt-[10px] pb-[8px]">
          <span className="font-semibold text-[10px] text-[#888] tracking-[0.5px] uppercase">Cadastros</span>
        </div>
        <SidebarItem label="Ofertas (CI)" active={activeView === 'ofertas'} onClick={() => onNavigate('ofertas')} />
        <SidebarItem label="Templates" active={activeView === 'templates'} onClick={() => onNavigate('templates')} />
        <SidebarItem label="Campanhas" active={activeView === 'campanhas-admin'} onClick={() => onNavigate('campanhas-admin')} />
      </div>
    </aside>
  );
}

// ── Barra de navegação interna (Voltar / Início) ─────────────────────────────

function AdminNav({ onBack, onHome }) {
  return (
    <div className="flex items-center gap-2 mb-[18px]">
      <button
        onClick={onBack}
        className="bg-white border border-[#e8e8e5] text-[#606060] font-medium text-[12.5px] pl-3 pr-[14px] py-2 rounded-[20px] hover:bg-[#f7f6f2] transition-colors"
      >
        ← Voltar
      </button>
      <button
        onClick={onHome}
        className="flex items-center gap-1.5 bg-white border border-[#e8e8e5] text-[#606060] font-medium text-[12px] pl-3 pr-[14px] py-2 rounded-[20px] hover:bg-[#f7f6f2] transition-colors"
      >
        <Home size={11} /> Início
      </button>
    </div>
  );
}

// ── Dashboard ───────────────────────────────────────────────────────────────

function AdminDashboard({ onBack, onHome }) {
  return (
    <div className="flex flex-col gap-5 px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />
      <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">Dashboard</h1>
      <p className="font-light text-[14px] text-[#606060] -mt-3">Visão geral do HUB de Marketing</p>

      {/* Cards de estatísticas */}
      <div className="flex items-start gap-[14px]">
        {DASHBOARD_STATS.map(({ label, value, bg, color }) => (
          <div
            key={label}
            className="flex flex-col gap-1 rounded-[14px] px-[18px] py-4 w-[280px]"
            style={{ background: bg, color }}
          >
            <span className="font-medium text-[11px]">{label}</span>
            <span className="font-bold text-[28px]">{value}</span>
          </div>
        ))}
      </div>

      {/* Atividade recente */}
      <span className="font-semibold text-[11px] text-[#888] tracking-[0.5px] uppercase">Atividade recente</span>
      <div className="flex flex-col gap-2">
        {DASHBOARD_ACTIVITY.map(({ name, initials, avatarBg, avatarColor, action, time }) => (
          <div
            key={name}
            className="bg-white border border-[#e8e8e5] rounded-[12px] px-4 py-3 flex items-center gap-3"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: avatarBg }}
            >
              <span className="font-bold text-[11px]" style={{ color: avatarColor }}>{initials}</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-[13px] text-[#2e2e2e]">{name}</span>
              <span className="font-normal text-[12px] text-[#606060]">{action}</span>
            </div>
            <span className="font-normal text-[11px] text-[#606060] ml-auto">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Gestão de Conteúdo ──────────────────────────────────────────────────────

function UploadCard({ title, desc, icon: Icon, accent, bg, hint }) {
  return (
    <div className="flex-1 bg-white border border-[#e8e8e5] rounded-[16px] p-[22px] flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0"
          style={{ background: accent }}
        >
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-[16px] text-[#2e2e2e] leading-tight">{title}</p>
          <p className="font-normal text-[12px] text-[#606060] leading-tight">{desc}</p>
        </div>
      </div>
      <button
        className="flex flex-col items-center justify-center gap-2 py-[26px] rounded-[12px] border-[1.5px] border-dashed transition-colors hover:opacity-80"
        style={{ background: bg, borderColor: accent }}
      >
        <UploadCloud size={26} style={{ color: accent }} />
        <span className="font-semibold text-[13px] text-[#2e2e2e]">Arraste arquivos ou clique para enviar</span>
        <span className="font-normal text-[11px] text-[#999]">{hint}</span>
      </button>
    </div>
  );
}

function GestaoConteudo({ onBack, onHome }) {
  return (
    <div className="flex flex-col gap-[18px] px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />

      <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">Gestão de Conteúdo</h1>
      <p className="font-light text-[14px] text-[#606060] -mt-3">Faça upload de materiais para cada central da plataforma</p>

      <div className="grid grid-cols-2 gap-[18px]">
        {CENTRAIS_UPLOAD.map(central => (
          <UploadCard key={central.id} {...central} />
        ))}
      </div>
    </div>
  );
}

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

// ── Ofertas (CI) ─────────────────────────────────────────────────────────────

const OFERTAS_STATUS_SINGULAR = { Ativas: 'Ativa', Pendentes: 'Pendente', Expiradas: 'Expirada', Futuras: 'Futura' };

function OfertasCI({ onNovaOferta, onBack, onHome }) {
  const [ofertas, setOfertas] = useState(OFERTAS_INICIAIS);
  const [filtro, setFiltro] = useState('Todas');

  const filtered = filtro === 'Todas'
    ? ofertas
    : ofertas.filter(o => o.status === OFERTAS_STATUS_SINGULAR[filtro]);

  const toggleVisivel = (id) => setOfertas(prev => prev.map(o => o.id === id ? { ...o, visivel: !o.visivel } : o));
  const aprovar = (id) => setOfertas(prev => prev.map(o => o.id === id ? { ...o, status: 'Ativa' } : o));

  return (
    <div className="flex flex-col gap-[18px] px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">Controle de Ofertas</h1>
          <p className="font-light text-[14px] text-[#606060] mt-1">Gerencie a visibilidade e vigência das ofertas enviadas pelos setores</p>
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
        {OFERTAS_STATS.map(({ label, value, note, bg, color }) => (
          <div
            key={label}
            className="flex-1 flex flex-col gap-1 rounded-[12px] border border-[#e8e8e5] px-[16px] py-3"
            style={{ background: bg }}
          >
            <span className="font-normal text-[12px] text-[#606060]">{label}</span>
            <span className="font-bold text-[28px] tracking-[-0.5px]" style={{ color }}>{value}</span>
            <span className="font-normal text-[10.5px] text-[#606060]">{note}</span>
          </div>
        ))}
      </div>

      {/* Filtros + busca */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {OFERTAS_FILTROS.map(f => (
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
            placeholder="Buscar produto..."
            className="h-9 w-[260px] bg-white border border-[#e8e8e5] rounded-[10px] pl-8 pr-3 text-[12px] text-[#2e2e2e] placeholder-[#888]"
          />
        </div>
      </div>

      {/* Cabeçalho da tabela */}
      <div className="bg-[#ededeb] rounded-[8px] px-4 py-[10px] flex items-center">
        <div className="w-[260px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Produto</span></div>
        <div className="w-[130px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Setor</span></div>
        <div className="w-[120px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Preço</span></div>
        <div className="w-[120px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Vigência</span></div>
        <div className="w-[100px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Status</span></div>
        <div className="w-[110px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Visibilidade</span></div>
        <div className="flex-1"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Lojas alcançadas</span></div>
        <div className="w-[90px] shrink-0" />
      </div>

      {/* Linhas */}
      <div className="flex flex-col gap-2">
        {filtered.map(oferta => {
          const badge = OFERTAS_STATUS_BADGE[oferta.status];
          return (
            <div key={oferta.id} className="bg-white border border-[#e8e8e5] rounded-[10px] px-4 py-3 flex items-center">
              <div className="w-[260px] shrink-0">
                <span className="font-semibold text-[12px] text-[#2e2e2e]">{oferta.produto}</span>
              </div>
              <div className="w-[130px] shrink-0">
                <span className="bg-[#ededeb] text-[#606060] font-normal text-[10px] px-[7px] py-[2px] rounded-[6px]">{oferta.setor}</span>
              </div>
              <div className="w-[120px] shrink-0">
                <span className="font-semibold text-[12px] text-[#2e2e2e]">{oferta.preco}</span>
              </div>
              <div className="w-[120px] shrink-0">
                <span className="font-normal text-[11px] text-[#606060]">{oferta.vigencia}</span>
              </div>
              <div className="w-[100px] shrink-0">
                <span className="font-semibold text-[10px] px-2 py-[3px] rounded-[6px]" style={{ background: badge.bg, color: badge.color }}>
                  {oferta.status}
                </span>
              </div>
              <div className="w-[110px] shrink-0 flex items-center gap-2">
                <Toggle checked={oferta.visivel} onChange={() => toggleVisivel(oferta.id)} />
                <span className={`font-normal text-[10px] ${oferta.visivel ? 'text-[#3d7a2e]' : 'text-[#606060]'}`}>
                  {oferta.visivel ? 'Visível' : 'Oculta'}
                </span>
              </div>
              <div className="flex-1">
                {oferta.lojas ? (
                  <span className="bg-[#e8f0e4] text-[#3d7a2e] font-semibold text-[10px] px-[7px] py-[3px] rounded-[6px]">{oferta.lojas}</span>
                ) : (
                  <span className="text-[#888] text-[11px]">—</span>
                )}
              </div>
              <div className="w-[90px] shrink-0 flex justify-end">
                {oferta.status === 'Pendente' && (
                  <button
                    onClick={() => aprovar(oferta.id)}
                    className="flex items-center gap-1 bg-[#e8f0e4] border border-[#5ca847] text-[#3d7a2e] font-semibold text-[10px] px-2 py-[4px] rounded-[7px] hover:bg-[#d9ead4] transition-colors"
                  >
                    <Check size={10} /> Aprovar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#e4eef4] border border-[#3878a8] rounded-[10px] px-4 py-3">
        <p className="font-normal text-[12px] text-[#23456b]">
          ℹ A visibilidade controla se a oferta aparece no Estúdio das Lojas. Ofertas inativas não são exibidas mesmo dentro do período de vigência.
        </p>
      </div>
    </div>
  );
}

// ── Cadastrar oferta ─────────────────────────────────────────────────────────

function CadastrarOferta({ onBack, onHome }) {
  const [form, setForm] = useState({
    nome: '', codigo: '', precoDestaque: '', precoDe: '', condicao: '',
    inicio: '', fim: '', categoria: '', observacoes: '',
  });

  const setField = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />

      <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">Cadastrar oferta</h1>
      <p className="font-light text-[14px] text-[#606060] -mt-4">Preencha os dados do produto para divulgação nas lojas</p>

      <div className="bg-[#ede0f2] border border-[#8b5c9e] rounded-[10px] px-4 py-3 flex items-center gap-3">
        <span className="font-bold text-[14px] text-[#8b5c9e]">i</span>
        <span className="font-normal text-[13px] text-[#606060]">Todos campos devem ser preenchidos para o envio da oferta</span>
      </div>

      <div className="bg-[#e8f0e4] border border-[#5ca847] rounded-[14px] px-5 py-4 flex items-center gap-[14px]">
        <div className="w-11 h-11 bg-[#5ca847] rounded-[10px] flex items-center justify-center shrink-0">
          <UploadCloud size={20} className="text-white" />
        </div>
        <div className="flex flex-col gap-[2px] flex-1">
          <span className="font-semibold text-[14px] text-[#2e2e2e]">Importar ofertas da CI via planilha Excel</span>
          <span className="font-normal text-[12px] text-[#606060]">Baixe o modelo, preencha e faça o upload. Todas as ofertas serão cadastradas automaticamente.</span>
        </div>
        <button className="flex items-center gap-1.5 bg-white border border-[#5ca847] text-[#3d7a2e] font-semibold text-[12px] px-[14px] py-2 rounded-[9px] hover:bg-[#f7f6f2] transition-colors">
          <Download size={13} /> Baixar modelo
        </button>
        <button className="bg-[#5ca847] text-white font-semibold text-[12px] px-[14px] py-2 rounded-[9px] hover:bg-[#4a9438] transition-colors">
          ↑ Subir planilha
        </button>
      </div>

      <div className="flex items-center gap-[10px]">
        <div className="flex-1 h-[0.5px] bg-[#e8e8e5]" />
        <span className="font-normal text-[11px] text-[#606060] whitespace-nowrap">ou preencha manualmente</span>
        <div className="flex-1 h-[0.5px] bg-[#e8e8e5]" />
      </div>

      <div className="bg-white border border-[#e8e8e5] rounded-[16px] px-7 py-6 flex flex-col gap-5">
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Nome do produto <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input
              value={form.nome}
              onChange={setField('nome')}
              placeholder={'ex: Smart TV 55" 4K LG'}
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]"
            />
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Código <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input
              value={form.codigo}
              onChange={setField('codigo')}
              placeholder="ex: 84530206"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Preço em destaque <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input
              value={form.precoDestaque}
              onChange={setField('precoDestaque')}
              placeholder="ex: R$ 2.499,00"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]"
            />
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e]">Preço de (opcional)</label>
            <input
              value={form.precoDe}
              onChange={setField('precoDe')}
              placeholder="ex: R$ 2.999,00"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]"
            />
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e]">Condição de pagamento</label>
            <input
              value={form.condicao}
              onChange={setField('condicao')}
              placeholder="ex: 12x no cartão Lebes"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Início da vigência <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input
              value={form.inicio}
              onChange={setField('inicio')}
              placeholder="ex: 01/07/2025"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]"
            />
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Fim da vigência <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input
              value={form.fim}
              onChange={setField('fim')}
              placeholder="ex: 07/07/2025"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]"
            />
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e]">Categoria / setor</label>
            <select
              value={form.categoria}
              onChange={setField('categoria')}
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#606060]"
            >
              <option value="">Telefonia</option>
              <option value="tecnologia">Tecnologia</option>
              <option value="moveis">Móveis</option>
              <option value="linha-branca">Linha Branca</option>
              <option value="moda">Moda</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
            Observações <span className="font-normal text-[11px] text-[#606060]">(opcional)</span>
          </label>
          <input
            value={form.observacoes}
            onChange={setField('observacoes')}
            placeholder="ex: Somente enquanto durar o estoque"
            className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onBack}
            className="bg-white border border-[#e8e8e5] text-[#606060] font-medium text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#f7f6f2] transition-colors"
          >
            Salvar rascunho
          </button>
          <button
            onClick={onBack}
            className="bg-[#8b5c9e] text-white font-semibold text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#7a4e8a] transition-colors"
          >
            Enviar para aprovação →
          </button>
        </div>
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

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
        checked ? 'bg-[#5ca847]' : 'bg-[#e8e8e5]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

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

// ── Placeholder para views não implementadas ─────────────────────────────────

function Placeholder({ title, onBack, onHome }) {
  return (
    <div className="flex flex-col gap-5 px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />
      <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">{title}</h1>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#f7f6f2] rounded-[16px] mx-auto mb-4" />
          <p className="font-semibold text-[15px] text-[#2e2e2e] mb-1">Em desenvolvimento</p>
          <p className="font-normal text-[13px] text-[#606060]">Esta seção estará disponível em breve.</p>
        </div>
      </div>
    </div>
  );
}

// ── View principal ───────────────────────────────────────────────────────────

export default function AdminLebes({ onBack, onHome }) {
  const [adminView, setAdminView] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);
  const [prevView, setPrevView] = useState(null);

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
  const handleNovaOferta = () => navigate('nova-oferta');

  return (
    <div
      className="w-full h-screen flex overflow-hidden bg-[#f7f6f2]"
      style={{ fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      <AdminSidebar activeView={adminView} onNavigate={navigate} />

      <main className="flex-1 min-w-0 overflow-hidden">
        {adminView === 'dashboard' && <AdminDashboard onBack={goBack} onHome={onHome} />}
        {adminView === 'conteudo' && (
          <GestaoConteudo onBack={goBack} onHome={onHome} />
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
        {adminView === 'ofertas' && (
          <OfertasCI onNovaOferta={handleNovaOferta} onBack={goBack} onHome={onHome} />
        )}
        {adminView === 'nova-oferta' && (
          <CadastrarOferta onBack={goBack} onHome={onHome} />
        )}
        {['templates', 'campanhas-admin'].includes(adminView) && (
          <Placeholder
            title={adminView === 'templates' ? 'Templates' : 'Campanhas'}
            onBack={goBack}
            onHome={onHome}
          />
        )}
      </main>
    </div>
  );
}
