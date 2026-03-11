import { useProperties } from '@/hooks/useInventoryData';
import PublicLayout from '@/components/layout/PublicLayout';
import { Link } from 'react-router-dom';
import { MapPin, Users, IndianRupee } from 'lucide-react';
import { useState } from 'react';

export default function Explore() {
  const [filters, setFilters] = useState({ city: '', area: '', gender: '' });
  const { data: properties, isLoading } = useProperties(filters.city ? filters : undefined);

  return (
    <PublicLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-semibold mb-4">Explore PG Accommodations</h1>
        
        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <input placeholder="City" value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})}
            className="px-3 py-1.5 rounded border border-input bg-background text-sm w-40" />
          <input placeholder="Area" value={filters.area} onChange={e => setFilters({...filters, area: e.target.value})}
            className="px-3 py-1.5 rounded border border-input bg-background text-sm w-40" />
          <select value={filters.gender} onChange={e => setFilters({...filters, gender: e.target.value})}
            className="px-3 py-1.5 rounded border border-input bg-background text-sm">
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="any">Co-ed</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading properties...</div>
        ) : !properties?.length ? (
          <div className="text-sm text-muted-foreground">No properties found. Try adjusting your filters.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map(p => {
              const minRent = p.rooms?.reduce((min: number, r: any) => {
                const bedRents = r.beds?.map((b: any) => Number(b.rent)).filter((r: number) => r > 0) || [];
                const roomMin = bedRents.length > 0 ? Math.min(...bedRents) : (r.rent_per_bed ? Number(r.rent_per_bed) : 0);
                return roomMin > 0 && roomMin < min ? roomMin : min;
              }, Infinity) || 0;
              const vacantBeds = p.rooms?.reduce((sum: number, r: any) => sum + (r.beds?.filter((b: any) => b.status === 'vacant').length || 0), 0) || 0;
              
              return (
                <Link key={p.id} to={`/property/${p.id}`} className="surface-paper rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 bg-muted flex items-center justify-center">
                    {p.photos && p.photos.length > 0 ? (
                      <img src={p.photos[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-muted-foreground text-sm">No photos</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{p.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin size={12} /> {p.area}, {p.city}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-sm">
                        <IndianRupee size={12} />
                        <span className="font-semibold">{minRent > 0 && minRent < Infinity ? `₹${minRent.toLocaleString()}/mo` : 'Contact us'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users size={12} /> {vacantBeds} beds available
                      </div>
                    </div>
                    <div className="mt-2 flex gap-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted capitalize">{p.gender_allowed}</span>
                      {p.amenities?.slice(0, 3).map(a => (
                        <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-muted">{a}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
