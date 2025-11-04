export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface Bullet {
  id: string;
  name: string;
  content: string;
  jobId?: string;
  tags: string[];
  rating?: 'strong' | 'weak' | 'needs-revision';
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  groupId?: string;
}

export interface BulletGroup {
  id: string;
  name: string;
  bullets: string[];
}

export interface JobHistory {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  subTitles: SubTitle[];
}

export interface SubTitle {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
}

export interface Resume {
  id: string;
  name: string;
  summary?: string;
  tags: string[];
  jobs: string[];
  bullets: string[];
  education: Education[];
  certifications: Certification[];
  software: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  link?: string;
  dateApplied: string;
  resumeVersionId: string;
  status: 'submitted' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';
  notes?: string;
  recruiterName?: string;
  referral?: string;
  jobDescription?: string;
}

export interface AppData {
  resumes: Resume[];
  bullets: Bullet[];
  bulletGroups: BulletGroup[];
  tags: Tag[];
  jobHistory: JobHistory[];
  applications: Application[];
  settings: {
    autoSaveInterval: number;
    lastBackup?: string;
  };
}
