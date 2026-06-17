export const PRODUCTS = [
  { id: 'p1', name: 'Smart TV 55"', brand: 'TCL', code: '873994', iconName: 'Tv', sector: 'eletro', priceOld: 4399, priceCash: 3899, installments: 20, installmentValue: 338 },
  { id: 'p2', name: 'Galaxy A07 128GB', brand: 'SAMSUNG', code: '869682', iconName: 'Smartphone', sector: 'eletro', priceCash: 999, installments: 15, installmentValue: 103 },
  { id: 'p3', name: 'Roupeiro CB01N565', brand: 'KAPPESBERG', code: '841783', iconName: 'Sofa', sector: 'eletro', priceOld: 3799.9, priceCash: 2999, installments: 15, installmentValue: 279 },
  { id: 'p4', name: 'Lavadora 18kg', brand: 'ELECTROLUX', code: '872891', iconName: 'Refrigerator', sector: 'eletro', priceCash: 2399.9, installments: 20, installmentValue: 208 },
  { id: 'p5', name: 'Aparelho de Jantar', brand: 'FRATELLI', code: 'AP259', iconName: 'Utensils', sector: 'eletro', priceOld: 259.9, priceCash: 169.9, installments: 10, installmentValue: 16.99 },
  { id: 'p12', name: 'Poltrona Confort', brand: 'ESTOFE', code: 'PF8821', iconName: 'Armchair', sector: 'eletro', priceOld: 1899, priceCash: 1399, installments: 12, installmentValue: 119.9 },
  { id: 'p6', name: 'Jaqueta Feminina', brand: 'ENFIM', code: '32841', iconName: 'Shirt', sector: 'moda', priceCash: 319, installments: 10, installmentValue: 31.99 },
  { id: 'p7', name: 'Blusão de Tricô', brand: 'COSTÃO', code: '78211', iconName: 'Shirt', sector: 'moda', priceCash: 99.9, installments: 10, installmentValue: 9.99 },
  { id: 'p8', name: 'Bolsa Tiracolo', brand: 'CHENSON', code: 'BT9941', iconName: 'ShoppingBag', sector: 'moda', priceCash: 99.9, installments: 10, installmentValue: 9.99 },
  { id: 'p9', name: 'Relógio Feminino', brand: 'CONDOR', code: 'RC340', iconName: 'Watch', sector: 'moda', priceCash: 349.9, installments: 10, installmentValue: 34.99 },
  { id: 'p10', name: 'Calça Térmica', brand: 'LUPO', code: '47821', iconName: 'Footprints', sector: 'moda', priceCash: 79.9, installments: 10, installmentValue: 7.99 },
  { id: 'p11', name: 'Bolsa de Mão', brand: 'CHENSON', code: 'BT4302', iconName: 'ShoppingBag', sector: 'moda', priceCash: 189.9, installments: 10, installmentValue: 18.99 },
];

export const SECTORS = [
  { id: 'all', label: 'Todos' },
  { id: 'eletro', label: 'Eletromóveis' },
  { id: 'moda', label: 'Moda' },
];

// Formatos de revista (proporções reais convertidas pra px em tela; 1mm ≈ 2.66px @72dpi)
// O usuário escolhe um formato ao criar a revista; vale para todas as páginas.
