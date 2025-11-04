import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Company, Bullet, Summary, ResumeVersion, Tag } from '@/types';
import { loadData, saveData } from '@/lib/storage';

interface AppDataContextType {
  data: AppData;
  updateData: (data: Partial<AppData>) => void;
  addCompany: (company: Company) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  reorderCompanies: (companies: Company[]) => void;
  addBullet: (bullet: Bullet) => void;
  updateBullet: (id: string, bullet: Partial<Bullet>) => void;
  deleteBullet: (id: string) => void;
  toggleBulletSelection: (id: string) => void;
  addSummary: (summary: Summary) => void;
  updateSummary: (id: string, summary: Partial<Summary>) => void;
  deleteSummary: (id: string) => void;
  selectSummary: (id: string) => void;
  saveResumeVersion: (version: Omit<ResumeVersion, 'id' | 'createdAt' | 'updatedAt'>) => void;
  loadResumeVersion: (id: string) => void;
  deleteResumeVersion: (id: string) => void;
  toggleCompanyVisibility: (id: string) => void;
  toggleProjectVisibility: (companyId: string, positionId: string, projectId: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateData = (updates: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const addCompany = (company: Company) => {
    setData(prev => ({
      ...prev,
      companies: [...prev.companies, company],
    }));
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setData(prev => ({
      ...prev,
      companies: prev.companies.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  };

  const deleteCompany = (id: string) => {
    setData(prev => ({
      ...prev,
      companies: prev.companies.filter(c => c.id !== id),
      bullets: prev.bullets.filter(b => b.companyId !== id),
    }));
  };

  const reorderCompanies = (companies: Company[]) => {
    setData(prev => ({ ...prev, companies }));
  };

  const addBullet = (bullet: Bullet) => {
    setData(prev => ({
      ...prev,
      bullets: [...prev.bullets, bullet],
    }));
  };

  const updateBullet = (id: string, updates: Partial<Bullet>) => {
    setData(prev => ({
      ...prev,
      bullets: prev.bullets.map(b => {
        if (b.id === id) {
          const updated = { ...b, ...updates };
          // If content is being updated and versions exist, create new version
          if (updates.content && b.content !== updates.content && b.versions) {
            const newVersion = `v${b.versions.length + 1}`;
            updated.versions = [
              ...b.versions,
              { version: newVersion, content: updates.content, createdAt: new Date().toISOString() }
            ];
            updated.version = newVersion;
            updated.selectedVersion = newVersion;
          }
          return updated;
        }
        return b;
      }),
    }));
  };

  const deleteBullet = (id: string) => {
    setData(prev => ({
      ...prev,
      bullets: prev.bullets.filter(b => b.id !== id),
    }));
  };

  const toggleBulletSelection = (id: string) => {
    setData(prev => ({
      ...prev,
      bullets: prev.bullets.map(b => 
        b.id === id ? { ...b, isSelected: !b.isSelected } : b
      ),
    }));
  };

  const addSummary = (summary: Summary) => {
    setData(prev => ({
      ...prev,
      summaries: [...prev.summaries, summary],
    }));
  };

  const updateSummary = (id: string, updates: Partial<Summary>) => {
    setData(prev => ({
      ...prev,
      summaries: prev.summaries.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  };

  const deleteSummary = (id: string) => {
    setData(prev => ({
      ...prev,
      summaries: prev.summaries.filter(s => s.id !== id),
    }));
  };

  const selectSummary = (id: string) => {
    setData(prev => ({
      ...prev,
      summaries: prev.summaries.map(s => ({
        ...s,
        isSelected: s.id === id,
      })),
    }));
  };

  const saveResumeVersion = (version: Omit<ResumeVersion, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newVersion: ResumeVersion = {
      ...version,
      id: `rv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      resumeVersions: [...prev.resumeVersions, newVersion],
    }));
  };

  const loadResumeVersion = (id: string) => {
    const version = data.resumeVersions.find(v => v.id === id);
    if (!version) return;

    setData(prev => ({
      ...prev,
      summaries: prev.summaries.map(s => ({
        ...s,
        isSelected: s.id === version.summaryId,
      })),
      bullets: prev.bullets.map(b => ({
        ...b,
        isSelected: version.selectedBullets.includes(b.id),
      })),
      currentEditing: {
        resumeVersionId: version.id,
        resumeName: version.name,
      },
    }));
  };

  const deleteResumeVersion = (id: string) => {
    setData(prev => ({
      ...prev,
      resumeVersions: prev.resumeVersions.filter(v => v.id !== id),
    }));
  };

  const toggleCompanyVisibility = (id: string) => {
    setData(prev => ({
      ...prev,
      companies: prev.companies.map(c => 
        c.id === id ? { ...c, isVisible: !(c as any).isVisible } : c
      ),
    }));
  };

  const toggleProjectVisibility = (companyId: string, positionId: string, projectId: string) => {
    setData(prev => ({
      ...prev,
      companies: prev.companies.map(c => {
        if (c.id !== companyId) return c;
        return {
          ...c,
          positions: c.positions.map(p => {
            if (p.id !== positionId) return p;
            return {
              ...p,
              projects: p.projects.map(proj => {
                if (proj.id !== projectId) return proj;
                return { ...proj, isVisible: !(proj as any).isVisible };
              }),
            };
          }),
        };
      }),
    }));
  };

  return (
    <AppDataContext.Provider
      value={{
        data,
        updateData,
        addCompany,
        updateCompany,
        deleteCompany,
        reorderCompanies,
        addBullet,
        updateBullet,
        deleteBullet,
        toggleBulletSelection,
        addSummary,
        updateSummary,
        deleteSummary,
        selectSummary,
        saveResumeVersion,
        loadResumeVersion,
        deleteResumeVersion,
        toggleCompanyVisibility,
        toggleProjectVisibility,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
};
