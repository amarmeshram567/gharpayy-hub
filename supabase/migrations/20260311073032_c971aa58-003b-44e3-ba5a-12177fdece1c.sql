
-- GHARPAYY CORE DATABASE SCHEMA

-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'agent', 'owner');
CREATE TYPE public.lead_source AS ENUM ('whatsapp', 'website', 'instagram', 'facebook', 'phone', 'landing_page', 'referral', 'walkin');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'requirement_collected', 'property_suggested', 'visit_scheduled', 'visit_completed', 'booked', 'lost');
CREATE TYPE public.bed_status AS ENUM ('vacant', 'occupied', 'reserved', 'booked', 'blocked');
CREATE TYPE public.room_status AS ENUM ('vacant', 'occupied', 'blocked', 'maintenance');
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'any');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled');
CREATE TYPE public.visit_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE public.visit_outcome AS ENUM ('booked', 'considering', 'not_interested', 'follow_up');

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1. PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. USER ROLES
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 3. ZONES
CREATE TABLE public.zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  areas text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view zones" ON public.zones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage zones" ON public.zones FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON public.zones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. AGENTS
CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  phone text,
  role text NOT NULL DEFAULT 'agent',
  zone_id uuid REFERENCES public.zones(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view agents" ON public.agents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage agents" ON public.agents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. OWNERS
CREATE TABLE public.owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  city text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view owners" ON public.owners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage owners" ON public.owners FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Owners can view own record" ON public.owners FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON public.owners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. PROPERTIES
CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid REFERENCES public.owners(id) ON DELETE SET NULL,
  zone_id uuid REFERENCES public.zones(id) ON DELETE SET NULL,
  city text NOT NULL,
  area text NOT NULL,
  address text,
  latitude double precision,
  longitude double precision,
  photos text[] DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  gender_allowed gender_type NOT NULL DEFAULT 'any',
  total_rooms integer NOT NULL DEFAULT 0,
  total_beds integer NOT NULL DEFAULT 0,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active properties" ON public.properties FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage properties" ON public.properties FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE INDEX idx_properties_city_area ON public.properties(city, area);
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. ROOMS
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  room_number text NOT NULL,
  room_type text NOT NULL DEFAULT '1bhk',
  bed_count integer NOT NULL DEFAULT 1,
  rent_per_bed numeric,
  status room_status NOT NULL DEFAULT 'vacant',
  floor integer,
  last_confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Admins can manage rooms" ON public.rooms FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. BEDS
CREATE TABLE public.beds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  bed_number text NOT NULL,
  status bed_status NOT NULL DEFAULT 'vacant',
  rent numeric,
  current_tenant_name text,
  move_in_date date,
  move_out_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view beds" ON public.beds FOR SELECT USING (true);
CREATE POLICY "Admins can manage beds" ON public.beds FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE TRIGGER update_beds_updated_at BEFORE UPDATE ON public.beds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. LEADS
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  source lead_source NOT NULL DEFAULT 'website',
  status lead_status NOT NULL DEFAULT 'new',
  lead_score integer DEFAULT 0,
  assigned_agent_id uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  requirement text,
  budget_min numeric,
  budget_max numeric,
  preferred_area text,
  preferred_city text,
  gender gender_type,
  sharing_type text,
  company text,
  notes text,
  last_activity_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view leads" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert leads" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update leads" ON public.leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anon can insert leads" ON public.leads FOR INSERT TO anon WITH CHECK (true);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_agent ON public.leads(assigned_agent_id);
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. VISITS
CREATE TABLE public.visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  scheduled_at timestamptz NOT NULL,
  status visit_status NOT NULL DEFAULT 'scheduled',
  outcome visit_outcome,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view visits" ON public.visits FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can manage visits" ON public.visits FOR ALL TO authenticated WITH CHECK (true);
CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON public.visits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. BOOKINGS
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  room_id uuid REFERENCES public.rooms(id) ON DELETE SET NULL,
  bed_id uuid REFERENCES public.beds(id) ON DELETE SET NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  check_in_date date,
  check_out_date date,
  monthly_rent numeric,
  deposit numeric,
  tenant_name text,
  tenant_phone text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view bookings" ON public.bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can manage bookings" ON public.bookings FOR ALL TO authenticated WITH CHECK (true);
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12. SOFT LOCKS
CREATE TABLE public.soft_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_id uuid NOT NULL REFERENCES public.beds(id) ON DELETE CASCADE,
  reason text NOT NULL DEFAULT 'reservation',
  locked_by text,
  expires_at timestamptz NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.soft_locks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view soft locks" ON public.soft_locks FOR SELECT USING (true);
CREATE POLICY "Auth can manage soft locks" ON public.soft_locks FOR ALL TO authenticated WITH CHECK (true);

-- 13. RESERVATIONS
CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_id uuid NOT NULL REFERENCES public.beds(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  status text NOT NULL DEFAULT 'pending',
  amount numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reservations" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "Anyone can create reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth can update reservations" ON public.reservations FOR UPDATE TO authenticated USING (true);
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 14. CONVERSATIONS
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  message text NOT NULL,
  direction text NOT NULL DEFAULT 'outbound',
  channel text DEFAULT 'internal',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view conversations" ON public.conversations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert conversations" ON public.conversations FOR INSERT TO authenticated WITH CHECK (true);

-- 15. ACTIVITY LOG
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  details jsonb,
  performed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view activity" ON public.activity_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert activity" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (true);

-- 16. NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text,
  type text DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- 17. FOLLOW UP REMINDERS
CREATE TABLE public.follow_up_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  reminder_at timestamptz NOT NULL,
  note text,
  is_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.follow_up_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view reminders" ON public.follow_up_reminders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can manage reminders" ON public.follow_up_reminders FOR ALL TO authenticated WITH CHECK (true);

-- 18. TEAM QUEUES
CREATE TABLE public.team_queues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  priority integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE (zone_id, agent_id)
);
ALTER TABLE public.team_queues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view queues" ON public.team_queues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage queues" ON public.team_queues FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 19. LANDMARKS
CREATE TABLE public.landmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  city text NOT NULL,
  area text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.landmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view landmarks" ON public.landmarks FOR SELECT USING (true);

-- 20. ROOM STATUS LOG
CREATE TABLE public.room_status_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  confirmed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  previous_status room_status,
  new_status room_status NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.room_status_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view room logs" ON public.room_status_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert room logs" ON public.room_status_log FOR INSERT TO authenticated WITH CHECK (true);

-- DB FUNCTIONS
CREATE OR REPLACE FUNCTION public.calculate_lead_score(p_lead_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  score integer := 0;
  lead_rec RECORD;
  visit_count integer;
  conv_count integer;
BEGIN
  SELECT * INTO lead_rec FROM leads WHERE id = p_lead_id;
  IF NOT FOUND THEN RETURN 0; END IF;
  CASE lead_rec.status
    WHEN 'new' THEN score := 10;
    WHEN 'contacted' THEN score := 20;
    WHEN 'requirement_collected' THEN score := 35;
    WHEN 'property_suggested' THEN score := 50;
    WHEN 'visit_scheduled' THEN score := 65;
    WHEN 'visit_completed' THEN score := 80;
    WHEN 'booked' THEN score := 100;
    WHEN 'lost' THEN score := 0;
  END CASE;
  SELECT COUNT(*) INTO visit_count FROM visits WHERE visits.lead_id = p_lead_id;
  score := score + LEAST(visit_count * 5, 15);
  SELECT COUNT(*) INTO conv_count FROM conversations WHERE conversations.lead_id = p_lead_id;
  score := score + LEAST(conv_count * 2, 10);
  IF lead_rec.last_activity_at IS NOT NULL THEN
    score := GREATEST(score - EXTRACT(DAY FROM now() - lead_rec.last_activity_at)::integer, 0);
  END IF;
  RETURN LEAST(score, 100);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_property_effort(prop_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_leads', (SELECT COUNT(*) FROM leads WHERE property_id = prop_id),
    'total_visits', (SELECT COUNT(*) FROM visits WHERE property_id = prop_id),
    'total_bookings', (SELECT COUNT(*) FROM bookings WHERE property_id = prop_id),
    'conversion_rate', CASE WHEN (SELECT COUNT(*) FROM leads WHERE property_id = prop_id) > 0
      THEN ROUND((SELECT COUNT(*)::numeric FROM bookings WHERE property_id = prop_id) / (SELECT COUNT(*)::numeric FROM leads WHERE property_id = prop_id) * 100, 1)
      ELSE 0 END
  ) INTO result;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.route_lead_to_zone(p_lead_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  lead_area text;
  lead_city text;
  matched_zone_id uuid;
  assigned_agent uuid;
BEGIN
  SELECT preferred_area, preferred_city INTO lead_area, lead_city FROM leads WHERE id = p_lead_id;
  SELECT id INTO matched_zone_id FROM zones WHERE city = lead_city AND lead_area = ANY(areas) AND is_active = true LIMIT 1;
  IF matched_zone_id IS NOT NULL THEN
    SELECT tq.agent_id INTO assigned_agent FROM team_queues tq JOIN agents a ON a.id = tq.agent_id
    WHERE tq.zone_id = matched_zone_id AND tq.is_active = true AND a.is_active = true
    ORDER BY (SELECT COUNT(*) FROM leads l WHERE l.assigned_agent_id = tq.agent_id AND l.status NOT IN ('booked', 'lost'))
    LIMIT 1;
    IF assigned_agent IS NOT NULL THEN
      UPDATE leads SET assigned_agent_id = assigned_agent WHERE id = p_lead_id;
      RETURN assigned_agent;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;
