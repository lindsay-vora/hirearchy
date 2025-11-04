import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Plus, Copy, Trash2, Edit, FileText } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Resume } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TagBadge from '@/components/TagBadge';
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

const Resumes: React.FC = () => {
  const { data, updateData } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [resumeName, setResumeName] = useState('');

  const handleCreateResume = () => {
    setEditingResume(null);
    setResumeName('');
    setIsDialogOpen(true);
  };

  const handleEditResume = (resume: Resume) => {
    setEditingResume(resume);
    setResumeName(resume.name);
    setIsDialogOpen(true);
  };

  const handleSaveResume = () => {
    if (!resumeName.trim()) {
      toast({
        title: 'Error',
        description: 'Resume name is required',
        variant: 'destructive',
      });
      return;
    }

    if (editingResume) {
      const updatedResumes = data.resumes.map((r) =>
        r.id === editingResume.id
          ? { ...r, name: resumeName, updatedAt: new Date().toISOString() }
          : r
      );
      updateData({ resumes: updatedResumes });
      toast({ title: 'Resume updated successfully' });
    } else {
      const newResume: Resume = {
        id: crypto.randomUUID(),
        name: resumeName,
        tags: [],
        jobs: [],
        bullets: [],
        education: [],
        certifications: [],
        software: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updateData({ resumes: [...data.resumes, newResume] });
      toast({ title: 'Resume created successfully' });
    }

    setIsDialogOpen(false);
  };

  const handleDuplicateResume = (resume: Resume) => {
    const newResume: Resume = {
      ...resume,
      id: crypto.randomUUID(),
      name: `${resume.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateData({ resumes: [...data.resumes, newResume] });
    toast({ title: 'Resume duplicated successfully' });
  };

  const handleDeleteResume = (resumeId: string) => {
    const updatedResumes = data.resumes.filter((r) => r.id !== resumeId);
    updateData({ resumes: updatedResumes });
    toast({ title: 'Resume deleted successfully' });
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Resume Versions"
        description="Create and manage multiple versions of your resume"
        action={{
          label: 'New Resume',
          icon: Plus,
          onClick: handleCreateResume,
        }}
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{resume.name}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditResume(resume)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicateResume(resume)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteResume(resume.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resume.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {resume.tags.map((tagId) => {
                        const tag = data.tags.find((t) => t.id === tagId);
                        return tag ? (
                          <TagBadge key={tagId} label={tag.name} color={tag.color} />
                        ) : null;
                      })}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    <p>{resume.jobs.length} jobs</p>
                    <p>{resume.bullets.length} bullets</p>
                    <p className="mt-2">
                      Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {data.resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first resume to get started
            </p>
            <Button onClick={handleCreateResume}>
              <Plus className="mr-2 h-4 w-4" />
              Create Resume
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingResume ? 'Edit Resume' : 'Create New Resume'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Resume Name</Label>
              <Input
                id="name"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="e.g., Technical Program Manager - Google"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveResume}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Resumes;
