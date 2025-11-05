import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import ResumeEditor from "./pages/ResumeEditor";
import TagManager from "./pages/TagManager";
import SavedResumes from "./pages/SavedResumes";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import { AppDataProvider } from "./contexts/AppDataContext";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AppDataProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<ResumeEditor />} />
            <Route path="/resumes" element={<ResumeEditor />} />
            <Route path="/tags" element={<TagManager />} />
            <Route path="/saved" element={<SavedResumes />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/feedback" element={<Support />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppDataProvider>
  </TooltipProvider>
);

export default App;

