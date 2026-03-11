import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container h-full flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg tracking-tight">
            Gharpayy
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
            <Link to="/capture" className="text-muted-foreground hover:text-foreground transition-colors">List Your PG</Link>
            {user ? (
              <Link to="/dashboard" className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Dashboard
              </Link>
            ) : (
              <Link to="/auth" className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {children}

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Gharpayy</h3>
              <p className="text-sm text-muted-foreground font-serif leading-relaxed">
                India's smartest PG operating system. Finding your next home, simplified.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">For Tenants</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link to="/explore" className="hover:text-foreground transition-colors">Search PGs</Link>
                <Link to="/capture" className="hover:text-foreground transition-colors">Submit Inquiry</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">For Owners</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link to="/owner-portal" className="hover:text-foreground transition-colors">Owner Portal</Link>
                <Link to="/capture" className="hover:text-foreground transition-colors">List Property</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Company</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span>support@gharpayy.com</span>
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground">
            © {new Date().getFullYear()} Gharpayy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
