import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Summary, SummaryVersion, Tag } from '@/types';
import { TagSelector } from '@/components/TagSelector';

interface EditSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: Summary | null;
  tags: Tag[];
  onSave: (summaryId: string, content: string, versionTags: string[], selectedVersion?: string) => void;
  onSaveNewVersion: (summaryId: string, content: string, versionTags: string[]) => void;
}

export const EditSummaryDialog: React.FC<EditSummaryDialogProps> = ({
  open,
  onOpenChange,
  summary,
  tags,
  onSave,
  onSaveNewVersion,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [content, setContent] = useState('');
  const [versionTags, setVersionTags] = useState<string[]>([]);
  const [isNewVersion, setIsNewVersion] = useState(false);

  useEffect(() => {
    if (summary) {
      const version = summary.selectedVersion || summary.version;
      setSelectedVersion(version);
      const versionData = summary.versions?.find((v: SummaryVersion) => v.version === version) || { content: summary.content, tags: summary.tags || [] };
      setContent(versionData.content);
      setVersionTags(versionData.tags || []);
      setIsNewVersion(false);
    }
  }, [summary, open]);

  const handleVersionChange = (version: string) => {
    if (!summary) return;
    setSelectedVersion(version);
    setIsNewVersion(false);
    const versionData = summary.versions?.find((v: SummaryVersion) => v.version === version);
    if (versionData) {
      setContent(versionData.content);
      setVersionTags(versionData.tags || []);
    }
  };

  const handleSave = () => {
    if (!summary) return;

    if (isNewVersion) {
      onSaveNewVersion(summary.id, content, versionTags);
    } else {
      onSave(summary.id, content, versionTags, selectedVersion);
    }
    
    onOpenChange(false);
  };

  if (!summary) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Summary</DialogTitle>
          <DialogDescription>
            Edit the content and tags for this summary. Select a version to edit or create a new version.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="version">Select Version to Edit</Label>
              <Select 
                value={selectedVersion} 
                onValueChange={handleVersionChange}
                disabled={isNewVersion}
              >
                <SelectTrigger id="version">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {summary.versions?.map((v: SummaryVersion) => (
                    <SelectItem key={v.version} value={v.version}>
                      {v.version} {v.tags.length > 0 && `(${v.tags.join(', ')})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="newVersion"
                checked={isNewVersion}
                onCheckedChange={(checked) => setIsNewVersion(checked as boolean)}
              />
              <Label htmlFor="newVersion" className="cursor-pointer text-sm">
                Save as new version instead of updating {selectedVersion}
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
              placeholder="Enter summary content..."
            />
          </div>

          <TagSelector
            selectedTags={versionTags}
            onTagsChange={setVersionTags}
            label="Tags for this version"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isNewVersion ? 'Save as New Version' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
