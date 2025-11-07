import { Tutor, TimeSlot } from "@/types";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "tutors");

/**
 * Get tutor by ID
 */
export async function getTutorById(id: string): Promise<Tutor | null> {
  try {
    const fileName = id.replace("tutor-", "") + ".json";
    const filePath = path.join(DATA_DIR, fileName);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as Tutor;
  } catch (error) {
    console.error(`Error loading tutor ${id}:`, error);
    return null;
  }
}

/**
 * Get all tutors
 */
export async function getAllTutors(): Promise<Tutor[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const tutors = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, "utf-8");
        return JSON.parse(content) as Tutor;
      })
    );

    return tutors;
  } catch (error) {
    console.error("Error loading all tutors:", error);
    return [];
  }
}

/**
 * Get tutors by specialty/subject
 */
export async function getTutorsBySpecialty(specialty: string): Promise<Tutor[]> {
  try {
    const tutors = await getAllTutors();

    return tutors.filter((tutor) =>
      tutor.specialties.some((s) =>
        s.toLowerCase().includes(specialty.toLowerCase())
      )
    );
  } catch (error) {
    console.error(`Error getting tutors by specialty ${specialty}:`, error);
    return [];
  }
}

/**
 * Get available time slots for a tutor
 */
export async function getAvailableSlots(tutorId: string): Promise<TimeSlot[]> {
  try {
    const tutor = await getTutorById(tutorId);
    if (!tutor || !tutor.availableSlots) return [];

    // Filter for available slots only
    return tutor.availableSlots.filter((slot) => slot.available);
  } catch (error) {
    console.error(`Error getting available slots for tutor ${tutorId}:`, error);
    return [];
  }
}

/**
 * Get student's assigned tutor (from student's sessions)
 */
export async function getStudentTutor(studentId: string): Promise<Tutor | null> {
  try {
    const tutors = await getAllTutors();

    // Find tutor who has this student
    const tutor = tutors.find((t) => t.students.includes(studentId));

    return tutor || null;
  } catch (error) {
    console.error(`Error getting tutor for student ${studentId}:`, error);
    return null;
  }
}

/**
 * Get recommended tutor for a subject
 */
export async function getRecommendedTutor(
  subject: string,
  studentId?: string
): Promise<Tutor | null> {
  try {
    // First try to find student's existing tutor if they teach this subject
    if (studentId) {
      const studentTutor = await getStudentTutor(studentId);
      if (
        studentTutor &&
        studentTutor.specialties.some((s) =>
          s.toLowerCase().includes(subject.toLowerCase())
        )
      ) {
        return studentTutor;
      }
    }

    // Otherwise, find any tutor with this specialty
    const tutors = await getTutorsBySpecialty(subject);
    return tutors.length > 0 ? tutors[0] : null;
  } catch (error) {
    console.error(`Error getting recommended tutor for ${subject}:`, error);
    return null;
  }
}

/**
 * Format tutor info for display
 */
export interface TutorDisplayInfo {
  id: string;
  name: string;
  specialties: string;
  bio: string;
  photoUrl?: string;
  availableSlots: number;
}

export async function getTutorDisplayInfo(
  tutorId: string
): Promise<TutorDisplayInfo | null> {
  try {
    const tutor = await getTutorById(tutorId);
    if (!tutor) return null;

    const availableSlots = tutor.availableSlots?.filter((s) => s.available).length || 0;

    return {
      id: tutor.id,
      name: tutor.name,
      specialties: tutor.specialties.join(", "),
      bio: tutor.bio,
      photoUrl: tutor.photoUrl,
      availableSlots,
    };
  } catch (error) {
    console.error(`Error getting display info for tutor ${tutorId}:`, error);
    return null;
  }
}

