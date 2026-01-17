import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { Tool, ToolCategory } from '../types';

interface StatsProps {
  tools: Tool[];
}

export const Stats: React.FC<StatsProps> = ({ tools }) => {
  
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(ToolCategory).forEach(c => counts[c] = 0);
    
    tools.forEach(tool => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });

    return Object.keys(counts)
      .filter(key => counts[key] > 0)
      .map(key => ({
        name: key.split(' ')[0], // Shorten name for chart
        fullName: key,
        count: counts[key]
      }));
  }, [tools]);

  const priceData = useMemo(() => {
    const counts: Record<string, number> = { 'Free': 0, 'Freemium': 0, 'Paid': 0 };
    tools.forEach(tool => {
      counts[tool.priceModel] = (counts[tool.priceModel] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [tools]);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Category Distribution */}
      <div className="bg-card p-6 rounded-xl border border-white/5 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">Tools by Category</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                cursor={{ fill: '#334155', opacity: 0.2 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pricing Model Distribution */}
      <div className="bg-card p-6 rounded-xl border border-white/5 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">Pricing Models</h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {priceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute pointer-events-none flex flex-col items-center justify-center text-sm text-gray-400">
            <span className="font-bold text-2xl text-white">{tools.length}</span>
            <span>Total</span>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-2">
            {priceData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};