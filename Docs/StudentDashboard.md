# Step-by-Step Implementation Guide: "Road to Skills" Feature

This guide provides a complete, step-by-step plan to implement the "Road to Skills" interactive map, from generating the necessary visual assets using LLMs to integrating the feature into your Next.js application.

## Phase 1: LLM-Powered Asset Generation (T2I)

The goal of this phase is to create the high-quality, consistent, whimsical assets required for the feature's aesthetic. We will use a powerful Text-to-Image (T2I) model like **DALL-E 3** (for easy integration via the existing OpenAI dependency) or **Midjourney** (for maximum artistic quality).

### Step 1.1: Generate the Main Background Image (The Path)

This image will serve as the static background for your interactive map.

| Model                     | Prompt Template                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Notes                                                                                                                                                    |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DALL-E 3 / Midjourney** | **Prompt:** "A vertical, whimsical, storybook-style illustration of a winding, upward path on a vibrant green hill. The path should start at the bottom and ascend in a gentle spiral, leading to a large, lush, stylized tree at the very top. The scene is bright and cheerful, with soft gradients of sky blue, matcha green, and warm yellow. Include small, rounded clouds, floating hearts, and playful flora along the path. **Style:** Children's book illustration, vector art, smooth shading, no harsh edges, high detail." | **Crucial:** The path must be clearly defined and wind vertically to accommodate the skill cards. Use a **2:3 or 9:16 aspect ratio** for a vertical map. |

**_Action:_** _Generate this image and save it as `/public/assets/road_map_background.png`._

### Step 1.2: Generate the Consistent Avatar and Icons

We need a consistent visual for the child's avatar and the medal icons.

| Asset                     | Prompt Template                                                                                                                                                                                                                                                                                              | Notes                                                                                                                                          |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Avatar (for movement)** | **Prompt:** "A small, smiling child avatar, **wearing a bright red shirt and blue shorts**, with **curly brown hair**. The style must perfectly match the **road_map_background.png** image. **Action:** Standing and looking forward. **Style:** Children's book illustration, vector art, smooth shading." | **Crucial:** Define the child's features (clothing, hair) clearly and consistently. Save as `/public/assets/avatar.png`.                       |
| **Medal Icons**           | **Prompt:** "A set of three small, rounded medal icons: Bronze, Silver, and Gold. They should have a playful, whimsical design and match the art style of the **road_map_background.png** image. **Style:** Children's book illustration, vector art, smooth shading."                                       | Save as `/public/assets/medal_bronze.svg`, `/public/assets/medal_silver.svg`, `/public/assets/medal_gold.svg`. SVG is preferred for crispness. |

**_Action:_** _Generate these assets and save them in your `/public/assets` folder._

---

## Phase 2: Data Preparation and Structure

The frontend needs a structured data source to render the map. This data will eventually come from your GPT-4 backend, but for development, we will use a mock JSON structure.

### Step 2.1: Define the Mock Data Structure

Create a file named `src/data/mockSkills.ts` (or similar) to hold the mock data. The key addition is the `position` object, which defines where the skill card will be placed on the background image.

```typescript
// src/data/mockSkills.ts

export interface SkillProgress {
  id: number;
  title: string;
  status: "locked" | "in-progress" | "achieved";
  level: "Emerging" | "Developing" | "Proficient" | "Advanced"; // From GPT-4 output
  tips: string[]; // From a static file or LLM's justification/correction data
  // Position is crucial for visual placement on the map (relative to the container)
  position: {
    top: string; // e.g., '80%' (from top of the map)
    left: string; // e.g., '20%' (from left of the map)
  };
}

export const mockSkills: SkillProgress[] = [
  {
    id: 1,
    title: "Self-Awareness",
    status: "achieved",
    level: "Proficient",
    tips: [
      "Listen before you speak.",
      "Ask how others feel.",
      "Offer help without being asked.",
    ],
    position: { top: "85%", left: "25%" }, // Near the start of the path
  },
  {
    id: 2,
    title: "Task Initiation",
    status: "in-progress",
    level: "Developing",
    tips: [
      "Break big tasks into small steps.",
      "Set a 5-minute timer to just start.",
      "Reward yourself for starting.",
    ],
    position: { top: "60%", left: "70%" }, // Mid-way up the path
  },
  {
    id: 3,
    title: "Responsible Decision-Making",
    status: "locked",
    level: "Emerging",
    tips: [
      "Think about consequences first.",
      "Ask a trusted adult for advice.",
      "Review your past choices.",
    ],
    position: { top: "30%", left: "15%" }, // Further up the path
  },
  // ... add more skills, manually adjusting top/left to follow the path in your image
];
```

---

## Phase 3: Frontend Implementation (Next.js, Framer Motion)

### Step 3.1: Create the Main Component

Create the component file, e.g., `components/RoadToSkillsMap.tsx`.

```tsx
// components/RoadToSkillsMap.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockSkills, SkillProgress } from "../data/mockSkills"; // Adjust path as needed

// Helper to get the correct medal icon
const getMedalIcon = (status: SkillProgress["status"]) => {
  if (status === "achieved") return "/assets/medal_gold.svg";
  if (status === "in-progress") return "/assets/medal_silver.svg";
  return "/assets/medal_bronze.svg"; // Locked or default
};

// --- Skill Card Component ---
const SkillCard: React.FC<{ skill: SkillProgress }> = ({ skill }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Framer Motion variants for the dropdown tips
  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginTop: 8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className={`absolute w-40 p-3 rounded-xl shadow-lg cursor-pointer transition-all duration-300 ${
        skill.status === "achieved"
          ? "bg-yellow-100 border-4 border-yellow-400"
          : skill.status === "in-progress"
          ? "bg-blue-100 border-4 border-blue-400"
          : "bg-gray-200 border-4 border-gray-300 opacity-70"
      }`}
      style={{ top: skill.position.top, left: skill.position.left }}
      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 255, 0, 0.7)" }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm">{skill.title}</h3>
        <img src={getMedalIcon(skill.status)} alt="Medal" className="w-6 h-6" />
      </div>

      {/* Dropdown Tips */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            className="text-xs text-gray-700 overflow-hidden"
          >
            <p className="font-semibold mt-2">Tips to Achieve {skill.level}:</p>
            <ul className="list-disc list-inside space-y-1">
              {skill.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main Map Component ---
export const RoadToSkillsMap: React.FC = () => {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0); // Index of the last achieved skill

  // Get the position of the last achieved skill for the avatar
  const lastAchievedSkill =
    mockSkills.find((s) => s.status === "achieved") || mockSkills[0];
  const avatarPosition = lastAchievedSkill.position;

  return (
    <div className="relative w-full max-w-md mx-auto h-[800px] overflow-hidden border-4 border-gray-300 rounded-2xl shadow-2xl">
      {/* Background Image (The Road) */}
      <img
        src="/assets/road_map_background.png"
        alt="Road to Skills Map"
        className="absolute w-full h-full object-cover"
      />

      {/* Avatar that moves to the last achieved skill */}
      <motion.img
        src="/assets/avatar.png"
        alt="Student Avatar"
        className="absolute w-12 h-12 z-10"
        // Animate the avatar to the position of the last achieved skill
        animate={{
          top: `calc(${avatarPosition.top} - 24px)`, // Adjust for image height
          left: `calc(${avatarPosition.left} - 24px)`, // Adjust for image width
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Render all Skill Cards */}
      {mockSkills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}

      {/* Optional: Goal Marker at the top */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 p-2 bg-white rounded-full shadow-xl border-4 border-yellow-500">
        <h2 className="text-lg font-extrabold text-green-700">Growth Goal!</h2>
      </div>
    </div>
  );
};
```

### Step 3.2: Integration into Next.js Page

Finally, import and use the component on one of your Next.js pages (e.g., `pages/student/journey.tsx`).

```tsx
// pages/student/journey.tsx (or similar)
import { RoadToSkillsMap } from "../components/RoadToSkillsMap";

const StudentJourneyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Road to Skills</h1>
      <RoadToSkillsMap />
    </div>
  );
};

export default StudentJourneyPage;
```

This guide provides the complete blueprint: the LLM prompts for asset creation, the data structure to drive the feature, and the core React/Framer Motion code for the interactive visualization. Once you have the assets and the code in place, you will have a fully functional "Road to Skills" map.
