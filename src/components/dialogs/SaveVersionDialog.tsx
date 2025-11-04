import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SaveVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentVersionId?: string;
  currentVersionName: string;
  onSave: (action: 'overwrite' | 'new', details?: { name: string; description: string; tags: string[] }) => void;
}

export const SaveVersionDialog: React.FC<SaveVersionDialogProps> = ({ 
  open, 
  onOpenChange, 
  currentVersionId,
  currentVersionName,
  onSave 
}) => {
  const [action, setAction] = useState<'overwrite' | 'new' | null>(null);
  const [name, setName] = useState(currentVersionName);
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = () => {
    if (action === 'overwrite') {
      onSave('overwrite');
    } else if (action === 'new') {
      onSave('new', { name, description, tags });
    }
    onOpenChange(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save Resume Version</DialogTitle>
        </DialogHeader>

        {!action && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              How would you like to save this resume?
            </p>

            {currentVersionId && (
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto p-4"
                onClick={() => setAction('overwrite')}
              >
                <div className="text-left">
                  <div className="font-semibold mb-1">Overwrite Existing Version</div>
                  <div className="text-xs text-muted-foreground">
                    Update "{currentVersionName}" with current changes
                  </div>
                </div>
              </Button>
            )}

            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4"
              onClick={() => setAction('new')}
            >
              <div className="text-left">
                <div className="font-semibold mb-1">Create New Version</div>
                <div className="text-xs text-muted-foreground">
                  Save as a new resume version with custom details
                </div>
              </div>
            </Button>
          </div>
        )}

        {action === 'overwrite' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to overwrite "{currentVersionName}"? This will update it with your current selections.
            </p>
          </div>
        )}

        {action === 'new' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Resume Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Software Engineering - FAANG"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this resume version"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag"
                />
                <Button type="button" onClick={addTag} size="sm">Add</Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {action && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Back</Button>
            <Button onClick={handleSubmit}>
              {action === 'overwrite' ? 'Overwrite' : 'Create'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
