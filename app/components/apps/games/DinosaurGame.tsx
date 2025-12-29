'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export default function DinosaurGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const gameStateRef = useRef({
    dino: { x: 50, y: 150, width: 40, height: 40, velocityY: 0, jumping: false },
    obstacles: [] as { x: number; width: number; height: number }[],
    gameSpeed: 5,
    score: 0,
  });

  const startGame = useCallback(() => {
    gameStateRef.current = {
      dino: { x: 50, y: 150, width: 40, height: 40, velocityY: 0, jumping: false },
      obstacles: [],
      gameSpeed: 5,
      score: 0,
    };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, []);

  const jump = useCallback(() => {
    if (!gameStateRef.current.dino.jumping && gameStarted && !gameOver) {
      gameStateRef.current.dino.velocityY = -12;
      gameStateRef.current.dino.jumping = true;
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted || gameOver) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump, gameStarted, gameOver, startGame]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = setInterval(() => {
      const state = gameStateRef.current;

      // Update dino
      if (state.dino.jumping) {
        state.dino.velocityY += 0.6; // gravity
        state.dino.y += state.dino.velocityY;

        if (state.dino.y >= 150) {
          state.dino.y = 150;
          state.dino.velocityY = 0;
          state.dino.jumping = false;
        }
      }

      // Update obstacles
      state.obstacles = state.obstacles.filter(obs => obs.x > -obs.width);
      state.obstacles.forEach(obs => {
        obs.x -= state.gameSpeed;
      });

      // Add new obstacles
      if (state.obstacles.length === 0 || state.obstacles[state.obstacles.length - 1].x < canvas.width - 300) {
        const height = 30 + Math.random() * 30;
        state.obstacles.push({
          x: canvas.width,
          width: 20,
          height: height,
        });
      }

      // Collision detection
      for (const obs of state.obstacles) {
        if (
          state.dino.x < obs.x + obs.width &&
          state.dino.x + state.dino.width > obs.x &&
          state.dino.y + state.dino.height > 200 - obs.height
        ) {
          setGameOver(true);
          setGameStarted(false);
          return;
        }
      }

      // Update score
      state.score += 1;
      if (state.score % 100 === 0) {
        state.gameSpeed += 0.5;
      }
      setScore(Math.floor(state.score / 10));

      // Draw
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = '#666';
      ctx.fillRect(0, 200, canvas.width, 2);

      // Draw dino
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(state.dino.x, state.dino.y, state.dino.width, state.dino.height);
      
      // Dino eye
      ctx.fillStyle = '#000';
      ctx.fillRect(state.dino.x + 30, state.dino.y + 10, 5, 5);

      // Draw obstacles
      ctx.fillStyle = '#ef4444';
      state.obstacles.forEach(obs => {
        ctx.fillRect(obs.x, 200 - obs.height, obs.width, obs.height);
      });

    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver]);

  return (
    <div className="h-full bg-gradient-to-br from-green-100 to-blue-100 flex flex-col">
      <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
          ← 返回
        </button>
        <div className="text-center">
          <div className="text-sm text-gray-600">分数</div>
          <div className="text-2xl font-bold text-green-600">{score}</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="border-4 border-gray-300 rounded-lg shadow-2xl bg-white"
        />

        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
              <div className="text-6xl mb-4">🦖</div>
              <div className="text-2xl font-bold mb-2">
                {gameOver ? '游戏结束！' : '恐龙跑酷'}
              </div>
              {gameOver && <div className="text-gray-600 mb-4">得分: {score}</div>}
              <div className="text-gray-600 mb-4">按空格键{gameOver ? '重新' : ''}开始</div>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                {gameOver ? '再玩一次' : '开始游戏'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200 text-center text-sm text-gray-600">
        按空格键跳跃 • 躲避障碍物
      </div>
    </div>
  );
}
