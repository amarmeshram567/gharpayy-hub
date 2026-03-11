import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Lead = Database['public']['Tables']['leads']['Row'];
type LeadInsert = Database['public']['Tables']['leads']['Insert'];
type LeadUpdate = Database['public']['Tables']['leads']['Update'];
type Visit = Database['public']['Tables']['visits']['Row'];
type VisitInsert = Database['public']['Tables']['visits']['Insert'];
type Booking = Database['public']['Tables']['bookings']['Row'];
type Agent = Database['public']['Tables']['agents']['Row'];

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*, agents(name), properties(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lead: LeadInsert) => {
      const { data, error } = await supabase.from('leads').insert(lead).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: LeadUpdate & { id: string }) => {
      const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useVisits() {
  return useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visits')
        .select('*, leads(name, phone), properties(name), agents(name)')
        .order('scheduled_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (visit: VisitInsert) => {
      const { data, error } = await supabase.from('visits').insert(visit).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['visits'] }),
  });
}

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, leads(name), properties(name), rooms(room_number), beds(bed_number)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data, error } = await supabase.from('agents').select('*, zones(name)').eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [leads, visits, bookings] = await Promise.all([
        supabase.from('leads').select('id, status, source, created_at'),
        supabase.from('visits').select('id, status, scheduled_at'),
        supabase.from('bookings').select('id, status, created_at'),
      ]);
      
      const leadsData = leads.data || [];
      const visitsData = visits.data || [];
      const bookingsData = bookings.data || [];
      
      const today = new Date().toISOString().split('T')[0];
      
      return {
        totalLeads: leadsData.length,
        newLeads: leadsData.filter(l => l.status === 'new').length,
        todayLeads: leadsData.filter(l => l.created_at.startsWith(today)).length,
        activeLeads: leadsData.filter(l => !['booked', 'lost'].includes(l.status)).length,
        totalVisits: visitsData.length,
        scheduledVisits: visitsData.filter(v => v.status === 'scheduled').length,
        todayVisits: visitsData.filter(v => v.scheduled_at.startsWith(today)).length,
        totalBookings: bookingsData.length,
        confirmedBookings: bookingsData.filter(b => b.status === 'confirmed').length,
        conversionRate: leadsData.length > 0 
          ? Math.round((bookingsData.length / leadsData.length) * 100) 
          : 0,
        leadsBySource: leadsData.reduce((acc, l) => {
          acc[l.source] = (acc[l.source] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        leadsByStatus: leadsData.reduce((acc, l) => {
          acc[l.status] = (acc[l.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
    },
  });
}

export function useConversations(leadId?: string) {
  return useQuery({
    queryKey: ['conversations', leadId],
    queryFn: async () => {
      let query = supabase.from('conversations').select('*, leads(name), agents(name)');
      if (leadId) query = query.eq('lead_id', leadId);
      const { data, error } = await query.order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: leadId !== undefined || true,
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (msg: Database['public']['Tables']['conversations']['Insert']) => {
      const { data, error } = await supabase.from('conversations').insert(msg).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['conversations'] }),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });
}
