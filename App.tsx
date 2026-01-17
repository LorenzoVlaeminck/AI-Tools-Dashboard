import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { AI_TOOLS_DATA } from './constants';
import { ToolCategory } from './types';
import { ToolCard } from './components/ToolCard';
import { Stats } from './components/Stats';
import { AiConcierge } from './components/AiConcierge';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const filteredTools = useMemo(() => {
    return AI_TOOLS_DATA.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const categories = ['All', ...Object.values(ToolCategory)];

  return (
    <div className="min-h-screen pb-20">
      
      {/* Navigation / Header */}
      <nav className="sticky top-0 z-40 bg-dark/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                 <LayoutGrid className="text-white" size={24} />
              </div>
              <div className="leading-tight">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Affiliate<span className="text-primary">Hub</span>
                </h1>
                <p className="text-xs text-gray-400">Best AI Tools Database</p>
              </div>
            </div>
            
            {/* Desktop Search */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-end max-w-md">
               <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search tools (e.g. 'video editor')..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-card border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary/50 transition-colors"
                  />
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Supercharge your workflow with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI</span>
          </h2>
          <p className="text-gray-400 max-w-2xl text-lg">
            Discover the highest-rated tools for content creation, productivity, and development. 
            Updated daily from our curated database.
          </p>
        </div>

        {/* Dashboard Stats */}
        <Stats tools={AI_TOOLS_DATA} />

        {/* Filters & Search (Mobile) */}
        <div className="sticky top-20 z-30 bg-dark/95 backdrop-blur-sm py-4 -mx-4 px-4 md:static md:bg-transparent md:p-0 md:mx-0 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'bg-card text-gray-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="md:hidden w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-200"
            />
          </div>
        </div>

        {/* Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4 text-gray-600">
               <Search size={32} />
             </div>
             <h3 className="text-xl font-semibold text-white mb-2">No tools found</h3>
             <p className="text-gray-500">Try adjusting your search or category filter.</p>
          </div>
        )}
      </main>

      <AiConcierge />
    </div>
  );
};

export default App;