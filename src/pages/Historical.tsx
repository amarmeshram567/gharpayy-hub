export default function Historical() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">Historical Data</h1>
      <p className="text-sm text-muted-foreground mb-4">Time-series analysis of leads, visits, and bookings over time.</p>
      <div className="surface-paper rounded-lg p-6 text-sm text-muted-foreground">
        Historical charts will populate as data accumulates. Start by adding leads and recording visits.
      </div>
    </div>
  );
}
