'use client';

import { useMemo, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { WeatherData } from '@/types/weather';
import { useUnits } from '@/context/UnitsContext';
import { UNITS } from '@/constants';

interface HourlyChartProps {
  hourlyData: WeatherData['hourly'];
  timezone: string;
}

// HourlyChart component to display hourly temperature data in a line chart
const HourlyChart = memo(function HourlyChart({ hourlyData, timezone }: HourlyChartProps) {
  const { unit } = useUnits();
  const unitSymbol = unit === UNITS.CELSIUS ? 'C' : 'F';

  const chartData = useMemo(() => {
    const now = new Date();
    let startIndex = hourlyData.time.findIndex(t => new Date(t) > now);

    if (startIndex === -1) {
      startIndex = 0;
    }

    const endIndex = startIndex + 24;

    return hourlyData.time.slice(startIndex, endIndex).map((time, index) => ({
      time: new Date(time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
        timeZone: timezone,
      }),
      temp: Math.round(hourlyData.temperature_2m[startIndex + index]),
    }));
  }, [hourlyData, timezone]);

  return (
    <div className="mt-8 rounded-2xl bg-white/20 p-6 shadow-lg backdrop-blur-md">
      <h3 className="mb-4 text-lg font-bold text-white">Hourly Forecast</h3>
      
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5, }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
            
            <XAxis
              dataKey="time"
              stroke="white"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval={2} 
            />

            <YAxis
              stroke="white"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 2', 'dataMax + 2']}
              tickFormatter={(value) => `${value}°`}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(50, 50, 50, 0.8)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
              }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value) => [`${value}°${unitSymbol}`, 'Temp']}
            />
            
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#facc15"
              strokeWidth={2}
              dot={{ r: 3, fill: '#facc15' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

HourlyChart.displayName = 'HourlyChart';

export default HourlyChart;