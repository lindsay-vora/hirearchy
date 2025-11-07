import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Tag, Layers, Building2, Settings, MessageSquare, AlertCircle } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { lastSaveTime } = useAppData();
  const [showReminder, setShowReminder] = useState(false);

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

  const navItems = [
    { path: "/", label: "Resume Editor", icon: Home },
    { path: "/tags", label: "Tag Manager", icon: Tag },
    { path: "/saved", label: "Saved Resumes", icon: Layers },
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/feedback", label: "Support", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Building2 className="h-6 w-6 mr-2" />
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Hirearchy</h1>
            <span className="text-xs text-muted-foreground">Beta</span>
          </div>
        </div>

        <div className="flex-1 py-4">
          <p className="px-6 text-xs font-semibold text-muted-foreground mb-2">Navigation</p>
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-sidebar-border p-4 space-y-2">
          {showReminder && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-xs">
                Don't forget to{" "}
                <Link to="/settings" className="font-medium underline">
                  save & download
                </Link>{" "}
                your JSON backup
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">Saved in browser - Save or Download JSON frequently</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default AppLayout;
