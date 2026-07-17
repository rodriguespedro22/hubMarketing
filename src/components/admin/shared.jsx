import { Home } from 'lucide-react';

export function SidebarItem({ label, icon: Icon, iconColor, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-[9px] px-[10px] py-[9px] rounded-[9px] text-left transition-colors ${
        active ? 'bg-[#e8f0e4]' : 'hover:bg-[#f7f6f2]'
      }`}
    >
      {Icon ? (
        <Icon size={15} strokeWidth={2} className="shrink-0" style={{ color: iconColor || (active ? '#3d7a2e' : '#888') }} />
      ) : (
        <div
          className="w-[6px] h-[6px] rounded-full shrink-0"
          style={{ background: active ? '#3d7a2e' : '#ccc' }}
        />
      )}
      <span
        className={`text-[13px] ${active ? 'font-semibold text-[#3d7a2e]' : 'font-medium text-[#606060]'}`}
      >
        {label}
      </span>
    </button>
  );
}

export function AdminNav({ onBack, onHome }) {
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

export function Toggle({ checked, onChange }) {
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

export function Stepper({ steps, step }) {
  const activeIndex = steps.findIndex(s => s.id === step);
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
              style={i <= activeIndex ? { background: '#5ca847', color: '#fff' } : { background: '#ededeb', color: '#888' }}
            >
              {i < activeIndex ? '✓' : i + 1}
            </span>
            <span className={`text-[12.5px] ${i === activeIndex ? 'font-semibold text-[#2e2e2e]' : 'font-medium text-[#888]'}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && <div className="w-8 h-[1.5px] bg-[#e8e8e5]" />}
        </div>
      ))}
    </div>
  );
}

export function ConfirmacaoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8e8e5] last:border-b-0">
      <span className="font-normal text-[12.5px] text-[#606060]">{label}</span>
      <span className="font-semibold text-[13px] text-[#2e2e2e]">{value}</span>
    </div>
  );
}

export function Placeholder({ title, onBack, onHome }) {
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
