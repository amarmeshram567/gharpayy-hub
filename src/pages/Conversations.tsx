import { useConversations, useCreateConversation, useLeads } from '@/hooks/useCrmData';
import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Conversations() {
  const { data: leads } = useLeads();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const { data: conversations } = useConversations(selectedLeadId || undefined);
  const createMsg = useCreateConversation();
  const [newMessage, setNewMessage] = useState('');

  const leadConversationCounts = (leads || []).map(lead => ({
    ...lead,
  }));

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedLeadId) return;
    await createMsg.mutateAsync({
      lead_id: selectedLeadId,
      message: newMessage,
      direction: 'outbound',
      channel: 'internal',
    });
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Lead list */}
      <div className="w-72 border-r border-border bg-card overflow-y-auto flex-shrink-0">
        <div className="p-3 border-b border-border">
          <h2 className="text-sm font-semibold">Conversations</h2>
        </div>
        {leadConversationCounts.length === 0 ? (
          <div className="p-3 text-xs text-muted-foreground">No leads yet.</div>
        ) : (
          leadConversationCounts.map(lead => (
            <button
              key={lead.id}
              onClick={() => setSelectedLeadId(lead.id)}
              className={`w-full text-left px-3 py-2.5 border-b border-border hover:bg-accent/50 transition-colors ${
                selectedLeadId === lead.id ? 'bg-accent' : ''
              }`}
            >
              <div className="text-sm font-medium">{lead.name}</div>
              <div className="text-xs text-muted-foreground">{lead.phone || lead.email || 'No contact'}</div>
            </button>
          ))
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedLeadId ? (
          <>
            <div className="p-3 border-b border-border bg-card">
              <h3 className="text-sm font-semibold">
                {leads?.find(l => l.id === selectedLeadId)?.name}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(conversations || []).map(msg => (
                <div key={msg.id} className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                    msg.direction === 'outbound' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'surface-paper'
                  }`}>
                    {msg.message}
                    <div className={`text-[10px] mt-1 ${msg.direction === 'outbound' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border bg-card flex gap-2">
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-1.5 rounded border border-input bg-background text-sm"
              />
              <button onClick={handleSend} disabled={createMsg.isPending}
                className="px-3 py-1.5 rounded bg-primary text-primary-foreground hover:opacity-90">
                <Send size={14} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Select a lead to view conversation
          </div>
        )}
      </div>
    </div>
  );
}
