export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  bulletCount: number;
  isVisible?: boolean;
}

export interface Position {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  projects: Project[];
}

export interface Company {
  id: string;
  name: string;
  positions: Position[];
  isExpanded?: boolean;
  isVisible?: boolean;
}

export interface BulletVersion {
  version: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface Bullet {
  id: string;
  content: string;
  version: string;
  versions: BulletVersion[];
  selectedVersion?: string;
  tags: string[];
  projectId: string;
  positionId: string;
  companyId: string;
  isSelected?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SummaryVersion {
  version: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface Summary {
  id: string;
  name: string;
  version: string;
  content: string;
  versions: SummaryVersion[];
  selectedVersion?: string;
  tags: string[];
  isSelected?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  createdAt: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  createdAt: string;
}

export interface ResumeVersion {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  summaryId?: string;
  selectedBullets: string[];
  selectedCompanies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  companies: Company[];
  bullets: Bullet[];
  summaries: Summary[];
  tags: Tag[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  resumeVersions: ResumeVersion[];
  currentEditing: {
    resumeVersionId?: string;
    resumeName: string;
  };
}
