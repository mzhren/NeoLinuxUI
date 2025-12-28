'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  city: string;
  temperature: number;
  condition: 'sunny' | 'windy' | 'rainy' | 'snowy';
  humidity: number;
  windSpeed: number;
  pressure: number;
}

const cities: WeatherData[] = [
  { city: '北京', temperature: 28, condition: 'sunny', humidity: 35, windSpeed: 12, pressure: 1012 },
  { city: '上海', temperature: 22, condition: 'windy', humidity: 55, windSpeed: 38, pressure: 1008 },
  { city: '广州', temperature: 24, condition: 'rainy', humidity: 95, windSpeed: 18, pressure: 1005 },
  { city: '哈尔滨', temperature: -15, condition: 'snowy', humidity: 75, windSpeed: 22, pressure: 1018 },
  { city: '深圳', temperature: 26, condition: 'sunny', humidity: 70, windSpeed: 15, pressure: 1010 },
  { city: '成都', temperature: 18, condition: 'windy', humidity: 65, windSpeed: 25, pressure: 1009 },
];

export default function WeatherWidget() {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [time, setTime] = useState(new Date());
  const [showDetail, setShowDetail] = useState(false);

  const weather = cities[currentCityIndex];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const switchCity = () => {
    setCurrentCityIndex((prev) => (prev + 1) % cities.length);
    setShowDetail(false);
  };

  const getConditionName = (condition: string) => {
    const names = { sunny: '晴天', windy: '大风', rainy: '暴雨', snowy: '暴雪' };
    return names[condition as keyof typeof names] || condition;
  };

  const timeString = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;

  return (
    <div 
      className={`h-full rounded-2xl backdrop-blur-xl relative overflow-hidden cursor-pointer transition-all duration-400 ${
        weather.condition === 'sunny' ? 'weather-sunny' :
        weather.condition === 'windy' ? 'weather-windy' :
        weather.condition === 'rainy' ? 'weather-rainy' :
        'weather-snowy'
      }`}
      onClick={() => setShowDetail(!showDetail)}
    >
      <style jsx>{`
        .weather-sunny { background: linear-gradient(135deg, rgba(255, 200, 100, 0.3) 0%, rgba(255, 150, 50, 0.2) 100%); }
        .weather-windy { background: linear-gradient(135deg, rgba(100, 150, 200, 0.3) 0%, rgba(150, 100, 200, 0.2) 100%); }
        .weather-rainy { background: linear-gradient(135deg, rgba(80, 100, 150, 0.4) 0%, rgba(60, 80, 130, 0.3) 100%); }
        .weather-snowy { background: linear-gradient(135deg, rgba(200, 220, 255, 0.4) 0%, rgba(160, 180, 220, 0.3) 100%); }

        .weather-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60%);
          width: 80px;
          height: 80px;
          z-index: 1;
          opacity: 0.9;
        }

        /* 晴天 */
        .sun {
          position: absolute;
          width: 50px;
          height: 50px;
          background: radial-gradient(circle, #ffdd44 0%, #ff9900 70%, #ff6600 100%);
          border-radius: 50%;
          box-shadow: 0 0 40px rgba(255, 200, 0, 0.8);
          animation: sunPulse 3s ease-in-out infinite;
        }
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        .sun-rays {
          position: absolute;
          width: 80px;
          height: 80px;
          animation: sunRotate 30s linear infinite;
        }
        @keyframes sunRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, rgba(255, 200, 0, 0.8) 0%, transparent 100%);
          transform-origin: left center;
          border-radius: 2px;
        }

        /* 云 */
        .cloud {
          position: absolute;
          width: 40px;
          height: 18px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
        }
        .cloud::before {
          content: '';
          position: absolute;
          width: 25px;
          height: 25px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          top: -13px;
          left: 7px;
        }
        .cloud::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          top: -8px;
          left: 23px;
        }

        .cloud-1 { top: 35%; left: 25%; animation: cloudFloat 4s ease-in-out infinite; }
        .cloud-2 { top: 45%; left: 55%; animation: cloudFloat 5s ease-in-out infinite 0.5s; transform: scale(0.8); }

        @keyframes cloudFloat {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(10px) translateY(0); }
        }

        .wind-line {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%);
          animation: windBlow 2s ease-in-out infinite;
        }
        .wind-line-1 { top: 55%; left: 15%; width: 50px; }
        .wind-line-2 { top: 62%; left: 20%; width: 60px; animation-delay: 0.3s; }
        .wind-line-3 { top: 69%; left: 10%; width: 55px; animation-delay: 0.6s; }

        @keyframes windBlow {
          0% { opacity: 0; transform: translateX(-20px); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateX(40px); }
        }

        /* 雨云 */
        .rain-cloud .cloud {
          background: linear-gradient(180deg, #8B9DB8 0%, #6B7B96 100%);
          width: 60px;
        }
        .rain-cloud .cloud::before,
        .rain-cloud .cloud::after {
          background: linear-gradient(180deg, #9AACBF 0%, #7A8BA6 100%);
        }

        .rain-drop {
          position: absolute;
          width: 2px;
          height: 12px;
          background: linear-gradient(180deg, rgba(174, 194, 224, 0.9) 0%, rgba(174, 194, 224, 0.3) 100%);
          border-radius: 0 0 2px 2px;
          animation: rainFall 0.8s linear infinite;
        }
        .rain-drop-1 { left: 35%; animation-delay: 0s; }
        .rain-drop-2 { left: 45%; animation-delay: 0.15s; }
        .rain-drop-3 { left: 55%; animation-delay: 0.3s; }

        @keyframes rainFall {
          0% { transform: translateY(20px); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(60px); opacity: 0; }
        }

        /* 雪云 */
        .snow-cloud .cloud {
          background: linear-gradient(180deg, #D4E5F7 0%, #B8D0EB 100%);
        }
        .snow-cloud .cloud::before,
        .snow-cloud .cloud::after {
          background: linear-gradient(180deg, #E8F4FC 0%, #D4E5F7 100%);
        }

        .snowflake {
          position: absolute;
          color: white;
          font-size: 12px;
          animation: snowFall 3s linear infinite;
        }
        .snowflake-1 { left: 30%; animation-delay: 0s; }
        .snowflake-2 { left: 50%; animation-delay: 0.5s; }
        .snowflake-3 { left: 60%; animation-delay: 1s; }

        @keyframes snowFall {
          0% { transform: translateY(20px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(70px) rotate(360deg); opacity: 0; }
        }

        .detail-panel {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease-out, opacity 0.3s ease;
          opacity: 0;
        }
        .detail-panel.show {
          max-height: 100px;
          opacity: 1;
        }
      `}</style>

      {/* 天气图标 */}
      <div className="weather-icon">
        {weather.condition === 'sunny' && (
          <>
            <div className="sun"></div>
            <div className="sun-rays">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <div key={i} className="ray" style={{ transform: `rotate(${deg}deg)` }}></div>
              ))}
            </div>
          </>
        )}
        {weather.condition === 'windy' && (
          <>
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            <div className="wind-line wind-line-1"></div>
            <div className="wind-line wind-line-2"></div>
            <div className="wind-line wind-line-3"></div>
          </>
        )}
        {weather.condition === 'rainy' && (
          <div className="rain-cloud" style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)' }}>
            <div className="cloud"></div>
            <div className="rain-drop rain-drop-1"></div>
            <div className="rain-drop rain-drop-2"></div>
            <div className="rain-drop rain-drop-3"></div>
          </div>
        )}
        {weather.condition === 'snowy' && (
          <div className="snow-cloud" style={{ position: 'absolute', top: '28%', left: '50%', transform: 'translateX(-50%)' }}>
            <div className="cloud"></div>
            <div className="snowflake snowflake-1">❄</div>
            <div className="snowflake snowflake-2">❄</div>
            <div className="snowflake snowflake-3">❄</div>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 h-full p-6 flex flex-col justify-between">
        {/* 头部 */}
        <div className="flex justify-between items-start">
          <div>
            <div className="text-white text-xl font-semibold drop-shadow-md">{weather.city}</div>
            <div className="text-white/70 text-xs mt-1">{timeString}</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              switchCity();
            }}
            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs transition-colors"
            title="切换城市"
          >
            切换
          </button>
        </div>

        {/* 温度和天气 */}
        <div>
          <div className="text-white text-5xl font-extralight drop-shadow-lg" style={{ letterSpacing: '-2px' }}>
            {weather.temperature}°
          </div>
          <div className="text-white text-base font-medium mt-1 opacity-95">{getConditionName(weather.condition)}</div>
        </div>

        {/* 额外信息 */}
        <div className="flex justify-between pt-3 border-t border-white/20 text-xs">
          <div className="text-white/85">
            <div className="text-white font-semibold text-sm">{weather.humidity}%</div>
            <div>湿度</div>
          </div>
          <div className="text-white/85">
            <div className="text-white font-semibold text-sm">{weather.windSpeed} km/h</div>
            <div>风速</div>
          </div>
          <div className="text-white/85">
            <div className="text-white font-semibold text-sm">{weather.pressure} hPa</div>
            <div>气压</div>
          </div>
        </div>

        {/* 详情面板 */}
        <div className={`detail-panel ${showDetail ? 'show' : ''}`} style={{ marginTop: '10px' }}>
          <div className="flex justify-between py-2 border-b border-white/10 text-xs">
            <span className="text-white/70">紫外线指数</span>
            <span className="text-white font-medium">
              {weather.condition === 'sunny' ? '8 (很强)' : weather.condition === 'rainy' ? '1 (弱)' : '3 (中等)'}
            </span>
          </div>
          <div className="flex justify-between py-2 text-xs">
            <span className="text-white/70">体感温度</span>
            <span className="text-white font-medium">
              {weather.temperature + (weather.condition === 'windy' ? -3 : weather.condition === 'sunny' ? 2 : 0)}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
