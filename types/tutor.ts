export interface TimeSlot {
  datetime: string;
  duration: number;
  available: boolean;
}

export interface Tutor {
  id: string;
  name: string;
  specialties: string[];
  bio: string;
  photoUrl?: string;

  students: string[]; // Student IDs
  availableSlots?: TimeSlot[]; // For booking
}
