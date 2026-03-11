export default function Availability() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">Availability Board</h1>
      <p className="text-sm text-muted-foreground mb-4">Visual matrix of room and bed availability across properties.</p>
      <div className="surface-paper rounded-lg p-6 text-sm text-muted-foreground">
        Add properties with rooms and beds to see the availability matrix here.
      </div>
    </div>
  );
}
