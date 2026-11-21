import React from 'react';
import { BookOpen, Film, Heart } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#E8E3D9] dark:border-[#282522] bg-[#F5F1E9] dark:bg-[#13110F] text-[#6B6357] dark:text-[#9A9184] py-12 px-4 sm:px-6 lg:px-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#722F37] text-white flex items-center justify-center font-editorial font-bold text-lg">
              B
            </div>
            <span className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              Bookend
            </span>
          </div>
          <p className="text-sm max-w-md text-[#786F63] dark:text-[#9A9184] leading-relaxed">
            A social discovery ecosystem connecting book lovers and the stories adapted from them. Discover literature, vote on book vs screen fidelity, get explainable recommendations, and debate transformative fan theories in StoryLab.
          </p>
          <div className="text-xs text-[#8A8175] flex items-center gap-1.5 pt-2">
            <span>Distributed Microservices Architecture</span>
            <span>•</span>
            <span>RabbitMQ Event Broker</span>
            <span>•</span>
            <span>FastAPI NextRead Engine</span>
          </div>
        </div>

        <div>
          <h4 className="font-editorial font-bold text-sm text-[#1F1D1A] dark:text-[#EDE8E1] mb-3 uppercase tracking-wider">
            Explore
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('discover')} className="hover:text-[#722F37] dark:hover:text-[#C5A059] transition-colors">
                Discover Feed
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('page-to-screen')} className="hover:text-[#722F37] dark:hover:text-[#C5A059] transition-colors">
                Page to Screen Adaptations
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('nextread')} className="hover:text-[#722F37] dark:hover:text-[#C5A059] transition-colors">
                NextRead Recommendations
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shelfmatch')} className="hover:text-[#722F37] dark:hover:text-[#C5A059] transition-colors">
                ShelfMatch Reader Compatibility
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('storylab')} className="hover:text-[#722F37] dark:hover:text-[#C5A059] transition-colors">
                StoryLab Creative Pitches
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-editorial font-bold text-sm text-[#1F1D1A] dark:text-[#EDE8E1] mb-3 uppercase tracking-wider">
            Architecture
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('architecture')} className="hover:text-[#722F37] dark:hover:text-[#C5A059] transition-colors flex items-center gap-1">
                <span>Interactive Architecture Diagram</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            </li>
            <li>
              <a href="#demo" onClick={(e) => { e.preventDefault(); onNavigate('architecture'); }} className="hover:text-[#722F37] dark:hover:text-[#C5A059]">
                Event-Driven Flow (RabbitMQ)
              </a>
            </li>
            <li>
              <a href="#idempotency" onClick={(e) => { e.preventDefault(); onNavigate('architecture'); }} className="hover:text-[#722F37] dark:hover:text-[#C5A059]">
                Idempotency & Resilience Docs
              </a>
            </li>
            <li>
              <a href="#health" onClick={(e) => { e.preventDefault(); onNavigate('architecture'); }} className="hover:text-[#722F37] dark:hover:text-[#C5A059]">
                Live Microservice Health
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#E8E3D9]/60 dark:border-[#282522]/60 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © 2026 Bookend. Built as a portfolio-quality distributed systems & full-stack application.
        </div>
        <div className="flex items-center gap-1 text-[#8A8175]">
          <span>Designed with intentional typography and restrained editorial palette.</span>
        </div>
      </div>
    </footer>
  );
};
