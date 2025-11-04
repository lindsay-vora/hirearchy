import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import ResumeEditor from "./pages/ResumeEditor";
import TagManager from "./pages/TagManager";
import SavedResumes from "./pages/SavedResumes";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<ResumeEditor />} />
          <Route path="/resumes" element={<ResumeEditor />} />
          <Route path="/tags" element={<TagManager />} />
          <Route path="/saved" element={<SavedResumes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;

