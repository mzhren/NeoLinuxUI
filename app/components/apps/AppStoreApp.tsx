'use client';

import { useState } from 'react';
import AppCard from './AppCard';

export default function AppStoreApp() {
  const [activeTab, setActiveTab] = useState<'featured' | 'categories' | 'installed'>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'productivity', name: 'Productivity', icon: '💼', color: 'from-blue-500 to-cyan-500' },
    { id: 'development', name: 'Development', icon: '👨‍💻', color: 'from-purple-500 to-pink-500' },
    { id: 'graphics', name: 'Graphics', icon: '🎨', color: 'from-orange-500 to-red-500' },
    { id: 'multimedia', name: 'Multimedia', icon: '🎬', color: 'from-green-500 to-teal-500' },
    { id: 'games', name: 'Games', icon: '🎮', color: 'from-indigo-500 to-purple-500' },
    { id: 'utilities', name: 'Utilities', icon: '🔧', color: 'from-yellow-500 to-orange-500' },
  ];

  const apps = [
    { 
      id: '1', 
      name: 'VS Code Neo', 
      category: 'development', 
      icon: '💻', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Modern code editor with AI assistance',
      rating: 4.8,
      downloads: '10M+',
      size: '85 MB',
      installed: false
    },
    { 
      id: '2', 
      name: 'Blender Neo', 
      category: 'graphics', 
      icon: '🎨', 
      color: 'from-orange-500 to-red-500',
      description: '3D creation suite for modeling and animation',
      rating: 4.9,
      downloads: '5M+',
      size: '320 MB',
      installed: true
    },
    { 
      id: '3', 
      name: 'Firefox Quantum', 
      category: 'productivity', 
      icon: '🦊', 
      color: 'from-orange-400 to-red-600',
      description: 'Fast, private & safe web browser',
      rating: 4.7,
      downloads: '50M+',
      size: '95 MB',
      installed: true
    },
    { 
      id: '4', 
      name: 'GIMP Studio', 
      category: 'graphics', 
      icon: '🖼️', 
      color: 'from-purple-500 to-pink-500',
      description: 'Professional image editor',
      rating: 4.6,
      downloads: '8M+',
      size: '180 MB',
      installed: false
    },
    { 
      id: '5', 
      name: 'Spotify Neo', 
      category: 'multimedia', 
      icon: '🎵', 
      color: 'from-green-500 to-teal-500',
      description: 'Music streaming service',
      rating: 4.8,
      downloads: '100M+',
      size: '120 MB',
      installed: true
    },
    { 
      id: '6', 
      name: 'Docker Desktop', 
      category: 'development', 
      icon: '🐋', 
      color: 'from-blue-600 to-cyan-600',
      description: 'Containerization platform',
      rating: 4.7,
      downloads: '20M+',
      size: '450 MB',
      installed: false
    },
    { 
      id: '7', 
      name: 'Steam Neo', 
      category: 'games', 
      icon: '🎮', 
      color: 'from-indigo-500 to-purple-500',
      description: 'Gaming platform and store',
      rating: 4.9,
      downloads: '150M+',
      size: '280 MB',
      installed: false
    },
    { 
      id: '8', 
      name: 'LibreOffice', 
      category: 'productivity', 
      icon: '📄', 
      color: 'from-green-600 to-blue-600',
      description: 'Complete office suite',
      rating: 4.5,
      downloads: '30M+',
      size: '350 MB',
      installed: false
    },
  ];

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredApps = apps.filter(app => parseFloat(app.downloads) > 10);
  const installedApps = apps.filter(app => app.installed);

  return (
    <div className="h-full flex flex-col bg-black/30">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-white text-2xl font-bold mb-4">App Store</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps..."
            className="w-full bg-black/40 text-white px-4 py-3 pl-10 rounded-lg border border-white/20 focus:border-cyan-500 focus:outline-none transition-colors"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">🔍</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTab('featured'); setSelectedCategory(null); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'featured'
                ? 'bg-cyan-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            ⭐ Featured
          </button>
          <button
            onClick={() => { setActiveTab('categories'); setSelectedCategory(null); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'categories'
                ? 'bg-cyan-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📂 Categories
          </button>
          <button
            onClick={() => { setActiveTab('installed'); setSelectedCategory(null); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'installed'
                ? 'bg-cyan-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            💾 Installed
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'featured' && (
          <div>
            <h2 className="text-white text-xl font-bold mb-4">Featured Apps</h2>
            <div className="grid grid-cols-2 gap-4">
              {featuredApps.map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            {!selectedCategory ? (
              <>
                <h2 className="text-white text-xl font-bold mb-4">Browse by Category</h2>
                <div className="grid grid-cols-3 gap-4">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all hover:scale-105"
                    >
                      <div className={`text-5xl mb-3 bg-gradient-to-br ${category.color} bg-clip-text text-transparent`}>
                        {category.icon}
                      </div>
                      <div className="text-white font-medium">{category.name}</div>
                      <div className="text-white/60 text-sm mt-1">
                        {apps.filter(a => a.category === category.id).length} apps
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mb-4 text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
                >
                  ← Back to Categories
                </button>
                <h2 className="text-white text-xl font-bold mb-4">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {filteredApps.map(app => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'installed' && (
          <div>
            <h2 className="text-white text-xl font-bold mb-4">Installed Apps ({installedApps.length})</h2>
            <div className="grid grid-cols-2 gap-4">
              {installedApps.map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
