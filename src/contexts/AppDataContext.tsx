import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Company, Bullet, Summary, ResumeVersion, Tag, Education, Skill, Certification, Position } from '@/types';
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
  reorderBullets: (bullets: Bullet[]) => void;
  addSummary: (summary: Summary) => void;
  updateSummary: (summaryId: string, content: string, versionTags: string[], selectedVersion?: string) => void;
  saveNewSummaryVersion: (summaryId: string, content: string, versionTags: string[]) => void;
  deleteSummary: (id: string) => void;
  selectSummary: (id: string) => void;
  saveResumeVersion: (version: Omit<ResumeVersion, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateResumeVersion: (id: string, updates: Partial<ResumeVersion>) => void;
  loadResumeVersion: (id: string) => void;
  deleteResumeVersion: (id: string) => void;
  toggleCompanyVisibility: (id: string) => void;
  toggleProjectVisibility: (companyId: string, positionId: string, projectId: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  addCertification: (certification: Certification) => void;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
  addPosition: (companyId: string, position: Position) => void;
  updatePosition: (companyId: string, positionId: string, position: Partial<Position>) => void;
  deletePosition: (companyId: string, positionId: string) => void;
  addProject: (companyId: string, positionId: string, project: any) => void;
  deleteProject: (companyId: string, positionId: string, projectId: string) => void;
  addTag: (tag: Omit<Tag, 'id' | 'createdAt'>) => void;
  updateTag: (id: string, tag: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
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
              { version: newVersion, content: updates.content, tags: updates.tags || b.tags || [], createdAt: new Date().toISOString() }
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

  const reorderBullets = (bullets: Bullet[]) => {
    setData(prev => ({ ...prev, bullets }));
  };

  const addSummary = (summary: Summary) => {
    setData(prev => ({
      ...prev,
      summaries: [...prev.summaries, summary],
    }));
  };

  const updateSummary = (summaryId: string, content: string, versionTags: string[], selectedVersion?: string) => {
    setData(prev => ({
      ...prev,
      summaries: prev.summaries.map(s => {
        if (s.id !== summaryId) return s;
        
        const updated = { ...s, content, tags: versionTags, updatedAt: new Date().toISOString() };
        
        if (selectedVersion && s.versions) {
          // Update existing version
          updated.versions = s.versions.map(v =>
            v.version === selectedVersion
              ? { ...v, content, tags: versionTags }
              : v
          );
          updated.selectedVersion = selectedVersion;
        }
        
        return updated;
      }),
    }));
  };

  const saveNewSummaryVersion = (summaryId: string, content: string, versionTags: string[]) => {
    setData(prev => ({
      ...prev,
      summaries: prev.summaries.map(s => {
        if (s.id !== summaryId) return s;
        
        const newVersion = `v${(s.versions?.length || 0) + 1}`;
        const newVersionData = {
          version: newVersion,
          content,
          tags: versionTags,
          createdAt: new Date().toISOString()
        };
        
        return {
          ...s,
          content,
          tags: versionTags,
          version: newVersion,
          selectedVersion: newVersion,
          versions: [...(s.versions || []), newVersionData],
          updatedAt: new Date().toISOString()
        };
      }),
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
      currentEditing: {
        ...prev.currentEditing,
        resumeVersionId: newVersion.id,
      },
    }));
  };

  const updateResumeVersion = (id: string, updates: Partial<ResumeVersion>) => {
    setData(prev => ({
      ...prev,
      resumeVersions: prev.resumeVersions.map(v =>
        v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
      ),
    }));
  };

  const loadResumeVersion = (id: string) => {
    const version = (data.resumeVersions || []).find(v => v.id === id);
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
      companies: prev.companies.map(c => ({
        ...c,
        isVisible: version.selectedCompanies.includes(c.id),
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

  const addEducation = (education: Education) => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, education],
    }));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  };

  const deleteEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
    }));
  };

  const addSkill = (skill: Skill) => {
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  };

  const deleteSkill = (id: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  };

  const addCertification = (certification: Certification) => {
    setData(prev => ({
      ...prev,
      certifications: [...prev.certifications, certification],
    }));
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  };

  const deleteCertification = (id: string) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id),
    }));
  };

  const addPosition = (companyId: string, position: Position) => {
    setData(prev => ({
      ...prev,
      companies: prev.companies.map(c =>
        c.id === companyId
          ? { ...c, positions: [...c.positions, position] }
          : c
      ),
    }));
  };

  const updatePosition = (companyId: string, positionId: string, updates: Partial<Position>) => {
    setData(prev => ({
      ...prev,
      companies: prev.companies.map(c =>
        c.id === companyId
          ? {
              ...c,
              positions: c.positions.map(p =>
                p.id === positionId ? { ...p, ...updates } : p
              ),
            }
          : c
      ),
    }));
  };

  const deletePosition = (companyId: string, positionId: string) => {
    setData(prev => ({
      ...prev,
      companies: prev.companies.map(c =>
        c.id === companyId
          ? { ...c, positions: c.positions.filter(p => p.id !== positionId) }
          : c
      ),
      bullets: prev.bullets.filter(b => b.positionId !== positionId),
    }));
  };

  const addProject = (companyId: string, positionId: string, project: any) => {
    setData(prev => ({
      ...prev,
      companies: prev.companies.map(c =>
        c.id === companyId
          ? {
              ...c,
              positions: c.positions.map(p =>
                p.id === positionId
                  ? { ...p, projects: [...(p.projects || []), project] }
                  : p
              ),
            }
          : c
      ),
    }));
  };

  const deleteProject = (companyId: string, positionId: string, projectId: string) => {
    setData(prev => ({
      ...prev,
      companies: prev.companies.map(c =>
        c.id === companyId
          ? {
              ...c,
              positions: c.positions.map(p =>
                p.id === positionId
                  ? { ...p, projects: (p.projects || []).filter(proj => proj.id !== projectId) }
                  : p
              ),
            }
          : c
      ),
      bullets: prev.bullets.filter(b => b.projectId !== projectId),
    }));
  };

  const addTag = (tag: Omit<Tag, 'id' | 'createdAt'>) => {
    const newTag: Tag = {
      ...tag,
      id: `tag-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }));
  };

  const updateTag = (id: string, updates: Partial<Tag>) => {
    setData(prev => ({
      ...prev,
      tags: prev.tags.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
  };

  const deleteTag = (id: string) => {
    setData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t.id !== id),
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
        reorderBullets,
        addSummary,
        updateSummary,
        saveNewSummaryVersion,
        deleteSummary,
        selectSummary,
        saveResumeVersion,
        updateResumeVersion,
        loadResumeVersion,
        deleteResumeVersion,
        toggleCompanyVisibility,
        toggleProjectVisibility,
        addEducation,
        updateEducation,
        deleteEducation,
        addSkill,
        updateSkill,
        deleteSkill,
        addCertification,
        updateCertification,
        deleteCertification,
        addPosition,
        updatePosition,
        deletePosition,
        addProject,
        deleteProject,
        addTag,
        updateTag,
        deleteTag,
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
