import { useState } from 'react';
import { useCustomerDebts, useCreateDebt, useCreatePayment, useDebtPayments } from '../hooks/useDebts';
import { useCustomer } from '../hooks/useCustomers';
import { ar } from '../lib/arabic';

interface Props {
  customerId: number;
  onBack: () => void;
}

export default function CustomerDebts({ customerId, onBack }: Props) {
  const { data: customer } = useCustomer(customerId);
  const { data: debts, isLoading } = useCustomerDebts(customerId);
  const createDebt = useCreateDebt();
  const createPayment = useCreatePayment();

  const [showDebtForm, setShowDebtForm] = useState(false);
  const [showPaymentFor, setShowPaymentFor] = useState<number | null>(null);
  const [debtAmount, setDebtAmount] = useState('');
  const [debtDesc, setDebtDesc] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [expandedDebt, setExpandedDebt] = useState<number | null>(null);
  const { data: payments } = useDebtPayments(expandedDebt ?? 0);

  const handleAddDebt = async () => {
    if (!debtAmount) return;
    await createDebt.mutateAsync({ customer_id: customerId, amount: Number(debtAmount), description: debtDesc });
    setDebtAmount('');
    setDebtDesc('');
    setShowDebtForm(false);
  };

  const handleAddPayment = async (debtId: number) => {
    if (!payAmount) return;
    await createPayment.mutateAsync({ debt_id: debtId, customer_id: customerId, amount: Number(payAmount), note: payNote });
    setPayAmount('');
    setPayNote('');
    setShowPaymentFor(null);
  };

  return (
    <div>
      <button onClick={onBack} className="text-blue-600 text-sm mb-4 hover:underline">&larr; {ar.customers}</button>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{customer?.name} - {ar.debts}</h1>
        <button onClick={() => setShowDebtForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">{ar.addDebt}</button>
      </div>

      {showDebtForm && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <input type="number" value={debtAmount} onChange={(e) => setDebtAmount(e.target.value)}
            placeholder={`${ar.amount} (${ar.currency})`}
            className="w-full border rounded px-3 py-2 text-sm mb-2" />
          <input type="text" value={debtDesc} onChange={(e) => setDebtDesc(e.target.value)}
            placeholder={ar.description}
            className="w-full border rounded px-3 py-2 text-sm mb-2" />
          <div className="flex gap-2">
            <button onClick={handleAddDebt}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">{ar.save}</button>
            <button onClick={() => setShowDebtForm(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm">{ar.cancel}</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">{ar.loading}</div>
      ) : debts?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{ar.noData}</div>
      ) : (
        <div className="space-y-3">
          {debts?.map((debt) => (
            <div key={debt.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{debt.amount.toLocaleString('ar-DZ')} {ar.currency}</div>
                  <div className="text-sm text-gray-500">
                    {ar.remaining}: {debt.remaining.toLocaleString('ar-DZ')} {ar.currency}
                    {' | '}
                    {ar.status}: {debt.status === 'active' ? ar.active : ar.paid}
                  </div>
                  {debt.description && <div className="text-sm text-gray-400">{debt.description}</div>}
                </div>
                <div className="flex gap-2">
                  {debt.status === 'active' && (
                    <button onClick={() => setShowPaymentFor(debt.id)}
                      className="text-green-600 text-sm hover:underline">{ar.addPayment}</button>
                  )}
                  <button onClick={() => setExpandedDebt(expandedDebt === debt.id ? null : debt.id)}
                    className="text-gray-600 text-sm hover:underline">{ar.payments}</button>
                </div>
              </div>

              {showPaymentFor === debt.id && (
                <div className="border-t mt-3 pt-3">
                  <input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)}
                    placeholder={`${ar.amount} (${ar.currency})`}
                    className="w-full border rounded px-3 py-2 text-sm mb-2" />
                  <input type="text" value={payNote} onChange={(e) => setPayNote(e.target.value)}
                    placeholder={ar.notes}
                    className="w-full border rounded px-3 py-2 text-sm mb-2" />
                  <div className="flex gap-2">
                    <button onClick={() => handleAddPayment(debt.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">{ar.save}</button>
                    <button onClick={() => setShowPaymentFor(null)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm">{ar.cancel}</button>
                  </div>
                </div>
              )}

              {expandedDebt === debt.id && (
                <div className="border-t mt-3 pt-3">
                  <h4 className="text-sm font-semibold mb-2">{ar.payments}</h4>
                  {payments?.length === 0 ? (
                    <div className="text-sm text-gray-400">{ar.noData}</div>
                  ) : (
                    payments?.map((p) => (
                      <div key={p.id} className="text-sm text-gray-600 flex justify-between py-1">
                        <span>{p.amount.toLocaleString('ar-DZ')} {ar.currency}</span>
                        <span className="text-gray-400">{p.note}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
