import { BookingRequest, HandoffNotes } from "@/types";
import { promises as fs } from "fs";
import path from "path";

// For Phase 1, store bookings in memory
// Phase 2 will persist to database
const bookingsCache = new Map<string, BookingRequest>();

/**
 * Create a new booking request
 */
export async function createBookingRequest(
  request: BookingRequest
): Promise<BookingRequest> {
  try {
    bookingsCache.set(request.id, request);
    return request;
  } catch (error) {
    console.error("Error creating booking request:", error);
    throw error;
  }
}

/**
 * Get booking request by ID
 */
export async function getBookingById(
  bookingId: string
): Promise<BookingRequest | null> {
  try {
    return bookingsCache.get(bookingId) || null;
  } catch (error) {
    console.error(`Error getting booking ${bookingId}:`, error);
    return null;
  }
}

/**
 * Get all booking requests for a student
 */
export async function getBookingsByStudent(
  studentId: string
): Promise<BookingRequest[]> {
  try {
    return Array.from(bookingsCache.values()).filter(
      (b) => b.studentId === studentId
    );
  } catch (error) {
    console.error(`Error getting bookings for student ${studentId}:`, error);
    return [];
  }
}

/**
 * Get all booking requests for a tutor
 */
export async function getBookingsByTutor(
  tutorId: string
): Promise<BookingRequest[]> {
  try {
    return Array.from(bookingsCache.values()).filter(
      (b) => b.tutorId === tutorId
    );
  } catch (error) {
    console.error(`Error getting bookings for tutor ${tutorId}:`, error);
    return [];
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: "pending" | "confirmed" | "cancelled"
): Promise<BookingRequest | null> {
  try {
    const booking = bookingsCache.get(bookingId);
    if (!booking) return null;

    booking.status = status;
    bookingsCache.set(bookingId, booking);
    return booking;
  } catch (error) {
    console.error(`Error updating booking ${bookingId}:`, error);
    return null;
  }
}

/**
 * Generate AI handoff notes from conversation context
 * This is a placeholder - will be enhanced in Phase 5 with actual AI analysis
 */
export function generateHandoffNotes(
  strugglingConcepts: string[],
  attempts: Array<{ correct: boolean; topic: string }>,
  context: string
): HandoffNotes {
  // Calculate attempt summary
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.correct).length;
  const successRate =
    totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  const attemptsSummary = `Student attempted ${totalAttempts} problems with ${successRate}% success rate. ${
    totalAttempts - correctAttempts
  } incorrect attempts.`;

  // Generate suggested focus
  const suggestedFocus =
    strugglingConcepts.length > 0
      ? `Focus on: ${strugglingConcepts.join(
          ", "
        )}. Recommend visual models and real-world examples.`
      : "Student is making progress but needs reinforcement on key concepts.";

  return {
    strugglingConcepts,
    attemptsSummary,
    suggestedFocus,
  };
}

/**
 * Create booking request with AI-generated handoff notes
 */
export async function createBookingWithHandoff(
  studentId: string,
  tutorId: string,
  topic: string,
  reason: string,
  strugglingConcepts: string[],
  attempts: Array<{ correct: boolean; topic: string }>,
  context: string = ""
): Promise<BookingRequest> {
  try {
    const bookingId = `booking-${studentId}-${Date.now()}`;

    const handoffNotes = generateHandoffNotes(
      strugglingConcepts,
      attempts,
      context
    );

    const booking: BookingRequest = {
      id: bookingId,
      studentId,
      tutorId,
      requestedTopic: topic,
      reason,
      preferredTimes: [
        // Generate some default preferred times (next 3 days, afternoon slots)
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      ],
      status: "pending",
      createdAt: new Date().toISOString(),
      handoffNotes,
    };

    return await createBookingRequest(booking);
  } catch (error) {
    console.error("Error creating booking with handoff:", error);
    throw error;
  }
}

/**
 * Get pending booking requests
 */
export async function getPendingBookings(): Promise<BookingRequest[]> {
  try {
    return Array.from(bookingsCache.values()).filter(
      (b) => b.status === "pending"
    );
  } catch (error) {
    console.error("Error getting pending bookings:", error);
    return [];
  }
}

/**
 * Cancel a booking request
 */
export async function cancelBooking(
  bookingId: string
): Promise<BookingRequest | null> {
  try {
    return await updateBookingStatus(bookingId, "cancelled");
  } catch (error) {
    console.error(`Error cancelling booking ${bookingId}:`, error);
    return null;
  }
}

/**
 * Confirm a booking request
 */
export async function confirmBooking(
  bookingId: string
): Promise<BookingRequest | null> {
  try {
    return await updateBookingStatus(bookingId, "confirmed");
  } catch (error) {
    console.error(`Error confirming booking ${bookingId}:`, error);
    return null;
  }
}

/**
 * Check if student has recent booking for a topic
 */
export async function hasRecentBookingForTopic(
  studentId: string,
  topic: string,
  withinDays: number = 7
): Promise<boolean> {
  try {
    const bookings = await getBookingsByStudent(studentId);
    const recentDate = new Date(Date.now() - withinDays * 24 * 60 * 60 * 1000);

    return bookings.some(
      (b) =>
        b.requestedTopic.toLowerCase().includes(topic.toLowerCase()) &&
        new Date(b.createdAt) > recentDate &&
        b.status !== "cancelled"
    );
  } catch (error) {
    console.error(
      `Error checking recent booking for ${studentId}, topic: ${topic}:`,
      error
    );
    return false;
  }
}

/**
 * Get booking summary for display
 */
export interface BookingSummary {
  id: string;
  tutorName: string;
  topic: string;
  status: string;
  createdDate: string;
  strugglingConcepts: string[];
}

export async function getBookingSummary(
  bookingId: string
): Promise<BookingSummary | null> {
  try {
    const booking = await getBookingById(bookingId);
    if (!booking) return null;

    // In a full implementation, we'd fetch the tutor name
    // For Phase 1, we'll use a placeholder
    const tutorName = booking.tutorId.replace("tutor-", "").replace("-", " ");

    return {
      id: booking.id,
      tutorName,
      topic: booking.requestedTopic,
      status: booking.status,
      createdDate: booking.createdAt,
      strugglingConcepts: booking.handoffNotes.strugglingConcepts,
    };
  } catch (error) {
    console.error(`Error getting booking summary for ${bookingId}:`, error);
    return null;
  }
}

/**
 * Clear all bookings (for testing)
 */
export function clearAllBookings(): void {
  bookingsCache.clear();
}
