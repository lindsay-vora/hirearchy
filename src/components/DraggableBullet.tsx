import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Bullet, Tag } from '@/types';

interface DraggableBulletProps {
  bullet: Bullet;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onVersionChange: (version: string) => void;
  tags: Tag[];
}

export const DraggableBullet: React.FC<DraggableBulletProps> = ({
  bullet,
  onToggle,
  onEdit,
  onDelete,
  onVersionChange,
  tags,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: bullet.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : bullet.isSelected ? 1 : 0.6,
  };

  const currentVersion = bullet.selectedVersion || bullet.version;
  const versionData = bullet.versions?.find((v: any) => v.version === currentVersion) || { content: bullet.content };

  return (
    <div ref={setNodeRef} style={style} className={`border ${bullet.isSelected ? 'border-2 border-primary' : 'border-border'} rounded-lg p-3 bg-card`}>
      <div className="flex items-start gap-2">
        <Checkbox checked={bullet.isSelected} onCheckedChange={onToggle} className="mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm mb-2">{versionData.content}</p>
          <div className="flex flex-wrap items-center gap-1 mb-2">
            {bullet.tags.map((tagName: string) => {
              const tag = tags.find(t => t.name === tagName);
              return (
                <Badge key={tagName} variant="secondary" className="text-xs">
                  {tag && <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: tag.color }}></span>}
                  {tagName}
                </Badge>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            {bullet.versions && bullet.versions.length > 1 && (
              <Select value={currentVersion} onValueChange={onVersionChange}>
                <SelectTrigger className="h-6 text-xs w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bullet.versions.map((v: any) => (
                    <SelectItem key={v.version} value={v.version} className="text-xs">
                      {v.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {(!bullet.versions || bullet.versions.length <= 1) && (
              <span className="text-xs text-muted-foreground">{bullet.version}</span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onEdit}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};
