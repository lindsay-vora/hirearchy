import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { Summary, SummaryVersion, Tag } from '@/types';
import { useAppData } from '@/contexts/AppDataContext';

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
  const { addTag } = useAppData();
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [content, setContent] = useState('');
  const [versionTags, setVersionTags] = useState<string[]>([]);
  const [isNewVersion, setIsNewVersion] = useState(false);
  const [newTagName, setNewTagName] = useState('');

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

  const toggleTag = (tagName: string) => {
    setVersionTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleAddNewTag = () => {
    if (newTagName.trim() && !tags.find(t => t.name === newTagName.trim())) {
      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      addTag({ name: newTagName.trim(), color });
      setVersionTags(prev => [...prev, newTagName.trim()]);
      setNewTagName('');
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

          <div>
            <Label className="mb-2 block">Tags for this version</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {versionTags.map((tagName) => {
                const tag = tags.find(t => t.name === tagName);
                return (
                  <Badge
                    key={tagName}
                    variant="secondary"
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => toggleTag(tagName)}
                  >
                    {tag && (
                      <span
                        className="w-2 h-2 rounded-full mr-1"
                        style={{ backgroundColor: tag.color }}
                      />
                    )}
                    {tagName}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags
                .filter(tag => !versionTags.includes(tag.name))
                .map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => toggleTag(tag.name)}
                  >
                    <span
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                    <Plus className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="New tag name..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddNewTag} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Tag
              </Button>
            </div>
          </div>

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
