import React from 'react';
import { Play, Star, Film, Tv, Heart, Check } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  key?: React.Key;
  movie: Movie;
  onPlay: (movie: Movie) => void;
  isWatchlist?: boolean;
  onToggleWatchlist?: (movieId: string, e: React.MouseEvent) => void;
  isGrid?: boolean;
}

export default function MovieCard({ movie, onPlay, isWatchlist = false, onToggleWatchlist, isGrid = false }: MovieCardProps) {
  return (
    <div className={`group relative ${isGrid ? 'w-full max-w-[260px]' : 'w-[170px] sm:w-[190px] md:w-[210px] lg:w-[230px] flex-shrink-0'} bg-zinc-950 border border-white/[0.06] rounded-xl overflow-hidden hover:border-lime-400/50 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-lime-400/5 transform hover:-translate-y-1.5`}>
      
      {/* Poster Image Frame */}
      <div className="relative h-[220px] sm:h-[250px] md:h-[280px] overflow-hidden bg-zinc-900">
        <img
          src={movie.img}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600";
          }}
          loading="lazy"
        />

        {/* Gray Hover Film Blur */}
        <div 
          onClick={() => onPlay(movie)}
          className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] cursor-pointer"
        >
          <div className="bg-lime-400 text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Watchlist Quick-Add floating button */}
        {onToggleWatchlist && (
          <button
            onClick={(e) => onToggleWatchlist(movie.id, e)}
            className={`absolute top-2 right-2 p-1.5 rounded-lg border backdrop-blur-md transition-all duration-200 cursor-pointer ${
              isWatchlist
                ? 'bg-lime-400 border-lime-400 text-black hover:bg-lime-500 hover:border-lime-500'
                : 'bg-black/75 border-white/10 text-white hover:text-lime-400 hover:border-lime-400/40'
            }`}
            title={isWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            {isWatchlist ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <Heart className="h-3.5 w-3.5" />}
          </button>
        )}

        {/* Tag Label bottom-left */}
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <span className="bg-black/85 text-lime-400 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-white/[0.04] uppercase tracking-wider">
            {movie.year}
          </span>
        </div>

        {/* Type Icon bottom-right */}
        <div className="absolute bottom-2 right-2 pointer-events-none">
          <span className="bg-black/85 text-gray-200 text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/[0.04] flex items-center gap-1 uppercase tracking-wider">
            {movie.contentType === "series" ? <Tv className="h-2.5 w-2.5 text-lime-400" /> : <Film className="h-2.5 w-2.5 text-lime-400" />}
            {movie.contentType}
          </span>
        </div>
      </div>

      {/* Info Frame */}
      <div className="p-3.5 flex flex-col gap-1 bg-gradient-to-b from-zinc-950 to-black select-none">
        
        {/* Genre & Rating */}
        <div className="flex items-center justify-between">
          <span className="text-lime-400 text-[10px] font-mono uppercase tracking-wider">{movie.type}</span>
          <div className="flex items-center gap-1 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.04]">
            <Star className="text-lime-400 h-3 w-3 fill-current" />
            <span className="text-gray-200 text-[10px] font-bold">{movie.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-1 transition-colors group-hover:text-lime-400 mt-0.5" title={movie.title}>
          {movie.title}
        </h3>

        {/* Play Now Interactive Button */}
        <button
          onClick={() => onPlay(movie)}
          className="mt-2 text-center w-full bg-lime-400 hover:bg-lime-320 text-black font-extrabold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-lime-400/5 hover:scale-[1.02] uppercase tracking-wider cursor-pointer"
        >
          <Play className="h-3 w-3 fill-current" /> Watch Now
        </button>
      </div>
    </div>
  );
}
