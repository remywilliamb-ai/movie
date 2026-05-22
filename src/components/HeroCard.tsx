import React from 'react';
import { Play, Tv, Film } from 'lucide-react';
import { Movie } from '../types';

interface HeroCardProps {
  movie: Movie;
  position?: 'front' | 'back-left' | 'back-right';
  isHovered?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  onPlay: (movie: Movie) => void;
  isMobile?: boolean;
}

export default function HeroCard({
  movie,
  position = 'front',
  isHovered = false,
  onHover,
  onLeave,
  onPlay,
  isMobile = false,
}: HeroCardProps) {
  const cardWidth = isMobile ? 140 : 210;
  const cardHeight = isMobile ? 195 : 290;
  const cornerRadius = 14;

  const getStyle = () => {
    if (position === 'back-left') {
      return {
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        transform: `translateX(${isMobile ? '-50px' : '-110px'}) translateY(${isMobile ? '-25px' : '-55px'}) rotate(${isMobile ? '-2deg' : '-5deg'})`,
        filter: isHovered ? 'brightness(1)' : 'brightness(0.4) blur(1px)',
        transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      };
    }
    if (position === 'back-right') {
      return {
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        transform: `translateX(${isMobile ? '50px' : '110px'}) translateY(${isMobile ? '-25px' : '-55px'}) rotate(${isMobile ? '2deg' : '5deg'})`,
        filter: isHovered ? 'brightness(1)' : 'brightness(0.4) blur(1px)',
        transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      };
    }
    return {
      width: `${cardWidth}px`,
      height: `${cardHeight}px`,
      transform: isHovered ? 'scale(1.05) translateY(-5px)' : 'translateY(0)',
      filter: 'brightness(1)',
      transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
    };
  };

  return (
    <div
      onClick={() => onPlay(movie)}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`
        relative cursor-pointer select-none
        ${position === 'front' ? 'z-30 shadow-2xl shadow-black/80' : 'z-10 shadow-lg'}
        ${isHovered ? 'z-40' : ''}
      `}
      style={getStyle()}
    >
      <div
        className="relative h-full w-full overflow-hidden bg-zinc-950 border border-white/[0.06] group"
        style={{
          borderRadius: `${cornerRadius}px`,
        }}
      >
        <img
          src={movie?.img || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600'}
          alt={movie?.title}
          className="h-full w-full object-cover transition-transform duration-750 ease-out group-hover:scale-108"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600';
          }}
        />

        {/* Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

        {/* Play Button Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[3px] transition-all duration-300 ${
            position === 'front'
              ? 'opacity-0 group-hover:opacity-100'
              : isHovered
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 text-black shadow-lg shadow-lime-400/40 transform scale-90 group-hover:scale-105 transition-all duration-305">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Status Tag */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-black/75 border border-white/[0.08] text-lime-400 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
            {movie?.interpreter || 'FEATURED'}
          </span>
        </div>

        {/* Media Tag */}
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-lime-400/90 text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
            {movie?.contentType === 'series' ? (
              <Tv className="h-3 w-3" />
            ) : (
              <Film className="h-3 w-3" />
            )}
            {movie?.contentType || 'MOVIE'}
          </span>
        </div>

        {/* Title Tag */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
          <h3 className="text-white font-bold text-xs sm:text-sm text-center line-clamp-1">
            {movie?.title}
          </h3>
          <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest mt-0.5 font-mono">
            {movie?.type} • {movie?.year}
          </p>
        </div>
      </div>
    </div>
  );
}
