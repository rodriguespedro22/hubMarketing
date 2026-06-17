import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Droplet, Image as ImageIcon, Palette, Upload, X } from 'lucide-react';

import { BG_PRESETS, gradientCss, normalizeBackground } from '../../constants/background';
import { readImageScaled } from '../../utils/helpers';

const TABS = [
  { id: 'color', label: 'Cor', icon: Droplet },
  { id: 'gradient', label: 'Gradiente', icon: Palette },
  { id: 'image', label: 'Imagem', icon: ImageIcon },
];

function OpacityRow({ opacity, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] uppercase tracking-wider text-stone-500">Opacidade</span>
        <span className="text-[10px] font-mono text-stone-300">{Math.round(opacity * 100)}%</span>
      </div>
      <input type="range" min={0} max={1} step={0.01} value={opacity}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-emerald-500" />
    </div>
  );
}

export default function BackgroundPopover({ background, onChange, onClose, uploads = [], onUploadFiles, anchorRef }) {
  const b = normalizeBackground(background);
  const [tab, setTab] = useState(b.type === 'image' ? 'image' : b.type === 'gradient' ? 'gradient' : 'color');
  const ref = useRef(null);
  const fileRef = useRef(null);
  const calcPos = () => {
    if (!anchorRef?.current) return { top: 8, right: 16 };
    const r = anchorRef.current.getBoundingClientRect();
    const rightVal = Math.max(8, window.innerWidth - r.right);
    // Se o botão está na metade inferior da tela, abre para cima
    if (r.top > window.innerHeight / 2) {
      return { bottom: window.innerHeight - r.top + 8, right: rightVal };
    }
    return { top: r.bottom + 8, right: rightVal };
  };
  const [pos, setPos] = useState(calcPos);

  useEffect(() => {
    setPos(calcPos());
    const onDown = (e) => {
      if (ref.current?.contains(e.target) || anchorRef?.current?.contains(e.target)) return;
      onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('pointerdown', onDown); window.removeEventListener('keydown', onKey); };
  }, [onClose, anchorRef]);

  // --- COR ---
  const colorValue = b.type === 'color' ? b.value : '#e5006d';
  const setColor = (value) => onChange({ type: 'color', value, opacity: b.opacity ?? 1 });

  // --- GRADIENTE ---
  const gAngle = b.type === 'gradient' ? (b.angle ?? 180) : 180;
  const gStops = b.type === 'gradient' && b.stops ? b.stops : [{ color: '#ff8cc3', at: 0 }, { color: '#e5006d', at: 100 }];
  const emitGradient = (angle, stops, opacity = b.opacity ?? 1) =>
    onChange({ type: 'gradient', value: gradientCss(angle, stops), opacity, angle, stops });
  const setStopColor = (i, color) => {
    const next = gStops.map((s, idx) => idx === i ? { ...s, color } : s);
    emitGradient(gAngle, next);
  };
  const setAngle = (angle) => emitGradient(angle, gStops);

  // --- IMAGEM ---
  const imgSrc = b.type === 'image' ? b.src : '';
  const imgFit = b.type === 'image' ? b.fit : 'cover';
  const setImage = (patch) => onChange({
    type: 'image',
    src: patch.src ?? imgSrc,
    fit: patch.fit ?? imgFit,
    opacity: patch.opacity ?? (b.type === 'image' ? b.opacity : 1),
  });
  const onPickBgImage = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const { src } = await readImageScaled(file);
      setImage({ src, fit: imgFit, opacity: b.type === 'image' ? b.opacity : 1 });
      onUploadFiles?.([file]); // também guarda nos uploads do usuário
    } catch { alert('Não foi possível processar a imagem.'); }
    e.target.value = '';
  };

  const setOpacity = (opacity) => onChange({ ...b, opacity });

  return createPortal(
    <div ref={ref}
      className="fixed w-72 rounded-xl border border-stone-700/70 bg-stone-950/95 backdrop-blur shadow-2xl shadow-black/50 z-[9999] overflow-hidden"
      style={pos}>
      {/* header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-stone-800">
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-300 font-semibold">Fundo da página</span>
        <button onClick={onClose} className="text-stone-500 hover:text-stone-200"><X size={14} /></button>
      </div>

      {/* presets Lebes */}
      <div className="px-3 pt-3">
        <span className="text-[9px] uppercase tracking-wider text-stone-500">Predefinições Lebes</span>
        <div className="flex gap-2 mt-1.5">
          {BG_PRESETS.map(p => (
            <button key={p.id} onClick={() => { const made = p.make(); onChange(made); setTab(made.type === 'image' ? 'image' : made.type); }}
              title={p.label}
              className="w-9 h-9 rounded-lg border border-stone-700 hover:border-emerald-500 hover:scale-105 transition"
              style={{ background: p.swatch }} />
          ))}
        </div>
      </div>

      {/* tabs */}
      <div className="flex gap-1 px-3 pt-3">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1 text-[10px] py-1.5 rounded-md border transition ${active
                ? 'bg-emerald-700/20 border-emerald-600/60 text-emerald-200'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'}`}>
              <Icon size={12} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* tab body */}
      <div className="px-3 py-3 space-y-3">
        {tab === 'color' && (
          <>
            <div className="flex items-center gap-2">
              <input type="color" value={colorValue} onChange={e => setColor(e.target.value)}
                className="w-10 h-10 rounded-md bg-transparent border border-stone-700 cursor-pointer" />
              <input type="text" value={colorValue} onChange={e => setColor(e.target.value)}
                className="flex-1 bg-stone-900 border border-stone-800 rounded px-2 py-1.5 text-xs font-mono text-stone-100 focus:outline-none focus:border-emerald-700/60" />
            </div>
            <OpacityRow opacity={b.opacity ?? 1} onChange={setOpacity} />
          </>
        )}

        {tab === 'gradient' && (
          <>
            <div className="h-9 rounded-md border border-stone-700" style={{ background: gradientCss(gAngle, gStops) }} />
            <div className="grid grid-cols-2 gap-2">
              {gStops.map((s, i) => (
                <label key={i} className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded px-2 py-1.5">
                  <input type="color" value={s.color} onChange={e => setStopColor(i, e.target.value)}
                    className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer p-0" />
                  <span className="text-[10px] text-stone-400">{i === 0 ? 'Início' : 'Fim'}</span>
                </label>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] uppercase tracking-wider text-stone-500">Direção</span>
                <span className="text-[10px] font-mono text-stone-300">{gAngle}°</span>
              </div>
              <input type="range" min={0} max={360} step={5} value={gAngle}
                onChange={e => setAngle(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>
            <OpacityRow opacity={b.opacity ?? 1} onChange={setOpacity} />
          </>
        )}

        {tab === 'image' && (
          <>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickBgImage} />
            <button onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-1.5 text-xs py-2 rounded-md bg-stone-900 border border-stone-800 text-stone-300 hover:text-emerald-300 hover:border-emerald-700/60 transition">
              <Upload size={13} /> Enviar imagem
            </button>

            {uploads.length > 0 && (
              <div>
                <span className="text-[9px] uppercase tracking-wider text-stone-500">Dos meus uploads</span>
                <div className="grid grid-cols-4 gap-1.5 mt-1.5 max-h-24 overflow-y-auto">
                  {uploads.map(u => (
                    <button key={u.id} onClick={() => setImage({ src: u.src })} title={u.name}
                      className={`aspect-square rounded border overflow-hidden ${imgSrc === u.src ? 'border-emerald-500' : 'border-stone-700 hover:border-stone-500'}`}>
                      <img src={u.src} alt={u.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {imgSrc && (
              <>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500">Ajuste</span>
                  <div className="flex gap-1 mt-1.5">
                    {['cover', 'contain', 'tile'].map(f => (
                      <button key={f} onClick={() => setImage({ fit: f })}
                        className={`flex-1 text-[10px] py-1.5 rounded-md border transition ${imgFit === f
                          ? 'bg-emerald-700/20 border-emerald-600/60 text-emerald-200'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'}`}>
                        {f === 'cover' ? 'Preencher' : f === 'contain' ? 'Ajustar' : 'Mosaico'}
                      </button>
                    ))}
                  </div>
                </div>
                <OpacityRow opacity={b.opacity ?? 1} onChange={setOpacity} />
              </>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
