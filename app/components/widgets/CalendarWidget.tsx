'use client';

import { useState } from 'react';

export default function CalendarWidget() {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === currentDate.getDate();
    const isSelected = i === selectedDate.getDate();
    days.push(
      <button
        key={i}
        onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))}
        className={`widget-interactive aspect-square flex items-center justify-center text-sm rounded-lg transition-colors cursor-pointer ${
          isToday ? 'bg-blue-500 text-white font-bold' : 
          isSelected ? 'bg-white/20 text-white' :
          'text-white/80 hover:bg-white/10'
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-white font-bold mb-4 text-center">
        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>
      <div className="grid grid-cols-7 gap-1 text-white/60 text-xs mb-2 text-center">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      <div className="grid grid-cols-7 gap-1 flex-1">
        {days}
      </div>
    </div>
  );
}
