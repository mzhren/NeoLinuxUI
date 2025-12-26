'use client';

import { useState } from 'react';

export default function BrowserApp() {
  const [url, setUrl] = useState('https://www.bing.com');
  const [inputUrl, setInputUrl] = useState('https://www.bing.com');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let finalUrl = inputUrl.trim();
    
    // Add https:// if no protocol specified
    if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    if (finalUrl) {
      setIsLoading(true);
      setUrl(finalUrl);
      setInputUrl(finalUrl);
    }
  };

  const handleBack = () => {
    // Note: iframe doesn't support back/forward navigation
    alert('Navigation history is not available in iframe mode');
  };

  const handleForward = () => {
    alert('Navigation history is not available in iframe mode');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setUrl(url + '?refresh=' + Date.now());
  };

  const handleHome = () => {
    const homeUrl = 'https://www.bing.com';
    setInputUrl(homeUrl);
    setUrl(homeUrl);
    setIsLoading(true);
  };

  const quickLinks = [
    { name: 'Bing', url: 'https://www.bing.com', icon: '🔍' },
    { name: 'GitHub', url: 'https://github.com', icon: '💻' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: '📺' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: '📚' },
    { name: 'Reddit', url: 'https://www.reddit.com', icon: '🤖' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '📊' },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Browser Toolbar */}
      <div className="flex items-center gap-2 p-3 bg-slate-800/90 border-b border-slate-700">
        {/* Navigation Buttons */}
        <div className="flex gap-1">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors widget-interactive"
            title="后退"
          >
            ◀
          </button>
          <button
            onClick={handleForward}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors widget-interactive"
            title="前进"
          >
            ▶
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors widget-interactive"
            title="刷新"
          >
            ↻
          </button>
          <button
            onClick={handleHome}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors widget-interactive"
            title="主页"
          >
            🏠
          </button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleNavigate} className="flex-1 flex gap-2">
          <div className="flex-1 flex items-center bg-slate-900 rounded-lg px-3 py-2 border border-slate-600 focus-within:border-blue-500">
            <span className="text-gray-400 mr-2">🔒</span>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="输入网址..."
              className="flex-1 bg-transparent outline-none text-sm widget-interactive"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors widget-interactive"
          >
            Go
          </button>
        </form>
      </div>

      {/* Quick Links */}
      <div className="flex gap-2 p-2 bg-slate-800/50 border-b border-slate-700 overflow-x-auto">
        {quickLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => {
              setInputUrl(link.url);
              setUrl(link.url);
              setIsLoading(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600 rounded-lg transition-colors whitespace-nowrap widget-interactive"
          >
            <span>{link.icon}</span>
            <span className="text-xs">{link.name}</span>
          </button>
        ))}
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-white">Loading...</p>
            </div>
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            alert('页面加载失败，可能是网站不允许嵌入或网络问题');
          }}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          title="浏览器内容"
        />
      </div>
    </div>
  );
}
