# 天气Widget配置说明

天气Widget使用和风天气（QWeather）的免费API获取实时天气数据。数据通过自建的 Next.js API Route 获取，确保 API Key 的安全性。

## 架构说明

```
天气Widget (前端)
    ↓
/api/weather (Next.js API Route)
    ↓
和风天气API (第三方服务)
```

**优势：**
- ✅ API Key 不会暴露到前端代码
- ✅ 统一的错误处理和数据格式化
- ✅ 服务端缓存，减少API调用次数
- ✅ 更好的安全性和可维护性

## 配置步骤

### 1. 注册和风天气账号

访问 [和风天气开发平台](https://dev.qweather.com/) 注册账号。

### 2. 创建应用获取API Key

1. 登录后进入控制台
2. 创建新应用（选择"免费订阅"）
3. 应用类型选择"Web API"
4. 复制生成的 API Key

### 3. 配置环境变量

1. 复制 `.env.example` 文件为 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local`，填入你的配置：
   ```env
   # API Key（必需）
   QWEATHER_API_KEY=你的API_Key
   
   # API Base URL（可选）
   QWEATHER_API_BASE=https://devapi.qweather.com/v7
   ```

3. 重启开发服务器：
   ```bash
   npm run dev
   ```

## API Route 说明

### 端点
```
GET /api/weather?cityId={城市ID}
```

### 请求参数
- `cityId` (必需): 城市ID，如 `101010100` (北京)

### 响应格式

**成功响应：**
```json
{
  "success": true,
  "data": {
    "temperature": "25",
    "feelsLike": "26",
    "text": "晴",
    "icon": "100",
    "humidity": "45",
    "windSpeed": "12",
    "pressure": "1013",
    "updateTime": "2026-01-02T14:30+08:00"
  }
}
```

**错误响应：**
```json
{
  "error": "错误信息"
}
```

### 缓存策略
- API Route 使用 Next.js 的 `revalidate` 功能
- 默认缓存时间：10分钟
- 减少不必要的API调用，节省配额

## API限制

和风天气免费版限制：
- 每天最多 1,000 次调用
- 支持实时天气、3天天气预报等基础功能
- 数据更新频率：每小时

Widget默认配置：
- 自动更新间隔：10分钟
- 支持城市：北京、上海、广州、哈尔滨、深圳、成都、杭州、西安、武汉、重庆

## 添加更多城市

编辑 `app/config/weather.ts`，在 `WEATHER_CITIES` 数组中添加新城市：

```typescript
export const WEATHER_CITIES = [
  { city: '城市名', cityId: '城市ID' },
  // ...
];
```

城市ID可以在[和风天气城市列表](https://github.com/qwd/LocationList/blob/master/China-City-List-latest.csv)中查找。

**当前已支持73个城市：**
- 4个直辖市：北京、上海、天津、重庆
- 27个省会城市：全部省会及自治区首府
- 42个重要二线城市：包括深圳、苏州、杭州、成都等经济发达城市

## 天气图标映射

Widget根据和风天气的图标代码自动映射为以下动画效果：

- **晴天 (100-103)**: 太阳动画
- **多云/阴 (104-213)**: 云朵漂浮
- **雨 (300-318, 399-499)**: 雨滴下落
- **雪 (400-457, 499)**: 雪花飘落
- **风 (500-515)**: 风线动画

## 故障排除

### API Key无效

确保：
1. API Key已正确复制（无多余空格）
2. 应用已启用"实时天气"权限
3. 应用状态为"正常"

### 无法获取天气数据

检查：
1. 网络连接是否正常
2. 浏览器控制台是否有跨域错误（开发环境应该没有此问题）
3. 是否超过每日调用次数限制

### 天气数据不更新

默认每10分钟更新一次。如需修改更新频率，编辑 `app/config/weather.ts`：

```typescript
export const WEATHER_UPDATE_INTERVAL = 5 * 60 * 1000; // 改为5分钟
```

## 参考资料

- [和风天气API文档](https://dev.qweather.com/docs/api/)
- [实时天气API](https://dev.qweather.com/docs/api/weather/weather-now/)
- [城市查询](https://dev.qweather.com/docs/api/geoapi/)
