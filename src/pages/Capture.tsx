import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PublicLayout from '@/components/layout/PublicLayout';

export default function Capture() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', preferred_area: '', preferred_city: '', budget_max: '', sharing_type: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.from('leads').insert({
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      preferred_area: form.preferred_area || null,
      preferred_city: form.preferred_city || null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      sharing_type: form.sharing_type || null,
      notes: form.notes || null,
      source: 'website' as const,
    });
    if (error) setError('Something went wrong. Please try again.');
    else setSubmitted(true);
  };

  if (submitted) {
    return (
      <PublicLayout>
        <div className="container py-20 text-center max-w-md mx-auto">
          <h1 className="text-2xl font-semibold mb-2">Thank You!</h1>
          <p className="text-muted-foreground font-serif">We've received your inquiry. Our team will contact you within 24 hours.</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container py-12 max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-1">Find Your PG</h1>
        <p className="text-sm text-muted-foreground mb-6 font-serif">Tell us what you're looking for and we'll match you with the best options.</p>
        <form onSubmit={handleSubmit} className="surface-paper rounded-lg p-6 space-y-4">
          <div><label className="text-xs font-medium mb-1 block">Name *</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded border border-input bg-background text-sm" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium mb-1 block">Phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 rounded border border-input bg-background text-sm" /></div>
            <div><label className="text-xs font-medium mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 rounded border border-input bg-background text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium mb-1 block">Preferred City</label>
              <input value={form.preferred_city} onChange={e => setForm({...form, preferred_city: e.target.value})} placeholder="e.g. Bangalore" className="w-full px-3 py-2 rounded border border-input bg-background text-sm" /></div>
            <div><label className="text-xs font-medium mb-1 block">Preferred Area</label>
              <input value={form.preferred_area} onChange={e => setForm({...form, preferred_area: e.target.value})} placeholder="e.g. HSR Layout" className="w-full px-3 py-2 rounded border border-input bg-background text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium mb-1 block">Budget (monthly max)</label>
              <input type="number" value={form.budget_max} onChange={e => setForm({...form, budget_max: e.target.value})} placeholder="₹" className="w-full px-3 py-2 rounded border border-input bg-background text-sm" /></div>
            <div><label className="text-xs font-medium mb-1 block">Sharing Type</label>
              <select value={form.sharing_type} onChange={e => setForm({...form, sharing_type: e.target.value})} className="w-full px-3 py-2 rounded border border-input bg-background text-sm">
                <option value="">Any</option><option value="single">Single</option><option value="double">Double</option><option value="triple">Triple</option><option value="1bhk">1BHK</option>
              </select></div>
          </div>
          <div><label className="text-xs font-medium mb-1 block">Additional Notes</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full px-3 py-2 rounded border border-input bg-background text-sm h-20 resize-none" /></div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button type="submit" className="w-full py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Submit Inquiry</button>
        </form>
      </div>
    </PublicLayout>
  );
}
