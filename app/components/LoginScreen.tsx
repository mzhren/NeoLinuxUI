'use client';

import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { backgroundType, backgroundImage, getBackgroundGradient } = useTheme();
  const time = new Date();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }
    
    // 简单验证 - 可以自定义
    onLogin(username);
  };

  const getBackgroundStyle = () => {
    if (backgroundType === 'image' && backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    return {};
  };

  const getBackgroundClass = () => {
    if (backgroundType === 'gradient') {
      return `bg-gradient-to-br ${getBackgroundGradient()}`;
    }
    return '';
  };

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex items-center justify-center ${getBackgroundClass()}`}
      style={getBackgroundStyle()}
    >
      {/* Background overlay */}
      {backgroundType === 'image' && backgroundImage && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      )}

      {/* Animated Background Blobs - Only in gradient mode */}
      {backgroundType === 'gradient' && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      )}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-10">
        <div className="text-white text-xs font-medium">NeoLinux OS</div>
        <div className="flex items-center gap-4 text-white text-xs">
          <span className="text-base">📶</span>
          <span>{time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
          <span>{time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Avatar */}
          <div className="flex justify-center pt-8 pb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl border-4 border-white/20">
              👤
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 pb-8 space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="输入用户名"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="输入密码"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <span className="text-red-400 text-sm">⚠️ {error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              登录
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => onLogin('Guest')}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                以访客身份继续
              </button>
            </div>
          </form>
        </div>

        {/* Hint */}
        <div className="mt-6 text-center text-white/60 text-xs">
          💡 提示：任意用户名和密码即可登录，或点击"以访客身份继续"
        </div>
      </div>
    </div>
  );
}
