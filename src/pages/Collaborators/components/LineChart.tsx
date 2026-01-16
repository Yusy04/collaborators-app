import type { DailyDataPoint } from '../types';

interface LineChartProps {
  data: DailyDataPoint[];
  dataKey: 'clicks' | 'orders';
  color: string;
  height?: number;
}

export const LineChart = ({ data, dataKey, color, height = 120 }: LineChartProps) => {
  const values = data.map(d => d[dataKey]);
  const max = Math.max(...values, 1);
  const min = 0;
  const range = max - min;

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#gradient-${dataKey})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};
