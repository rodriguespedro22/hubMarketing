import { useRef, useState } from 'react';
import { AdminNav, Stepper, ConfirmacaoRow } from './shared';

const STEPS = [
  { id: 'dados', label: 'Dados do arquivo' },
  { id: 'segmentacao', label: 'Segmentação' },
  { id: 'confirmacao', label: 'Confirmação' },
];

const CENTRAIS = [
  { id: 'campanhas', label: 'Campanhas' },
  { id: 'apoio', label: 'Apoio' },
  { id: 'marcas', label: 'Marcas' },
  { id: 'estudio', label: 'Estúdio' },
];

const STATUS_OPTIONS = ['Publicado', 'Rascunho', 'Agendado'];
const TIPO_MODULO_OPTIONS = ['Logo', 'Template', 'Áudio', 'Enxoval', 'Outro'];
const CAMPANHA_OPTIONS = ['Copa Lebes', 'Liquida', 'Institucional', 'Outro'];
const FORMATO_OPTIONS = ['Feed 1:1', 'Stories', 'Banner', 'Impresso', 'MP3'];

function Field({ label, required, children }) {
  return (
    <div className="flex-1 flex flex-col gap-[6px]">
      <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
        {label} {required && <span className="text-[#c0392b] font-bold">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]";

function BlocoLabel({ children }) {
  return (
    <div className="bg-[#f7f6f2] rounded-[8px] px-3 py-2">
      <span className="text-[10px] uppercase tracking-wide text-[#888] font-semibold">{children}</span>
    </div>
  );
}

function DadosStep({ form, setForm, onAvancar }) {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const setField = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const filled = form.nome && form.campanha && form.tipoModulo && form.formato && form.central && form.destinatario && form.periodo;

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setForm(p => ({ ...p, nome: p.nome || f.name }));
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="font-light text-[13px] text-[#606060]">Passo 1 de 3 · Identificação e tipo do material</p>

      <button
        onClick={() => fileRef.current?.click()}
        className="flex flex-col items-center justify-center gap-1 py-6 rounded-[12px] border-[1.5px] border-dashed border-[#5ca847] bg-[#e8f0e4] hover:bg-[#ddebd6] transition-colors"
      >
        <span className="font-semibold text-[13px] text-[#2e2e2e]">ℹ Arraste o arquivo ou clique para enviar</span>
        <span className="font-normal text-[11px] text-[#606060]">
          {fileName || 'SVG · PNG · JPG · MP3 · PDF · ZIP · até 200 MB'}
        </span>
      </button>
      <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />

      <BlocoLabel>Bloco 1 — Identificação</BlocoLabel>
      <div className="flex gap-4">
        <Field label="Nome do arquivo" required>
          <input value={form.nome} onChange={setField('nome')} placeholder="ex: Logo Copa Lebes — versão branca" className={inputCls} />
        </Field>
        <Field label="Campanha" required>
          <select value={form.campanha} onChange={setField('campanha')} className={inputCls}>
            <option value="">Copa Lebes / Liquida / Institucional / Outro...</option>
            {CAMPANHA_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <div className="flex gap-4">
        <Field label="Tipo de módulo" required>
          <select value={form.tipoModulo} onChange={setField('tipoModulo')} className={inputCls}>
            <option value="">Logo / Template / Áudio / Enxoval / Outro</option>
            {TIPO_MODULO_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Formato do arquivo" required>
          <select value={form.formato} onChange={setField('formato')} className={inputCls}>
            <option value="">Feed 1:1 / Stories / Banner / Impresso / MP3...</option>
            {FORMATO_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>
      </div>

      <BlocoLabel>Bloco 2 — Segmentação e destino</BlocoLabel>
      <div className="flex gap-4">
        <Field label="Central de destino" required>
          <select value={form.central} onChange={setField('central')} className={inputCls}>
            <option value="">Campanhas / Apoio / Marcas / Estúdio</option>
            {CENTRAIS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Destinatário" required>
          <input value={form.destinatario} onChange={setField('destinatario')} placeholder="Todos / Setorial / Lojas / Perfil específico..." className={inputCls} />
        </Field>
        <Field label="Período de vigência" required>
          <input value={form.periodo} onChange={setField('periodo')} placeholder="01/07/2025 → 31/07/2025" className={inputCls} />
        </Field>
      </div>
      <div className="flex gap-4">
        <Field label="Palavras-chave">
          <input value={form.palavrasChave} onChange={setField('palavrasChave')} placeholder="copa, logo, verde, oferta, copa lebes..." className={inputCls} />
        </Field>
        <Field label="Observações">
          <input value={form.observacoes} onChange={setField('observacoes')} placeholder="Instruções de uso, restrições, versão..." className={inputCls} />
        </Field>
      </div>

      <div className="flex justify-end">
        <button
          disabled={!filled}
          onClick={onAvancar}
          className={`font-semibold text-[13px] px-[18px] py-[11px] rounded-[10px] transition-colors ${filled ? 'bg-[#5ca847] text-white hover:bg-[#4a9438]' : 'bg-[#ddd] text-white cursor-not-allowed'}`}
        >
          Avançar para Segmentação →
        </button>
      </div>
    </div>
  );
}

function SegmentacaoStep({ form, setForm, onVoltar, onAvancar }) {
  const setField = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));
  const filled = form.central && form.aba && form.destinatario && form.dataInicio && form.dataFim && form.status;

  return (
    <div className="flex flex-col gap-5">
      <p className="font-light text-[13px] text-[#606060]">Passo 2 de 3 · Defina quem vai ver e onde o arquivo aparece</p>

      <div className="bg-[#e8f0e4] border border-[#5ca847] rounded-[10px] px-4 py-3">
        <p className="font-semibold text-[13px] text-[#2e2e2e]">{form.nome}</p>
        <p className="font-normal text-[12px] text-[#606060]">Tipo: {form.tipoModulo} · Campanha: {form.campanha} · Formato: {form.formato}</p>
      </div>

      <div className="flex gap-4">
        <Field label="Central de destino" required>
          <select value={form.central} onChange={setField('central')} className={inputCls}>
            {CENTRAIS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Aba dentro da central" required>
          <input value={form.aba} onChange={setField('aba')} placeholder="Arquivos / Tutoriais / FAQ..." className={inputCls} />
        </Field>
      </div>
      <div className="flex gap-4">
        <Field label="Destinatário" required>
          <input value={form.destinatario} onChange={setField('destinatario')} placeholder="Todos / Setores internos / Lojas / Perfil específico" className={inputCls} />
        </Field>
        <Field label="Setor / segmento">
          <input value={form.segmento} onChange={setField('segmento')} placeholder="Compras / RH / Todas as lojas..." className={inputCls} />
        </Field>
      </div>
      <div className="flex gap-4">
        <Field label="Data início" required>
          <input type="date" value={form.dataInicio} onChange={setField('dataInicio')} className={inputCls} />
        </Field>
        <Field label="Data fim" required>
          <input type="date" value={form.dataFim} onChange={setField('dataFim')} className={inputCls} />
        </Field>
        <Field label="Status" required>
          <select value={form.status} onChange={setField('status')} className={inputCls}>
            <option value="">Publicado / Rascunho / Agendado</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button onClick={onVoltar}
          className="bg-white border border-[#e8e8e5] text-[#606060] font-medium text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#f7f6f2] transition-colors">
          ← Voltar
        </button>
        <button
          disabled={!filled}
          onClick={onAvancar}
          className={`font-semibold text-[13px] px-[18px] py-[11px] rounded-[10px] transition-colors ${filled ? 'bg-[#5ca847] text-white hover:bg-[#4a9438]' : 'bg-[#ddd] text-white cursor-not-allowed'}`}
        >
          Revisar e confirmar →
        </button>
      </div>
    </div>
  );
}

function ConfirmacaoStep({ form, onVoltar, onPublicar }) {
  const centralLabel = CENTRAIS.find(c => c.id === form.central)?.label || form.central;
  const fmtDate = (d) => d ? `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}` : '—';

  return (
    <div className="flex flex-col gap-5">
      <p className="font-light text-[13px] text-[#606060]">Passo 3 de 3 · Revise antes de publicar</p>

      <div className="bg-white border border-[#e8e8e5] rounded-[16px] overflow-hidden">
        <ConfirmacaoRow label="Nome" value={form.nome} />
        <ConfirmacaoRow label="Campanha" value={form.campanha} />
        <ConfirmacaoRow label="Tipo" value={form.tipoModulo} />
        <ConfirmacaoRow label="Formato" value={form.formato} />
        <ConfirmacaoRow label="Destino" value={`${centralLabel} → ${form.aba}`} />
        <ConfirmacaoRow label="Destinatário" value={form.destinatario} />
        <ConfirmacaoRow label="Período" value={`${fmtDate(form.dataInicio)} → ${fmtDate(form.dataFim)}`} />
        <ConfirmacaoRow label="Palavras-chave" value={form.palavrasChave || '—'} />
        <ConfirmacaoRow label="Status" value={form.status} />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button onClick={onVoltar}
          className="bg-white border border-[#e8e8e5] text-[#606060] font-medium text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#f7f6f2] transition-colors">
          ← Voltar
        </button>
        <button onClick={onPublicar}
          className="bg-[#5ca847] text-white font-semibold text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#4a9438] transition-colors">
          Publicar arquivo
        </button>
      </div>
    </div>
  );
}

const FORM_INICIAL = (central) => ({
  nome: '', campanha: '', tipoModulo: '', formato: '',
  central: central || '', destinatario: '', periodo: '', palavrasChave: '', observacoes: '',
  aba: '', segmento: '', dataInicio: '', dataFim: '', status: '',
});

export default function EnviarArquivo({ repoIdInicial, onPublish, onBack, onHome }) {
  const [step, setStep] = useState('dados');
  const [form, setForm] = useState(() => FORM_INICIAL(repoIdInicial));

  const handlePublicar = () => {
    onPublish(form.central, {
      nome: form.nome,
      tipo: form.tipoModulo,
      enviadoPor: 'Você',
      data: (() => {
        const d = new Date();
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      })(),
    });
  };

  return (
    <div className="flex flex-col gap-5 px-7 py-6 h-full overflow-y-auto">
      <AdminNav onBack={onBack} onHome={onHome} />
      <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">
        {step === 'dados' ? 'Upload de Arquivo — Dados' : step === 'segmentacao' ? 'Upload — Segmentação' : 'Upload — Confirmação'}
      </h1>

      <Stepper steps={STEPS} step={step} />

      {step === 'dados' && (
        <DadosStep form={form} setForm={setForm} onAvancar={() => setStep('segmentacao')} />
      )}
      {step === 'segmentacao' && (
        <SegmentacaoStep form={form} setForm={setForm} onVoltar={() => setStep('dados')} onAvancar={() => setStep('confirmacao')} />
      )}
      {step === 'confirmacao' && (
        <ConfirmacaoStep form={form} onVoltar={() => setStep('segmentacao')} onPublicar={handlePublicar} />
      )}
    </div>
  );
}
