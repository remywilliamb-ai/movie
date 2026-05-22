import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Film, 
  Tv, 
  Heart, 
  Sparkles, 
  Search, 
  Star, 
  ArrowLeft, 
  Send, 
  Plus, 
  Check, 
  User, 
  Clock, 
  AlertCircle,
  Clapperboard,
  Trash2,
  Calendar,
  ThumbsUp,
  Shield,
  Users,
  Eye,
  MessageSquare,
  LogOut,
  Menu,
  X,
  BarChart3,
  Lock,
  Tag,
  Cpu,
  Volume2,
  Subtitles,
  Share2,
  Copy,
  Download,
  ArrowRight,
  PlusCircle,
  CheckCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroCard from './components/HeroCard';
import MovieRow from './components/MovieRow';
import MovieCard from './components/MovieCard';
import Watch from './watch';
import { Movie, UserComment, WatchlistItem } from './types';

// Custom interfaces for Admin Users & Stats
interface AdminUser {
  id: string;
  userName: string;
  email: string;
  joinedDate: string;
  status: 'Active' | 'Suspended';
  role: string;
}

interface AdminStats {
  totalMovies: number;
  totalSeries: number;
  totalUsers: number;
  activeCommenters: number;
  totalComments: number;
  avgRating: number;
}

export default function App() {
  // Page States: 'home' | 'movies' | 'series' | 'play' | 'admin' | 'watch'
  const [activePage, setActivePage] = useState<'home' | 'movies' | 'series' | 'play' | 'admin' | 'watch'>('home');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [comments, setComments] = useState<UserComment[]>([]);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Panel Subpage: 'dashboard' | 'movies' | 'series' | 'users' | 'comments'
  const [adminSubPage, setAdminSubPage] = useState<'dashboard' | 'movies' | 'series' | 'users' | 'comments' | 'add-form'>('dashboard');
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [adminUser, setAdminUser] = useState<string | null>(localStorage.getItem('adminUser'));
  
  // Admin Login Inputs
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  // Admin Data Pools
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalMovies: 0,
    totalSeries: 0,
    totalUsers: 0,
    activeCommenters: 0,
    totalComments: 0,
    avgRating: 8.8
  });
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [allComments, setAllComments] = useState<UserComment[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Admin Movie Editor Form state
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [editMovieId, setEditMovieId] = useState<string | null>(null); // Null means creating
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('Sci-Fi');
  const [formContentType, setFormContentType] = useState<'movie' | 'series'>('movie');
  const [formYear, setFormYear] = useState('2026');
  const [formRuntime, setFormRuntime] = useState('2h 15m');
  const [formImg, setFormImg] = useState('');
  const [formBackdrop, setFormBackdrop] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formInterpreter, setFormInterpreter] = useState('NEW RELEASE');
  const [formDirector, setFormDirector] = useState('');
  const [formCast, setFormCast] = useState('');

  // Play Page Immersive details States
  const [activePlayTab, setActivePlayTab] = useState<'comments' | 'details'>('comments');
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareShortLink, setShareShortLink] = useState('');
  const [isCopiedSuccess, setIsCopiedSuccess] = useState(false);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [visibleRelatedCount, setVisibleRelatedCount] = useState(4);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloadReady, setIsDownloadReady] = useState(false);
  
  // AI Interactive State
  const [aiHistory, setAiHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiConfigured, setAiConfigured] = useState(true);

  // Ratings & Interactive Reviews
  const [userVote, setUserVote] = useState<number | null>(null);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);

  // General Loading & Status Indicators
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // 3D Hero Slider hover
  const [heroHovered, setHeroHovered] = useState<'back-left' | 'back-right' | null>(null);

  // Fetch initial catalog on load
  useEffect(() => {
    fetchMovies();
    fetchWatchlist();
  }, []);

  // Show Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/movies');
      const data = await res.json();
      if (data.success && Array.isArray(data.movies)) {
        setMovies(data.movies);
      } else {
        setErrorMessage('Unable to load structural movie library.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error during movie catalog synchronization.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist');
      const data = await res.json();
      if (data.success && Array.isArray(data.watchlist)) {
        setWatchlist(data.watchlist);
      }
    } catch (err) {
      console.error('Watchlist fetch failure:', err);
    }
  };

  const toggleWatchlist = async (movieId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const isAlreadyIn = watchlist.some(w => w.movieId === movieId);
    try {
      if (isAlreadyIn) {
        // Delete
        const res = await fetch(`/api/watchlist/${movieId}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setWatchlist(prev => prev.filter(w => w.movieId !== movieId));
          showToast('Removed from your watchlist.');
        }
      } else {
        // Add
        const res = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId })
        });
        const data = await res.json();
        if (data.success) {
          // Re-fetch watchlist to ensure clean sync with titles
          fetchWatchlist();
          showToast('Added to your watchlist!');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Watchlist sync error.');
    }
  };

  // admin panel data loaders
  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success && data.stats) {
        setAdminStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin statistics:', err);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setAllUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
  };

  const fetchAdminComments = async () => {
    try {
      const res = await fetch('/api/admin/comments');
      const data = await res.json();
      if (data.success && Array.isArray(data.comments)) {
        setAllComments(data.comments);
      }
    } catch (err) {
      console.error('Error fetching admin comments:', err);
    }
  };

  const triggerAdminLoad = () => {
    fetchAdminStats();
    fetchAdminUsers();
    fetchAdminComments();
  };

  useEffect(() => {
    if (adminToken && activePage === 'admin') {
      triggerAdminLoad();
    }
  }, [adminToken, activePage, adminSubPage]);

  // Admin login actions
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminUsernameInput,
          password: adminPasswordInput
        })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        setAdminToken(data.token);
        setAdminUser(JSON.stringify(data.user));
        setAdminUsernameInput('');
        setAdminPasswordInput('');
        showToast('Successfully authenticated as administrator');
        setAdminSubPage('dashboard');
      } else {
        setAdminLoginError(data.message || 'Access Denied. Check credentials.');
      }
    } catch (err) {
      console.error(err);
      setAdminLoginError('Internal system connection failure. Check backend.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken(null);
    setAdminUser(null);
    setIsSidebarMobileOpen(false);
    setActivePage('home');
    showToast('Admin session terminated');
  };

  const openAddForm = () => {
    setIsEditingForm(true);
    setEditMovieId(null);
    setFormTitle('');
    setFormType('Sci-Fi');
    setFormContentType('movie');
    setFormYear('2026');
    setFormRuntime('2h 15m');
    setFormImg('');
    setFormBackdrop('');
    setFormVideoUrl('');
    setFormDescription('');
    setFormInterpreter('NEW RELEASE');
    setFormDirector('');
    setFormCast('');
    setAdminSubPage('add-form');
  };

  const openEditForm = (movie: Movie) => {
    setIsEditingForm(true);
    setEditMovieId(movie.id);
    setFormTitle(movie.title);
    setFormType(movie.type);
    setFormContentType(movie.contentType);
    setFormYear(String(movie.year));
    setFormRuntime(movie.runtime);
    setFormImg(movie.img);
    setFormBackdrop(movie.backdropUrl);
    setFormVideoUrl(movie.videoUrl);
    setFormDescription(movie.description);
    setFormInterpreter(movie.interpreter);
    setFormDirector(movie.director);
    setFormCast(movie.cast.join(', '));
    setAdminSubPage('add-form');
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription) {
      showToast('Please fill out required title and tagline values!');
      return;
    }

    const castList = formCast.split(',').map(c => c.trim()).filter(Boolean);
    const movieData = {
      title: formTitle,
      type: formType,
      contentType: formContentType,
      year: Number(formYear) || 2026,
      runtime: formRuntime,
      img: formImg,
      backdropUrl: formBackdrop,
      videoUrl: formVideoUrl,
      description: formDescription,
      interpreter: formInterpreter,
      director: formDirector,
      cast: castList
    };

    try {
      const isEditing = editMovieId !== null;
      const url = isEditing ? `/api/movies/${editMovieId}` : '/api/movies';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData)
      });
      const data = await res.json();

      if (data.success) {
        showToast(isEditing ? 'Film entries updated' : 'film catalog added');
        fetchMovies(); // Reload dynamic catalog list
        setAdminSubPage(formContentType === 'series' ? 'series' : 'movies');
      } else {
        showToast(data.message || 'Saving error.');
      }
    } catch (err) {
      console.error(err);
      showToast('Catalog server saving error.');
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (!window.confirm('Delete this title permanently from current movie library?')) return;
    try {
      const res = await fetch(`/api/movies/${movieId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Media entry deleted');
        fetchMovies();
        triggerAdminLoad(); // Refresh stats count
      }
    } catch (err) {
      console.error(err);
      showToast('Deletation failed.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Purge this user comment review from public ecosystem?')) return;
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Comment pruned');
        fetchAdminComments();
        // Also sync local if inside play
        if (selectedMovie) {
          setComments(prev => prev.filter(c => c.id !== commentId));
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Purging failure.');
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        showToast('User state modified');
        fetchAdminUsers();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to modify member status.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Erase this user profile state?')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('User profile purged');
        fetchAdminUsers();
      }
    } catch (err) {
      console.error(err);
      showToast('Erase user state failure.');
    }
  };

  const startPlaying = async (movie: Movie) => {
    setSelectedMovie(movie);
    setActivePage('play');
    setUserVote(null); // Reset voting choice
    setDownloadProgress(null);
    setIsDownloadReady(false);
    
    // Compute related items dynamically based on Genres/Types
    const related = movies.filter(m => m.id !== movie.id && (m.type === movie.type || m.contentType === movie.contentType));
    setRelatedMovies(related.length > 0 ? related : movies.filter(m => m.id !== movie.id));
    setVisibleRelatedCount(4);

    // Initial setup of play helper states
    setShareShortLink(`${window.location.origin}/movieplay/${movie.id}`);
    setIsCopiedSuccess(false);
    setIsShareOpen(false);
    setIsStoryExpanded(false);
    setActivePlayTab('comments');

    // Fetch comments for this specific film
    try {
      const res = await fetch(`/api/comments/${movie.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.comments)) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleCastVote = async (score: number) => {
    if (!selectedMovie) return;
    try {
      const res = await fetch(`/api/movies/${selectedMovie.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: score })
      });
      const data = await res.json();
      if (data.success) {
        setUserVote(score);
        // Live update active movie catalog
        setMovies(prev => prev.map(m => m.id === selectedMovie.id ? { ...m, rating: data.newRating } : m));
        setSelectedMovie(prev => prev ? { ...prev, rating: data.newRating } : null);
        showToast(`Rated ${score}/10. Thanks for voting!`);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to commit rating to database.');
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareShortLink);
    setIsCopiedSuccess(true);
    showToast('Share link copied to clipboard!');
    setTimeout(() => {
      setIsCopiedSuccess(false);
    }, 2000);
  };

  const handleWatchMovie = () => {
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      videoRef.current.play().catch(err => console.log('Video play interrupted:', err));
      showToast('Playing Movie in Ultra HD!');
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie || !commentName.trim() || !commentText.trim()) {
      showToast('Please fill out all comment fields.');
      return;
    }
    setSubmittingComment(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: selectedMovie.id,
          userName: commentName,
          text: commentText,
          rating: commentRating
        })
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => [data.comment, ...prev]);
        setCommentText('');
        showToast('Your review has been published!');
      }
    } catch (err) {
      console.error(err);
      showToast('Error publishing your comment review.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userMsg = aiInput;
    setAiInput('');
    setAiHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          chatHistory: aiHistory
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiHistory(prev => [...prev, { role: 'model', text: data.reply }]);
        if (data.isConfigured === false) {
          setAiConfigured(false);
        } else {
          setAiConfigured(true);
        }
      } else {
        setAiHistory(prev => [...prev, { role: 'model', text: 'Sorry, I couldn\'t contact the FastMovie engine model.' }]);
      }
    } catch (err) {
      console.error(err);
      setAiHistory(prev => [...prev, { role: 'model', text: 'An unexpected connection failure disrupted the cinematic dialogue.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const triggerSearchAction = (value: string) => {
    setSearchQuery(value);
    // If not currently on lists, switch to movies to visualize filter
    if (activePage !== 'movies' && activePage !== 'series' && activePage !== 'watchlist') {
      setActivePage('movies');
    }
  };

  const sendQuickPrompt = (prompt: string) => {
    setAiInput(prompt);
    setTimeout(() => {
      // Small tick delay to let state render
      document.getElementById('ai-submit-button')?.click();
    }, 100);
  };

  // Group movies by Genre for Home rendering
  const groupedMovies = movies.reduce((acc, movie) => {
    if (!acc[movie.type]) {
      acc[movie.type] = [];
    }
    acc[movie.type].push(movie);
    return acc;
  }, {} as Record<string, Movie[]>);

  // Filter lists based on page content and search criteria
  const filteredCatalog = movies.filter(movie => {
    const matchesSearch = 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      movie.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.cast.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activePage === 'movies') {
      return matchesSearch && movie.contentType === 'movie';
    }
    if (activePage === 'series') {
      return matchesSearch && movie.contentType === 'series';
    }
    return matchesSearch;
  });

  const watchlistMovies = movies.filter(m => watchlist.some(w => w.movieId === m.id));

  // Determine movies to show on Hero Stack (Interstellar [0], Inception [1], The Matrix [2], etc.)
  const heroMovieFront = movies[0];
  const heroMovieLeft = movies[1] || movies[3];
  const heroMovieRight = movies[2] || movies[4];

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans antialiased selection:bg-lime-400 selection:text-black">
      
      {/* Sticky Top Navbar Custom Design */}
      <header className="sticky top-0 z-50 w-full bg-transparent border-b-0 shadow-none">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 bg-transparent">
          
          {/* Logo on the left */}
          <div 
            onClick={() => {
              setActivePage('home');
              setSearchQuery('');
            }}
            className="flex cursor-pointer items-center gap-2 group transition-all shrink-0"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.35)] group-hover:scale-105 transition-transform duration-300">
              <Play className="h-5 w-5 fill-current ml-0.5" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-lime-400">
              FAST<span className="text-white">MOVIE</span>
            </span>
          </div>

          {/* Screenshot-inspired integrated Search Group in the center */}
          <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-6 justify-center">
            <div className="relative flex items-center bg-black hover:bg-neutral-950 border border-neutral-800 focus-within:border-lime-400/80 focus-within:ring-2 focus-within:ring-lime-400/10 rounded-xl overflow-hidden w-full transition-all">
              <div className="pl-3.5 pr-1 text-neutral-500">
                <Search className="h-4 w-4" />
              </div>
              <input 
                type="text" 
                placeholder="Type your search"
                value={searchQuery}
                onChange={(e) => triggerSearchAction(e.target.value)}
                className="bg-transparent border-none text-white text-xs w-full py-2.5 focus:outline-none placeholder-neutral-500 font-semibold"
              />
              <button
                onClick={() => triggerSearchAction(searchQuery)}
                className="bg-lime-400 hover:bg-lime-500 text-black px-4.5 py-2.5 flex items-center justify-center cursor-pointer transition-all shrink-0"
                aria-label="Search button"
              >
                <Search className="h-4 w-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Nav Items & Profile on the right */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* OSHAkur styled premium banner button with chat bubble icon */}
            <button
              onClick={() => {
                setActivePage('admin');
                setSearchQuery('');
                showToast("Opening secure administrator panel!");
              }}
              className="flex items-center gap-2 px-4.5 py-2.5 bg-lime-400 hover:bg-lime-500 font-black text-black uppercase text-xs tracking-wider rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(163,230,53,0.15)]"
            >
              <span className="font-extrabold tracking-widest">FASTMOVIE</span>
              <MessageSquare className="h-4 w-4 stroke-[2.5]" />
            </button>

            {/* Screenshot-inspired square menu hamburger button */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-all duration-200 border ${
                isMobileNavOpen 
                  ? 'bg-lime-400 border-lime-400 text-black' 
                  : 'bg-neutral-900/80 border-neutral-800 text-lime-400 hover:bg-lime-400 hover:text-black hover:border-lime-400'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileNavOpen ? <X className="h-5 w-5 stroke-[2.5]" /> : <Menu className="h-5 w-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>

        {/* Small screen mobile row Search Bar */}
        <div className="border-t border-neutral-900 px-4 py-2.5 bg-neutral-950 md:hidden">
          <div className="relative flex items-center bg-black border border-neutral-850 rounded-xl overflow-hidden w-full focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-400/10 transition-all">
            <div className="pl-3 pr-1 text-neutral-500">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input 
              type="text" 
              placeholder="Type your search"
              value={searchQuery}
              onChange={(e) => triggerSearchAction(e.target.value)}
              className="bg-transparent border-none text-white text-xs w-full py-2 focus:outline-none placeholder-neutral-500 font-semibold"
            />
            <button
              onClick={() => triggerSearchAction(searchQuery)}
              className="bg-lime-400 hover:bg-lime-500 text-black px-3.5 py-2 flex items-center justify-center cursor-pointer transition-colors"
            >
              <Search className="h-3.5 w-3.5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Global Floating Dropdown menu listing option links */}
        {isMobileNavOpen && (
          <div className="fixed top-22 right-4 sm:right-8 z-[999] w-64 bg-zinc-950/95 backdrop-blur-md border border-neutral-800 rounded-2xl p-4 shadow-[0_10px_35px_rgba(163,230,53,0.15)] flex flex-col gap-1.5 animate-fade-in">
            <p className="text-[10px] font-mono tracking-widest text-lime-400 uppercase font-black px-3 pb-2 border-b border-neutral-900 mb-2">
              Navigation Menu
            </p>
            <button
              onClick={() => { setActivePage('home'); setSearchQuery(''); setIsMobileNavOpen(false); }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activePage === 'home' ? 'text-black bg-lime-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              🏠 Home Catalog
            </button>
            <button
              onClick={() => { setActivePage('movies'); setSearchQuery(''); setIsMobileNavOpen(false); }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activePage === 'movies' ? 'text-black bg-lime-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              🎬 Explore Movies
            </button>
            <button
              onClick={() => { setActivePage('series'); setSearchQuery(''); setIsMobileNavOpen(false); }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activePage === 'series' ? 'text-black bg-lime-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-905'
              }`}
            >
              📺 Explore Series
            </button>
            <button
              onClick={() => { setActivePage('admin'); setSearchQuery(''); setIsMobileNavOpen(false); }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activePage === 'admin' ? 'text-black bg-lime-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              🔑 Admin Controls
            </button>
          </div>
        )}
      </header>

      {/* Floating System Messages Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-lime-400 text-black font-extrabold text-[12px] px-4 py-2.5 rounded-lg shadow-2xl animate-bounce">
          <Clapperboard className="h-4 w-4 animate-spin" />
          <span>{toastMessage.toUpperCase()}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <div className="relative flex items-center justify-center h-14 w-14">
              <div className="absolute inset-0 rounded-full border-4 border-lime-400/20 border-t-lime-400 animate-spin"></div>
            </div>
            <p className="text-lime-400 text-xs font-mono tracking-widest uppercase animate-pulse">
              Buffering Streaming Ecosystem...
            </p>
          </div>
        )}

        {/* ERROR SCREEN */}
        {!errorMessage && !loading && errorMessage && (
          <div className="mx-auto max-w-md my-16 p-6 rounded-2xl border border-red-500/30 bg-red-950/20 text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold uppercase tracking-tight text-white">System Error</h2>
            <p className="text-xs text-neutral-400">{errorMessage}</p>
            <button 
              onClick={() => { setErrorMessage(''); fetchMovies(); }}
              className="bg-lime-400 text-black hover:bg-lime-500 transition-all text-xs font-extrabold px-4 py-2 rounded-lg"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* ACTIVE PAGE: HOME VIEW */}
        {!loading && !errorMessage && activePage === 'home' && (
          <div className="space-y-6">
            
            {/* 3D Stack Hero Banner Section conforming strictly to style specifications */}
            <section className="relative w-full min-h-[75vh] md:min-h-[85vh] flex items-center overflow-hidden border-b border-neutral-900 bg-neutral-950 px-4 md:px-10 lg:px-20 py-12">
              
              {/* Lime Radial Glow behind Stack */}
              <div className="absolute top-0 right-0 w-2/3 h-full bg-[radial-gradient(circle_at_right_center,_var(--tw-gradient-stops))] from-lime-400/5 via-lime-400/0 to-transparent opacity-60"></div>
              
              <div className="mx-auto max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12 z-10">
                
                {/* Hero Information */}
                <div className="w-full lg:w-1/2 space-y-6 text-left">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-8 bg-lime-400"></span>
                    <span className="text-lime-400 text-xs font-bold uppercase tracking-[0.3em]">
                      Limitless Entertainment
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[0.9] tracking-tight uppercase">
                    UNLIMITED <span className="text-lime-400">MOVIES</span>
                    <br />
                    <span className="text-xl sm:text-2xl md:text-3xl tracking-normal text-neutral-300 font-light lowercase">
                      anytime, anywhere
                    </span>
                  </h1>

                  <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-md leading-relaxed font-sans">
                    Stream the latest blockbusters, cult classics, and exclusive series. Dive into a world of spectacular cinematic stories — all in one streamlined portal.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button 
                      onClick={() => {
                        const recSec = document.getElementById('row-Sci-Fi') || document.getElementById('row-Action');
                        recSec?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-lime-400 text-black px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:bg-lime-500 hover:scale-105 transition-all cursor-pointer"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Explore Now
                    </button>
                    {heroMovieFront && (
                      <button 
                        onClick={() => startPlaying(heroMovieFront)}
                        className="border border-lime-400 text-lime-400 px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-wider hover:bg-lime-400/10 hover:scale-102 transition-all cursor-pointer"
                      >
                        Watch Trailer
                      </button>
                    )}
                  </div>
                </div>

                {/* 3D Stack of Cards */}
                <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[400px] flex items-center justify-center">
                  
                  {/* Back Left Card */}
                  {heroMovieLeft && (
                    <div className="absolute">
                      <HeroCard
                        movie={heroMovieLeft}
                        position="back-left"
                        isHovered={heroHovered === 'back-left'}
                        onHover={() => setHeroHovered('back-left')}
                        onLeave={() => setHeroHovered(null)}
                        onPlay={startPlaying}
                        isMobile={window.innerWidth < 640}
                      />
                    </div>
                  )}

                  {/* Back Right Card */}
                  {heroMovieRight && (
                    <div className="absolute">
                      <HeroCard
                        movie={heroMovieRight}
                        position="back-right"
                        isHovered={heroHovered === 'back-right'}
                        onHover={() => setHeroHovered('back-right')}
                        onLeave={() => setHeroHovered(null)}
                        onPlay={startPlaying}
                        isMobile={window.innerWidth < 640}
                      />
                    </div>
                  )}

                  {/* Front Main Card */}
                  {heroMovieFront && (
                    <div className="absolute z-20">
                      <HeroCard
                        movie={heroMovieFront}
                        position="front"
                        isHovered={false}
                        onPlay={startPlaying}
                        isMobile={window.innerWidth < 640}
                      />
                    </div>
                  )}

                </div>
              </div>
            </section>

            {/* Slider Rows: Split by dynamic category genre */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
              
              {/* Highlight Row: Trending / Recently Added combined */}
              <div className="space-y-4">
                <MovieRow
                  id="recents"
                  title="RECENTLY ADDED"
                  subtitle="Latest Cinematic Releases"
                  movies={movies.slice(0, 10)}
                  onPlay={startPlaying}
                  watchlistIds={[]}
                  onToggleWatchlist={() => {}}
                />
              </div>

              {/* Dynamic Categories */}
              {(Object.entries(groupedMovies) as [string, Movie[]][]).map(([genre, items]) => (
                <div key={genre} id={`row-${genre}`}>
                  <MovieRow
                    id={`row-scroller-${genre}`}
                    title={genre}
                    subtitle={`TOP HITS IN ${genre.toUpperCase()}`}
                    movies={items}
                    onPlay={startPlaying}
                    watchlistIds={[]}
                    onToggleWatchlist={() => {}}
                  />
                </div>
              ))}

            </section>
          </div>
        )}

        {/* ACTIVE PAGE: MOVIES & SERIES GRID FILTER VIEWS */}
        {!loading && !errorMessage && (activePage === 'movies' || activePage === 'series') && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            {/* Grid Header Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-wider text-white">
                  EXPLORE <span className="text-lime-400">{activePage}</span>
                </h1>
                <p className="text-xs text-neutral-400 font-mono tracking-widest uppercase mt-1">
                  Catalog Size: {filteredCatalog.length} Releases
                </p>
              </div>

              {/* Status Pill filters */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-mono">Genre Filter</span>
                <span className="bg-lime-400/10 text-lime-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-lime-400/20 uppercase tracking-widest">
                  All Genres
                </span>
              </div>
            </div>

            {/* Movie Catalog Row Layout - Identical in card style, size and spacing like on home page */}
            {filteredCatalog.length > 0 ? (
              <div className="flex flex-wrap gap-6 sm:gap-8 justify-center sm:justify-start">
                {filteredCatalog.map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onPlay={startPlaying}
                    isGrid={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-neutral-950 rounded-2xl border border-neutral-900">
                <Film className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                <p className="text-white font-bold uppercase text-lg tracking-wide">No Titles Found</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                  We couldn't matching anything with "{searchQuery}" inside the {activePage} archive.
                </p>
              </div>
            )}
          </div>
        )}

         {/* Watchlist and AI Recs pages have been deprecated. */}

         {/* ACTIVE PAGE: IMMERSIVE MULTIMEDIA PLAYER & SPECTACULAR REVIEW CENTER */}
        {!loading && !errorMessage && activePage === 'play' && selectedMovie && (
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-[90vh]">
            
            {/* Cinematic Blurred Ambient Canvas */}
            <div 
              className="absolute inset-x-0 top-0 h-[600px] -z-10 bg-cover bg-center opacity-10 filter blur-[90px] pointer-events-none" 
              style={{ backgroundImage: `url(${selectedMovie.backdropUrl || selectedMovie.img})` }}
            ></div>



            {/* Immersive Audio/Video Player Console */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Media Player Frame + Interactive Controls Column (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Cinema Canvas */}
                <div className="aspect-video w-full rounded-2xl bg-black border border-neutral-900 shadow-2xl relative overflow-hidden group">
                  <video
                    ref={videoRef}
                    src={selectedMovie.videoUrl}
                    poster={selectedMovie.backdropUrl || selectedMovie.img}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Dynamic Technical Overlay */}
                  <div className="absolute top-4 left-4 bg-black/80 px-3 py-1.5 rounded-lg border border-neutral-800 text-[10px] font-mono text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-350 select-none flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse"></span>
                    <span>HD DIRECT STREAM: 2160p (4K UHD) • Dolby Atmos sound active</span>
                  </div>
                </div>

                {/* Star-studded Title Metadata */}
                <div className="space-y-4">
                  
                  {/* Fast specifications taglines */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-lime-400 text-black text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      {selectedMovie.interpreter}
                    </span>
                    <span className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded-md">
                      YEAR: {selectedMovie.year}
                    </span>
                    <span className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider">
                      FORMAT: {selectedMovie.contentType}
                    </span>
                    <span className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded-md">
                      LENGTH: {selectedMovie.runtime}
                    </span>
                    <span className="flex items-center gap-1 bg-lime-400/5 border border-lime-400/20 text-lime-400 text-[10px] font-mono px-2 py-0.5 rounded-md">
                      <Cpu className="h-3 w-3" />
                      4K HDR15+ Verified
                    </span>
                    <span className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded-md">
                      <Volume2 className="h-3 w-3 text-lime-400" />
                      Dolby Audio Atmos 7.1
                    </span>
                    <span className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded-md">
                      <Subtitles className="h-3 w-3 text-neutral-400" />
                      Multi-subs
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
                    <div>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-widest">
                        {selectedMovie.title}
                      </h1>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 select-none">
                          <Star className="h-4.5 w-4.5 text-lime-400 fill-current" />
                          <span className="text-lg font-black text-lime-400 font-mono">{selectedMovie.rating}</span>
                        </div>
                        <span className="text-neutral-500 text-xs">•</span>
                        <span className="text-xs text-neutral-400 font-medium">Audience rating pool score</span>
                      </div>
                    </div>

                    {/* Interactive Action Hub */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      
                      {/* Watch Movie Button (Primary Action) */}
                      <button
                        onClick={handleWatchMovie}
                        className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all duration-200 bg-lime-400 text-black hover:bg-lime-500 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(163,230,53,0.25)] font-sans"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        Watch Movie
                      </button>

                      {/* Download Button with Progress */}
                      {downloadProgress !== null ? (
                        <div className="bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl text-xs space-y-1 w-44">
                          <div className="flex justify-between text-[10px] font-mono font-bold text-lime-400">
                            <span>DOWNLOADING...</span>
                            <span>{downloadProgress}%</span>
                          </div>
                          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-lime-400 h-full transition-all duration-300" style={{ width: `${downloadProgress}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (isDownloadReady) return;
                            setDownloadProgress(0);
                            const interval = setInterval(() => {
                              setDownloadProgress(p => {
                                      if (p === null) return 0;
                                      if (p >= 100) {
                                        clearInterval(interval);
                                        setIsDownloadReady(true);
                                        showToast('Offline media saved successfully');
                                        return 100;
                                      }
                                      return p + 25;
                              });
                            }, 350);
                          }}
                          className={`flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all duration-200 ${
                            isDownloadReady
                              ? 'bg-lime-400/10 border border-lime-400/20 text-lime-400'
                              : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800'
                          }`}
                        >
                          {isDownloadReady ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-lime-400" />
                              Saved Offline
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              Download
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details Synopsis with Read More Fold */}
                <div className="bg-neutral-950/60 border border-neutral-900 p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-lime-400 uppercase">
                    Storyline & Summary
                  </h3>
                  <div className="relative">
                    <p className={`text-sm text-neutral-300 leading-relaxed font-sans ${!isStoryExpanded && selectedMovie.description.length > 200 ? 'line-clamp-3' : ''}`}>
                      {selectedMovie.description}
                    </p>
                    {selectedMovie.description.length > 200 && (
                      <button
                        onClick={() => setIsStoryExpanded(!isStoryExpanded)}
                        className="text-xs font-extrabold text-lime-400 mt-2 hover:underline focus:outline-none cursor-pointer"
                      >
                        {isStoryExpanded ? 'READ LESS' : 'READ MORE STORYLINE'}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-900">
                    <div>
                      <span className="text-neutral-500 text-[10px] font-bold uppercase block mb-1">Director</span>
                      <span className="text-white text-xs font-mono bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-850 inline-block">{selectedMovie.director}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] font-bold uppercase block mb-1">Starring Cast</span>
                      <span className="text-neutral-200 text-xs leading-relaxed font-semibold">
                        {selectedMovie.cast.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audience Opinion Casting Slider */}
                <div className="bg-neutral-950/60 border border-neutral-900 p-6 rounded-2xl space-y-4">
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest text-lime-400 uppercase">
                      Cast Your Score
                    </h3>
                    <p className="text-xs text-neutral-450 mt-1">
                      Vote instantly to modify fastmovie metrics in real-time.
                    </p>
                  </div>
                  
                  {userVote ? (
                    <div className="bg-lime-400/10 border border-lime-400/30 p-4 rounded-xl text-center space-y-1">
                      <p className="text-xs font-black text-lime-400 uppercase tracking-widest">Feedback recorded</p>
                      <p className="text-sm font-bold text-neutral-200">YOU ASSIGNED A RATING SCORE OF <span className="text-lime-400 font-mono font-black">{userVote} / 10</span></p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                        <button
                          key={score}
                          onClick={() => handleCastVote(score)}
                          className="h-9 w-9 font-bold text-xs rounded-lg border border-neutral-850 bg-neutral-900 hover:bg-lime-400 hover:text-black hover:border-lime-400 transition-all cursor-pointer font-mono shadow-sm"
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sub-tabs Selection panel */}
                <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl overflow-hidden">
                  <div className="flex border-b border-neutral-900 px-4 bg-neutral-950">
                    <button
                      onClick={() => setActivePlayTab('comments')}
                      className={`px-4 py-3 text-[11px] font-bold uppercase tracking-widest border-b-2 cursor-pointer transition-all ${
                        activePlayTab === 'comments'
                          ? 'border-lime-400 text-lime-400 font-black'
                          : 'border-transparent text-neutral-400 hover:text-white'
                      }`}
                    >
                      Audience Reviews ({comments.length})
                    </button>
                    <button
                      onClick={() => setActivePlayTab('details')}
                      className={`px-4 py-3 text-[11px] font-bold uppercase tracking-widest border-b-2 cursor-pointer transition-all ${
                        activePlayTab === 'details'
                          ? 'border-lime-400 text-lime-400 font-black'
                          : 'border-transparent text-neutral-400 hover:text-white'
                      }`}
                    >
                      Technical Audio Specs
                    </button>
                  </div>

                  <div className="p-6">
                    {activePlayTab === 'comments' ? (
                      <div className="space-y-6">
                        {/* New review entry */}
                        <form onSubmit={handlePostComment} className="space-y-3 p-4 bg-neutral-900/40 rounded-xl border border-neutral-900">
                          <p className="text-[11px] font-black text-lime-400 uppercase tracking-widest block">Post Audience Review</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Your viewer alias / display name"
                              value={commentName}
                              onChange={(e) => setCommentName(e.target.value)}
                              required
                              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
                            />
                            <div className="flex items-center gap-1.5 px-3 bg-neutral-950 rounded-lg border border-neutral-800">
                              <span className="text-[9px] text-neutral-550 font-bold uppercase mr-1">Stars:</span>
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setCommentRating(star)}
                                  className="focus:outline-none cursor-pointer"
                                >
                                  <Star className={`h-3.5 w-3.5 ${star <= commentRating ? 'text-lime-400 fill-current' : 'text-neutral-700'}`} />
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea
                            placeholder="Critique notes, dynamic script impressions, actor ratings..."
                            rows={3}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
                          />

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={submittingComment}
                              className="bg-lime-400 hover:bg-lime-500 text-black font-black text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-all cursor-pointer"
                            >
                              {submittingComment ? 'PUBLISHING...' : 'SUBMIT REVIEW'}
                            </button>
                          </div>
                        </form>

                        <div className="space-y-4">
                          {comments.length > 0 ? (
                            comments.map(c => (
                              <div key={c.id} className="bg-neutral-950/40 p-4 rounded-xl space-y-2 border border-neutral-900/60 font-sans">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-neutral-850 border border-neutral-850 flex items-center justify-center text-[10px] font-black text-lime-400 uppercase select-none">
                                      {c.userName.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-xs font-black text-white">{c.userName}</span>
                                  </div>
                                  <div className="flex items-center gap-0.5 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-850">
                                    <Star className="h-2.5 w-2.5 text-lime-400 fill-current" />
                                    <span className="text-[9px] font-mono font-black text-neutral-300">{c.rating} / 5</span>
                                  </div>
                                </div>
                                <p className="text-xs text-neutral-300 leading-relaxed pl-1">
                                  {c.text}
                                </p>
                                <div className="text-[9px] text-neutral-600 font-mono text-right">
                                  {c.timestamp}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-neutral-550 italic text-center py-6">
                              No public commentary registered. Become the first critical agent!
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-xs text-neutral-300 font-mono leading-relaxed">
                        <div className="grid grid-cols-2 gap-4 border-b border-neutral-900 pb-2">
                          <span className="text-neutral-500">Audio Codec Standard</span>
                          <span className="text-neutral-200">E-AC-3 (Dolby Digital Plus Dolby Atmos)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-b border-neutral-900 pb-2">
                          <span className="text-neutral-500">Dynamic Color Encoding</span>
                          <span className="text-neutral-200">HLG / HDR10 Static Specs / BT.2020 Space</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-b border-neutral-900 pb-2">
                          <span className="text-neutral-500">Video Encoding Bitrate</span>
                          <span className="text-neutral-200">14.8 Mbps High-efficiency HEVC</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pb-2">
                          <span className="text-neutral-500">Subtitles Indexing</span>
                          <span className="text-neutral-200">English [CC], Español, Deutsch, Français, Nederlands</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Related content widgets sidebar (1 col) */}
              <div className="lg:col-span-1 space-y-6">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-lime-400 uppercase flex items-center gap-1.5">
                      <Clapperboard className="h-4 w-4" />
                      More Like This
                    </h3>
                    <span className="text-[10px] text-neutral-500 font-mono font-bold">{relatedMovies.length} TITLES</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {relatedMovies.slice(0, visibleRelatedCount).map(rm => (
                      <div 
                        key={rm.id}
                        onClick={() => startPlaying(rm)}
                        className="flex gap-4 p-2.5 bg-neutral-950/40 hover:bg-neutral-900/60 rounded-xl hover:border-lime-400/20 border border-neutral-900 cursor-pointer transition-all duration-300 group shadow-md"
                      >
                        <div className="w-16 h-20 bg-neutral-900 rounded-lg overflow-hidden shrink-0 border border-neutral-800">
                          <img 
                            src={rm.img} 
                            alt={rm.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350" 
                          />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <h4 className="text-sm font-bold text-neutral-200 truncate group-hover:text-lime-400 transition-colors uppercase">
                            {rm.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-neutral-500 font-mono">{rm.year}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">•</span>
                            <span className="text-[10px] text-lime-400/80 bg-lime-400/5 px-1.5 py-0.5 rounded text-[8px] font-mono uppercase">{rm.type}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1.5 text-lime-400">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-[10px] font-mono font-black">{rm.rating} / 10</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Related Movies list visual dynamic pagination throttles */}
                  {relatedMovies.length > 4 && (
                    <div className="pt-2">
                      {visibleRelatedCount < relatedMovies.length ? (
                        <button
                          onClick={() => setVisibleRelatedCount(relatedMovies.length)}
                          className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-750 text-[10px] font-black text-neutral-400 hover:text-lime-400 uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          Show All Recommendation Picks ({relatedMovies.length - 4} more)
                        </button>
                      ) : (
                        <button
                          onClick={() => setVisibleRelatedCount(4)}
                          className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-black text-lime-400 uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          Collapse Recommendation Row
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Centered Premium Share button at the bottom of the play container */}
            <div className="flex justify-center pt-8 border-t border-neutral-900">
              <button
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-2 px-8 py-3.5 bg-lime-400 hover:bg-lime-320 text-black font-black uppercase text-xs tracking-widest rounded-full transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:scale-[1.03] cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                Share This Movie
              </button>
            </div>

            {/* Immersive Cinematic Sharing Popup overlay Drawer */}
            {isShareOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                <div 
                  className="w-full max-w-md bg-neutral-950 border border-lime-400/30 rounded-2xl p-6 space-y-4 text-center shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsShareOpen(false)}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
                    aria-label="Close modal"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="mx-auto h-12 w-12 rounded-full bg-lime-400/10 flex items-center justify-center border border-lime-400/20">
                    <Share2 className="h-5 w-5 text-lime-400" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-black uppercase text-white tracking-widest">Share Cinematic Title</h3>
                    <p className="text-xs text-neutral-400">Send this dynamic VOD player node link to your peer network.</p>
                  </div>

                  <div className="flex gap-2 bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                    <input 
                      type="text" 
                      readOnly 
                      value={shareShortLink}
                      className="flex-1 bg-transparent border-none text-xs text-lime-400 font-mono placeholder-neutral-500 outline-none select-all px-2"
                    />
                    <button
                      onClick={copyShareLink}
                      className="px-4 py-1.5 h-8 bg-lime-400 hover:bg-lime-500 text-black text-[10px] font-black uppercase tracking-wider rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      {isCopiedSuccess ? (
                        <>
                          <Check className="h-3 w-3 stroke-[3]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy Node
                        </>
                      )}
                    </button>
                  </div>

                  <div className="pt-2">
                    <p className="text-[9px] font-bold text-neutral-550 uppercase tracking-widest mb-3">Simulated Instant Platform Hooks</p>
                    <div className="grid grid-cols-4 gap-2">
                      <button 
                        onClick={() => { copyShareLink(); showToast('WhatsApp share simulated'); }} 
                        className="bg-neutral-900 hover:bg-neutral-850 p-2.5 rounded-lg border border-neutral-850 text-[10px] font-bold hover:text-lime-400 text-neutral-300 transition-all cursor-pointer"
                      >
                        WhatsApp
                      </button>
                      <button 
                        onClick={() => { copyShareLink(); showToast('Telegram node dispatched'); }} 
                        className="bg-neutral-900 hover:bg-neutral-850 p-2.5 rounded-lg border border-neutral-850 text-[10px] font-bold hover:text-lime-400 text-neutral-300 transition-all cursor-pointer"
                      >
                        Telegram
                      </button>
                      <button 
                        onClick={() => { copyShareLink(); showToast('X platform post generated'); }} 
                        className="bg-neutral-900 hover:bg-neutral-850 p-2.5 rounded-lg border border-neutral-850 text-[10px] font-bold hover:text-lime-400 text-neutral-300 transition-all cursor-pointer"
                      >
                        Twitter
                      </button>
                      <button 
                        onClick={() => { copyShareLink(); showToast('Facebook share recorded'); }} 
                        className="bg-neutral-900 hover:bg-neutral-850 p-2.5 rounded-lg border border-neutral-850 text-[10px] font-bold hover:text-lime-400 text-neutral-300 transition-all cursor-pointer"
                      >
                        Facebook
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ACTIVE PAGE: ADMINISTRATIVE HUB GATE & CENTRAL COMMAND WORKSPACE */}
        {!loading && !errorMessage && activePage === 'admin' && (
          <div className="min-h-[80vh]">
            
            {/* ADMIN LOCKED ENTRY GATE (IF NO TOKEN DETECTED) */}
            {!adminToken ? (
              <div className="mx-auto max-w-md my-16 p-8 border border-lime-450/25 bg-neutral-950 rounded-2xl shadow-2xl relative">
                
                {/* Aura shadow effect */}
                <div className="absolute inset-0 -z-10 bg-lime-400/5 filter blur-[35px] rounded-full"></div>

                <div className="text-center space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400 text-black shadow-lg shadow-lime-400/20">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase text-white tracking-widest">
                      Admin Authentication Gate
                    </h2>
                    <p className="text-xs text-neutral-400 font-sans mt-1">
                      Enter authorized fastmovie administrative log parameters.
                    </p>
                  </div>
                </div>

                {adminLoginError && (
                  <div className="mt-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-center flex items-center gap-2 justify-center text-red-450 text-[11px] font-mono leading-relaxed">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{adminLoginError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-neutral-450 uppercase tracking-wider block">Administrator Username</label>
                    <input
                      type="text"
                      placeholder="e.g. admin"
                      value={adminUsernameInput}
                      onChange={(e) => setAdminUsernameInput(e.target.value)}
                      required
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-neutral-450 uppercase tracking-wider block">Authentication Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      required
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400 transition-all font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 bg-lime-400 hover:bg-lime-500 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-lime-400/10 cursor-pointer"
                  >
                    Authenticate Session
                  </button>
                </form>

                <div className="mt-6 border-t border-neutral-900 pt-4 text-center">
                  <p className="text-[9px] text-neutral-550 leading-relaxed font-mono">
                    SECURITY NOTICE: Default administrative logs are **admin** & **admin** for developer sandboxed environments.
                  </p>
                </div>

              </div>
            ) : (
              
              /* STATEFUL RESPONSIVE ADMIN DASHBOARD WORKSPACE */
              <div className="flex min-h-[75vh] border border-neutral-900 rounded-2xl overflow-hidden bg-neutral-950 font-sans shadow-2xl">
                
                {/* 1. Sidebar Navigation - desktop view */}
                <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} hidden md:flex flex-col border-r border-neutral-900 bg-neutral-950 transition-all duration-300`}>
                  
                  {/* Top brand header */}
                  <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-900">
                    {!isSidebarCollapsed && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-lime-400" />
                        <span className="text-xs font-mono font-black text-white uppercase tracking-widest">Workspace</span>
                      </div>
                    )}
                    <button 
                      onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                      className="text-neutral-500 hover:text-white transition-colors cursor-pointer mx-auto p-1 focus:outline-none"
                    >
                      {isSidebarCollapsed ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Sidebar links */}
                  <nav className="flex-1 p-3 space-y-1.5 pt-4">
                    <button
                      onClick={() => setAdminSubPage('dashboard')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                        adminSubPage === 'dashboard'
                          ? 'bg-lime-400 text-black font-extrabold'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <BarChart3 className="h-4 w-4 shrink-0" />
                      {!isSidebarCollapsed && 'Stats Room'}
                    </button>

                    <button
                      onClick={() => setAdminSubPage('movies')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                        adminSubPage === 'movies'
                          ? 'bg-lime-400 text-black font-extrabold'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <Film className="h-4 w-4 shrink-0" />
                      {!isSidebarCollapsed && 'Manage Movies'}
                    </button>

                    <button
                      onClick={() => setAdminSubPage('series')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                        adminSubPage === 'series'
                          ? 'bg-lime-400 text-black font-extrabold'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <Tv className="h-4 w-4 shrink-0" />
                      {!isSidebarCollapsed && 'Manage Series'}
                    </button>

                    <button
                      onClick={() => setAdminSubPage('users')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                        adminSubPage === 'users'
                          ? 'bg-lime-400 text-black font-extrabold'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <Users className="h-4 w-4 shrink-0" />
                      {!isSidebarCollapsed && 'User Pool'}
                    </button>

                    <button
                      onClick={() => setAdminSubPage('comments')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                        adminSubPage === 'comments'
                          ? 'bg-lime-400 text-black font-extrabold'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      {!isSidebarCollapsed && 'Comment Controls'}
                    </button>

                    <div className="h-px bg-neutral-900 my-4"></div>

                    <button
                      onClick={() => setActivePage('home')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white hover:bg-neutral-905 cursor-pointer"
                    >
                      <Play className="h-4 w-4 shrink-0" />
                      {!isSidebarCollapsed && 'Return Stream'}
                    </button>
                  </nav>

                  {/* Logout block */}
                  <div className="p-3 border-t border-neutral-900">
                    <button
                      onClick={handleAdminLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 shrink-0 text-red-500" />
                      {!isSidebarCollapsed && 'Terminate Session'}
                    </button>
                  </div>
                </aside>

                {/* 2. Mobile Responsive Hamburger overlays */}
                {isSidebarMobileOpen && (
                  <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarMobileOpen(false)}>
                    <div className="w-60 bg-neutral-950 border-r border-neutral-900 h-full p-4 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
                          <span className="text-xs font-mono font-black text-lime-400 uppercase tracking-widest">Admin Workspace</span>
                          <button onClick={() => setIsSidebarMobileOpen(false)} className="text-neutral-400 hover:text-white">
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <nav className="space-y-1">
                          <button
                            onClick={() => { setAdminSubPage('dashboard'); setIsSidebarMobileOpen(false); }}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-lime-400 block"
                          >
                            Stats Room
                          </button>
                          <button
                            onClick={() => { setAdminSubPage('movies'); setIsSidebarMobileOpen(false); }}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-lime-400 block"
                          >
                            Manage Movies
                          </button>
                          <button
                            onClick={() => { setAdminSubPage('series'); setIsSidebarMobileOpen(false); }}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-lime-400 block"
                          >
                            Manage Series
                          </button>
                          <button
                            onClick={() => { setAdminSubPage('users'); setIsSidebarMobileOpen(false); }}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-lime-400 block"
                          >
                            User Pool
                          </button>
                          <button
                            onClick={() => { setAdminSubPage('comments'); setIsSidebarMobileOpen(false); }}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-lime-400 block"
                          >
                            Comment Controls
                          </button>
                        </nav>
                      </div>

                      <button
                        onClick={handleAdminLogout}
                        className="w-full py-3 bg-red-950/20 border border-red-900/40 text-red-400 hover:text-red-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all block text-center"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Main admin workspace center panel */}
                <main className="flex-1 flex flex-col min-w-0 bg-neutral-950">
                  
                  {/* Top internal bar */}
                  <header className="h-16 border-b border-neutral-900 flex items-center justify-between px-6 bg-neutral-950">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsSidebarMobileOpen(true)}
                        className="md:hidden text-neutral-400 hover:text-white p-1 cursor-pointer focus:outline-none"
                      >
                        <Menu className="h-5 w-5" />
                      </button>
                      
                      <div className="hidden sm:block">
                        <p className="text-xs text-neutral-500 font-mono">WORKSPACE LEVEL ACTIVE • SECURE SANDBOX</p>
                        <h2 className="text-sm font-black text-white uppercase tracking-wider">
                          {adminSubPage === 'dashboard' && 'Stats Room Overview'}
                          {adminSubPage === 'movies' && 'Media Movie Library catalog'}
                          {adminSubPage === 'series' && 'Media Series Library catalog'}
                          {adminSubPage === 'users' && 'Security Registered user pool'}
                          {adminSubPage === 'comments' && 'Audience Review control deck'}
                          {adminSubPage === 'add-form' && (editMovieId ? 'Update media entry schema' : 'Publish new media schema')}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[10px] text-neutral-400 border border-neutral-900 bg-neutral-900/40 px-3.5 py-1.5 rounded-lg">
                      <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse shrink-0"></span>
                      <span>SYNC: COMPLETED</span>
                    </div>
                  </header>

                  {/* Core contents of the Active workspace sub-panel */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    
                    {/* SUBPAGE ROOM: ANALYTICS MONITOR */}
                    {adminSubPage === 'dashboard' && (
                      <div className="space-y-6 animate-fade-in">
                        
                        {/* Summary metric grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          
                          <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-4 right-4 text-lime-400/45 shrink-0">
                              <Film className="h-7 w-7" />
                            </div>
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Active Libraries</p>
                            <h3 className="text-3xl font-black text-white mt-1.5 font-mono">{movies.filter(m => m.contentType === 'movie').length} MOVIES</h3>
                            <p className="text-[10px] text-neutral-400 mt-1">Direct streamable catalogs</p>
                          </div>

                          <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-4 right-4 text-lime-400/45 shrink-0">
                              <Tv className="h-7 w-7" />
                            </div>
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Digital Seasons</p>
                            <h3 className="text-3xl font-black text-white mt-1.5 font-mono">{movies.filter(m => m.contentType === 'series').length} SERIES</h3>
                            <p className="text-[10px] text-neutral-400 mt-1">Multi-episode programs</p>
                          </div>

                          <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-4 right-4 text-lime-400/45 shrink-0">
                              <Users className="h-7 w-7" />
                            </div>
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Audience Accounts</p>
                            <h3 className="text-3xl font-black text-lime-400 mt-1.5 font-mono">{allUsers.length || 4} MEMBERS</h3>
                            <p className="text-[10px] text-neutral-400 mt-1">Registered profile nodes</p>
                          </div>

                          <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-4 right-4 text-lime-400/45 shrink-0">
                              <MessageSquare className="h-7 w-7" />
                            </div>
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Comment Stream</p>
                            <h3 className="text-3xl font-black text-white mt-1.5 font-mono">{allComments.length || 7} REVIEWS</h3>
                            <p className="text-[10px] text-neutral-400 mt-1">Audience ratings published</p>
                          </div>

                          <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-4 right-4 text-lime-400/45 shrink-0">
                              <Star className="h-7 w-7" />
                            </div>
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Median Score</p>
                            <h3 className="text-3xl font-black text-white mt-1.5 font-mono">8.8 / 10</h3>
                            <p className="text-[10px] text-neutral-400 mt-1">Weighted rating algorithm</p>
                          </div>

                          <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-4 right-4 text-lime-400/45 shrink-0">
                              <Eye className="h-7 w-7" />
                            </div>
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Streaming Load</p>
                            <h3 className="text-3xl font-black text-lime-400 mt-1.5 font-mono">1.2 Gbps</h3>
                            <p className="text-[10px] text-neutral-400 mt-1">Symmetrical local buffering</p>
                          </div>

                        </div>

                        {/* Recent critical systems summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          
                          <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl space-y-4">
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">Active Server Context</h4>
                            <div className="space-y-3 font-mono text-[11px] text-neutral-400">
                              <div className="flex justify-between border-b border-neutral-850 pb-1.5">
                                <span>Platform Host Ingress</span>
                                <span className="text-lime-400">0.0.0.0:3000</span>
                              </div>
                              <div className="flex justify-between border-b border-neutral-850 pb-1.5">
                                <span>Internal Database Driver</span>
                                <span className="text-neutral-200">Stateful In-Memory Arrays</span>
                              </div>
                              <div className="flex justify-between border-b border-neutral-850 pb-1.5">
                                <span>API Router Protocol</span>
                                <span className="text-neutral-200">Express Middleware v4</span>
                              </div>
                              <div className="flex justify-between pb-1.5">
                                <span>Administrative Token</span>
                                <span className="text-neutral-400 truncate max-w-xs">{adminToken || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl text-center flex flex-col justify-center items-center p-6 space-y-3">
                            <Shield className="h-10 w-10 text-lime-400 animate-pulse" />
                            <h4 className="text-sm font-black uppercase text-white tracking-widest">Catalog Actions</h4>
                            <p className="text-xs text-neutral-400">Add, edit, or remove videos on-the-fly dynamically sync'd into FastMovie database.</p>
                            <button
                              onClick={openAddForm}
                              className="bg-lime-400 hover:bg-lime-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Add Content Entry
                            </button>
                          </div>

                        </div>

                      </div>
                    )}

                    {/* SUBPAGE ROOM: MANAGE MOVIES GRID */}
                    {adminSubPage === 'movies' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center bg-neutral-900 p-4 rounded-xl border border-neutral-850">
                          <div>
                            <p className="text-xs text-neutral-400 font-mono">Showing {movies.filter(m => m.contentType === 'movie').length} Titles</p>
                          </div>
                          
                          <button
                            onClick={() => {
                              openAddForm();
                              setFormContentType('movie');
                            }}
                            className="bg-lime-400 hover:bg-lime-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Movie
                          </button>
                        </div>

                        <div className="bg-neutral-900 rounded-xl border border-neutral-850 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-neutral-850 bg-neutral-950 text-neutral-450 uppercase font-bold text-[10px] tracking-wider">
                                  <th className="p-4">Poster / Title</th>
                                  <th className="p-4">Genre Tag</th>
                                  <th className="p-4 font-mono">Year</th>
                                  <th className="p-4 font-mono">Length</th>
                                  <th className="p-4 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-900 font-medium">
                                {movies.filter(m => m.contentType === 'movie').map(m => (
                                  <tr key={m.id} className="hover:bg-neutral-905">
                                    <td className="p-4 flex items-center gap-3">
                                      <div className="h-10 w-8 rounded overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                                        <img src={m.img} alt={m.title} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                                      </div>
                                      <span className="font-bold text-white uppercase">{m.title}</span>
                                    </td>
                                    <td className="p-4">
                                      <span className="bg-neutral-950 px-2.5 py-1 rounded-md text-[10px] font-mono border border-neutral-850 uppercase text-neutral-400">
                                        {m.type}
                                      </span>
                                    </td>
                                    <td className="p-4 font-mono text-neutral-300">{m.year}</td>
                                    <td className="p-4 font-mono text-neutral-300">{m.runtime}</td>
                                    <td className="p-4 text-right">
                                      <div className="inline-flex gap-2">
                                        <button 
                                          onClick={() => openEditForm(m)}
                                          className="p-1 px-2.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-lime-400 border border-neutral-850 rounded text-[10px] font-mono uppercase cursor-pointer"
                                        >
                                          Edit
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteMovie(m.id)}
                                          className="p-1 px-2.5 bg-neutral-950 hover:bg-red-950/40 text-neutral-400 hover:text-red-500 border border-neutral-850 rounded text-[10px] font-mono uppercase cursor-pointer"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUBPAGE ROOM: MANAGE SERIES GRID */}
                    {adminSubPage === 'series' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center bg-neutral-900 p-4 rounded-xl border border-neutral-850">
                          <div>
                            <p className="text-xs text-neutral-400 font-mono">Showing {movies.filter(m => m.contentType === 'series').length} Series programs</p>
                          </div>
                          
                          <button
                            onClick={() => {
                              openAddForm();
                              setFormContentType('series');
                            }}
                            className="bg-lime-400 hover:bg-lime-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Series
                          </button>
                        </div>

                        <div className="bg-neutral-900 rounded-xl border border-neutral-850 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-neutral-850 bg-neutral-950 text-neutral-450 uppercase font-bold text-[10px] tracking-wider">
                                  <th className="p-4">Poster / Title</th>
                                  <th className="p-4">Genre Tag</th>
                                  <th className="p-4 font-mono">Year</th>
                                  <th className="p-4 font-mono">Runtime</th>
                                  <th className="p-4 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-900 font-medium">
                                {movies.filter(m => m.contentType === 'series').map(m => (
                                  <tr key={m.id} className="hover:bg-neutral-905">
                                    <td className="p-4 flex items-center gap-3">
                                      <div className="h-10 w-8 rounded overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                                        <img src={m.img} alt={m.title} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                                      </div>
                                      <span className="font-bold text-white uppercase">{m.title}</span>
                                    </td>
                                    <td className="p-4">
                                      <span className="bg-neutral-950 px-2.5 py-1 rounded-md text-[10px] font-mono border border-neutral-850 uppercase text-neutral-400">
                                        {m.type}
                                      </span>
                                    </td>
                                    <td className="p-4 font-mono text-neutral-300">{m.year}</td>
                                    <td className="p-4 font-mono text-neutral-300">{m.runtime}</td>
                                    <td className="p-4 text-right">
                                      <div className="inline-flex gap-2">
                                        <button 
                                          onClick={() => openEditForm(m)}
                                          className="p-1 px-2.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-lime-400 border border-neutral-850 rounded text-[10px] font-mono uppercase cursor-pointer"
                                        >
                                          Edit
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteMovie(m.id)}
                                          className="p-1 px-2.5 bg-neutral-950 hover:bg-red-950/40 text-neutral-400 hover:text-red-500 border border-neutral-850 rounded text-[10px] font-mono uppercase cursor-pointer"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUBPAGE ROOM: USER MANAGEMENT CONTROL */}
                    {adminSubPage === 'users' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-850">
                          <p className="text-xs text-neutral-400 font-mono">Dynamic registered customer pool inside memory nodes</p>
                        </div>

                        <div className="bg-neutral-900 rounded-xl border border-neutral-850 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-neutral-850 bg-neutral-950 text-neutral-450 uppercase font-bold text-[10px] tracking-wider">
                                  <th className="p-4">Member Account</th>
                                  <th className="p-4">Email Coordinates</th>
                                  <th className="p-4 font-mono">Registered node</th>
                                  <th className="p-4">Access Status</th>
                                  <th className="p-4 text-right">Administrative Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-900 font-medium">
                                {allUsers.map(u => (
                                  <tr key={u.id} className="hover:bg-neutral-905">
                                    <td className="p-4 flex items-center gap-2">
                                      <div className="h-6 w-6 rounded-full bg-lime-400 text-black text-[9px] font-black flex items-center justify-center select-none uppercase">
                                        {u.userName.charAt(0)}
                                      </div>
                                      <span className="font-bold text-white">{u.userName}</span>
                                    </td>
                                    <td className="p-4 text-neutral-300 font-mono text-[11px]">{u.email}</td>
                                    <td className="p-4 text-neutral-400 font-mono">{u.joinedDate}</td>
                                    <td className="p-4">
                                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                        u.status === 'Active'
                                          ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20'
                                          : 'bg-red-400/10 text-red-400 border border-red-400/20'
                                      }`}>
                                        {u.status}
                                      </span>
                                    </td>
                                    <td className="p-4 text-right">
                                      <div className="inline-flex gap-2">
                                        <button
                                          onClick={() => handleToggleUserStatus(u.id)}
                                          className="p-1 px-2.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-lime-400 border border-neutral-855 rounded text-[10px] font-mono uppercase cursor-pointer"
                                        >
                                          Toggle Status
                                        </button>
                                        <button
                                          onClick={() => handleDeleteUser(u.id)}
                                          className="p-1 px-2 text-neutral-500 hover:text-red-500 hover:bg-red-950/10 bg-transparent rounded font-bold cursor-pointer"
                                          aria-label="Delete user"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUBPAGE ROOM: CENTRAL COMMENT FEED MODERATION */}
                    {adminSubPage === 'comments' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-850">
                          <p className="text-xs text-neutral-400 font-mono">Central audience reviews stream • click trash to moderate</p>
                        </div>

                        <div className="bg-neutral-900 rounded-xl border border-neutral-850 overflow-hidden animate-fade-in">
                          {allComments.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="border-b border-neutral-850 bg-neutral-950 text-neutral-450 uppercase font-bold text-[10px] tracking-wider">
                                    <th className="p-4">Author display / Rating</th>
                                    <th className="p-4">Media Target</th>
                                    <th className="p-4">Comment Body / Synopsis</th>
                                    <th className="p-4 font-mono text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-900 font-medium">
                                  {allComments.map(c => (
                                    <tr key={c.id} className="hover:bg-neutral-905">
                                      <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                          <span className="font-bold text-white">{c.userName}</span>
                                          <div className="flex items-center gap-0.5 text-lime-400">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-[10px] font-mono font-bold">{c.rating} / 5</span>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-4">
                                        <span className="font-bold text-neutral-200 uppercase truncate max-w-sm block">
                                          {c.movieId}
                                        </span>
                                      </td>
                                      <td className="p-4 text-neutral-350 pr-10 font-sans leading-relaxed">
                                        "{c.text}"
                                      </td>
                                      <td className="p-4 text-right">
                                        <button
                                          onClick={() => handleDeleteComment(c.id)}
                                          className="p-1 px-3 bg-red-955 hover:bg-red-400/10 border border-neutral-850 text-red-450 hover:text-red-450 rounded text-[10px] font-mono uppercase cursor-pointer"
                                        >
                                          Purge
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-xs text-neutral-500 italic text-center py-10 font-sans">No reviews are currently hosted in standard storage pools.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SUBPAGE ROOM: ADD/EDIT DYNAMIC ENTRY SCHEMA FORM */}
                    {adminSubPage === 'add-form' && (
                      <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-6 space-y-6 animate-fade-in max-w-3xl">
                        <div className="border-b border-neutral-855 pb-3">
                          <h3 className="text-sm font-black text-white uppercase tracking-wider">
                            {editMovieId ? `Editing Schema ID: ${editMovieId}` : 'Create Dynamic Media Schema Node'}
                          </h3>
                        </div>

                        <form onSubmit={handleSaveMovie} className="space-y-4 text-xs font-sans">
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            <div className="space-y-1.5 col-span-2 sm:col-span-1">
                              <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest block">Media Title *</label>
                              <input
                                type="text"
                                placeholder="e.g. INTERSTELLAR"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                required
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all font-mono"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1">
                              <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest block">Type Genre tag</label>
                              <select
                                value={formType}
                                onChange={(e) => setFormType(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all uppercase font-mono"
                              >
                                <option value="Sci-Fi">Sci-Fi</option>
                                <option value="Action">Action</option>
                                <option value="Drama">Drama</option>
                                <option value="Thriller">Thriller</option>
                                <option value="Comedy">Comedy</option>
                                <option value="Adventure">Adventure</option>
                              </select>
                            </div>

                            <div className="space-y-1.5 col-span-1">
                              <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest block">Content Format *</label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setFormContentType('movie')}
                                  className={`py-2 px-3.5 border rounded-xl font-bold uppercase transition-all cursor-pointer ${
                                    formContentType === 'movie'
                                      ? 'bg-lime-400 text-black border-lime-400'
                                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                                  }`}
                                >
                                  Movie Node
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFormContentType('series')}
                                  className={`py-2 px-3.5 border rounded-xl font-bold uppercase transition-all cursor-pointer ${
                                    formContentType === 'series'
                                      ? 'bg-lime-400 text-black border-lime-400'
                                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                                  }`}
                                >
                                  tv Series
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1.5 col-span-1">
                              <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest block">Release Year</label>
                              <input
                                type="text"
                                placeholder="e.g. 2026"
                                value={formYear}
                                onChange={(e) => setFormYear(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all font-mono"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1">
                              <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest block">Runtime / seasons</label>
                              <input
                                type="text"
                                placeholder="e.g. 2h 15m or 1 Season"
                                value={formRuntime}
                                onChange={(e) => setFormRuntime(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all font-mono"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-2 sm:col-span-1">
                              <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest block">Poster Illustration image URL</label>
                              <input
                                type="text"
                                placeholder="Poster URL standard https://..."
                                value={formImg}
                                onChange={(e) => setFormImg(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-lime-400 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all font-mono"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-2 sm:col-span-1">
                              <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest block">Backdrop background URL</label>
                              <input
                                type="text"
                                placeholder="Backdrop URL standard https://..."
                                value={formBackdrop}
                                onChange={(e) => setFormBackdrop(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-lime-400 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all font-mono"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-2 sm:col-span-1 font-sans">
                              <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest block">Streaming video path URL</label>
                              <input
                                type="text"
                                placeholder="Streaming path mp4/hls video file"
                                value={formVideoUrl}
                                onChange={(e) => setFormVideoUrl(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-lime-400 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all font-mono"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1">
                              <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest block">Headline Tag (badge label)</label>
                              <input
                                type="text"
                                placeholder="e.g. ADVANCED REVIEWS"
                                value={formInterpreter}
                                onChange={(e) => setFormInterpreter(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all font-mono"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1">
                              <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest block">Director name</label>
                              <input
                                type="text"
                                placeholder="e.g. Christopher Nolan"
                                value={formDirector}
                                onChange={(e) => setFormDirector(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all font-mono"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-2">
                              <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest block">Starring cast roster (separated by comma)</label>
                              <input
                                type="text"
                                placeholder="e.g. Matthew McConaughey, Anne Hathaway"
                                value={formCast}
                                onChange={(e) => setFormCast(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all font-mono"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-2">
                              <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest block flex items-center gap-1">
                                <span>Storyline Synopsis *</span>
                              </label>
                              <textarea
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                required
                                rows={4}
                                placeholder="Enter detailed storyline synopsis of the film or tv series season..."
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all font-sans"
                              />
                            </div>

                          </div>

                          <div className="flex justify-end gap-3.5 border-t border-neutral-855 pt-4">
                            <button
                              type="button"
                              onClick={() => setAdminSubPage(formContentType === 'series' ? 'series' : 'movies')}
                              className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:bg-neutral-850 text-neutral-400 hover:text-white rounded-xl uppercase font-bold text-[10px] tracking-wider transition-all cursor-pointer"
                            >
                              Cancel Form
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-lime-400 hover:bg-lime-500 text-black rounded-xl uppercase font-black text-[10px] tracking-wider transition-all cursor-pointer shadow-md"
                            >
                              Commit Entry Schema
                            </button>
                          </div>

                        </form>
                      </div>
                    )}

                  </div>
                </main>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Styled Footer */}
      <Footer />
      
    </div>
  );
}
