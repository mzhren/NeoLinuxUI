'use client';

import { useState } from 'react';
import Game2048 from './games/Game2048';
import DinosaurGame from './games/DinosaurGame';
import SnakeGame from './games/SnakeGame';
import MinesweeperGame from './games/MinesweeperGame';

type GameType = '2048' | 'dinosaur' | 'snake' | 'minesweeper' | null;

const games = [
  { id: '2048', name: '2048', icon: '🎯', description: '合并数字达到 2048' },
  { id: 'dinosaur', name: '恐龙跑酷', icon: '🦖', description: '跳跃躲避障碍物' },
  { id: 'snake', name: '贪吃蛇', icon: '🐍', description: '吃食物变长不撞墙' },
  { id: 'minesweeper', name: '扫雷', icon: '💣', description: '找出所有地雷' },
];

export default function GameCenterApp() {
  const [currentGame, setCurrentGame] = useState<GameType>(null);

  const renderGame = () => {
    switch (currentGame) {
      case '2048':
        return <Game2048 onBack={() => setCurrentGame(null)} />;
      case 'dinosaur':
        return <DinosaurGame onBack={() => setCurrentGame(null)} />;
      case 'snake':
        return <SnakeGame onBack={() => setCurrentGame(null)} />;
      case 'minesweeper':
        return <MinesweeperGame onBack={() => setCurrentGame(null)} />;
      default:
        return null;
    }
  };

  if (currentGame) {
    return renderGame();
  }

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 to-blue-50 overflow-auto">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎮 游戏中心</h1>
        <p className="text-gray-600 mb-6">选择一个游戏开始娱乐吧！</p>

        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setCurrentGame(game.id as GameType)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-left group"
            >
              <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">
                {game.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{game.name}</h3>
              <p className="text-sm text-gray-600">{game.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">游戏说明</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>2048</strong>: 使用方向键移动数字方块，相同数字合并</li>
            <li>• <strong>恐龙跑酷</strong>: 按空格键跳跃，躲避障碍物</li>
            <li>• <strong>贪吃蛇</strong>: 使用方向键控制蛇吃食物</li>
            <li>• <strong>扫雷</strong>: 点击格子翻开，右键标记地雷</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
