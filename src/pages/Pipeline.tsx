import { useLeads, useUpdateLead } from '@/hooks/useCrmData';
import { useState } from 'react';

const PIPELINE_STAGES = [
  { key: 'new', label: 'New', color: 'border-blue-300' },
  { key: 'contacted', label: 'Contacted', color: 'border-yellow-300' },
  { key: 'requirement_collected', label: 'Requirement', color: 'border-purple-300' },
  { key: 'property_suggested', label: 'Suggested', color: 'border-indigo-300' },
  { key: 'visit_scheduled', label: 'Visit Scheduled', color: 'border-cyan-300' },
  { key: 'visit_completed', label: 'Visit Done', color: 'border-teal-300' },
  { key: 'booked', label: 'Booked', color: 'border-green-300' },
  { key: 'lost', label: 'Lost', color: 'border-red-300' },
];

export default function Pipeline() {
  const { data: leads, isLoading } = useLeads();
  const updateLead = useUpdateLead();
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedId) {
      updateLead.mutate({ id: draggedId, status: status as any });
      setDraggedId(null);
    }
  };

  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Loading pipeline...</div>;

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Pipeline</h1>
        <p className="text-sm text-muted-foreground">Drag leads between stages</p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-3 h-full min-w-max">
          {PIPELINE_STAGES.map(stage => {
            const stageLeads = (leads || []).filter(l => l.status === stage.key);
            return (
              <div
                key={stage.key}
                className="w-64 flex-shrink-0 flex flex-col"
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, stage.key)}
              >
                <div className={`px-3 py-2 rounded-t-lg border-t-2 ${stage.color} bg-muted/30`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider">{stage.label}</span>
                    <span className="text-xs text-muted-foreground">{stageLeads.length}</span>
                  </div>
                </div>
                <div className="flex-1 bg-muted/10 rounded-b-lg p-2 space-y-2 min-h-[200px]">
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={e => handleDragStart(e, lead.id)}
                      className="surface-paper rounded p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow"
                    >
                      <div className="font-medium text-sm">{lead.name}</div>
                      {lead.company && <div className="text-xs text-muted-foreground">{lead.company}</div>}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{lead.preferred_area || lead.source}</span>
                        {lead.budget_max && (
                          <span className="text-xs font-medium">₹{Number(lead.budget_max).toLocaleString()}</span>
                        )}
                      </div>
                      {lead.lead_score !== null && lead.lead_score > 0 && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${lead.lead_score}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground">{lead.lead_score}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
