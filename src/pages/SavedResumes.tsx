import React from 'react';
import { Search, Star, Copy, Trash2, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const SavedResumes: React.FC = () => {
  const resumes = [
    {
      id: '1',
      name: 'Software Engineering - FAANG',
      description: 'Focused on technical skills and architecture for large tech companies',
      isDefault: true,
      tags: ['Backend', 'Leadership', 'Cloud'],
      bullets: 8,
      companies: 2,
      positions: 3,
      summary: 'Technical Leadership',
      created: 'Nov 1, 2025',
      modified: '2 hours ago',
    },
    {
      id: '2',
      name: 'Tech Leadership - Startup',
      description: 'Emphasizes team leadership and project management for startup roles',
      isDefault: false,
      tags: ['Leadership', 'Frontend'],
      bullets: 7,
      companies: 2,
      positions: 2,
      summary: 'Full Stack Focus',
      created: 'Oct 28, 2025',
      modified: '1 day ago',
    },
    {
      id: '3',
      name: 'Full Stack Developer',
      description: 'Highlights both frontend and backend experience',
      isDefault: false,
      tags: ['Backend', 'Frontend', 'DevOps'],
      bullets: 9,
      companies: 2,
      positions: 3,
      summary: 'Architecture & DevOps',
      created: 'Oct 25, 2025',
      modified: '3 days ago',
    },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Saved Resume Versions</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Editing:</span>
              <span className="font-semibold text-foreground">Software Engineering - FAANG</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage all your saved resume configurations
          </p>
        </div>

        <Input
          placeholder="Search resumes by name, description, or tags..."
          className="mb-6 max-w-xl"
        />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Versions</p>
            <p className="text-3xl font-bold">4</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Default Resume</p>
            <p className="text-lg font-semibold">Software Engineering - FAANG</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Last Modified</p>
            <p className="text-lg font-semibold">2 hours ago</p>
          </div>
        </div>

        <div className="space-y-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <FileText className="h-5 w-5 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{resume.name}</h3>
                    {resume.isDefault && (
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{resume.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {resume.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{resume.bullets} bullets</span>
                    <span>•</span>
                    <span>{resume.companies} companies</span>
                    <span>•</span>
                    <span>{resume.positions} positions</span>
                    <span>•</span>
                    <span>Summary: {resume.summary}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span>Created {resume.created}</span>
                    <span>•</span>
                    <span>Modified {resume.modified}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!resume.isDefault && (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button className="ml-2">
                    <Eye className="h-4 w-4 mr-2" />
                    Load
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedResumes;
