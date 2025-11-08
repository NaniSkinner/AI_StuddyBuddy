/**
 * OpenAI Connection Verification Script
 *
 * Tests OpenAI API connection and configuration
 * Run with: bun run verify-openai
 */

import OpenAI from "openai";
import { validateEnvironment } from "../lib/utils/aiErrorHandler";

async function verifyConnection() {
  console.log("\n🔍 Verifying OpenAI Connection...\n");

  // Step 1: Validate environment variables
  console.log("📋 Step 1: Validating environment variables...");
  const envValidation = validateEnvironment();

  if (!envValidation.valid) {
    console.error("❌ Environment validation failed:\n");
    envValidation.errors.forEach((error) => {
      console.error(`   - ${error}`);
    });
    console.error("\n💡 Please check your .env.local file\n");
    process.exit(1);
  }

  console.log("✅ Environment variables validated\n");

  // Display configuration
  console.log("⚙️  Configuration:");
  console.log(`   - Model: ${process.env.OPENAI_MODEL || "gpt-4"}`);
  console.log(`   - Max Tokens: ${process.env.OPENAI_MAX_TOKENS || "500"}`);
  console.log(`   - Temperature: ${process.env.OPENAI_TEMPERATURE || "0.8"}`);
  console.log(
    `   - Context Window: ${
      process.env.OPENAI_CONTEXT_WINDOW_SIZE || "15"
    } messages`
  );
  console.log(
    `   - Usage Logging: ${process.env.OPENAI_LOG_USAGE || "true"}\n`
  );

  // Step 2: Initialize OpenAI client
  console.log("🔧 Step 2: Initializing OpenAI client...");
  let openai: OpenAI;

  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("✅ OpenAI client initialized\n");
  } catch (error) {
    console.error("❌ Failed to initialize OpenAI client");
    console.error(error);
    process.exit(1);
  }

  // Step 3: Test API connection with minimal token usage
  console.log("🌐 Step 3: Testing API connection...");
  console.log("   (Using minimal tokens for this test)\n");

  try {
    const startTime = Date.now();

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4",
      messages: [
        {
          role: "system",
          content: 'You are a helpful assistant. Respond with just "OK".',
        },
        {
          role: "user",
          content: "Test",
        },
      ],
      max_tokens: 10,
      temperature: 0,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Extract response
    const content = response.choices[0]?.message?.content || "";
    const usage = response.usage;

    // Display results
    console.log("✅ API connection successful!\n");
    console.log("📊 Test Results:");
    console.log(`   - Response: "${content}"`);
    console.log(`   - Response Time: ${duration}ms`);
    console.log(`   - Model Used: ${response.model}`);

    if (usage) {
      console.log("\n📈 Token Usage:");
      console.log(`   - Prompt Tokens: ${usage.prompt_tokens}`);
      console.log(`   - Completion Tokens: ${usage.completion_tokens}`);
      console.log(`   - Total Tokens: ${usage.total_tokens}`);

      // Calculate cost
      const costPerToken = parseFloat(
        process.env.OPENAI_COST_PER_TOKEN || "0.00003"
      );
      const estimatedCost = usage.total_tokens * costPerToken;
      console.log(`   - Estimated Cost: $${estimatedCost.toFixed(5)}`);
    }

    console.log("\n🎉 All checks passed! OpenAI integration is ready.\n");
    console.log("💡 Next steps:");
    console.log("   1. Run `bun run dev` to start the development server");
    console.log("   2. Test AI features in the chat interface");
    console.log("   3. Monitor token usage in the console\n");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ API connection test failed\n");

    // Provide helpful error messages
    if (error?.status === 401) {
      console.error("🔐 Authentication Error:");
      console.error("   Your API key appears to be invalid.");
      console.error("   Please check your OPENAI_API_KEY in .env.local\n");
    } else if (error?.status === 429) {
      console.error("⚠️  Rate Limit Error:");
      console.error("   You have exceeded your API rate limit.");
      console.error("   Please wait a moment and try again.\n");
    } else if (error?.code === "ENOTFOUND" || error?.code === "ECONNREFUSED") {
      console.error("🌐 Network Error:");
      console.error("   Could not connect to OpenAI API.");
      console.error("   Please check your internet connection.\n");
    } else {
      console.error("❓ Unknown Error:");
      console.error(error);
      console.error("\n");
    }

    console.error("💡 Troubleshooting:");
    console.error(
      "   1. Verify your API key at https://platform.openai.com/api-keys"
    );
    console.error("   2. Check your internet connection");
    console.error("   3. Ensure you have API credits available");
    console.error("   4. Check OpenAI status at https://status.openai.com\n");

    process.exit(1);
  }
}

// Run verification
verifyConnection();
