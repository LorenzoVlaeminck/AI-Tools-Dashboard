import React, { useEffect } from 'react';
import { X, ExternalLink, Globe, Star, Shield, Zap, Users, Tag, Heart, CheckCircle2, MessageSquare } from 'lucide-react';
import { Tool } from '../types';

interface ToolDetailModalProps {
  tool: Tool;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({ tool, onClose, isFavorite, onToggleFavorite }) => {
  
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-in-scale">
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Header Image Section */}
          <div className="relative h-48 sm:h-64 w-full shrink-0">
             <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent z-10" />
             <img 
               src={tool.imageUrl} 
               alt={tool.name} 
               className="w-full h-full object-cover opacity-80"
             />
             
             {/* Close Button */}
             <button 
               onClick={onClose}
               className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all"
             >
               <X size={20} />
             </button>

             {/* Favorite Button */}
             <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                className="absolute top-4 right-16 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 transition-colors group"
            >
                <Heart 
                  size={20} 
                  className={`transition-all duration-300 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-white/80 group-hover:text-red-400"}`} 
                />
            </button>

             {/* Title & Badges Overlay */}
             <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
               <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                 <div>
                   <div className="flex items-center gap-3 mb-2">
                     <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide backdrop-blur-md">
                       {tool.category}
                     </span>
                     <span className="bg-white/10 text-white border border-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
                       {tool.priceModel}
                     </span>
                   </div>
                   <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 shadow-sm">{tool.name}</h2>
                   <div className="flex items-center gap-4 text-sm text-gray-300">
                     <div className="flex items-center gap-1 text-yellow-400">
                       <Star size={16} fill="currentColor" />
                       <span className="font-bold">{tool.rating}</span>
                       <span className="text-gray-400 font-normal ml-1">(Editor Rating)</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <Users size={16} />
                       <span>{tool.monthlyVisits} monthly visits</span>
                     </div>
                   </div>
                 </div>
                 
                 {/* Desktop CTA */}
                 <div className="hidden sm:block">
                    <a 
                      href={tool.affiliateLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95"
                    >
                      Visit Website <ExternalLink size={20} />
                    </a>
                 </div>
               </div>
             </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Description */}
              <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Shield size={20} className="text-secondary" />
                  About {tool.name}
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {tool.description}
                  <br /><br />
                  This tool is widely recognized in the <strong>{tool.category}</strong> space. 
                  Whether you are a beginner or a pro, {tool.name} offers a robust set of features designed to streamline your workflow.
                </p>
              </section>

              {/* Features Grid */}
              <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-yellow-400" />
                  Key Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tool.features.map((feature, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Simulated Reviews */}
              <section className="bg-white/5 rounded-xl p-6 border border-white/5">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MessageSquare size={20} className="text-blue-400" />
                  User Feedback Analysis
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                     <div className="text-4xl font-bold text-white">{tool.rating}</div>
                     <div className="flex flex-col">
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < Math.floor(tool.rating) ? "currentColor" : "none"} className={i >= Math.floor(tool.rating) ? "opacity-30" : ""} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">Based on market reputation & user sentiment</span>
                     </div>
                  </div>
                  <div className="h-px bg-white/10 w-full my-1"></div>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-300 italic">"One of the most reliable tools in the {tool.category.toLowerCase()} category. The interface is intuitive and the output quality is consistently high."</p>
                    <p className="text-sm text-gray-300 italic">"Great value for the price model. Highly recommended for content creators looking to scale."</p>
                  </div>
                </div>
              </section>

            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* Offer Card */}
              {tool.offer && (
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-20">
                    <Tag size={64} />
                  </div>
                  <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                    <Tag size={18} className="text-primary" />
                    Special Deal
                  </h4>
                  <p className="text-2xl font-bold text-white mb-2">{tool.offer}</p>
                  <p className="text-xs text-gray-400 mb-4">Exclusive offer for our community members.</p>
                  <a 
                    href={tool.affiliateLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-white text-primary font-bold py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    Claim Offer
                  </a>
                </div>
              )}

              {/* Information Cards */}
              <div className="bg-card border border-white/10 rounded-xl p-5 space-y-4">
                <h4 className="font-semibold text-gray-200 border-b border-white/5 pb-2">Tool Details</h4>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Pricing Model</span>
                  <span className="text-white font-medium">{tool.priceModel}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Monthly Traffic</span>
                  <span className="text-white font-medium">{tool.monthlyVisits}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="text-white font-medium text-right">{tool.category}</span>
                </div>

                <div className="pt-4 mt-2">
                  <a 
                    href={tool.affiliateLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 py-2.5 rounded-lg text-sm font-medium transition-all"
                  >
                    <Globe size={16} /> Official Website
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* Mobile Sticky Footer */}
        <div className="sm:hidden p-4 border-t border-white/10 bg-card/95 backdrop-blur z-30">
          <a 
              href={tool.affiliateLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg"
            >
              Visit Website <ExternalLink size={20} />
            </a>
        </div>

      </div>
    </div>
  );
};