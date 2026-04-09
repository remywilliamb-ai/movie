/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useParams,
  useLocation
} from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Search, 
  Plus, 
  Star,
  TrendingUp,
  Clock,
  ArrowLeft,
  Maximize,
  Volume2,
  Settings,
  SkipForward,
  Menu,
  MessageCircle,
  Download,
  Tv,
  Share2
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
  type: 'Movie' | 'Series';
  interpreter: string;
  isNew?: boolean;
  isTrending?: boolean;
}

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  daysAgo: string;
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
    type: 'Movie',
    interpreter: 'John Doe, Jane Smith',
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
    type: 'Series',
    interpreter: 'Alice Brown, Bob White',
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
    type: 'Movie',
    interpreter: 'Charlie Green, Diana Prince',
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
    type: 'Series',
    interpreter: 'Eve Adams, Frank Miller',
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
    type: 'Movie',
    interpreter: 'George King, Helen Troy',
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
    type: 'Series',
    interpreter: 'Ian Wright, Julia Roberts',
    isNew: true,
  }
];

const MOCK_EPISODES: Episode[] = [
  { id: 'e1', title: 'Beaut In Black S3 Ep1 - ROCKY...', thumbnail: 'https://picsum.photos/seed/ep1/200/120', daysAgo: '20 days ago' },
  { id: 'e2', title: 'Beaut In Black S3 Ep2 - ROCKY...', thumbnail: 'https://picsum.photos/seed/ep2/200/120', daysAgo: '15 days ago' },
  { id: 'e3', title: 'Beaut In Black S3 Ep3 - ROCKY...', thumbnail: 'https://picsum.photos/seed/ep3/200/120', daysAgo: '13 days ago' },
  { id: 'e4', title: 'Beaut In Black S3 Ep4 - ROCKY...', thumbnail: 'https://picsum.photos/seed/ep4/200/120', daysAgo: '7 days ago' },
];

// --- Components ---

const Navbar = () => {
  return (
    <nav className="navbar fixed-top">
      <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
        {/* Logo */}
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #7000FF, #00D1FF)' }}>
              <span style={{ color: 'white', fontWeight: '900', fontSize: '1.2rem' }}>N</span>
            </div>
            <span className="text-white fw-black fs-4 tracking-tighter d-none d-sm-block">NOVAPLAY</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="search-container mx-4 d-none d-md-flex">
          <input type="text" className="search-input" placeholder="Search movies, series..." />
          <button className="search-btn">
            <Search size={18} />
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="d-flex align-items-center gap-3">
          <button className="nav-user-btn d-none d-sm-flex">
            <span>Remy</span>
            <MessageCircle size={18} />
          </button>
          <button className="nav-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const MovieCard = ({ movie }: { movie: Movie }) => {
  const navigate = useNavigate();

  return (
    <div className="movie-card-custom p-1" onClick={() => navigate(`/play/${movie.id}`)}>
      <div className="position-relative h-100 w-100 rounded-2 overflow-hidden">
        <img 
          src={movie.thumbnail} 
          alt={movie.title} 
          className="movie-card-img"
          referrerPolicy="no-referrer"
        />
        
        {/* Fixed Labels */}
        <div className="movie-card-type-label">{movie.type}</div>
        
        <div className="movie-card-info-fixed">
          <span className="movie-card-title">{movie.title}</span>
          <div className="movie-card-interpreter">
            {movie.interpreter.split(',')[0]} <br /> {movie.interpreter.split(',')[1] || ''}
          </div>
        </div>

        {/* Hover Overlay with Play Button */}
        <div className="movie-card-overlay">
          <div className="movie-card-play-btn">
            <Play size={24} fill="white" />
          </div>
        </div>
      </div>
    </div>
  );
};

const MovieRow = ({ title, movies, icon: Icon }: { title: string, movies: Movie[], icon: any }) => {
  return (
    <section className="container-fluid px-4 mb-5">
      <h3 className="section-title">
        <div className="accent-dot"></div> {title}
      </h3>
      <div className="movie-row-scroll no-scrollbar">
        {movies.map(movie => (
          <div key={movie.id} className="flex-shrink-0" style={{ width: '220px' }}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Pages ---

const HomePage = () => {
  const featuredMovie = MOCK_MOVIES[0];
  const navigate = useNavigate();

  return (
    <div className="pb-5">
      <header className="hero-section">
        <img 
          src={featuredMovie.backdrop} 
          alt={featuredMovie.title} 
          className="hero-backdrop"
          referrerPolicy="no-referrer"
        />
        <div className="hero-overlay"></div>
        <div className="container-fluid px-4 position-relative z-index-1">
          <div className="row">
            <div className="col-lg-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="genre-tag">Cinematic</span>
                  <span className="text-white-50 small fw-bold">
                    <Star size={14} className="text-info fill-info me-1" /> {featuredMovie.rating}
                  </span>
                  <span className="text-white-50 small fw-bold">{featuredMovie.year}</span>
                  <span className="text-white-50 small fw-bold">{featuredMovie.duration}</span>
                </div>
                <h1 className="display-1 fw-black mb-4 tracking-tighter">
                  {featuredMovie.title.split(' ')[0]} <span style={{ color: '#00D1FF' }}>{featuredMovie.title.split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="lead text-white-50 mb-5 max-w-md" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                  {featuredMovie.description}
                </p>
                <div className="d-flex gap-3">
                  <button 
                    onClick={() => navigate(`/play/${featuredMovie.id}`)}
                    className="btn-nova-primary d-flex align-items-center gap-2"
                  >
                    <Play fill="white" size={20} /> Start Watching
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ marginTop: '-100px' }}>
        <MovieRow title="Trending Now" movies={MOCK_MOVIES} icon={TrendingUp} />
        <MovieRow title="New Releases" movies={MOCK_MOVIES.filter(m => m.isNew)} icon={Clock} />
      </main>
    </div>
  );
};

const PlayPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = MOCK_MOVIES.find(m => m.id === id) || MOCK_MOVIES[0];

  return (
    <div className="player-page-container px-4">
      <div className="row g-5">
        {/* Main Content */}
        <div className="col-lg-9">
          <div className="video-container mb-5">
            <img 
              src={movie.backdrop} 
              alt={movie.title} 
              className="video-placeholder-img"
              referrerPolicy="no-referrer"
            />
            <div className="video-play-icon">
              <Play size={40} fill="currentColor" />
            </div>
            <div className="watch-on-youtube">
              <span>Watch on</span>
              <Play size={14} fill="#00D1FF" />
              <span className="fw-bold">NovaPlayer</span>
            </div>
            
            {/* Overlay Info */}
            <div className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-3">
              <div className="rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', background: 'var(--nova-accent)' }}>
                <Tv size={20} color="black" />
              </div>
              <span className="fw-bold tracking-tight">{movie.title} | 4K Ultra HD | NovaPlay Original</span>
            </div>

            <div className="position-absolute bottom-0 start-0 p-4 d-flex gap-4">
              <Share2 size={22} className="cursor-pointer opacity-75 hover-opacity-100" />
              <Clock size={22} className="cursor-pointer opacity-75 hover-opacity-100" />
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-4 mb-5">
            <div>
              <h2 className="fw-black mb-2" style={{ fontSize: '2.5rem' }}>{movie.title}</h2>
              <div className="d-flex align-items-center gap-3">
                <span className="genre-tag">{movie.genre[0]}</span>
                <span className="text-white-50 small fw-bold">{movie.year} • {movie.duration}</span>
              </div>
            </div>
            <div className="d-flex gap-3">
              <button className="player-action-btn primary">
                <Play size={20} fill="currentColor" /> Watch Full Movie
              </button>
              <button className="player-action-btn">
                <Download size={20} /> Download
              </button>
            </div>
          </div>

          <div className="glass-panel p-4 mb-5">
            <h5 className="fw-bold mb-3 text-info">Synopsis</h5>
            <p className="text-white-50 m-0" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
              {movie.description} Experience the cinematic journey of {movie.title}, a masterpiece that redefines the genre with stunning visuals and a gripping narrative.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-3">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="m-0 fw-bold">Episodes</h5>
              <div className="bg-info rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                <Play size={14} fill="black" className="ms-1" />
              </div>
            </div>

            <div className="sidebar-list">
              {MOCK_EPISODES.map(ep => (
                <div key={ep.id} className="sidebar-episode-card">
                  <img src={ep.thumbnail} alt={ep.title} className="sidebar-episode-thumb" referrerPolicy="no-referrer" />
                  <div className="sidebar-episode-info">
                    <div className="sidebar-episode-title">{ep.title}</div>
                    <div className="sidebar-episode-meta">{ep.daysAgo}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <h6 className="fw-bold mb-3 text-white-50 text-uppercase small">Cast & Crew</h6>
              <p className="small text-white-50">{movie.interpreter}</p>
              <img 
                src={movie.thumbnail} 
                alt="Poster" 
                className="w-100 rounded-4 shadow-lg border border-secondary mt-3" 
                style={{ height: '320px', objectFit: 'cover' }}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050508' }}>
      <div className="atmosphere-bg"></div>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        {children}
      </div>
      
      <footer className="py-5 mt-5 border-top border-secondary" style={{ background: 'rgba(5, 5, 8, 0.9)', backdropFilter: 'blur(10px)' }}>
        <div className="container-fluid px-4">
          <div className="row gy-4">
            <div className="col-md-4">
              <h4 className="fw-black mb-3" style={{ background: 'linear-gradient(135deg, #7000FF, #00D1FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NOVAPLAY</h4>
              <p className="text-white-50 small">Immersive cinematic experiences powered by cutting-edge streaming technology.</p>
            </div>
            <div className="col-6 col-md-2">
              <h6 className="fw-bold mb-3 text-white">Explore</h6>
              <ul className="list-unstyled text-white-50 small">
                <li>Originals</li>
                <li>Trending</li>
                <li>Categories</li>
              </ul>
            </div>
            <div className="col-6 col-md-2">
              <h6 className="fw-bold mb-3 text-white">Legal</h6>
              <ul className="list-unstyled text-white-50 small">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
            <div className="col-md-4 text-md-end">
              <h6 className="fw-bold mb-3 text-white">Connect</h6>
              <div className="d-flex gap-3 justify-content-md-end">
                <div className="rounded-circle p-2" style={{ width: '35px', height: '35px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                <div className="rounded-circle p-2" style={{ width: '35px', height: '35px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                <div className="rounded-circle p-2" style={{ width: '35px', height: '35px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
              </div>
            </div>
          </div>
          <hr className="my-5 border-secondary" style={{ opacity: 0.1 }} />
          <div className="text-center text-white-50 small">
            © 2026 NOVAPLAY ENTERTAINMENT. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play/:id" element={<PlayPage />} />
          <Route path="/tv-shows" element={<div className="p-5 text-center">TV Shows Page</div>} />
          <Route path="/movies" element={<div className="p-5 text-center">Movies Page</div>} />
          <Route path="/new" element={<div className="p-5 text-center">New & Popular Page</div>} />
          <Route path="/my-list" element={<div className="p-5 text-center">My List Page</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}
