/**
 * Conversation Analysis Utilities
 * Helper functions for analyzing conversation patterns
 */

import { Message } from '@/types';

export interface TopicAnalysis {
  topics: Set<string>;
  primaryTopic?: string;
  subjectCoverage: Record<string, number>; // Count per subject
}

export interface StruggleAnalysis {
  struggling: boolean;
  severity: 'mild' | 'moderate' | 'severe';
  patterns: string[];
  frustrationCount: number;
  helpRequests: number;
}

export interface EngagementAnalysis {
  level: 'high' | 'medium' | 'low';
  questionsAsked: number;
  averageLength: number;
  responseRate: number; // Percentage of AI messages that got a response
  enthusiasm: 'high' | 'medium' | 'low';
}

export interface ConversationAnalysis {
  topics: TopicAnalysis;
  struggles: StruggleAnalysis;
  engagement: EngagementAnalysis;
  totalMessages: number;
  studentMessages: number;
  aiMessages: number;
}

/**
 * Subject keyword mapping for topic extraction
 */
const SUBJECT_KEYWORDS = {
  math: [
    'math', 'algebra', 'geometry', 'calculus', 'fraction', 'equation',
    'number', 'multiply', 'divide', 'add', 'subtract', 'percentage',
    'decimal', 'ratio', 'proportion', 'exponent', 'root', 'polynomial'
  ],
  science: [
    'science', 'biology', 'chemistry', 'physics', 'experiment', 'molecule',
    'cell', 'energy', 'force', 'gravity', 'atom', 'compound', 'element',
    'reaction', 'photosynthesis', 'ecosystem'
  ],
  reading: [
    'reading', 'book', 'story', 'comprehension', 'paragraph', 'passage',
    'literature', 'novel', 'chapter', 'character', 'plot', 'theme'
  ],
  writing: [
    'writing', 'essay', 'paragraph', 'grammar', 'sentence', 'composition',
    'draft', 'edit', 'revise', 'thesis', 'argument'
  ],
  history: [
    'history', 'historical', 'civil war', 'revolution', 'ancient', 'modern',
    'century', 'era', 'period', 'event', 'president', 'government'
  ],
  english: [
    'metaphor', 'simile', 'poetry', 'noun', 'verb', 'adjective', 'language',
    'literary', 'figurative', 'alliteration', 'personification'
  ],
  sat: [
    'sat', 'standardized', 'test prep', 'college', 'admission', 'score'
  ],
};

/**
 * Frustration and struggle keywords
 */
const FRUSTRATION_KEYWORDS = [
  "don't understand", "confused", "don't get it", "hard", "difficult",
  "stuck", "lost", "can't figure", "makes no sense", "too complicated"
];

const HELP_KEYWORDS = [
  'help', 'explain', 'show me', 'how do i', 'what is', 'why is'
];

/**
 * Enthusiasm indicators
 */
const ENTHUSIASM_INDICATORS = {
  high: ['!', 'awesome', 'cool', 'wow', 'great', 'love', 'amazing', 'yes!', 'got it!'],
  low: ['ok', 'fine', 'whatever', 'idk', 'i guess', 'maybe'],
};

/**
 * Extract topics from conversation
 */
export function analyzeTopics(messages: Message[]): TopicAnalysis {
  const topics = new Set<string>();
  const subjectCoverage: Record<string, number> = {};
  
  messages.forEach((msg) => {
    const lowerMessage = msg.message.toLowerCase();
    
    Object.entries(SUBJECT_KEYWORDS).forEach(([subject, keywords]) => {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword));
      if (matches.length > 0) {
        topics.add(subject);
        subjectCoverage[subject] = (subjectCoverage[subject] || 0) + matches.length;
      }
    });
  });
  
  // Find primary topic (most mentioned)
  let primaryTopic: string | undefined;
  let maxCount = 0;
  
  Object.entries(subjectCoverage).forEach(([subject, count]) => {
    if (count > maxCount) {
      maxCount = count;
      primaryTopic = subject;
    }
  });
  
  return {
    topics,
    primaryTopic,
    subjectCoverage,
  };
}

/**
 * Detect struggle patterns
 */
export function analyzeStruggles(messages: Message[]): StruggleAnalysis {
  const studentMessages = messages.filter(m => m.speaker === 'student');
  const patterns: string[] = [];
  
  let frustrationCount = 0;
  let helpRequests = 0;
  let shortResponses = 0;
  let repeatedQuestions = 0;
  
  // Track question repetition
  const questions: string[] = [];
  
  studentMessages.forEach((msg, index) => {
    const lower = msg.message.toLowerCase();
    
    // Check for frustration
    if (FRUSTRATION_KEYWORDS.some(kw => lower.includes(kw))) {
      frustrationCount++;
    }
    
    // Check for help requests
    if (HELP_KEYWORDS.some(kw => lower.includes(kw))) {
      helpRequests++;
    }
    
    // Check for very short responses
    if (msg.message.trim().split(' ').length <= 3 && !msg.message.includes('?')) {
      shortResponses++;
    }
    
    // Check for repeated questions
    if (msg.message.includes('?')) {
      const questionCore = msg.message.toLowerCase().replace(/[?!.,]/g, '').trim();
      if (questions.some(q => q.includes(questionCore) || questionCore.includes(q))) {
        repeatedQuestions++;
      }
      questions.push(questionCore);
    }
  });
  
  // Determine patterns
  if (frustrationCount >= 3) {
    patterns.push('frequent expressions of confusion');
  } else if (frustrationCount >= 2) {
    patterns.push('expressing confusion');
  }
  
  if (shortResponses > studentMessages.length * 0.5) {
    patterns.push('giving brief responses');
  }
  
  if (helpRequests >= 3) {
    patterns.push('requesting frequent help');
  }
  
  if (repeatedQuestions >= 2) {
    patterns.push('asking similar questions repeatedly');
  }
  
  // Determine severity
  let severity: 'mild' | 'moderate' | 'severe' = 'mild';
  
  if (patterns.length >= 3 || frustrationCount >= 4) {
    severity = 'severe';
  } else if (patterns.length >= 2 || frustrationCount >= 3) {
    severity = 'moderate';
  }
  
  return {
    struggling: patterns.length > 0,
    severity,
    patterns,
    frustrationCount,
    helpRequests,
  };
}

/**
 * Analyze student engagement
 */
export function analyzeEngagement(messages: Message[]): EngagementAnalysis {
  const studentMessages = messages.filter(m => m.speaker === 'student');
  const aiMessages = messages.filter(m => m.speaker === 'ai');
  
  if (studentMessages.length === 0) {
    return {
      level: 'low',
      questionsAsked: 0,
      averageLength: 0,
      responseRate: 0,
      enthusiasm: 'low',
    };
  }
  
  // Count questions
  const questionsAsked = studentMessages.filter(msg => 
    msg.message.includes('?')
  ).length;
  
  // Calculate average length
  const totalLength = studentMessages.reduce(
    (sum, msg) => sum + msg.message.length, 0
  );
  const averageLength = Math.round(totalLength / studentMessages.length);
  
  // Calculate response rate (did student respond after AI message?)
  let responsesGiven = 0;
  messages.forEach((msg, index) => {
    if (msg.speaker === 'ai' && index < messages.length - 1) {
      if (messages[index + 1].speaker === 'student') {
        responsesGiven++;
      }
    }
  });
  const responseRate = aiMessages.length > 0 
    ? (responsesGiven / aiMessages.length) * 100 
    : 0;
  
  // Detect enthusiasm
  let enthusiasmScore = 0;
  studentMessages.forEach((msg) => {
    const lower = msg.message.toLowerCase();
    
    // High enthusiasm indicators
    ENTHUSIASM_INDICATORS.high.forEach(indicator => {
      if (lower.includes(indicator)) enthusiasmScore += 2;
    });
    
    // Low enthusiasm indicators
    ENTHUSIASM_INDICATORS.low.forEach(indicator => {
      if (lower.includes(indicator)) enthusiasmScore -= 1;
    });
  });
  
  const enthusiasm: 'high' | 'medium' | 'low' = 
    enthusiasmScore > 3 ? 'high' : 
    enthusiasmScore < -2 ? 'low' : 'medium';
  
  // Determine overall engagement level
  let level: 'high' | 'medium' | 'low' = 'medium';
  
  if (
    questionsAsked >= 3 && 
    averageLength > 50 && 
    responseRate > 80 &&
    enthusiasm === 'high'
  ) {
    level = 'high';
  } else if (
    questionsAsked <= 1 || 
    averageLength < 20 || 
    responseRate < 50
  ) {
    level = 'low';
  }
  
  return {
    level,
    questionsAsked,
    averageLength,
    responseRate: Math.round(responseRate),
    enthusiasm,
  };
}

/**
 * Comprehensive conversation analysis
 */
export function analyzeConversation(messages: Message[]): ConversationAnalysis {
  const topics = analyzeTopics(messages);
  const struggles = analyzeStruggles(messages);
  const engagement = analyzeEngagement(messages);
  
  const studentMessages = messages.filter(m => m.speaker === 'student').length;
  const aiMessages = messages.filter(m => m.speaker === 'ai').length;
  
  return {
    topics,
    struggles,
    engagement,
    totalMessages: messages.length,
    studentMessages,
    aiMessages,
  };
}

/**
 * Generate a human-readable summary from analysis
 */
export function generateSummary(analysis: ConversationAnalysis): string {
  const parts: string[] = [];
  
  // Topic summary
  if (analysis.topics.topics.size > 0) {
    const topicList = Array.from(analysis.topics.topics).join(', ');
    if (analysis.topics.primaryTopic) {
      parts.push(`Focused on ${analysis.topics.primaryTopic}, also covered ${topicList}`);
    } else {
      parts.push(`Discussed ${topicList}`);
    }
  } else {
    parts.push('Had general conversation');
  }
  
  // Engagement summary
  if (analysis.engagement.level === 'high') {
    parts.push(
      `Student was highly engaged (${analysis.engagement.questionsAsked} questions, ` +
      `${analysis.engagement.responseRate}% response rate)`
    );
  } else if (analysis.engagement.level === 'low') {
    parts.push(`Student showed low engagement (brief responses, few questions)`);
  } else {
    parts.push(`Student asked ${analysis.engagement.questionsAsked} questions`);
  }
  
  // Struggle summary
  if (analysis.struggles.struggling) {
    parts.push(
      `Student struggled (${analysis.struggles.severity} severity): ` +
      analysis.struggles.patterns.join(', ')
    );
  } else {
    parts.push('Student understanding concepts well');
  }
  
  return `[Previous conversation: ${parts.join('. ')}.]`;
}

