'use client';

import { useState, useCallback } from 'react';

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

const ROWS = 12;
const COLS = 15;
const MINE_COUNT = 25;

export default function MinesweeperGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<Cell[][]>(() => initializeBoard());
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);

  function initializeBoard(): Cell[][] {
    const newBoard: Cell[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mines
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr;
              const newCol = col + dc;
              if (
                newRow >= 0 &&
                newRow < ROWS &&
                newCol >= 0 &&
                newCol < COLS &&
                newBoard[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].adjacentMines = count;
        }
      }
    }

    return newBoard;
  }

  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setGameOver(false);
    setGameWon(false);
    setGameStarted(true);
    setFlagCount(0);
    setRevealedCount(0);
  }, []);

  const revealCell = useCallback(
    (row: number, col: number) => {
      if (gameOver || gameWon) return;

      setBoard(prevBoard => {
        const newBoard = prevBoard.map(r => r.map(c => ({ ...c })));
        const cell = newBoard[row][col];

        if (cell.isRevealed || cell.isFlagged) return prevBoard;

        if (!gameStarted) {
          setGameStarted(true);
        }

        if (cell.isMine) {
          // Reveal all mines
          for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
              if (newBoard[r][c].isMine) {
                newBoard[r][c].isRevealed = true;
              }
            }
          }
          setGameOver(true);
          return newBoard;
        }

        // Reveal cell and adjacent cells if no adjacent mines
        const reveal = (r: number, c: number) => {
          if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
          const targetCell = newBoard[r][c];
          if (targetCell.isRevealed || targetCell.isFlagged || targetCell.isMine) return;

          targetCell.isRevealed = true;
          setRevealedCount(prev => prev + 1);

          if (targetCell.adjacentMines === 0) {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                reveal(r + dr, c + dc);
              }
            }
          }
        };

        reveal(row, col);

        // Check win condition
        let revealed = 0;
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (newBoard[r][c].isRevealed && !newBoard[r][c].isMine) {
              revealed++;
            }
          }
        }
        if (revealed === ROWS * COLS - MINE_COUNT) {
          setGameWon(true);
        }

        return newBoard;
      });
    },
    [gameOver, gameWon, gameStarted]
  );

  const toggleFlag = useCallback(
    (row: number, col: number, e: React.MouseEvent) => {
      e.preventDefault();
      if (gameOver || gameWon) return;

      setBoard(prevBoard => {
        const newBoard = prevBoard.map(r => r.map(c => ({ ...c })));
        const cell = newBoard[row][col];

        if (cell.isRevealed) return prevBoard;

        if (!gameStarted) {
          setGameStarted(true);
        }

        if (cell.isFlagged) {
          cell.isFlagged = false;
          setFlagCount(prev => prev - 1);
        } else if (flagCount < MINE_COUNT) {
          cell.isFlagged = true;
          setFlagCount(prev => prev + 1);
        }

        return newBoard;
      });
    },
    [gameOver, gameWon, gameStarted, flagCount]
  );

  const getCellColor = (cell: Cell) => {
    if (!cell.isRevealed) return 'bg-gray-300 hover:bg-gray-400';
    if (cell.isMine) return 'bg-red-500';
    return 'bg-gray-100';
  };

  const getNumberColor = (num: number) => {
    const colors = [
      '',
      'text-blue-600',
      'text-green-600',
      'text-red-600',
      'text-purple-600',
      'text-orange-600',
      'text-teal-600',
      'text-pink-600',
      'text-gray-600',
    ];
    return colors[num] || 'text-gray-600';
  };

  return (
    <div className="h-full bg-gradient-to-br from-orange-100 to-red-100 flex flex-col">
      <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
          ← 返回
        </button>
        <div className="flex gap-6 items-center">
          <div className="text-center">
            <div className="text-sm text-gray-600">剩余雷数</div>
            <div className="text-2xl font-bold text-red-600">{MINE_COUNT - flagCount}</div>
          </div>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            {gameStarted ? '重新开始' : '开始游戏'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="inline-block border-4 border-gray-300 rounded-lg shadow-2xl bg-white p-2 relative">
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-7 h-7 flex items-center justify-center font-bold text-sm transition-colors rounded ${getCellColor(
                    cell
                  )}`}
                  onClick={() => revealCell(rowIndex, colIndex)}
                  onContextMenu={e => toggleFlag(rowIndex, colIndex, e)}
                  disabled={gameOver || gameWon}
                >
                  {cell.isRevealed && cell.isMine && '💣'}
                  {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 && (
                    <span className={getNumberColor(cell.adjacentMines)}>{cell.adjacentMines}</span>
                  )}
                  {!cell.isRevealed && cell.isFlagged && '🚩'}
                </button>
              ))
            )}
          </div>

          {(gameOver || gameWon) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
              <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
                <div className="text-6xl mb-4">{gameWon ? '🎉' : '💥'}</div>
                <div className="text-2xl font-bold mb-2">{gameWon ? '你赢了！' : '游戏结束！'}</div>
                <div className="text-gray-600 mb-4">{gameWon ? '成功找出所有地雷！' : '踩到地雷了！'}</div>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  再玩一次
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200 text-center text-sm text-gray-600">
        左键点击翻开格子，右键点击插旗
      </div>
    </div>
  );
}
