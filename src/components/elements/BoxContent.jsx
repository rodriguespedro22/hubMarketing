export default function BoxContent({ el }) {
  return <div className="w-full h-full rounded-[inherit] pointer-events-none"
    style={{
      background: el.fill,
      border: el.borderW ? `${el.borderW}px ${el.borderStyle || 'solid'} ${el.borderColor || '#000'}` : 'none',
    }} />;
}
