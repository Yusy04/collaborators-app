interface StatsCardProps {
  title: string;
  label?: string; // alias for title
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon?: React.ReactNode;
  color?: 'gray' | 'green' | 'blue' | 'yellow' | 'purple';
}

const colorClasses = {
  gray: 'bg-gray-50',
  green: 'bg-green-50',
  blue: 'bg-blue-50',
  yellow: 'bg-yellow-50',
  purple: 'bg-purple-50',
};

export const StatsCard = ({
  title,
  label,
  value,
  subtitle,
  trend,
  icon,
  color = 'gray',
}: StatsCardProps) => (
  <div className={`${colorClasses[color]} rounded-xl p-5`}>
    <div className="flex items-start justify-between">
      <div>
        <div className="text-sm text-gray-600 mb-1">{label || title}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
        {trend && <div className="text-xs text-green-600 mt-1">{trend}</div>}
      </div>
      {icon && <div className="text-2xl">{icon}</div>}
    </div>
  </div>
);
