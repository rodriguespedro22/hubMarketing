import { Square } from 'lucide-react';

import { ICONS } from '../../data/icons';

// Elemento independente de ícone — nasce quando um slot de produto é "desagrupado"
// (o ícone do produto vira uma peça solta, arrastável/redimensionável por conta própria).
export default function IconContent({ el }) {
  const Icon = ICONS[el.iconName] || Square;
  const size = Math.min(el.w, el.h) * 0.85;
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <Icon size={size} color={el.color || '#44403c'} strokeWidth={1}
        style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,.15))' }} />
    </div>
  );
}
