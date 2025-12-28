'use client';

import { useState, useRef, useEffect } from 'react';

export default function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'line' | 'rectangle' | 'circle'>('brush');
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [tempCanvas, setTempCanvas] = useState<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 初始化白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 保存当前画布状态（用于形状工具）
    if (tool === 'line' || tool === 'rectangle' || tool === 'circle') {
      setTempCanvas(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    if (tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'brush') {
      ctx.strokeStyle = color;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'line' && startPos && tempCanvas) {
      // 恢复画布并绘制线条
      ctx.putImageData(tempCanvas, 0, 0);
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'rectangle' && startPos && tempCanvas) {
      // 恢复画布并绘制矩形
      ctx.putImageData(tempCanvas, 0, 0);
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.rect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
      ctx.stroke();
    } else if (tool === 'circle' && startPos && tempCanvas) {
      // 恢复画布并绘制圆形
      ctx.putImageData(tempCanvas, 0, 0);
      ctx.strokeStyle = color;
      ctx.beginPath();
      const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setStartPos(null);
    setTempCanvas(null);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `painting-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#808080',
    '#FFFFFF', '#FFC0CB', '#A52A2A', '#00CED1', '#FF1493'
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 工具栏 */}
      <div className="p-3 bg-white border-b border-gray-200 flex items-center gap-4 flex-wrap">
        {/* 工具选择 */}
        <div className="flex gap-2">
          <button
            onClick={() => setTool('brush')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tool === 'brush' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title="画笔"
          >
            🖌️ 画笔
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title="橡皮擦"
          >
            🧹 橡皮擦
          </button>
          <button
            onClick={() => setTool('line')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tool === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title="直线"
          >
            ➖ 直线
          </button>
          <button
            onClick={() => setTool('rectangle')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tool === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title="矩形"
          >
            ⬜ 矩形
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title="圆形"
          >
            ⭕ 圆形
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300"></div>

        {/* 画笔大小 */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">大小:</label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-600 w-8">{brushSize}</span>
        </div>

        <div className="w-px h-8 bg-gray-300"></div>

        {/* 颜色选择 */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">颜色:</label>
          <div className="flex gap-1">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110 ${
                  color === c ? 'border-blue-500 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
            title="自定义颜色"
          />
        </div>

        <div className="w-px h-8 bg-gray-300"></div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="px-3 py-1.5 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
            title="清空画布"
          >
            🗑️ 清空
          </button>
          <button
            onClick={saveImage}
            className="px-3 py-1.5 rounded text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
            title="保存图片"
          >
            💾 保存
          </button>
        </div>
      </div>

      {/* 画布区域 */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg inline-block">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="cursor-crosshair border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* 状态栏 */}
      <div className="px-4 py-2 bg-white border-t border-gray-200 text-xs text-gray-600">
        当前工具: {tool === 'brush' ? '画笔' : tool === 'eraser' ? '橡皮擦' : tool === 'line' ? '直线' : tool === 'rectangle' ? '矩形' : '圆形'} | 
        颜色: {color} | 
        大小: {brushSize}px | 
        画布尺寸: 1200 × 800
      </div>
    </div>
  );
}
