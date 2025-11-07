export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🧠 AI Study Companion</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your persistent, context-aware tutoring assistant
        </p>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">
            Phase 1: Setup Complete! ✅
          </h2>
          <ul className="text-left space-y-2 text-gray-700">
            <li>✓ Next.js 14 with App Router</li>
            <li>✓ TypeScript with strict mode</li>
            <li>✓ Tailwind CSS configured</li>
            <li>✓ Framer Motion for animations</li>
            <li>✓ Zustand for state management</li>
            <li>✓ OpenAI SDK ready</li>
            <li>✓ Project structure initialized</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
