import { FileImage } from 'lucide-react';

export default function ImageContent({ el }) {
  if (!el.src) {
    return (
      <div className="w-full h-full rounded-[inherit] bg-stone-200 flex flex-col items-center justify-center text-stone-400 pointer-events-none">
        <FileImage size={22} strokeWidth={1.5} />
        <span className="text-[9px] mt-1">Imagem</span>
      </div>
    );
  }
  return <img src={el.src} alt="" className="w-full h-full rounded-[inherit] pointer-events-none select-none"
    style={{ objectFit: el.fit || 'cover' }} draggable={false} />;
}
