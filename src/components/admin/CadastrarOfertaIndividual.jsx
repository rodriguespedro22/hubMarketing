import { useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import { AdminNav } from './shared';

const SETOR_OPTIONS = ['Telefonia', 'Tecnologia', 'Móveis', 'Linha Branca', 'Moda'];
const SELO_OPTIONS = ['Lançamento', 'Oferta', 'Exclusivo', 'Últimas unidades'];

const FORM_INICIAL = {
  nome: '', codigo: '', precoPor: '', precoDe: '', parcelaValor: '', condicaoPagamento: '',
  setor: 'Telefonia', inicioVigencia: '', fimVigencia: '', selo: '', descricao: '',
};

export default function CadastrarOfertaIndividual({ ci, onImportarCI, onSubmit, onBack, onHome }) {
  const [form, setForm] = useState(FORM_INICIAL);
  const setField = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const filled = form.nome && form.codigo && form.precoPor && form.parcelaValor && form.inicioVigencia && form.fimVigencia;

  const handleSubmit = () => {
    onSubmit({
      nome: form.nome, codigo: form.codigo,
      precoPor: Number(form.precoPor), precoDe: form.precoDe ? Number(form.precoDe) : null,
      parcelaValor: Number(form.parcelaValor), condicaoPagamento: form.condicaoPagamento,
      setor: form.setor, inicioVigencia: form.inicioVigencia, fimVigencia: form.fimVigencia,
      selo: form.selo, descricao: form.descricao, visivel: false,
    });
  };

  return (
    <div className="flex flex-col gap-5 px-7 py-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div />
        <button
          onClick={onImportarCI}
          className="flex items-center gap-2 bg-[#8b5c9e] text-white font-semibold text-[12px] px-4 py-[10px] rounded-[10px] hover:bg-[#7a4e8a] transition-colors"
        >
          <MessageSquareText size={14} />
          <span className="flex flex-col items-start leading-tight">
            Importar via CI (Excel)
            <span className="font-normal text-[10px] opacity-80">Sobe múltiplas ofertas de uma vez</span>
          </span>
        </button>
      </div>

      <AdminNav onBack={onBack} onHome={onHome} />

      <h1 className="font-bold text-[26px] text-[#2e2e2e] tracking-[-0.52px]">Cadastrar oferta</h1>
      <p className="font-light text-[14px] text-[#606060] -mt-4">
        {ci ? `Adicionando um produto à ${ci.nome}` : 'Preencha os dados do produto para divulgação nas lojas'}
      </p>

      <div className="bg-[#ede0f2] border border-[#8b5c9e] rounded-[10px] px-4 py-3 flex items-center gap-3">
        <span className="font-bold text-[14px] text-[#8b5c9e]">i</span>
        <span className="font-normal text-[13px] text-[#606060]">Todos campos devem ser preenchidos para o envio da oferta</span>
      </div>

      <div className="bg-white border border-[#e8e8e5] rounded-[16px] px-7 py-6 flex flex-col gap-5">
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Nome do produto <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input value={form.nome} onChange={setField('nome')} placeholder={'ex: Smart TV 55" 4K LG'}
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]" />
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Código <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input value={form.codigo} onChange={setField('codigo')} placeholder="ex: 84530206"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]" />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Preço POR <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input type="number" value={form.precoPor} onChange={setField('precoPor')} placeholder="ex: 2499,00"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]" />
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e]">Preço DE</label>
            <input type="number" value={form.precoDe} onChange={setField('precoDe')} placeholder="ex: 2999,00"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]" />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e] flex items-center gap-1">
              Parcela <span className="text-[#c0392b] font-bold">*</span>
            </label>
            <input type="number" value={form.parcelaValor} onChange={setField('parcelaValor')} placeholder="ex: 209,90"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]" />
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e]">Condição de pagamento</label>
            <input value={form.condicaoPagamento} onChange={setField('condicaoPagamento')} placeholder="ex: 25x no Crediário Lebes"
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]" />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e]">Categoria / setor</label>
            <select value={form.setor} onChange={setField('setor')}
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#606060]">
              {SETOR_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
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

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className="font-semibold text-[12px] text-[#2e2e2e]">Selo</label>
            <select value={form.selo} onChange={setField('selo')}
              className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#606060]">
              <option value="">Nenhum</option>
              {SELO_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="font-semibold text-[12px] text-[#2e2e2e]">Descrição do Produto</label>
          <input value={form.descricao} onChange={setField('descricao')} placeholder={'ex: Tela 5"'}
            className="h-10 bg-[#f7f6f2] border border-[#e8e8e5] rounded-[10px] px-[14px] text-[12px] text-[#2e2e2e] placeholder-[#888]" />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onBack}
            className="bg-white border border-[#e8e8e5] text-[#606060] font-medium text-[13px] px-[18px] py-[11px] rounded-[10px] hover:bg-[#f7f6f2] transition-colors">
            Salvar rascunho
          </button>
          <button
            disabled={!filled}
            onClick={handleSubmit}
            className={`font-semibold text-[13px] px-[18px] py-[11px] rounded-[10px] transition-colors ${filled ? 'bg-[#8b5c9e] text-white hover:bg-[#7a4e8a]' : 'bg-[#ddd] text-white cursor-not-allowed'}`}
          >
            Enviar ofertas →
          </button>
        </div>
      </div>
    </div>
  );
}
