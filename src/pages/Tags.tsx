import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Tag } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Tags: React.FC = () => {
  const { data, updateData } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#3b82f6');

  const handleCreateTag = () => {
    setEditingTag(null);
    setTagName('');
    setTagColor('#3b82f6');
    setIsDialogOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setTagColor(tag.color || '#3b82f6');
    setIsDialogOpen(true);
  };

  const handleSaveTag = () => {
    if (!tagName.trim()) {
      toast({
        title: 'Error',
        description: 'Tag name is required',
        variant: 'destructive',
      });
      return;
    }

    if (editingTag) {
      const updatedTags = data.tags.map((t) =>
        t.id === editingTag.id ? { ...t, name: tagName, color: tagColor } : t
      );
      updateData({ tags: updatedTags });
      toast({ title: 'Tag updated successfully' });
    } else {
      const newTag: Tag = {
        id: crypto.randomUUID(),
        name: tagName,
        color: tagColor,
        createdAt: new Date().toISOString(),
      };
      updateData({ tags: [...data.tags, newTag] });
      toast({ title: 'Tag created successfully' });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteTag = (tagId: string) => {
    const updatedTags = data.tags.filter((t) => t.id !== tagId);
    updateData({ tags: updatedTags });
    toast({ title: 'Tag deleted successfully' });
  };

  const getTagUsage = (tagId: string) => {
    const bulletCount = data.bullets.filter((b) => b.tags.includes(tagId)).length;
    const resumeCount = data.resumes.filter((r) => r.tags.includes(tagId)).length;
    return { bulletCount, resumeCount };
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Tag Library"
        description="Organize your content with tags"
        action={{
          label: 'New Tag',
          icon: Plus,
          onClick: handleCreateTag,
        }}
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.tags.map((tag) => {
            const usage = getTagUsage(tag.id);
            return (
              <Card key={tag.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tag.color || '#3b82f6' }}
                      />
                      <span className="truncate">{tag.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTag(tag)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTag(tag.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Used in {usage.bulletCount} bullets</p>
                    <p>Used in {usage.resumeCount} resumes</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {data.tags.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No tags yet</h3>
            <p className="text-muted-foreground mb-4">
              Create tags to organize your resumes and bullets
            </p>
            <Button onClick={handleCreateTag}>
              <Plus className="mr-2 h-4 w-4" />
              Create Tag
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTag ? 'Edit Tag' : 'Create New Tag'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tag Name</Label>
              <Input
                id="name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g., AI, Design, Technical"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTag}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tags;
