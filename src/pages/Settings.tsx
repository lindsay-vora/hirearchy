import React from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { exportData, importData, saveData } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { AppData } from '@/types';

const Settings: React.FC = () => {
  const { data, updateData } = useData();
  const { toast } = useToast();

  const handleExport = () => {
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
          updateData(importedData);
          saveData(importedData as AppData);
          toast({ title: 'Data imported successfully' });
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

  const handleClearData = () => {
    if (
      confirm(
        'Are you sure you want to clear all data? This action cannot be undone.'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Settings"
        description="Manage your data and application preferences"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export, import, or clear your application data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download all your data as a JSON file
                  </p>
                </div>
                <Button onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <h4 className="font-medium">Import Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Load data from a previously exported JSON file
                  </p>
                </div>
                <Button onClick={handleImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <h4 className="font-medium">Clear All Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all application data
                  </p>
                </div>
                <Button variant="destructive" onClick={handleClearData}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Overview of your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">{data.resumes.length}</p>
                  <p className="text-sm text-muted-foreground">Resumes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.bullets.length}</p>
                  <p className="text-sm text-muted-foreground">Bullets</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.tags.length}</p>
                  <p className="text-sm text-muted-foreground">Tags</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{data.applications.length}</p>
                  <p className="text-sm text-muted-foreground">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Hirearchy</CardTitle>
              <CardDescription>Version 1.0.0</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A personal resume version control and application tracking tool for
                job seekers. All data is stored locally in your browser.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Licensed under PolyForm Noncommercial License 1.0.0
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
