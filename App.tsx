import React, { useState, useMemo, useEffect } from 'react';
import { Search, LayoutGrid, RefreshCw, CheckCircle2, Check, Heart, ChevronDown, Star } from 'lucide-react';
import { AI_TOOLS_DATA } from './constants';
import { ToolCategory, Tool } from './types';
import { ToolCard } from './components/ToolCard';
import { Stats } from './components/Stats';
import { AiConcierge } from './components/AiConcierge';
import { fetchToolsFromNotion } from './services/notionService';
import { ToolDetailModal } from './components/ToolDetailModal';

const App: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>(AI_TOOLS_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [showToast, setShowToast] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Favorites state with local storage persistence
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteTools');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('favoriteTools', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const freshTools = await fetchToolsFromNotion();
      setTools(freshTools);
      setLastSynced(new Date());
      
      // Show success toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Failed to sync with Notion", error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategory === 'Favorites') {
        matchesCategory = favoriteIds.includes(tool.id);
      } else if (selectedCategory !== 'All') {
        matchesCategory = tool.category === selectedCategory;
      }

      const matchesRating = tool.rating >= minRating;

      return matchesSearch && matchesCategory && matchesRating;
    });
  }, [searchTerm, selectedCategory, minRating, tools, favoriteIds]);

  // Insert 'Favorites' after 'All'
  const categories = ['All', 'Favorites', ...Object.values(ToolCategory)];

  return (
    <div className="min-h-screen pb-20 relative">
      
      {/* Detail Modal */}
      {selectedTool && (
        <ToolDetailModal 
          tool={selectedTool} 
          onClose={() => setSelectedTool(null)}
          isFavorite={favoriteIds.includes(selectedTool.id)}
          onToggleFavorite={() => toggleFavorite(selectedTool.id)}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-4 z-50 bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in-up backdrop-blur-md">
          <Check size={18} />
          <span className="text-sm font-semibold">Affiliate Links Updated from Notion</span>
        </div>
      )}

      {/* Navigation / Header */}
      <nav className="sticky top-0 z-40 bg-dark/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                 <LayoutGrid className="text-white" size={24} />
              </div>
              <div className="leading-tight">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Creator<span className="text-primary">Stack</span>
                </h1>
                <p className="text-xs text-gray-400">Curated AI Tools</p>
              </div>
            </div>
            
            {/* Desktop Search & Sync */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-end max-w-xl">
               <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search tools..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-card border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary/50 transition-colors"
                  />
               </div>
               
               <button 
                onClick={handleSync}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 px-3 py-2 rounded-full transition-all active:scale-95"
                title="Sync from Notion Database"
               >
                 <RefreshCw size={14} className={isSyncing ? "animate-spin text-primary" : "text-gray-400"} />
                 {isSyncing ? "Syncing..." : "Sync DB"}
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Best AI Tools for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Content Creation</span>
            </h2>
            <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
              Supercharge your creative workflow with our hand-picked selection of the best AI tools. 
              Exclusive affiliate offers updated daily.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 whitespace-nowrap">
             <CheckCircle2 size={12} />
             <span>Database synced: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <Stats tools={tools} />
        </div>

        {/* Filters & Search (Mobile/Tablet) */}
        <div className="sticky top-20 z-30 bg-dark/95 backdrop-blur-md py-4 -mx-4 px-4 md:static md:bg-transparent md:p-0 md:mx-0 mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-white/5 md:border-none animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'bg-card text-gray-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                {cat === 'Favorites' && <Heart size={14} className={selectedCategory === 'Favorites' ? 'fill-white' : ''} />}
                {cat}
              </button>
            ))}
          </div>
          
          {/* Rating Filter */}
          <div className="w-full md:w-auto">
             <div className="relative group">
                <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none" size={14} fill={minRating > 0 ? "currentColor" : "none"} />
                <select 
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full md:w-48 bg-card border border-white/10 text-gray-300 text-sm rounded-full pl-9 pr-10 py-2.5 appearance-none focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4.0}>4.0+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4.7}>4.7+ Stars</option>
                  <option value={4.8}>4.8+ Stars</option>
                  <option value={4.9}>4.9+ Stars</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-gray-300 transition-colors" size={16} />
             </div>
          </div>

          <div className="md:hidden w-full flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-card border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-200 focus:border-primary/50 outline-none"
              />
            </div>
            <button 
                onClick={handleSync}
                className="bg-card border border-white/10 text-gray-300 px-3 rounded-lg flex items-center justify-center active:bg-white/5"
               >
                 <RefreshCw size={18} className={isSyncing ? "animate-spin text-primary" : ""} />
            </button>
          </div>
        </div>

        {/* Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <div 
                key={tool.id}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${Math.min((index % 12) * 50, 500)}ms` }}
              >
                <ToolCard 
                  tool={tool} 
                  isFavorite={favoriteIds.includes(tool.id)}
                  onToggleFavorite={() => toggleFavorite(tool.id)}
                  onClick={() => setSelectedTool(tool)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
             <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4 text-gray-600">
               {selectedCategory === 'Favorites' ? <Heart size={32} /> : <Search size={32} />}
             </div>
             <h3 className="text-xl font-semibold text-white mb-2">
               {selectedCategory === 'Favorites' ? 'No favorites yet' : 'No tools found'}
             </h3>
             <p className="text-gray-500">
               {selectedCategory === 'Favorites' 
                 ? 'Mark tools as favorites to see them here.' 
                 : 'Try adjusting your search or category filter.'}
             </p>
          </div>
        )}
      </main>

      <AiConcierge tools={tools} />
    </div>
  );
};

export default App;