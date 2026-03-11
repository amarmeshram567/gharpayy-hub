import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, Users, GitBranch, MapPin, CalendarCheck, 
  MessageSquare, BookOpen, BarChart3, Clock, Building2, 
  Boxes, Grid3X3, Gauge, Brain, Map, Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/pipeline', label: 'Pipeline', icon: GitBranch },
  { to: '/visits', label: 'Visits', icon: CalendarCheck },
  { to: '/conversations', label: 'Conversations', icon: MessageSquare },
  { to: '/bookings', label: 'Bookings', icon: BookOpen },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/historical', label: 'Historical', icon: Clock },
  { divider: true, label: 'Inventory' },
  { to: '/owners', label: 'Owners', icon: Building2 },
  { to: '/inventory', label: 'Properties', icon: Boxes },
  { to: '/availability', label: 'Availability', icon: Grid3X3 },
  { to: '/effort', label: 'Effort', icon: Gauge },
  { to: '/matching', label: 'Matching', icon: Brain },
  { to: '/zones', label: 'Zones', icon: Map },
  { divider: true, label: 'System' },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-56'} h-screen flex-shrink-0 bg-card border-r border-border flex flex-col transition-all duration-200`}>
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && <span className="font-semibold text-sm tracking-tight">Gharpayy CRM</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-accent text-muted-foreground">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navItems.map((item, i) => {
            if ('divider' in item && item.divider) {
              if (collapsed) return <div key={i} className="my-2 border-t border-border" />;
              return <div key={i} className="mt-4 mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</div>;
            }
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to!}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`
                }
              >
                {Icon && <Icon size={16} />}
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border p-2">
          <button
            onClick={signOut}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-accent w-full"
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
