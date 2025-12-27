'use client';

import { useState } from 'react';

export default function AppListApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'recent'>('name');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const installedApps = [
    { 
      id: '1', 
      name: 'Terminal', 
      icon: '💻', 
      color: 'from-gray-600 to-gray-800',
      category: 'System',
      description: 'Command line interface',
      lastUsed: '2 minutes ago',
      size: '12 MB'
    },
    { 
      id: '2', 
      name: 'Files', 
      icon: '📁', 
      color: 'from-blue-500 to-cyan-500',
      category: 'System',
      description: 'File manager',
      lastUsed: '5 minutes ago',
      size: '18 MB'
    },
    { 
      id: '3', 
      name: 'System Monitor', 
      icon: '📊', 
      color: 'from-green-500 to-teal-500',
      category: 'Utilities',
      description: 'System resource monitor',
      lastUsed: '1 hour ago',
      size: '8 MB'
    },
    { 
      id: '4', 
      name: 'App Store', 
      icon: '🛍️', 
      color: 'from-purple-500 to-pink-500',
      category: 'System',
      description: 'Download and manage apps',
      lastUsed: '3 hours ago',
      size: '25 MB'
    },
    { 
      id: '5', 
      name: 'Text Editor', 
      icon: '📝', 
      color: 'from-orange-500 to-red-500',
      category: 'Productivity',
      description: 'Simple text editor',
      lastUsed: '10 minutes ago',
      size: '5 MB'
    },
    { 
      id: '6', 
      name: 'Calculator', 
      icon: '🔢', 
      color: 'from-indigo-500 to-blue-600',
      category: 'Utilities',
      description: 'Simple calculator',
      lastUsed: '30 minutes ago',
      size: '3 MB'
    },
    { 
      id: '7', 
      name: 'Music Player', 
      icon: '🎵', 
      color: 'from-pink-500 to-rose-500',
      category: 'Multimedia',
      description: 'Play your favorite music',
      lastUsed: '1 day ago',
      size: '45 MB'
    },
    { 
      id: '8', 
      name: 'Video Player', 
      icon: '🎥', 
      color: 'from-red-500 to-pink-600',
      category: 'Multimedia',
      description: 'Watch videos and movies',
      lastUsed: '3 hours ago',
      size: '68 MB'
    },
    { 
      id: '9', 
      name: 'Image Viewer', 
      icon: '🖼️', 
      color: 'from-yellow-500 to-orange-500',
      category: 'Multimedia',
      description: 'View and edit images',
      lastUsed: '2 days ago',
      size: '22 MB'
    },
    { 
      id: '10', 
      name: 'Web Browser', 
      icon: '🌐', 
      color: 'from-cyan-500 to-blue-500',
      category: 'Internet',
      description: 'Browse the web',
      lastUsed: '15 minutes ago',
      size: '120 MB'
    },
    { 
      id: '11', 
      name: 'Email Client', 
      icon: '📧', 
      color: 'from-blue-600 to-indigo-600',
      category: 'Internet',
      description: 'Manage your emails',
      lastUsed: '2 hours ago',
      size: '65 MB'
    },
    { 
      id: '12', 
      name: 'Calendar', 
      icon: '📅', 
      color: 'from-red-500 to-pink-500',
      category: 'Productivity',
      description: 'Schedule and reminders',
      lastUsed: '1 hour ago',
      size: '15 MB'
    },
    { 
      id: '12', 
      name: 'Settings', 
      icon: '⚙️', 
      color: 'from-gray-500 to-slate-600',
      category: 'System',
      description: 'System preferences',
      lastUsed: '4 hours ago',
      size: '10 MB'
    },
  ];

  const categories = ['All', 'System', 'Productivity', 'Utilities', 'Multimedia', 'Internet'];

  const filteredApps = installedApps
    .filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0; // recent - keep original order
    });

  return (
    <div className="h-full flex flex-col bg-black/30">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-2xl font-bold">Applications</h1>
          <span className="text-white/60">{filteredApps.length} apps</span>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications..."
            className="w-full bg-black/40 text-white px-4 py-3 pl-10 rounded-lg border border-white/20 focus:border-cyan-500 focus:outline-none transition-colors"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">🔍</span>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
              title="Grid View"
            >
              ▦
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
              title="List View"
            >
              ☰
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-black/40 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-cyan-500 focus:outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
            <option value="recent">Recently Used</option>
          </select>
        </div>
      </div>

      {/* App List */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-3 gap-4">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="bg-black/40 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all hover:scale-105 cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-3xl mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                    {app.icon}
                  </div>
                  <h3 className="text-white font-bold mb-1">{app.name}</h3>
                  <p className="text-white/60 text-xs mb-2">{app.category}</p>
                  <p className="text-white/50 text-xs">{app.lastUsed}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="bg-black/40 rounded-lg p-4 border border-white/10 hover:border-white/30 transition-all hover:bg-black/50 cursor-pointer flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold">{app.name}</h3>
                  <p className="text-white/60 text-sm truncate">{app.description}</p>
                </div>
                <div className="flex items-center gap-6 text-sm text-white/60">
                  <span className="whitespace-nowrap">{app.category}</span>
                  <span className="whitespace-nowrap">{app.size}</span>
                  <span className="whitespace-nowrap">{app.lastUsed}</span>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:scale-105 transition-transform">
                  Open
                </button>
              </div>
            ))}
          </div>
        )}

        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg">No applications found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
