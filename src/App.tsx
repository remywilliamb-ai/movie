/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Info, 
  Plus, 
  Search, 
  Bell, 
  User, 
  ChevronRight, 
  Star,
  TrendingUp,
  Clock,
  Film
} from 'lucide-react';

// --- Types ---

interface Movie {
  id: string;
  title: string;
  description: string;
  rating: number;
  year: number;
  duration: string;
  genre: string[];
  thumbnail: string;
  backdrop: string;
  isNew?: boolean;
  isTrending?: boolean;
}

// --- Mock Data ---

const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'The Crimson Shadow',
    description: 'In a world where light is a luxury, one rebel discovers a secret that could change everything. A thrilling journey through the underworld.',
    rating: 4.8,
    year: 2024,
    duration: '2h 15m',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    thumbnail: 'https://picsum.photos/seed/movie1/400/600',
    backdrop: 'https://picsum.photos/seed/movie1-bg/1920/1080',
    isTrending: true,
    isNew: true,
  },
  {
    id: '2',
    title: 'Midnight Protocol',
    description: 'A cybersecurity expert is framed for a global outage. Now she must outrun the very systems she helped build.',
    rating: 4.5,
    year: 2023,
    duration: '1h 58m',
    genre: ['Thriller', 'Crime'],
    thumbnail: 'https://picsum.photos/seed/movie2/400/600',
    backdrop: 'https://picsum.photos/seed/movie2-bg/1920/1080',
    isTrending: true,
  },
  {
    id: '3',
    title: 'Beyond the Horizon',
    description: 'The first manned mission to another star system takes an unexpected turn when they encounter a cosmic anomaly.',
    rating: 4.9,
    year: 2024,
    duration: '2h 45m',
    genre: ['Sci-Fi', 'Adventure'],
    thumbnail: 'https://picsum.photos/seed/movie3/400/600',
    backdrop: 'https://picsum.photos/seed/movie3-bg/1920/1080',
    isNew: true,
  },
  {
    id: '4',
    title: 'Urban Legends',
    description: 'A group of friends explores abandoned locations, only to find that some legends are rooted in terrifying reality.',
    rating: 4.2,
    year: 2023,
    duration: '1h 42m',
    genre: ['Horror', 'Mystery'],
    thumbnail: 'https://picsum.photos/seed/movie4/400/600',
    backdrop: 'https://picsum.photos/seed/movie4-bg/1920/1080',
  },
  {
    id: '5',
    title: 'The Last Stand',
    description: 'A retired soldier is forced back into action when his village is threatened by a ruthless mercenary group.',
    rating: 4.6,
    year: 2024,
    duration: '2h 10m',
    genre: ['Action', 'Drama'],
    thumbnail: 'https://picsum.photos/seed/movie5/400/600',
    backdrop: 'https://picsum.photos/seed/movie5-bg/1920/1080',
    isTrending: true,
  },
  {
    id: '6',
    title: 'Neon Nights',
    description: 'In a cyberpunk future, a detective investigates a series of murders linked to a new virtual reality drug.',
    rating: 4.7,
    year: 2024,
    duration: '2h 05m',
    genre: ['Sci-Fi', 'Noir'],
    thumbnail: 'https://picsum.photos/seed/movie6/400/600',
    backdrop: 'https://picsum.photos/seed/movie6-bg/1920/1080',
    isNew: true,
  }
];

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-brand-black/90 backdrop-blur-md py-3 shadow-2xl' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black tracking-tighter text-brand-red flex items-center gap-2"
          >
            FAT<span className="text-white">MOVIE</span>
          </motion.h1>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            {['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].map((item) => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-brand-red transition-colors" />
          <Bell className="w-5 h-5 cursor-pointer hover:text-brand-red transition-colors" />
          <div className="w-8 h-8 rounded bg-brand-red flex items-center justify-center cursor-pointer">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ movie, onInfoClick }: { movie: Movie, onInfoClick: (m: Movie) => void }) => {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img 
          src={movie.backdrop} 
          alt={movie.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl space-y-6"
        >
          <div className="flex items-center gap-3">
            {movie.isNew && (
              <span className="px-2 py-0.5 bg-brand-red text-[10px] font-bold uppercase tracking-widest rounded">New</span>
            )}
            <span className="text-sm font-semibold text-gray-400 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {movie.rating}
            </span>
            <span className="text-sm font-semibold text-gray-400">{movie.year}</span>
            <span className="text-sm font-semibold text-gray-400">{movie.duration}</span>
          </div>
          
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            {movie.title.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "text-brand-red" : ""}>{word} </span>
            ))}
          </h2>
          
          <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
            {movie.description}
          </p>

          <div className="flex items-center gap-4 pt-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-white text-brand-black font-bold rounded-full hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
            >
              <Play className="w-5 h-5 fill-current" /> Play Now
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onInfoClick(movie)}
              className="flex items-center gap-2 px-8 py-4 bg-brand-dark/80 backdrop-blur-md text-white font-bold rounded-full border border-white/10 hover:bg-brand-dark transition-colors"
            >
              <Info className="w-5 h-5" /> More Info
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const MovieCard = ({ movie, onClick }: { movie: Movie, onClick?: () => void }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
      className="relative group cursor-pointer flex-shrink-0 w-48 md:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl"
    >
      <img 
        src={movie.thumbnail} 
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Play className="w-4 h-4 text-brand-black fill-current" />
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-dark/80 border border-white/20 flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-dark/80 border border-white/20 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="font-bold text-sm md:text-base line-clamp-1">{movie.title}</h3>
          <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-400">
            <span className="text-green-500">{movie.rating * 20}% Match</span>
            <span>{movie.year}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {movie.genre.slice(0, 2).map(g => (
              <span key={g} className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MovieRow = ({ title, movies, icon: Icon, onMovieClick }: { title: string, movies: Movie[], icon?: any, onMovieClick?: (m: Movie) => void }) => {
  return (
    <div className="space-y-4 py-8">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          {Icon && <Icon className="w-6 h-6 text-brand-red" />}
          {title}
        </h3>
        <button className="text-sm font-semibold text-gray-400 hover:text-white transition-colors flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-6 overflow-x-auto px-6 md:px-[calc((100vw-80rem)/2+1.5rem)] no-scrollbar pb-4 scroll-smooth">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0">
            <MovieCard movie={movie} onClick={() => onMovieClick?.(movie)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [featuredMovie] = useState(MOCK_MOVIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredMovies = searchQuery 
    ? MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-brand-black selection:bg-brand-red">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isSearchOpen ? 'bg-brand-black' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-5">
          <div className="flex items-center gap-10">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-black tracking-tighter text-brand-red flex items-center gap-2 cursor-pointer"
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
            >
              FAT<span className="text-white">MOVIE</span>
            </motion.h1>
            {!isSearchOpen && (
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                {['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].map((item) => (
                  <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 transition-all duration-300 ${isSearchOpen ? 'w-64 md:w-96' : 'w-10'}`}>
              <Search 
                className="w-5 h-5 cursor-pointer hover:text-brand-red transition-colors flex-shrink-0" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
              {isSearchOpen && (
                <input 
                  autoFocus
                  type="text"
                  placeholder="Titles, people, genres..."
                  className="bg-transparent border-none outline-none text-sm w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              )}
            </div>
            <Bell className="w-5 h-5 cursor-pointer hover:text-brand-red transition-colors" />
            <div className="w-8 h-8 rounded bg-brand-red flex items-center justify-center cursor-pointer">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </nav>
      
      <main className="pb-20">
        <AnimatePresence mode="wait">
          {isSearchOpen && searchQuery ? (
            <motion.div
              key="search-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-32 px-6 max-w-7xl mx-auto min-h-screen"
            >
              <h2 className="text-2xl font-bold mb-8 text-gray-400">Search results for: <span className="text-white">"{searchQuery}"</span></h2>
              {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredMovies.map(movie => (
                    <div key={movie.id} onClick={() => setSelectedMovie(movie)}>
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Search className="w-16 h-16 mb-4 opacity-20" />
                  <p>No results found for "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="home-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero movie={featuredMovie} onInfoClick={setSelectedMovie} />
              
              <div className="relative z-10 -mt-20 space-y-4">
                <MovieRow 
                  title="Continue Watching" 
                  movies={MOCK_MOVIES.slice(1, 4)} 
                  onMovieClick={setSelectedMovie}
                />

                {watchlist.length > 0 && (
                  <MovieRow 
                    title="My List" 
                    movies={MOCK_MOVIES.filter(m => watchlist.includes(m.id))} 
                    icon={Plus}
                    onMovieClick={setSelectedMovie}
                  />
                )}

                <MovieRow 
                  title="Trending Now" 
                  movies={MOCK_MOVIES.filter(m => m.isTrending)} 
                  icon={TrendingUp}
                  onMovieClick={setSelectedMovie}
                />
                
                <MovieRow 
                  title="New Releases" 
                  movies={MOCK_MOVIES.filter(m => m.isNew)} 
                  icon={Clock}
                  onMovieClick={setSelectedMovie}
                />

                <MovieRow 
                  title="Action Packed" 
                  movies={MOCK_MOVIES.filter(m => m.genre.includes('Action'))} 
                  icon={Film}
                  onMovieClick={setSelectedMovie}
                />
                
                <MovieRow 
                  title="Sci-Fi & Fantasy" 
                  movies={MOCK_MOVIES.filter(m => m.genre.includes('Sci-Fi'))} 
                  onMovieClick={setSelectedMovie}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Movie Detail Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"
              onClick={() => setSelectedMovie(null)}
            />
            <motion.div
              layoutId={`movie-${selectedMovie.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-brand-dark rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button 
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-brand-black/50 backdrop-blur-md flex items-center justify-center hover:bg-brand-red transition-colors"
                onClick={() => setSelectedMovie(null)}
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>

              <div className="relative h-64 md:h-96">
                <img 
                  src={selectedMovie.backdrop} 
                  alt={selectedMovie.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter">{selectedMovie.title}</h2>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-brand-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                      <Play className="w-5 h-5 fill-current" /> Play
                    </button>
                    <button 
                      onClick={() => toggleWatchlist(selectedMovie.id)}
                      className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-colors ${watchlist.includes(selectedMovie.id) ? 'bg-brand-red border-brand-red' : 'bg-brand-black/50 hover:bg-white/10'}`}
                    >
                      {watchlist.includes(selectedMovie.id) ? <ChevronRight className="w-6 h-6 rotate-90" /> : <Plus className="w-6 h-6" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <span className="text-green-500">{selectedMovie.rating * 20}% Match</span>
                    <span className="text-gray-400">{selectedMovie.year}</span>
                    <span className="px-1.5 py-0.5 border border-gray-600 text-[10px] text-gray-400 rounded">HD</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedMovie.description}
                  </p>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-gray-500">Genres:</span>
                    <p className="text-gray-300">{selectedMovie.genre.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="text-gray-300">{selectedMovie.duration}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="bg-brand-dark py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h4 className="text-brand-red font-black text-xl">FATMOVIE</h4>
              <p className="text-sm text-gray-500">The ultimate destination for premium streaming content.</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-sm">Company</h5>
              <ul className="text-sm text-gray-500 space-y-1">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-sm">Support</h5>
              <ul className="text-sm text-gray-500 space-y-1">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-sm">Connect</h5>
              <ul className="text-sm text-gray-500 space-y-1">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
            © 2026 FAT MOVIE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
