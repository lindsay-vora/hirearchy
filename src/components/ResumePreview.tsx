import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Save, Download } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';

interface ResumePreviewProps {
  onFormatClick: () => void;
  onSaveVersion: () => void;
  onExport: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  onFormatClick, 
  onSaveVersion, 
  onExport 
}) => {
  const { data } = useAppData();
  
  const selectedSummary = data.summaries.find(s => s.isSelected);
  const selectedBullets = data.bullets.filter(b => b.isSelected);
  const selectedFormat = data.formats.find(f => f.isDefault) || data.formats[0];
  const visibleCompanies = data.companies.filter(c => (c as any).isVisible !== false);

  const getBulletsForProject = (projectId: string) => {
    return selectedBullets.filter(b => b.projectId === projectId);
  };

  return (
    <div className="border-l border-border bg-background flex flex-col h-full">
      <div className="border-b border-border p-4">
        <h2 className="text-xl font-bold mb-1">Resume Preview</h2>
        <p className="text-sm text-muted-foreground mb-3">Live preview of your resume</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onFormatClick}>
            <Settings className="h-4 w-4 mr-2" />
            Format
          </Button>
          <Button variant="outline" size="sm" onClick={onSaveVersion}>
            <Save className="h-4 w-4 mr-2" />
            Save Version
          </Button>
          <Button size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div 
        className="flex-1 overflow-auto p-8 bg-white text-black"
        style={{
          fontFamily: selectedFormat?.settings.fontFamily || 'georgia',
          fontSize: `${selectedFormat?.settings.fontSize || 11}pt`,
          lineHeight: selectedFormat?.settings.lineHeight || 1.5,
        }}
      >
        <div className="max-w-[600px] mx-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-sm">john.doe@email.com • (555) 123-4567 •</p>
            <p className="text-sm">San Francisco, CA</p>
          </div>

          <hr className="border-t-2 border-black my-4" />

          {selectedSummary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">Summary</h2>
              <p className="text-sm">{selectedSummary.content}</p>
            </div>
          )}

          {visibleCompanies.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">Work Experience</h2>
              
              {visibleCompanies.map((company) => (
                <div key={company.id} className="mb-4">
                  {company.positions.map((position) => (
                    <div key={position.id} className="mb-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold">{position.title}</h3>
                        <span className="text-sm">
                          {position.startDate} - {position.endDate || 'Present'}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-2">{company.name}</p>
                      
                      {position.projects.map((project) => {
                        const projectBullets = getBulletsForProject(project.id);
                        const projectVisible = (project as any).isVisible !== false;
                        
                        if (projectBullets.length === 0) return null;
                        
                        return (
                          <div key={project.id} className="mb-2">
                            {projectVisible && (
                              <p className="text-sm font-medium italic mb-1">{project.name}</p>
                            )}
                            <ul className="list-disc pl-5 space-y-1">
                              {projectBullets.map((bullet) => (
                                <li key={bullet.id} className="text-sm">
                                  {bullet.content}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Education</h2>
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-medium">Bachelor of Science in Computer Science</h3>
              <span className="text-sm">2016 - 2020</span>
            </div>
            <p className="text-sm">University of Technology</p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-gray-200 text-sm rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-600">
          Showing {visibleCompanies.length} companies • {selectedBullets.length} bullet points
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
