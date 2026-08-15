import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-2xl glass-card overflow-hidden h-full flex flex-col justify-between">
      <div className="aspect-[2/3] relative bg-gray-800/50 animate-shimmer" />
      <div className="p-3.5 space-y-2 bg-[#12151e]">
        <div className="h-4 bg-gray-800 rounded animate-shimmer w-3/4" />
        <div className="h-3 bg-gray-800/60 rounded animate-shimmer w-1/2" />
        <div className="pt-2 flex justify-between">
          <div className="h-3 bg-gray-800/40 rounded animate-shimmer w-12" />
          <div className="h-3 bg-gray-800/40 rounded animate-shimmer w-16" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonHero: React.FC = () => {
  return (
    <div className="w-full aspect-[21/9] min-h-[350px] rounded-3xl bg-gray-800/40 animate-shimmer relative overflow-hidden p-8 flex items-end">
      <div className="space-y-4 max-w-xl w-full">
        <div className="h-6 bg-gray-700/60 rounded-lg w-1/3 animate-shimmer" />
        <div className="h-10 bg-gray-700/80 rounded-xl w-3/4 animate-shimmer" />
        <div className="h-4 bg-gray-700/50 rounded-lg w-full animate-shimmer" />
        <div className="h-10 bg-gray-700/70 rounded-xl w-40 animate-shimmer" />
      </div>
    </div>
  );
};
