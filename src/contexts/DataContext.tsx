import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppData } from '@/types';
import { loadData, saveData } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface DataContextType {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => loadData());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateData = useCallback((newData: Partial<AppData>) => {
    setData((prev) => {
      const updated = { ...prev, ...newData };
      saveData(updated);
      return updated;
    });
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveData(data);
    }, data.settings.autoSaveInterval);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <DataContext.Provider value={{ data, updateData, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
