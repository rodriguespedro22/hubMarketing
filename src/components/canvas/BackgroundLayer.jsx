import { backgroundToStyle, normalizeBackground } from '../../constants/background';

// Camada de fundo absoluta, renderizada ATRÁS dos elementos da página.
// A opacidade do fundo é aplicada só nesta camada (não nos elementos),
// compositando sobre a base branca da página.
export default function BackgroundLayer({ background }) {
  const b = normalizeBackground(background);
  const op = b.opacity ?? 1;

  // Cor sólida: a camada é a própria cor, com a opacidade aplicada à camada.
  if (b.type === 'color') {
    return (
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: b.value || '#ffffff', opacity: op }} />
    );
  }

  // Gradiente / imagem: usa o estilo derivado e aplica opacidade à camada.
  const style = backgroundToStyle(b);
  return (
    <div className="absolute inset-0 pointer-events-none"
      style={{
        backgroundColor: 'transparent',
        backgroundImage: style.backgroundImage,
        backgroundRepeat: style.backgroundRepeat,
        backgroundSize: style.backgroundSize,
        backgroundPosition: style.backgroundPosition,
        opacity: op,
      }} />
  );
}
