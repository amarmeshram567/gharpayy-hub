import { useDashboardStats } from '@/hooks/useCrmData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#FF4F00', '#0057FF', '#FFC700', '#10B981', '#8B5CF6', '#EC4899', '#6B7280', '#F59E0B'];

export default function Analytics() {
  const { data: stats, isLoading } = useDashboardStats();
  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;

  const sourceData = Object.entries(stats?.leadsBySource || {}).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
  const statusData = Object.entries(stats?.leadsByStatus || {}).map(([name, value]) => ({ name: name.replace('_', ' '), value }));

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="surface-paper rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Leads by Source</h3>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sourceData}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#FF4F00" radius={[4,4,0,0]} /></BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground">No data yet.</p>}
        </div>
        <div className="surface-paper rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Leads by Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground">No data yet.</p>}
        </div>
      </div>
    </div>
  );
}
