export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  bulletCount: number;
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
}

export interface Bullet {
  id: string;
  content: string;
  version: string;
  tags: string[];
  projectId: string;
  positionId: string;
  companyId: string;
  isSelected?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Summary {
  id: string;
  name: string;
  version: string;
  content: string;
  isSelected?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormatSettings {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  margins: number;
  sectionSpacing: number;
  headerStyle: string;
  bulletStyle: string;
  colorScheme: string;
}

export interface SavedFormat {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
  settings: FormatSettings;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersion {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  summaryId?: string;
  selectedBullets: string[];
  selectedCompanies: string[];
  formatId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  companies: Company[];
  bullets: Bullet[];
  summaries: Summary[];
  tags: Tag[];
  formats: SavedFormat[];
  resumeVersions: ResumeVersion[];
  currentEditing: {
    resumeVersionId?: string;
    resumeName: string;
  };
}
