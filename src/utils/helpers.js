let _id = 1000;

export const uid = () => `el_${++_id}`;
export const fmt = (n) => Number(n).toFixed(2).replace('.', ',');
export const splitMoney = (n) => { const [i, d] = Number(n).toFixed(2).split('.'); return { int: i, dec: d }; };
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Lê um arquivo de imagem e devolve { src, w, h } já redimensionado para um
// tamanho máximo, evitando estourar a cota do localStorage com data URLs gigantes.
export const readImageScaled = (file, maxDim = 1400) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = (ev) => {
    const img = new Image();
    img.onerror = reject;
    img.onload = () => {
      let { width, height } = img;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      // PNG preserva transparência (importante para recortes de produto).
      const hasAlpha = /png|webp|gif/i.test(file.type);
      const src = hasAlpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.85);
      resolve({ src, w: width, h: height });
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// ============================================================
// STARTER TEMPLATES (geram conjuntos de elementos)
// ============================================================
