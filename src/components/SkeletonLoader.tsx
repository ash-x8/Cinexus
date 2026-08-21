import React from 'react';

/**
 * Shimmering skeleton loader for an individual Movie Card.
 * Matches the visual hierarchy, aspect ratio [2/3], and glassmorphism styling of MovieCard.tsx.
 */
export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-2xl glass-card overflow-hidden flex flex-col justify-between h-full border border-white/5 bg-[#121620]">
      {/* Poster Aspect Ratio Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[#0A0A0E] animate-shimmer">
        {/* Top Badges Placeholder */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
          <div className="h-5 w-12 rounded-lg bg-white/10" />
          <div className="h-5 w-14 rounded-lg bg-white/10" />
        </div>

        {/* Center Hover Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <div className="w-10 h-10 rounded-full bg-white/10" />
        </div>

        {/* Bottom Banner Placeholder */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="h-4 w-16 rounded bg-white/10" />
          <div className="h-4 w-10 rounded bg-white/10" />
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-3 sm:p-3.5 space-y-2 bg-[#121620] flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Sinhala Sub / Dub Badge */}
          <div className="h-3.5 w-20 rounded-md bg-white/10 animate-shimmer" />
          {/* Main English Title */}
          <div className="h-4 w-4/5 rounded-md bg-white/15 animate-shimmer" />
          {/* Sinhala Title */}
          <div className="h-3 w-3/5 rounded-md bg-white/10 animate-shimmer" />
        </div>

        {/* Footer Meta Row */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <div className="h-3 w-12 rounded bg-white/10 animate-shimmer" />
          <div className="h-3 w-16 rounded bg-white/10 animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

/**
 * Shimmering skeleton grid for movie catalog pages.
 */
interface SkeletonGridProps {
  count?: number;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={`skel_card_${idx}`} />
      ))}
    </div>
  );
};

/**
 * Shimmering skeleton for the homepage Featured Hero Slider.
 */
export const SkeletonHero: React.FC = () => {
  return (
    <div className="relative w-full aspect-[21/9] min-h-[360px] sm:min-h-[420px] rounded-3xl bg-[#121620] border border-white/10 overflow-hidden p-6 sm:p-10 flex items-end animate-shimmer">
      <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/60 to-transparent" />
      
      {/* Hero Content Elements */}
      <div className="relative z-10 space-y-4 max-w-2xl w-full">
        {/* Featured Tag */}
        <div className="h-6 w-32 rounded-xl bg-white/15" />

        {/* Title */}
        <div className="space-y-2">
          <div className="h-8 sm:h-12 w-3/4 rounded-2xl bg-white/20" />
          <div className="h-5 sm:h-7 w-1/2 rounded-xl bg-white/15" />
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="h-6 w-14 rounded-lg bg-white/10" />
          <div className="h-6 w-16 rounded-lg bg-white/10" />
          <div className="h-6 w-20 rounded-lg bg-white/10" />
          <div className="h-6 w-24 rounded-lg bg-white/10" />
        </div>

        {/* Synopsis lines */}
        <div className="space-y-2 pt-1">
          <div className="h-3.5 w-full rounded bg-white/10" />
          <div className="h-3.5 w-4/5 rounded bg-white/10" />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <div className="h-11 w-36 rounded-xl bg-[#FF0E25]/40" />
          <div className="h-11 w-32 rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
};

/**
 * Shimmering skeleton for the MovieDetailPage view.
 */
export const SkeletonMovieDetail: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <div className="h-9 w-28 rounded-xl bg-[#121620] border border-white/10 animate-shimmer" />
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded-xl bg-[#121620] border border-white/10 animate-shimmer" />
          <div className="h-9 w-24 rounded-xl bg-[#121620] border border-white/10 animate-shimmer" />
        </div>
      </div>

      {/* Video Player Section Container */}
      <div className="space-y-3">
        {/* Main Player Box */}
        <div className="relative w-full aspect-video rounded-3xl bg-[#121620] border border-white/10 overflow-hidden flex items-center justify-center animate-shimmer shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <div className="w-6 h-6 rounded bg-white/20" />
          </div>

          {/* Top Player Watermark / Server Bar */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div className="h-6 w-28 rounded-lg bg-white/10" />
            <div className="h-6 w-20 rounded-lg bg-white/10" />
          </div>

          {/* Bottom Player Control Bar */}
          <div className="absolute bottom-4 left-4 right-4 h-10 rounded-xl bg-black/60 backdrop-blur-md flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-white/20" />
              <div className="h-3 w-16 rounded bg-white/20" />
            </div>
            <div className="h-2 flex-1 mx-6 rounded-full bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-white/20" />
              <div className="h-4 w-4 rounded bg-white/20" />
            </div>
          </div>
        </div>

        {/* Server Selection Bar */}
        <div className="p-3 rounded-2xl bg-[#121620] border border-white/10 flex items-center justify-between gap-3 animate-shimmer">
          <div className="flex gap-2 overflow-x-auto">
            <div className="h-8 w-28 rounded-xl bg-white/15" />
            <div className="h-8 w-28 rounded-xl bg-white/10" />
            <div className="h-8 w-28 rounded-xl bg-white/10" />
          </div>
          <div className="h-8 w-24 rounded-xl bg-white/10" />
        </div>
      </div>

      {/* Main Details Card (Poster + Info) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121620] border border-white/10 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Poster */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="aspect-[2/3] rounded-2xl bg-[#0A0A0E] border border-white/10 overflow-hidden animate-shimmer" />
          </div>

          {/* Right Info */}
          <div className="md:col-span-8 lg:col-span-9 space-y-4">
            <div className="space-y-2">
              <div className="h-7 sm:h-9 w-3/4 rounded-xl bg-white/20 animate-shimmer" />
              <div className="h-5 w-1/2 rounded-lg bg-white/15 animate-shimmer" />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="h-6 w-16 rounded-lg bg-white/10 animate-shimmer" />
              <div className="h-6 w-20 rounded-lg bg-white/10 animate-shimmer" />
              <div className="h-6 w-14 rounded-lg bg-white/10 animate-shimmer" />
              <div className="h-6 w-24 rounded-lg bg-white/10 animate-shimmer" />
            </div>

            {/* Synopsis Paragraph */}
            <div className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/5 space-y-2">
              <div className="h-4 w-full rounded bg-white/10 animate-shimmer" />
              <div className="h-4 w-5/6 rounded bg-white/10 animate-shimmer" />
              <div className="h-4 w-4/6 rounded bg-white/10 animate-shimmer" />
            </div>

            {/* Spec Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#0A0A0E] border border-white/5 space-y-1.5 animate-shimmer">
                  <div className="h-3 w-12 rounded bg-white/10" />
                  <div className="h-4 w-20 rounded bg-white/15" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Download Links Section Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121620] border border-white/10 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="h-6 w-48 rounded-xl bg-white/20 animate-shimmer" />
          <div className="h-4 w-24 rounded bg-white/10 animate-shimmer" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/5 space-y-3 animate-shimmer">
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 rounded bg-white/15" />
                <div className="h-4 w-12 rounded bg-white/10" />
              </div>
              <div className="h-3 w-3/4 rounded bg-white/10" />
              <div className="h-9 w-full rounded-xl bg-[#FF0E25]/30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
