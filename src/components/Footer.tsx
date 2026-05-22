import React, { useState } from 'react';
import { Play, Film, MessageCircle, Shield, ArrowUpRight, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus('success');
    setName('');
    setMessage('');
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-black text-gray-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Logo, Slogan & Portfolio Link */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400 text-black shadow-md shadow-lime-400/10">
                <Play className="h-4 w-4 fill-current ml-0.5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                FAST<span className="text-lime-400">MOVIE</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              Your futuristic home of premium high-performance streaming. Get instant access to the world's most captivating movies and immersive TV series.
            </p>
            <div className="pt-2">
              <a 
                href="https://remywilliam.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-lime-400 hover:text-black text-xs font-mono font-bold tracking-tight text-neutral-300 transition-all duration-300"
              >
                <span>View My Portfolio</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-wider text-lime-400 uppercase">Features</h4>
            <ul className="text-xs space-y-2 text-gray-400">
              <li className="flex items-center gap-2"><Film className="h-3.5 w-3.5 text-lime-400" /> Ultra HD Streaming</li>
              <li className="flex items-center gap-2"><MessageCircle className="h-3.5 w-3.5 text-lime-400" /> Custom Community Reviews</li>
              <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-lime-400" /> Secure Server Integrations</li>
            </ul>
          </div>

          {/* Quick Contact Form */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-wider text-lime-400 uppercase">Quick Contact</h4>
            {status === 'success' ? (
              <div className="bg-lime-950/30 border border-lime-400/25 rounded-xl p-4 flex items-start gap-2.5 animate-fade-in">
                <CheckCircle2 className="h-4 w-4 text-lime-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Message Received</h5>
                  <p className="text-[11px] text-lime-400/80 mt-1">Thank you! William will respond to your inquiry shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2 max-w-sm">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400/50 transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={2}
                    placeholder="Your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400/50 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-500 text-black text-xs font-black uppercase tracking-wider transition-colors duration-200 cursor-pointer"
                >
                  <Send className="h-3 w-3" />
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </footer>
  );
}
