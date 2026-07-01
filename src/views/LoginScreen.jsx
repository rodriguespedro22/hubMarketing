import { ArrowRight, Users, ShieldCheck } from 'lucide-react';

const ROLES = [
  {
    id: 'hub',
    label: 'Colaborador',
    desc: 'Acesso ao Hub de Marketing, Estúdio Criativo, Campanhas, Marcas e Central de Apoio.',
    Icon: Users,
    iconBg: '#5ca847',
    cardBg: '#e8f0e4',
    borderColor: '#5ca847',
    textColor: '#3d7a2e',
    btnBg: '#5ca847',
    btnHover: '#4a9438',
  },
  {
    id: 'admin',
    label: 'Administrador',
    desc: 'Acesso ao painel de gestão de usuários, permissões e cadastros da plataforma.',
    Icon: ShieldCheck,
    iconBg: '#c0392b',
    cardBg: '#fce8e8',
    borderColor: '#c0392b',
    textColor: '#9b2318',
    btnBg: '#c0392b',
    btnHover: '#a93228',
  },
];

export default function LoginScreen({ onLogin }) {
  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-[#f7f6f2]"
      style={{ fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-[600px] px-4">

        {/* Logo + brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-[#5ca847] rounded-[14px] flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-[20px]">L</span>
          </div>
          <div className="text-center">
            <p className="font-semibold text-[11px] tracking-widest text-[#5ca847] uppercase mb-1">
              Grupo Lebes · Marketing
            </p>
            <h1 className="font-bold text-[28px] text-[#2e2e2e] tracking-[-0.56px]">
              Hub de Marketing
            </h1>
            <p className="font-light text-[14px] text-[#606060] mt-1">
              Selecione como você vai entrar
            </p>
          </div>
        </div>

        {/* Opções */}
        <div className="flex gap-4 w-full">
          {ROLES.map(({ id, label, desc, Icon, iconBg, cardBg, borderColor, textColor, btnBg, btnHover }) => (
            <button
              key={id}
              onClick={() => onLogin(id)}
              className="flex-1 flex flex-col items-start p-6 rounded-[20px] text-left border transition-all hover:shadow-md active:scale-[0.98]"
              style={{ background: cardBg, borderColor }}
            >
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
                style={{ background: iconBg }}
              >
                <Icon size={22} color="#fff" />
              </div>

              <p
                className="font-bold text-[19px] mt-4 mb-1"
                style={{ color: textColor }}
              >
                {label}
              </p>
              <p className="font-normal text-[12.5px] text-[#606060] leading-snug flex-1">
                {desc}
              </p>

              <div
                className="mt-5 flex items-center gap-2 font-semibold text-[13px] self-end"
                style={{ color: textColor }}
              >
                Entrar <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>

        <p className="font-normal text-[11.5px] text-[#aaa]">
          Apenas para teste de interface — sem autenticação real.
        </p>
      </div>
    </div>
  );
}
