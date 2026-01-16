import type { DailyDataPoint } from '../types';

interface AreaChartProps {
  data: DailyDataPoint[];
  dataKey: 'clicks' | 'orders';
  color: string;
  gradientId?: string;
  height?: number;
  showLabels?: boolean;
  showDots?: boolean;
  showSecondary?: boolean;
}

// Smooth bezier curve helper
function createSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    
    // Catmull-Rom to Bezier conversion
    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  
  return path;
}

export const AreaChart = ({ 
  data, 
  dataKey, 
  color, 
  gradientId = 'areaGradient',
  height = 200,
  showLabels = true,
  showDots = true,
  showSecondary = false,
}: AreaChartProps) => {
  if (!data.length) return null;

  const values = data.map(d => d[dataKey]);
  const secondaryValues = data.map(d => d.orders);
  const allValues = showSecondary ? [...values, ...secondaryValues] : values;
  const max = Math.max(...allValues, 1);
  const min = 0;
  const range = max - min || 1;

  const padding = { top: 15, right: 5, bottom: 25, left: 25 };
  const chartWidth = 200;
  const chartHeight = 80;

  const points = values.map((value, index) => {
    const x = padding.left + (index / Math.max(values.length - 1, 1)) * (chartWidth - padding.left - padding.right);
    const y = padding.top + (1 - (value - min) / range) * (chartHeight - padding.top - padding.bottom);
    return { x, y, value };
  });

  const secondaryPoints = secondaryValues.map((value, index) => {
    const x = padding.left + (index / Math.max(secondaryValues.length - 1, 1)) * (chartWidth - padding.left - padding.right);
    const y = padding.top + (1 - (value - min) / range) * (chartHeight - padding.top - padding.bottom);
    return { x, y, value };
  });

  const linePath = createSmoothPath(points);
  const secondaryLinePath = createSmoothPath(secondaryPoints);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;
  const secondaryAreaPath = `${secondaryLinePath} L ${secondaryPoints[secondaryPoints.length - 1].x} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

  // Show only a few labels - spread evenly
  const labelCount = 6;
  const labelIndices = data.length <= labelCount 
    ? data.map((_, i) => i) 
    : Array.from({ length: labelCount }, (_, i) => Math.floor(i * (data.length - 1) / (labelCount - 1)));

  // Y-axis values
  const yAxisValues = [0, Math.round(max * 0.5), Math.round(max)];

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        {/* Primary gradient - horizontal warm gradient */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFB800" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#FF6B6B" stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.25" />
        </linearGradient>
        {showSecondary && (
          <linearGradient id={`${gradientId}-secondary`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
          </linearGradient>
        )}
      </defs>

      {/* Grid lines - horizontal */}
      {[0, 0.5, 1].map((ratio, i) => {
        const y = padding.top + ratio * (chartHeight - padding.top - padding.bottom);
        return (
          <line
            key={i}
            x1={padding.left}
            y1={y}
            x2={chartWidth - padding.right}
            y2={y}
            stroke="#f0f0f0"
            strokeWidth="0.3"
          />
        );
      })}

      {/* Y-axis labels */}
      {yAxisValues.map((value, i) => {
        const y = padding.top + (1 - value / max) * (chartHeight - padding.top - padding.bottom);
        return (
          <text
            key={i}
            x={padding.left - 4}
            y={y + 2}
            textAnchor="end"
            fill="#9ca3af"
            style={{ fontSize: '5px', fontFamily: 'system-ui' }}
          >
            {value}
          </text>
        );
      })}

      {/* Secondary Area + Line (if enabled) - draw first so primary is on top */}
      {showSecondary && (
        <>
          <path d={secondaryAreaPath} fill={`url(#${gradientId}-secondary)`} />
          <path
            d={secondaryLinePath}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {/* Primary Area */}
      <path d={areaPath} fill={`url(#${gradientId})`} />
      
      {/* Primary Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots on secondary line */}
      {showSecondary && showDots && secondaryPoints.filter((_, i) => labelIndices.includes(i)).map((point, i) => (
        <circle
          key={`sec-${i}`}
          cx={point.x}
          cy={point.y}
          r="2"
          fill="white"
          stroke="#8B5CF6"
          strokeWidth="1"
        />
      ))}

      {/* Dots on primary line */}
      {showDots && points.filter((_, i) => labelIndices.includes(i)).map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="2"
          fill="white"
          stroke={color}
          strokeWidth="1"
        />
      ))}

      {/* X-axis labels */}
      {showLabels && labelIndices.map((idx) => (
        <text
          key={idx}
          x={points[idx].x}
          y={chartHeight - padding.bottom + 8}
          textAnchor="middle"
          fill="#9ca3af"
          style={{ fontSize: '4.5px', fontFamily: 'system-ui' }}
        >
          {data[idx].date}
        </text>
      ))}
    </svg>
  );
};
