import { BarChart3, User, FileText, LayoutGrid, Megaphone } from 'lucide-react';
import { SidebarItem } from './shared';
import { REPOSITORIOS } from './RepositorioArquivos';

function GroupLabel({ children }) {
  return (
    <div className="px-[8px] pt-[10px] pb-[8px]">
      <span className="font-semibold text-[10px] text-[#888] tracking-[0.5px] uppercase">{children}</span>
    </div>
  );
}

export default function AdminSidebar({ activeView, onNavigate }) {
  const isUsuariosSection = ['usuarios', 'convidar', 'perfil'].includes(activeView);
  const isControleCISection = ['controle-ci', 'ci-ofertas', 'cadastrar-ci', 'nova-oferta'].includes(activeView);

  return (
    <aside className="w-[220px] h-full bg-white border-r border-[#e8e8e5] flex flex-col px-[14px] py-5 shrink-0 overflow-y-auto">
      <div className="flex items-center gap-2 pl-[6px] pb-[18px]">
        <div className="w-7 h-7 bg-[#5ca847] rounded-[8px]" />
        <span className="font-bold text-[13px] text-[#2e2e2e]">Admin Lebes</span>
      </div>

      <div className="flex flex-col gap-0.5">
        <GroupLabel>Geral</GroupLabel>
        <SidebarItem label="Dashboard" icon={BarChart3} active={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />

        <GroupLabel>Usuários</GroupLabel>
        <SidebarItem label="Gestão de Usuários" icon={User} active={isUsuariosSection} onClick={() => onNavigate('usuarios')} />
        <SidebarItem label="Perfis e Permissões" active={activeView === 'perfis'} onClick={() => onNavigate('perfis')} />

        <GroupLabel>Cadastros</GroupLabel>
        <SidebarItem label="Ofertas (CI)" icon={FileText} active={isControleCISection} onClick={() => onNavigate('controle-ci')} />
        <SidebarItem label="Upload de Arquivos" icon={LayoutGrid} active={activeView === 'templates'} onClick={() => onNavigate('templates')} />
        <SidebarItem label="Campanhas" icon={Megaphone} active={activeView === 'campanhas-admin'} onClick={() => onNavigate('campanhas-admin')} />

        <GroupLabel>Repositórios</GroupLabel>
        <SidebarItem label="Repositório — Apoio" icon={FileText} iconColor={REPOSITORIOS.apoio.accent} active={activeView === 'repo-apoio'} onClick={() => onNavigate('repo-apoio')} />
        <SidebarItem label="Repositório — Campanhas" icon={FileText} iconColor={REPOSITORIOS.campanhas.accent} active={activeView === 'repo-campanhas'} onClick={() => onNavigate('repo-campanhas')} />
        <SidebarItem label="Repositório — Marcas" icon={FileText} iconColor={REPOSITORIOS.marcas.accent} active={activeView === 'repo-marcas'} onClick={() => onNavigate('repo-marcas')} />
        <SidebarItem label="Repositório — Estúdio" icon={FileText} iconColor={REPOSITORIOS.estudio.accent} active={activeView === 'repo-estudio'} onClick={() => onNavigate('repo-estudio')} />
      </div>
    </aside>
  );
}
