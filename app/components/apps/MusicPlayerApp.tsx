'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

export default function MusicPlayerApp() {
  const { theme, accentColor, getBackdropBlurClass } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 示例音乐列表 - 使用免费的音频文件
  const playlist = [
    {
      title: 'Lofi Hip Hop Beat',
      artist: 'Sample Artist',
      url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'
    },
    {
      title: 'Chill Vibes',
      artist: 'Relaxing Music',
      url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_4deafc42dc.mp3',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
    },
    {
      title: 'Ambient Dreams',
      artist: 'Ambient Sounds',
      url: 'https://cdn.pixabay.com/audio/2022/08/23/audio_d1718ab41b.mp3',
      cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop'
    },
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else if (currentTrack < playlist.length - 1) {
        setCurrentTrack(currentTrack + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeat, currentTrack, playlist.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = playlist[currentTrack].url;
    if (isPlaying) {
      audio.play().catch(e => console.error('播放失败:', e));
    }
  }, [currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error('播放失败:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const nextTrack = () => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrack(randomIndex);
    } else {
      setCurrentTrack((currentTrack + 1) % playlist.length);
    }
  };

  const prevTrack = () => {
    setCurrentTrack((currentTrack - 1 + playlist.length) % playlist.length);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const track = playlist[currentTrack];

  return (
    <div className={`h-full w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} text-${theme === 'dark' ? 'white' : 'gray-900'} flex flex-col overflow-hidden`}>
      <audio ref={audioRef} />
      
      {/* 专辑封面区域 */}
      <div className={`flex-1 flex items-center justify-center p-8 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
        <div className="relative">
          <div className={`w-64 h-64 rounded-2xl shadow-2xl overflow-hidden ${isPlaying ? 'animate-pulse-slow' : ''}`}>
            <img 
              src={track.cover} 
              alt={track.title}
              className="w-full h-full object-cover"
            />
          </div>
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 border-4 border-white/20 rounded-full animate-spin-slow"></div>
            </div>
          )}
        </div>
      </div>

      {/* 歌曲信息 */}
      <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-bold mb-1 truncate">{track.title}</h2>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} truncate`}>{track.artist}</p>
      </div>

      {/* 进度条 */}
      <div className="px-6 py-2">
        <div className="flex items-center gap-3">
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} w-12 text-right`}>
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className={`flex-1 h-1 rounded-full appearance-none cursor-pointer
              ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}
              accent-${accentColor}-500`}
            style={{
              background: `linear-gradient(to right, 
                var(--tw-gradient-from) 0%, 
                var(--tw-gradient-from) ${(currentTime / duration) * 100}%, 
                ${theme === 'dark' ? '#374151' : '#d1d5db'} ${(currentTime / duration) * 100}%, 
                ${theme === 'dark' ? '#374151' : '#d1d5db'} 100%)`
            }}
          />
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} w-12`}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className={`px-6 py-4 flex items-center justify-between border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* 左侧：辅助按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={`p-2 rounded-lg transition-all ${
              shuffle 
                ? `bg-${accentColor}-500 text-white` 
                : `${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`
            }`}
            title="随机播放"
          >
            🔀
          </button>
          <button
            onClick={() => setRepeat(!repeat)}
            className={`p-2 rounded-lg transition-all ${
              repeat 
                ? `bg-${accentColor}-500 text-white` 
                : `${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`
            }`}
            title="循环播放"
          >
            🔁
          </button>
        </div>

        {/* 中间：主控制 */}
        <div className="flex items-center gap-4">
          <button
            onClick={prevTrack}
            className={`p-3 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
            title="上一首"
          >
            ⏮️
          </button>
          <button
            onClick={togglePlay}
            className={`p-4 rounded-full bg-${accentColor}-500 hover:bg-${accentColor}-600 text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105`}
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={nextTrack}
            className={`p-3 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
            title="下一首"
          >
            ⏭️
          </button>
        </div>

        {/* 右侧：音量控制 */}
        <div className="flex items-center gap-2">
          <span className="text-lg">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className={`w-20 h-1 rounded-full appearance-none cursor-pointer
              ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}
              accent-${accentColor}-500`}
          />
        </div>
      </div>

      {/* 播放列表 */}
      <div className={`px-6 py-3 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'} max-h-32 overflow-y-auto`}>
        <h3 className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} uppercase`}>播放列表</h3>
        <div className="space-y-1">
          {playlist.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentTrack(index)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                currentTrack === index
                  ? `bg-${accentColor}-500/20 text-${accentColor}-400`
                  : `${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-60">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.title}</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} truncate`}>{item.artist}</div>
                </div>
                {currentTrack === index && isPlaying && (
                  <span className="text-xs">🎵</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
