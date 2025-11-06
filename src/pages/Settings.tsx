import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Download, Upload } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { exportData, importData } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { AppData } from '@/types';

const Settings: React.FC = () => {
  const { data, updateData, updateContactInfo, markAsSaved } = useAppData();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      exportData(data);
      markAsSaved();
      toast({
        title: 'Data exported',
        description: 'Your data has been downloaded as a JSON file.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await importData(file);
      updateData(importedData);
      toast({
        title: 'Data imported',
        description: 'Your data has been successfully restored.',
      });
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'Failed to import data. Please ensure the file is valid.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application data and preferences
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Edit your contact details that appear on your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2 mr-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={data.contactInfo.name}
                      onChange={(e) => updateContactInfo({ name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="show-name"
                      checked={data.contactInfo.showName}
                      onCheckedChange={(checked) => updateContactInfo({ showName: checked })}
                    />
                    <Label htmlFor="show-name" className="text-sm">Show</Label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2 mr-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.contactInfo.email}
                      onChange={(e) => updateContactInfo({ email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="show-email"
                      checked={data.contactInfo.showEmail}
                      onCheckedChange={(checked) => updateContactInfo({ showEmail: checked })}
                    />
                    <Label htmlFor="show-email" className="text-sm">Show</Label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2 mr-4">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={data.contactInfo.phone}
                      onChange={(e) => updateContactInfo({ phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="show-phone"
                      checked={data.contactInfo.showPhone}
                      onCheckedChange={(checked) => updateContactInfo({ showPhone: checked })}
                    />
                    <Label htmlFor="show-phone" className="text-sm">Show</Label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2 mr-4">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={data.contactInfo.website}
                      onChange={(e) => updateContactInfo({ website: e.target.value })}
                      placeholder="www.yourwebsite.com"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="show-website"
                      checked={data.contactInfo.showWebsite}
                      onCheckedChange={(checked) => updateContactInfo({ showWebsite: checked })}
                    />
                    <Label htmlFor="show-website" className="text-sm">Show</Label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2 mr-4">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={data.contactInfo.location}
                      onChange={(e) => updateContactInfo({ location: e.target.value })}
                      placeholder="City, State"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="show-location"
                      checked={data.contactInfo.showLocation}
                      onCheckedChange={(checked) => updateContactInfo({ showLocation: checked })}
                    />
                    <Label htmlFor="show-location" className="text-sm">Show</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export or import your resume data to backup or restore your work
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Export Data</h3>
                <p className="text-sm text-muted-foreground">
                  Download all your resume data as a JSON file. This includes companies,
                  positions, projects, bullets, summaries, tags, and saved formats.
                </p>
                <Button onClick={handleExport} className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Download JSON
                </Button>
              </div>

              <div className="border-t pt-4 space-y-2">
                <h3 className="font-semibold">Import Data</h3>
                <p className="text-sm text-muted-foreground">
                  Restore your data from a previously exported JSON file. This will
                  replace all current data with the imported data.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button onClick={handleImportClick} variant="outline" className="w-full sm:w-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
