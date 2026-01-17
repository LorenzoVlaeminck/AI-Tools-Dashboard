import React from 'react';
import { ExternalLink, Star, Check } from 'lucide-react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <div className="group relative bg-card rounded-xl border border-white/5 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col h-full">
      
      {/* Image Header */}
      <div className="h-32 bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
        <img 
          src={tool.imageUrl} 
          alt={tool.name} 
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 z-20 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-xs font-medium text-white">
          {tool.priceModel}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{tool.name}</h3>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{tool.category}</span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded text-yellow-500">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-bold">{tool.rating}</span>
            </div>
        </div>
        
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{tool.description}</p>
        
        {/* Features */}
        <div className="mb-6 space-y-1">
            {tool.features.slice(0, 2).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <Check size={12} className="text-green-500" />
                    <span>{feature}</span>
                </div>
            ))}
        </div>

        {/* Footer / CTA */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {tool.monthlyVisits && `${tool.monthlyVisits} visits/mo`}
            </span>
            <a 
              href={tool.affiliateLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/5 hover:bg-primary hover:text-white text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Get Deal <ExternalLink size={14} />
            </a>
        </div>
      </div>
    </div>
  );
};