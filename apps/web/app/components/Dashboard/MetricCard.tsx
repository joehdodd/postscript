interface MetricCardProps {
  title: string;
  value: string | number;
  isHighlight?: boolean;
  loading?: boolean;
}

export function MetricCard({ title, value, isHighlight = false, loading = false }: MetricCardProps) {
  if (loading) {
    return (
      <div className="bg-ps-secondary rounded-lg p-6 shadow-sm">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-6 shadow-sm ${
      isHighlight 
        ? 'bg-green-50 border-green-200 text-green-800 border' 
        : 'bg-ps-secondary'
    }`}>
      <h3 className={`text-sm font-medium mb-2 ${
        isHighlight ? 'text-green-600' : 'text-ps-secondary-600'
      }`}>
        {title}
      </h3>
      <p className={`text-2xl font-bold ${
        isHighlight ? 'text-green-800' : 'text-ps-primary'
      }`}>
        {value}
      </p>
    </div>
  );
}