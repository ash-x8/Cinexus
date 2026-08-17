/**
 * Automatic URL Sanitizer & Iframe Formatter Engine
 * Converts raw streaming video URLs into clean, responsive embedded iframe URLs
 * supporting StreamHG, EarnVids, FileMoon, Streamtape, Doodstream, Facebook Free Data, and YouTube.
 */

// Known sample/default YouTube IDs used in seed data to ensure smooth fallback playback
const SAMPLE_YOUTUBE_IDS = new Set([
  'd9MyW72ELq0',
  'Way9Dexny3w',
  'mqqft2x_Aa4',
  'yQEondeGvKo',
  'zSWdZVtXT7E',
  'a9tq0aS5Zu8'
]);

/**
 * Helper utility function to convert standard view/download video links
 * (e.g. /v/, /d/) to proper iframe embed endpoints (/e/).
 */
export function formatToEmbedUrl(url: string, serverType?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const lowerUrl = trimmed.toLowerCase();

  // EarnVids link conversion
  if (serverType === 'earnvids' || lowerUrl.includes('earnvids')) {
    let id = '';
    const earnMatch = trimmed.match(/(?:earnvids\.(?:com|net|io|to|so))\/(?:v|e|d)?\/?([a-zA-Z0-9_-]+)/i);
    if (earnMatch && earnMatch[1]) {
      id = earnMatch[1];
    } else {
      const parts = trimmed.replace(/\/$/, '').split('?')[0].split('#')[0].split('/');
      id = parts[parts.length - 1];
    }
    if (id && !['earnvids.com', 'earnvids.net', 'earnvids.io', 'e', 'v', 'd'].includes(id.toLowerCase())) {
      if (SAMPLE_YOUTUBE_IDS.has(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
      return `https://earnvids.com/e/${id}`;
    }
  }

  // FileMoon link conversion
  if (serverType === 'filemoon' || lowerUrl.includes('filemoon')) {
    let id = '';
    const fmMatch = trimmed.match(/(?:filemoon\.(?:sx|top|in|to|link|ef|lat|me|club))\/(?:v|e|d)?\/?([a-zA-Z0-9_-]+)/i);
    if (fmMatch && fmMatch[1]) {
      id = fmMatch[1];
    } else {
      const parts = trimmed.replace(/\/$/, '').split('?')[0].split('#')[0].split('/');
      id = parts[parts.length - 1];
    }
    if (id && !['filemoon.sx', 'filemoon.top', 'filemoon.in', 'e', 'v', 'd'].includes(id.toLowerCase())) {
      if (SAMPLE_YOUTUBE_IDS.has(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
      return `https://filemoon.sx/e/${id}`;
    }
  }

  // StreamHG / HGCloud / Audinifer link conversion
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
    if (id && !['streamhg.com', 'streamhg.to', 'hgcloud.to', 'audinifer.com', 'hglink.to', 'e', 'v'].includes(id.toLowerCase())) {
      if (SAMPLE_YOUTUBE_IDS.has(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
      return `https://hgcloud.to/e/${id}`;
    }
  }

  return sanitizeEmbedUrl(trimmed, serverType);
}

export function sanitizeEmbedUrl(url: string, serverType?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const lowerUrl = trimmed.toLowerCase();

  // 1. YouTube Trailer / Embed (Prioritize direct YouTube URLs or youtube serverType)
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

  // 2. StreamHG / HGCloud / Audinifer Engine
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

  // 3. EarnVids Engine
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

  // 4. FileMoon Engine
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

/**
 * Standard Iframe Props Helper to ensure monetization sync across StreamHG, Doodstream, etc.
 */
export const MONETIZATION_IFRAME_PROPS = {
  allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; cross-origin-isolated',
  allowFullScreen: true,
  frameBorder: '0',
  referrerPolicy: 'origin-when-cross-origin' as const,
};
