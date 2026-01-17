import React, { useState } from 'react';
import { ExternalLink, Star, Check, Tag, Heart, Share2, Loader2 } from 'lucide-react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, isFavorite, onToggleFavorite, onClick }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite();
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Use native share if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${tool.name}`,
          text: tool.description,
          url: tool.affiliateLink,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(tool.affiliateLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  const handleClaimClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClaiming(true);
    setTimeout(() => setIsClaiming(false), 2000);
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-card rounded-xl border border-white/5 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col h-full cursor-pointer"
    >
      
      {/* Image Header */}
      <div className="relative h-36 bg-gray-800 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
        <img 
          src={tool.imageUrl} 
          alt={tool.name} 
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges (Top Left) */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 items-start pointer-events-none">
            <div className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-xs font-medium text-white shadow-sm">
                {tool.priceModel}
            </div>
            {tool.offer && (
              <div className="bg-gradient-to-r from-primary to-secondary text-white px-2 py-1 rounded-md shadow-lg text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                <Tag size={10} fill="currentColor" />
                {tool.offer}
              </div>
            )}
        </div>

        {/* Action Buttons (Top Right) */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            {/* Share Button */}
            <button 
                onClick={handleShareClick}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 transition-colors group/btn"
                aria-label="Share tool"
                title={isCopied ? "Link Copied!" : "Share Tool"}
            >
                {isCopied ? (
                   <Check size={16} className="text-green-400" />
                ) : (
                   <Share2 
                    size={16} 
                    className="text-white group-hover/btn:text-primary transition-colors" 
                   />
                )}
            </button>

            {/* Favorite Button */}
            <button 
                onClick={handleFavoriteClick}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 transition-colors group/btn"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                <Heart 
                  size={16} 
                  className={`transition-all duration-300 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-white group-hover/btn:text-red-400"}`} 
                />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{tool.name}</h3>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{tool.category}</span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded text-yellow-500 shrink-0">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-bold">{tool.rating}</span>
            </div>
        </div>
        
        <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">{tool.description}</p>
        
        {/* Features */}
        <div className="mb-6 space-y-2">
            {tool.features.slice(0, 5).map((feature, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <Check size={12} className="text-primary shrink-0 mt-0.5" />
                    <span className="leading-tight">{feature}</span>
                </div>
            ))}
            {tool.features.length > 5 && (
               <div className="text-xs text-primary/80 italic pl-5">
                 +{tool.features.length - 5} more features
               </div>
            )}
        </div>

        {/* Footer / CTA */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              {tool.monthlyVisits && `${tool.monthlyVisits} visits`}
            </span>
            <a 
              href={tool.affiliateLink} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleClaimClick}
              aria-label={`Get deal for ${tool.name}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform active:scale-95 z-20 relative ${
                isClaiming 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 cursor-wait" 
                  : "bg-white/5 hover:bg-primary hover:text-white text-gray-200 border border-white/10 hover:border-primary/50"
              }`}
            >
              {isClaiming ? (
                 <>
                   <span>Opening</span>
                   <Loader2 size={14} className="animate-spin" />
                 </>
              ) : (
                 <>
                   Claim Deal <ExternalLink size={14} />
                 </>
              )}
            </a>
        </div>
      </div>
    </div>
  );
};