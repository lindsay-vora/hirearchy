import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import Layout from "@/components/Layout";
import Resumes from "./pages/Resumes";
import Bullets from "./pages/Bullets";
import Tags from "./pages/Tags";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { exportData, importData, saveData } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

const AppContent = () => {
  const { toast } = useToast();

  const handleExport = () => {
    const data = JSON.parse(localStorage.getItem('hirearchy_data') || '{}');
    exportData(data);
    toast({ title: 'Data exported successfully' });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const importedData = await importData(file);
          saveData(importedData);
          window.location.reload();
        } catch (error) {
          toast({
            title: 'Import failed',
            description: 'Invalid JSON file',
            variant: 'destructive',
          });
        }
      }
    };
    input.click();
  };

  return (
    <Layout onExport={handleExport} onImport={handleImport}>
      <Routes>
        <Route path="/" element={<Navigate to="/resumes" replace />} />
        <Route path="/resumes" element={<Resumes />} />
        <Route path="/bullets" element={<Bullets />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
