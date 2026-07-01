export default function Error404({ code = 404, onHome }) {
  const is404 = code === 404;
  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-[#f7f6f2]"
      style={{ fontFamily: 'Gantari, system-ui, sans-serif' }}
    >
      <div className="bg-white border border-[#e8e8e5] rounded-[20px] p-12 flex flex-col items-center gap-[14px] w-[480px] shadow-sm">
        <div className="w-[72px] h-[72px] bg-[#f7f6f2] rounded-[36px] flex items-center justify-center">
          <span className="font-bold text-[22px] text-[#606060]">{code}</span>
        </div>
        <p className="font-bold text-[20px] text-[#2e2e2e]">
          {is404 ? 'Página não encontrada' : 'Sem permissão'}
        </p>
        <p className="font-normal text-[14px] text-[#606060] text-center leading-snug w-[384px]">
          {is404
            ? 'Este endereço não existe ou foi movido.'
            : 'Você não tem acesso a esta página. Solicite ao time de Marketing.'}
        </p>
        <button
          onClick={onHome}
          className="bg-[#5ca847] text-white font-semibold text-[13px] px-5 py-3 rounded-[10px] hover:bg-[#4a9438] transition-colors"
        >
          {is404 ? 'Voltar ao início' : 'Solicitar acesso'}
        </button>
      </div>
    </div>
  );
}
