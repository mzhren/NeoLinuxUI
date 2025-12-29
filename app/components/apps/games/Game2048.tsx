'use client';

import { useState, useEffect, useCallback } from 'react';

type Board = number[][];

export default function Game2048({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const initBoard = useCallback(() => {
    const newBoard: Board = Array(4).fill(0).map(() => Array(4).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, []);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  const addRandomTile = (board: Board) => {
    const emptyTiles: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) emptyTiles.push([i, j]);
      }
    }
    if (emptyTiles.length > 0) {
      const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || won) return;

    const newBoard: Board = JSON.parse(JSON.stringify(board));
    let moved = false;
    let newScore = score;

    const mergeLine = (line: number[]) => {
      const filtered = line.filter(x => x !== 0);
      const merged: number[] = [];
      let skip = false;

      for (let i = 0; i < filtered.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          newScore += filtered[i] * 2;
          skip = true;
          moved = true;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < 4) merged.push(0);
      return merged;
    };

    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        const newLine = mergeLine(newBoard[i]);
        if (JSON.stringify(newLine) !== JSON.stringify(newBoard[i])) moved = true;
        newBoard[i] = newLine;
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const newLine = mergeLine(newBoard[i].reverse()).reverse();
        if (JSON.stringify(newLine) !== JSON.stringify(newBoard[i])) moved = true;
        newBoard[i] = newLine;
      }
    } else if (direction === 'up') {
      for (let j = 0; j < 4; j++) {
        const column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
        const newColumn = mergeLine(column);
        if (JSON.stringify(newColumn) !== JSON.stringify(column)) moved = true;
        for (let i = 0; i < 4; i++) newBoard[i][j] = newColumn[i];
      }
    } else if (direction === 'down') {
      for (let j = 0; j < 4; j++) {
        const column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
        const newColumn = mergeLine(column.reverse()).reverse();
        if (JSON.stringify(newColumn) !== JSON.stringify(column)) moved = true;
        for (let i = 0; i < 4; i++) newBoard[i][j] = newColumn[i];
      }
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);

      // Check win
      if (newBoard.some(row => row.includes(2048))) {
        setWon(true);
      }

      // Check game over
      if (!canMove(newBoard)) {
        setGameOver(true);
      }
    }
  }, [board, score, gameOver, won]);

  const canMove = (board: Board) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return true;
        if (j < 3 && board[i][j] === board[i][j + 1]) return true;
        if (i < 3 && board[i][j] === board[i + 1][j]) return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') move('up');
        if (e.key === 'ArrowDown') move('down');
        if (e.key === 'ArrowLeft') move('left');
        if (e.key === 'ArrowRight') move('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      0: 'bg-gray-200',
      2: 'bg-yellow-100 text-gray-800',
      4: 'bg-yellow-200 text-gray-800',
      8: 'bg-orange-300 text-white',
      16: 'bg-orange-400 text-white',
      32: 'bg-orange-500 text-white',
      64: 'bg-red-400 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-yellow-700 text-white',
      2048: 'bg-yellow-800 text-white',
    };
    return colors[value] || 'bg-gray-900 text-white';
  };

  return (
    <div className="h-full bg-gradient-to-br from-orange-100 to-yellow-100 flex flex-col">
      <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
          ← 返回
        </button>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">分数</div>
            <div className="text-2xl font-bold text-orange-600">{score}</div>
          </div>
          <button
            onClick={initBoard}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            重新开始
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative">
          <div className="grid grid-cols-4 gap-3 bg-orange-300 p-4 rounded-2xl shadow-2xl">
            {board.map((row, i) =>
              row.map((value, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`w-20 h-20 rounded-lg ${getTileColor(value)} flex items-center justify-center text-3xl font-bold transition-all duration-200 transform hover:scale-105`}
                >
                  {value !== 0 && value}
                </div>
              ))
            )}
          </div>

          {(gameOver || won) && (
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">{won ? '🎉' : '😢'}</div>
                <div className="text-2xl font-bold mb-2">{won ? '恭喜获胜！' : '游戏结束'}</div>
                <div className="text-gray-600 mb-4">最终分数: {score}</div>
                <button
                  onClick={initBoard}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  再玩一次
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200 text-center text-sm text-gray-600">
        使用方向键 ← ↑ → ↓ 移动方块
      </div>
    </div>
  );
}
