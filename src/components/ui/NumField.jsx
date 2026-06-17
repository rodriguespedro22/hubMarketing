import { clamp } from '../../utils/helpers';

export default function NumField({ label, value, onChange, min = -9999, max = 9999, step = 1, w = 'w-full' }) {
  return (
    <label className="block">
      <span className="text-[9px] uppercase tracking-wider text-stone-500">{label}</span>
      <input type="number" value={Math.round(value)} step={step}
        onChange={e => onChange(clamp(Number(e.target.value), min, max))}
        className={`${w} bg-stone-900 border border-stone-800 rounded px-2 py-1 text-xs text-stone-100 focus:outline-none focus:border-emerald-700/60 mt-0.5`} />
    </label>
  );
}
