import React, { useState } from 'react';
import { Film, Tv, Sparkles, Heart, Menu, X, Play } from 'lucide-react';

interface NavbarProps {
  activePage: 'home' | 'movies' | 'series';
  setActivePage: (page: 'home' | 'movies' | 'series') => void;
  onGoHome: () => void;
}

export default function Navbar({ activePage, setActivePage, onGoHome }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'series', label: 'Series', icon: Tv },
  ] as const;

  const handleNavClick = (page: 'home' | 'movies' | 'series') => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div 
          onClick={onGoHome} 
          className="flex cursor-pointer items-center gap-2 group transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black shadow-lg shadow-lime-400/20 group-hover:scale-105 transition-transform duration-300">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            FAST<span className="text-lime-400">MOVIE</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
              activePage === 'home'
                ? 'text-lime-400 bg-white/[0.04]'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            Home
          </button>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  activePage === item.id
                    ? 'text-lime-400 bg-white/[0.04] shadow-sm shadow-lime-400/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Hamburger Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 hover:text-white focus:outline-none md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.05] bg-black px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all ${
              activePage === 'home'
                ? 'text-lime-400 bg-lime-400/10'
                : 'text-gray-300 hover:bg-white/[0.03]'
            }`}
          >
            Home
          </button>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-all ${
                  activePage === item.id
                    ? 'text-lime-400 bg-lime-400/10'
                    : 'text-gray-300 hover:bg-white/[0.03]'
                }`}
              >
                <Icon className="h-5 w-5 text-lime-400" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
