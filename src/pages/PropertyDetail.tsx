import { useParams } from 'react-router-dom';
import { useProperty } from '@/hooks/useInventoryData';
import PublicLayout from '@/components/layout/PublicLayout';
import { MapPin, Phone, Wifi, Car, UtensilsCrossed, Shield } from 'lucide-react';

export default function PropertyDetail() {
  const { id } = useParams();
  const { data: property, isLoading } = useProperty(id!);

  if (isLoading) return <PublicLayout><div className="container py-6 text-sm text-muted-foreground">Loading...</div></PublicLayout>;
  if (!property) return <PublicLayout><div className="container py-6 text-sm text-muted-foreground">Property not found.</div></PublicLayout>;

  return (
    <PublicLayout>
      <div className="container py-6 max-w-4xl">
        <h1 className="text-2xl font-semibold">{property.name}</h1>
        <div className="flex items-center gap-1 text-muted-foreground mt-1 text-sm">
          <MapPin size={14} /> {property.area}, {property.city}
        </div>
        {property.address && <p className="text-sm text-muted-foreground mt-0.5">{property.address}</p>}

        {/* Description */}
        {property.description && (
          <p className="mt-4 text-muted-foreground font-serif leading-relaxed">{property.description}</p>
        )}

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map(a => (
                <span key={a} className="text-xs px-2 py-1 rounded bg-muted">{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Rooms & Beds */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold mb-3">Available Rooms</h2>
          {property.rooms && property.rooms.length > 0 ? (
            <div className="space-y-3">
              {property.rooms.map((room: any) => (
                <div key={room.id} className="surface-paper rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Room {room.room_number}</span>
                      <span className="text-xs text-muted-foreground ml-2 capitalize">{room.room_type}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${room.status === 'vacant' ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                      {room.status}
                    </span>
                  </div>
                  {room.beds && room.beds.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {room.beds.map((bed: any) => (
                        <div key={bed.id} className={`text-center p-2 rounded border ${bed.status === 'vacant' ? 'border-green-200 bg-green-50' : 'border-border bg-muted/50'}`}>
                          <div className="text-xs font-medium">Bed {bed.bed_number}</div>
                          <div className="text-xs text-muted-foreground capitalize">{bed.status}</div>
                          {bed.rent && <div className="text-xs font-semibold mt-0.5">₹{Number(bed.rent).toLocaleString()}/mo</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No rooms listed for this property yet.</p>
          )}
        </div>

        {/* Contact */}
        <div className="mt-6 surface-paper rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-2">Interested?</h2>
          <p className="text-sm text-muted-foreground font-serif">Contact us to schedule a visit or reserve a bed.</p>
          <a href="/capture" className="inline-flex mt-3 px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            Submit Inquiry
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
