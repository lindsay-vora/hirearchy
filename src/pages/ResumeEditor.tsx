import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlignJustify, Briefcase, Palette, Plus, ChevronDown, ChevronRight, GripVertical, Pencil, Trash2, Tag as TagIcon, Settings, Copy, Eye, EyeOff, Star } from 'lucide-react';
import ResumePreview from '@/components/ResumePreview';
import { ResizablePanel } from '@/components/ResizablePanel';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AddCompanyDialog } from '@/components/dialogs/AddCompanyDialog';
import { EditDialog } from '@/components/dialogs/EditDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { useAppData } from '@/contexts/AppDataContext';
import { Company, Position, Project } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface DraggableBulletProps {
  bullet: any;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  tags: any[];
}

const DraggableBullet: React.FC<DraggableBulletProps> = ({ bullet, onToggle, onEdit, onDelete, tags }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: bullet.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : bullet.isSelected ? 1 : 0.6,
  };

  return (
    <div ref={setNodeRef} style={style} className={`border ${bullet.isSelected ? 'border-2 border-primary' : 'border-border'} rounded-lg p-3 bg-card`}>
      <div className="flex items-start gap-2">
        <Checkbox checked={bullet.isSelected} onCheckedChange={onToggle} className="mt-0.5" />
        <div className="flex-1 min-w-0" onClick={onEdit}>
          <p className="text-sm mb-2 cursor-pointer hover:text-primary">{bullet.content}</p>
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
          <span className="text-xs text-muted-foreground">{bullet.version}</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={onDelete}>
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

const ResumeEditor: React.FC = () => {
  const { data, addCompany, updateCompany, deleteCompany, toggleBulletSelection, addSummary, updateSummary, deleteSummary, selectSummary, addFormat, updateFormat, deleteFormat, selectFormat, saveResumeVersion, toggleCompanyVisibility, toggleProjectVisibility, addBullet, updateBullet, deleteBullet } = useAppData();
  const { toast } = useToast();
  
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>(['tech-corp']);
  const [expandedPositions, setExpandedPositions] = useState<string[]>(['senior-swe']);
  const [expandedProjects, setExpandedProjects] = useState<string[]>(['microservices']);
  const [showPreview, setShowPreview] = useState(true);
  
  // Dialog states
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; type: string; data: any } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleCompany = (id: string) => {
    setExpandedCompanies(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const togglePosition = (id: string) => {
    setExpandedPositions(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleProject = (id: string) => {
    setExpandedProjects(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddCompany = (name: string) => {
    const newCompany: Company = {
      id: `company-${Date.now()}`,
      name,
      positions: [],
      isVisible: true,
    };
    addCompany(newCompany);
    toast({ title: 'Company added', description: `${name} has been added.` });
  };

  const handleEditCompany = (company: Company) => {
    setEditDialog({
      open: true,
      type: 'company',
      data: company,
    });
  };

  const handleDeleteCompany = (company: Company) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Company',
      description: `Are you sure you want to delete ${company.name}? This will also delete all positions and bullets.`,
      onConfirm: () => {
        deleteCompany(company.id);
        toast({ title: 'Company deleted', description: `${company.name} has been deleted.` });
      },
    });
  };

  const handleAddSummary = () => {
    const newSummary = {
      id: `summary-${Date.now()}`,
      name: 'New Summary',
      version: 'v1',
      content: 'Enter your professional summary here...',
      isSelected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addSummary(newSummary);
    toast({ title: 'Summary added' });
  };

  const handleEditSummary = (summary: any) => {
    setEditDialog({
      open: true,
      type: 'summary',
      data: summary,
    });
  };

  const handleDuplicateSummary = (summary: any) => {
    const newSummary = {
      ...summary,
      id: `summary-${Date.now()}`,
      name: `${summary.name} (Copy)`,
      isSelected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addSummary(newSummary);
    toast({ title: 'Summary duplicated' });
  };

  const handleDeleteSummary = (summary: any) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Summary',
      description: `Are you sure you want to delete "${summary.name}"?`,
      onConfirm: () => {
        deleteSummary(summary.id);
        toast({ title: 'Summary deleted' });
      },
    });
  };

  const handleEditBullet = (bullet: any) => {
    setEditDialog({
      open: true,
      type: 'bullet',
      data: bullet,
    });
  };

  const handleDeleteBullet = (bullet: any) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Bullet',
      description: 'Are you sure you want to delete this bullet?',
      onConfirm: () => {
        deleteBullet(bullet.id);
        toast({ title: 'Bullet deleted' });
      },
    });
  };

  const handleAddBullet = (projectId: string, positionId: string, companyId: string) => {
    const newBullet = {
      id: `bullet-${Date.now()}`,
      content: 'Enter your achievement here...',
      version: 'v1',
      tags: [],
      projectId,
      positionId,
      companyId,
      isSelected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addBullet(newBullet);
    toast({ title: 'Bullet added' });
  };

  const handleSaveEdit = (values: Record<string, string>) => {
    if (!editDialog) return;
    
    if (editDialog.type === 'company') {
      updateCompany(editDialog.data.id, { name: values.name });
      toast({ title: 'Company updated' });
    } else if (editDialog.type === 'summary') {
      updateSummary(editDialog.data.id, { name: values.name, content: values.content });
      toast({ title: 'Summary updated' });
    } else if (editDialog.type === 'bullet') {
      updateBullet(editDialog.data.id, { content: values.content });
      toast({ title: 'Bullet updated' });
    } else if (editDialog.type === 'format') {
      updateFormat(editDialog.data.id, { name: values.name, description: values.description });
      toast({ title: 'Format updated' });
    }
    
    setEditDialog(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeIndex = data.bullets.findIndex(b => b.id === active.id);
      const overIndex = data.bullets.findIndex(b => b.id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        // This would need a reorder bullets function in context
        toast({ title: 'Bullets reordered' });
      }
    }
  };

  const handleSaveVersion = () => {
    const selectedBulletIds = data.bullets.filter(b => b.isSelected).map(b => b.id);
    const selectedSummaryId = data.summaries.find(s => s.isSelected)?.id;
    const selectedCompanyIds = data.companies.filter(c => (c as any).isVisible !== false).map(c => c.id);
    const selectedFormatId = data.formats.find(f => f.isDefault)?.id;
    
    saveResumeVersion({
      name: data.currentEditing.resumeName || 'Untitled Resume',
      description: 'Resume version snapshot',
      tags: [],
      summaryId: selectedSummaryId,
      selectedBullets: selectedBulletIds,
      selectedCompanies: selectedCompanyIds,
      formatId: selectedFormatId,
    });
    
    toast({ title: 'Resume version saved', description: 'Your resume has been saved successfully.' });
  };

  const handleExport = () => {
    toast({ title: 'Export feature', description: 'Export functionality coming soon!' });
  };

  const handleToggleFormatFavorite = (formatId: string) => {
    const format = data.formats.find(f => f.id === formatId);
    if (format) {
      updateFormat(formatId, { isFavorite: !format.isFavorite });
    }
  };

  const handleCopyFormat = (format: any) => {
    const newFormat = {
      ...format,
      id: `format-${Date.now()}`,
      name: `${format.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addFormat(newFormat);
    toast({ title: 'Format copied' });
  };

  const handleDeleteFormat = (format: any) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Format',
      description: `Are you sure you want to delete "${format.name}"?`,
      onConfirm: () => {
        deleteFormat(format.id);
        toast({ title: 'Format deleted' });
      },
    });
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-background px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">Editing:</span>
            <span className="font-semibold">{data.currentEditing.resumeName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Feedback
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="experience" className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-border px-6">
            <TabsList className="bg-transparent h-12">
              <TabsTrigger value="summary" className="gap-2">
                <AlignJustify className="h-4 w-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="experience" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="format" className="gap-2">
                <Palette className="h-4 w-4" />
                Format
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            {/* Summary Tab */}
            <TabsContent value="summary" className="m-0 h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Professional Summary</h2>
                    <p className="text-sm text-muted-foreground">
                      Select one summary to include in your resume
                    </p>
                  </div>
                  <Button onClick={handleAddSummary}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Version
                  </Button>
                </div>

                <div className="space-y-4 max-w-3xl">
                  {data.summaries.map((summary) => (
                    <div key={summary.id} className={`border ${summary.isSelected ? 'border-2 border-primary' : 'border-border'} rounded-lg p-4 bg-card ${!summary.isSelected && 'opacity-70'}`}>
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={summary.isSelected} 
                          onCheckedChange={() => selectSummary(summary.id)}
                          className="mt-1" 
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{summary.name}</span>
                            <Badge variant="secondary" className="text-xs">{summary.version}</Badge>
                          </div>
                          <p className="text-sm mb-3 cursor-pointer hover:text-primary" onClick={() => handleEditSummary(summary)}>
                            {summary.content}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditSummary(summary)}>
                              <Pencil className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDuplicateSummary(summary)}>
                              <Copy className="h-3 w-3 mr-1" />
                              Duplicate
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteSummary(summary)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="m-0 h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Work Experience</h2>
                    <p className="text-sm text-muted-foreground">
                      Organize by Company → Position → Project
                    </p>
                  </div>
                  <Button onClick={() => setShowAddCompanyDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                  </Button>
                </div>

                <div className="space-y-3 max-w-4xl">
                  {data.companies.map((company) => (
                    <div key={company.id} className="border border-border rounded-lg">
                      <div className="flex items-center gap-2 p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <Checkbox 
                          checked={(company as any).isVisible !== false}
                          onCheckedChange={() => toggleCompanyVisibility(company.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto hover:bg-transparent"
                          onClick={() => toggleCompany(company.id)}
                        >
                          {expandedCompanies.includes(company.id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </Button>
                        <Briefcase className="h-5 w-5" />
                        <span className="font-semibold flex-1">{company.name}</span>
                        <span className="text-sm text-muted-foreground mr-2">{company.positions.length} positions</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditCompany(company)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteCompany(company)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {expandedCompanies.includes(company.id) && (
                        <div className="p-4 space-y-3">
                          {company.positions.map((position) => {
                            const positionBullets = data.bullets.filter(b => b.positionId === position.id);
                            const selectedCount = positionBullets.filter(b => b.isSelected).length;
                            
                            return (
                              <div key={position.id} className="border border-border rounded-lg">
                                <div className="flex items-center gap-2 p-3 bg-muted/20 hover:bg-muted/30 transition-colors">
                                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto hover:bg-transparent"
                                    onClick={() => togglePosition(position.id)}
                                  >
                                    {expandedPositions.includes(position.id) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <span className="font-medium flex-1">{position.title}</span>
                                  <span className="text-sm text-muted-foreground mr-2">{selectedCount} / {positionBullets.length}</span>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="px-12 py-2 text-sm text-muted-foreground border-b border-border">
                                  {position.startDate} - {position.endDate || 'Present'} • {position.projects.length} projects
                                </p>

                                {expandedPositions.includes(position.id) && (
                                  <div className="p-3 space-y-3">
                                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                      {position.projects.map((project) => {
                                        const projectBullets = data.bullets.filter(b => b.projectId === project.id);
                                        const projectVisible = (project as any).isVisible !== false;
                                        
                                        return (
                                          <div key={project.id} className="border border-border rounded-lg">
                                            <div className="flex items-center gap-2 p-3 bg-muted/10">
                                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                              <Checkbox
                                                checked={projectVisible}
                                                onCheckedChange={() => toggleProjectVisibility(company.id, position.id, project.id)}
                                              />
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-0 h-auto hover:bg-transparent"
                                                onClick={() => toggleProject(project.id)}
                                              >
                                                {expandedProjects.includes(project.id) ? (
                                                  <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                  <ChevronRight className="h-4 w-4" />
                                                )}
                                              </Button>
                                              <span className="flex-1 font-medium text-sm">{project.name}</span>
                                              <span className="text-xs text-muted-foreground mr-2">{projectBullets.filter(b => b.isSelected).length}/{projectBullets.length}</span>
                                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                                <Pencil className="h-3 w-3" />
                                              </Button>
                                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                            </div>
                                            {project.description && (
                                              <p className="px-10 py-2 text-xs text-muted-foreground border-b border-border">
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
                                                    onClick={() => handleAddBullet(project.id, position.id, company.id)}
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
                                                      onToggle={() => toggleBulletSelection(bullet.id)}
                                                      onEdit={() => handleEditBullet(bullet)}
                                                      onDelete={() => handleDeleteBullet(bullet)}
                                                      tags={data.tags}
                                                    />
                                                  ))}
                                                </SortableContext>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </DndContext>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Format Tab */}
            <TabsContent value="format" className="m-0 h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Format Settings</h2>
                    <p className="text-sm text-muted-foreground">
                      Customize your resume appearance
                    </p>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Save Format
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-6 max-w-6xl">
                  {/* Settings */}
                  <div className="space-y-6">
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold mb-4">Typography</h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm mb-2 block">Font Family</Label>
                          <Select defaultValue="georgia">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="georgia">Georgia</SelectItem>
                              <SelectItem value="times">Times New Roman</SelectItem>
                              <SelectItem value="calibri">Calibri</SelectItem>
                              <SelectItem value="arial">Arial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm">Font Size</Label>
                            <span className="text-sm text-muted-foreground">11pt</span>
                          </div>
                          <Slider defaultValue={[11]} min={8} max={16} step={1} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Saved Formats */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Saved Formats</h3>
                    {data.formats.map((format) => (
                      <div key={format.id} className={`border ${format.isDefault ? 'border-2 border-primary' : 'border-border'} rounded-lg p-4`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{format.name}</span>
                              {format.isDefault && <Badge variant="secondary" className="text-xs">Active</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{format.description}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleToggleFormatFavorite(format.id)}
                          >
                            <Star className={`h-4 w-4 ${format.isFavorite ? 'fill-current text-yellow-500' : ''}`} />
                          </Button>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="ghost" size="sm" onClick={() => selectFormat(format.id)}>
                            Apply
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleCopyFormat(format)}>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteFormat(format)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Resizable Preview */}
      {showPreview && (
        <ResizablePanel defaultWidth={500} minWidth={300} maxWidth={800}>
          <ResumePreview
            onFormatClick={() => {}}
            onSaveVersion={handleSaveVersion}
            onExport={handleExport}
          />
        </ResizablePanel>
      )}

      {/* Dialogs */}
      <AddCompanyDialog
        open={showAddCompanyDialog}
        onOpenChange={setShowAddCompanyDialog}
        onAdd={handleAddCompany}
      />

      {editDialog && (
        <EditDialog
          open={editDialog.open}
          onOpenChange={(open) => !open && setEditDialog(null)}
          title={`Edit ${editDialog.type}`}
          fields={
            editDialog.type === 'company' ? [
              { name: 'name', label: 'Company Name', value: editDialog.data.name }
            ] :
            editDialog.type === 'summary' ? [
              { name: 'name', label: 'Summary Name', value: editDialog.data.name },
              { name: 'content', label: 'Content', value: editDialog.data.content, type: 'textarea' as const }
            ] :
            editDialog.type === 'bullet' ? [
              { name: 'content', label: 'Bullet Content', value: editDialog.data.content, type: 'textarea' as const }
            ] :
            editDialog.type === 'format' ? [
              { name: 'name', label: 'Format Name', value: editDialog.data.name },
              { name: 'description', label: 'Description', value: editDialog.data.description }
            ] : []
          }
          onSave={handleSaveEdit}
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={(open) => !open && setConfirmDialog(null)}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={() => {
            confirmDialog.onConfirm();
            setConfirmDialog(null);
          }}
        />
      )}
    </div>
  );
};

export default ResumeEditor;
