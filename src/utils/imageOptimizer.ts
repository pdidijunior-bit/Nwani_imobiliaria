/**
 * HTML5 Canvas Image Optimization Utility
 * Resizes and compresses images to max 960x960px at ~65% JPEG quality.
 */
export async function optimizeImage(file: File | Blob, maxWidth = 800, maxHeight = 800, quality = 0.60): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível inicializar o canvas para compressão"));
          return;
        }

        // Draw image with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG base64 string
        const optimizedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(optimizedDataUrl);
      };
      img.onerror = () => reject(new Error("Falha ao carregar a imagem para otimização"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Falha ao ler o ficheiro"));
    reader.readAsDataURL(file);
  });
}

export async function optimizeImageFiles(files: FileList | File[]): Promise<string[]> {
  const promises = Array.from(files).map((f) => optimizeImage(f));
  return Promise.all(promises);
}
