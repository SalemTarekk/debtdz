import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCustomer, useUpdateCustomer, useCustomer } from '../hooks/useCustomers';
import { ar } from '../lib/arabic';

const schema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  editId: number | null;
  onDone: () => void;
}

export default function CustomerForm({ editId, onDone }: Props) {
  const create = useCreateCustomer();
  const update = useUpdateCustomer();
  const { data: customer } = useCustomer(editId ?? 0);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (customer) {
      reset({ name: customer.name, phone: customer.phone, address: customer.address, notes: customer.notes });
    }
  }, [customer, reset]);

  const onSubmit = async (data: FormData) => {
    if (editId) {
      await update.mutateAsync({ id: editId, ...data });
    } else {
      await create.mutateAsync(data);
    }
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-bold mb-4">{editId ? ar.editCustomer : ar.addCustomer}</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">{ar.name}</label>
          <input {...register('name')} className="w-full border rounded px-3 py-2 text-sm" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">{ar.phone}</label>
          <input {...register('phone')} className="w-full border rounded px-3 py-2 text-sm" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">{ar.address}</label>
          <input {...register('address')} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm mb-1">{ar.notes}</label>
          <textarea {...register('notes')} className="w-full border rounded px-3 py-2 text-sm" rows={3} />
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <button type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">{ar.save}</button>
        <button type="button" onClick={onDone}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">{ar.cancel}</button>
      </div>
    </form>
  );
}
