import { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { makeCI, simulateImport } from '../../data/ci';
import { fmt } from '../../utils/helpers';
import { AdminNav, Stepper, ConfirmacaoRow } from './shared';

const STEPS_COM_IMPORT = [
  { id: 'dados', label: 'Dados da CI' },
  { id: 'revisao', label: 'Revisão' },
  { id: 'confirmacao', label: 'Confirmação' },
];
const STEPS_MANUAL = [
  { id: 'dados', label: 'Dados da CI' },
  { id: 'confirmacao', label: 'Confirmação' },
];

const MATERIAL_OPTIONS = ['Revista de Ofertas', 'Fechamento de Mês', 'Telefonia', 'Campanha de Inverno', 'Outra'];

function DadosStep({ form, setForm, onImport, onManualSubmit, onSaveDraft }) {
  const fileRef = useRef(null);
  const filled = form.nome && form.material && form.inicioVigencia && form.fimVigencia;
  const setField = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div className="flex flex-col gap-5">
      <p className="font-light text-[13px] text-[#606060]">Passo 1 de 3 · Envie a planilha da CI ou preencha os campos manualmente</p>

      <div className="bg-[#ede0f2] border border-[#8b5c9e] rounded-[10px] px-4 py-3 flex items-center gap-3">
        <span className="font-bold text-[14px] text-[#8b5c9e]">*</span>
        <span className="font-normal text-[13px] text-[#606060]">Todos os campos com * devem ser preenchidos para o envio da CI</span>
      </div>

      <div className="bg-[#e8f0e4] border border-[#5ca847] rounded-[14px] px-5 py-4 flex items-center gap-[14px]">
        <div className="w-11 h-11 bg-[#5ca847] rounded-[10px] flex items-center justify-center shrink-0">
          <UploadCloud size={20} className="text-white" />
        </div>
        <div className="flex flex-col gap-[2px] flex-1">
          <span className="font-semibold text-[14px] text-[#2e2e2e]">Importar CI via planilha Excel</span>
          <span className="font-normal text-[12px] text-[#606060]">Baixe o modelo, preencha e faça o upload. As ofertas dessa CI serão cadastradas automaticamente.</span>
        </div>
        <button
          disabled={!filled}
          onClick={() => fileRef.current?.click()}
          className={`font-semibold text-[13px] px-[18px] py-[10px] rounded-[10px] transition-colors ${filled ? 'bg-[#5ca847] text-white hover:bg-[#4a9438]' : 'bg-[#d5e5cd] text-white cursor-not-allowed'}`}
        >
          Importar CI via planilha Excel
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) onImport(); e.target.value = ''; }}
        />
      </div>

      <div className="flex items-center gap-[10px]">
        <div className="flex-1 h-[0.5px] bg-[#e8e8e5]" />
        <span className="font-normal text-[11px] text-[#606060] whitespace-nowrap">ou preencha manualmente</span>
        <div className="flex-1 h-[0.5px] bg-[#e8e8e5]" />
      </div>

      <div className="bg-white border border-[#e8e8e5] rounded-[16px] px-7 py-6 flex flex-col gap-5">
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Nome da CI <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input value={form.nome} onChange={setField('nome')} placeholder="ex: CI da Revista"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]" />
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Material / Categoria <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <select value={form.material} onChange={setField('material')}
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#606060]">
              <option value="">ex: Revista de Ofertas</option>
              {MATERIAL_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Início da vigência <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input type="date" value={form.inicioVigencia} onChange={setField('inicioVigencia')}
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e]" />
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Fim da vigência <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input type="date" value={form.fimVigencia} onChange={setField('fimVigencia')}
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e]" />
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
            Observações <span className="font-normal text-[11px] text-[#606060]">(opcional)</span>
          </label>
          <input value={form.observacoes} onChange={setField('observacoes')} placeholder="ex: Somente enquanto durar o estoque"
            className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]" />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onSaveDraft}
            className="bg-white border border-[#e8e8e5] text-[#606060] font-medium text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#f7f6f2] transition-colors">
            Salvar rascunho
          </button>
          <button
            disabled={!filled}
            onClick={onManualSubmit}
            className={`font-semibold text-[13px] px-[18px] py-[11px] rounded-[10px] transition-colors ${filled ? 'bg-[#8b5c9e] text-white hover:bg-[#7a4e8a]' : 'bg-[#ddd] text-white cursor-not-allowed'}`}
          >
            Enviar CI →
          </button>
        </div>
      </div>
    </div>
  );
}

function RevisaoStep({ rows, onCorrigir, onContinuar }) {
  const ok = rows.filter(r => !r.erro).length;
  return (
    <div className="flex flex-col gap-5">
      <p className="font-light text-[13px] text-[#606060]">Passo 2 de 3 · Confira as ofertas importadas antes de continuar</p>

      <div className="bg-[#e8f0e4] border border-[#5ca847] rounded-[10px] px-4 py-3">
        <p className="font-medium text-[13px] text-[#3d7a2e]">
          ✓ {ok} de {rows.length} ofertas importadas com sucesso
          {rows.length - ok > 0 && <span className="text-[#e0913a]"> · ⚠ {rows.length - ok} com erro (veja abaixo)</span>}
        </p>
      </div>

      <div className="bg-white border border-[#e8e8e5] rounded-[16px] overflow-hidden">
        <div className="bg-[#f7f6f2] px-4 py-[10px] flex items-center">
          <div className="w-[260px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Produto</span></div>
          <div className="w-[150px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Categoria</span></div>
          <div className="w-[120px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Preço</span></div>
          <div className="w-[130px] shrink-0"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Vigência</span></div>
          <div className="flex-1"><span className="font-semibold text-[10.5px] text-[#606060] tracking-[0.1px] uppercase">Status</span></div>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="px-4 py-3 flex items-center border-t border-[#e8e8e5]" style={r.erro ? { background: '#fbe8e8' } : undefined}>
            <div className="w-[260px] shrink-0"><span className="font-semibold text-[12px] text-[#2e2e2e]">{r.nome}</span></div>
            <div className="w-[150px] shrink-0"><span className="font-normal text-[12px] text-[#606060]">{r.categoria}</span></div>
            <div className="w-[120px] shrink-0"><span className="font-normal text-[12px] text-[#606060]">{r.preco != null ? `R$ ${fmt(r.preco)}` : '—'}</span></div>
            <div className="w-[130px] shrink-0"><span className="font-normal text-[12px] text-[#606060]">{r.inicioVigencia ? `${r.inicioVigencia.slice(8, 10)}/${r.inicioVigencia.slice(5, 7)} – ${r.fimVigencia.slice(8, 10)}/${r.fimVigencia.slice(5, 7)}` : '—'}</span></div>
            <div className="flex-1">
              {r.erro
                ? <span className="font-semibold text-[12px] text-[#c0392b]">⚠ {r.erro}</span>
                : <span className="font-semibold text-[12px] text-[#3d7a2e]">✓ OK</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3">
        <button onClick={onCorrigir}
          className="bg-white border border-[#e8e8e5] text-[#606060] font-medium text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#f7f6f2] transition-colors">
          Corrigir arquivo
        </button>
        <button onClick={onContinuar}
          className="bg-[#8b5c9e] text-white font-semibold text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#7a4e8a] transition-colors">
          Continuar →
        </button>
      </div>
    </div>
  );
}

function ConfirmacaoStep({ form, ofertasValidas, totalImportadas, onVoltar, onPublicar }) {
  const fmtDate = (d) => d ? `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}` : '—';
  return (
    <div className="flex flex-col gap-5">
      <p className="font-light text-[13px] text-[#606060]">Passo 3 de 3 · Revise antes de publicar</p>

      <div className="bg-white border border-[#e8e8e5] rounded-[16px] overflow-hidden">
        <ConfirmacaoRow label="Nome da CI" value={form.nome} />
        <ConfirmacaoRow label="Material" value={form.material} />
        <ConfirmacaoRow label="Ofertas válidas" value={totalImportadas > 0 ? `${ofertasValidas.length} de ${totalImportadas} importadas` : `${ofertasValidas.length} (cadastro manual)`} />
        <ConfirmacaoRow label="Criado por" value={form.criadoPor} />
        <ConfirmacaoRow label="Início da vigência" value={fmtDate(form.inicioVigencia)} />
        <ConfirmacaoRow label="Fim da vigência" value={fmtDate(form.fimVigencia)} />
        <ConfirmacaoRow label="Status" value="Pronta para publicar" />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button onClick={onVoltar}
          className="bg-white border border-[#e8e8e5] text-[#606060] font-medium text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#f7f6f2] transition-colors">
          ← Voltar e revisar
        </button>
        <button onClick={onPublicar}
          className="bg-[#5ca847] text-white font-semibold text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#4a9438] transition-colors">
          Publicar CI →
        </button>
      </div>
    </div>
  );
}

const FORM_INICIAL = { nome: '', material: '', inicioVigencia: '', fimVigencia: '', observacoes: '', criadoPor: 'Ana Souza' };

export default function CadastrarCI({ onPublish, onBack, onHome }) {
  const [step, setStep] = useState('dados');
  const [form, setForm] = useState(FORM_INICIAL);
  const [importedRows, setImportedRows] = useState(null);

  const handleImport = () => {
    setImportedRows(simulateImport().rows);
    setStep('revisao');
  };

  const handleManualSubmit = () => {
    setImportedRows(null);
    setStep('confirmacao');
  };

  const ofertasValidas = importedRows
    ? importedRows.filter(r => !r.erro).map(r => ({
        nome: r.nome, setor: r.categoria, precoPor: r.preco,
        inicioVigencia: r.inicioVigencia, fimVigencia: r.fimVigencia,
        condicaoPagamento: '', visivel: false,
      }))
    : [];

  const handlePublicar = () => {
    const ci = makeCI({ ...form, ofertas: ofertasValidas });
    onPublish(ci);
  };

  return (
    <div className="flex flex-col gap-5 px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />
      <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">Cadastrar CI</h1>

      {step !== 'dados' && <Stepper steps={importedRows !== null ? STEPS_COM_IMPORT : STEPS_MANUAL} step={step} />}

      {step === 'dados' && (
        <DadosStep
          form={form}
          setForm={setForm}
          onImport={handleImport}
          onManualSubmit={handleManualSubmit}
          onSaveDraft={onBack}
        />
      )}
      {step === 'revisao' && (
        <RevisaoStep
          rows={importedRows || []}
          onCorrigir={() => setStep('dados')}
          onContinuar={() => setStep('confirmacao')}
        />
      )}
      {step === 'confirmacao' && (
        <ConfirmacaoStep
          form={form}
          ofertasValidas={ofertasValidas}
          totalImportadas={importedRows?.length || 0}
          onVoltar={() => setStep(importedRows ? 'revisao' : 'dados')}
          onPublicar={handlePublicar}
        />
      )}
    </div>
  );
}
