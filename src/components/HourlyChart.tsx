'use client';

import { WeatherData } from "@/types/weather";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface HourlyChartProps {
  hourlyData: WeatherData['hourly'];
}

export default function HourlyChart({ hourlyData }: HourlyChartProps) {
  const chartData = hourlyData.time.slice(0, 24).map((time, index) => ({
    time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    temp: Math.round(hourlyData.temperature_2m[index]),
  }));

  return (
    <div className="mt-8 rounded-2xl bg-white/20 p-6 shadow-lg backdrop-blur-md">
      <h3 className="mb-4 text-lg font-bold text-white">Hourly Forecast</h3>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
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

            <YAxis stroke="white" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(50, 50, 50, 0.8)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
              }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value) => [`${value}°C`, 'Temp']}
            />
            
            <Line type="monotone" dataKey="temp" stroke="#facc15" strokeWidth={2} dot={{ r: 3, fill: '#facc15' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}