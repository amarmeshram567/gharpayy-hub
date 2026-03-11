import { useInventoryData, useOwners, useCreateProperty } from '@/hooks/useInventoryData';
import { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';

export default function Inventory() {
  const { data: properties, isLoading } = useInventoryData();
  const { data: owners } = useOwners();
  const createProperty = useCreateProperty();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', city: '', area: '', address: '', owner_id: '', gender_allowed: 'any' as const, total_rooms: 0, total_beds: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProperty.mutateAsync({ ...form, owner_id: form.owner_id || null });
    setShowForm(false);
    setForm({ name: '', city: '', area: '', address: '', owner_id: '', gender_allowed: 'any', total_rooms: 0, total_beds: 0 });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div><h1 className="text-xl font-semibold">Inventory</h1><p className="text-sm text-muted-foreground">{properties?.length || 0} properties</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"><Plus size={14} /> Add Property</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="surface-paper rounded-lg p-4 mb-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <input required placeholder="Property Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-3 py-1.5 rounded border border-input bg-background text-sm" />
          <input required placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="px-3 py-1.5 rounded border border-input bg-background text-sm" />
          <input required placeholder="Area" value={form.area} onChange={e => setForm({...form, area: e.target.value})} className="px-3 py-1.5 rounded border border-input bg-background text-sm" />
          <input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="px-3 py-1.5 rounded border border-input bg-background text-sm" />
          <select value={form.owner_id} onChange={e => setForm({...form, owner_id: e.target.value})} className="px-3 py-1.5 rounded border border-input bg-background text-sm">
            <option value="">Select Owner</option>
            {(owners || []).map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <select value={form.gender_allowed} onChange={e => setForm({...form, gender_allowed: e.target.value as any})} className="px-3 py-1.5 rounded border border-input bg-background text-sm">
            <option value="any">Any Gender</option><option value="male">Male</option><option value="female">Female</option>
          </select>
          <input type="number" placeholder="Total Rooms" value={form.total_rooms || ''} onChange={e => setForm({...form, total_rooms: Number(e.target.value)})} className="px-3 py-1.5 rounded border border-input bg-background text-sm" />
          <button type="submit" disabled={createProperty.isPending} className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium">{createProperty.isPending ? 'Saving...' : 'Add Property'}</button>
        </form>
      )}
      <div className="surface-paper rounded-lg overflow-hidden">
        {isLoading ? <div className="p-6 text-sm text-muted-foreground">Loading...</div> : !properties?.length ? (
          <div className="p-6 text-sm text-muted-foreground">No properties yet. <strong className="text-primary cursor-pointer" onClick={() => setShowForm(true)}>+ Add Property</strong></div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Property</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Location</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Owner</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Gender</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Rooms</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Beds</th>
            </tr></thead>
            <tbody>{properties.map(p => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-2.5 font-medium">{p.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{p.area}, {p.city}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{(p as any).owners?.name || '—'}</td>
                <td className="px-4 py-2.5 capitalize text-muted-foreground">{p.gender_allowed}</td>
                <td className="px-4 py-2.5">{p.rooms?.length || p.total_rooms}</td>
                <td className="px-4 py-2.5">{p.rooms?.reduce((sum: number, r: any) => sum + (r.beds?.length || 0), 0) || p.total_beds}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
