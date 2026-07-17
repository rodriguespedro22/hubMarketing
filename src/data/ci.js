import { useEffect, useState } from 'react';
import { PRODUCTS } from './products';

const STORAGE_KEY = 'lebes:ci:v1';

const DAY = 24 * 60 * 60 * 1000;
const isoInDays = (n) => new Date(Date.now() + n * DAY).toISOString().slice(0, 10);

let _ofertaSeq = 1000;
const ofertaId = () => `oferta_${++_ofertaSeq}`;
let _ciSeq = 1000;
const ciId = () => `ci_${++_ciSeq}`;

// Monta uma CI nova a partir dos dados do passo 1 do wizard + ofertas já
// resolvidas (revisadas, sem as linhas com erro).
export function makeCI({ nome, material, inicioVigencia, fimVigencia, observacoes, criadoPor, ofertas = [] }) {
  return {
    id: ciId(), nome, material, inicioVigencia, fimVigencia,
    observacoes: observacoes || '', criadoPor: criadoPor || 'Admin Lebes',
    ofertas: ofertas.map(makeOferta),
  };
}

// ── Setor → ícone padrão (usado quando a oferta não tem foto real) ──────────
const SECTOR_ICON = {
  Tecnologia: 'Smartphone',
  Telefonia: 'Smartphone',
  'Móveis': 'Sofa',
  'Linha Branca': 'Refrigerator',
  Moda: 'Shirt',
};

function makeOferta(over) {
  return {
    id: ofertaId(),
    nome: '', codigo: '', precoPor: 0, precoDe: null, parcelaValor: 0,
    condicaoPagamento: '', setor: 'Tecnologia',
    inicioVigencia: isoInDays(0), fimVigencia: isoInDays(7),
    selo: '', descricao: '', visivel: false,
    ...over,
  };
}

// ── Seed — 4 CIs de exemplo, vigências relativas a hoje ──────────────────────
const SEED_CIS = [
  {
    id: 'ci-revista', nome: 'CI da Revista', material: 'Revista de Ofertas',
    inicioVigencia: isoInDays(-6), fimVigencia: isoInDays(6),
    observacoes: '', criadoPor: 'João Lima',
    ofertas: [
      makeOferta({ nome: 'Smart TV 55" 4K LG', codigo: '873994', precoPor: 3899, precoDe: 4399, parcelaValor: 338, condicaoPagamento: '25x no Crediário Lebes', setor: 'Tecnologia', inicioVigencia: isoInDays(-6), fimVigencia: isoInDays(1), visivel: true }),
      makeOferta({ nome: 'Estofado Verona Bressiani', codigo: '841201', precoPor: 1399.9, precoDe: 1799.9, parcelaValor: 119.9, condicaoPagamento: '12x no Crediário Lebes', setor: 'Móveis', inicioVigencia: isoInDays(-6), fimVigencia: isoInDays(8), visivel: true }),
      makeOferta({ nome: 'Galaxy A07 128GB', codigo: '869682', precoPor: 999, precoDe: null, parcelaValor: 103, condicaoPagamento: '15x no Crediário Lebes', setor: 'Tecnologia', inicioVigencia: isoInDays(-2), fimVigencia: isoInDays(5), visivel: true }),
      makeOferta({ nome: 'Lavadora 18kg', codigo: '872891', precoPor: 2399.9, precoDe: null, parcelaValor: 208, condicaoPagamento: '20x no Crediário Lebes', setor: 'Linha Branca', inicioVigencia: isoInDays(1), fimVigencia: isoInDays(9), visivel: false }),
      makeOferta({ nome: 'Tênis Nike Air Max 270', codigo: '90211', precoPor: 649.9, precoDe: null, parcelaValor: 64.99, condicaoPagamento: '10x no Crediário Lebes', setor: 'Moda', inicioVigencia: isoInDays(2), fimVigencia: isoInDays(15), visivel: false }),
      makeOferta({ nome: 'Poltrona Confort', codigo: 'PF8821', precoPor: 1399, precoDe: 1899, parcelaValor: 119.9, condicaoPagamento: '12x no Crediário Lebes', setor: 'Móveis', inicioVigencia: isoInDays(-3), fimVigencia: isoInDays(3), visivel: true }),
    ],
  },
  {
    id: 'ci-fecha-mes', nome: 'CI Fecha Mês', material: 'Fechamento de Mês',
    inicioVigencia: isoInDays(-35), fimVigencia: isoInDays(-30),
    observacoes: '', criadoPor: 'Júlia Pires',
    ofertas: [
      makeOferta({ nome: 'Samsung Galaxy A07', codigo: '869682', precoPor: 999, precoDe: null, parcelaValor: 99.9, condicaoPagamento: '10x no Crediário Lebes', setor: 'Tecnologia', inicioVigencia: isoInDays(-35), fimVigencia: isoInDays(-30) }),
      makeOferta({ nome: 'Roupeiro CB01N565', codigo: '841783', precoPor: 2999, precoDe: 3799.9, parcelaValor: 279, condicaoPagamento: '15x no Crediário Lebes', setor: 'Móveis', inicioVigencia: isoInDays(-35), fimVigencia: isoInDays(-30) }),
    ],
  },
  {
    id: 'ci-telefonia', nome: 'CI Telefonia', material: 'Telefonia',
    inicioVigencia: isoInDays(4), fimVigencia: isoInDays(11),
    observacoes: '', criadoPor: 'Natalia Labres',
    ofertas: [
      makeOferta({ nome: 'iPhone 13 128GB', codigo: '901122', precoPor: 3299, precoDe: 3799, parcelaValor: 274.9, condicaoPagamento: '12x no Crediário Lebes', setor: 'Telefonia', inicioVigencia: isoInDays(4), fimVigencia: isoInDays(11) }),
    ],
  },
  {
    id: 'ci-inverno', nome: 'CI de Inverno', material: 'Campanha de Inverno',
    inicioVigencia: isoInDays(16), fimVigencia: isoInDays(46),
    observacoes: '', criadoPor: 'Vilson',
    ofertas: [
      makeOferta({ nome: 'Sofá Retrátil 3 Lugares', codigo: '812903', precoPor: 1890, precoDe: null, parcelaValor: 157.5, condicaoPagamento: '12x no Crediário Lebes', setor: 'Móveis', inicioVigencia: isoInDays(16), fimVigencia: isoInDays(46) }),
    ],
  },
];

// ── Persistência ──────────────────────────────────────────────────────────
export function loadCIs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : SEED_CIS;
  } catch {
    return SEED_CIS;
  }
}

function saveCIs(cis) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cis)); } catch {}
}

export function useCIStore() {
  const [cis, setCis] = useState(loadCIs);

  useEffect(() => saveCIs(cis), [cis]);

  const addCI = (ci) => setCis(prev => [...prev, ci]);

  const addOfertaToCI = (ciId, oferta) => setCis(prev => prev.map(ci =>
    ci.id === ciId ? { ...ci, ofertas: [...ci.ofertas, makeOferta(oferta)] } : ci
  ));

  const toggleOfertaVisivel = (ciId, ofertaId) => setCis(prev => prev.map(ci =>
    ci.id !== ciId ? ci : {
      ...ci,
      ofertas: ci.ofertas.map(o => o.id === ofertaId ? { ...o, visivel: !o.visivel } : o),
    }
  ));

  const aprovarOferta = (ciId, ofertaId) => setCis(prev => prev.map(ci =>
    ci.id !== ciId ? ci : {
      ...ci,
      ofertas: ci.ofertas.map(o => o.id === ofertaId ? { ...o, visivel: true } : o),
    }
  ));

  return { cis, addCI, addOfertaToCI, toggleOfertaVisivel, aprovarOferta };
}

// ── Status derivado da vigência ──────────────────────────────────────────────
export function getCIStatus(ci) {
  const today = new Date().toISOString().slice(0, 10);
  if (today > ci.fimVigencia) return 'Encerrada';
  if (today < ci.inicioVigencia) return 'Prevista';
  return 'Ativa';
}

export function getOfertaStatus(oferta) {
  const today = new Date().toISOString().slice(0, 10);
  if (today > oferta.fimVigencia) return 'Expirada';
  if (today < oferta.inicioVigencia) return 'Futura';
  return oferta.visivel ? 'Ativa' : 'Pendente';
}

// ── Adaptação para o formato de produto usado pelo canvas ────────────────────
export function ofertaToProduct(oferta) {
  const installmentsMatch = /(\d+)\s*x/i.exec(oferta.condicaoPagamento || '');
  return {
    id: `ci:${oferta.id}`,
    name: oferta.nome,
    brand: 'LEBES',
    code: oferta.codigo,
    iconName: SECTOR_ICON[oferta.setor] || 'ShoppingBag',
    sector: oferta.setor,
    priceOld: oferta.precoDe || undefined,
    priceCash: oferta.precoPor,
    installments: installmentsMatch ? Number(installmentsMatch[1]) : 1,
    installmentValue: oferta.parcelaValor,
  };
}

export function findProductById(id) {
  if (!id) return null;
  if (id.startsWith('ci:')) {
    const ofertaId = id.slice(3);
    for (const ci of loadCIs()) {
      const oferta = ci.ofertas.find(o => o.id === ofertaId);
      if (oferta) return ofertaToProduct(oferta);
    }
    return null;
  }
  return PRODUCTS.find(p => p.id === id) || null;
}

// ── Import de planilha simulado (sem parsing real de arquivo) ────────────────
export function simulateImport() {
  const hoje = isoInDays(0);
  const fim = isoInDays(7);
  return {
    rows: [
      { nome: 'Revista Julho — Capa Eletro', categoria: 'Tecnologia', preco: 2499, inicioVigencia: hoje, fimVigencia: fim, erro: null },
      { nome: 'Revista Julho — Pág. 4', categoria: 'Móveis', preco: 1399.9, inicioVigencia: hoje, fimVigencia: fim, erro: null },
      { nome: 'Revista Julho — Pág. 7', categoria: 'Linha Branca', preco: null, inicioVigencia: hoje, fimVigencia: fim, erro: 'Preço em branco' },
      { nome: 'Revista Julho — Pág. 9', categoria: 'Moda', preco: 649.9, inicioVigencia: null, fimVigencia: null, erro: 'Vigência inválida' },
      { nome: 'Revista Julho — Contracapa', categoria: 'Tecnologia', preco: 999, inicioVigencia: hoje, fimVigencia: fim, erro: null },
    ],
  };
}
