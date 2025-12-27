'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

export default function VideoPlayerApp() {
  const { theme, accentColor } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // 示例视频列表 - 使用免费的视频文件
  const playlist = [
    {
      title: 'Big Buck Bunny',
      description: 'Open source animated short film',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=400&h=225&fit=crop',
      duration: '9:56'
    },
    {
      title: 'Elephant Dream',
      description: 'First open movie from Blender Foundation',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=225&fit=crop',
      duration: '10:53'
    },
    {
      title: 'For Bigger Blazes',
      description: 'Sample video content',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1574267432644-f610f2351c6d?w=400&h=225&fit=crop',
      duration: '0:15'
    },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (currentVideo < playlist.length - 1) {
        setCurrentVideo(currentVideo + 1);
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentVideo, playlist.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = playlist[currentVideo].url;
    if (isPlaying) {
      video.play().catch(e => console.error('播放失败:', e));
    }
  }, [currentVideo]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(e => console.error('播放失败:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume > 0 ? volume : 0.7;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = () => {
    const video = videoRef.current;
    if (!video) return;

    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    video.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  const nextVideo = () => {
    setCurrentVideo((currentVideo + 1) % playlist.length);
  };

  const prevVideo = () => {
    setCurrentVideo((currentVideo - 1 + playlist.length) % playlist.length);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isFullscreen) {
        setShowControls(false);
      }
    }, 3000);
  };

  const video = playlist[currentVideo];

  return (
    <div 
      ref={containerRef}
      className={`h-full w-full ${theme === 'dark' ? 'bg-black' : 'bg-gray-900'} flex flex-col overflow-hidden relative`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* 视频播放器 */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onClick={togglePlay}
        />

        {/* 居中播放按钮覆盖层 */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer" onClick={togglePlay}>
            <div className={`w-20 h-20 rounded-full bg-${accentColor}-500 hover:bg-${accentColor}-600 flex items-center justify-center shadow-2xl transition-transform hover:scale-110`}>
              <span className="text-4xl text-white ml-1">▶</span>
            </div>
          </div>
        )}

        {/* 视频信息覆盖层 */}
        <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-white text-xl font-bold mb-1">{video.title}</h2>
          <p className="text-white/70 text-sm">{video.description}</p>
        </div>

        {/* 控制栏覆盖层 */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          {/* 进度条 */}
          <div className="px-4 pt-2">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 rounded-full appearance-none cursor-pointer bg-white/30 accent-red-500"
              style={{
                background: `linear-gradient(to right, 
                  #ef4444 0%, 
                  #ef4444 ${(currentTime / duration) * 100}%, 
                  rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, 
                  rgba(255,255,255,0.3) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-white/80 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-between px-4 py-3">
            {/* 左侧控制 */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="text-white hover:text-red-500 transition-colors"
                title={isPlaying ? '暂停' : '播放'}
              >
                <span className="text-2xl">{isPlaying ? '⏸' : '▶'}</span>
              </button>
              <button
                onClick={prevVideo}
                className="text-white hover:text-red-500 transition-colors"
                title="上一个视频"
              >
                <span className="text-xl">⏮</span>
              </button>
              <button
                onClick={nextVideo}
                className="text-white hover:text-red-500 transition-colors"
                title="下一个视频"
              >
                <span className="text-xl">⏭</span>
              </button>
              <button
                onClick={() => skip(-10)}
                className="text-white hover:text-red-500 transition-colors text-sm"
                title="后退10秒"
              >
                ⏪ 10s
              </button>
              <button
                onClick={() => skip(10)}
                className="text-white hover:text-red-500 transition-colors text-sm"
                title="前进10秒"
              >
                10s ⏩
              </button>
              
              {/* 音量控制 */}
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-red-500 transition-colors"
                  title={isMuted ? '取消静音' : '静音'}
                >
                  <span className="text-xl">{isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 rounded-full appearance-none cursor-pointer bg-white/30 accent-red-500"
                />
              </div>
            </div>

            {/* 右侧控制 */}
            <div className="flex items-center gap-3">
              <button
                onClick={changePlaybackRate}
                className="text-white hover:text-red-500 transition-colors text-sm font-medium px-2 py-1 rounded bg-white/10"
                title="播放速度"
              >
                {playbackRate}x
              </button>
              <button
                className="text-white hover:text-red-500 transition-colors"
                title="字幕"
              >
                <span className="text-xl">💬</span>
              </button>
              <button
                className="text-white hover:text-red-500 transition-colors"
                title="设置"
              >
                <span className="text-xl">⚙️</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 播放列表 */}
      <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-800 border-gray-600'} border-t overflow-y-auto`} style={{ maxHeight: '200px' }}>
        <div className="p-3">
          <h3 className="text-white text-sm font-semibold mb-2 uppercase opacity-80">播放列表</h3>
          <div className="space-y-2">
            {playlist.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideo(index)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  currentVideo === index
                    ? 'bg-red-500/20 border border-red-500/50'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-32 h-18 object-cover rounded"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {item.duration}
                  </div>
                  {currentVideo === index && isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                      <span className="text-white text-2xl">🎬</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className={`font-medium truncate ${currentVideo === index ? 'text-red-400' : 'text-white'}`}>
                    {item.title}
                  </div>
                  <div className="text-xs text-white/60 truncate">
                    {item.description}
                  </div>
                </div>
                {currentVideo === index && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
