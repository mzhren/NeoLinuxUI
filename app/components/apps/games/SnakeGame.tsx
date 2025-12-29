'use client';

import { useState, useEffect, useCallback } from 'react';

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const CELL_SIZE = 20;

export default function SnakeGame({ onBack }: { onBack: () => void }) {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback((snakeBody: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const startGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, [generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.code === 'Space') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver, gameStarted, startGame]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setDirection(nextDirection);

      setSnake(prevSnake => {
        const head = prevSnake[0];
        let newHead: Position;

        switch (nextDirection) {
          case 'UP':
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case 'DOWN':
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case 'LEFT':
            newHead = { x: head.x - 1, y: head.y };
            break;
          case 'RIGHT':
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          setGameStarted(false);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setGameStarted(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake));
          setScore(prev => prev + 10);
          return newSnake; // Don't remove tail
        }

        newSnake.pop(); // Remove tail
        return newSnake;
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, nextDirection, food, generateFood]);

  return (
    <div className="h-full bg-gradient-to-br from-green-100 to-teal-100 flex flex-col">
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
        <div
          className="border-4 border-gray-300 rounded-lg shadow-2xl bg-white relative"
          style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
        >
          {/* Grid */}
          {Array.from({ length: GRID_SIZE }).map((_, y) =>
            Array.from({ length: GRID_SIZE }).map((_, x) => (
              <div
                key={`${x}-${y}`}
                className="absolute border border-gray-100"
                style={{
                  left: x * CELL_SIZE,
                  top: y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                }}
              />
            ))
          )}

          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute rounded-sm ${index === 0 ? 'bg-green-600' : 'bg-green-500'}`}
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            >
              {index === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          ))}

          {/* Food */}
          <div
            className="absolute bg-red-500 rounded-full animate-pulse"
            style={{
              left: food.x * CELL_SIZE + 2,
              top: food.y * CELL_SIZE + 2,
              width: CELL_SIZE - 4,
              height: CELL_SIZE - 4,
            }}
          />

          {(!gameStarted || gameOver) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
                <div className="text-6xl mb-4">🐍</div>
                <div className="text-2xl font-bold mb-2">
                  {gameOver ? '游戏结束！' : '贪吃蛇'}
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
      </div>

      <div className="p-4 bg-white border-t border-gray-200 text-center text-sm text-gray-600">
        使用方向键 ← ↑ → ↓ 控制蛇的方向
      </div>
    </div>
  );
}
