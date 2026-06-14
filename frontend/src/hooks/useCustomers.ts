import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  notes: string;
  total_debt?: number;
  total_paid?: number;
  remaining?: number;
}

export function useCustomers() {
  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: () => api.get('/customers').then((r) => r.data),
  });
}

export function useCustomer(id: number) {
  return useQuery<Customer>({
    queryKey: ['customer', id],
    queryFn: () => api.get(`/customers/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; phone: string; address?: string; notes?: string }) =>
      api.post('/customers', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; name?: string; phone?: string; address?: string; notes?: string }) =>
      api.put(`/customers/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/customers/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
}
