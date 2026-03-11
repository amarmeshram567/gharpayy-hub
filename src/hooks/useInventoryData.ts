import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useProperties(filters?: { city?: string; area?: string; gender?: string; budgetMax?: number }) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*, owners(name), rooms(*, beds(*))')
        .eq('is_active', true);
      
      if (filters?.city) query = query.eq('city', filters.city);
      if (filters?.area) query = query.eq('area', filters.area);
      if (filters?.gender) query = query.eq('gender_allowed', filters.gender as any);
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, owners(name, phone), rooms(*, beds(*))') 
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useOwners() {
  return useQuery({
    queryKey: ['owners'],
    queryFn: async () => {
      const { data, error } = await supabase.from('owners').select('*').eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });
}

export function useZones() {
  return useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      const { data, error } = await supabase.from('zones').select('*, agents(name, id)').eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });
}

export function useInventoryData() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, rooms(*, beds(*)), owners(name)')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (prop: any) => {
      const { data, error } = await supabase.from('properties').insert(prop).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  });
}

export function useCreateOwner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (owner: any) => {
      const { data, error } = await supabase.from('owners').insert(owner).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['owners'] }),
  });
}
