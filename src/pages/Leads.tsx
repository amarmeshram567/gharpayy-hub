import { useState } from 'react';
import { useLeads, useCreateLead, useUpdateLead, useAgents } from '@/hooks/useCrmData';
import { Plus, Search, Phone, Mail, Building2 } from 'lucide-react';

// Quick Add Lead parser — the "signature moment"
function parseLeadText(text: string) {
  const parsed: Record<string, string> = {};
  
  // Phone: 10-digit number
  const phoneMatch = text.match(/\b(\d{10})\b/);
  if (phoneMatch) parsed.phone = phoneMatch[1];
  
  // Budget: number with k/K
  const budgetMatch = text.match(/(\d+)\s*k\b/i);
  if (budgetMatch) parsed.budget_max = String(parseInt(budgetMatch[1]) * 1000);
  
  // Sharing type: 1bhk, 2bhk, single, double, triple
  const sharingMatch = text.match(/\b(1bhk|2bhk|3bhk|single|double|triple|sharing)\b/i);
  if (sharingMatch) parsed.sharing_type = sharingMatch[1].toLowerCase();
  
  // Common Bangalore areas
  const areas = ['HSR Layout', 'Koramangala', 'Whitefield', 'BTM Layout', 'Indiranagar', 'Marathahalli', 'Electronic City', 'JP Nagar', 'Jayanagar', 'Hebbal', 'Yelahanka', 'Bellandur', 'Sarjapur'];
  for (const area of areas) {
    if (text.toLowerCase().includes(area.toLowerCase())) {
      parsed.preferred_area = area;
      break;
    }
  }
  
  // Extract name: first capitalized word(s) that aren't an area or known keyword
  const words = text.split(/\s+/);
  const keywords = ['from', 'needs', 'need', 'near', 'under', 'in', 'at', 'contact', 'phone', 'budget', ...areas.map(a => a.toLowerCase())];
  const nameWords: string[] = [];
  for (const w of words) {
    const clean = w.replace(/[^a-zA-Z]/g, '');
    if (clean && /^[A-Z]/.test(clean) && !keywords.includes(clean.toLowerCase()) && !parsed.phone?.includes(w)) {
      nameWords.push(clean);
    }
    if (nameWords.length > 0 && (keywords.includes(w.toLowerCase()) || /^\d/.test(w))) break;
  }
  if (nameWords.length > 0) parsed.name = nameWords.join(' ');
  
  // Company: word after "from"
  const fromMatch = text.match(/from\s+(\w+)/i);
  if (fromMatch && !areas.some(a => a.toLowerCase().startsWith(fromMatch[1].toLowerCase()))) {
    parsed.company = fromMatch[1];
  }
  
  return parsed;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  requirement_collected: 'bg-purple-100 text-purple-800',
  property_suggested: 'bg-indigo-100 text-indigo-800',
  visit_scheduled: 'bg-cyan-100 text-cyan-800',
  visit_completed: 'bg-teal-100 text-teal-800',
  booked: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
};

export default function Leads() {
  const { data: leads, isLoading } = useLeads();
  const { data: agents } = useAgents();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const [quickText, setQuickText] = useState('');
  const [parsedTokens, setParsedTokens] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleQuickTextChange = (text: string) => {
    setQuickText(text);
    if (text.length > 3) {
      setParsedTokens(parseLeadText(text));
    } else {
      setParsedTokens({});
    }
  };

  const handleQuickAdd = async () => {
    if (!parsedTokens.name && !quickText.trim()) return;
    
    await createLead.mutateAsync({
      name: parsedTokens.name || quickText.trim().split(' ')[0] || 'Unknown',
      phone: parsedTokens.phone || null,
      company: parsedTokens.company || null,
      sharing_type: parsedTokens.sharing_type || null,
      preferred_area: parsedTokens.preferred_area || null,
      budget_max: parsedTokens.budget_max ? Number(parsedTokens.budget_max) : null,
      source: 'phone' as const,
    });
    
    setQuickText('');
    setParsedTokens({});
  };

  const filteredLeads = (leads || []).filter(lead => {
    const matchesSearch = !searchQuery || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['all', 'new', 'contacted', 'requirement_collected', 'property_suggested', 'visit_scheduled', 'visit_completed', 'booked', 'lost'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Leads</h1>
          <p className="text-sm text-muted-foreground">{leads?.length || 0} total leads</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
        >
          <Plus size={14} /> Add Lead
        </button>
      </div>

      {/* Quick Add — Signature Moment */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={quickText}
            onChange={e => handleQuickTextChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleQuickAdd()}
            placeholder='Paste lead info: "Ankit from Deloitte needs 1bhk near HSR Layout under 20k, contact 9876543210"'
            className="workbench-input rounded-lg"
          />
          {Object.keys(parsedTokens).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {parsedTokens.name && <span className="lozenge lozenge-name animate-lozenge-pop">{parsedTokens.name}</span>}
              {parsedTokens.company && <span className="lozenge lozenge-company animate-lozenge-pop">{parsedTokens.company}</span>}
              {parsedTokens.sharing_type && <span className="lozenge lozenge-requirement animate-lozenge-pop">{parsedTokens.sharing_type}</span>}
              {parsedTokens.preferred_area && <span className="lozenge lozenge-location animate-lozenge-pop">{parsedTokens.preferred_area}</span>}
              {parsedTokens.budget_max && <span className="lozenge lozenge-budget animate-lozenge-pop">₹{Number(parsedTokens.budget_max).toLocaleString()}</span>}
              {parsedTokens.phone && <span className="lozenge lozenge-phone animate-lozenge-pop">{parsedTokens.phone}</span>}
              <button
                onClick={handleQuickAdd}
                disabled={createLead.isPending}
                className="lozenge bg-primary text-primary-foreground cursor-pointer hover:opacity-90"
              >
                {createLead.isPending ? 'Adding...' : '↵ Add Lead'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-8 pr-3 py-1.5 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded border border-input bg-background text-sm focus:outline-none"
        >
          {statuses.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Status' : s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Leads Table */}
      <div className="surface-paper rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            You have no leads. <strong className="text-primary cursor-pointer">+ Add Lead</strong>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Contact</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Source</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Score</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Agent</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Area</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Budget</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-accent/50 cursor-pointer transition-colors">
                    <td className="px-4 py-2.5 font-medium">
                      {lead.name}
                      {lead.company && <span className="text-xs text-muted-foreground ml-1">({lead.company})</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {lead.phone && <span className="flex items-center gap-1"><Phone size={12} />{lead.phone}</span>}
                        {lead.email && <span className="flex items-center gap-1"><Mail size={12} />{lead.email}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 capitalize text-muted-foreground">{lead.source.replace('_', ' ')}</td>
                    <td className="px-4 py-2.5">
                      <select
                        value={lead.status}
                        onChange={e => updateLead.mutate({ id: lead.id, status: e.target.value as any })}
                        className={`text-xs px-2 py-0.5 rounded font-medium border-0 ${STATUS_COLORS[lead.status] || 'bg-muted'}`}
                      >
                        {statuses.filter(s => s !== 'all').map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${lead.lead_score || 0}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{lead.lead_score || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">
                      {(lead as any).agents?.name || '—'}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{lead.preferred_area || '—'}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">
                      {lead.budget_max ? `₹${Number(lead.budget_max).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Lead Form Dialog */}
      {showAddForm && (
        <AddLeadDialog agents={agents || []} onClose={() => setShowAddForm(false)} onCreate={createLead.mutateAsync} />
      )}
    </div>
  );
}

function AddLeadDialog({ agents, onClose, onCreate }: { agents: any[]; onClose: () => void; onCreate: (lead: any) => Promise<any> }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', source: 'phone' as const,
    preferred_area: '', preferred_city: 'Bangalore', budget_max: '',
    sharing_type: '', company: '', notes: '', assigned_agent_id: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onCreate({
        ...form,
        budget_max: form.budget_max ? Number(form.budget_max) : null,
        assigned_agent_id: form.assigned_agent_id || null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div className="surface-paper rounded-lg w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Add New Lead</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-1.5 rounded border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-1.5 rounded border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-1.5 rounded border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Source</label>
              <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value as any })}
                className="w-full px-3 py-1.5 rounded border border-input bg-background text-sm">
                {['phone', 'whatsapp', 'website', 'instagram', 'facebook', 'landing_page', 'referral', 'walkin'].map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Area</label>
              <input value={form.preferred_area} onChange={e => setForm({ ...form, preferred_area: e.target.value })}
                className="w-full px-3 py-1.5 rounded border border-input bg-background text-sm" placeholder="e.g. HSR Layout" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Budget (max)</label>
              <input type="number" value={form.budget_max} onChange={e => setForm({ ...form, budget_max: e.target.value })}
                className="w-full px-3 py-1.5 rounded border border-input bg-background text-sm" placeholder="e.g. 15000" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Company</label>
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                className="w-full px-3 py-1.5 rounded border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Assign Agent</label>
              <select value={form.assigned_agent_id} onChange={e => setForm({ ...form, assigned_agent_id: e.target.value })}
                className="w-full px-3 py-1.5 rounded border border-input bg-background text-sm">
                <option value="">Unassigned</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-1.5 rounded border border-input bg-background text-sm h-20 resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded border border-border text-sm hover:bg-accent">Cancel</button>
            <button type="submit" disabled={saving} className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {saving ? 'Saving...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
