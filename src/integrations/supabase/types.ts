export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          performed_by: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          performed_by?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          performed_by?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          role: string
          updated_at: string
          user_id: string | null
          zone_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string | null
          zone_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      beds: {
        Row: {
          bed_number: string
          created_at: string
          current_tenant_name: string | null
          id: string
          move_in_date: string | null
          move_out_date: string | null
          rent: number | null
          room_id: string
          status: Database["public"]["Enums"]["bed_status"]
          updated_at: string
        }
        Insert: {
          bed_number: string
          created_at?: string
          current_tenant_name?: string | null
          id?: string
          move_in_date?: string | null
          move_out_date?: string | null
          rent?: number | null
          room_id: string
          status?: Database["public"]["Enums"]["bed_status"]
          updated_at?: string
        }
        Update: {
          bed_number?: string
          created_at?: string
          current_tenant_name?: string | null
          id?: string
          move_in_date?: string | null
          move_out_date?: string | null
          rent?: number | null
          room_id?: string
          status?: Database["public"]["Enums"]["bed_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "beds_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          bed_id: string | null
          check_in_date: string | null
          check_out_date: string | null
          created_at: string
          deposit: number | null
          id: string
          lead_id: string | null
          monthly_rent: number | null
          notes: string | null
          property_id: string
          room_id: string | null
          status: Database["public"]["Enums"]["booking_status"]
          tenant_name: string | null
          tenant_phone: string | null
          updated_at: string
        }
        Insert: {
          bed_id?: string | null
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string
          deposit?: number | null
          id?: string
          lead_id?: string | null
          monthly_rent?: number | null
          notes?: string | null
          property_id: string
          room_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          tenant_name?: string | null
          tenant_phone?: string | null
          updated_at?: string
        }
        Update: {
          bed_id?: string | null
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string
          deposit?: number | null
          id?: string
          lead_id?: string | null
          monthly_rent?: number | null
          notes?: string | null
          property_id?: string
          room_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          tenant_name?: string | null
          tenant_phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          agent_id: string | null
          channel: string | null
          created_at: string
          direction: string
          id: string
          lead_id: string
          message: string
        }
        Insert: {
          agent_id?: string | null
          channel?: string | null
          created_at?: string
          direction?: string
          id?: string
          lead_id: string
          message: string
        }
        Update: {
          agent_id?: string | null
          channel?: string | null
          created_at?: string
          direction?: string
          id?: string
          lead_id?: string
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_reminders: {
        Row: {
          agent_id: string | null
          created_at: string
          id: string
          is_completed: boolean
          lead_id: string
          note: string | null
          reminder_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          lead_id: string
          note?: string | null
          reminder_at: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          lead_id?: string
          note?: string | null
          reminder_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_reminders_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_reminders_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      landmarks: {
        Row: {
          area: string | null
          city: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          type: string
        }
        Insert: {
          area?: string | null
          city: string
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          name: string
          type: string
        }
        Update: {
          area?: string | null
          city?: string
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          type?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_agent_id: string | null
          budget_max: number | null
          budget_min: number | null
          company: string | null
          created_at: string
          email: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          last_activity_at: string | null
          lead_score: number | null
          name: string
          notes: string | null
          phone: string | null
          preferred_area: string | null
          preferred_city: string | null
          property_id: string | null
          requirement: string | null
          sharing_type: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          assigned_agent_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          company?: string | null
          created_at?: string
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          last_activity_at?: string | null
          lead_score?: number | null
          name: string
          notes?: string | null
          phone?: string | null
          preferred_area?: string | null
          preferred_city?: string | null
          property_id?: string | null
          requirement?: string | null
          sharing_type?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          assigned_agent_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          company?: string | null
          created_at?: string
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          last_activity_at?: string | null
          lead_score?: number | null
          name?: string
          notes?: string | null
          phone?: string | null
          preferred_area?: string | null
          preferred_city?: string | null
          property_id?: string | null
          requirement?: string | null
          sharing_type?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      owners: {
        Row: {
          city: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          amenities: string[] | null
          area: string
          city: string
          created_at: string
          description: string | null
          gender_allowed: Database["public"]["Enums"]["gender_type"]
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          name: string
          owner_id: string | null
          photos: string[] | null
          total_beds: number
          total_rooms: number
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          area: string
          city: string
          created_at?: string
          description?: string | null
          gender_allowed?: Database["public"]["Enums"]["gender_type"]
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          owner_id?: string | null
          photos?: string[] | null
          total_beds?: number
          total_rooms?: number
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          area?: string
          city?: string
          created_at?: string
          description?: string | null
          gender_allowed?: Database["public"]["Enums"]["gender_type"]
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner_id?: string | null
          photos?: string[] | null
          total_beds?: number
          total_rooms?: number
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          amount: number | null
          bed_id: string
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          bed_id: string
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          bed_id?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
        ]
      }
      room_status_log: {
        Row: {
          confirmed_by: string | null
          created_at: string
          id: string
          new_status: Database["public"]["Enums"]["room_status"]
          notes: string | null
          previous_status: Database["public"]["Enums"]["room_status"] | null
          room_id: string
        }
        Insert: {
          confirmed_by?: string | null
          created_at?: string
          id?: string
          new_status: Database["public"]["Enums"]["room_status"]
          notes?: string | null
          previous_status?: Database["public"]["Enums"]["room_status"] | null
          room_id: string
        }
        Update: {
          confirmed_by?: string | null
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["room_status"]
          notes?: string | null
          previous_status?: Database["public"]["Enums"]["room_status"] | null
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_status_log_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          bed_count: number
          created_at: string
          floor: number | null
          id: string
          last_confirmed_at: string | null
          property_id: string
          rent_per_bed: number | null
          room_number: string
          room_type: string
          status: Database["public"]["Enums"]["room_status"]
          updated_at: string
        }
        Insert: {
          bed_count?: number
          created_at?: string
          floor?: number | null
          id?: string
          last_confirmed_at?: string | null
          property_id: string
          rent_per_bed?: number | null
          room_number: string
          room_type?: string
          status?: Database["public"]["Enums"]["room_status"]
          updated_at?: string
        }
        Update: {
          bed_count?: number
          created_at?: string
          floor?: number | null
          id?: string
          last_confirmed_at?: string | null
          property_id?: string
          rent_per_bed?: number | null
          room_number?: string
          room_type?: string
          status?: Database["public"]["Enums"]["room_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      soft_locks: {
        Row: {
          bed_id: string
          created_at: string
          expires_at: string
          id: string
          is_active: boolean
          locked_by: string | null
          reason: string
        }
        Insert: {
          bed_id: string
          created_at?: string
          expires_at: string
          id?: string
          is_active?: boolean
          locked_by?: string | null
          reason?: string
        }
        Update: {
          bed_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          locked_by?: string | null
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "soft_locks_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
        ]
      }
      team_queues: {
        Row: {
          agent_id: string
          id: string
          is_active: boolean
          priority: number
          zone_id: string
        }
        Insert: {
          agent_id: string
          id?: string
          is_active?: boolean
          priority?: number
          zone_id: string
        }
        Update: {
          agent_id?: string
          id?: string
          is_active?: boolean
          priority?: number
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_queues_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_queues_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          agent_id: string | null
          created_at: string
          id: string
          lead_id: string
          notes: string | null
          outcome: Database["public"]["Enums"]["visit_outcome"] | null
          property_id: string
          scheduled_at: string
          status: Database["public"]["Enums"]["visit_status"]
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          id?: string
          lead_id: string
          notes?: string | null
          outcome?: Database["public"]["Enums"]["visit_outcome"] | null
          property_id: string
          scheduled_at: string
          status?: Database["public"]["Enums"]["visit_status"]
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          notes?: string | null
          outcome?: Database["public"]["Enums"]["visit_outcome"] | null
          property_id?: string
          scheduled_at?: string
          status?: Database["public"]["Enums"]["visit_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      zones: {
        Row: {
          areas: string[]
          city: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          areas?: string[]
          city: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          areas?: string[]
          city?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_lead_score: { Args: { p_lead_id: string }; Returns: number }
      get_property_effort: { Args: { prop_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      route_lead_to_zone: { Args: { p_lead_id: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "manager" | "agent" | "owner"
      bed_status: "vacant" | "occupied" | "reserved" | "booked" | "blocked"
      booking_status:
        | "pending"
        | "confirmed"
        | "checked_in"
        | "checked_out"
        | "cancelled"
      gender_type: "male" | "female" | "any"
      lead_source:
        | "whatsapp"
        | "website"
        | "instagram"
        | "facebook"
        | "phone"
        | "landing_page"
        | "referral"
        | "walkin"
      lead_status:
        | "new"
        | "contacted"
        | "requirement_collected"
        | "property_suggested"
        | "visit_scheduled"
        | "visit_completed"
        | "booked"
        | "lost"
      room_status: "vacant" | "occupied" | "blocked" | "maintenance"
      visit_outcome: "booked" | "considering" | "not_interested" | "follow_up"
      visit_status: "scheduled" | "completed" | "cancelled" | "no_show"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "agent", "owner"],
      bed_status: ["vacant", "occupied", "reserved", "booked", "blocked"],
      booking_status: [
        "pending",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
      ],
      gender_type: ["male", "female", "any"],
      lead_source: [
        "whatsapp",
        "website",
        "instagram",
        "facebook",
        "phone",
        "landing_page",
        "referral",
        "walkin",
      ],
      lead_status: [
        "new",
        "contacted",
        "requirement_collected",
        "property_suggested",
        "visit_scheduled",
        "visit_completed",
        "booked",
        "lost",
      ],
      room_status: ["vacant", "occupied", "blocked", "maintenance"],
      visit_outcome: ["booked", "considering", "not_interested", "follow_up"],
      visit_status: ["scheduled", "completed", "cancelled", "no_show"],
    },
  },
} as const
