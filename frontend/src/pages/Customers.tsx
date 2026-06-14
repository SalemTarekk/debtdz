import { useState } from 'react';
import { useCustomers, useDeleteCustomer } from '../hooks/useCustomers';
import { ar } from '../lib/arabic';
import CustomerForm from './CustomerForm';
import CustomerDebts from './CustomerDebts';

export default function Customers() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewCustomerId, setViewCustomerId] = useState<number | null>(null);

  const { data: customers, isLoading } = useCustomers();
  const deleteMutation = useDeleteCustomer();

  const filtered = customers?.filter((c) =>
    c.name.includes(search) || c.phone.includes(search)
  );

  if (viewCustomerId) {
    return (
      <CustomerDebts
        customerId={viewCustomerId}
        onBack={() => setViewCustomerId(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">{ar.customers}</h1>
        <button onClick={() => { setEditId(null); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          {ar.addCustomer}
        </button>
      </div>

      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder={`${ar.search}...`}
        className="w-full border rounded px-3 py-2 text-sm mb-4" />

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CustomerForm editId={editId} onDone={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">{ar.loading}</div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{ar.noData}</div>
      ) : (
        <div className="space-y-3">
          {filtered?.map((c) => (
            <div key={c.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-gray-500">{c.phone}</div>
                {c.remaining !== undefined && (
                  <div className="text-sm text-gray-500">
                    {ar.remaining}: {c.remaining.toLocaleString('ar-DZ')} {ar.currency}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setViewCustomerId(c.id)}
                  className="text-blue-600 text-sm hover:underline">{ar.debts}</button>
                <button onClick={() => { setEditId(c.id); setShowForm(true); }}
                  className="text-gray-600 text-sm hover:underline">{ar.editCustomer}</button>
                <button onClick={() => { if (confirm(ar.confirm)) deleteMutation.mutate(c.id); }}
                  className="text-red-500 text-sm hover:underline">{ar.delete}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
