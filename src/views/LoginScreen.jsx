import { useState } from 'react';
import { Phone } from 'lucide-react';

const SUPPORT_PHONE = '(51) 3499-7075';

export default function LoginScreen({ onLogin }) {
  const [step, setStep] = useState('login'); // 'login' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div
      className="w-full h-screen relative bg-[#f7f6f2] overflow-auto"
      style={{ fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      <div className="absolute top-0 left-0 w-full h-[320px] bg-[#ededeb]" />

      <div className="relative flex items-center justify-center min-h-screen px-4 py-10">
        <div className="w-full max-w-[460px] bg-white border border-[#e8e8e5] rounded-[20px] overflow-hidden">
          <div className="flex flex-col gap-2 px-10 pt-10 pb-8">
            <div className="flex items-center gap-2 pb-2">
              <div className="w-8 h-8 rounded-[10px] bg-[#5ca847] flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-[13px]">L</span>
              </div>
              <p className="font-bold text-[14px] text-[#2e2e2e]">HUB de Marketing</p>
            </div>
            <p className="font-bold text-[22px] text-[#2e2e2e] tracking-[-0.4px]">
              {step === 'login' ? 'Bem-vindo de volta' : 'Esqueci minha senha'}
            </p>
            <p className="font-normal text-[13px] text-[#606060]">
              {step === 'login'
                ? 'Entre com suas credenciais de acesso'
                : 'Fale com o suporte de TI para redefinir sua senha'}
            </p>
          </div>

          <div className="h-px bg-[#e8e8e5]" />

          {step === 'login' ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-10 pt-7 pb-8">
              <label className="flex flex-col gap-1.5 w-full">
                <span className="flex items-center gap-1 text-[12px]">
                  <span className="font-semibold text-[#2e2e2e]">E-mail</span>
                  <span className="font-bold text-[#c0392b]">*</span>
                </span>
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@lebes.com.br"
                  className="h-11 px-3.5 rounded-[10px] border border-[#e8e8e5] bg-[#f7f6f2] text-[13px] text-[#2e2e2e] placeholder:text-[#888] outline-none focus:border-[#5ca847]"
                />
              </label>

              <label className="flex flex-col gap-1.5 w-full">
                <span className="flex items-center gap-1 text-[12px]">
                  <span className="font-semibold text-[#2e2e2e]">Senha</span>
                  <span className="font-bold text-[#c0392b]">*</span>
                </span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="h-11 px-3.5 rounded-[10px] border border-[#e8e8e5] bg-[#f7f6f2] text-[13px] text-[#2e2e2e] placeholder:text-[#888] outline-none focus:border-[#5ca847]"
                />
              </label>

              <button
                type="button"
                onClick={() => setStep('forgot')}
                className="self-end font-medium text-[12px] text-[#5ca847] hover:underline"
              >
                Esqueci minha senha
              </button>

              <button
                type="submit"
                className="h-12 rounded-[12px] bg-[#5ca847] hover:bg-[#4a9438] transition-colors font-semibold text-[14px] text-white"
              >
                Entrar
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-4 px-10 pt-7 pb-8">
              <p className="font-light text-[13px] text-[#606060] leading-snug">
                A redefinição de senha é feita pelo suporte de TI. Entre em contato
                informando seu usuário de rede para receber ajuda.
              </p>

              <div className="flex items-center gap-3 rounded-[10px] border border-[#e8e8e5] bg-[#f7f6f2] px-4 py-3.5">
                <div className="w-9 h-9 rounded-[10px] bg-[#5ca847] flex items-center justify-center shrink-0">
                  <Phone size={16} color="#fff" />
                </div>
                <div>
                  <p className="font-semibold text-[13px] text-[#2e2e2e]">{SUPPORT_PHONE}</p>
                  <p className="font-normal text-[11.5px] text-[#888]">Suporte de TI · Grupo Lebes</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('login')}
                className="self-center font-medium text-[12px] text-[#606060] hover:text-[#2e2e2e]"
              >
                ← Voltar para o login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
