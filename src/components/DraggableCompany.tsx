import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, ChevronDown, ChevronRight, GripVertical, Pencil, Trash2, Plus } from 'lucide-react';
import { Company } from '@/types';

interface DraggableCompanyProps {
  company: Company;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onVisibilityToggle: () => void;
  onAddPosition: () => void;
  children?: React.ReactNode;
}

export const DraggableCompany: React.FC<DraggableCompanyProps> = ({
  company,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  onVisibilityToggle,
  onAddPosition,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: company.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="border border-border rounded-lg">
      <div className="flex items-center gap-2 p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <Checkbox 
          checked={(company as any).isVisible !== false}
          onCheckedChange={onVisibilityToggle}
        />
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto hover:bg-transparent"
          onClick={onToggle}
        >
          {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
        <Briefcase className="h-5 w-5" />
        <span className="font-semibold flex-1">{company.name}</span>
        <span className="text-sm text-muted-foreground mr-2">{(company.positions || []).length} positions</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddPosition}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </div>
  );
};
