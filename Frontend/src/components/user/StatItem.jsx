const StatItem = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl font-bold text-gray-900">{value}</span>
    <span className="text-sm text-gray-500">{label}</span>
  </div>
);

export default StatItem;
