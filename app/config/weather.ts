/**
 * 天气API配置
 * 
 * 使用和风天气免费API
 * 注册地址: https://dev.qweather.com/
 * 
 * 免费版本限制:
 * - 每天调用次数: 1000次
 * - 支持功能: 实时天气、天气预报、天气灾害预警等
 * 
 * 使用步骤:
 * 1. 访问 https://dev.qweather.com/ 注册账号
 * 2. 创建应用获取 API Key
 * 3. 在 .env.local 文件中配置 QWEATHER_API_KEY
 * 4. 重启开发服务器
 * 
 * 注意: API Key 现在通过 API Route 调用，不会暴露到前端
 */

// 城市配置 - 使用和风天气的城市ID
export const WEATHER_CITIES = [
  // 直辖市
  { city: '北京', cityId: '101010100' },
  { city: '上海', cityId: '101020100' },
  { city: '天津', cityId: '101030100' },
  { city: '重庆', cityId: '101040100' },
  
  // 省会城市（按拼音排序）
  { city: '长春', cityId: '101060101' },
  { city: '长沙', cityId: '101250101' },
  { city: '成都', cityId: '101270101' },
  { city: '福州', cityId: '101230101' },
  { city: '广州', cityId: '101280101' },
  { city: '贵阳', cityId: '101260101' },
  { city: '哈尔滨', cityId: '101050101' },
  { city: '海口', cityId: '101310101' },
  { city: '杭州', cityId: '101210101' },
  { city: '合肥', cityId: '101220101' },
  { city: '呼和浩特', cityId: '101080101' },
  { city: '济南', cityId: '101120101' },
  { city: '昆明', cityId: '101290101' },
  { city: '兰州', cityId: '101160101' },
  { city: '拉萨', cityId: '101140101' },
  { city: '南昌', cityId: '101240101' },
  { city: '南京', cityId: '101190101' },
  { city: '南宁', cityId: '101300101' },
  { city: '沈阳', cityId: '101070101' },
  { city: '石家庄', cityId: '101090101' },
  { city: '太原', cityId: '101100101' },
  { city: '乌鲁木齐', cityId: '101130101' },
  { city: '武汉', cityId: '101200101' },
  { city: '西安', cityId: '101110101' },
  { city: '西宁', cityId: '101150101' },
  { city: '银川', cityId: '101170101' },
  { city: '郑州', cityId: '101180101' },
  
  // 重要二线城市
  { city: '大连', cityId: '101070201' },
  { city: '青岛', cityId: '101120201' },
  { city: '宁波', cityId: '101210401' },
  { city: '厦门', cityId: '101230201' },
  { city: '深圳', cityId: '101280601' },
  { city: '珠海', cityId: '101280701' },
  { city: '苏州', cityId: '101190401' },
  { city: '无锡', cityId: '101190201' },
  { city: '常州', cityId: '101191101' },
  { city: '南通', cityId: '101190501' },
  { city: '温州', cityId: '101210601' },
  { city: '嘉兴', cityId: '101210501' },
  { city: '绍兴', cityId: '101210801' },
  { city: '台州', cityId: '101210901' },
  { city: '金华', cityId: '101210701' },
  { city: '东莞', cityId: '101281601' },
  { city: '佛山', cityId: '101280800' },
  { city: '中山', cityId: '101281701' },
  { city: '惠州', cityId: '101280301' },
  { city: '江门', cityId: '101281401' },
  { city: '烟台', cityId: '101120501' },
  { city: '潍坊', cityId: '101120601' },
  { city: '济宁', cityId: '101120701' },
  { city: '临沂', cityId: '101120901' },
  { city: '唐山', cityId: '101090201' },
  { city: '保定', cityId: '101090201' },
  { city: '徐州', cityId: '101190801' },
  { city: '扬州', cityId: '101190701' },
  { city: '镇江', cityId: '101190301' },
  { city: '泰州', cityId: '101191001' },
  { city: '洛阳', cityId: '101180901' },
  { city: '芜湖', cityId: '101220301' },
  { city: '绵阳', cityId: '101270401' },
  { city: '桂林', cityId: '101300501' },
  { city: '三亚', cityId: '101310201' },
];

// 天气更新间隔 (毫秒)
export const WEATHER_UPDATE_INTERVAL = 10 * 60 * 1000; // 10分钟
