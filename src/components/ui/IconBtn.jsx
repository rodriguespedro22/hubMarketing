export default function IconBtn({ children, onClick, active, title }) {
  return (
    <button title={title} onClick={onClick}
      className={`p-1.5 rounded transition ${active ? 'bg-emerald-700 text-white' : 'bg-stone-900 text-stone-400 hover:text-stone-100 hover:bg-stone-800'}`}>
      {children}
    </button>
  );
}

// ============================================================
// PROPERTIES PANEL
// ============================================================
