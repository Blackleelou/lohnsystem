export type Entry = {
  id: string;
  title: string;
  status: string;
  category: string[]; // Mehrfachauswahl für Kategorien
  notes?: string;
  createdAt: string;
  completedAt?: string;
  updatedByImport?: boolean;
};
