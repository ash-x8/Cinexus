import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Play, Pause, Maximize2, X, Move, Film } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { formatToEmbedUrl } from '../utils/playerSanitizer';

export const FloatingMiniPlayer: React.FC = () => {
  const { activeStream, isPlaying, togglePlay, expandPlayer, closePlayer } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();

  // Position & Dragging State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });

  if (!activeStream) return null;

  // If user is currently on the movie detail page for this activeStream, hide mini-player floating container
  const isCurrentMoviePage = location.pathname === `/movie/${activeStream.movieId}`;
  if (isCurrentMoviePage) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPosition({
      x: dragRef.current.posX + dx,
      y: dragRef.current.posY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleExpand = () => {
    expandPlayer();
    navigate(`/movie/${activeStream.movieId}`);
  };

  const sanitizedUrl = formatToEmbedUrl(activeStream.streamUrl);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="w-80 sm:w-96 rounded-2xl bg-[#0A0A0E]/95 backdrop-blur-2xl border border-[#FF0E25]/50 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden transition-shadow duration-300 group"
    >
      {/* Top Drag & Control Header */}
      <div
        onMouseDown={handleMouseDown}
        className="px-3.5 py-2 bg-gradient-to-r from-[#170305] via-[#C80016]/90 to-[#170305] flex items-center justify-between cursor-move select-none border-b border-white/10"
      >
        <div className="flex items-center gap-2 truncate">
          <Move className="w-3.5 h-3.5 text-rose-300 shrink-0" />
          <Film className="w-3.5 h-3.5 text-[#FF0E25] shrink-0" />
          <span className="text-xs font-extrabold text-white truncate max-w-[160px] sm:max-w-[200px]">
            {activeStream.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleExpand}
            className="p-1 rounded-lg text-gray-200 hover:text-white hover:bg-white/20 transition-colors"
            title="Expand to Full Player"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={closePlayer}
            className="p-1 rounded-lg text-gray-200 hover:text-white hover:bg-white/20 transition-colors"
            title="Close Stream"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mini Video Embed Container */}
      <div className="relative aspect-video w-full bg-black">
        {isPlaying ? (
          <iframe
            key={activeStream.streamUrl}
            src={sanitizedUrl}
            title={`${activeStream.title} Floating Player`}
            className="w-full h-full aspect-video border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="origin-when-cross-origin"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black/90 p-4 text-center space-y-2">
            <p className="text-xs font-bold text-white">Playback Paused</p>
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-[#FF0E25] text-white hover:scale-110 transition-transform shadow-lg"
            >
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="px-3.5 py-2 bg-[#121620] flex items-center justify-between text-xs text-gray-300 border-t border-white/5">
        <span className="text-[10px] text-rose-300 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          {activeStream.serverName || 'Live Stream'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="px-2.5 py-1 rounded-lg bg-[#FF0E25]/20 hover:bg-[#FF0E25] text-rose-300 hover:text-white font-extrabold text-[11px] flex items-center gap-1 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" /> Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
