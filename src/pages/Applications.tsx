import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Plus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Application } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Applications: React.FC = () => {
  const { data } = useData();

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500';
      case 'interviewing':
        return 'bg-warning';
      case 'offer':
        return 'bg-success';
      case 'rejected':
        return 'bg-destructive';
      case 'withdrawn':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Application Tracker"
        description="Track your job applications and their status"
        action={{
          label: 'New Application',
          icon: Plus,
          onClick: () => {},
        }}
      />

      <div className="flex-1 overflow-auto p-8">
        {data.applications.length > 0 ? (
          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resume Version</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.applications.map((app) => {
                  const resume = data.resumes.find((r) => r.id === app.resumeVersionId);
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.company}</TableCell>
                      <TableCell>{app.role}</TableCell>
                      <TableCell>
                        {new Date(app.dateApplied).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{resume?.name || 'Unknown'}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {app.notes || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your job applications
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
