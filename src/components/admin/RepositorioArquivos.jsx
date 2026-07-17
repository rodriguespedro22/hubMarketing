import { AdminNav } from './shared';

// ── Dados mockados — um repositório por central, espelhando o Figma ─────────
// `arquivosIniciais` semeia o estado que AdminLebes.jsx mantém (lifted) para
// sobreviver à troca entre repositórios e ao wizard de Enviar Arquivo.
export const REPOSITORIOS = {
  apoio: {
    titulo: 'Repositório — Central de Apoio',
    accent: '#c0392b',
    arquivosIniciais: [
      { nome: 'video-tutorial-instagram.mp4', tipo: 'Vídeo', enviadoPor: 'Ana Souza', data: '28/06/2026' },
      { nome: 'guia-atendimento-pdv.pdf', tipo: 'PDF', enviadoPor: 'Carlos Melo', data: '25/06/2026' },
      { nome: 'faq-respostas-padrao.docx', tipo: 'Documento', enviadoPor: 'Fernanda Rüdi', data: '20/06/2026' },
      { nome: 'banner-central-apoio.png', tipo: 'Imagem', enviadoPor: 'Diego Fagundes', data: '15/06/2026' },
    ],
  },
  campanhas: {
    titulo: 'Repositório — Central de Campanhas',
    accent: '#ff9e1b',
    arquivosIniciais: [
      { nome: 'video-copa-lebes-15s.mp4', tipo: 'Vídeo', enviadoPor: 'Diego Fagundes', data: '27/06/2026' },
      { nome: 'banner-copa-lebes-story.png', tipo: 'Imagem', enviadoPor: 'Ana Souza', data: '24/06/2026' },
      { nome: 'briefing-campanha-inverno.pdf', tipo: 'PDF', enviadoPor: 'Tatiane Lima', data: '18/06/2026' },
      { nome: 'calendario-editorial-julho.xlsx', tipo: 'Planilha', enviadoPor: 'Carlos Melo', data: '10/06/2026' },
    ],
  },
  marcas: {
    titulo: 'Repositório — Central das Marcas',
    accent: '#3879b4',
    arquivosIniciais: [
      { nome: 'brandbook-lebes-2026.pdf', tipo: 'PDF', enviadoPor: 'Fernanda Rüdi', data: '22/06/2026' },
      { nome: 'logo-lojas-lebes-pack.zip', tipo: 'Arquivo', enviadoPor: 'Paulo Gomes', data: '19/06/2026' },
      { nome: 'paleta-cores-grupo-lebes.png', tipo: 'Imagem', enviadoPor: 'Ana Souza', data: '12/06/2026' },
      { nome: 'tipografia-gantari-guia.pdf', tipo: 'PDF', enviadoPor: 'Diego Fagundes', data: '05/06/2026' },
    ],
  },
  estudio: {
    titulo: 'Repositório — Estúdio Criativo',
    accent: '#8b5c9e',
    arquivosIniciais: [
      { nome: 'template-cartaz-oferta.psd', tipo: 'Template', enviadoPor: 'Carlos Melo', data: '26/06/2026' },
      { nome: 'preco-vertical-revista.pdf', tipo: 'PDF', enviadoPor: 'Tatiane Lima', data: '21/06/2026' },
      { nome: 'story-formato-9x16.png', tipo: 'Imagem', enviadoPor: 'Fernanda Rüdi', data: '14/06/2026' },
      { nome: 'mockup-vitrine-lojas.jpg', tipo: 'Imagem', enviadoPor: 'Paulo Gomes', data: '08/06/2026' },
    ],
  },
};

export default function RepositorioArquivos({ repoId, arquivos, onExcluir, onEnviarArquivo, onBack, onHome }) {
  const { titulo, accent } = REPOSITORIOS[repoId];

  return (
    <div className="flex flex-col gap-[18px] px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />

      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">{titulo}</h1>
        <button
          onClick={onEnviarArquivo}
          className="bg-[#5ca847] text-white font-semibold text-[13px] px-4 py-[10px] rounded-[10px] hover:bg-[#4a9438] transition-colors"
        >
          + Enviar arquivo
        </button>
      </div>

      {/* Cabeçalho da tabela */}
      <div className="bg-[#f7f6f2] rounded-[10px] px-4 py-[10px] flex items-center">
        <div className="w-[260px] shrink-0"><span className="font-semibold text-[11px] text-[#888] tracking-[0.4px] uppercase">Arquivo</span></div>
        <div className="w-[180px] shrink-0"><span className="font-semibold text-[11px] text-[#888] tracking-[0.4px] uppercase">Tipo</span></div>
        <div className="w-[160px] shrink-0"><span className="font-semibold text-[11px] text-[#888] tracking-[0.4px] uppercase">Enviado por</span></div>
        <div className="w-[140px] shrink-0"><span className="font-semibold text-[11px] text-[#888] tracking-[0.4px] uppercase">Data</span></div>
        <div className="shrink-0"><span className="font-semibold text-[11px] text-[#888] tracking-[0.4px] uppercase">Ações</span></div>
      </div>

      {/* Linhas */}
      <div className="flex flex-col gap-2">
        {arquivos.map(a => (
          <div key={a.nome} className="bg-white border border-[#e8e8e5] rounded-[8px] px-4 py-3 flex items-center">
            <div className="w-[260px] shrink-0 flex items-center gap-3">
              <div className="w-8 h-8 rounded-[8px] shrink-0" style={{ background: accent }} />
              <span className="font-medium text-[14px] text-[#2e2e2e]">{a.nome}</span>
            </div>
            <div className="w-[180px] shrink-0">
              <span
                className="font-medium text-[12px] px-3 py-1 rounded-[12px]"
                style={{ background: `${accent}26`, color: accent }}
              >
                {a.tipo}
              </span>
            </div>
            <div className="w-[160px] shrink-0"><span className="font-normal text-[14px] text-[#606060]">{a.enviadoPor}</span></div>
            <div className="w-[140px] shrink-0"><span className="font-normal text-[13px] text-[#606060]">{a.data}</span></div>
            <div className="flex items-center gap-4">
              <button className="font-medium text-[13px] text-[#3d7a2e] hover:underline">Baixar</button>
              <button onClick={() => onExcluir(a.nome)} className="font-medium text-[13px] text-[#c0392b] hover:underline">Excluir</button>
            </div>
          </div>
        ))}
        {arquivos.length === 0 && (
          <div className="text-center py-8 text-[13px] text-[#888]">Nenhum arquivo enviado ainda.</div>
        )}
      </div>
    </div>
  );
}
