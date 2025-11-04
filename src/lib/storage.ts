import { AppData } from '@/types';

const STORAGE_KEY = 'hirearchy_data';

const defaultData: AppData = {
  companies: [
    {
      id: 'tech-corp',
      name: 'Tech Corp',
      isVisible: true,
      positions: [
        {
          id: 'senior-swe',
          title: 'Senior Software Engineer',
          startDate: '2022-01',
          endDate: undefined,
          projects: [
            {
              id: 'microservices',
              name: 'Microservices Platform',
              description: 'Cloud infrastructure modernization',
              bulletCount: 2,
              isVisible: true,
            },
          ],
        },
      ],
    },
  ],
  bullets: [
    {
      id: 'bullet-1',
      content: 'Led development of microservices architecture serving 10M+ users',
      version: 'v1',
      tags: ['Leadership', 'Backend', 'Cloud'],
      projectId: 'microservices',
      positionId: 'senior-swe',
      companyId: 'tech-corp',
      isSelected: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'bullet-2',
      content: 'Architected and deployed scalable microservices infrastructure supporting 10M+ daily active users',
      version: 'v2',
      tags: ['Leadership', 'Cloud'],
      projectId: 'microservices',
      positionId: 'senior-swe',
      companyId: 'tech-corp',
      isSelected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  summaries: [
    {
      id: 'summary-1',
      name: 'Technical Leadership',
      version: 'v1',
      content: 'Experienced software engineer with 5+ years building scalable web applications and leading technical teams. Passionate about clean code, system design, and mentoring junior developers.',
      isSelected: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'summary-2',
      name: 'Full Stack Focus',
      version: 'v2',
      content: 'Full-stack software engineer specializing in React, Node.js, and cloud infrastructure. Proven track record of delivering high-performance applications serving millions of users.',
      isSelected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  tags: [
    { id: 'tag-1', name: 'Leadership', color: '#3b82f6', createdAt: new Date().toISOString() },
    { id: 'tag-2', name: 'Backend', color: '#10b981', createdAt: new Date().toISOString() },
    { id: 'tag-3', name: 'Cloud', color: '#f97316', createdAt: new Date().toISOString() },
  ],
  formats: [
    {
      id: 'format-1',
      name: 'Classic',
      description: 'Clean, traditional format',
      isDefault: true,
      isFavorite: false,
      settings: {
        fontFamily: 'georgia',
        fontSize: 11,
        lineHeight: 1.5,
        margins: 0.5,
        sectionSpacing: 12,
        headerStyle: 'bold',
        bulletStyle: 'disc',
        colorScheme: 'default',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  resumeVersions: [],
  currentEditing: {
    resumeName: 'Software Engineering - FAANG',
  },
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load data:', error);
  }
  return defaultData;
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

export const exportData = (data: AppData): void => {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hirearchy_export_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<AppData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
