'use client';

import { useState } from 'react';

export default function WeatherWidget() {
  const weatherConditions = ['☀️ Sunny', '⛅ Partly Cloudy', '☁️ Cloudy', '🌧️ Rainy'];
  const [weather] = useState(weatherConditions[Math.floor(Math.random() * weatherConditions.length)]);
  const [temp] = useState(Math.floor(Math.random() * 15) + 15);

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="text-white/60 text-sm mb-2">San Francisco, CA</div>
        <div className="text-6xl mb-4">{weather.split(' ')[0]}</div>
      </div>
      <div>
        <div className="text-5xl font-bold text-white mb-1">{temp}°C</div>
        <div className="text-white/60">{weather.split(' ').slice(1).join(' ')}</div>
      </div>
    </div>
  );
}
