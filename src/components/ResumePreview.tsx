import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Save, Download } from 'lucide-react';

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
  return (
    <div className="w-[500px] border-l border-border bg-background flex flex-col">
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

      <div className="flex-1 overflow-auto p-8 bg-white">
        {/* Resume Preview Content */}
        <div className="max-w-[600px] mx-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-sm">john.doe@email.com • (555) 123-4567 •</p>
            <p className="text-sm">San Francisco, CA</p>
          </div>

          <hr className="border-t-2 border-foreground my-4" />

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Summary</h2>
            <p className="text-sm">
              Experienced software engineer with 5+ years building scalable web applications
              and leading technical teams. Passionate about clean code, system design, and
              mentoring junior developers.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Work Experience</h2>
            
            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold">Senior Software Engineer</h3>
                <span className="text-sm">Jan 2022 - Present</span>
              </div>
              <p className="text-sm font-medium mb-2">Tech Corp</p>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-sm">
                  Led development of microservices architecture serving 10M+ users
                </li>
                <li className="text-sm">
                  Reduced deployment time by 60% through CI/CD pipeline optimization
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold">Software Engineer</h3>
                <span className="text-sm">Jun 2021 - Dec 2021</span>
              </div>
              <p className="text-sm font-medium mb-2">Tech Corp</p>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-sm">
                  Developed RESTful APIs using Node.js and Express
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold">Full Stack Developer</h3>
                <span className="text-sm">Jun 2020 - May 2021</span>
              </div>
              <p className="text-sm font-medium mb-2">StartupXYZ</p>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-sm">
                  Built responsive web applications using React and Node.js
                </li>
                <li className="text-sm">
                  Created React Native mobile app with 50k+ downloads
                </li>
              </ul>
            </div>
          </div>

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
                <span key={skill} className="px-3 py-1 bg-muted text-sm rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          Showing 2 companies • 3 positions • 5 bullet points
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
