/**
 * Direct Browser Download Engine
 * Handles dynamic native browser downloads for direct files (Telegram, MP4, MKV)
 * without opening blank tabs, and safely handles PPD host fallbacks.
 */

const PPD_DOMAINS = [
  'katfile.com',
  'up-4ever.com',
  'up4ever.net',
  'filecrypt.cc',
  'rapidgator.net',
  'uploadgig.com',
  'ddownload.com',
  'nitroflare.com',
  'turbobit.net'
];

/**
 * Checks if a given URL is hosted on a Pay-Per-Download (PPD) provider.
 */
export function isPpdUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return PPD_DOMAINS.some(domain => lower.includes(domain));
}

/**
 * Main Download Dispatcher
 * @param url Target download URL
 * @param title Title of the movie or file for naming
 * @param quality Quality badge (e.g. 1080p, 720p, Telegram)
 * @param onMetricsIncrement Callback to update live download stats
 */
export function executeDownload({
  url,
  title,
  quality,
  onMetricsIncrement
}: {
  url: string;
  title: string;
  quality?: string;
  onMetricsIncrement?: () => void;
}): { success: boolean; isPpd: boolean; message: string } {
  if (!url || url === '#' || url.startsWith('#download')) {
    // Demo fallback for sample links
    if (onMetricsIncrement) onMetricsIncrement();
    return {
      success: true,
      isPpd: false,
      message: `Direct download simulation triggered for ${title} (${quality || 'HD'}).`
    };
  }

  if (onMetricsIncrement) {
    onMetricsIncrement();
  }

  const isPpd = isPpdUrl(url);

  if (isPpd) {
    // Dynamic PPD Fallback: open in new background tab safely
    window.open(url, '_blank', 'noopener,noreferrer');
    return {
      success: true,
      isPpd: true,
      message: `Opening PPD download host for ${title}...`
    };
  }

  // Direct Browser Fetch Download Handler
  // Prevents blank tabs and triggers native browser file download manager
  const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanTitle}_${quality || 'HD'}_CINEXUS.mp4`;

  // Method 1: Check if it's a Telegram direct link or HTTP direct download
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Try dynamic anchor with download attribute first
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    a.target = '_self'; // Strictly no blank tab
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 1000);

    return {
      success: true,
      isPpd: false,
      message: `Native browser download initiated for ${title} (${quality || 'HD'})`
    };
  }

  return {
    success: false,
    isPpd: false,
    message: 'Invalid download URL'
  };
}
