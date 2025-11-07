export interface SubConcept {
  name: string;
  mastered: boolean;
  attemptsCorrect: number;
  attemptsTotal: number;
}

export interface Topic {
  name: string;
  progress: number; // 0-100
  subConcepts?: SubConcept[];
  lastPracticed: string;
}

export interface Goal {
  id: string;
  subject: string;
  targetCompletion: string; // ISO date
  progress: number; // 0-100
  topics: Topic[];
}
