/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronDown, Heart, MapPin, Music, Send, Share2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

import Countdown from './components/Countdown';
import EventCard from './components/EventCard';
import { INVITATION_DATA } from './constants';
import { supabase } from './supabase';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [wishForm, setWishForm] = useState({ name: '', message: '' });
  const [isWishSent, setIsWishSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasStartedMusic, setHasStartedMusic] = useState(false);

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name || !wishForm.message) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('wishes')
        .insert([{ name: wishForm.name, message: wishForm.message }]);

      if (error) throw error;

      setIsWishSent(true);
      setWishForm({ name: '', message: '' });
      setTimeout(() => setIsWishSent(false), 5000);
    } catch (error) {
      console.error('Error sending wish:', error);
      alert('Sorry, there was an error saving your wish. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  // Audio starts muted via autoPlay+muted attributes. Unmute on first interaction.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Mark as playing once autoplay kicks in
    const onPlay = () => {
      setIsMusicPlaying(true);
      setHasStartedMusic(true);
    };
    audio.addEventListener('play', onPlay, { once: true });

    // Unmute on first user interaction
    const unmute = () => {
      audio.muted = false;
      audio.volume = 0.5;
      if (audio.paused) {
        audio.play().catch(() => {});
      }
      setIsMusicPlaying(true);
      setHasStartedMusic(true);
    };

    const events = ['click', 'scroll', 'touchstart', 'keydown'];
    events.forEach(e => window.addEventListener(e, unmute, { passive: true, once: true }));

    return () => {
      audio.removeEventListener('play', onPlay);
      events.forEach(e => window.removeEventListener(e, unmute));
    };
  }, []);

  const pauseMusic = () => {
    const audio = audioRef.current;
    if (!audio || !isMusicPlaying) return;
    audio.pause();
    setIsMusicPlaying(false);
  };


  const shareMessage = `A beautiful beginning of a new journey \u{1F4AB}

*${INVITATION_DATA.groom} \u{2764}\u{FE0F} ${INVITATION_DATA.bride}*

You are warmly invited to celebrate with us.
Experience the full invitation here:
\u{1F517} ${window.location.href}`;

  const handleShare = async () => {
    const shareData = {
      title: `${INVITATION_DATA.groom} & ${INVITATION_DATA.bride}'s Wedding`,
      text: shareMessage,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareMessage);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 3000);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen bg-secondary overflow-x-hidden selection:bg-primary/20 selection:text-primary"
    >
      {/* Background Music Player */}
      <audio
        ref={audioRef}
        src="/music-of-love.mp3"
        loop
        autoPlay
        muted
        preload="auto"
      />
      {/* Copy Toast */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: showCopyToast ? 1 : 0, y: showCopyToast ? 0 : 50 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-6 py-3 rounded-full shadow-2xl text-sm font-medium tracking-widest uppercase pointer-events-none"
      >
        Link Copied to Clipboard
      </motion.div>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-pattern pointer-events-none z-0" />

      {/* Floating Music Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={pauseMusic}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-white/80 backdrop-blur-lg shadow-xl flex items-center justify-center text-primary hover:scale-110 transition-transform"
      >
        <Music className={isMusicPlaying ? "animate-pulse" : "opacity-40"} size={24} />
      </motion.button>

      {/* Hero Section */}
      <section className="relative h-[100dvh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={INVITATION_DATA.heroImage} 
            alt="Wedding Hero" 
            className="w-full h-full object-cover brightness-[0.85]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-secondary" />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-4"
          >
            <span className="text-white/90 uppercase tracking-[0.4em] text-xs font-bold drop-shadow-lg">
              The Wedding of
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-white italic leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              {INVITATION_DATA.groom} <br />
              <span className="text-3xl sm:text-5xl not-italic font-accent opacity-90 block my-2 drop-shadow-md">&</span>
              {INVITATION_DATA.bride}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-white font-serif text-2xl sm:text-3xl tracking-[0.2em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {new Date(INVITATION_DATA.weddingDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </motion.div>
        </div>

        {/* Scroll Down Indicator - Arrow style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white z-10 select-none"
          onPointerDown={(e) => {
            e.preventDefault();
            const next = document.querySelector('section:nth-of-type(2)') as HTMLElement;
            if (next) next.scrollIntoView({ behavior: 'smooth' });
            else window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
          }}
        >
          <span className="text-[10px] uppercase tracking-widest drop-shadow-md opacity-70">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={28} strokeWidth={1.5} className="drop-shadow-md" />
          </motion.div>
        </motion.div>
      </section>

      {/* Content Wrapper */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-24 space-y-32">
        
        {/* Countdown Section */}
        <section className="pt-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-center gap-4 text-primary/40">
              <div className="h-px w-12 bg-current" />
              <Heart size={20} className="fill-current" />
              <div className="h-px w-12 bg-current" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-primary italic">Counting Down to the Celebration</h2>
            <Countdown targetDate={INVITATION_DATA.weddingDate} />
          </motion.div>
        </section>

        {/* Welcome Section */}
        <section className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center space-y-6"
          >
            <h2 className="text-4xl sm:text-5xl font-serif text-primary italic">{INVITATION_DATA.welcome.title}</h2>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-md group">
              <img 
                src={INVITATION_DATA.welcome.image} 
                alt="Welcome" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl" />
            </div>
            <p className="text-lg leading-relaxed text-text/70 font-accent max-w-lg mx-auto italic whitespace-pre-line text-center">
              "{INVITATION_DATA.welcome.content}"
            </p>
          </motion.div>
        </section>

        {/* Save the Date Section */}
        <section className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold opacity-60">Save the Date</p>
            <div className="flex items-center justify-center gap-8">
              <div className="text-right">
                <p className="font-serif text-4xl text-primary">Sunday</p>
                <p className="text-xs uppercase tracking-widest opacity-60">April</p>
              </div>
              <div className="w-px h-16 bg-primary/20" />
              <div className="text-left">
                <p className="font-serif text-6xl text-primary font-bold">26</p>
                <p className="text-xs uppercase tracking-widest opacity-60">2026</p>
              </div>
            </div>
            <p className="font-accent italic text-xl text-text/60 pt-4">At Ten O'Clock in the Morning</p>
          </motion.div>
        </section>

        {/* Events Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold opacity-60">Join Our Celebration</p>
            <h2 className="text-4xl sm:text-5xl font-serif text-primary italic">The Ceremonies</h2>
          </div>
          <div className="space-y-8">
            {INVITATION_DATA.events.map((event, index) => (
              <EventCard key={index} event={event} index={index} />
            ))}
          </div>
        </section>

        {/* Venue Section */}
        <section className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold opacity-60">The Location</p>
              <h2 className="text-4xl sm:text-5xl font-serif text-primary italic">The Venue</h2>
            </div>
            
            <div className="glass-card overflow-hidden rounded-3xl shadow-xl group">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={INVITATION_DATA.venueImage || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2074&auto=format&fit=crop"} 
                  alt="Venue" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="p-8 space-y-6 text-center">
                <div className="space-y-2">
                  <h3 className="text-primary font-serif text-3xl font-bold italic">{INVITATION_DATA.events[0].venue}</h3>
                  <p className="text-text/60 text-sm uppercase tracking-widest font-bold">Harihar, Karnataka</p>
                </div>
                <p className="text-text/70 leading-relaxed italic font-accent max-w-md mx-auto">
                  We have chosen a beautiful space to celebrate our special day. 
                  We can't wait to see you there!
                </p>
                <a 
                  href={INVITATION_DATA.events[0].locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-medium tracking-widest uppercase text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group/btn"
                >
                  <MapPin size={16} className="group-hover:animate-bounce" />
                  View on Map
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Wishes Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold opacity-60">Leave a Message</p>
            <h2 className="text-4xl sm:text-5xl font-serif text-primary italic">Wishes for the Couple</h2>
          </div>
          
          {isWishSent ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Heart size={32} className="fill-current" />
              </div>
              <h3 className="text-2xl font-serif text-primary italic">Thank You!</h3>
              <p className="text-text/70">Your wishes have been sent to the couple.</p>
            </motion.div>
          ) : (
            <form className="glass-card p-8 space-y-6" onSubmit={handleWishSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-60 font-medium">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={wishForm.name}
                  onChange={(e) => setWishForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full bg-white/50 border border-primary/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-60 font-medium">Your Message</label>
                <textarea 
                  rows={4}
                  required
                  value={wishForm.message}
                  onChange={(e) => setWishForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Write your wishes here..."
                  className="w-full bg-white/50 border border-primary/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>
              <button 
                type="submit"
                disabled={isSending}
                className="w-full py-4 rounded-xl bg-primary text-white font-medium tracking-widest uppercase text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
                {isSending ? 'Sending...' : 'Send Wishes'}
              </button>
            </form>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center space-y-8 pt-12">
          <div className="flex items-center justify-center gap-4 text-primary/20">
            <div className="h-px w-24 bg-current" />
            <Heart size={24} className="fill-current" />
            <div className="h-px w-24 bg-current" />
          </div>
          <div className="space-y-2">
            <p className="font-serif text-2xl text-primary italic">With Love,</p>
            <p className="font-serif text-3xl text-primary font-bold">{INVITATION_DATA.groom} & {INVITATION_DATA.bride}</p>
          </div>
          <div className="flex justify-center gap-6 pt-8">
            <button 
              onClick={handleShare}
              className="flex flex-col items-center gap-2 text-text/40 hover:text-primary transition-colors"
            >
              <Share2 size={20} />
              <span className="text-[10px] uppercase tracking-widest">Share</span>
            </button>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-text/30 pt-12">
            Made with Love for Hemanth & Priyanka
          </p>
        </footer>

      </div>
    </div>
  );
}

