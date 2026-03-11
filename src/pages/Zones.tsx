import { useZones } from '@/hooks/useInventoryData';

export default function Zones() {
  const { data: zones, isLoading } = useZones();
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Zones</h1>
      <div className="surface-paper rounded-lg overflow-hidden">
        {isLoading ? <div className="p-6 text-sm text-muted-foreground">Loading...</div> : !zones?.length ? (
          <div className="p-6 text-sm text-muted-foreground">No zones configured yet. Zones define geographic areas for lead routing.</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Zone</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">City</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Areas</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Agents</th>
            </tr></thead>
            <tbody>{zones.map(z => (
              <tr key={z.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-2.5 font-medium">{z.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{z.city}</td>
                <td className="px-4 py-2.5 text-muted-foreground text-xs">{z.areas?.join(', ') || '—'}</td>
                <td className="px-4 py-2.5 text-muted-foreground text-xs">{(z as any).agents?.map((a: any) => a.name).join(', ') || '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
