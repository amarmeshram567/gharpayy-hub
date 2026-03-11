import { useDashboardStats } from '@/hooks/useCrmData';
import { Users, CalendarCheck, BookOpen, TrendingUp, AlertCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Loading dashboard...</div>;

  const kpis = [
    { label: 'Total Leads', value: stats?.totalLeads || 0, icon: Users, sub: `${stats?.newLeads || 0} new` },
    { label: 'Active Leads', value: stats?.activeLeads || 0, icon: TrendingUp, sub: `${stats?.todayLeads || 0} today` },
    { label: 'Scheduled Visits', value: stats?.scheduledVisits || 0, icon: CalendarCheck, sub: `${stats?.todayVisits || 0} today` },
    { label: 'Bookings', value: stats?.totalBookings || 0, icon: BookOpen, sub: `${stats?.confirmedBookings || 0} confirmed` },
    { label: 'Conversion Rate', value: `${stats?.conversionRate || 0}%`, icon: TrendingUp, sub: 'lead → booking' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your CRM operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {kpis.map(kpi => (
          <div key={kpi.label} className="surface-paper rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <kpi.icon size={14} />
              <span className="text-xs font-medium">{kpi.label}</span>
            </div>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Lead Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="surface-paper rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Leads by Source</h3>
          {stats?.leadsBySource && Object.entries(stats.leadsBySource).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(stats.leadsBySource).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-muted-foreground">{source.replace('_', ' ')}</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No leads yet. <a href="/leads" className="text-primary hover:underline">+ Add Lead</a></p>
          )}
        </div>

        <div className="surface-paper rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Leads by Status</h3>
          {stats?.leadsByStatus && Object.entries(stats.leadsByStatus).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(stats.leadsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-muted-foreground">{status.replace('_', ' ')}</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No leads yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
