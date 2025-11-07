import { Student, Goal } from "@/types";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "students");

/**
 * Get student by ID
 */
export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const fileName = id.replace("student-", "") + ".json";
    const filePath = path.join(DATA_DIR, fileName);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as Student;
  } catch (error) {
    console.error(`Error loading student ${id}:`, error);
    return null;
  }
}

/**
 * Get all students
 */
export async function getAllStudents(): Promise<Student[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const students = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, "utf-8");
        return JSON.parse(content) as Student;
      })
    );

    return students;
  } catch (error) {
    console.error("Error loading all students:", error);
    return [];
  }
}

/**
 * Update student profile
 */
export async function updateStudentProfile(
  id: string,
  updates: Partial<Student>
): Promise<Student | null> {
  try {
    const student = await getStudentById(id);
    if (!student) return null;

    const updatedStudent = { ...student, ...updates };
    await saveStudentData(updatedStudent);
    return updatedStudent;
  } catch (error) {
    console.error(`Error updating student ${id}:`, error);
    return null;
  }
}

/**
 * Update student progress for a specific goal
 */
export async function updateStudentProgress(
  id: string,
  goalId: string,
  progress: number
): Promise<Student | null> {
  try {
    const student = await getStudentById(id);
    if (!student) return null;

    const goalIndex = student.goals.findIndex((g) => g.id === goalId);
    if (goalIndex === -1) return null;

    student.goals[goalIndex].progress = Math.min(100, Math.max(0, progress));
    await saveStudentData(student);
    return student;
  } catch (error) {
    console.error(`Error updating progress for student ${id}:`, error);
    return null;
  }
}

/**
 * Add a new learning goal to student
 */
export async function addGoal(
  studentId: string,
  goal: Goal
): Promise<Student | null> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return null;

    // Enforce max 4 goals
    if (student.goals.length >= 4) {
      throw new Error("Maximum 4 goals allowed per student");
    }

    student.goals.push(goal);
    await saveStudentData(student);
    return student;
  } catch (error) {
    console.error(`Error adding goal for student ${studentId}:`, error);
    return null;
  }
}

/**
 * Remove a learning goal from student
 */
export async function removeGoal(
  studentId: string,
  goalId: string
): Promise<Student | null> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return null;

    student.goals = student.goals.filter((g) => g.id !== goalId);
    await saveStudentData(student);
    return student;
  } catch (error) {
    console.error(`Error removing goal for student ${studentId}:`, error);
    return null;
  }
}

/**
 * Update topic progress within a goal
 */
export async function updateTopicProgress(
  studentId: string,
  goalId: string,
  topicName: string,
  progress: number
): Promise<Student | null> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return null;

    const goal = student.goals.find((g) => g.id === goalId);
    if (!goal) return null;

    const topic = goal.topics.find((t) => t.name === topicName);
    if (!topic) return null;

    topic.progress = Math.min(100, Math.max(0, progress));
    topic.lastPracticed = new Date().toISOString();

    // Recalculate goal progress
    const avgProgress =
      goal.topics.reduce((sum, t) => sum + t.progress, 0) / goal.topics.length;
    goal.progress = Math.round(avgProgress);

    await saveStudentData(student);
    return student;
  } catch (error) {
    console.error(`Error updating topic progress for student ${studentId}:`, error);
    return null;
  }
}

/**
 * Get student tasks (placeholder - will be implemented in taskService)
 */
export async function getStudentTasks(
  studentId: string,
  status?: string
): Promise<string[]> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return [];

    return student.taskHistory;
  } catch (error) {
    console.error(`Error getting tasks for student ${studentId}:`, error);
    return [];
  }
}

/**
 * Save student data to JSON file
 */
export async function saveStudentData(student: Student): Promise<void> {
  try {
    const fileName = student.id.replace("student-", "") + ".json";
    const filePath = path.join(DATA_DIR, fileName);
    await fs.writeFile(filePath, JSON.stringify(student, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error saving student data:`, error);
    throw error;
  }
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(studentId: string): Promise<Student | null> {
  try {
    return await updateStudentProfile(studentId, {
      lastLoginAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error updating last login for ${studentId}:`, error);
    return null;
  }
}

/**
 * Increment questions asked counter
 */
export async function incrementQuestionsAsked(
  studentId: string
): Promise<Student | null> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return null;

    student.questionsAsked += 1;
    await saveStudentData(student);
    return student;
  } catch (error) {
    console.error(`Error incrementing questions for ${studentId}:`, error);
    return null;
  }
}

/**
 * Increment total conversations counter
 */
export async function incrementConversations(
  studentId: string
): Promise<Student | null> {
  try {
    const student = await getStudentById(studentId);
    if (!student) return null;

    student.totalConversations += 1;
    await saveStudentData(student);
    return student;
  } catch (error) {
    console.error(`Error incrementing conversations for ${studentId}:`, error);
    return null;
  }
}

