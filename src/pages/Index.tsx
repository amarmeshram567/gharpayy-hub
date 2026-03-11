import { Link } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import { Search, MapPin, Shield, Zap } from 'lucide-react';

export default function Index() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Find your next PG home,<br />
            <span className="text-primary">without the hassle.</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-serif max-w-xl mx-auto leading-relaxed">
            Gharpayy connects you with verified paying guest accommodations across India's major cities. Search, visit, book — all in one place.
          </p>
          <div className="mt-8 flex items-center gap-3 justify-center">
            <Link
              to="/explore"
              className="px-6 py-2.5 rounded bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Explore PGs
            </Link>
            <Link
              to="/capture"
              className="px-6 py-2.5 rounded border border-border text-foreground font-medium hover:bg-accent transition-colors"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-border">
        <div className="container">
          <h2 className="text-2xl font-semibold text-center mb-12">How Gharpayy Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Search, title: 'Search', desc: 'Filter by city, area, budget, and room type. See real-time availability.' },
              { icon: MapPin, title: 'Visit', desc: 'Schedule a visit online. Our agent will meet you at the property.' },
              { icon: Shield, title: 'Book', desc: 'Reserve your bed instantly. Move in with zero brokerage.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-serif">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-border bg-card">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
            {[
              { num: '10K+', label: 'Daily Visitors' },
              { num: '500+', label: 'Properties Listed' },
              { num: '100+', label: 'Property Owners' },
              { num: '5', label: 'Cities' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-primary">{s.num}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="text-2xl font-semibold mb-3">Ready to find your PG?</h2>
          <p className="text-muted-foreground font-serif mb-6">Join thousands of happy tenants who found their home through Gharpayy.</p>
          <Link
            to="/explore"
            className="inline-flex px-6 py-2.5 rounded bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Start Searching
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
