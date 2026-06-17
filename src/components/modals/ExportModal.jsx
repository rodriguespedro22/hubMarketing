import { FileCheck2, FileImage, FileJson, FileText } from 'lucide-react';

import Modal from './Modal';

export default function ExportModal({ onClose, onPdf, onCmyk, onJpg, onEditable, format, pages, exporting, exportingJpg }) {
  return (
    <Modal title="Exportar projeto" onClose={onClose} w="w-[520px]">
      <div className="text-[11px] text-stone-400 mb-4 flex items-center gap-3 leading-relaxed">
        <FileText size={14} className="text-stone-500 shrink-0" />
        <span>{pages.length} {pages.length === 1 ? 'página' : 'páginas'} · formato {format.label} ({format.mm[0]}×{format.mm[1]} mm)</span>
      </div>
      <div className="space-y-2">
        <ExportOption
          icon={FileText} title="PDF (RGB)"
          desc={`Exporta todas as ${pages.length} ${pages.length === 1 ? 'página' : 'páginas'} em um único PDF via servidor.`}
          onClick={onPdf} loading={exporting} loadingLabel="Gerando PDF…" />
        <ExportOption
          icon={FileImage} title="Imagens JPG (ZIP)"
          desc={`Exporta cada página como um JPEG em alta resolução (3×). ${pages.length > 1 ? `${pages.length} arquivos compactados em .zip.` : 'Download direto do .zip.'}`}
          onClick={onJpg} loading={exportingJpg} loadingLabel="Gerando JPGs…" />
        <ExportOption
          icon={FileCheck2} title="PDF print-ready (CMYK)" badge="Em breve"
          desc="Para a gráfica: perfil ICC CMYK, sangria de 3mm e marcas de corte. Requer serviço dedicado."
          onClick={onCmyk} />
        <ExportOption
          icon={FileJson} title="Arquivo de projeto (.json)"
          desc="Salva o estado completo do projeto — pode ser reaberto no Estúdio Criativo para continuar de onde parou."
          onClick={onEditable} primary />
      </div>
      <div className="mt-4 pt-3 border-t border-stone-800 text-[10px] text-stone-500 italic leading-relaxed" style={{ fontFamily: 'Gantari,sans-serif' }}>
        Nota técnica: conversão CMYK e marcas de corte exigem perfil ICC server-side — disponível em breve.
      </div>
    </Modal>
  );
}

function ExportOption({ icon: Icon, title, desc, badge, onClick, primary, loading, loadingLabel }) {
  return (
    <button onClick={onClick} disabled={loading}
      className={`w-full text-left p-3 rounded-md border transition group flex gap-3 disabled:opacity-60 disabled:cursor-not-allowed
        ${primary
          ? 'bg-emerald-950/30 border-emerald-700/40 hover:border-emerald-600 hover:bg-emerald-950/50'
          : 'bg-stone-900/40 border-stone-800 hover:border-stone-700'}`}>
      <div className={`shrink-0 w-9 h-9 rounded flex items-center justify-center
        ${primary ? 'bg-emerald-700/40 text-emerald-300' : 'bg-stone-800 text-stone-400 group-hover:text-stone-200'}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${primary ? 'text-emerald-100' : 'text-stone-100'}`}>
            {loading ? (loadingLabel || 'Aguarde…') : title}
          </span>
          {badge && !loading && <span className="text-[9px] uppercase tracking-wider bg-amber-900/50 text-amber-300 px-1.5 py-0.5 rounded">{badge}</span>}
        </div>
        <div className="text-[11px] text-stone-400 mt-1 leading-snug">{desc}</div>
      </div>
    </button>
  );
}

// ============================================================
// MAIN APP
// ============================================================
