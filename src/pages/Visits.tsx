import { useVisits, useCreateVisit, useLeads, useAgents } from '@/hooks/useCrmData';
import { useProperties } from '@/hooks/useInventoryData';
import { useState } from 'react';
import { Plus, CalendarCheck, Clock, CheckCircle, XCircle } from 'lucide-react';

const STATUS_ICONS: Record<string, any> = {
  scheduled: Clock,
  completed: CheckCircle,
  cancelled: XCircle,
  no_show: XCircle,
};

export default function Visits() {
  const { data: visits, isLoading } = useVisits();
  const { data: leads } = useLeads();
  const { data: agents } = useAgents();
  const { data: properties } = useProperties();
  const createVisit = useCreateVisit();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ lead_id: '', property_id: '', agent_id: '', scheduled_at: '', notes: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVisit.mutateAsync({
      ...form,
      agent_id: form.agent_id || null,
    });
    setShowForm(false);
    setForm({ lead_id: '', property_id: '', agent_id: '', scheduled_at: '', notes: '' });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Visits</h1>
          <p className="text-sm text-muted-foreground">{visits?.length || 0} total visits</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus size={14} /> Schedule Visit
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="surface-paper rounded-lg p-4 mb-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
          <select required value={form.lead_id} onChange={e => setForm({ ...form, lead_id: e.target.value })}
            className="px-3 py-1.5 rounded border border-input bg-background text-sm">
            <option value="">Select Lead</option>
            {(leads || []).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <select required value={form.property_id} onChange={e => setForm({ ...form, property_id: e.target.value })}
            className="px-3 py-1.5 rounded border border-input bg-background text-sm">
            <option value="">Select Property</option>
            {(properties || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={form.agent_id} onChange={e => setForm({ ...form, agent_id: e.target.value })}
            className="px-3 py-1.5 rounded border border-input bg-background text-sm">
            <option value="">Assign Agent</option>
            {(agents || []).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <input required type="datetime-local" value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
            className="px-3 py-1.5 rounded border border-input bg-background text-sm" />
          <button type="submit" disabled={createVisit.isPending}
            className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
            {createVisit.isPending ? 'Scheduling...' : 'Schedule'}
          </button>
        </form>
      )}

      <div className="surface-paper rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading visits...</div>
        ) : !visits?.length ? (
          <div className="p-6 text-sm text-muted-foreground">No visits scheduled. <strong className="text-primary cursor-pointer" onClick={() => setShowForm(true)}>+ Schedule Visit</strong></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Lead</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Property</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Agent</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Scheduled</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {visits.map(v => {
                const Icon = STATUS_ICONS[v.status] || Clock;
                return (
                  <tr key={v.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                    <td className="px-4 py-2.5 font-medium">{(v as any).leads?.name || '—'}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{(v as any).properties?.name || '—'}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{(v as any).agents?.name || '—'}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{new Date(v.scheduled_at).toLocaleString()}</td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-1 text-xs capitalize">
                        <Icon size={12} /> {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs capitalize text-muted-foreground">{v.outcome || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
