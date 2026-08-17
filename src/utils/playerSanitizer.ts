/**
 * Automatic URL Sanitizer & Iframe Formatter Engine
 * Converts raw streaming video URLs into clean, responsive embedded iframe URLs
 * supporting EarnVids, FileMoon, StreamHG, Streamtape, Doodstream, Facebook, and YouTube.
 */

const SAMPLE_YOUTUBE_IDS = new Set([
  'd9MyW72ELq0',
  'Way9Dexny3w',
  'mqqft2x_Aa4',
  'yQEondeGvKo',
  'zSWdZVtXT7E',
  'a9tq0aS5Zu8'
]);

/**
 * Format and convert standard streaming file links into direct embed URLs.
 * Converts EarnVids (/v/, /d/ -> /e/), FileMoon (/d/, /v/ -> /e/), StreamHG (/e/), etc.
 */
export function formatToEmbedUrl(url: string, serverType?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const lowerUrl = trimmed.toLowerCase();

  // 1. YouTube Trailer / Embed
  if (
    serverType === 'youtube' ||
    lowerUrl.includes('youtube.com') ||
    lowerUrl.includes('youtu.be')
  ) {
    let videoId = '';
    if (trimmed.includes('youtu.be/')) {
      videoId = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('#')[0] || '';
    } else if (trimmed.includes('youtube.com/embed/')) {
      videoId = trimmed.split('youtube.com/embed/')[1]?.split('?')[0]?.split('#')[0] || '';
    } else if (trimmed.includes('v=')) {
      const match = trimmed.match(/[?&]v=([^&]+)/);
      if (match) videoId = match[1];
    } else {
      const parts = trimmed.replace(/\/$/, '').split('?')[0].split('#')[0].split('/');
      videoId = parts[parts.length - 1];
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // 2. EarnVids Engine
  // Convert /v/ or /d/ or view links to /e/ embed format (e.g. https://earnvids.com/v/xyz123 -> https://earnvids.com/e/xyz123)
  if (
    serverType === 'earnvids' ||
    lowerUrl.includes('earnvids')
  ) {
    let id = '';
    const earnMatch = trimmed.match(/(?:earnvids\.(?:com|net|io|to|so))\/(?:v|e|d)?\/?([a-zA-Z0-9_-]+)/i);
    if (earnMatch && earnMatch[1]) {
      id = earnMatch[1];
    } else {
      const parts = trimmed.replace(/\/$/, '').split('?')[0].split('#')[0].split('/');
      id = parts[parts.length - 1];
    }

    if (id) {
      if (SAMPLE_YOUTUBE_IDS.has(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
      if (!['earnvids.com', 'earnvids.net', 'earnvids.io', 'e', 'v', 'd'].includes(id.toLowerCase())) {
        return `https://earnvids.com/e/${id}`;
      }
    }
  }

  // 3. FileMoon Engine
  // Convert /d/ or /v/ to /e/ embed format (e.g. https://filemoon.sx/d/abc456 -> https://filemoon.sx/e/abc456)
  if (
    serverType === 'filemoon' ||
    lowerUrl.includes('filemoon')
  ) {
    let id = '';
    const fmMatch = trimmed.match(/(?:filemoon\.(?:sx|top|in|to|link|ef|lat|me|club))\/(?:v|e|d)?\/?([a-zA-Z0-9_-]+)/i);
    if (fmMatch && fmMatch[1]) {
      id = fmMatch[1];
    } else {
      const parts = trimmed.replace(/\/$/, '').split('?')[0].split('#')[0].split('/');
      id = parts[parts.length - 1];
    }

    if (id) {
      if (SAMPLE_YOUTUBE_IDS.has(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
      if (!['filemoon.sx', 'filemoon.top', 'filemoon.in', 'e', 'v', 'd'].includes(id.toLowerCase())) {
        return `https://filemoon.sx/e/${id}`;
      }
    }
  }

  // 4. StreamHG / HGCloud / Audinifer Engine
  // Ensure formatted properly to /e/ embed endpoint
  if (
    serverType === 'streamhg' ||
    lowerUrl.includes('streamhg') ||
    lowerUrl.includes('hgcloud') ||
    lowerUrl.includes('audinifer') ||
    lowerUrl.includes('hglink')
  ) {
    let id = '';
    const hgMatch = trimmed.match(/(?:streamhg\.(?:com|to)|hgcloud\.to|audinifer\.com|hglink\.to)\/(?:v|e)?\/?([a-zA-Z0-9_-]+)/i);
    if (hgMatch && hgMatch[1]) {
      id = hgMatch[1];
    } else {
      const parts = trimmed.replace(/\/$/, '').split('?')[0].split('#')[0].split('/');
      id = parts[parts.length - 1];
    }

    if (id) {
      if (SAMPLE_YOUTUBE_IDS.has(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
      if (!['streamhg.com', 'streamhg.to', 'hgcloud.to', 'audinifer.com', 'hglink.to', 'e', 'v'].includes(id.toLowerCase())) {
        return `https://hgcloud.to/e/${id}`;
      }
    }
  }

  // Fallback pattern replacement if serverType was generic
  if (lowerUrl.includes('/v/') || lowerUrl.includes('/d/')) {
    if (lowerUrl.includes('earnvids.')) {
      return trimmed.replace(/\/(v|d)\//i, '/e/');
    }
    if (lowerUrl.includes('filemoon.')) {
      return trimmed.replace(/\/(v|d)\//i, '/e/');
    }
    if (lowerUrl.includes('streamhg.') || lowerUrl.includes('hgcloud.')) {
      return trimmed.replace(/\/v\//i, '/e/');
    }
  }

  // 5. Streamtape Engine
  if (
    serverType === 'streamtape' ||
    lowerUrl.includes('streamtape') ||
    lowerUrl.includes('streamta.pe')
  ) {
    let id = '';
    const stMatch = trimmed.match(/(?:streamtape\.(?:com|to|net|xyz|site|club)|streamta\.pe)\/(?:v|e)?\/?([a-zA-Z0-9_-]+)/i);
    if (stMatch && stMatch[1]) {
      id = stMatch[1];
    } else {
      const parts = trimmed.replace(/\/$/, '').split('?')[0].split('#')[0].split('/');
      id = parts[parts.length - 1];
    }

    if (id) {
      if (SAMPLE_YOUTUBE_IDS.has(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
      if (!['streamtape.com', 'streamtape', 'streamta.pe', 'e', 'v'].includes(id.toLowerCase())) {
        return `https://streamtape.com/e/${id}`;
      }
    }
  }

  // 6. Doodstream Engine
  if (
    serverType === 'doodstream' ||
    lowerUrl.includes('dood')
  ) {
    let id = '';
    const doodMatch = trimmed.match(/(?:dood\.(?:so|to|watch|wf|la)|doodstream\.(?:com|co))\/(?:v|e|d)?\/?([a-zA-Z0-9_-]+)/i);
    if (doodMatch && doodMatch[1]) {
      id = doodMatch[1];
    } else {
      const parts = trimmed.replace(/\/$/, '').split('?')[0].split('#')[0].split('/');
      id = parts[parts.length - 1];
    }

    if (id) {
      if (SAMPLE_YOUTUBE_IDS.has(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
      if (!['dood.so', 'doodstream.com', 'e', 'v', 'd'].includes(id.toLowerCase())) {
        return `https://dood.so/e/${id}`;
      }
    }
  }

  // 7. Facebook Video Player
  if (
    serverType === 'facebook' ||
    lowerUrl.includes('facebook.com') ||
    lowerUrl.includes('fb.watch')
  ) {
    if (trimmed.includes('facebook.com/plugins/video.php')) {
      return trimmed;
    }
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=false&width=560`;
  }

  return trimmed;
}

export function sanitizeEmbedUrl(url: string, serverType?: string): string {
  return formatToEmbedUrl(url, serverType);
}

/**
 * Standard Iframe Props Helper to ensure video playback permissions & security policy sync
 */
/**
 * Standard Iframe Props Helper for streaming hosts.
 * Note: External hosts like EarnVids, FileMoon, and StreamHG explicitly block
 * iframes that contain `sandbox` attributes ("Sandboxed embed is not allowed!").
 * Thus, sandbox attribute is excluded for unsandboxed video streaming support.
 */
export const MONETIZATION_IFRAME_PROPS = {
  allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
  allowFullScreen: true,
  frameBorder: '0',
  referrerPolicy: 'origin-when-cross-origin' as const,
};
