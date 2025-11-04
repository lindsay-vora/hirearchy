import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlignJustify, Briefcase, Palette, Plus, ChevronDown, ChevronRight, GripVertical, Pencil, Trash2, Tag as TagIcon, Settings, Copy, X, Eye, EyeOff, Star } from 'lucide-react';
import ResumePreview from '@/components/ResumePreview';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

const ResumeEditor: React.FC = () => {
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>(['tech-corp']);
  const [expandedPositions, setExpandedPositions] = useState<string[]>(['senior-swe']);
  const [expandedProjects, setExpandedProjects] = useState<string[]>(['microservices']);
  const [showPreview, setShowPreview] = useState(true);
  const [previewWidth, setPreviewWidth] = useState(500);
  
  // Dialogs
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);
  
  // Form states
  const [companyName, setCompanyName] = useState('');

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

  const handleDelete = (type: string, id: string) => {
    setDeleteTarget({ type, id });
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    // Implement delete logic here
    console.log('Deleting:', deleteTarget);
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  const handleAddCompany = () => {
    if (companyName.trim()) {
      console.log('Adding company:', companyName);
      setCompanyName('');
      setShowAddCompanyDialog(false);
    }
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
            <span className="font-semibold">Software Engineering - FAANG</span>
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
            <Settings className="h-5 w-5 cursor-pointer" />
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
                      Create different versions of your summary
                    </p>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Version
                  </Button>
                </div>

                <div className="space-y-4 max-w-3xl">
                  {/* Summary Version 1 - Selected */}
                  <div className="border-2 border-primary rounded-lg p-4 bg-card">
                    <div className="flex items-start gap-3">
                      <Checkbox defaultChecked className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">Technical Leadership</span>
                          <Badge variant="secondary" className="text-xs">v1</Badge>
                        </div>
                        <p className="text-sm mb-3">
                          Experienced software engineer with 5+ years building scalable web applications
                          and leading technical teams. Passionate about clean code, system design, and
                          mentoring junior developers.
                        </p>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-3 w-3 mr-1" />
                            Rename
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Duplicate
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Version 2 */}
                  <div className="border border-border rounded-lg p-4 bg-card opacity-70">
                    <div className="flex items-start gap-3">
                      <Checkbox className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">Full Stack Focus</span>
                          <Badge variant="secondary" className="text-xs">v2</Badge>
                        </div>
                        <p className="text-sm mb-3">
                          Full-stack software engineer specializing in React, Node.js, and cloud
                          infrastructure. Proven track record of delivering high-performance applications
                          serving millions of users.
                        </p>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-3 w-3 mr-1" />
                            Rename
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Duplicate
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Select one summary to include in your resume. Click text to edit.
                  </p>
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
                  {/* Tech Corp Company */}
                  <div className="border border-border rounded-lg">
                    <div className="flex items-center gap-2 p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto hover:bg-transparent"
                        onClick={() => toggleCompany('tech-corp')}
                      >
                        {expandedCompanies.includes('tech-corp') ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </Button>
                      <Briefcase className="h-5 w-5" />
                      <span className="font-semibold flex-1">Tech Corp</span>
                      <span className="text-sm text-muted-foreground mr-2">3 / 5 bullets</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete('company', 'tech-corp')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="px-12 py-1 text-sm text-muted-foreground border-b border-border">2 positions</p>

                    {expandedCompanies.includes('tech-corp') && (
                      <div className="p-4 space-y-3">
                        {/* Senior Software Engineer Position */}
                        <div className="border border-border rounded-lg">
                          <div className="flex items-center gap-2 p-3 bg-muted/20 hover:bg-muted/30 transition-colors">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto hover:bg-transparent"
                              onClick={() => togglePosition('senior-swe')}
                            >
                              {expandedPositions.includes('senior-swe') ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                            <span className="font-medium flex-1">Senior Software Engineer</span>
                            <span className="text-sm text-muted-foreground mr-2">2 / 4</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete('position', 'senior-swe')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="px-12 py-2 text-sm text-muted-foreground border-b border-border">
                            Jan 2022 - Present • 2 projects
                          </p>

                          {expandedPositions.includes('senior-swe') && (
                            <div className="p-3 space-y-3">
                              {/* Microservices Platform Project */}
                              <div className="border border-border rounded-lg">
                                <div className="flex items-center gap-2 p-3 bg-muted/10">
                                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto hover:bg-transparent"
                                    onClick={() => toggleProject('microservices')}
                                  >
                                    {expandedProjects.includes('microservices') ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <span className="flex-1 font-medium text-sm">Microservices Platform</span>
                                  <span className="text-xs text-muted-foreground mr-2">1/2</span>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => handleDelete('project', 'microservices')}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <p className="px-10 py-2 text-xs text-muted-foreground border-b border-border">
                                  Cloud infrastructure modernization
                                </p>

                                {expandedProjects.includes('microservices') && (
                                  <div className="p-3 space-y-2">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-sm">Bullet Points</span>
                                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add Bullet
                                      </Button>
                                    </div>

                                    {/* Bullet 1 - Selected */}
                                    <div className="border-2 border-primary rounded-lg p-3 bg-card">
                                      <div className="flex items-start gap-2">
                                        <Checkbox defaultChecked className="mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm mb-2">
                                            Led development of microservices architecture serving 10M+ users
                                          </p>
                                          <div className="flex flex-wrap items-center gap-1 mb-2">
                                            <Badge variant="secondary" className="text-xs">
                                              <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                                              Leadership
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                                              Backend
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                              <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                                              Cloud
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-1 mb-2">
                                            <span className="text-xs text-muted-foreground">v1</span>
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                                              <TagIcon className="h-3 w-3 mr-1" />
                                              Tag
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                                              <Copy className="h-3 w-3 mr-1" />
                                              Duplicate
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                                              <Plus className="h-3 w-3 mr-1" />
                                              New Version
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive">
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />
                                      </div>
                                    </div>

                                    {/* Bullet 2 - Not selected */}
                                    <div className="border border-border rounded-lg p-3 bg-card opacity-60">
                                      <div className="flex items-start gap-2">
                                        <Checkbox className="mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm mb-2">
                                            Architected and deployed scalable microservices infrastructure supporting
                                            10M+ daily active users
                                          </p>
                                          <div className="flex flex-wrap items-center gap-1 mb-2">
                                            <Badge variant="secondary" className="text-xs">
                                              <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                                              Leadership
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                              <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                                              Cloud
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-1 mb-2">
                                            <span className="text-xs text-muted-foreground">v2</span>
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                                              <TagIcon className="h-3 w-3 mr-1" />
                                              Tag
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                                              <Copy className="h-3 w-3 mr-1" />
                                              Duplicate
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                                              <Plus className="h-3 w-3 mr-1" />
                                              New Version
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive">
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />
                                      </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground mt-2">
                                      Click the checkbox to include a bullet in your resume. Click text to edit.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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
                  {/* Left Column - Settings */}
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
                              <SelectItem value="helvetica">Helvetica</SelectItem>
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

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm">Line Height</Label>
                            <span className="text-sm text-muted-foreground">1.5</span>
                          </div>
                          <Slider defaultValue={[1.5]} min={1} max={2} step={0.1} />
                        </div>
                      </div>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold mb-4">Layout</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm">Margins</Label>
                            <span className="text-sm text-muted-foreground">0.75in</span>
                          </div>
                          <Slider defaultValue={[0.75]} min={0.5} max={1.5} step={0.05} />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm">Section Spacing</Label>
                            <span className="text-sm text-muted-foreground">16px</span>
                          </div>
                          <Slider defaultValue={[16]} min={8} max={32} step={2} />
                        </div>
                      </div>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold mb-4">Style</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm mb-2 block">Header Style</Label>
                          <Select defaultValue="border-bottom">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="border-bottom">Border Bottom</SelectItem>
                              <SelectItem value="underline">Underline</SelectItem>
                              <SelectItem value="bold">Bold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm mb-2 block">Bullet Style</Label>
                          <Select defaultValue="disc">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="disc">Disc (●)</SelectItem>
                              <SelectItem value="circle">Circle (○)</SelectItem>
                              <SelectItem value="square">Square (■)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm mb-2 block">Color Scheme</Label>
                          <Select defaultValue="black">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="black">Black</SelectItem>
                              <SelectItem value="navy">Navy</SelectItem>
                              <SelectItem value="gray">Gray</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Saved Formats */}
                  <div>
                    <h3 className="font-semibold mb-4">Saved Formats</h3>
                    <div className="space-y-3">
                      {/* Format 1 - Default */}
                      <div className="border-2 border-primary rounded-lg p-4 bg-card">
                        <div className="flex items-start gap-3">
                          <Checkbox defaultChecked className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">Professional Classic</span>
                              <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Default
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              Traditional resume format for corporate roles
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Georgia • 11pt • 2 hours ago
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Star className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Format 2 */}
                      <div className="border border-border rounded-lg p-4 bg-card opacity-70">
                        <div className="flex items-start gap-3">
                          <Checkbox className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">Modern Tech</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              Clean, modern design for tech companies
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Helvetica • 10pt • 1 day ago
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Star className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Format 3 */}
                      <div className="border border-border rounded-lg p-4 bg-card opacity-70">
                        <div className="flex items-start gap-3">
                          <Checkbox className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">Minimalist</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              Simple, clean design with lots of white space
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Arial • 12pt • 3 days ago
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Star className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Resume Preview Panel */}
      {showPreview && (
        <ResumePreview
          onFormatClick={() => {}}
          onSaveVersion={() => {}}
          onExport={() => {}}
        />
      )}

      {/* Add Company Dialog */}
      <Dialog open={showAddCompanyDialog} onOpenChange={setShowAddCompanyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Google, Microsoft, Amazon"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCompanyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCompany}>Add Company</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this{' '}
              {deleteTarget?.type} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResumeEditor;
