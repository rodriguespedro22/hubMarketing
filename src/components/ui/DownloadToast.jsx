import { AlertCircle, CheckCircle2, Download, X } from 'lucide-react';

export default function DownloadToastStack({ tasks, onDismiss, onRedownload, onRetry }) {
  if (!tasks.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[300] flex flex-col-reverse gap-2 w-80 max-w-[90vw]">
      {tasks.map(t => (
        <DownloadToastCard key={t.id} task={t}
          onDismiss={() => onDismiss(t.id)}
          onRedownload={() => onRedownload(t)}
          onRetry={() => onRetry(t)} />
      ))}
    </div>
  );
}

function DownloadToastCard({ task, onDismiss, onRedownload, onRetry }) {
  const { title, status, progress = 0 } = task;
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-3 flex gap-3 relative">
      <button onClick={onDismiss} className="absolute top-2 right-2 text-stone-500 hover:text-stone-200 transition">
        <X size={13} />
      </button>
      <div className="shrink-0 w-9 h-9 rounded flex items-center justify-center bg-stone-800">
        {status === 'concluido' && <CheckCircle2 size={18} className="text-emerald-400" />}
        {status === 'erro' && <AlertCircle size={18} className="text-rose-400" />}
        {status === 'baixando' && <Download size={16} className="text-stone-400" />}
      </div>
      <div className="flex-1 min-w-0 pr-4">
        <div className="text-xs font-semibold text-stone-100 truncate">{title}</div>

        {status === 'baixando' && (
          <>
            <div className="text-[10px] text-stone-400 mt-0.5">Baixando{progress > 0 ? `… ${progress}%` : '…'}</div>
            <div className="mt-1.5 h-1 rounded-full bg-stone-800 overflow-hidden relative">
              {progress > 0 ? (
                <div className="h-full rounded-full bg-emerald-500 transition-all duration-150" style={{ width: `${progress}%` }} />
              ) : (
                <div className="absolute inset-y-0 w-1/3 rounded-full bg-emerald-500"
                  style={{ animation: 'download-progress-indeterminate 1.1s ease-in-out infinite' }} />
              )}
            </div>
          </>
        )}

        {status === 'concluido' && (
          <div className="text-[10px] text-stone-400 mt-0.5">
            Concluído · caso não tenha começado, <button onClick={onRedownload} className="text-emerald-400 hover:underline">clique aqui</button>
          </div>
        )}

        {status === 'erro' && (
          <div className="text-[10px] text-rose-400 mt-0.5">
            {task.error || 'Falha ao exportar'} · <button onClick={onRetry} className="text-stone-300 hover:underline">tentar novamente</button>
          </div>
        )}
      </div>
    </div>
  );
}
