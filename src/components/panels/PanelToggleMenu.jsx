import { useEffect, useRef } from 'react';
import { Eye, EyeOff, PanelLeft, PanelRight, PanelTop, PanelsTopLeft } from 'lucide-react';

const ITEMS = [
  { key: 'left',  label: 'Catálogo & uploads', sub: 'menu da esquerda', Icon: PanelLeft },
  { key: 'top',   label: 'Ferramentas',        sub: 'inserir · layout · fundo', Icon: PanelTop },
  { key: 'right', label: 'Edição & camadas',   sub: 'menu da direita', Icon: PanelRight },
];

export default function PanelToggleMenu({ open, setOpen, panels, setPanels }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    window.addEventListener('pointerdown', h);
    return () => window.removeEventListener('pointerdown', h);
  }, [open, setOpen]);

  const toggle = (key) => setPanels(p => ({ ...p, [key]: !p[key] }));
  const allHidden = !panels.left && !panels.top && !panels.right;
  const setAll = (v) => setPanels({ left: v, top: v, right: v });

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        title="Ocultar / mostrar menus"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition border
          ${open ? 'border-emerald-600/60 text-emerald-300 bg-stone-800/60'
                 : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'}`}>
        <PanelsTopLeft size={14} /> Menus
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-[200] w-64 bg-stone-900 border border-stone-700 rounded-lg shadow-2xl p-2">
          <div className="flex items-center justify-between px-1.5 pb-2 mb-1 border-b border-stone-800">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Visibilidade dos menus</span>
          </div>

          <div className="space-y-1">
            {ITEMS.map(({ key, label, sub, Icon }) => {
              const visible = panels[key];
              return (
                <button key={key} onClick={() => toggle(key)}
                  className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-stone-800/70 transition text-left">
                  <Icon size={16} className={visible ? 'text-emerald-400' : 'text-stone-600'} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium ${visible ? 'text-stone-100' : 'text-stone-500'}`}>{label}</div>
                    <div className="text-[10px] text-stone-500">{sub}</div>
                  </div>
                  {visible ? <Eye size={14} className="text-stone-400" /> : <EyeOff size={14} className="text-stone-600" />}
                </button>
              );
            })}
          </div>

          <div className="flex gap-1.5 mt-2 pt-2 border-t border-stone-800">
            <button onClick={() => setAll(false)}
              className="flex-1 text-[10px] font-semibold py-1.5 rounded bg-stone-800 text-stone-300 hover:bg-stone-700 transition">
              Ocultar tudo
            </button>
            <button onClick={() => setAll(true)} disabled={panels.left && panels.top && panels.right}
              className="flex-1 text-[10px] font-semibold py-1.5 rounded bg-emerald-700 text-white hover:bg-emerald-600 disabled:opacity-30 transition">
              Mostrar tudo
            </button>
          </div>
          {allHidden && (
            <p className="text-[10px] text-amber-400/80 mt-2 px-1 leading-snug">
              Todos os menus ocultos — só o canvas fica visível. Reabra por aqui quando quiser.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
