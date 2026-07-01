import { useState } from 'react';
import { Play, MessageSquare, Mail, ArrowRight, ArrowDown, Smartphone, Volume2, Tag } from 'lucide-react';
import HubHeader from '../components/hub/HubHeader';

const SECTION_CARDS = [
  {
    id: 'tutoriais',
    title: 'Tutoriais',
    desc: 'Vídeos, dicas e guias por setor: redes sociais, comunicação e campanhas.',
    Icon: Play,
  },
  {
    id: 'faq',
    title: 'FAQ',
    desc: 'Não achou o que procurava? Mande sua dúvida pro time de marketing.',
    Icon: MessageSquare,
  },
  {
    id: 'contatos',
    title: 'Contatos',
    desc: 'Emails e telefones dos setores e pessoas importantes do time.',
    Icon: Mail,
  },
];

const SECTORES = [
  { id: 'redes', title: 'Redes Sociais', desc: 'Posts, stories e formatos para Instagram', count: 8, Icon: Smartphone },
  { id: 'com', title: 'Comunicação', desc: 'Comunicados, e-mails e materiais internos', count: 5, Icon: Volume2 },
  { id: 'camp', title: 'Campanhas', desc: 'Encartes, revistas e peças de campanha', count: 12, Icon: Tag },
];

const CONTATOS = [
  { initials: 'M—', color: '#5ca847', name: 'Marketing — Geral', role: 'Dúvidas gerais e solicitações', email: 'setor.marketing@lebes.com.br', phone: '(51) 3000-1000' },
  { initials: 'C&', color: '#e0913a', name: 'Criação & Design', role: 'Cards, revistas e materiais visuais', email: 'criacao@lebes.com.br', phone: '(51) 3000-1010' },
  { initials: 'C', color: '#3878a8', name: 'PDV', role: 'Cartazes, etiquetas e materiais de loja', email: 'pdv@lebes.com.br', phone: '(51) 3000-1020' },
  { initials: 'RS', color: '#8b5c9e', name: 'Redes Sociais', role: 'Instagram, conteúdo e calendário', email: 'social@lebes.com.br', phone: '(51) 3000-1030' },
];

function SectionCards({ active, onSelect }) {
  return (
    <div className="flex gap-5 w-full">
      {SECTION_CARDS.map(({ id, title, desc, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex-1 flex flex-col items-start pt-8 pb-7 px-7 rounded-[20px] text-left transition-all ${
              isActive
                ? 'bg-[#fce8e8] border border-[#c0392b]'
                : 'bg-[#e8f0e4] border border-transparent hover:brightness-95'
            }`}
          >
            <div className="w-16 h-16 rounded-[17px] bg-[#c0392b] flex items-center justify-center shrink-0">
              <Icon size={22} color="#fff" fill={id === 'tutoriais' ? '#fff' : undefined} />
            </div>
            <div className="h-5" />
            <p className="font-bold text-[21px] text-[#606060] tracking-[-0.42px]">{title}</p>
            <div className="h-2" />
            <p className="font-normal text-[13px] text-[#606060] leading-[19px]">{desc}</p>
            <div className="h-[22px]" />
            <div className="flex items-center gap-[7px]">
              <span className="font-semibold text-[13px] text-[#c0392b]">Acessar</span>
              {isActive
                ? <ArrowDown size={13} color="#c0392b" />
                : <ArrowRight size={13} color="#c0392b" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TutoriaisContent() {
  return (
    <div className="flex gap-4 w-full mt-6">
      {SECTORES.map(({ id, title, desc, count, Icon }) => (
        <button
          key={id}
          className="flex-1 bg-[#e8f0e4] rounded-[18px] px-5 py-[26px] text-left hover:brightness-95 transition-all"
        >
          <div className="w-[52px] h-[52px] bg-[#c0392b] rounded-[14px] flex items-center justify-center">
            <Icon size={20} color="#fff" />
          </div>
          <div className="h-4" />
          <p className="font-semibold text-[17px] text-[#606060]">{title}</p>
          <div className="h-1" />
          <p className="font-normal text-[12.5px] text-[#606060]">{desc}</p>
          <div className="h-3.5" />
          <p className="font-semibold text-[11.5px] text-[#c0392b]">{count} tutoriais →</p>
        </button>
      ))}
    </div>
  );
}

function FAQContent() {
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState(false);

  if (enviado) {
    return (
      <div className="mt-6 w-[560px] mx-auto bg-white rounded-[18px] border border-[#e8e8e5] overflow-hidden">
        <div className="bg-[#c0392b] px-[22px] py-[18px] flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-[11px] flex items-center justify-center shrink-0">
            <MessageSquare size={18} color="#fff" />
          </div>
          <p className="font-bold text-[17px] text-white">Mensagem enviada!</p>
        </div>
        <div className="p-[22px] text-center">
          <p className="text-[14px] text-[#606060] mb-5">O time de marketing receberá sua mensagem em breve.</p>
          <button
            onClick={() => { setEnviado(false); setAssunto(''); setMensagem(''); }}
            className="bg-[#f7f6f2] border border-[#e8e8e5] text-[#606060] font-medium text-[13px] px-5 py-2.5 rounded-[10px]"
          >
            Enviar outra mensagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 w-[560px] mx-auto bg-white rounded-[18px] border border-[#e8e8e5] overflow-hidden">
      <div className="bg-[#c0392b] px-[22px] py-[18px] flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-[11px] flex items-center justify-center shrink-0">
          <MessageSquare size={18} color="#fff" />
        </div>
        <div>
          <p className="font-bold text-[17px] text-white">Não achou o que procurava?</p>
          <p className="font-light text-[12.5px] text-white/85">Mande sua dúvida direto pro time de marketing.</p>
        </div>
      </div>
      <div className="p-[22px] flex flex-col gap-4">
        <div>
          <p className="font-semibold text-[12.5px] text-[#2e2e2e] mb-[7px]">Assunto</p>
          <select
            value={assunto}
            onChange={e => setAssunto(e.target.value)}
            className="w-full h-[44px] border border-[#e8e8e5] rounded-[11px] px-[14px] text-[13px] text-[#606060] bg-white"
          >
            <option value="">Selecione: dúvida, novo material, ajuste...</option>
            <option value="duvida">Dúvida</option>
            <option value="material">Novo material</option>
            <option value="ajuste">Ajuste</option>
            <option value="outro">Outro</option>
          </select>
        </div>
        <div>
          <p className="font-semibold text-[12.5px] text-[#2e2e2e] mb-[7px]">Mensagem</p>
          <textarea
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            placeholder="Escreva sua mensagem para o time de marketing..."
            rows={4}
            className="w-full border border-[#e8e8e5] rounded-[11px] px-[14px] py-[12px] text-[13px] text-[#2e2e2e] placeholder-[#999] bg-white resize-none"
          />
        </div>
        <button
          onClick={() => { if (assunto && mensagem) setEnviado(true); }}
          className="w-full bg-[#5ca847] rounded-[12px] py-[14px] flex items-center justify-center gap-2 text-white font-semibold text-[14px] hover:bg-[#4a9438] transition-colors"
        >
          <Mail size={16} color="#fff" />
          Enviar mensagem
        </button>
      </div>
    </div>
  );
}

function ContatosContent() {
  return (
    <div className="mt-6 flex flex-col gap-3 w-[760px] mx-auto">
      {CONTATOS.map(c => (
        <div
          key={c.name}
          className="bg-white border border-[#e8e8e5] rounded-[14px] px-5 py-4 flex items-center gap-4"
        >
          <div
            className="w-[46px] h-[46px] rounded-full flex items-center justify-center shrink-0"
            style={{ background: c.color }}
          >
            <span className="font-bold text-[15px] text-white">{c.initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[15px] text-[#2e2e2e]">{c.name}</p>
            <p className="font-normal text-[12px] text-[#606060]">{c.role}</p>
          </div>
          <div className="text-right shrink-0">
            <a href={`mailto:${c.email}`} className="font-medium text-[12.5px] text-[#5ca847] block hover:underline">
              {c.email}
            </a>
            <p className="font-normal text-[12px] text-[#999]">{c.phone}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CentralApoio({ onMenu, onBack, onHome, isDark, onToggleTheme }) {
  const [section, setSection] = useState(null);

  const handleBack = section ? () => setSection(null) : onBack;

  return (
    <div
      className="w-full h-screen flex flex-col overflow-hidden bg-[#f7f6f2]"
      style={{ fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      <HubHeader
        variant="inner"
        title="Central de Apoio"
        onMenu={onMenu}
        onBack={handleBack}
        onHome={onHome}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      <main
        className={`flex-1 overflow-y-auto px-10 ${!section ? 'flex items-center justify-center py-10' : 'py-8'}`}
      >
        <div className={`w-full max-w-[1040px] mx-auto`}>
          <div className={`${!section ? 'text-center' : ''} mb-10`}>
            <h1 className="font-bold text-[34px] text-[#2e2e2e] tracking-[-0.68px] mb-2">
              Central de Apoio
            </h1>
            <p className="font-light text-[15px] text-[#606060]">
              Como podemos te ajudar? Escolha uma opção abaixo
            </p>
          </div>

          <SectionCards active={section} onSelect={setSection} />

          {section === 'tutoriais' && <TutoriaisContent />}
          {section === 'faq' && <FAQContent />}
          {section === 'contatos' && <ContatosContent />}
        </div>
      </main>
    </div>
  );
}
