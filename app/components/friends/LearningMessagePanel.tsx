"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Student, FriendMessage } from "@/types";

interface LearningMessagePanelProps {
  friend: Student;
  conversation: FriendMessage[];
  messagesRemaining: number;
  currentStudentId: string;
  currentStudent: Student;
  color: string;
  onSendMessage: (messageData: Partial<FriendMessage>) => void;
}

export default function LearningMessagePanel({
  friend,
  conversation,
  messagesRemaining,
  currentStudentId,
  currentStudent,
  color,
  onSendMessage,
}: LearningMessagePanelProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareType, setShareType] = useState<
    "achievement" | "tutor" | "note" | null
  >(null);

  // Note form state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteSubject, setNoteSubject] = useState("");

  function handleShareClick(type: "achievement" | "tutor" | "note") {
    setShareType(type);
    setShowShareModal(true);
  }

  function handleSendAchievement(achievementId: string, achievementName: string) {
    onSendMessage({
      type: "achievement_share",
      achievementId,
      achievementName,
    });
    setShowShareModal(false);
  }

  function handleSendTutorRec(tutorId: string, tutorName: string, specialty: string) {
    onSendMessage({
      type: "tutor_recommendation",
      tutorId,
      tutorName,
      tutorSpecialty: specialty,
    });
    setShowShareModal(false);
  }

  function handleSendNote() {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    onSendMessage({
      type: "study_note",
      noteTitle,
      noteContent,
      noteSubject: noteSubject || "General",
    });

    // Reset form
    setNoteTitle("");
    setNoteContent("");
    setNoteSubject("");
    setShowShareModal(false);
  }

  return (
    <div className="bg-white rounded-2xl border-3 border-[#2D3748] shadow-[4px_4px_0px_rgba(0,0,0,0.15)] p-6 h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-200">
        <div
          className="w-12 h-12 rounded-full border-3 border-[#2D3748] flex items-center justify-center text-2xl"
          style={{ backgroundColor: friend.preferences?.aiColor || "#10B981" }}
        >
          👤
        </div>
        <div className="flex-1">
          <h3 className="font-['Architects_Daughter'] font-bold text-xl text-[#2D3748]">
            {friend.name}
          </h3>
          <p className="font-['Architects_Daughter'] text-sm text-gray-600">
            Grade {friend.grade}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {conversation.length === 0 ? (
          <div className="text-center text-gray-500 font-['Architects_Daughter'] mt-8">
            No shared items yet. Share your achievements, tutor recommendations, or
            study notes! 📚
          </div>
        ) : (
          conversation.map((msg) => {
            const isFromMe = msg.fromStudentId === currentStudentId;
            return (
              <MessageCard
                key={msg.id}
                message={msg}
                isFromMe={isFromMe}
                color={color}
              />
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <p className="text-sm font-['Architects_Daughter'] text-gray-600 text-center">
          {messagesRemaining} shares left today
        </p>

        <div className="grid grid-cols-3 gap-3">
          <motion.button
            onClick={() => handleShareClick("achievement")}
            disabled={messagesRemaining === 0}
            className="p-4 rounded-xl border-2 border-[#2D3748] bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={messagesRemaining > 0 ? { scale: 1.02 } : {}}
            whileTap={messagesRemaining > 0 ? { scale: 0.98 } : {}}
          >
            <div className="text-3xl mb-1">🏆</div>
            <div className="font-['Architects_Daughter'] font-bold text-sm text-[#2D3748]">
              Share Achievement
            </div>
          </motion.button>

          <motion.button
            onClick={() => handleShareClick("tutor")}
            disabled={messagesRemaining === 0}
            className="p-4 rounded-xl border-2 border-[#2D3748] bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={messagesRemaining > 0 ? { scale: 1.02 } : {}}
            whileTap={messagesRemaining > 0 ? { scale: 0.98 } : {}}
          >
            <div className="text-3xl mb-1">👨‍🏫</div>
            <div className="font-['Architects_Daughter'] font-bold text-sm text-[#2D3748]">
              Recommend Tutor
            </div>
          </motion.button>

          <motion.button
            onClick={() => handleShareClick("note")}
            disabled={messagesRemaining === 0}
            className="p-4 rounded-xl border-2 border-[#2D3748] bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={messagesRemaining > 0 ? { scale: 1.02 } : {}}
            whileTap={messagesRemaining > 0 ? { scale: 0.98 } : {}}
          >
            <div className="text-3xl mb-1">📝</div>
            <div className="font-['Architects_Daughter'] font-bold text-sm text-[#2D3748]">
              Share Notes
            </div>
          </motion.button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          type={shareType}
          currentStudent={currentStudent}
          onClose={() => setShowShareModal(false)}
          onSendAchievement={handleSendAchievement}
          onSendTutorRec={handleSendTutorRec}
          onSendNote={handleSendNote}
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
          noteContent={noteContent}
          setNoteContent={setNoteContent}
          noteSubject={noteSubject}
          setNoteSubject={setNoteSubject}
          color={color}
        />
      )}
    </div>
  );
}

// Message Card Component
function MessageCard({
  message,
  isFromMe,
  color,
}: {
  message: FriendMessage;
  isFromMe: boolean;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-2xl border-3 border-[#2D3748] ${
          isFromMe ? "text-white" : "bg-white text-[#2D3748]"
        }`}
        style={isFromMe ? { backgroundColor: color } : {}}
      >
        {message.type === "achievement_share" && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏆</span>
              <span className="font-['Architects_Daughter'] font-bold">
                Achievement Unlocked!
              </span>
            </div>
            <p className="font-['Architects_Daughter'] text-lg">
              {message.achievementName}
            </p>
          </div>
        )}

        {message.type === "tutor_recommendation" && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👨‍🏫</span>
              <span className="font-['Architects_Daughter'] font-bold">
                Tutor Recommendation
              </span>
            </div>
            <p className="font-['Architects_Daughter'] text-lg font-bold">
              {message.tutorName}
            </p>
            <p className="font-['Architects_Daughter'] text-sm opacity-90">
              {message.tutorSpecialty}
            </p>
          </div>
        )}

        {message.type === "study_note" && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📝</span>
              <span className="font-['Architects_Daughter'] font-bold">
                Study Note
              </span>
            </div>
            <p className="font-['Architects_Daughter'] text-lg font-bold mb-1">
              {message.noteTitle}
            </p>
            {message.noteSubject && (
              <p className="font-['Architects_Daughter'] text-xs opacity-75 mb-2">
                Subject: {message.noteSubject}
              </p>
            )}
            <p className="font-['Architects_Daughter'] text-sm whitespace-pre-wrap">
              {message.noteContent}
            </p>
          </div>
        )}

        <p className="font-['Architects_Daughter'] text-xs opacity-75 mt-2">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
}

// Share Modal Component
function ShareModal({
  type,
  currentStudent,
  onClose,
  onSendAchievement,
  onSendTutorRec,
  onSendNote,
  noteTitle,
  setNoteTitle,
  noteContent,
  setNoteContent,
  noteSubject,
  setNoteSubject,
  color,
}: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl border-3 border-[#2D3748] shadow-[6px_6px_0px_rgba(0,0,0,0.2)] p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-['Architects_Daughter'] font-bold text-2xl text-[#2D3748]">
            {type === "achievement" && "Share Achievement 🏆"}
            {type === "tutor" && "Recommend Tutor 👨‍🏫"}
            {type === "note" && "Share Study Notes 📝"}
          </h3>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {type === "achievement" && (
          <div className="space-y-3">
            {currentStudent.achievements.map((achId: string) => (
              <motion.button
                key={achId}
                onClick={() => onSendAchievement(achId, achId.replace(/_/g, " "))}
                className="w-full p-4 rounded-xl border-2 border-[#2D3748] bg-white hover:bg-gray-50 text-left transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-['Architects_Daughter'] font-bold text-lg capitalize">
                  {achId.replace(/_/g, " ")}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {type === "tutor" && (
          <div className="space-y-3">
            <motion.button
              onClick={() =>
                onSendTutorRec(
                  "tutor-sarah-chen",
                  "Dr. Sarah Chen",
                  "Math & Science"
                )
              }
              className="w-full p-4 rounded-xl border-2 border-[#2D3748] bg-white hover:bg-gray-50 text-left transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-['Architects_Daughter'] font-bold text-lg">
                Dr. Sarah Chen
              </div>
              <div className="font-['Architects_Daughter'] text-sm text-gray-600">
                Math & Science
              </div>
            </motion.button>

            <motion.button
              onClick={() =>
                onSendTutorRec(
                  "tutor-james-rodriguez",
                  "James Rodriguez",
                  "Writing & SAT Prep"
                )
              }
              className="w-full p-4 rounded-xl border-2 border-[#2D3748] bg-white hover:bg-gray-50 text-left transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-['Architects_Daughter'] font-bold text-lg">
                James Rodriguez
              </div>
              <div className="font-['Architects_Daughter'] text-sm text-gray-600">
                Writing & SAT Prep
              </div>
            </motion.button>

            <motion.button
              onClick={() =>
                onSendTutorRec(
                  "tutor-aisha-patel",
                  "Ms. Aisha Patel",
                  "STEM & Biology"
                )
              }
              className="w-full p-4 rounded-xl border-2 border-[#2D3748] bg-white hover:bg-gray-50 text-left transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-['Architects_Daughter'] font-bold text-lg">
                Ms. Aisha Patel
              </div>
              <div className="font-['Architects_Daughter'] text-sm text-gray-600">
                STEM & Biology
              </div>
            </motion.button>
          </div>
        )}

        {type === "note" && (
          <div className="space-y-4">
            <div>
              <label className="font-['Architects_Daughter'] font-bold text-sm text-[#2D3748] mb-1 block">
                Note Title
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="e.g., Algebra Tips"
                className="w-full px-4 py-2 rounded-xl border-2 border-[#2D3748] font-['Architects_Daughter'] focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label className="font-['Architects_Daughter'] font-bold text-sm text-[#2D3748] mb-1 block">
                Subject (Optional)
              </label>
              <input
                type="text"
                value={noteSubject}
                onChange={(e) => setNoteSubject(e.target.value)}
                placeholder="e.g., Math, Science..."
                className="w-full px-4 py-2 rounded-xl border-2 border-[#2D3748] font-['Architects_Daughter'] focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label className="font-['Architects_Daughter'] font-bold text-sm text-[#2D3748] mb-1 block">
                Notes
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Share your study notes or tips..."
                rows={6}
                className="w-full px-4 py-2 rounded-xl border-2 border-[#2D3748] font-['Architects_Daughter'] focus:outline-none focus:ring-2 resize-none"
              />
            </div>

            <motion.button
              onClick={onSendNote}
              disabled={!noteTitle.trim() || !noteContent.trim()}
              className="w-full px-6 py-3 rounded-xl text-white font-['Architects_Daughter'] font-bold border-2 border-[#2D3748] shadow-[3px_3px_0px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: color }}
              whileHover={
                noteTitle.trim() && noteContent.trim() ? { scale: 1.02 } : {}
              }
              whileTap={
                noteTitle.trim() && noteContent.trim() ? { scale: 0.98 } : {}
              }
            >
              Share Note
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
