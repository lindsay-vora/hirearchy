import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, GripVertical, Pencil, Trash2, Plus } from 'lucide-react';
import { Position, Company, Bullet, Tag } from '@/types';
import { DraggableBullet } from '@/components/DraggableBullet';

interface DraggablePositionProps {
  position: Position;
  company: Company;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  bullets: Bullet[];
  tags: Tag[];
  onAddBullet: (projectId: string, positionId: string, companyId: string) => void;
  onEditBullet: (bullet: Bullet) => void;
  onDeleteBullet: (bullet: Bullet) => void;
  onToggleBullet: (bulletId: string) => void;
  onBulletVersionChange: (bulletId: string, version: string) => void;
  expandedProjects: string[];
  onToggleProject: (projectId: string) => void;
  onToggleProjectVisibility: (companyId: string, positionId: string, projectId: string) => void;
  onEditProject: (project: any, positionId: string, companyId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onAddProject: () => void;
  onBulletDragEnd: (bullets: Bullet[]) => void;
  sensors: any;
}

export const DraggablePosition: React.FC<DraggablePositionProps> = ({
  position,
  company,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  bullets,
  tags,
  onAddBullet,
  onEditBullet,
  onDeleteBullet,
  onToggleBullet,
  onBulletVersionChange,
  expandedProjects,
  onToggleProject,
  onToggleProjectVisibility,
  onEditProject,
  onDeleteProject,
  onAddProject,
  onBulletDragEnd,
  sensors,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: position.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const positionBullets = bullets.filter(b => b.positionId === position.id);
  const selectedCount = positionBullets.filter(b => b.isSelected).length;
  const projects = position.projects || [];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeIndex = bullets.findIndex(b => b.id === active.id);
      const overIndex = bullets.findIndex(b => b.id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        const newBullets = [...bullets];
        const [removed] = newBullets.splice(activeIndex, 1);
        newBullets.splice(overIndex, 0, removed);
        onBulletDragEnd(newBullets);
      }
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="border border-border rounded-lg">
      <div className="flex items-start gap-2 p-3 bg-muted/20 hover:bg-muted/30 transition-colors">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto hover:bg-transparent"
              onClick={onToggle}
            >
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <div className="font-semibold text-sm">{company.name}</div>
              <div className="font-medium">{position.title}</div>
            </div>
            <span className="text-sm text-muted-foreground mr-2">{selectedCount} / {positionBullets.length}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddProject}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground ml-6">
            {position.startDate} - {position.endDate || 'Present'} • {projects.length} projects
          </p>
        </div>
      </div>

      {expanded && (
        <div className="p-3 space-y-3">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
              {projects.map((project) => {
                const projectBullets = bullets.filter(b => b.projectId === project.id);
                const projectVisible = (project as any).isVisible !== false;
                
                return (
                  <div key={project.id} className="border border-border rounded-lg bg-card ml-6">
                    <div className="flex items-center gap-2 p-3 bg-muted/10">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <Checkbox
                        checked={projectVisible}
                        onCheckedChange={() => onToggleProjectVisibility(company.id, position.id, project.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto hover:bg-transparent"
                        onClick={() => onToggleProject(project.id)}
                      >
                        {expandedProjects.includes(project.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="flex-1 font-medium text-sm italic">{project.name}</span>
                      <span className="text-xs text-muted-foreground mr-2">
                        {projectBullets.filter(b => b.isSelected).length}/{projectBullets.length}
                      </span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditProject(project, position.id, company.id)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDeleteProject(project.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    {project.description && (
                      <p className="px-10 py-2 text-xs text-muted-foreground border-b border-border italic">
                        {project.description}
                      </p>
                    )}

                    {expandedProjects.includes(project.id) && (
                      <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">Bullet Points</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => onAddBullet(project.id, position.id, company.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Bullet
                          </Button>
                        </div>

                        <SortableContext items={projectBullets.map(b => b.id)} strategy={verticalListSortingStrategy}>
                          {projectBullets.map((bullet) => (
                            <DraggableBullet
                              key={bullet.id}
                              bullet={bullet}
                              onToggle={() => onToggleBullet(bullet.id)}
                              onEdit={() => onEditBullet(bullet)}
                              onDelete={() => onDeleteBullet(bullet)}
                              onVersionChange={(version: string) => onBulletVersionChange(bullet.id, version)}
                              tags={tags}
                            />
                          ))}
                        </SortableContext>
                      </div>
                    )}
                  </div>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};
