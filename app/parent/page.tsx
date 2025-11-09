"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store/appStore";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";

export default function ParentDashboard() {
  return (
    <ProtectedRoute>
      <ParentDashboardContent />
    </ProtectedRoute>
  );
}

function ParentDashboardContent() {
  const router = useRouter();
  const currentStudent = useAppStore((state) => state.currentStudent);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<"text" | "json" | "pdf">(
    "text"
  );
  const [preview, setPreview] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set()
  );

  const studentColor = currentStudent?.preferences?.aiColor || "#10B981";

  function toggleSession(sessionId: string) {
    setExpandedSessions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  }

  function generateSessionSummary(session: any): string {
    const topics = session.topicsCovered.join(", ");
    const studentMessages =
      session.transcript?.filter((t: any) => t.speaker === "student").length ||
      0;
    const tutorMessages =
      session.transcript?.filter((t: any) => t.speaker === "tutor").length || 0;

    let summary = `This session focused on ${topics}. `;
    summary += `The conversation included ${studentMessages} student responses and ${tutorMessages} tutor prompts. `;

    if (session.engagement === "high") {
      summary += "Student showed high engagement throughout the session.";
    } else if (session.engagement === "medium") {
      summary += "Student maintained moderate engagement during the session.";
    } else {
      summary += "Student engagement was lower than usual.";
    }

    return summary;
  }

  function extractHomeworkAndNextSteps(session: any): {
    homework: string[];
    nextSteps: string[];
  } {
    const homework: string[] = [];
    const nextSteps: string[] = [];

    if (!session.transcript) {
      return { homework: ["No transcript available"], nextSteps: [] };
    }

    // Look for keywords in tutor messages
    const tutorMessages = session.transcript.filter(
      (t: any) => t.speaker === "tutor"
    );

    tutorMessages.forEach((msg: any) => {
      const lower = msg.message.toLowerCase();

      // Detect homework assignments
      if (
        lower.includes("homework") ||
        lower.includes("practice") ||
        lower.includes("try") ||
        lower.includes("work on")
      ) {
        homework.push(msg.message);
      }

      // Detect next steps
      if (
        lower.includes("next time") ||
        lower.includes("next session") ||
        lower.includes("moving forward") ||
        lower.includes("continue")
      ) {
        nextSteps.push(msg.message);
      }
    });

    // Default suggestions if none found
    if (homework.length === 0) {
      homework.push(`Practice ${session.topicsCovered.join(" and ")}`);
    }

    if (nextSteps.length === 0) {
      if (session.strugglingConcepts && session.strugglingConcepts.length > 0) {
        nextSteps.push(
          `Continue working on: ${session.strugglingConcepts.join(", ")}`
        );
      } else {
        nextSteps.push(
          `Ready to advance to more complex concepts in ${session.topicsCovered[0]}`
        );
      }
    }

    return { homework, nextSteps };
  }

  useEffect(() => {
    if (!currentStudent) {
      router.push("/");
    }
  }, [currentStudent, router]);

  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          ⏳
        </motion.div>
      </div>
    );
  }

  async function loadPreview() {
    if (!currentStudent) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/export/conversations?studentId=${currentStudent.id}&format=${exportFormat}`
      );
      const data = await res.json();
      setPreview(data);
      setShowPreview(true);
    } catch (error) {
      console.error("Error loading preview:", error);
      alert("Failed to load preview");
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    if (!currentStudent) return;

    setLoading(true);
    try {
      const res = await fetch("/api/export/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentStudent.id,
          format: exportFormat,
          includeMetadata: true,
          includeTranscript: true,
          includeNotes: true,
        }),
      });

      if (!res.ok) {
        throw new Error("Export failed");
      }

      // Get the blob data
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Get filename from Content-Disposition header
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = `${currentStudent.name}-conversations.${exportFormat}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create download link
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert("Conversations exported successfully!");
    } catch (error) {
      console.error("Error exporting:", error);
      alert("Failed to export conversations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-['Architects_Daughter'] font-bold text-4xl text-[#2D3748] mb-2">
                Parent Dashboard
              </h1>
              <p className="font-['Architects_Daughter'] text-lg text-gray-600">
                Review {currentStudent?.name}&apos;s learning progress
              </p>
            </div>
            <motion.button
              onClick={() => router.push("/learn")}
              className="px-6 py-3 bg-white border-3 border-[#2D3748] rounded-xl font-['Architects_Daughter'] font-bold text-[#2D3748] shadow-[4px_4px_0px_rgba(0,0,0,0.15)]"
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Learning
            </motion.button>
          </div>
        </motion.div>

        {/* Export Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border-3 border-[#2D3748] shadow-[6px_6px_0px_rgba(0,0,0,0.2)] p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">📚</div>
            <div>
              <h2 className="font-['Architects_Daughter'] font-bold text-2xl text-[#2D3748]">
                Export Conversations
              </h2>
              <p className="font-['Architects_Daughter'] text-gray-600">
                Download AI tutor conversation history for review
              </p>
            </div>
          </div>

          {/* Format Selector */}
          <div className="mb-6">
            <label className="font-['Architects_Daughter'] font-bold text-sm text-[#2D3748] mb-2 block">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              <motion.button
                onClick={() => setExportFormat("text")}
                className={`p-4 rounded-xl border-2 border-[#2D3748] font-['Architects_Daughter'] font-bold transition-colors ${
                  exportFormat === "text"
                    ? "text-white"
                    : "bg-white text-[#2D3748] hover:bg-gray-50"
                }`}
                style={
                  exportFormat === "text"
                    ? { backgroundColor: studentColor }
                    : {}
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📄 Plain Text
              </motion.button>

              <motion.button
                onClick={() => setExportFormat("json")}
                className={`p-4 rounded-xl border-2 border-[#2D3748] font-['Architects_Daughter'] font-bold transition-colors ${
                  exportFormat === "json"
                    ? "text-white"
                    : "bg-white text-[#2D3748] hover:bg-gray-50"
                }`}
                style={
                  exportFormat === "json"
                    ? { backgroundColor: studentColor }
                    : {}
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📊 JSON Data
              </motion.button>

              <motion.button
                onClick={() => setExportFormat("pdf")}
                className={`p-4 rounded-xl border-2 border-[#2D3748] font-['Architects_Daughter'] font-bold transition-colors ${
                  exportFormat === "pdf"
                    ? "text-white"
                    : "bg-white text-[#2D3748] hover:bg-gray-50"
                }`}
                style={
                  exportFormat === "pdf"
                    ? { backgroundColor: studentColor }
                    : {}
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📑 Markdown
              </motion.button>
            </div>
            <p className="font-['Architects_Daughter'] text-xs text-gray-500 mt-2">
              {exportFormat === "text" &&
                "Human-readable plain text format for easy reading"}
              {exportFormat === "json" &&
                "Structured data format for analysis or import"}
              {exportFormat === "pdf" &&
                "Markdown format (can be converted to PDF using external tools)"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={loadPreview}
              disabled={loading}
              className="flex-1 px-6 py-4 bg-white border-2 border-[#2D3748] rounded-xl font-['Architects_Daughter'] font-bold text-[#2D3748] shadow-[3px_3px_0px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? "Loading..." : "Preview"}
            </motion.button>

            <motion.button
              onClick={handleExport}
              disabled={loading}
              className="flex-1 px-6 py-4 rounded-xl text-white font-['Architects_Daughter'] font-bold border-2 border-[#2D3748] shadow-[3px_3px_0px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: studentColor }}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? "Exporting..." : "⬇️ Export & Download"}
            </motion.button>
          </div>
        </motion.div>

        {/* Preview Panel */}
        {showPreview && preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-3 border-[#2D3748] shadow-[6px_6px_0px_rgba(0,0,0,0.2)] p-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Architects_Daughter'] font-bold text-xl text-[#2D3748]">
                Export Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div>
                  <p className="font-['Architects_Daughter'] text-sm text-gray-600">
                    Student
                  </p>
                  <p className="font-['Architects_Daughter'] font-bold text-lg text-[#2D3748]">
                    {preview.studentName}
                  </p>
                </div>
                <div>
                  <p className="font-['Architects_Daughter'] text-sm text-gray-600">
                    Sessions
                  </p>
                  <p className="font-['Architects_Daughter'] font-bold text-lg text-[#2D3748]">
                    {preview.sessionsIncluded}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-['Architects_Daughter'] font-bold text-sm text-gray-600">
                  Sessions Included:
                </p>
                {preview.sessions.map((session: any, index: number) => {
                  const isExpanded = expandedSessions.has(session.sessionId);
                  const { homework, nextSteps } =
                    extractHomeworkAndNextSteps(session);
                  const summary = generateSessionSummary(session);

                  return (
                    <div
                      key={session.sessionId}
                      className="bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden"
                    >
                      {/* Header - Always Visible */}
                      <motion.div
                        className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleSession(session.sessionId)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <motion.span
                              animate={{ rotate: isExpanded ? 90 : 0 }}
                              className="text-xl"
                            >
                              ▶
                            </motion.span>
                            <p className="font-['Architects_Daughter'] font-bold text-[#2D3748]">
                              Session {index + 1}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-white rounded-full border-2 border-gray-300 font-['Architects_Daughter'] text-xs">
                            {session.engagement}
                          </span>
                        </div>
                        <p className="font-['Architects_Daughter'] text-sm text-gray-600 ml-8">
                          {new Date(session.date).toLocaleDateString()} • Tutor:{" "}
                          {session.tutorName} • {session.duration} min
                        </p>
                        <p className="font-['Architects_Daughter'] text-sm text-gray-600 mt-1 ml-8">
                          Topics: {session.topicsCovered.join(", ")}
                        </p>
                      </motion.div>

                      {/* Expandable Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t-2 border-gray-200"
                          >
                            <div className="p-4 space-y-4">
                              {/* Session Summary */}
                              <div>
                                <h4 className="font-['Architects_Daughter'] font-bold text-sm text-[#2D3748] mb-2 flex items-center gap-2">
                                  <span>📋</span> Session Summary
                                </h4>
                                <p className="font-['Architects_Daughter'] text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                                  {summary}
                                </p>
                              </div>

                              {/* Homework */}
                              <div>
                                <h4 className="font-['Architects_Daughter'] font-bold text-sm text-[#2D3748] mb-2 flex items-center gap-2">
                                  <span>📚</span> Assigned Homework
                                </h4>
                                <div className="space-y-2">
                                  {homework.map((hw, i) => (
                                    <div
                                      key={i}
                                      className="font-['Architects_Daughter'] text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200"
                                    >
                                      {hw}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Next Steps */}
                              <div>
                                <h4 className="font-['Architects_Daughter'] font-bold text-sm text-[#2D3748] mb-2 flex items-center gap-2">
                                  <span>🎯</span> Next Steps
                                </h4>
                                <div className="space-y-2">
                                  {nextSteps.map((step, i) => (
                                    <div
                                      key={i}
                                      className="font-['Architects_Daughter'] text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200"
                                    >
                                      {step}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Tutor Notes */}
                              {session.tutorNotes && (
                                <div>
                                  <h4 className="font-['Architects_Daughter'] font-bold text-sm text-[#2D3748] mb-2 flex items-center gap-2">
                                    <span>✏️</span> Tutor Notes
                                  </h4>
                                  <p className="font-['Architects_Daughter'] text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    {session.tutorNotes}
                                  </p>
                                </div>
                              )}

                              {/* Struggling Concepts */}
                              {session.strugglingConcepts &&
                                session.strugglingConcepts.length > 0 && (
                                  <div>
                                    <h4 className="font-['Architects_Daughter'] font-bold text-sm text-[#2D3748] mb-2 flex items-center gap-2">
                                      <span>⚠️</span> Needs Extra Support
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {session.strugglingConcepts.map(
                                        (concept: string, i: number) => (
                                          <span
                                            key={i}
                                            className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full border border-orange-300 font-['Architects_Daughter'] text-xs"
                                          >
                                            {concept}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <p className="font-['Architects_Daughter'] font-bold text-blue-900 mb-2">
                About Conversation Exports
              </p>
              <ul className="font-['Architects_Daughter'] text-sm text-blue-800 space-y-1">
                <li>
                  • All conversations include timestamp and topic information
                </li>
                <li>• Tutor notes highlight key learning moments</li>
                <li>
                  • Exports are privacy-safe with no personal data leakage
                </li>
                <li>
                  • Use exports to track progress and identify areas for support
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
