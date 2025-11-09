"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Tutor, TimeSlot } from "@/types";
import { createBookingWithHandoff } from "@/lib/services/bookingService";
import Image from "next/image";

interface BookingInterfaceProps {
  tutor: Tutor;
  studentId: string;
  studentColor: string;
  suggestedTopic: string;
  strugglingConcepts: string[];
  taskAttempts: Array<{ correct: boolean; topic: string }>;
  conversationContext?: string;
  onClose: () => void;
  onBookingComplete: (bookingId: string) => void;
}

export default function BookingInterface({
  tutor,
  studentId,
  studentColor,
  suggestedTopic,
  strugglingConcepts,
  taskAttempts,
  conversationContext = "",
  onClose,
  onBookingComplete,
}: BookingInterfaceProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [topic, setTopic] = useState(suggestedTopic);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store and restore focus
  useEffect(() => {
    if (typeof window !== "undefined") {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
    if (firstButtonRef.current) {
      firstButtonRef.current.focus();
    }
    return () => {
      if (previousFocusRef.current && typeof window !== "undefined") {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading && !showConfirmation) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoading, showConfirmation, onClose]);

  // Get available slots only
  const availableSlots = (tutor.availableSlots || []).filter(
    (slot) => slot.available
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Handle booking submission
  const handleSubmit = async () => {
    if (!selectedSlot) {
      setError("Please select a time slot");
      return;
    }

    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const reason = `Struggling with: ${strugglingConcepts.join(", ")}`;

      const booking = await createBookingWithHandoff(
        studentId,
        tutor.id,
        topic,
        reason,
        strugglingConcepts,
        taskAttempts,
        conversationContext
      );

      setBookingId(booking.id);
      setShowConfirmation(true);

      // Auto-close and callback after 3 seconds
      setTimeout(() => {
        onBookingComplete(booking.id);
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Oops! Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading && !showConfirmation) {
      onClose();
    }
  };

  // Focus trap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab" && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  // Confirmation view
  if (showConfirmation) {
    return (
      <AnimatePresence>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Confirmation Modal */}
        <motion.div
          className="fixed top-1/2 left-1/2 z-[9999]
                     w-[400px] max-w-[90vw] p-8
                     bg-white rounded-3xl
                     border-4 border-[#2D3748]
                     shadow-[8px_8px_0px_rgba(0,0,0,0.1)]"
          style={{ x: "-50%", y: "-50%" }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 25 },
          }}
        >
          {/* Success Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600
                          flex items-center justify-center text-5xl
                          border-4 border-[#2D3748]
                          shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
            >
              ✓
            </div>
          </motion.div>

          {/* Message */}
          <div className="text-center space-y-3">
            <h3 className="font-['Architects_Daughter'] text-2xl font-bold text-[#2D3748]">
              Session Requested!
            </h3>
            <p className="font-['Architects_Daughter'] text-lg text-gray-600">
              {tutor.name} will reach out soon to confirm your session.
            </p>
            {bookingId && (
              <p className="text-sm text-gray-500 font-mono">
                Booking ID: {bookingId.slice(-8)}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onKeyDown={handleKeyDown}
        className="fixed top-1/2 left-1/2 z-[9999]
                   w-full max-w-2xl max-h-[90vh] overflow-y-auto
                   mx-4 p-8
                   bg-white rounded-2xl
                   border-4 border-[#2D3748]
                   shadow-[8px_8px_0px_rgba(0,0,0,0.1)]"
        style={{ x: "-50%", y: "-50%" }}
        initial={{ scale: 0.9, opacity: 0, y: "-50%", x: "-50%" }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 w-8 h-8
                     rounded-full bg-white border-2 border-[#2D3748]
                     flex items-center justify-center
                     text-[#2D3748] text-lg font-bold
                     hover:bg-gray-100 hover:rotate-90
                     transition-all duration-200
                     focus:outline-none focus:ring-4 focus:ring-gray-300"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Tutor Profile Section */}
        <div className="mb-8">
          <h2
            id="booking-title"
            className="font-['Architects_Daughter'] text-3xl font-bold text-[#2D3748] mb-6"
          >
            Book a Session
          </h2>

          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500
                            flex items-center justify-center text-3xl font-bold text-white
                            border-4 border-[#2D3748]
                            shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
              >
                {tutor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>

            {/* Tutor Info */}
            <div className="flex-1">
              <h3 className="font-['Architects_Daughter'] text-2xl font-bold text-[#2D3748]">
                {tutor.name}
              </h3>

              {/* Specialties Badges */}
              <div className="flex flex-wrap gap-2 my-2">
                {tutor.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 rounded-full text-sm font-['Architects_Daughter'] font-bold
                               bg-purple-100 text-purple-700 border-2 border-purple-300"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Bio */}
              <p className="text-gray-600 font-['Architects_Daughter'] text-sm leading-relaxed">
                {tutor.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          {/* Topic Field */}
          <div>
            <label
              htmlFor="topic"
              className="block font-['Architects_Daughter'] font-bold text-lg text-[#2D3748] mb-2"
            >
              What do you want to work on?
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl
                         border-3 border-[#2D3748]
                         font-['Architects_Daughter'] text-lg
                         focus:outline-none focus:ring-4 focus:ring-blue-300
                         disabled:opacity-50 disabled:bg-gray-100"
              placeholder="e.g., Fractions"
              disabled={isLoading}
            />
          </div>

          {/* Struggling Concepts */}
          <div>
            <label className="block font-['Architects_Daughter'] font-bold text-lg text-[#2D3748] mb-2">
              Why you&apos;re booking:
            </label>
            <div className="bg-yellow-50 border-3 border-yellow-300 rounded-xl p-4">
              <ul className="list-disc list-inside space-y-1">
                {strugglingConcepts.map((concept, index) => (
                  <li
                    key={index}
                    className="font-['Architects_Daughter'] text-gray-700"
                  >
                    {concept}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Time Slot Picker - Child-Friendly Calendar View */}
          <div>
            <label className="block font-['Architects_Daughter'] font-bold text-lg text-[#2D3748] mb-3">
              Pick a time:
            </label>

            {availableSlots.length === 0 ? (
              <div className="bg-red-50 border-3 border-red-300 rounded-xl p-6 text-center">
                <p className="font-['Architects_Daughter'] text-lg text-red-700">
                  No time slots available right now. Please try again later! 🕐
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    ref={index === 0 ? firstButtonRef : null}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-4 rounded-xl border-3 transition-all duration-200
                                font-['Architects_Daughter'] text-left
                                focus:outline-none focus:ring-4 focus:ring-blue-300
                                disabled:opacity-50 disabled:cursor-not-allowed
                                ${
                                  selectedSlot?.datetime === slot.datetime
                                    ? `bg-[${studentColor}] text-white border-[#2D3748] shadow-[4px_4px_0px_rgba(0,0,0,0.15)]`
                                    : "bg-white border-gray-300 hover:border-[#2D3748] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                                }`}
                    style={
                      selectedSlot?.datetime === slot.datetime
                        ? { backgroundColor: studentColor }
                        : {}
                    }
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg">
                          {formatDate(slot.datetime)}
                        </div>
                        <div className="text-sm opacity-90">
                          {formatTime(slot.datetime)} ({slot.duration} min)
                        </div>
                      </div>
                      {selectedSlot?.datetime === slot.datetime && (
                        <span className="text-2xl">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes (Optional) */}
          <div>
            <label
              htmlFor="notes"
              className="block font-['Architects_Daughter'] font-bold text-lg text-[#2D3748] mb-2"
            >
              Anything else to share? <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setNotes(e.target.value);
                }
              }}
              className="w-full px-4 py-3 rounded-xl
                         border-3 border-[#2D3748]
                         font-['Architects_Daughter'] text-lg
                         focus:outline-none focus:ring-4 focus:ring-blue-300
                         disabled:opacity-50 disabled:bg-gray-100
                         resize-none"
              rows={3}
              placeholder="Any questions or things you want to mention?"
              disabled={isLoading}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {notes.length}/200 characters
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-3 border-red-300 rounded-xl p-4">
              <p className="font-['Architects_Daughter'] text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading || !selectedSlot || availableSlots.length === 0}
              className="flex-1 px-6 py-4 rounded-xl
                       text-white font-['Architects_Daughter'] font-bold text-xl
                       border-3 border-[#2D3748]
                       shadow-[4px_4px_0px_rgba(0,0,0,0.15)]
                       hover:shadow-[2px_2px_0px_rgba(0,0,0,0.15)]
                       hover:translate-x-[2px] hover:translate-y-[2px]
                       transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-4 focus:ring-blue-300"
              style={{ backgroundColor: studentColor }}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? "Booking..." : "Request Session 🚀"}
            </motion.button>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-4 rounded-xl
                       bg-transparent text-[#2D3748] font-['Architects_Daughter'] font-bold text-xl
                       border-3 border-[#2D3748]
                       hover:bg-gray-100
                       transition-colors duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
