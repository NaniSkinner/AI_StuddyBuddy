/**
 * Task Generation Prompts for OpenAI
 * Structured prompts for generating different types of practice tasks
 */

import { TaskDifficulty } from "@/types";

/**
 * Difficulty Guidelines
 * Maps difficulty levels to age-appropriate characteristics
 */
export const DIFFICULTY_GUIDELINES = {
  easy: {
    child: "Simple, straightforward questions. Use familiar concepts. One-step problems.",
    teen: "Basic application of concepts. Clear, direct questions. Minimal complexity.",
    young_adult:
      "Foundational knowledge check. Standard problem formats. Core concepts only.",
  },
  medium: {
    child:
      "Requires combining 2-3 concepts. May need some thinking. Similar to class examples.",
    teen: "Multi-step problems. Requires reasoning. May need to connect ideas.",
    young_adult:
      "Application of multiple concepts. Analytical thinking required. Standard complexity.",
  },
  hard: {
    child:
      "Challenging but achievable. Requires creative thinking. May need hints. Novel situations.",
    teen: "Complex multi-step problems. Critical thinking needed. May involve unfamiliar contexts.",
    young_adult:
      "Advanced application. Deep analysis required. May involve abstract concepts. SAT/AP level.",
  },
};

/**
 * Get age group from student age
 */
function getAgeGroup(age: number): "child" | "teen" | "young_adult" {
  if (age <= 11) return "child";
  if (age <= 14) return "teen";
  return "young_adult";
}

/**
 * Multiple Choice Task Generation Prompt
 */
export function getMultipleChoicePrompt(
  topic: string,
  difficulty: TaskDifficulty,
  age: number,
  subject: string
): string {
  const ageGroup = getAgeGroup(age);
  const difficultyGuide = DIFFICULTY_GUIDELINES[difficulty][ageGroup];

  return `Generate a ${difficulty} multiple choice question for a ${age}-year-old student.

SUBJECT: ${subject}
TOPIC: ${topic}
DIFFICULTY: ${difficulty}
AGE GROUP: ${ageGroup} (${age} years old)

DIFFICULTY GUIDELINES FOR THIS LEVEL:
${difficultyGuide}

REQUIREMENTS:
1. Question must be age-appropriate and engaging
2. Question must be directly related to ${topic}
3. Provide EXACTLY 4 answer options (A, B, C, D)
4. ONE option must be clearly correct
5. The other 3 options should be plausible but incorrect (good distractors)
6. Distractors should represent common misconceptions or mistakes
7. Provide a clear explanation of why the correct answer is right
8. Provide 3 progressive hints (from gentle to more direct)
9. Use appropriate language complexity for age ${age}

RESPONSE FORMAT (must be valid JSON):
{
  "question": "The question text here...",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctAnswer": "A" (or B, C, D),
  "explanation": "Explanation of why this answer is correct and others are wrong...",
  "hints": [
    "Hint 1: Gentle nudge in the right direction...",
    "Hint 2: More specific guidance...",
    "Hint 3: Almost gives away the answer..."
  ]
}

EXAMPLES OF GOOD DISTRACTORS:
- Common calculation errors
- Misconceptions about the concept
- Answers that result from forgetting a step
- Plausible but slightly incorrect facts

Generate the question now:`;
}

/**
 * Open-Ended Task Generation Prompt
 */
export function getOpenEndedPrompt(
  topic: string,
  difficulty: TaskDifficulty,
  age: number,
  subject: string
): string {
  const ageGroup = getAgeGroup(age);
  const difficultyGuide = DIFFICULTY_GUIDELINES[difficulty][ageGroup];

  const wordCounts = {
    easy: { child: 30, teen: 50, young_adult: 75 },
    medium: { child: 50, teen: 100, young_adult: 150 },
    hard: { child: 75, teen: 150, young_adult: 250 },
  };

  const minWords = wordCounts[difficulty][ageGroup];

  return `Generate a ${difficulty} open-ended question for a ${age}-year-old student.

SUBJECT: ${subject}
TOPIC: ${topic}
DIFFICULTY: ${difficulty}
AGE GROUP: ${ageGroup} (${age} years old)

DIFFICULTY GUIDELINES FOR THIS LEVEL:
${difficultyGuide}

REQUIREMENTS:
1. Question should encourage explanation and reasoning
2. Question must be age-appropriate and engaging
3. Should have 3-5 key points that a good answer would include
4. Minimum word count should be approximately ${minWords} words
5. Provide a sample answer (optional but helpful)
6. Provide 3 progressive hints
7. Use appropriate language complexity for age ${age}

RESPONSE FORMAT (must be valid JSON):
{
  "question": "The question text here...",
  "rubric": {
    "keyPoints": [
      "Key point 1 that should be mentioned...",
      "Key point 2 that should be mentioned...",
      "Key point 3 that should be mentioned...",
      "Optional: Key point 4...",
      "Optional: Key point 5..."
    ],
    "minLength": ${minWords},
    "maxLength": ${minWords * 3}
  },
  "sampleAnswer": "An example of a good answer that includes all key points...",
  "hints": [
    "Hint 1: Think about...",
    "Hint 2: Consider...",
    "Hint 3: Remember that..."
  ]
}

Generate the question now:`;
}

/**
 * Real-World Task Generation Prompt
 */
export function getRealWorldPrompt(
  topic: string,
  difficulty: TaskDifficulty,
  age: number,
  subject: string
): string {
  const ageGroup = getAgeGroup(age);
  const difficultyGuide = DIFFICULTY_GUIDELINES[difficulty][ageGroup];

  return `Generate a ${difficulty} real-world hands-on activity for a ${age}-year-old student.

SUBJECT: ${subject}
TOPIC: ${topic}
DIFFICULTY: ${difficulty}
AGE GROUP: ${ageGroup} (${age} years old)

DIFFICULTY GUIDELINES FOR THIS LEVEL:
${difficultyGuide}

REQUIREMENTS:
1. Activity must be hands-on and practical
2. Activity must be safe and age-appropriate
3. Materials should be common household items when possible
4. Provide 3-5 clear step-by-step instructions
5. Include 3 verification questions to check understanding
6. Include a reflection prompt
7. If any safety concerns, include safety notes
8. Activity should take 15-30 minutes

RESPONSE FORMAT (must be valid JSON):
{
  "activity": "Short title of the activity",
  "instructions": [
    "Step 1: Clear instruction...",
    "Step 2: Clear instruction...",
    "Step 3: Clear instruction...",
    "Optional: Step 4...",
    "Optional: Step 5..."
  ],
  "verificationQuestions": [
    "Question 1 to check they did the activity...",
    "Question 2 to check understanding...",
    "Question 3 to check learning..."
  ],
  "reflectionPrompt": "A thoughtful question about what they learned...",
  "materials": [
    "Material 1",
    "Material 2",
    "Material 3"
  ],
  "safetyNotes": [
    "Optional: Safety note if needed...",
    "Optional: Parent supervision note..."
  ]
}

ACTIVITY SHOULD BE:
- Engaging and fun
- Educational and tied to ${topic}
- Safe for a ${age}-year-old
- Doable at home with minimal setup
- Result in observable learning

Generate the activity now:`;
}

/**
 * AI Grading Prompt for Open-Ended Tasks
 */
export function getOpenEndedGradingPrompt(
  question: string,
  studentAnswer: string,
  rubric: {
    keyPoints: string[];
    minLength: number;
    maxLength?: number;
  },
  age: number
): string {
  const ageGroup = getAgeGroup(age);

  return `Grade this open-ended answer from a ${age}-year-old student.

QUESTION:
${question}

STUDENT'S ANSWER:
${studentAnswer}

RUBRIC - KEY POINTS TO LOOK FOR:
${rubric.keyPoints.map((point, i) => `${i + 1}. ${point}`).join("\n")}

MINIMUM WORD COUNT: ${rubric.minLength}
${rubric.maxLength ? `MAXIMUM WORD COUNT: ${rubric.maxLength}` : ""}

GRADING INSTRUCTIONS:
1. Check which key points from the rubric are addressed
2. Award points proportionally (each key point = ${Math.round(100 / rubric.keyPoints.length)} points)
3. Check if answer meets minimum length requirement
4. Consider effort and engagement (be encouraging for younger students)
5. Provide constructive, age-appropriate feedback
6. Suggest 1-2 specific ways to improve
7. Be encouraging even if the answer is incomplete

RESPONSE FORMAT (must be valid JSON):
{
  "score": 0-100,
  "isCorrect": true/false (true if score >= 70),
  "keyPointsFound": ["Key point 1", "Key point 2", ...],
  "feedback": "Encouraging, age-appropriate feedback...",
  "suggestions": [
    "Specific suggestion 1...",
    "Specific suggestion 2..."
  ]
}

TONE FOR ${ageGroup.toUpperCase()}:
- Be encouraging and positive
- Point out what they did well first
- Gently guide them toward missing elements
- Use age-appropriate language
- Celebrate effort and thinking

Grade the answer now:`;
}

/**
 * AI Grading Prompt for Real-World Tasks
 */
export function getRealWorldGradingPrompt(
  activity: string,
  verificationQuestions: string[],
  studentResponses: string[],
  reflectionPrompt: string,
  reflectionResponse: string,
  age: number
): string {
  const ageGroup = getAgeGroup(age);

  return `Grade this real-world activity completion from a ${age}-year-old student.

ACTIVITY: ${activity}

VERIFICATION QUESTIONS & STUDENT RESPONSES:
${verificationQuestions
  .map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${studentResponses[i] || "No response"}`)
  .join("\n\n")}

REFLECTION QUESTION: ${reflectionPrompt}
REFLECTION RESPONSE: ${reflectionResponse || "No response"}

GRADING INSTRUCTIONS:
1. Check if all verification questions were answered
2. Assess if responses show the activity was completed
3. Evaluate understanding shown in responses
4. Check reflection quality (shows learning/thought)
5. Be generous - hands-on learning is about engagement
6. Provide encouraging feedback
7. Award completion points if they clearly did the activity

RESPONSE FORMAT (must be valid JSON):
{
  "score": 0-100,
  "isCorrect": true/false (true if score >= 70),
  "feedback": "Encouraging feedback about their work...",
  "suggestions": [
    "Optional: Suggestion for deeper exploration...",
    "Optional: Related activity they could try..."
  ]
}

TONE FOR ${ageGroup.toUpperCase()}:
- Celebrate their hands-on effort
- Encourage curiosity and exploration
- Praise specific observations or insights
- Use enthusiastic, supportive language

Grade the activity completion now:`;
}

