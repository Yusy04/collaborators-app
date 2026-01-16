interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export const PieChart = ({ data, size = 160 }: PieChartProps) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  // Handle empty data
  if (total === 0 || data.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="50" fill="#f3f4f6" />
          <circle cx="50" cy="50" r="30" fill="white" />
        </svg>
        <p className="text-sm text-gray-400 mt-4">No data</p>
      </div>
    );
  }
  
  // Handle single item (100%) case - draw full donut ring
  if (data.length === 1 || data.filter(d => d.value > 0).length === 1) {
    const item = data.find(d => d.value > 0) || data[0];
    return (
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 100 100" width={size} height={size} className="drop-shadow-lg">
          {/* Outer circle */}
          <circle cx="50" cy="50" r="50" fill={item.color} />
          {/* Inner circle (donut hole) */}
          <circle cx="50" cy="50" r="30" fill="white" />
        </svg>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-semibold" style={{ color: item.color }}>
              100%
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  let currentAngle = -90; // Start from top

  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // Calculate arc path
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const radius = 50;
    const innerRadius = 30;
    const cx = 50;
    const cy = 50;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const x3 = cx + innerRadius * Math.cos(endRad);
    const y3 = cy + innerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(startRad);
    const y4 = cy + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;

    return { ...item, percentage, path };
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" width={size} height={size} className="drop-shadow-lg">
        {slices.map((slice, i) => (
          <path
            key={i}
            d={slice.path}
            fill={slice.color}
            className="transition-all duration-300 hover:opacity-80"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
          />
        ))}
        {/* Center circle */}
        <circle cx="50" cy="50" r="25" fill="white" />
      </svg>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-sm text-gray-600">{slice.label}</span>
            <span className="text-sm font-semibold" style={{ color: slice.color }}>
              {slice.percentage.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
