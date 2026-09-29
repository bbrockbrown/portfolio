// Majority colour of an image: bucket pixels at 4 bits per channel (4096
// buckets), take the most populated bucket, and return the average of the real
// colours in it (so the result isn't snapped to a bucket corner).

const SAMPLE = 32; // images are downscaled to SAMPLE×SAMPLE before counting

/** Majority colour of RGBA pixel data, as `rgb(r, g, b)`; null if fully transparent. */
export function dominantColorFromPixels(data: Uint8ClampedArray): string | null {
  const count = new Uint32Array(4096);
  const sums = new Float64Array(4096 * 3);
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue; // ignore (mostly) transparent pixels
    const key = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
    count[key]++;
    sums[key * 3] += data[i];
    sums[key * 3 + 1] += data[i + 1];
    sums[key * 3 + 2] += data[i + 2];
  }
  let best = -1;
  for (let k = 0; k < count.length; k++) if (count[k] > (best < 0 ? 0 : count[best])) best = k;
  if (best < 0) return null;
  const [r, g, b] = [0, 1, 2].map((c) => Math.round(sums[best * 3 + c] / count[best]));
  return `rgb(${r}, ${g}, ${b})`;
}

/** Loads a CORS-enabled image URL and returns its majority colour. */
export function dominantColor(url: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // needed to read pixels back from the canvas
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = SAMPLE;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE);
      resolve(dominantColorFromPixels(ctx.getImageData(0, 0, SAMPLE, SAMPLE).data));
    };
    img.onerror = reject;
    img.src = url;
  });
}
