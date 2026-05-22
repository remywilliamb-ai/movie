import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '../types';

interface MovieRowProps {
  id: string;
  title: string;
  subtitle?: string;
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  watchlistIds: string[];
  onToggleWatchlist: (movieId: string, e: React.MouseEvent) => void;
}

export default function MovieRow({
  id,
  title,
  subtitle,
  movies,
  onPlay,
  watchlistIds,
  onToggleWatchlist,
}: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Scroll Buttons */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 rounded-full bg-lime-400 animate-pulse"></div>
            <h2 className="text-xl font-black uppercase tracking-wider text-white md:text-2xl">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Custom scroll buttons styled exactly in lime/black as requested */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/80 border border-lime-400/30 hover:bg-lime-400 hover:border-lime-400 transition-all duration-200 focus:outline-none"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 text-lime-400 group-hover:text-black transition-colors" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/80 border border-lime-400/30 hover:bg-lime-400 hover:border-lime-400 transition-all duration-200 focus:outline-none"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 text-lime-400 group-hover:text-black transition-colors" />
          </button>
        </div>
      </div>

      {/* Slider Area */}
      <div className="relative">
        <div
          ref={scrollRef}
          id={id}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-lime-400 scrollbar-track-zinc-900"
          style={{ scrollbarWidth: 'none' }} // hide standard scrollbars
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlay={onPlay}
              isWatchlist={watchlistIds.includes(movie.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
