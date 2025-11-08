/**
 * Prompt Cache System
 *
 * Caches system prompts and common task generation prompts to reduce
 * redundant API calls and improve response times.
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  hits: number;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache entries
}

export class PromptCache<T = string> {
  private cache: Map<string, CacheEntry<T>>;
  private config: CacheConfig;
  private hitCount: number = 0;
  private missCount: number = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new Map();
    this.config = {
      ttl: config.ttl || 1000 * 60 * 60, // Default: 1 hour
      maxSize: config.maxSize || 100, // Default: 100 entries
    };
  }

  /**
   * Get a cached value by key
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.missCount++;
      return null;
    }

    // Check if entry has expired
    const age = Date.now() - entry.timestamp;
    if (age > this.config.ttl) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    // Update hit count and return value
    entry.hits++;
    this.hitCount++;
    return entry.value;
  }

  /**
   * Set a value in the cache
   */
  set(key: string, value: T): void {
    // Enforce max size by removing oldest entry
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.findOldestEntry();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      hits: 0,
    });
  }

  /**
   * Check if a key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove a specific entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * Invalidate all entries matching a pattern
   */
  invalidatePattern(pattern: RegExp): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate =
      totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: hitRate.toFixed(2) + "%",
      ttl: this.config.ttl,
    };
  }

  /**
   * Get all cache entries (for debugging)
   */
  getEntries(): Array<{ key: string; age: number; hits: number }> {
    const now = Date.now();
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      hits: entry.hits,
    }));
  }

  /**
   * Find the oldest cache entry
   */
  private findOldestEntry(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      if (age > this.config.ttl) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }
}

// ============================================================================
// Global Cache Instances
// ============================================================================

/**
 * Cache for system prompts (by studentId)
 * TTL: 1 hour (prompts rarely change during a session)
 */
export const systemPromptCache = new PromptCache<string>({
  ttl: 1000 * 60 * 60, // 1 hour
  maxSize: 50, // Up to 50 students
});

/**
 * Cache for task generation prompts (by topic/difficulty/type)
 * TTL: 30 minutes (allow for some variety)
 */
export const taskPromptCache = new PromptCache<string>({
  ttl: 1000 * 60 * 30, // 30 minutes
  maxSize: 200, // Many combinations of subject/topic/difficulty/type
});

/**
 * Cache for generated tasks (by hash of request)
 * TTL: 15 minutes (tasks should be fairly fresh)
 */
export const taskResponseCache = new PromptCache<any>({
  ttl: 1000 * 60 * 15, // 15 minutes
  maxSize: 100,
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a cache key for system prompts
 */
export function getSystemPromptCacheKey(
  studentId: string,
  age: number
): string {
  return `system:${studentId}:${age}`;
}

/**
 * Generate a cache key for task prompts
 */
export function getTaskPromptCacheKey(
  subject: string,
  topic: string,
  difficulty: string,
  type: string,
  age: number
): string {
  return `task:${subject}:${topic}:${difficulty}:${type}:${age}`;
}

/**
 * Generate a cache key for task responses
 */
export function getTaskResponseCacheKey(params: {
  studentId: string;
  subject: string;
  topic: string;
  difficulty: string;
  type: string;
}): string {
  const hash = JSON.stringify(params);
  return `response:${hash}`;
}

/**
 * Invalidate all cache entries for a specific student
 * (useful when student data changes)
 */
export function invalidateStudentCache(studentId: string): void {
  systemPromptCache.invalidatePattern(new RegExp(`^system:${studentId}:`));
  taskResponseCache.invalidatePattern(new RegExp(`"studentId":"${studentId}"`));

  console.log(`🗑️  Cache invalidated for student: ${studentId}`);
}

/**
 * Invalidate all task caches for a specific subject/topic
 * (useful when learning goals change)
 */
export function invalidateTopicCache(subject: string, topic?: string): void {
  const pattern = topic
    ? new RegExp(`^task:${subject}:${topic}:`)
    : new RegExp(`^task:${subject}:`);

  const removed = taskPromptCache.invalidatePattern(pattern);
  console.log(
    `🗑️  Cache invalidated: ${removed} entries for ${subject}${
      topic ? "/" + topic : ""
    }`
  );
}

/**
 * Get combined cache statistics
 */
export function getAllCacheStats() {
  return {
    systemPrompts: systemPromptCache.getStats(),
    taskPrompts: taskPromptCache.getStats(),
    taskResponses: taskResponseCache.getStats(),
  };
}

/**
 * Clean up all expired cache entries
 */
export function cleanupAllCaches(): void {
  const removed = {
    systemPrompts: systemPromptCache.cleanup(),
    taskPrompts: taskPromptCache.cleanup(),
    taskResponses: taskResponseCache.cleanup(),
  };

  const total =
    removed.systemPrompts + removed.taskPrompts + removed.taskResponses;
  if (total > 0) {
    console.log(`🧹 Cache cleanup: removed ${total} expired entries`, removed);
  }
}

// Auto-cleanup every 10 minutes
if (typeof window === "undefined") {
  // Only run in Node.js environment (server-side)
  setInterval(cleanupAllCaches, 1000 * 60 * 10);
}
