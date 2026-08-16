import React from 'react';
import { X, Film } from 'lucide-react';
import { sanitizeEmbedUrl, MONETIZATION_IFRAME_PROPS } from '../utils/playerSanitizer';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string;
  title: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  trailerUrl,
  title,
}) => {
  if (!isOpen) return null;

  // Sanitize trailer URL for standard YouTube/Player embed
  const sanitizedUrl = sanitizeEmbedUrl(trailerUrl, 'youtube');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#121620] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0A0A0E]">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#FF0E25]" />
            <h3 className="text-sm font-bold text-white truncate max-w-md">
              {title} - Official Player / Trailer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Video Frame: 100% In-Site Streaming with zero external redirection */}
        <div className="relative aspect-video w-full bg-black">
          {sanitizedUrl ? (
            <iframe
              src={sanitizedUrl}
              title={`${title} In-Site Player`}
              className="w-full h-full border-0"
              {...MONETIZATION_IFRAME_PROPS}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs font-bold">
              Video player stream unavailable.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
