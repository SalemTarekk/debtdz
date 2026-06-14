import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

interface Debt {
  id: number;
  customer_id: number;
  amount: number;
  paid_amount: number;
  remaining: number;
  description: string;
  status: string;
}

interface Payment {
  id: number;
  debt_id: number;
  amount: number;
  note: string;
}

export function useCustomerDebts(customerId: number) {
  return useQuery<Debt[]>({
    queryKey: ['debts', customerId],
    queryFn: () => api.get(`/debts/by-customer/${customerId}`).then((r) => r.data),
    enabled: !!customerId,
  });
}

export function useDebt(id: number) {
  return useQuery<Debt>({
    queryKey: ['debt', id],
    queryFn: () => api.get(`/debts/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { customer_id: number; amount: number; description?: string }) =>
      api.post('/debts', data),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['debts', vars.customer_id] }),
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { debt_id: number; customer_id: number; amount: number; note?: string }) =>
      api.post('/payments', data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['debt', vars.debt_id] });
      qc.invalidateQueries({ queryKey: ['debts', vars.customer_id] });
    },
  });
}

export function useDebtPayments(debtId: number) {
  return useQuery<Payment[]>({
    queryKey: ['payments', debtId],
    queryFn: () => api.get(`/payments/by-debt/${debtId}`).then((r) => r.data),
    enabled: !!debtId,
  });
}

export function useDashboard() {
  return useQuery<{
    total_debts: number;
    total_paid: number;
    outstanding: number;
    active_customers: number;
    active_debts: number;
  }>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard/summary').then((r) => r.data),
  });
}
