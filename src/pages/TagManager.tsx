import React, { useState } from 'react';
import { Plus, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const TagManager: React.FC = () => {
  const [tags, setTags] = useState([
    { id: '1', name: 'Leadership', color: '#3b82f6' },
    { id: '2', name: 'Backend', color: '#22c55e' },
    { id: '3', name: 'Frontend', color: '#a855f7' },
    { id: '4', name: 'Cloud', color: '#f97316' },
    { id: '5', name: 'DevOps', color: '#ec4899' },
    { id: '6', name: 'Mobile', color: '#06b6d4' },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingTag, setEditingTag] = useState<{ id: string; name: string; color: string } | null>(null);
  const [deleteTagId, setDeleteTagId] = useState<string | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#3b82f6');

  const handleAddTag = () => {
    if (tagName.trim()) {
      const newTag = {
        id: Date.now().toString(),
        name: tagName,
        color: tagColor,
      };
      setTags([...tags, newTag]);
      setTagName('');
      setTagColor('#3b82f6');
      setShowAddDialog(false);
    }
  };

  const handleEditTag = (tag: { id: string; name: string; color: string }) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setTagColor(tag.color);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editingTag && tagName.trim()) {
      setTags(tags.map(tag =>
        tag.id === editingTag.id
          ? { ...tag, name: tagName, color: tagColor }
          : tag
      ));
      setEditingTag(null);
      setTagName('');
      setTagColor('#3b82f6');
      setShowEditDialog(false);
    }
  };

  const handleDeleteClick = (tagId: string) => {
    setDeleteTagId(tagId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTagId) {
      setTags(tags.filter(tag => tag.id !== deleteTagId));
      setDeleteTagId(null);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Tags</h1>
          <p className="text-sm text-muted-foreground">Categorize your resume content</p>
        </div>

        <div className="mb-6">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h2 className="font-semibold mb-4">Manage Tags</h2>
          <div className="space-y-3">
            {tags.map(tag => (
              <div
                key={tag.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="flex-1 font-medium">{tag.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleEditTag(tag)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeleteClick(tag.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Tag Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Tag Name</Label>
              <Input
                id="tag-name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g., Leadership, Backend, Design"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag-color">Tag Color</Label>
              <Input
                id="tag-color"
                type="color"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTag}>Add Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tag-name">Tag Name</Label>
              <Input
                id="edit-tag-name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g., Leadership, Backend, Design"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tag-color">Tag Color</Label>
              <Input
                id="edit-tag-color"
                type="color"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tag? This action cannot be undone.
              The tag will be removed from all bullets and resumes that use it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TagManager;
