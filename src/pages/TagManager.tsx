import React from 'react';
import { Plus, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TagManager: React.FC = () => {
  const tags = [
    { id: '1', name: 'Leadership', color: '#3b82f6' },
    { id: '2', name: 'Backend', color: '#22c55e' },
    { id: '3', name: 'Frontend', color: '#a855f7' },
    { id: '4', name: 'Cloud', color: '#f97316' },
    { id: '5', name: 'DevOps', color: '#ec4899' },
    { id: '6', name: 'Mobile', color: '#06b6d4' },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Tags</h1>
          <p className="text-sm text-muted-foreground">Categorize your resume content</p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {tags.slice(0, 3).map(tag => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="gap-1 pr-1"
              style={{ backgroundColor: tag.color + '20', color: tag.color }}
            >
              {tag.name}
              <button className="ml-1 rounded-sm hover:bg-muted">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4 mr-1" />
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
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="flex-1 font-medium">{tag.name}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagManager;
