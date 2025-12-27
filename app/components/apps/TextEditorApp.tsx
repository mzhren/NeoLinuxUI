'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

export default function TextEditorApp() {
  const { theme, accentColor } = useTheme();
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState('untitled.txt');
  const [isSaved, setIsSaved] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 统计信息
  const lines = content.split('\n').length;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const characters = content.length;
  const charactersNoSpaces = content.replace(/\s/g, '').length;

  // 监听内容变化
  useEffect(() => {
    if (content) {
      setIsSaved(false);
    }
  }, [content]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S 保存
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Ctrl+O 打开
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        handleOpen();
      }
      // Ctrl+N 新建
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNew();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, filename]);

  // 新建文件
  const handleNew = () => {
    if (!isSaved && content) {
      if (confirm('当前文件未保存，是否继续？')) {
        setContent('');
        setFilename('untitled.txt');
        setIsSaved(true);
      }
    } else {
      setContent('');
      setFilename('untitled.txt');
      setIsSaved(true);
    }
  };

  // 打开文件
  const handleOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFileRead = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
        setFilename(file.name);
        setIsSaved(true);
      };
      reader.readAsText(file);
    }
  };

  // 保存文件
  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setIsSaved(true);
  };

  // 字体大小调整
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 32));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 10));

  // 插入常用内容
  const insertTemplate = (template: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + template + content.substring(end);
    setContent(newContent);

    // 设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + template.length, start + template.length);
    }, 0);
  };

  return (
    <div className={`h-full w-full flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* 顶部工具栏 */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        {/* 左侧工具 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNew}
            className={`px-3 py-1.5 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors flex items-center gap-1`}
            title="新建 (Ctrl+N)"
          >
            📄 新建
          </button>
          <button
            onClick={handleOpen}
            className={`px-3 py-1.5 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors flex items-center gap-1`}
            title="打开 (Ctrl+O)"
          >
            📂 打开
          </button>
          <button
            onClick={handleSave}
            className={`px-3 py-1.5 text-xs rounded bg-${accentColor}-500 hover:bg-${accentColor}-600 text-white transition-colors flex items-center gap-1`}
            title="保存 (Ctrl+S)"
          >
            💾 保存
          </button>
          <div className="w-px h-6 bg-gray-600 mx-1"></div>
          <button
            onClick={decreaseFontSize}
            className={`px-2 py-1.5 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            title="减小字体"
          >
            A-
          </button>
          <span className="text-xs px-2">{fontSize}px</span>
          <button
            onClick={increaseFontSize}
            className={`px-2 py-1.5 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            title="增大字体"
          >
            A+
          </button>
        </div>

        {/* 中间文件名 */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className={`px-3 py-1 text-sm rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-${accentColor}-500`}
            style={{ width: '200px' }}
          />
          {!isSaved && <span className="text-orange-500 text-xs">●未保存</span>}
        </div>

        {/* 右侧选项 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLineNumbers(!lineNumbers)}
            className={`px-3 py-1.5 text-xs rounded ${lineNumbers ? `bg-${accentColor}-500 text-white` : `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} transition-colors`}
            title="行号"
          >
            #
          </button>
          <button
            onClick={() => setWordWrap(!wordWrap)}
            className={`px-3 py-1.5 text-xs rounded ${wordWrap ? `bg-${accentColor}-500 text-white` : `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} transition-colors`}
            title="自动换行"
          >
            ↩
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-3 py-1.5 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            title="统计信息"
          >
            📊
          </button>
        </div>
      </div>

      {/* 快速插入模板栏 */}
      <div className={`flex items-center gap-2 px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'} overflow-x-auto`}>
        <span className="text-xs opacity-60 mr-2">快速插入:</span>
        <button
          onClick={() => insertTemplate('# 标题\n\n')}
          className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors whitespace-nowrap`}
        >
          标题
        </button>
        <button
          onClick={() => insertTemplate('- 列表项\n')}
          className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors whitespace-nowrap`}
        >
          列表
        </button>
        <button
          onClick={() => insertTemplate('```\n代码块\n```\n')}
          className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors whitespace-nowrap`}
        >
          代码
        </button>
        <button
          onClick={() => insertTemplate('**粗体**')}
          className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors whitespace-nowrap`}
        >
          粗体
        </button>
        <button
          onClick={() => insertTemplate('*斜体*')}
          className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors whitespace-nowrap`}
        >
          斜体
        </button>
        <button
          onClick={() => insertTemplate('[链接](url)')}
          className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors whitespace-nowrap`}
        >
          链接
        </button>
      </div>

      {/* 编辑区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 行号 */}
        {lineNumbers && (
          <div className={`w-12 ${theme === 'dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'} text-right py-4 pr-3 text-xs font-mono overflow-hidden select-none border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            {Array.from({ length: lines }, (_, i) => (
              <div key={i} style={{ lineHeight: `${fontSize * 1.5}px` }}>
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* 文本区域 */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`flex-1 p-4 font-mono resize-none focus:outline-none ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: `${fontSize * 1.5}px`,
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            tabSize: 4,
          }}
          placeholder="开始输入..."
          spellCheck={false}
        />
      </div>

      {/* 底部状态栏 */}
      <div className={`flex items-center justify-between px-4 py-2 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} text-xs`}>
        <div className="flex items-center gap-4">
          <span>行: {lines}</span>
          <span>字数: {words}</span>
          <span>字符: {characters}</span>
          {showStats && (
            <>
              <span>字符(不含空格): {charactersNoSpaces}</span>
              <span>大小: {new Blob([content]).size} bytes</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <span>UTF-8</span>
          <span>·</span>
          <span>Plain Text</span>
        </div>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.json,.js,.jsx,.ts,.tsx,.html,.css,.xml,.csv"
        onChange={handleFileRead}
        className="hidden"
      />
    </div>
  );
}
