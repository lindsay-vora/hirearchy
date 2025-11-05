import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, FileText, MessageSquare } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

const Feedback: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Help & Support"
        description="Report bugs, request features, or get help"
      />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <CardTitle>Submit Feedback or Report Bugs</CardTitle>
              </div>
              <CardDescription>
                Help us improve by sharing your feedback or reporting any issues you encounter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We appreciate your input! Click the button below to submit feedback or report bugs through our feedback portal.
              </p>
              <Button>
                <ExternalLink className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>Help & Documentation</CardTitle>
              </div>
              <CardDescription>
                Access guides and documentation to get the most out of the app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our help topics and documentation to learn more about features and best practices.
              </p>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Help Topics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About This App</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">License & Attribution</h3>
                <p className="text-sm text-muted-foreground">
                  For license information and attribution details, please refer to the README.md and LICENSE files included in the project repository.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Where to Find README & License</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>README.md: Project root directory - Contains project overview and usage instructions</li>
                  <li>LICENSE: Project root directory - Contains licensing terms and conditions</li>
                  <li>These files can also be accessed through your version control system or project repository</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
