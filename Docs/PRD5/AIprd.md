# 🤖 AI Study Companion - AI Integration & Task Generation

**PRD v3 - Shard 5 of 12**

---

## 📖 Overview

This document specifies the OpenAI integration and intelligent task generation systems. These are the "brains" of the AI Study Companion, providing contextual conversations and adaptive learning tasks.

**OpenAI Integration:** GPT-4 powered conversations with context management  
**Task Generation:** Adaptive practice tasks across 3 types  
**Intelligence:** Age-appropriate responses and difficulty adaptation

---

## 🧠 OpenAI Integration Architecture

### Current State Check

**Phase 1 Status:**

- ✅ Basic `aiService.ts` exists
- ⚠️ Needs API key configuration
- ⚠️ Needs context window management
- ⚠️ Needs age-appropriate formatting
- ⚠️ Needs conversation summarization
- ⚠️ Needs token usage monitoring

**Phase 2 Goals:**

- Configure API key properly
- Implement rolling context window (10-15 messages)
- Add age-specific system prompts
- Build conversation summarization
- Optimize token usage
- Add error handling and retry logic

---

## 🔑 Environment Configuration

### Setup Instructions

**1. Environment Variables**

```bash
# .env.local
OPENAI_API_KEY=sk-proj-...your-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.8
OPENAI_CONTEXT_WINDOW_SIZE=15

# Optional: Token usage tracking
OPENAI_LOG_USAGE=true
OPENAI_COST_PER_TOKEN=0.00003
```

**2. Verification Script**

```typescript
// /scripts/verify-openai.ts
import OpenAI from "openai";

async function verifyConnection() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Hello!" }],
      max_tokens: 10,
    });

    console.log("✅ OpenAI connection successful!");
    console.log("Response:", response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error("❌ OpenAI connection failed:", error);
    return false;
  }
}

verifyConnection();
```

**3. Run Verification**

```bash
npm run verify-openai
# or
node --loader ts-node/esm scripts/verify-openai.ts
```

---

## 💬 Context Window Management

### Strategy

**Rolling Window Approach:**

- Keep last 10-15 messages in full detail
- Summarize older messages into context
- Include student profile information
- Reference recent session transcripts

**Why This Works:**

- Balances cost and quality
- Maintains conversational coherence
- Adapts to student's history
- Stays within token limits

---

### Context Structure

```typescript
interface ConversationContext {
  // Student Information
  studentProfile: {
    id: string;
    name: string;
    age: number;
    grade: number;
    learningStyle: string;
  };

  // Recent Messages (full detail)
  recentMessages: Message[]; // Last 10-15

  // Older History (summarized)
  conversationSummary?: string;

  // Session History
  recentSessions: Session[]; // Last 2-3 sessions

  // Current Context
  currentTopic: string;
  strugglingConcepts: string[];
  masteredConcepts: string[];

  // Goals & Progress
  activeGoals: Goal[];
  recentProgress: ProgressUpdate[];
}
```

---

### Age-Appropriate System Prompts

**Base Template:**

```typescript
const getSystemPrompt = (student: Student): string => {
  const basePrompt = `You are a friendly, encouraging AI tutor helping ${student.name}, a ${student.age}-year-old student.`;

  const ageGuidelines = getAgeGuidelines(student.age);
  const learningContext = getLearningContext(student);
  const safetyGuidelines = getSafetyGuidelines();

  return `${basePrompt}

${ageGuidelines}

${learningContext}

${safetyGuidelines}`;
};
```

**Age-Specific Guidelines:**

```typescript
const getAgeGuidelines = (age: number): string => {
  if (age <= 11) {
    // Ages 9-11: Elementary
    return `
COMMUNICATION STYLE:
- Use simple, everyday words (no complex vocabulary)
- Keep sentences short (under 15 words)
- Use lots of encouragement and positive reinforcement
- Include emojis occasionally (but not excessively)
- Relate concepts to games, toys, or everyday activities
- Ask simple yes/no or multiple choice questions
- Celebrate every small success enthusiastically

EXAMPLES:
Good: "Great job! Let's try another one. What's 5 + 3?"
Bad: "Let's proceed to the subsequent arithmetic problem."

EXPLANATIONS:
- Use concrete examples (apples, pizza, toys)
- Break down into tiny steps
- Repeat key concepts in different ways
- Use visual descriptions ("imagine a pizza cut into 4 slices...")
`;
  } else if (age <= 14) {
    // Ages 12-14: Middle School
    return `
COMMUNICATION STYLE:
- Use age-appropriate vocabulary (grade 6-8 level)
- Balance being friendly with being informative
- Use relatable examples (school life, hobbies, pop culture)
- Encourage self-reflection ("What do you think?")
- Challenge thinking without overwhelming
- Use occasional emojis for emphasis
- Acknowledge when things are difficult

EXAMPLES:
Good: "That's a tricky one! Let's break it down step by step."
Bad: "This is simple, you should know this."

EXPLANATIONS:
- Connect to real-world scenarios
- Encourage "why" and "how" thinking
- Build on prior knowledge
- Use metaphors and analogies
`;
  } else {
    // Ages 15-16: High School
    return `
COMMUNICATION STYLE:
- Use mature, academic language
- Challenge critical thinking and analysis
- Provide detailed explanations with real-world applications
- Encourage planning and goal-setting
- Ask open-ended questions
- Use minimal emojis (only for achievement celebrations)
- Treat as young adult, not child

EXAMPLES:
Good: "Let's analyze this problem. What patterns do you notice?"
Bad: "Wow! You're so smart! Here's a gold star! ⭐"

EXPLANATIONS:
- Discuss abstract concepts
- Encourage independent problem-solving
- Connect to college/career applications
- Use formal academic tone when appropriate
`;
  }
};
```

**Learning Context:**

```typescript
const getLearningContext = (student: Student): string => {
  const context = [];

  // Current topic
  if (student.currentTopic) {
    context.push(`CURRENT TOPIC: ${student.currentTopic}`);
  }

  // Struggling concepts
  if (student.strugglingConcepts?.length > 0) {
    context.push(`KNOWN STRUGGLES: ${student.strugglingConcepts.join(", ")}`);
    context.push(
      `Approach these topics with extra patience and alternative explanations.`
    );
  }

  // Recent session
  if (student.sessions.length > 0) {
    const lastSession = student.sessions[0];
    context.push(`LAST TUTORING SESSION: ${formatSessionSummary(lastSession)}`);
  }

  // Learning style
  if (student.learningStyle) {
    context.push(`LEARNING STYLE: ${student.learningStyle}`);
    context.push(getLearningStyleTips(student.learningStyle));
  }

  return context.join("\n\n");
};

const getLearningStyleTips = (style: string): string => {
  const tips = {
    visual: 'Use visual descriptions, diagrams, and "imagine..." scenarios.',
    auditory: "Use rhythm, rhymes, and verbal explanations.",
    kinesthetic: "Suggest hands-on activities and physical demonstrations.",
    reading: "Provide written examples and encourage note-taking.",
  };
  return tips[style] || "";
};
```

**Safety Guidelines:**

```typescript
const getSafetyGuidelines = (): string => {
  return `
SAFETY & CONTENT RULES:
1. NEVER provide answers to homework directly - guide thinking instead
2. NEVER discuss inappropriate topics (violence, adult content, etc.)
3. NEVER share or ask for personal information (address, phone, etc.)
4. NEVER encourage meeting people from the internet
5. If student seems distressed, suggest talking to parent/teacher/counselor
6. If student asks about self-harm, immediately encourage talking to trusted adult
7. Keep all content age-appropriate and educational

HOMEWORK HELPER MODE:
- Provide hints, not answers
- Ask guiding questions
- Break problems into smaller steps
- Example: If asked "What's 7 x 8?", respond with:
  ✓ "Let's think about it. What's 7 x 7? Can you add one more 7?"
  ✗ "The answer is 56."
`;
};
```

---

## 🔧 Enhanced AI Service

### Complete Implementation

```typescript
// /lib/services/aiService.ts
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import { Student, Message, ConversationContext } from "@/types";

class AIService {
  private openai: OpenAI;
  private contextWindowSize: number;
  private maxTokens: number;
  private temperature: number;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.contextWindowSize = parseInt(
      process.env.OPENAI_CONTEXT_WINDOW_SIZE || "15"
    );
    this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || "500");
    this.temperature = parseFloat(process.env.OPENAI_TEMPERATURE || "0.8");
  }

  /**
   * Generate AI response with full context management
   */
  async generateResponse(
    message: string,
    context: ConversationContext
  ): Promise<{
    content: string;
    usage: TokenUsage;
  }> {
    try {
      // Build system prompt
      const systemPrompt = this.buildSystemPrompt(context);

      // Build conversation history
      const conversationHistory = this.buildConversationHistory(context);

      // Create completion
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: message },
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        presence_penalty: 0.6, // Encourage diverse responses
        frequency_penalty: 0.3, // Reduce repetition
      });

      const content = response.choices[0].message.content || "";
      const usage = this.calculateUsage(response.usage);

      // Log usage if enabled
      if (process.env.OPENAI_LOG_USAGE === "true") {
        this.logUsage(context.studentProfile.id, usage);
      }

      return { content, usage };
    } catch (error) {
      console.error("OpenAI API Error:", error);
      return this.handleError(error);
    }
  }

  /**
   * Build complete system prompt with all context
   */
  private buildSystemPrompt(context: ConversationContext): string {
    const parts = [];

    // Base instruction with age-appropriate guidelines
    parts.push(getSystemPrompt(context.studentProfile));

    // Current context
    if (context.currentTopic) {
      parts.push(`\nCURRENT TOPIC: ${context.currentTopic}`);
    }

    // Struggling concepts
    if (context.strugglingConcepts.length > 0) {
      parts.push(`\nKNOWN STRUGGLES: ${context.strugglingConcepts.join(", ")}`);
      parts.push("Approach these topics with extra patience.");
    }

    // Recent session context
    if (context.recentSessions.length > 0) {
      const sessionSummary = this.summarizeRecentSessions(
        context.recentSessions
      );
      parts.push(`\nRECENT TUTORING SESSIONS:\n${sessionSummary}`);
    }

    // Conversation summary (older messages)
    if (context.conversationSummary) {
      parts.push(
        `\nPREVIOUS CONVERSATION SUMMARY:\n${context.conversationSummary}`
      );
    }

    return parts.join("\n");
  }

  /**
   * Build conversation history for API call
   */
  private buildConversationHistory(
    context: ConversationContext
  ): ChatCompletionMessageParam[] {
    const messages: ChatCompletionMessageParam[] = [];

    // Get recent messages (within context window)
    const recentMessages = context.recentMessages.slice(
      -this.contextWindowSize
    );

    // Convert to OpenAI format
    for (const msg of recentMessages) {
      messages.push({
        role: msg.speaker === "student" ? "user" : "assistant",
        content: msg.message,
      });
    }

    return messages;
  }

  /**
   * Summarize recent tutoring sessions
   */
  private summarizeRecentSessions(sessions: Session[]): string {
    const summaries = sessions.slice(0, 3).map((session) => {
      const date = new Date(session.date).toLocaleDateString();
      const topics = session.topicsCovered.map((t) => t.topic).join(", ");
      const struggles = session.strugglingConcepts.join(", ");

      return `${date} with ${session.tutorName}: Covered ${topics}. ${
        struggles
          ? `Struggled with: ${struggles}`
          : "Good understanding overall."
      }`;
    });

    return summaries.join("\n");
  }

  /**
   * Summarize older conversation messages
   */
  async summarizeConversation(messages: Message[]): Promise<string> {
    if (messages.length === 0) return "";

    // Simple keyword extraction for now
    // In production, could use GPT for better summarization
    const topics = new Set<string>();
    const struggles = new Set<string>();

    messages.forEach((msg) => {
      // Extract topics (very basic - improve in production)
      if (msg.message.toLowerCase().includes("fraction"))
        topics.add("fractions");
      if (msg.message.toLowerCase().includes("multiply"))
        topics.add("multiplication");
      if (msg.message.toLowerCase().includes("divide")) topics.add("division");

      // Detect struggles
      if (
        msg.speaker === "student" &&
        (msg.message.includes("difficult") ||
          msg.message.includes("hard") ||
          msg.message.includes("don't understand"))
      ) {
        // Extract the concept they're struggling with
        struggles.add("general concepts");
      }
    });

    const parts = [];
    if (topics.size > 0) {
      parts.push(`Previously discussed: ${Array.from(topics).join(", ")}`);
    }
    if (struggles.size > 0) {
      parts.push(
        `Student found challenging: ${Array.from(struggles).join(", ")}`
      );
    }

    return parts.join(". ");
  }

  /**
   * Calculate token usage and cost
   */
  private calculateUsage(usage: any): TokenUsage {
    const costPerToken = parseFloat(
      process.env.OPENAI_COST_PER_TOKEN || "0.00003"
    );

    return {
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      estimatedCost: usage.total_tokens * costPerToken,
    };
  }

  /**
   * Log usage for monitoring
   */
  private logUsage(studentId: string, usage: TokenUsage): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      studentId,
      ...usage,
    };

    console.log("OpenAI Usage:", logEntry);

    // In production, save to database
    // await usageLogService.save(logEntry);
  }

  /**
   * Handle API errors gracefully
   */
  private handleError(error: any): { content: string; usage: TokenUsage } {
    let content =
      "I'm having trouble thinking right now. Can you try asking again?";

    if (error?.status === 429) {
      content = "I'm thinking really hard! Give me a moment and try again.";
    } else if (error?.status === 401) {
      content =
        "Oops! I need to check my connection. Please let your teacher know.";
      console.error("OpenAI API Key Invalid!");
    }

    return {
      content,
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        estimatedCost: 0,
      },
    };
  }
}

// Export singleton instance
export const aiService = new AIService();

// Types
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}
```

---

## 📝 Task Generation System

### Overview

**Three Task Types:**

1. **Multiple Choice** - Quick knowledge checks (4 options)
2. **Open-Ended** - Written responses with AI grading
3. **Real-World** - Hands-on activities with reflection

**Adaptive Difficulty:**

- Easy: <40% topic progress or <3 attempts
- Medium: 40-70% progress
- Hard: >70% progress

---

### Task Type Specifications

#### 1. Multiple Choice Tasks

**Structure:**

```typescript
interface MultipleChoiceTask {
  id: string;
  type: "multiple_choice";
  subject: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";

  question: string;
  options: string[]; // Always 4 options: A, B, C, D
  correctAnswer: string; // The letter: 'A', 'B', 'C', or 'D'

  explanation: string; // Why this answer is correct
  hints: string[]; // 3 progressive hints

  points: number; // 5 for easy, 10 for medium, 15 for hard
  estimatedTime: number; // minutes
}
```

**Example:**

```typescript
{
  id: 'mc-fractions-001',
  type: 'multiple_choice',
  subject: 'Math',
  topic: 'Fractions',
  difficulty: 'easy',

  question: 'What is 1/2 + 1/4?',
  options: ['1/6', '2/6', '3/4', '1/8'],
  correctAnswer: 'C',

  explanation: '1/2 is the same as 2/4. When you add 2/4 + 1/4, you get 3/4!',
  hints: [
    'Try finding a common denominator',
    'Convert 1/2 to fourths',
    '1/2 is the same as 2/4'
  ],

  points: 5,
  estimatedTime: 2
}
```

**AI Generation Prompt:**

```typescript
const generateMultipleChoiceTask = async (
  topic: string,
  difficulty: string,
  age: number
): Promise<MultipleChoiceTask> => {
  const prompt = `Generate a ${difficulty} multiple choice question about ${topic} for a ${age}-year-old student.

Requirements:
- 1 clear question
- 4 answer options (A, B, C, D)
- 1 correct answer
- 3 plausible distractors (wrong but reasonable answers)
- Explanation of why the correct answer is right
- 3 progressive hints
- Use age-appropriate language

Format as JSON matching this structure:
{
  "question": "...",
  "options": ["A option", "B option", "C option", "D option"],
  "correctAnswer": "C",
  "explanation": "...",
  "hints": ["hint 1", "hint 2", "hint 3"]
}`;

  const response = await aiService.openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert educational content creator.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const generated = JSON.parse(response.choices[0].message.content);

  return {
    id: generateId(),
    type: "multiple_choice",
    subject: inferSubject(topic),
    topic,
    difficulty,
    ...generated,
    points: difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15,
    estimatedTime: 2,
  };
};
```

---

#### 2. Open-Ended Tasks

**Structure:**

```typescript
interface OpenEndedTask {
  id: string;
  type: "open_ended";
  subject: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";

  question: string;
  rubric: {
    keyPoints: string[]; // Points that should be mentioned
    minLength: number; // Minimum word count
    maxLength?: number; // Optional maximum
  };

  sampleAnswer?: string; // Example of good answer
  hints: string[];

  points: number; // 10 for easy, 15 for medium, 20 for hard
  estimatedTime: number;
}
```

**Example:**

```typescript
{
  id: 'oe-science-001',
  type: 'open_ended',
  subject: 'Science',
  topic: 'Photosynthesis',
  difficulty: 'medium',

  question: 'Explain how photosynthesis helps plants grow. Use at least 3 sentences.',

  rubric: {
    keyPoints: [
      'Mentions sunlight/light',
      'Mentions water and CO2',
      'Mentions glucose/sugar/energy production',
      'Mentions oxygen as byproduct'
    ],
    minLength: 50,
    maxLength: 200
  },

  sampleAnswer: 'Plants use sunlight, water, and carbon dioxide to make their own food through photosynthesis. This process creates glucose (sugar) that gives plants energy to grow. As a bonus, plants release oxygen that we breathe!',

  hints: [
    'Think about what plants need from their environment',
    'What do plants make that gives them energy?',
    'What do plants release that we breathe?'
  ],

  points: 15,
  estimatedTime: 5
}
```

**AI Grading:**

```typescript
const gradeOpenEndedTask = async (
  task: OpenEndedTask,
  studentAnswer: string,
  studentAge: number
): Promise<{
  score: number; // 0-100
  feedback: string;
  keyPointsFound: string[];
  suggestions: string[];
}> => {
  const prompt = `Grade this student answer for a ${studentAge}-year-old:

Question: ${task.question}

Student Answer: "${studentAnswer}"

Rubric - Check for these key points:
${task.rubric.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}

Minimum length: ${task.rubric.minLength} words
Student answer length: ${studentAnswer.split(" ").length} words

Provide:
1. Score (0-100)
2. Which key points were found
3. Encouraging feedback (age-appropriate)
4. 1-2 suggestions for improvement

Format as JSON:
{
  "score": 85,
  "keyPointsFound": ["point 1", "point 3"],
  "feedback": "Great job! You explained...",
  "suggestions": ["Try adding...", "Consider mentioning..."]
}`;

  const response = await aiService.openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an encouraging teacher grading student work.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};
```

---

#### 3. Real-World Tasks

**Structure:**

```typescript
interface RealWorldTask {
  id: string;
  type: "real_world";
  subject: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";

  activity: string; // Short title
  instructions: string[]; // Step-by-step instructions

  verificationQuestions: string[]; // To confirm completion
  reflectionPrompt: string; // "What did you learn?"

  materials?: string[]; // Optional materials needed
  safetyNotes?: string[]; // Safety considerations

  points: number; // 15 for easy, 20 for medium, 25 for hard
  estimatedTime: number;
}
```

**Example:**

```typescript
{
  id: 'rw-math-001',
  type: 'real_world',
  subject: 'Math',
  topic: 'Fractions',
  difficulty: 'easy',

  activity: 'Fraction Hunt at Home',

  instructions: [
    'Find 3 objects in your house that can be divided into equal parts',
    'Use paper or the objects themselves to show halves and quarters',
    'Take a photo or draw what you found',
    'Try to create thirds if you can!'
  ],

  verificationQuestions: [
    'What objects did you find?',
    'Which fraction was easiest to show? Why?',
    'Which fraction was hardest? Why?'
  ],

  reflectionPrompt: 'What did you learn about fractions from this activity?',

  materials: ['Paper', 'Pencil or markers', 'Household objects'],

  safetyNotes: ['Ask a parent before using any objects'],

  points: 15,
  estimatedTime: 15
}
```

---

### Adaptive Task Assignment

**Difficulty Determination:**

```typescript
const determineTaskDifficulty = (
  student: Student,
  topic: string
): "easy" | "medium" | "hard" => {
  // Find topic progress
  const topicData = student.goals
    .flatMap((g) => g.topics)
    .find((t) => t.name === topic);

  if (!topicData) {
    return "easy"; // New topic
  }

  const progress = topicData.progress;
  const recentAttempts =
    topicData.subConcepts?.reduce((sum, sc) => sum + sc.attemptsTotal, 0) || 0;

  // Decision logic
  if (progress < 40 || recentAttempts < 3) {
    return "easy";
  } else if (progress < 70) {
    return "medium";
  } else {
    return "hard";
  }
};
```

**Task Assignment Strategy:**

```typescript
const assignTasks = async (student: Student): Promise<Task[]> => {
  const tasks: Task[] = [];

  // Get active goals (not completed)
  const activeGoals = student.goals.filter((g) => g.progress < 100);

  for (const goal of activeGoals) {
    // Find topics that need practice
    const needsPractice = goal.topics
      .filter((t) => t.progress < 80)
      .sort((a, b) => a.progress - b.progress); // Prioritize lower progress

    // Take top 2 topics per goal
    for (const topic of needsPractice.slice(0, 2)) {
      const difficulty = determineTaskDifficulty(student, topic.name);

      // Mix of task types
      const taskTypes: TaskType[] = [
        "multiple_choice",
        "open_ended",
        "real_world",
      ];

      // Randomize but weight based on age
      const selectedType = selectTaskType(taskTypes, student.age, difficulty);

      // Generate task
      const task = await generateTask(
        topic.name,
        selectedType,
        difficulty,
        student.age
      );

      tasks.push(task);
    }
  }

  // Limit to 5 tasks at a time (prevent overwhelm)
  return tasks.slice(0, 5);
};

/**
 * Select task type based on age and difficulty
 */
const selectTaskType = (
  types: TaskType[],
  age: number,
  difficulty: string
): TaskType => {
  // Younger students: More multiple choice
  if (age <= 11) {
    const weights = {
      multiple_choice: 0.5,
      open_ended: 0.3,
      real_world: 0.2,
    };
    return weightedRandom(types, weights);
  }

  // Middle school: Balanced
  if (age <= 14) {
    const weights = {
      multiple_choice: 0.4,
      open_ended: 0.4,
      real_world: 0.2,
    };
    return weightedRandom(types, weights);
  }

  // High school: More open-ended
  const weights = {
    multiple_choice: 0.3,
    open_ended: 0.5,
    real_world: 0.2,
  };
  return weightedRandom(types, weights);
};
```

---

## 🎓 Task Service Implementation

```typescript
// /lib/services/taskService.ts
import { aiService } from "./aiService";
import { Student, Task, TaskType } from "@/types";

export const taskService = {
  /**
   * Generate a single task
   */
  async generateTask(
    topic: string,
    type: TaskType,
    difficulty: "easy" | "medium" | "hard",
    age: number
  ): Promise<Task> {
    switch (type) {
      case "multiple_choice":
        return await this.generateMultipleChoiceTask(topic, difficulty, age);
      case "open_ended":
        return await this.generateOpenEndedTask(topic, difficulty, age);
      case "real_world":
        return await this.generateRealWorldTask(topic, difficulty, age);
    }
  },

  /**
   * Assign tasks to a student
   */
  async assignTasks(student: Student): Promise<Task[]> {
    return await assignTasks(student);
  },

  /**
   * Grade a task submission
   */
  async gradeTask(
    task: Task,
    studentAnswer: string,
    student: Student
  ): Promise<TaskGrading> {
    if (task.type === "multiple_choice") {
      return this.gradeMultipleChoice(task, studentAnswer);
    } else if (task.type === "open_ended") {
      return await gradeOpenEndedTask(task, studentAnswer, student.age);
    } else {
      // Real-world tasks use verification questions
      return await this.gradeRealWorldTask(task, studentAnswer, student.age);
    }
  },

  /**
   * Grade multiple choice (simple)
   */
  gradeMultipleChoice(task: MultipleChoiceTask, answer: string): TaskGrading {
    const correct = answer.toUpperCase() === task.correctAnswer.toUpperCase();

    return {
      score: correct ? 100 : 0,
      correct,
      feedback: correct
        ? `🎉 Correct! ${task.explanation}`
        : `Not quite. ${task.hints[0]}`,
      suggestions: correct ? [] : [task.hints[1]],
    };
  },

  /**
   * Get hints for a task
   */
  getHint(task: Task, hintLevel: number): string {
    if (hintLevel >= task.hints.length) {
      return task.hints[task.hints.length - 1];
    }
    return task.hints[hintLevel];
  },

  /**
   * Check if student needs more practice
   */
  needsMorePractice(student: Student, topic: string): boolean {
    const topicData = student.goals
      .flatMap((g) => g.topics)
      .find((t) => t.name === topic);

    if (!topicData) return true;

    // Need practice if:
    // - Progress < 70%
    // - Recent success rate < 60%
    const recentTasks =
      student.taskHistory?.filter((t) => t.topic === topic).slice(-5) || [];

    if (recentTasks.length === 0) return true;

    const successRate =
      recentTasks.filter((t) => t.status === "complete").length /
      recentTasks.length;

    return topicData.progress < 70 || successRate < 0.6;
  },
};

// Types
interface TaskGrading {
  score: number; // 0-100
  correct?: boolean; // For multiple choice
  feedback: string;
  suggestions: string[];
  keyPointsFound?: string[]; // For open-ended
}
```

---

## 🔍 Conversation Monitoring

### Struggle Detection

```typescript
const detectStruggle = (
  conversation: Message[],
  topic: string
): StruggleIndicators => {
  const indicators = {
    repeatedIncorrect: 0,
    expressedConfusion: 0,
    requestedHelp: 0,
    offTopic: 0,
  };

  // Analyze recent messages (last 10)
  const recentMessages = conversation.slice(-10);

  for (const msg of recentMessages) {
    if (msg.speaker === "student") {
      // Check for confusion keywords
      const confusionKeywords = [
        "don't understand",
        "confused",
        "hard",
        "difficult",
        "don't get it",
        "stuck",
      ];

      if (
        confusionKeywords.some((kw) => msg.message.toLowerCase().includes(kw))
      ) {
        indicators.expressedConfusion++;
      }

      // Check for help requests
      if (msg.message.toLowerCase().includes("help")) {
        indicators.requestedHelp++;
      }
    }
  }

  return indicators;
};

const shouldSuggestTutor = (indicators: StruggleIndicators): boolean => {
  // Suggest tutor if:
  // - Expressed confusion 3+ times
  // - Requested help 2+ times
  // - Combined indicators >= 4

  return (
    indicators.expressedConfusion >= 3 ||
    indicators.requestedHelp >= 2 ||
    indicators.expressedConfusion + indicators.requestedHelp >= 4
  );
};
```

---

## ⚡ Performance Optimization

### Token Usage Optimization

**1. Caching Strategies:**

```typescript
// Cache frequently used prompts
const promptCache = new Map<string, string>();

const getCachedSystemPrompt = (studentId: string, age: number): string => {
  const cacheKey = `${studentId}-${age}`;

  if (!promptCache.has(cacheKey)) {
    const prompt = getSystemPrompt({ age } as Student);
    promptCache.set(cacheKey, prompt);
  }

  return promptCache.get(cacheKey)!;
};
```

**2. Batch Operations:**

```typescript
// Generate multiple tasks in one call
const generateTaskBatch = async (requests: TaskRequest[]): Promise<Task[]> => {
  const prompt = `Generate ${
    requests.length
  } tasks with these specifications:\n\n${requests
    .map((r, i) => `${i + 1}. ${r.topic} (${r.difficulty}, ${r.type})`)
    .join("\n")}\n\nFormat as JSON array.`;

  // Single API call for multiple tasks
  const response = await aiService.openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert educational content creator.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content).tasks;
};
```

**3. Response Streaming:**

```typescript
// Stream responses for better UX
const streamResponse = async (
  message: string,
  context: ConversationContext,
  onChunk: (chunk: string) => void
): Promise<void> => {
  const stream = await aiService.openai.chat.completions.create({
    model: "gpt-4",
    messages: [...buildMessages(context, message)],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      onChunk(content);
    }
  }
};
```

---

## ✅ Acceptance Criteria

### OpenAI Integration

- [ ] API key configured in `.env.local`
- [ ] Connection verification script runs successfully
- [ ] aiService connects to OpenAI without errors
- [ ] Error handling displays friendly messages
- [ ] Retry logic works on transient failures

### Context Management

- [ ] Rolling window maintains last 15 messages
- [ ] Older messages summarized correctly
- [ ] Student profile information included
- [ ] Recent session context referenced
- [ ] Token usage stays within limits

### Age-Appropriate Responses

- [ ] Lucas (9): Simple words, short sentences, encouraging
- [ ] Eva (12): Balanced tone, appropriate complexity
- [ ] Pat (16): Academic language, detailed explanations
- [ ] All ages: Proper emoji usage
- [ ] Safety guidelines followed

### Task Generation

- [ ] Multiple choice tasks generate correctly
- [ ] 4 options with 1 correct answer
- [ ] Plausible distractors (not obviously wrong)
- [ ] Open-ended tasks include rubric
- [ ] Real-world tasks have clear instructions
- [ ] Difficulty adapts to student progress
- [ ] Task types mixed appropriately
- [ ] Age-appropriate content and language

### Task Grading

- [ ] Multiple choice graded instantly
- [ ] Open-ended graded by AI
- [ ] Feedback is encouraging and specific
- [ ] Hints progressive (not giving away answer)
- [ ] Real-world verification questions work

### Performance

- [ ] Response time < 3 seconds average
- [ ] Token usage logged correctly
- [ ] Cost estimation accurate
- [ ] Batch operations reduce API calls
- [ ] Caching reduces redundant prompts

---

## 📚 Related Documents

**Shard Navigation:**

- **← Previous:** Shard 4 (Achievements & Gamification)
- **→ Next:** Shard 6 (Retention Features)

**Related Shards:**

- Shard 2: Design System (UI for tasks)
- Shard 3: Authentication (student context)
- Shard 7: Social & Tutor (struggle detection)
- Shard 10: Implementation Roadmap (Week 1, Day 4)

---

**End of AI Integration & Task Generation Shard**
