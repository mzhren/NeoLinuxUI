import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsAppProps {
  windowId: string;
}

type SettingsTab = 'appearance' | 'system' | 'display' | 'network' | 'privacy' | 'about';

export default function SettingsApp({ windowId }: SettingsAppProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const {
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    fontSize,
    setFontSize,
    transparencyEnabled,
    setTransparencyEnabled,
    backgroundType,
    setBackgroundType,
    backgroundImage,
    setBackgroundImage,
    scaling,
    setScaling,
    nightMode,
    setNightMode,
    autoUpdate,
    setAutoUpdate,
    notifications,
    setNotifications,
    soundEnabled,
    setSoundEnabled,
  } = useTheme();
  
  // Display settings (local only, not affecting global theme)
  const [resolution, setResolution] = useState('1920x1080');
  const [refreshRate, setRefreshRate] = useState('60Hz');
  
  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'appearance', label: '外观', icon: '🎨' },
    { id: 'system', label: '系统', icon: '⚙️' },
    { id: 'display', label: '显示', icon: '🖥️' },
    { id: 'network', label: '网络', icon: '🌐' },
    { id: 'privacy', label: '隐私', icon: '🔒' },
    { id: 'about', label: '关于', icon: 'ℹ️' },
  ];

  const accentColors = [
    { name: 'blue', color: 'bg-blue-500', label: '蓝色' },
    { name: 'purple', color: 'bg-purple-500', label: '紫色' },
    { name: 'pink', color: 'bg-pink-500', label: '粉色' },
    { name: 'green', color: 'bg-green-500', label: '绿色' },
    { name: 'orange', color: 'bg-orange-500', label: '橙色' },
    { name: 'red', color: 'bg-red-500', label: '红色' },
  ];

  const renderSettingItem = (label: string, description: string, control: React.ReactNode) => (
    <div className="flex items-center justify-between py-4 border-b border-white/5">
      <div>
        <div className="font-medium text-white">{label}</div>
        <div className="text-sm text-white/60 mt-1">{description}</div>
      </div>
      <div>{control}</div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white mb-4">外观设置</h2>
            
            {renderSettingItem(
              '主题',
              '选择系统主题颜色',
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'dark' | 'light' | 'auto')}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dark">深色</option>
                <option value="light">浅色</option>
                <option value="auto">自动</option>
              </select>
            )}

            {renderSettingItem(
              '强调色',
              '选择系统强调色',
              <div className="flex gap-2">
                {accentColors.map((ac) => (
                  <button
                    key={ac.name}
                    onClick={() => setAccentColor(ac.name as any)}
                    className={`w-8 h-8 rounded-full ${ac.color} ${
                      accentColor === ac.name ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50' : ''
                    } transition-all hover:scale-110`}
                    title={ac.label}
                  />
                ))}
              </div>
            )}

            {renderSettingItem(
              '字体大小',
              '调整系统字体大小',
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large' | 'xlarge')}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
                <option value="xlarge">特大</option>
              </select>
            )}

            {renderSettingItem(
              '透明效果',
              '启用窗口和背景的模糊透明效果',
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={transparencyEnabled}
                  onChange={(e) => setTransparencyEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            )}

            <div className="py-4 border-b border-white/5">
              <div className="font-medium text-white mb-2">桌面背景</div>
              <div className="text-sm text-white/60 mb-4">选择渐变色或自定义背景图片</div>
              
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setBackgroundType('gradient')}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                    backgroundType === 'gradient'
                      ? 'bg-blue-500 border-blue-400 text-white'
                      : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                  }`}
                >
                  🌈 渐变色
                </button>
                <button
                  onClick={() => setBackgroundType('image')}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                    backgroundType === 'image'
                      ? 'bg-blue-500 border-blue-400 text-white'
                      : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                  }`}
                >
                  🖼️ 图片
                </button>
              </div>

              {backgroundType === 'image' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">预设壁纸</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80', label: '山脉' },
                        { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80', label: '山峰' },
                        { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', label: '北极光' },
                        { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80', label: '渐变' },
                        { url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80', label: '海洋' },
                        { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80', label: '星空' },
                        { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80', label: '自然' },
                        { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80', label: '日落' },
                        { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80', label: '森林' },
                        { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80', label: '海滩' },
                        { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', label: '雪山' },
                        { url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920&q=80', label: '湖泊' },
                      ].map((preset) => (
                        <button
                          key={preset.url}
                          onClick={() => setBackgroundImage(preset.url)}
                          className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            backgroundImage === preset.url
                              ? 'border-blue-500 ring-2 ring-blue-500/50'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{preset.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">自定义URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={backgroundImage}
                        onChange={(e) => setBackgroundImage(e.target.value)}
                        placeholder="输入图片URL"
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {backgroundImage && (
                        <button
                          onClick={() => setBackgroundImage('')}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                        >
                          清除
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white mb-4">系统设置</h2>

            {renderSettingItem(
              '自动更新',
              '自动下载并安装系统更新',
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={autoUpdate}
                  onChange={(e) => setAutoUpdate(e.target.checked)}
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            )}

            {renderSettingItem(
              '通知',
              '显示系统和应用通知',
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            )}

            {renderSettingItem(
              '系统音效',
              '启用系统提示音和反馈音效',
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            )}

            {renderSettingItem(
              '存储',
              '查看磁盘使用情况',
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                管理存储
              </button>
            )}

            {renderSettingItem(
              '启动程序',
              '管理开机自启动应用',
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors">
                编辑
              </button>
            )}
          </div>
        );

      case 'display':
        return (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white mb-4">显示设置</h2>

            {renderSettingItem(
              '分辨率',
              '调整屏幕显示分辨率',
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1920x1080">1920 x 1080</option>
                <option value="2560x1440">2560 x 1440</option>
                <option value="3840x2160">3840 x 2160 (4K)</option>
                <option value="1366x768">1366 x 768</option>
              </select>
            )}

            {renderSettingItem(
              '刷新率',
              '设置屏幕刷新率',
              <select
                value={refreshRate}
                onChange={(e) => setRefreshRate(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="60Hz">60 Hz</option>
                <option value="75Hz">75 Hz</option>
                <option value="120Hz">120 Hz</option>
                <option value="144Hz">144 Hz</option>
              </select>
            )}

            {renderSettingItem(
              '缩放',
              '调整界面元素大小',
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="75"
                  max="200"
                  step="25"
                  value={scaling}
                  onChange={(e) => setScaling(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-white font-medium w-12">{scaling}%</span>
              </div>
            )}

            {renderSettingItem(
              '夜间模式',
              '减少蓝光以保护眼睛',
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={nightMode}
                  onChange={(e) => setNightMode(e.target.checked)}
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            )}
          </div>
        );

      case 'network':
        return (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white mb-4">网络设置</h2>

            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-white font-medium">已连接</div>
                  <div className="text-white/60 text-sm">WiFi-Network-5G</div>
                </div>
              </div>
            </div>

            {renderSettingItem(
              'WiFi',
              '管理无线网络连接',
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                配置
              </button>
            )}

            {renderSettingItem(
              '以太网',
              '有线网络连接设置',
              <span className="text-white/40">未连接</span>
            )}

            {renderSettingItem(
              'VPN',
              '虚拟专用网络设置',
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors">
                添加 VPN
              </button>
            )}

            {renderSettingItem(
              '代理',
              '网络代理配置',
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors">
                设置
              </button>
            )}
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white mb-4">隐私与安全</h2>

            {renderSettingItem(
              '位置服务',
              '允许应用访问您的位置信息',
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            )}

            {renderSettingItem(
              '摄像头',
              '管理应用摄像头访问权限',
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors">
                管理
              </button>
            )}

            {renderSettingItem(
              '麦克风',
              '管理应用麦克风访问权限',
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors">
                管理
              </button>
            )}

            {renderSettingItem(
              '数据收集',
              '帮助改进系统体验',
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            )}

            {renderSettingItem(
              '清除缓存',
              '删除临时文件和缓存数据',
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                清除
              </button>
            )}
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">关于系统</h2>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🐧</div>
                <div className="text-2xl font-bold text-white">NeoLinux OS</div>
                <div className="text-white/60">版本 1.0.0 (Build 20250101)</div>
                <div className="text-white/40 text-sm">基于 Linux Kernel 6.5.0</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white/60">处理器</span>
                <span className="text-white">Intel Core i7-12700K @ 3.60GHz</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white/60">内存</span>
                <span className="text-white">16 GB DDR4</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white/60">显卡</span>
                <span className="text-white">NVIDIA GeForce RTX 3070</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white/60">磁盘</span>
                <span className="text-white">512 GB NVMe SSD</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium">
                检查更新
              </button>
              <button className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors font-medium">
                系统报告
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-black/40 backdrop-blur-sm text-white">
      {/* Sidebar */}
      <div className="w-64 bg-black/30 border-r border-white/10 p-4">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}
