import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Bullet, BulletVersion, Tag } from '@/types';
import { TagSelector } from '@/components/TagSelector';

interface EditBulletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bullet: Bullet | null;
  tags: Tag[];
  onSave: (bulletId: string, content: string, versionTags: string[], selectedVersion?: string) => void;
  onSaveNewVersion: (bulletId: string, content: string, versionTags: string[]) => void;
}

export const EditBulletDialog: React.FC<EditBulletDialogProps> = ({
  open,
  onOpenChange,
  bullet,
  tags,
  onSave,
  onSaveNewVersion,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [content, setContent] = useState('');
  const [versionTags, setVersionTags] = useState<string[]>([]);
  const [isNewVersion, setIsNewVersion] = useState(false);

  useEffect(() => {
    if (bullet) {
      const version = bullet.selectedVersion || bullet.version;
      setSelectedVersion(version);
      const versionData = bullet.versions?.find((v: BulletVersion) => v.version === version) || { content: bullet.content, tags: bullet.tags || [] };
      setContent(versionData.content);
      setVersionTags(versionData.tags || []);
      setIsNewVersion(false);
    }
  }, [bullet, open]);

  const handleVersionChange = (version: string) => {
    if (!bullet) return;
    setSelectedVersion(version);
    const versionData = bullet.versions?.find((v: BulletVersion) => v.version === version);
    if (versionData) {
      setContent(versionData.content);
      setVersionTags(versionData.tags || []);
    }
  };

  const handleSave = () => {
    if (!bullet) return;

    if (isNewVersion) {
      onSaveNewVersion(bullet.id, content, versionTags);
    } else {
      onSave(bullet.id, content, versionTags, selectedVersion);
    }
    
    onOpenChange(false);
  };

  if (!bullet) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Bullet Point</DialogTitle>
          <DialogDescription>
            Edit the content and tags for this bullet. Select a version to edit or create a new version.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="version">Version</Label>
              <Select value={selectedVersion} onValueChange={handleVersionChange}>
                <SelectTrigger id="version">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bullet.versions?.map((v: BulletVersion) => (
                    <SelectItem key={v.version} value={v.version}>
                      {v.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                id="newVersion"
                checked={isNewVersion}
                onCheckedChange={(checked) => setIsNewVersion(checked as boolean)}
              />
              <Label htmlFor="newVersion" className="cursor-pointer">
                Save as new version
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
              placeholder="Enter bullet point content..."
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
