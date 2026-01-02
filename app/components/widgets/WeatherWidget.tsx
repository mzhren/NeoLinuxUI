'use client';

import { useState, useEffect } from 'react';
import { WEATHER_CITIES, WEATHER_UPDATE_INTERVAL } from '@/app/config/weather';

interface WeatherData {
  city: string;
  cityId: string;
  temperature: number;
  condition: 'sunny' | 'windy' | 'rainy' | 'snowy' | 'cloudy';
  conditionText: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  feelsLike?: number;
}

interface WeatherWidgetProps {
  initialCity?: string;
}

export default function WeatherWidget({ initialCity }: WeatherWidgetProps) {
  const initialIndex = initialCity ? WEATHER_CITIES.findIndex(c => c.city === initialCity) : 0;
  const [currentCityIndex, setCurrentCityIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [time, setTime] = useState(new Date());
  const [showDetail, setShowDetail] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取天气数据 - 通过自建 API Route
  const fetchWeather = async (cityId: string, cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // 调用自建的 API Route
      const response = await fetch(`/api/weather?cityId=${cityId}`);
      
      if (!response.ok) {
        throw new Error('获取天气数据失败');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '天气API返回错误');
      }
      
      const now = result.data;
      
      // 映射天气图标到我们的条件类型
      const iconCode = parseInt(now.icon);
      let condition: WeatherData['condition'] = 'sunny';
      
      if (iconCode >= 100 && iconCode <= 103) {
        condition = 'sunny'; // 晴
      } else if (iconCode >= 104 && iconCode <= 213) {
        condition = 'cloudy'; // 多云/阴
      } else if ((iconCode >= 300 && iconCode <= 318) || (iconCode >= 399 && iconCode <= 499)) {
        condition = 'rainy'; // 雨
      } else if ((iconCode >= 400 && iconCode <= 457) || iconCode === 499) {
        condition = 'snowy'; // 雪
      } else if (iconCode >= 500 && iconCode <= 515) {
        condition = 'windy'; // 风
      }
      
      setWeather({
        city: cityName,
        cityId,
        temperature: Math.round(parseFloat(now.temperature)),
        condition,
        conditionText: now.text,
        humidity: parseInt(now.humidity),
        windSpeed: Math.round(parseFloat(now.windSpeed)),
        pressure: parseInt(now.pressure),
        feelsLike: Math.round(parseFloat(now.feelsLike)),
      });
      
    } catch (err) {
      console.error('获取天气失败:', err);
      setError('暂时无法获取天气数据');
      // 使用默认数据
      setWeather({
        city: cityName,
        cityId,
        temperature: 25,
        condition: 'sunny',
        conditionText: '晴',
        humidity: 50,
        windSpeed: 10,
        pressure: 1013,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 初始加载天气数据
  useEffect(() => {
    const city = WEATHER_CITIES[currentCityIndex];
    fetchWeather(city.cityId, city.city);
    
    // 定期更新天气数据
    const weatherTimer = setInterval(() => {
      fetchWeather(city.cityId, city.city);
    }, WEATHER_UPDATE_INTERVAL);
    
    return () => clearInterval(weatherTimer);
  }, [currentCityIndex]);

  const selectCity = (index: number) => {
    setCurrentCityIndex(index);
    setShowCitySelector(false);
    setShowDetail(false);
  };

  const getConditionName = (condition: string) => {
    const names = { 
      sunny: '晴天', 
      windy: '大风', 
      rainy: '暴雨', 
      snowy: '暴雪',
      cloudy: '多云'
    };
    return names[condition as keyof typeof names] || condition;
  };

  const timeString = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;

  if (loading && !weather) {
    return (
      <div className="h-full rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-100/30 to-purple-100/30 flex items-center justify-center">
        <div className="text-white/80 text-center">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-sm">加载天气中...</div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="h-full rounded-2xl backdrop-blur-xl bg-gradient-to-br from-red-100/30 to-orange-100/30 flex items-center justify-center">
        <div className="text-white/80 text-center">
          <div className="text-3xl mb-2">❌</div>
          <div className="text-sm">无法加载天气数据</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`h-full rounded-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-400 ${
        weather.condition === 'sunny' ? 'weather-sunny' :
        weather.condition === 'windy' ? 'weather-windy' :
        weather.condition === 'rainy' ? 'weather-rainy' :
        weather.condition === 'cloudy' ? 'weather-cloudy' :
        'weather-snowy'
      }`}
      style={{ minHeight: '220px' }}
    >
      <style jsx>{`
        .weather-sunny { background: linear-gradient(135deg, rgba(255, 200, 100, 0.3) 0%, rgba(255, 150, 50, 0.2) 100%); }
        .weather-windy { background: linear-gradient(135deg, rgba(100, 150, 200, 0.3) 0%, rgba(150, 100, 200, 0.2) 100%); }
        .weather-rainy { background: linear-gradient(135deg, rgba(80, 100, 150, 0.4) 0%, rgba(60, 80, 130, 0.3) 100%); }
        .weather-snowy { background: linear-gradient(135deg, rgba(200, 220, 255, 0.4) 0%, rgba(160, 180, 220, 0.3) 100%); }
        .weather-cloudy { background: linear-gradient(135deg, rgba(150, 160, 180, 0.3) 0%, rgba(120, 130, 150, 0.2) 100%); }

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

        .city-selector {
          position: absolute;
          top: 40px;
          right: 10px;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 8px;
          z-index: 100;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          min-width: 120px;
          max-height: 240px;
          overflow-y: auto;
        }

        .city-selector::-webkit-scrollbar {
          width: 6px;
        }

        .city-selector::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .city-selector::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .city-selector::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .city-option {
          padding: 8px 12px;
          color: white;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
          font-size: 13px;
        }

        .city-option:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .city-option.active {
          background: rgba(59, 130, 246, 0.5);
          font-weight: 600;
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
        {(weather.condition === 'windy' || weather.condition === 'cloudy') && (
          <>
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            {weather.condition === 'windy' && (
              <>
                <div className="wind-line wind-line-1"></div>
                <div className="wind-line wind-line-2"></div>
                <div className="wind-line wind-line-3"></div>
              </>
            )}
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
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCitySelector(!showCitySelector);
              }}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 opacity-20 hover:opacity-80 cursor-pointer rounded-lg text-white text-xs transition-colors widget-interactive"
              title="选择城市"
            >
              选择城市
            </button>
            {showCitySelector && (
              <div className="city-selector widget-interactive">
                {WEATHER_CITIES.map((city, index) => (
                  <div
                    key={city.city}
                    className={`city-option ${index === currentCityIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectCity(index);
                    }}
                  >
                    {city.city}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 温度和天气 */}
        <div className="cursor-pointer" onClick={() => setShowDetail(!showDetail)}>
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
            <span className="text-white/70">天气状况</span>
            <span className="text-white font-medium">{weather.conditionText}</span>
          </div>
          {weather.feelsLike && (
            <div className="flex justify-between py-2 text-xs">
              <span className="text-white/70">体感温度</span>
              <span className="text-white font-medium">{weather.feelsLike}°</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
