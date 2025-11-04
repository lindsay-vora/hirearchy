import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlignJustify, Briefcase, Palette, Plus, ChevronDown, ChevronRight, GripVertical, Pencil, Trash2, Tag as TagIcon, Settings, Copy } from 'lucide-react';
import ResumePreview from '@/components/ResumePreview';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ResumeEditor: React.FC = () => {
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>(['tech-corp']);
  const [expandedPositions, setExpandedPositions] = useState<string[]>(['senior-swe']);
  const [expandedProjects, setExpandedProjects] = useState<string[]>(['microservices']);
  const [showFormatModal, setShowFormatModal] = useState(false);

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

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <span className="text-sm">Editing:</span>
            <span className="font-semibold">Software Engineering - FAANG</span>
          </div>
          <div className="flex items-center gap-4">
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
            <TabsContent value="experience" className="m-0 h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Work Experience</h2>
                    <p className="text-sm text-muted-foreground">
                      Organize by Company → Position → Project
                    </p>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                  </Button>
                </div>

                {/* Tech Corp Company */}
                <div className="border border-border rounded-lg mb-4">
                  <div className="flex items-center gap-2 p-3 bg-muted/30">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
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
                    <span className="text-sm text-muted-foreground">3 / 5 bullets</span>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="px-12 py-1 text-sm text-muted-foreground">2 positions</p>

                  {expandedCompanies.includes('tech-corp') && (
                    <div className="pl-8">
                      {/* Senior Software Engineer Position */}
                      <div className="border-l-2 border-border ml-4">
                        <div className="flex items-center gap-2 p-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => togglePosition('senior-swe')}
                          >
                            {expandedPositions.includes('senior-swe') ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <span className="font-medium flex-1">Senior Software Engineer</span>
                          <span className="text-sm text-muted-foreground">2 / 4</span>
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
                        <p className="px-12 text-sm text-muted-foreground">
                          Jan 2022 - Present • 2 projects
                        </p>

                        {expandedPositions.includes('senior-swe') && (
                          <div className="pl-8 pb-4">
                            {/* Microservices Platform Project */}
                            <div className="border-l-2 border-border ml-4">
                              <div className="flex items-center gap-2 p-3">
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0 h-auto"
                                  onClick={() => toggleProject('microservices')}
                                >
                                  {expandedProjects.includes('microservices') ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                                <span className="flex-1">Microservices Platform</span>
                                <span className="text-sm text-muted-foreground">1/2</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="px-12 text-sm text-muted-foreground mb-2">
                                Cloud infrastructure modernization
                              </p>

                              {expandedProjects.includes('microservices') && (
                                <div className="px-12 space-y-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-sm">Bullet Points</span>
                                    <Button variant="ghost" size="sm" className="h-7">
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Bullet
                                    </Button>
                                  </div>

                                  {/* Bullet 1 - Selected */}
                                  <div className="border border-border rounded-lg p-3 bg-card">
                                    <div className="flex items-start gap-3">
                                      <Checkbox defaultChecked className="mt-1" />
                                      <div className="flex-1">
                                        <p className="text-sm mb-2">
                                          Led development of microservices architecture serving 10M+ users
                                        </p>
                                        <div className="flex items-center gap-2 mb-2">
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
                                        <span className="text-xs text-muted-foreground">v1</span>
                                        <div className="flex gap-1 mt-2">
                                          <Button variant="ghost" size="sm" className="h-7">
                                            <TagIcon className="h-3 w-3 mr-1" />
                                            Tag
                                          </Button>
                                          <Button variant="ghost" size="sm" className="h-7">
                                            <Copy className="h-3 w-3 mr-1" />
                                            Duplicate
                                          </Button>
                                          <Button variant="ghost" size="sm" className="h-7">
                                            <Plus className="h-3 w-3 mr-1" />
                                            New Version
                                          </Button>
                                          <Button variant="ghost" size="sm" className="h-7 text-destructive">
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab mt-1" />
                                    </div>
                                  </div>

                                  {/* Bullet 2 - Not selected */}
                                  <div className="border border-border rounded-lg p-3 bg-card opacity-60">
                                    <div className="flex items-start gap-3">
                                      <Checkbox className="mt-1" />
                                      <div className="flex-1">
                                        <p className="text-sm mb-2">
                                          Architected and deployed scalable microservices infrastructure supporting
                                          10M+ daily active users
                                        </p>
                                        <div className="flex items-center gap-2 mb-2">
                                          <Badge variant="secondary" className="text-xs">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                                            Leadership
                                          </Badge>
                                          <Badge variant="secondary" className="text-xs">
                                            <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                                            Cloud
                                          </Badge>
                                        </div>
                                        <span className="text-xs text-muted-foreground">v2</span>
                                        <div className="flex gap-1 mt-2">
                                          <Button variant="ghost" size="sm" className="h-7">
                                            <TagIcon className="h-3 w-3 mr-1" />
                                            Tag
                                          </Button>
                                          <Button variant="ghost" size="sm" className="h-7">
                                            <Copy className="h-3 w-3 mr-1" />
                                            Duplicate
                                          </Button>
                                          <Button variant="ghost" size="sm" className="h-7">
                                            <Plus className="h-3 w-3 mr-1" />
                                            New Version
                                          </Button>
                                          <Button variant="ghost" size="sm" className="h-7 text-destructive">
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab mt-1" />
                                    </div>
                                  </div>

                                  <p className="text-sm text-muted-foreground">
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
            </TabsContent>

            <TabsContent value="summary" className="m-0">
              <div className="p-6">
                <p className="text-muted-foreground">Summary tab content</p>
              </div>
            </TabsContent>

            <TabsContent value="format" className="m-0">
              <div className="p-6">
                <p className="text-muted-foreground">Format tab content</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Resume Preview Panel */}
      <ResumePreview
        onFormatClick={() => setShowFormatModal(true)}
        onSaveVersion={() => {}}
        onExport={() => {}}
      />
    </div>
  );
};

export default ResumeEditor;
