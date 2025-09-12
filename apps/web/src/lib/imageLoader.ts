export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // Ako je slika sa našeg backend-a, koristi direktno URL bez optimizacije
  if (src.includes('bbrapi.inity.space')) {
    return src;
  }
  
  // Za ostale slike, koristi Vercel optimizaciju
  const params = new URLSearchParams();
  params.set('url', src);
  params.set('w', width.toString());
  if (quality) {
    params.set('q', quality.toString());
  }
  
  return `/_next/image?${params.toString()}`;
}
