import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FilePenLine, Tag, Layers, Settings, MessageSquare, AlertCircle } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";
import { SaveVersionDialog } from "@/components/dialogs/SaveVersionDialog";
import { exportData } from "@/lib/storage";
import { toast } from "sonner";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { data, lastSaveTime, saveResumeVersion, updateResumeVersion, markAsSaved } = useAppData();
  const [showReminder, setShowReminder] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    const checkSaveTime = () => {
      const timeSinceLastSave = Date.now() - lastSaveTime;
      const twoMinutes = 2 * 60 * 1000;
      setShowReminder(timeSinceLastSave > twoMinutes);
    };

    checkSaveTime();
    const interval = setInterval(checkSaveTime, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [lastSaveTime]);

  const handleSaveVersion = (
    action: 'overwrite' | 'new',
    details?: { name: string; description: string; tags: string[] }
  ) => {
    if (action === 'overwrite' && data.currentEditing?.resumeVersionId) {
      updateResumeVersion(data.currentEditing.resumeVersionId, {
        summaryId: (data.summaries || []).find(s => s.isSelected)?.id,
        selectedBullets: (data.bullets || []).filter(b => b.isSelected).map(b => b.id),
        selectedCompanies: (data.companies || []).filter(c => c.isVisible !== false).map(c => c.id),
      });
      toast.success('Resume version updated');
    } else if (action === 'new' && details) {
      saveResumeVersion({
        name: details.name,
        description: details.description,
        tags: details.tags,
        summaryId: (data.summaries || []).find(s => s.isSelected)?.id,
        selectedBullets: (data.bullets || []).filter(b => b.isSelected).map(b => b.id),
        selectedCompanies: (data.companies || []).filter(c => c.isVisible !== false).map(c => c.id),
      });
      toast.success('Resume version saved');
    }
    
    // Automatically download JSON backup
    exportData(data);
    markAsSaved();
    toast.success('Backup downloaded');
    setShowSaveDialog(false);
  };

  const navItems = [
    { path: "/", label: "Resume Editor", icon: FilePenLine },
    { path: "/tags", label: "Tag Manager", icon: Tag },
    { path: "/saved", label: "Saved Resumes", icon: Layers },
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/feedback", label: "Support", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-[76px] lg:w-56 border-r border-sidebar-border bg-sidebar flex flex-col shrink-0 transition-[width] duration-200">
        <div className="flex h-[72px] items-center border-b border-sidebar-border px-5 lg:px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">H</div>
          <div className="ml-3 hidden min-w-0 lg:block">
            <h1 className="text-[17px] font-semibold text-sidebar-foreground">Hirearchy</h1>
            <span className="text-[10px] font-medium uppercase text-sidebar-foreground/45">Resume workspace</span>
          </div>
        </div>

        <div className="flex-1 py-5">
          <p className="hidden px-5 text-[10px] font-semibold uppercase text-sidebar-foreground/40 mb-3 lg:block">Workspace</p>
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-sidebar-border p-3 lg:p-4 space-y-2">
          {showReminder && (
            <div className="hidden items-start gap-2 rounded-md border border-warning/25 bg-warning/10 p-2 text-warning lg:flex">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-xs">
                Don't forget to{" "}
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="font-medium underline hover:no-underline"
                >
                  save & download
                </button>{" "}
                your JSON backup
              </p>
            </div>
          )}
          <p className="hidden text-xs leading-relaxed text-sidebar-foreground/45 lg:block">
            Saved in browser -{" "}
            <button 
              onClick={() => setShowSaveDialog(true)}
              className="underline hover:no-underline"
            >
              Save or Download JSON
            </button>{" "}
            frequently
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-hidden">{children}</main>

      <SaveVersionDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        currentVersionId={data.currentEditing?.resumeVersionId}
        currentVersionName={data.currentEditing?.resumeName || 'Untitled Resume'}
        onSave={handleSaveVersion}
      />
    </div>
  );
};

export default AppLayout;
