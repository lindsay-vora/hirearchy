import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlignJustify, Briefcase, Plus, ChevronDown, ChevronRight, GripVertical, Pencil, Trash2, Tag as TagIcon, Copy, Eye, EyeOff, GraduationCap } from 'lucide-react';
import ResumePreview from '@/components/ResumePreview';
import { ResizablePanel } from '@/components/ResizablePanel';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AddCompanyDialog } from '@/components/dialogs/AddCompanyDialog';
import { EditDialog } from '@/components/dialogs/EditDialog';
import { EditBulletDialog } from '@/components/dialogs/EditBulletDialog';
import { EditSummaryDialog } from '@/components/dialogs/EditSummaryDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { DraggableCompany } from '@/components/DraggableCompany';
import { DatePicker } from '@/components/dialogs/DatePickerDialog';
import { DraggablePosition } from '@/components/DraggablePosition';
import { useAppData } from '@/contexts/AppDataContext';
import { Company, Position, Project } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface DraggableBulletProps {
  bullet: any;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onVersionChange: (version: string) => void;
  tags: any[];
}

const DraggableBullet: React.FC<DraggableBulletProps> = ({ bullet, onToggle, onEdit, onDelete, onVersionChange, tags }) => {
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

const ResumeEditor: React.FC = () => {
  const { data, addCompany, updateCompany, deleteCompany, reorderCompanies, toggleBulletSelection, reorderBullets, addSummary, updateSummary, saveNewSummaryVersion, deleteSummary, selectSummary, toggleCompanyVisibility, toggleProjectVisibility, addBullet, updateBullet, deleteBullet, addEducation, updateEducation, deleteEducation, addSkill, updateSkill, deleteSkill, addCertification, updateCertification, deleteCertification, addPosition, updatePosition, deletePosition, addProject, deleteProject } = useAppData();
  const { toast } = useToast();
  
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>(['tech-corp']);
  const [expandedPositions, setExpandedPositions] = useState<string[]>(['senior-swe']);
  const [expandedProjects, setExpandedProjects] = useState<string[]>(['microservices']);
  const [showPreview, setShowPreview] = useState(true);
  
  // Dialog states
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; type: string; data: any } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void } | null>(null);
  const [bulletEditDialog, setBulletEditDialog] = useState<{ open: boolean; bullet: any } | null>(null);
  const [summaryEditDialog, setSummaryEditDialog] = useState<{ open: boolean; summary: any } | null>(null);

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
      versions: [
        { version: 'v1', content: 'Enter your professional summary here...', tags: [], createdAt: new Date().toISOString() }
      ],
      selectedVersion: 'v1',
      tags: [],
      isSelected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addSummary(newSummary);
    toast({ title: 'Summary added' });
  };

  const handleEditSummary = (summary: any) => {
    setSummaryEditDialog({ open: true, summary });
  };

  const handleSaveSummary = (summaryId: string, content: string, versionTags: string[], selectedVersion?: string) => {
    updateSummary(summaryId, content, versionTags, selectedVersion);
    toast({ title: 'Summary updated' });
  };

  const handleSaveNewSummaryVersion = (summaryId: string, content: string, versionTags: string[]) => {
    saveNewSummaryVersion(summaryId, content, versionTags);
    toast({ title: 'New summary version created' });
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
    setBulletEditDialog({
      open: true,
      bullet,
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
      versions: [
        { version: 'v1', content: 'Enter your achievement here...', tags: [], createdAt: new Date().toISOString() }
      ],
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
      // Note: Summary editing is now handled by EditSummaryDialog
      toast({ title: 'Summary updated' });
    } else if (editDialog.type === 'bullet') {
      updateBullet(editDialog.data.id, { content: values.content });
      toast({ title: 'Bullet updated' });
    } else if (editDialog.type === 'position') {
      updatePosition(editDialog.data.companyId, editDialog.data.id, { title: values.title, startDate: values.startDate, endDate: values.endDate || undefined });
      toast({ title: 'Position updated' });
    } else if (editDialog.type === 'project') {
      // Update project within position
      const company = (data.companies || []).find(c => c.id === editDialog.data.companyId);
      if (company) {
        const position = (company.positions || []).find(p => p.id === editDialog.data.positionId);
        if (position) {
          const updatedProjects = position.projects.map(proj =>
            proj.id === editDialog.data.id
              ? { ...proj, name: values.name, description: values.description }
              : proj
          );
          updatePosition(editDialog.data.companyId, editDialog.data.positionId, { projects: updatedProjects });
          toast({ title: 'Project updated' });
        }
      }
    } else if (editDialog.type === 'education') {
      updateEducation(editDialog.data.id, { 
        degree: values.degree, 
        institution: values.institution,
        startDate: values.startDate,
        endDate: values.endDate || undefined,
        description: values.description
      });
      toast({ title: 'Education updated' });
    } else if (editDialog.type === 'skill') {
      updateSkill(editDialog.data.id, { name: values.name, category: values.category });
      toast({ title: 'Skill updated' });
    } else if (editDialog.type === 'certification') {
      updateCertification(editDialog.data.id, { name: values.name, issuer: values.issuer, date: values.date });
      toast({ title: 'Certification updated' });
    }
    
    setEditDialog(null);
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEducation = {
      id: `edu-${Date.now()}`,
      degree: 'Bachelor of Science',
      institution: 'University Name',
      startDate: '2016',
      endDate: '2020',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addEducation(newEducation);
    toast({ title: 'Education added' });
  };

  const handleEditEducation = (education: any) => {
    setEditDialog({
      open: true,
      type: 'education',
      data: education,
    });
  };

  const handleDeleteEducation = (education: any) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Education',
      description: `Are you sure you want to delete this education entry?`,
      onConfirm: () => {
        deleteEducation(education.id);
        toast({ title: 'Education deleted' });
      },
    });
  };

  // Skill handlers
  const handleAddSkill = () => {
    const newSkill = {
      id: `skill-${Date.now()}`,
      name: 'New Skill',
      category: '',
      createdAt: new Date().toISOString(),
    };
    addSkill(newSkill);
    toast({ title: 'Skill added' });
  };

  const handleEditSkill = (skill: any) => {
    setEditDialog({
      open: true,
      type: 'skill',
      data: skill,
    });
  };

  const handleDeleteSkill = (skill: any) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Skill',
      description: `Are you sure you want to delete "${skill.name}"?`,
      onConfirm: () => {
        deleteSkill(skill.id);
        toast({ title: 'Skill deleted' });
      },
    });
  };

  // Certification handlers
  const handleAddCertification = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: 'Certification Name',
      issuer: 'Issuing Organization',
      date: new Date().getFullYear().toString(),
      createdAt: new Date().toISOString(),
    };
    addCertification(newCert);
    toast({ title: 'Certification added' });
  };

  const handleEditCertification = (cert: any) => {
    setEditDialog({
      open: true,
      type: 'certification',
      data: cert,
    });
  };

  const handleDeleteCertification = (cert: any) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Certification',
      description: `Are you sure you want to delete "${cert.name}"?`,
      onConfirm: () => {
        deleteCertification(cert.id);
        toast({ title: 'Certification deleted' });
      },
    });
  };

  // Position handlers
  const handleAddPosition = (companyId: string) => {
    const newPosition: Position = {
      id: `pos-${Date.now()}`,
      title: 'Job Title',
      startDate: '2020-01',
      endDate: undefined,
      projects: [],
    };
    addPosition(companyId, newPosition);
    toast({ title: 'Position added' });
  };

  const handleEditPosition = (position: Position, companyId: string) => {
    setEditDialog({
      open: true,
      type: 'position',
      data: { ...position, companyId },
    });
  };

  const handleDeletePosition = (positionId: string, companyId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Position',
      description: 'Are you sure you want to delete this position? This will also delete all projects and bullets.',
      onConfirm: () => {
        deletePosition(companyId, positionId);
        toast({ title: 'Position deleted' });
      },
    });
  };

  // Project handlers
  const handleAddProject = (positionId: string, companyId: string) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      name: 'New Project',
      description: '',
      bulletCount: 0,
      isVisible: true,
    };
    addProject(companyId, positionId, newProject);
    toast({ title: 'Project added' });
  };

  const handleEditProject = (project: Project, positionId: string, companyId: string) => {
    setEditDialog({
      open: true,
      type: 'project',
      data: { ...project, positionId, companyId },
    });
  };

  const handleDeleteProject = (companyId: string, positionId: string, projectId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Project',
      description: 'Are you sure you want to delete this project? This will also delete all bullets.',
      onConfirm: () => {
        deleteProject(companyId, positionId, projectId);
        toast({ title: 'Project deleted' });
      },
    });
  };

  const handleCompanyDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = (data.companies || []).findIndex(c => c.id === active.id);
      const newIndex = (data.companies || []).findIndex(c => c.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(data.companies || [], oldIndex, newIndex);
        reorderCompanies(reordered);
        toast({ title: 'Companies reordered' });
      }
    }
  };

  const handlePositionDragEnd = (companyId: string) => (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const company = (data.companies || []).find(c => c.id === companyId);
      if (!company) return;
      
      const oldIndex = company.positions.findIndex(p => p.id === active.id);
      const newIndex = company.positions.findIndex(p => p.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(company.positions, oldIndex, newIndex);
        updateCompany(companyId, { positions: reordered });
        toast({ title: 'Positions reordered' });
      }
    }
  };

  const handleBulletDragEnd = (bullets: any[]) => {
    reorderBullets(bullets);
    toast({ title: 'Bullets reordered' });
  };

  const handleSaveBullet = (bulletId: string, content: string, versionTags: string[], selectedVersion?: string) => {
    const bullet = (data.bullets || []).find(b => b.id === bulletId);
    if (!bullet) return;

    const versionIndex = bullet.versions.findIndex(v => v.version === selectedVersion);
    if (versionIndex !== -1) {
      const updatedVersions = [...bullet.versions];
      updatedVersions[versionIndex] = { ...updatedVersions[versionIndex], content, tags: versionTags };
      updateBullet(bulletId, { versions: updatedVersions, content, tags: versionTags });
    }
    toast({ title: 'Bullet updated' });
  };

  const handleSaveNewBulletVersion = (bulletId: string, content: string, versionTags: string[]) => {
    updateBullet(bulletId, { content, tags: versionTags });
    toast({ title: 'New bullet version created' });
  };

  const handleExport = () => {
    toast({ title: 'Export feature', description: 'Export functionality coming soon!' });
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
              <TabsTrigger value="other" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Other
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
                  {(data.summaries || []).map((summary) => (
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
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCompanyDragEnd}>
                    <SortableContext items={(data.companies || []).map(c => c.id)} strategy={verticalListSortingStrategy}>
                      {(data.companies || []).map((company) => (
                        <DraggableCompany
                          key={company.id}
                          company={company}
                          expanded={expandedCompanies.includes(company.id)}
                          onToggle={() => toggleCompany(company.id)}
                          onEdit={() => handleEditCompany(company)}
                          onDelete={() => handleDeleteCompany(company)}
                          onVisibilityToggle={() => toggleCompanyVisibility(company.id)}
                          onAddPosition={() => handleAddPosition(company.id)}
                        >
                          {expandedCompanies.includes(company.id) && (
                            <div className="p-4 space-y-3">
                              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePositionDragEnd(company.id)}>
                                <SortableContext items={(company.positions || []).map(p => p.id)} strategy={verticalListSortingStrategy}>
                                  {(company.positions || []).map((position) => (
                                    <DraggablePosition
                                      key={position.id}
                                      position={position}
                                      company={company}
                                      expanded={expandedPositions.includes(position.id)}
                                      onToggle={() => togglePosition(position.id)}
                                      onEdit={() => handleEditPosition(position, company.id)}
                                      onDelete={() => handleDeletePosition(position.id, company.id)}
                                      bullets={data.bullets || []}
                                      tags={data.tags || []}
                                      onAddBullet={handleAddBullet}
                                      onEditBullet={handleEditBullet}
                                      onDeleteBullet={handleDeleteBullet}
                                      onToggleBullet={toggleBulletSelection}
                                      onBulletVersionChange={(bulletId, version) => {
                                        updateBullet(bulletId, { selectedVersion: version });
                                      }}
                                      expandedProjects={expandedProjects}
                                      onToggleProject={toggleProject}
                                      onToggleProjectVisibility={toggleProjectVisibility}
                                      onEditProject={handleEditProject}
                                      onDeleteProject={(projectId) => handleDeleteProject(company.id, position.id, projectId)}
                                      onAddProject={() => handleAddProject(position.id, company.id)}
                                      onBulletDragEnd={handleBulletDragEnd}
                                      sensors={sensors}
                                    />
                                  ))}
                                </SortableContext>
                              </DndContext>
                            </div>
                          )}
                        </DraggableCompany>
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            </TabsContent>

            {/* Other Tab */}
            <TabsContent value="other" className="m-0 h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Education & Skills</h2>
                    <p className="text-sm text-muted-foreground">
                      Add additional resume details
                    </p>
                  </div>
                </div>

                <div className="space-y-6 max-w-3xl">
                  {/* Education Section */}
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Education</h3>
                      <Button variant="outline" size="sm" onClick={handleAddEducation}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                    {(data.education || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No education entries yet. Click "Add Education" to get started.</p>
                    ) : (
                      <div className="space-y-3">
                        {(data.education || []).map((edu) => (
                          <div key={edu.id} className="border border-border rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{edu.degree}</h4>
                                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                <p className="text-sm text-muted-foreground">{edu.startDate} - {edu.endDate || 'Present'}</p>
                                {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditEducation(edu)}>
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteEducation(edu)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Skills Section */}
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Skills</h3>
                      <Button variant="outline" size="sm" onClick={handleAddSkill}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    </div>
                    {(data.skills || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No skills added yet. Click "Add Skill" to get started.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {(data.skills || []).map((skill) => (
                          <div key={skill.id} className="flex items-center gap-1 border border-border rounded-lg px-3 py-1">
                            <span className="text-sm">{skill.name}</span>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => handleEditSkill(skill)}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => handleDeleteSkill(skill)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Certifications Section */}
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Certifications</h3>
                      <Button variant="outline" size="sm" onClick={handleAddCertification}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Certification
                      </Button>
                    </div>
                    {(data.certifications || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No certifications added yet. Click "Add Certification" to get started.</p>
                    ) : (
                      <div className="space-y-3">
                        {(data.certifications || []).map((cert) => (
                          <div key={cert.id} className="border border-border rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{cert.name}</h4>
                                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                                <p className="text-sm text-muted-foreground">{cert.date}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditCertification(cert)}>
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteCertification(cert)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
            editDialog.type === 'position' ? [
              { name: 'title', label: 'Job Title', value: editDialog.data.title },
              { name: 'startDate', label: 'Start Date (Month YYYY)', value: editDialog.data.startDate, type: 'date' as const },
              { name: 'endDate', label: 'End Date (leave empty for Present)', value: editDialog.data.endDate || '', type: 'date' as const }
            ] :
            editDialog.type === 'project' ? [
              { name: 'name', label: 'Project Name', value: editDialog.data.name },
              { name: 'description', label: 'Description', value: editDialog.data.description || '', type: 'textarea' as const }
            ] :
            editDialog.type === 'education' ? [
              { name: 'degree', label: 'Degree', value: editDialog.data.degree },
              { name: 'institution', label: 'Institution', value: editDialog.data.institution },
              { name: 'startDate', label: 'Start Date (Month YYYY)', value: editDialog.data.startDate, type: 'date' as const },
              { name: 'endDate', label: 'End Date (leave empty for Present)', value: editDialog.data.endDate || '', type: 'date' as const },
              { name: 'description', label: 'Description', value: editDialog.data.description || '', type: 'textarea' as const }
            ] :
            editDialog.type === 'skill' ? [
              { name: 'name', label: 'Skill Name', value: editDialog.data.name },
              { name: 'category', label: 'Category (optional)', value: editDialog.data.category || '' }
            ] :
            editDialog.type === 'certification' ? [
              { name: 'name', label: 'Certification Name', value: editDialog.data.name },
              { name: 'issuer', label: 'Issuing Organization', value: editDialog.data.issuer },
              { name: 'date', label: 'Date', value: editDialog.data.date }
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

      {bulletEditDialog && (
        <EditBulletDialog
          open={bulletEditDialog.open}
          onOpenChange={(open) => !open && setBulletEditDialog(null)}
          bullet={bulletEditDialog.bullet}
          tags={data.tags || []}
          onSave={handleSaveBullet}
          onSaveNewVersion={handleSaveNewBulletVersion}
        />
      )}
    </div>
  );
};

export default ResumeEditor;
