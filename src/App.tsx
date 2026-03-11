import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import CRMLayout from "@/components/layout/CRMLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Explore from "./pages/Explore";
import PropertyDetail from "./pages/PropertyDetail";
import Capture from "./pages/Capture";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Pipeline from "./pages/Pipeline";
import Visits from "./pages/Visits";
import Conversations from "./pages/Conversations";
import Bookings from "./pages/Bookings";
import Analytics from "./pages/Analytics";
import Historical from "./pages/Historical";
import Owners from "./pages/Owners";
import Inventory from "./pages/Inventory";
import Availability from "./pages/Availability";
import Effort from "./pages/Effort";
import Matching from "./pages/Matching";
import Zones from "./pages/Zones";
import OwnerPortal from "./pages/OwnerPortal";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function CRMPage({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <CRMLayout>{children}</CRMLayout>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/capture" element={<Capture />} />
            <Route path="/owner-portal" element={<OwnerPortal />} />
            {/* CRM (Protected) */}
            <Route path="/dashboard" element={<CRMPage><Dashboard /></CRMPage>} />
            <Route path="/leads" element={<CRMPage><Leads /></CRMPage>} />
            <Route path="/pipeline" element={<CRMPage><Pipeline /></CRMPage>} />
            <Route path="/visits" element={<CRMPage><Visits /></CRMPage>} />
            <Route path="/conversations" element={<CRMPage><Conversations /></CRMPage>} />
            <Route path="/bookings" element={<CRMPage><Bookings /></CRMPage>} />
            <Route path="/analytics" element={<CRMPage><Analytics /></CRMPage>} />
            <Route path="/historical" element={<CRMPage><Historical /></CRMPage>} />
            <Route path="/owners" element={<CRMPage><Owners /></CRMPage>} />
            <Route path="/inventory" element={<CRMPage><Inventory /></CRMPage>} />
            <Route path="/availability" element={<CRMPage><Availability /></CRMPage>} />
            <Route path="/effort" element={<CRMPage><Effort /></CRMPage>} />
            <Route path="/matching" element={<CRMPage><Matching /></CRMPage>} />
            <Route path="/zones" element={<CRMPage><Zones /></CRMPage>} />
            <Route path="/settings" element={<CRMPage><Settings /></CRMPage>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
