interface MiniChartProps {
  data: number[];
  type: 'bar' | 'line' | 'area';
  color?: string;
}

// Create smooth bezier curve path
function createSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    
    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  
  return path;
}

export const MiniChart = ({ data, type, color = 'white' }: MiniChartProps) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  if (type === 'bar') {
    const barWidth = 100 / data.length;
    const gap = barWidth * 0.2;
    const actualBarWidth = barWidth - gap;
    
    return (
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
        {data.map((value, i) => {
          const height = ((value - min) / range) * 32;
          return (
            <rect
              key={i}
              x={i * barWidth + gap / 2}
              y={38 - height}
              width={actualBarWidth}
              height={height}
              fill={color}
              opacity={0.9}
              rx="2"
            />
          );
        })}
      </svg>
    );
  }

  if (type === 'line' || type === 'area') {
    const points = data.map((value, i) => ({
      x: (i / Math.max(data.length - 1, 1)) * 96 + 2,
      y: 36 - ((value - min) / range) * 30
    }));

    const smoothPath = createSmoothPath(points);
    const areaPath = `${smoothPath} L ${points[points.length - 1].x} 38 L 2 38 Z`;

    return (
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
        {type === 'area' && (
          <path d={areaPath} fill={color} opacity="0.3" />
        )}
        <path
          d={smoothPath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return null;
};
