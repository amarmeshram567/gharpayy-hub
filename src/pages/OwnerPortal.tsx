import PublicLayout from '@/components/layout/PublicLayout';
import { useAuth } from '@/hooks/useAuth';

export default function OwnerPortal() {
  const { user } = useAuth();

  if (!user) {
    return (
      <PublicLayout>
        <div className="container py-20 text-center max-w-md mx-auto">
          <h1 className="text-2xl font-semibold mb-2">Owner Portal</h1>
          <p className="text-muted-foreground font-serif mb-4">Sign in to manage your properties, confirm room status, and view bookings.</p>
          <a href="/auth" className="inline-flex px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Sign In</a>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-2xl font-semibold mb-1">Owner Portal</h1>
        <p className="text-sm text-muted-foreground mb-6">Manage your properties and view booking activity.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="surface-paper rounded-lg p-4"><div className="text-xs text-muted-foreground mb-1">Total Properties</div><div className="text-2xl font-bold">—</div></div>
          <div className="surface-paper rounded-lg p-4"><div className="text-xs text-muted-foreground mb-1">Occupancy Rate</div><div className="text-2xl font-bold">—</div></div>
          <div className="surface-paper rounded-lg p-4"><div className="text-xs text-muted-foreground mb-1">Active Bookings</div><div className="text-2xl font-bold">—</div></div>
        </div>
        <div className="surface-paper rounded-lg p-6 text-sm text-muted-foreground">
          Your properties and room confirmations will appear here once your account is linked to owner records. Contact the Gharpayy team to set up your owner profile.
        </div>
      </div>
    </PublicLayout>
  );
}
