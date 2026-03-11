import { useOwners, useCreateOwner } from '@/hooks/useInventoryData';
import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function Owners() {
  const { data: owners, isLoading } = useOwners();
  const createOwner = useCreateOwner();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOwner.mutateAsync(form);
    setShowForm(false);
    setForm({ name: '', phone: '', email: '', city: '' });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div><h1 className="text-xl font-semibold">Owners</h1><p className="text-sm text-muted-foreground">{owners?.length || 0} property owners</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"><Plus size={14} /> Add Owner</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="surface-paper rounded-lg p-4 mb-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
          <input required placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-3 py-1.5 rounded border border-input bg-background text-sm" />
          <input required placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="px-3 py-1.5 rounded border border-input bg-background text-sm" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="px-3 py-1.5 rounded border border-input bg-background text-sm" />
          <input placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="px-3 py-1.5 rounded border border-input bg-background text-sm" />
          <button type="submit" disabled={createOwner.isPending} className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium">{createOwner.isPending ? 'Saving...' : 'Add Owner'}</button>
        </form>
      )}
      <div className="surface-paper rounded-lg overflow-hidden">
        {isLoading ? <div className="p-6 text-sm text-muted-foreground">Loading...</div> : !owners?.length ? (
          <div className="p-6 text-sm text-muted-foreground">No owners yet. <strong className="text-primary cursor-pointer" onClick={() => setShowForm(true)}>+ Add Owner</strong></div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Phone</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">City</th>
            </tr></thead>
            <tbody>{owners.map(o => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-2.5 font-medium">{o.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{o.phone}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{o.email || '—'}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{o.city || '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
