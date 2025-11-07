import { create } from "zustand";
import { Student, Session, Task, Message } from "@/types";

interface AppState {
  // Current user
  currentStudent: Student | null;
  setCurrentStudent: (student: Student | null) => void;

  // Chat state
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;

  // Current session
  currentSubject: string | null;
  setCurrentSubject: (subject: string | null) => void;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;

  // UI state
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;

  // Sidebar state
  showTaskSidebar: boolean;
  toggleTaskSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Current user
  currentStudent: null,
  setCurrentStudent: (student) => set({ currentStudent: student }),

  // Chat state
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  isTyping: false,
  setIsTyping: (isTyping) => set({ isTyping }),

  // Current session
  currentSubject: null,
  setCurrentSubject: (subject) => set({ currentSubject: subject }),

  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  // UI state
  showOnboarding: false,
  setShowOnboarding: (show) => set({ showOnboarding: show }),
  selectedColor: "#667eea",
  setSelectedColor: (color) => set({ selectedColor: color }),

  // Sidebar state
  showTaskSidebar: true,
  toggleTaskSidebar: () =>
    set((state) => ({ showTaskSidebar: !state.showTaskSidebar })),
}));
