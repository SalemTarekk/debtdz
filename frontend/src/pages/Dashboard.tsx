import { useDashboard } from '../hooks/useDebts';
import { ar } from '../lib/arabic';

export default function Dashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <div className="text-center py-8 text-gray-500">{ar.loading}</div>;

  const cards = [
    { label: ar.totalDebts, value: data?.total_debts ?? 0, color: 'bg-blue-500' },
    { label: ar.totalPaid, value: data?.total_paid ?? 0, color: 'bg-green-500' },
    { label: ar.outstanding, value: data?.outstanding ?? 0, color: 'bg-orange-500' },
    { label: ar.activeCustomers, value: data?.active_customers ?? 0, color: 'bg-purple-500' },
    { label: ar.activeDebts, value: data?.active_debts ?? 0, color: 'bg-red-500' },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">{ar.dashboard}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-5">
            <div className={`w-10 h-10 rounded-full ${card.color} mb-3`} />
            <div className="text-2xl font-bold">{card.value.toLocaleString('ar-DZ')} {ar.currency}</div>
            <div className="text-sm text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
