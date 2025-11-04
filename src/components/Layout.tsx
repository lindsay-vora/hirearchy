import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  List, 
  Tag, 
  Briefcase, 
  Settings,
  FileDown,
  FileUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
  onExport?: () => void;
  onImport?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onExport, onImport }) => {
  const location = useLocation();

  const navItems = [
    { path: '/resumes', label: 'Resumes', icon: FileText },
    { path: '/bullets', label: 'Bullets', icon: List },
    { path: '/tags', label: 'Tags', icon: Tag },
    { path: '/applications', label: 'Applications', icon: Briefcase },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <h1 className="text-xl font-bold text-sidebar-foreground">Hirearchy</h1>
        </div>
        
        <nav className="space-y-1 p-4">
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
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          {onImport && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onImport}
            >
              <FileUp className="mr-2 h-4 w-4" />
              Import Data
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onExport}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
