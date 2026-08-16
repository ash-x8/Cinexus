import React, { createContext, useContext, useState } from 'react';

export interface ActiveStream {
  movieId: string;
  title: string;
  posterUrl: string;
  streamUrl: string;
  serverName: string;
}

interface PlayerContextType {
  activeStream: ActiveStream | null;
  isPlaying: boolean;
  isMinimized: boolean;
  playStream: (stream: ActiveStream) => void;
  togglePlay: () => void;
  minimizePlayer: () => void;
  expandPlayer: () => void;
  closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStream, setActiveStream] = useState<ActiveStream | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const playStream = (stream: ActiveStream) => {
    setActiveStream(stream);
    setIsPlaying(true);
    setIsMinimized(false);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const minimizePlayer = () => {
    setIsMinimized(true);
  };

  const expandPlayer = () => {
    setIsMinimized(false);
  };

  const closePlayer = () => {
    setActiveStream(null);
    setIsPlaying(false);
    setIsMinimized(false);
  };

  return (
    <PlayerContext.Provider
      value={{
        activeStream,
        isPlaying,
        isMinimized,
        playStream,
        togglePlay,
        minimizePlayer,
        expandPlayer,
        closePlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
