import { useBookings } from '@/hooks/useCrmData';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  checked_in: 'bg-blue-100 text-blue-800',
  checked_out: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Bookings() {
  const { data: bookings, isLoading } = useBookings();

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Bookings</h1>
        <p className="text-sm text-muted-foreground">{bookings?.length || 0} total bookings</p>
      </div>

      <div className="surface-paper rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading bookings...</div>
        ) : !bookings?.length ? (
          <div className="p-6 text-sm text-muted-foreground">No bookings yet. Bookings are created when visits result in a deal.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Tenant</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Property</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Room / Bed</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Rent</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Check-in</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                  <td className="px-4 py-2.5 font-medium">{b.tenant_name || (b as any).leads?.name || '—'}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{(b as any).properties?.name || '—'}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {(b as any).rooms?.room_number || '—'} / {(b as any).beds?.bed_number || '—'}
                  </td>
                  <td className="px-4 py-2.5">{b.monthly_rent ? `₹${Number(b.monthly_rent).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{b.check_in_date || '—'}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[b.status] || 'bg-muted'}`}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
