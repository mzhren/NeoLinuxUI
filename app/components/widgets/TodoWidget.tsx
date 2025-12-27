'use client';

import { useState, useEffect } from 'react';

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: 'low' | 'medium' | 'high';
}

interface TodoWidgetProps {
  onRemove: () => void;
}

export default function TodoWidget({ onRemove }: TodoWidgetProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // 从 localStorage 加载待办事项
  useEffect(() => {
    const saved = localStorage.getItem('neolinux-todos');
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load todos:', e);
      }
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    if (todos.length > 0 || localStorage.getItem('neolinux-todos')) {
      localStorage.setItem('neolinux-todos', JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now(),
        text: newTodoText.trim(),
        completed: false,
        createdAt: Date.now(),
        priority,
      };
      setTodos([newTodo, ...todos]);
      setNewTodoText('');
      setPriority('medium');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(t => !t.completed).length;

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (p: string) => {
    switch (p) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl text-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✓</span>
          <h3 className="font-bold text-lg">待办事项</h3>
        </div>
      
      </div>

      {/* 添加待办 */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="添加新任务..."
            className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-sm font-medium transition-colors"
          >
            添加
          </button>
        </div>
        
        {/* 优先级选择 */}
        <div className="flex gap-2 text-xs">
          <span className="text-white/70">优先级:</span>
          {(['low', 'medium', 'high'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`px-2 py-1 rounded transition-colors ${
                priority === p 
                  ? `${getPriorityColor(p)} text-white` 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {getPriorityLabel(p)}
            </button>
          ))}
        </div>
      </div>

      {/* 过滤器 */}
      <div className="flex gap-2 mb-3 text-xs">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded transition-colors ${
              filter === f 
                ? 'bg-white/20 text-white' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {f === 'all' ? '全部' : f === 'active' ? '进行中' : '已完成'}
          </button>
        ))}
      </div>

      {/* 待办列表 */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center text-white/50 text-sm py-8">
            {filter === 'completed' ? '还没有完成的任务' : '暂无待办事项'}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-start gap-2 p-2 rounded bg-white/5 hover:bg-white/10 transition-colors group ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  todo.completed 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-white/40 hover:border-white/60'
                }`}
              >
                {todo.completed && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority)}`}></span>
                  <span className={`text-sm ${todo.completed ? 'line-through text-white/60' : 'text-white'}`}>
                    {todo.text}
                  </span>
                </div>
                <span className="text-xs text-white/40">
                  {new Date(todo.createdAt).toLocaleDateString('zh-CN', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-lg transition-all"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* 底部统计 */}
      <div className="flex items-center justify-between text-xs text-white/70 pt-3 border-t border-white/10">
        <span>{activeTodosCount} 个待办</span>
        {todos.some(t => t.completed) && (
          <button
            onClick={clearCompleted}
            className="hover:text-white transition-colors"
          >
            清除已完成
          </button>
        )}
      </div>
    </div>
  );
}
