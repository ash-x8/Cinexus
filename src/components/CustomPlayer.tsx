import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Subtitles,
  Server,
  Film,
  Sparkles,
  Tv,
  RefreshCw,
  AlertCircle,
  Scan,
  Monitor,
  StretchHorizontal
} from 'lucide-react';
import { formatToEmbedUrl } from '../utils/playerSanitizer';

export type ScreenFitMode = 'auto' | 'screen' | '16-9' | '21-9' | 'cover';

export interface CustomPlayerProps {
  src: string;
  title: string;
  posterUrl?: string;
  logoUrl?: string;
  serverName?: string;
  serverType?: string;
  qualityBadge?: string;
  subtitleUrl?: string;
  availableServers?: { id: string; name: string; url: string; serverType?: string }[];
  activeServerId?: string;
  onServerChange?: (serverId: string) => void;
  onTheaterToggle?: (isTheater: boolean) => void;
  isTheaterMode?: boolean;
}

/**
 * Extracts a pure video source URL if an HTML <iframe> snippet or raw embed code is provided.
 * Uses regex: src=["']([^"']+)["']
 */
export function extractVideoUrl(rawInput: string): string {
  if (!rawInput || typeof rawInput !== 'string') return '';
  const trimmed = rawInput.trim();

  // Match src="..." or src='...' inside <iframe> tags or general HTML
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1].trim();
  }

  return trimmed;
}

/**
 * Detects if a URL is a direct HTML5 playable video stream (mp4, webm, ogg, direct stream)
 * vs an external iframe embed provider.
 */
export function isDirectVideoSource(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const extracted = extractVideoUrl(url);
  const lower = extracted.toLowerCase();

  // Explicit video extensions
  if (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.ogg') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.m4v') ||
    lower.includes('.mp4?') ||
    lower.includes('.webm?') ||
    lower.includes('.m3u8')
  ) {
    return true;
  }

  // Common direct video CDNs and storage endpoints
  if (
    (lower.includes('cloudinary.com') && lower.includes('/video/upload/')) ||
    lower.includes('storage.googleapis.com') ||
    lower.includes('s3.amazonaws.com') ||
    lower.includes('supabase.co/storage/v1/object/public/videos') ||
    lower.includes('blob:') ||
    lower.includes('data:video')
  ) {
    return true;
  }

  return false;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const CustomPlayer: React.FC<CustomPlayerProps> = ({
  src,
  title,
  posterUrl,
  logoUrl = '/logo.png',
  serverName = 'Primary Server',
  serverType = 'generic',
  qualityBadge = 'HD',
  subtitleUrl,
  availableServers = [],
  activeServerId,
  onServerChange,
  onTheaterToggle,
  isTheaterMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Playback state for HTML5 direct video
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showFitMenu, setShowFitMenu] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(Boolean(subtitleUrl));
  const [loadError, setLoadError] = useState(false);

  // Dynamic Video Screen Size & Aspect Ratio Fit state
  const [videoNaturalAspect, setVideoNaturalAspect] = useState<number | null>(null);
  const [screenFitMode, setScreenFitMode] = useState<ScreenFitMode>('auto');

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanSrc = extractVideoUrl(src);
  const isDirect = isDirectVideoSource(cleanSrc);

  // Reset error and aspect ratio when src changes
  useEffect(() => {
    setLoadError(false);
    setIsBuffering(false);
    setVideoNaturalAspect(null);
  }, [src]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Controls auto-hide timer
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
        setShowFitMenu(false);
      }, 3500);
    }
  };

  // Video event handlers
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(e => console.warn('Playback error', e));
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (videoRef.current.buffered.length > 0) {
      setBufferedEnd(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setLoadError(false);
    setIsBuffering(false);

    // Calculate natural video aspect ratio for exact screen fit
    if (videoRef.current.videoWidth && videoRef.current.videoHeight) {
      const naturalAspect = videoRef.current.videoWidth / videoRef.current.videoHeight;
      setVideoNaturalAspect(naturalAspect);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pos * duration;
    setCurrentTime(pos * duration);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);
  };

  const handleProgressMouseLeave = () => {
    setHoverTime(null);
  };

  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    videoRef.current.volume = clamped;
    if (clamped === 0) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } else {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const changeSpeed = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn('Fullscreen error:', e);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP error', e);
    }
  };

  // Keyboard shortcut controller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }
      if (!containerRef.current?.contains(document.activeElement) && document.activeElement !== document.body) {
        return;
      }

      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        skipTime(10);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        skipTime(-10);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(volume + 0.1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(volume - 0.1);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, volume, isMuted, duration]);

  const sanitizedEmbedUrl = !isDirect && src ? formatToEmbedUrl(src, serverType) : '';

  // Determine dynamic container aspect ratio and height classes based on screenFitMode & isTheaterMode
  const getContainerSizingStyles = (): { className: string; style?: React.CSSProperties } => {
    if (isFullscreen) {
      return { className: 'w-screen h-screen max-w-none max-h-none rounded-none border-0' };
    }

    if (isTheaterMode) {
      return { className: 'w-full aspect-[21/9] min-h-[420px] max-h-[85vh]' };
    }

    switch (screenFitMode) {
      case 'screen':
        // Maximize fit to screen viewport while maintaining full visibility
        return { className: 'w-full h-[65vh] sm:h-[75vh] md:h-[82vh] max-h-[880px]' };
      case '21-9':
        return { className: 'w-full aspect-[21/9] max-h-[80vh]' };
      case '16-9':
        return { className: 'w-full aspect-video max-h-[80vh]' };
      case 'cover':
        return { className: 'w-full aspect-video max-h-[80vh]' };
      case 'auto':
      default:
        if (videoNaturalAspect && isDirect) {
          return {
            className: 'w-full max-h-[82vh]',
            style: { aspectRatio: `${videoNaturalAspect}` }
          };
        }
        return { className: 'w-full aspect-video max-h-[82vh]' };
    }
  };

  const sizing = getContainerSizingStyles();

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false);
          setShowSpeedMenu(false);
          setShowFitMenu(false);
        }
      }}
      style={sizing.style}
      className={`relative overflow-hidden bg-[#050608] rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl group select-none transition-all duration-300 ${sizing.className}`}
    >
      {/* 1. DIRECT HTML5 VIDEO PLAYER WITH CUSTOM CINEXUS UI */}
      {isDirect ? (
        <>
          <video
            ref={videoRef}
            src={cleanSrc}
            poster={posterUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => {
              setIsBuffering(false);
              setIsPlaying(true);
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              setLoadError(true);
              setIsBuffering(false);
            }}
            onClick={togglePlay}
            className={`w-full h-full cursor-pointer transition-all duration-300 ${
              screenFitMode === 'cover' ? 'object-cover' : 'object-contain'
            }`}
            playsInline
          >
            {subtitleUrl && subtitlesEnabled && (
              <track src={subtitleUrl} kind="subtitles" srcLang="si" label="Sinhala Subtitle" default />
            )}
          </video>

          {/* Center Play/Pause Large Pulse Button (Shown when paused or initial) */}
          {!isPlaying && !isBuffering && !loadError && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer group/center"
            >
              <button
                aria-label="Play Video"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#FF0E25] via-[#E10B1E] to-[#C80016] text-white flex items-center justify-center shadow-2xl shadow-[#FF0E25]/60 transform transition-all duration-300 group-hover/center:scale-110 active:scale-95 border-2 border-white/20"
              >
                <Play className="w-9 h-9 sm:w-10 sm:h-10 fill-white ml-1.5 drop-shadow-md" />
              </button>
              <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-black shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#FF0E25] animate-ping" />
                <span>Click to Play</span>
              </div>
            </div>
          )}

          {/* Buffering Spinner with Logo Badge */}
          {isBuffering && !loadError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[3px] space-y-3">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-[#FF0E25] border-t-transparent animate-spin" />
                <img
                  src={logoUrl}
                  alt="CINEXUS Logo"
                  className="absolute w-8 h-8 object-contain animate-pulse"
                />
              </div>
              <p className="text-xs font-extrabold text-white tracking-wider animate-pulse flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF0E25]" /> Buffering Stream...
              </p>
            </div>
          )}

          {/* Error Recovery State */}
          {loadError && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0A0A0E]/95 p-6 text-center space-y-3">
              <AlertCircle className="w-12 h-12 text-[#FF0E25] animate-pulse" />
              <p className="text-sm font-extrabold text-white">Stream Playback Interrupted</p>
              <p className="text-xs text-gray-400 max-w-sm">
                The video stream could not be loaded directly. You can retry playback or switch to an alternate streaming server.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setLoadError(false);
                    videoRef.current?.load();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-90"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry Stream
                </button>
                {availableServers.length > 1 && onServerChange && (
                  <button
                    onClick={() => {
                      const next = availableServers.find(s => s.id !== activeServerId);
                      if (next) onServerChange(next.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20"
                  >
                    Switch Server
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Top Brand Header & Movie Title (Fades in/out with controls) */}
          <div
            className={`absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-3 truncate max-w-[70%]">
              {/* Logo in top header */}
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 shadow-md shrink-0">
                <img
                  src={logoUrl}
                  alt="CINEXUS Logo"
                  className="h-5 sm:h-6 w-auto object-contain drop-shadow"
                />
                <span className="px-1.5 py-0.5 rounded-md bg-[#FF0E25] text-white font-black text-[9px] uppercase tracking-wider hidden sm:inline-block">
                  CINEXUS
                </span>
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-white truncate drop-shadow-md">
                {title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-rose-300 font-bold text-[10px] sm:text-xs flex items-center gap-1.5 shadow">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {serverName} • {qualityBadge}
              </span>
            </div>
          </div>

          {/* User Brand Logo Watermark Overlay (Prominent, Elegant & Non-Intrusive) */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-80 hover:opacity-100 transition-opacity flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 shadow-2xl">
            <img
              src={logoUrl}
              alt="CINEXUS Brand Logo"
              className="h-6 sm:h-7 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,14,37,0.5)]"
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-black tracking-wider text-white leading-none drop-shadow">
                CINEXUS
              </span>
              <span className="text-[8px] font-extrabold text-[#FF0E25] uppercase tracking-tighter leading-tight">
                සිනෙක්ස්
              </span>
            </div>
          </div>

          {/* Bottom Custom Controls Bar */}
          <div
            className={`absolute bottom-0 inset-x-0 z-30 p-3 sm:p-4 pt-12 bg-gradient-to-t from-black/95 via-black/75 to-transparent space-y-2.5 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Custom Interactive Seekbar */}
            <div
              ref={progressBarRef}
              onClick={handleSeek}
              onMouseMove={handleProgressMouseMove}
              onMouseLeave={handleProgressMouseLeave}
              className="relative w-full h-2 bg-white/20 hover:h-3 rounded-full cursor-pointer transition-all group/bar"
            >
              {/* Buffer progress */}
              <div
                style={{ width: `${duration ? (bufferedEnd / duration) * 100 : 0}%` }}
                className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
              />

              {/* Played progress */}
              <div
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF0E25] to-rose-500 rounded-full shadow-lg shadow-[#FF0E25]/50 flex items-center justify-end"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md transform scale-0 group-hover/bar:scale-100 transition-transform" />
              </div>

              {/* Hover Timestamp Preview */}
              {hoverTime !== null && (
                <div
                  style={{ left: `${hoverPosition}%` }}
                  className="absolute bottom-4 -translate-x-1/2 px-2 py-1 bg-black/90 border border-white/20 rounded-md text-[10px] font-bold text-white whitespace-nowrap shadow-lg pointer-events-none"
                >
                  {formatTime(hoverTime)}
                </div>
              )}
            </div>

            {/* Bottom Button Row */}
            <div className="flex items-center justify-between text-white text-xs">
              {/* Left Controls (Play, Replay, Forward, Volume, Time) */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 sm:p-2 rounded-xl text-white hover:text-[#FF0E25] hover:bg-white/10 transition-colors"
                  title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  )}
                </button>

                <button
                  onClick={() => skipTime(-10)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Rewind 10s (Left Arrow)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => skipTime(10)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Forward 10s (Right Arrow)"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Volume slider control */}
                <div className="flex items-center gap-1.5 group/vol">
                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-[#FF0E25]" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-14 sm:w-20 h-1 bg-white/30 accent-[#FF0E25] rounded-lg cursor-pointer transition-all"
                  />
                </div>

                {/* Timestamp */}
                <div className="text-[10px] sm:text-[11px] font-semibold text-gray-300 pl-1 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-gray-500 mx-1">/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right Controls (Screen Size Fit, Speed, Subtitles, Theater, PiP, Fullscreen) */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Screen Size / Aspect Ratio Fit Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowFitMenu(!showFitMenu);
                      setShowSpeedMenu(false);
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-colors ${
                      screenFitMode !== 'auto'
                        ? 'bg-[#FF0E25]/20 text-[#FF0E25] border border-[#FF0E25]/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="Fit Video to Screen Size & Aspect Ratio"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {screenFitMode === 'auto' && 'Auto Fit'}
                      {screenFitMode === 'screen' && 'Fit Screen'}
                      {screenFitMode === '16-9' && '16:9'}
                      {screenFitMode === '21-9' && '21:9'}
                      {screenFitMode === 'cover' && 'Fill Screen'}
                    </span>
                  </button>

                  {showFitMenu && (
                    <div className="absolute bottom-9 right-0 bg-[#0A0A0E]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-2xl space-y-1 z-40 min-w-[170px]">
                      <div className="px-2 py-1 text-[10px] font-black uppercase text-gray-400 border-b border-white/10 mb-1">
                        Screen Size & Video Fit
                      </div>
                      {[
                        { id: 'auto', label: 'Auto (Video Ratio)', desc: 'Matches exact video dimensions', icon: Monitor },
                        { id: 'screen', label: 'Fit to Screen', desc: 'Maximizes viewport height', icon: Scan },
                        { id: '16-9', label: '16:9 Standard HD', desc: 'Standard widescreen ratio', icon: Tv },
                        { id: '21-9', label: '21:9 Cinema Scope', desc: 'Ultra-wide cinematic ratio', icon: Film },
                        { id: 'cover', label: 'Fill / Crop Fit', desc: 'Eliminates all black bars', icon: StretchHorizontal },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setScreenFitMode(item.id as ScreenFitMode);
                            setShowFitMenu(false);
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-xl text-left transition-colors flex items-start gap-2 ${
                            screenFitMode === item.id
                              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white font-extrabold shadow'
                              : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          <item.icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-[11px] leading-tight font-bold">{item.label}</span>
                            <span className="text-[9px] text-gray-400 leading-tight">{item.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Playback Speed Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowSpeedMenu(!showSpeedMenu);
                      setShowFitMenu(false);
                    }}
                    className="px-2 py-1 rounded-lg text-[11px] font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="Playback Speed"
                  >
                    {playbackSpeed}x
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute bottom-9 right-0 bg-[#0A0A0E]/95 backdrop-blur-md border border-white/15 rounded-xl p-1.5 shadow-2xl space-y-1 z-40 min-w-[75px]">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => changeSpeed(s)}
                          className={`w-full px-2 py-1 rounded-lg text-left text-[11px] font-bold transition-colors ${
                            playbackSpeed === s ? 'bg-[#FF0E25] text-white' : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtitle Toggle */}
                {Boolean(subtitleUrl) && (
                  <button
                    onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      subtitlesEnabled
                        ? 'text-cyan-300 bg-cyan-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    title="Toggle Sinhala Subtitles"
                  >
                    <Subtitles className="w-4 h-4" />
                  </button>
                )}

                {/* Picture in Picture */}
                {document.pictureInPictureEnabled && (
                  <button
                    onClick={togglePiP}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
                    title="Picture in Picture"
                  >
                    <Tv className="w-4 h-4" />
                  </button>
                )}

                {/* Theater Mode Toggle */}
                {onTheaterToggle && (
                  <button
                    onClick={() => onTheaterToggle(!isTheaterMode)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isTheaterMode
                        ? 'text-[#FF0E25] bg-[#FF0E25]/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="Toggle Theater Mode"
                  >
                    <Film className="w-4 h-4" />
                  </button>
                )}

                {/* Fullscreen Toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* 2. EMBED PLAYER (STREAMHG, EARNVIDS, FILEMOON, YOUTUBE) IN FULL-SIZE 16:9 RESPONSIVE CONTAINER */
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          {/* Iframe Playback Body with Full 16:9 Responsive Fill */}
          {sanitizedEmbedUrl ? (
            <iframe
              key={src}
              src={sanitizedEmbedUrl}
              title={`${title} CINEXUS Player`}
              className="w-full h-full absolute inset-0 border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="origin-when-cross-origin"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-3 bg-[#0A0A0E]">
              <img
                src={logoUrl}
                alt="CINEXUS Logo"
                className="w-12 h-12 object-contain opacity-50 mb-1"
              />
              <Film className="w-10 h-10 text-[#FF0E25] animate-pulse" />
              <p className="text-sm font-extrabold text-white">Stream Initializing</p>
              <p className="text-xs text-[#9E9EA0] max-w-sm">
                Please select an active streaming server above to begin playback.
              </p>
            </div>
          )}

          {/* Floating Subtle Top Overlay Info Bar (Fades out when playing/idle) */}
          <div
            className={`absolute top-0 inset-x-0 z-20 p-2.5 sm:p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-none transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-center gap-2 truncate max-w-[65%] pointer-events-auto">
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-white/15 shrink-0 shadow">
                <img
                  src={logoUrl}
                  alt="CINEXUS Logo"
                  className="h-4 sm:h-5 w-auto object-contain drop-shadow"
                />
                <span className="px-1.5 py-0.5 rounded bg-[#FF0E25] text-white font-black text-[8px] sm:text-[9px] uppercase tracking-wider">
                  CINEXUS
                </span>
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-white truncate drop-shadow">
                {title}
              </span>
            </div>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              <span className="px-2 py-0.5 sm:py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-rose-300 font-bold text-[9px] sm:text-xs flex items-center gap-1 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {serverName}
              </span>

              {onTheaterToggle && (
                <button
                  onClick={() => onTheaterToggle(!isTheaterMode)}
                  className={`p-1 sm:p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                    isTheaterMode
                      ? 'bg-[#FF0E25] text-white border-[#FF0E25]'
                      : 'bg-black/70 backdrop-blur-md text-gray-300 border-white/15 hover:text-white'
                  }`}
                  title="Toggle Theater Mode"
                >
                  <Film className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* User Brand Logo Watermark Overlay for Embed Streaming (Top-Right Subtle Corner Badge) */}
          <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-10 pointer-events-none opacity-70 sm:opacity-85 hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10 shadow-lg">
            <img
              src={logoUrl}
              alt="CINEXUS Brand Logo"
              className="h-4 sm:h-5 w-auto object-contain drop-shadow"
            />
            <span className="text-[10px] font-black tracking-wider text-white leading-none">
              CINEXUS
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
