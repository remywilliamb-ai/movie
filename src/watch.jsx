import React, { useRef, useEffect } from 'react';
import { ArrowLeft, ShieldAlert, Volume2, BadgeInfo } from 'lucide-react';

export default function Watch({ movie, onBack }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Scroll to top when watch page is mounted
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log('Autoplay blocked:', err));
    }
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 animate-fade-in font-sans">
      {/* Top action bar */}
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full border-b border-neutral-900 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-sm font-semibold transition-all duration-200 cursor-pointer text-neutral-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Details
        </button>
        <div className="flex items-center gap-2 animate-pulse">
          <span className="h-2 w-2 rounded-full bg-lime-400"></span>
          <span className="text-xs font-mono text-neutral-400 font-bold uppercase tracking-wider">
            Streaming: 2160p UHD
          </span>
        </div>
      </div>

      {/* Main player box */}
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col gap-6">
        <div className="aspect-video w-full rounded-2xl bg-zinc-950 border border-neutral-850 shadow-2xl overflow-hidden relative group">
          <video
            ref={videoRef}
            src={movie.videoUrl}
            poster={movie.backdropUrl || movie.img}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
          <div className="absolute top-4 left-4 bg-black/85 border border-neutral-800 rounded-lg px-3 py-1.5 text-[10px] font-mono text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none pointer-events-none flex items-center gap-2">
            <ShieldAlert className="h-3 w-3 text-lime-400" />
            SECURE CINEMA FEED • AT DATA ENCRYPTION ENABLED
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-zinc-950 border border-neutral-900 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-lime-400 text-black text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                {movie.interpreter || 'DIRECT FEED'}
              </span>
              <span className="text-neutral-500 text-xs">•</span>
              <span className="text-neutral-400 text-xs font-mono font-bold tracking-tight">
                {movie.year} • {movie.runtime || 'N/A'} • {movie.contentType || 'Feature'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white">
              {movie.title}
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed font-medium">
              {movie.plot || movie.description || 'Enjoy premium ad-free streaming on FastMovie.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0 self-start">
            <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-850 space-y-1.5">
              <span className="text-[10px] font-mono font-black text-lime-400 uppercase tracking-widest block">
                Playback Status
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <Volume2 className="h-4 w-4 text-lime-400" />
                Dolby Audio Atmos Surround
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <BadgeInfo className="h-4 w-4 text-neutral-500" />
                Bitrate: ~18.5 Mbps
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
