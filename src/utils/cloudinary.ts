export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
  import.meta.env.CLOUDINARY_CLOUD_NAME ||
  'stmbdocy';

export const CLOUDINARY_API_KEY =
  import.meta.env.VITE_CLOUDINARY_API_KEY ||
  import.meta.env.CLOUDINARY_API_KEY ||
  '428348967296846';

/**
 * Uploads an image file to Cloudinary CDN and returns the secure public image URL.
 * Falls back to unsigned upload preset or signed REST API call if necessary.
 */
export async function uploadToCloudinary(file: File | Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  try {
    let res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      // Retry with unsigned fallback preset
      const retryData = new FormData();
      retryData.append('file', file);
      retryData.append('upload_preset', 'unsigned');

      res = await fetch(endpoint, {
        method: 'POST',
        body: retryData,
      });
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Cloudinary upload failed with status ${res.status}`);
    }

    const data = await res.json();
    return data.secure_url || data.url;
  } catch (err: any) {
    console.error('Cloudinary Image Upload Error:', err);
    throw err;
  }
}
