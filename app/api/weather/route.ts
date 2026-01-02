import { NextRequest, NextResponse } from 'next/server';

const QWEATHER_KEY = process.env.QWEATHER_API_KEY || 'a4155281725045ee8d6277fa0413fb96';
const QWEATHER_API_BASE = process.env.QWEATHER_API_HOST || 'https://q32tup9pyu.re.qweatherapi.com';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cityId = searchParams.get('cityId');

    if (!cityId) {
      return NextResponse.json(
        { error: '缺少城市ID参数' },
        { status: 400 }
      );
    }

    // 调用和风天气API
    const response = await fetch(
      `${QWEATHER_API_BASE}/v7/weather/now?location=${cityId}&key=${QWEATHER_KEY}`,
      {
        next: { revalidate: 600 } // 缓存10分钟
      }
    );

    if (!response.ok) {
      throw new Error('获取天气数据失败');
    }

    const data = await response.json();

    if (data.code !== '200') {
      return NextResponse.json(
        { error: '天气API返回错误', code: data.code },
        { status: 400 }
      );
    }

    // 返回天气数据
    return NextResponse.json({
      success: true,
      data: {
        temperature: data.now.temp,
        feelsLike: data.now.feelsLike,
        text: data.now.text,
        icon: data.now.icon,
        humidity: data.now.humidity,
        windSpeed: data.now.windSpeed,
        pressure: data.now.pressure,
        updateTime: data.now.obsTime
      }
    });

  } catch (error) {
    console.error('天气API错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
