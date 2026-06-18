// Folha deslizante que sobe a partir da barra inferior no mobile (estilo Canva)
export default function MobileBottomSheet({ open, onClose, isDark, children }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className={`fixed left-0 right-0 z-50 rounded-t-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
          isDark ? 'bg-stone-950 border-t border-stone-800' : 'bg-white border-t border-[#e8e7e2]'
        } ${open ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}
        style={{ bottom: 64, maxHeight: '70vh' }}
      >
        {/* Handle visual */}
        <div className="flex items-center justify-center pt-3 pb-1 shrink-0">
          <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-stone-700' : 'bg-stone-300'}`} />
        </div>
        {/* Conteúdo do painel */}
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
}
