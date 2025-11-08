# 🧪 AI Integration Testing Guide

**Quick Start:** Get your AI-powered study companion running in 5 minutes!

---

## 📋 Pre-Testing Checklist

Before testing, ensure you have:

- ✅ OpenAI API key ready
- ✅ Bun runtime installed
- ✅ All dependencies installed (`bun install`)
- ✅ Development environment ready

---

## 🔑 Step 1: Add Your OpenAI API Key

### Option A: Create `.env.local` file (Recommended)

```bash
# In your project root
touch .env.local

# Add your key (replace with your actual key)
echo "OPENAI_API_KEY=sk-..." >> .env.local
```

### Option B: Copy from example

```bash
# If .env.example exists
cp .env.example .env.local

# Then edit .env.local and add your key
```

### Your `.env.local` should look like:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.8
OPENAI_CONTEXT_WINDOW_SIZE=15
OPENAI_LOG_USAGE=true
```

**⚠️ Important:** Never commit `.env.local` to git! It's already in `.gitignore`.

---

## ✅ Step 2: Verify OpenAI Connection

Run the verification script:

```bash
bun run verify-openai
```

### Expected Output:

```
🔍 OpenAI API Connection Verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Configuration Check
   Model: gpt-4
   Max Tokens: 500
   Temperature: 0.8

✅ API Key Format
   Valid format detected

✅ Connection Test
   Successfully connected to OpenAI API
   Response: Hello! I'm working perfectly...

✅ Token Usage Test
   Prompt tokens: 25
   Completion tokens: 15
   Total tokens: 40
   Estimated cost: $0.0012

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All checks passed!
```

### Troubleshooting:

If you see errors:

**❌ "Invalid API key"**

- Check your key is correct
- Ensure no extra spaces
- Verify key starts with `sk-`

**❌ "Rate limit exceeded"**

- Wait a few seconds and try again
- Check your OpenAI usage limits

**❌ "Network error"**

- Check your internet connection
- Verify no firewall blocking OpenAI

---

## 🚀 Step 3: Start the Development Server

```bash
bun run dev
```

Navigate to: `http://localhost:3000`

---

## 🧪 Testing Scenarios

### Test 1: Basic AI Chat (Age-Appropriate Responses)

**Test with Lucas (Age 9):**

1. Login as Lucas
2. Ask: "Can you help me with fractions?"
3. **Expected:** Simple language, emojis, encouraging tone

**Test with Eva (Age 12):**

1. Login as Eva
2. Ask: "What's a metaphor?"
3. **Expected:** Balanced tone, some complexity, relatable examples

**Test with Pat (Age 16):**

1. Login as Pat
2. Ask: "Explain photosynthesis"
3. **Expected:** Academic language, detailed explanation, critical thinking prompts

### Test 2: Multiple Choice Task Generation

```bash
# In your app, request a practice task for Math/Fractions
```

**Expected Task Structure:**

- ✅ Question about fractions
- ✅ Exactly 4 options (A, B, C, D)
- ✅ One correct answer
- ✅ 3 plausible distractors
- ✅ Explanation included
- ✅ 3 progressive hints
- ✅ Age-appropriate language

**Test grading:**

- Submit correct answer → "🎉 Excellent work!"
- Submit incorrect answer → Encouraging feedback + hint offer

### Test 3: Open-Ended Task Generation

**Request an open-ended question:**

**Expected:**

- ✅ Thought-provoking question
- ✅ Rubric with 3-5 key points
- ✅ Word count guidance
- ✅ 3 hints
- ✅ Sample answer (optional)

**Test AI Grading:**

- Submit a good answer → 70-100 score + positive feedback
- Submit a weak answer → 30-60 score + constructive suggestions
- Submit off-topic → Low score + redirection

### Test 4: Real-World Task Generation

**Request a hands-on activity:**

**Expected:**

- ✅ Engaging activity title
- ✅ 3-5 clear instructions
- ✅ Materials list (household items)
- ✅ 3 verification questions
- ✅ Reflection prompt
- ✅ Safety notes (if needed)

### Test 5: Adaptive Task Assignment

```typescript
// This happens automatically when student requests tasks
// System should:
```

**Expected Behavior:**

- ✅ Identifies topics with lowest progress
- ✅ Assigns appropriate difficulty (easy/medium/hard)
- ✅ Mixes task types based on age:
  - Age 9-11: More MC, some OE, less RW
  - Age 12-14: Balanced MC and OE
  - Age 15-16: More OE, less MC
- ✅ Limits to 5 tasks maximum
- ✅ Prioritizes struggling topics

### Test 6: Struggle Detection

**Simulate struggling:**

1. Get 3 tasks wrong in a row
2. Use phrases like "I'm confused" or "I don't get it"
3. Ask for help multiple times

**Expected Interventions:**

- After 2 failures → "Let's try an easier problem!"
- After 3 failures → "How about we schedule time with a tutor?"
- Frustration detected → "Would you like a hint?"

### Test 7: Tutor Handoff Notes

**After simulating struggles:**

```typescript
// Generated automatically when tutor is suggested
// Or can be triggered manually for testing
```

**Expected Notes Should Include:**

- ✅ Brief summary (2-3 sentences)
- ✅ Specific struggling topics
- ✅ Teaching recommendations
- ✅ Emotional state assessment
- ✅ Formatted as clear bullet points

---

## 📊 Monitoring & Logs

### Check Token Usage:

Look in console output for:

```
[TOKEN USAGE] Operation: chat_response
  Model: gpt-4
  Prompt tokens: 450
  Completion tokens: 120
  Total tokens: 570
  Cost: $0.017
  Latency: 1850ms
  Success: true
```

### Verify Features:

- ✅ Age-appropriate tone works
- ✅ Tasks generate correctly
- ✅ Grading is accurate
- ✅ Difficulty adapts to progress
- ✅ Struggle detection triggers
- ✅ Handoff notes are helpful

---

## 🐛 Common Issues & Solutions

### Issue: Tasks not generating

**Solution:**

- Check OpenAI API key is valid
- Verify network connection
- Check console for error messages
- Retry with exponential backoff (automatic)

### Issue: Responses too slow

**Causes:**

- Large context window
- Complex prompts
- Network latency

**Solutions:**

- Reduce `OPENAI_CONTEXT_WINDOW_SIZE` to 10
- Use `gpt-3.5-turbo` for faster responses (less accurate)
- Implement caching (Phase 8)

### Issue: Token costs too high

**Monitor:**

- Check usage logs in console
- Track daily spending in OpenAI dashboard

**Optimize:**

- Reduce max_tokens (currently 500-1200)
- Shorten system prompts
- Implement caching
- Use summarization more aggressively

### Issue: Grading inconsistent

**Notes:**

- OpenAI responses have some randomness (temperature)
- Lower temperature (0.3) for grading gives more consistency
- Test same answer multiple times to verify

---

## 📈 Performance Benchmarks

### Target Metrics:

| Operation       | Target Time | Target Cost  |
| --------------- | ----------- | ------------ |
| Chat Response   | < 3s        | $0.01-0.02   |
| Task Generation | < 4s        | $0.02-0.03   |
| Task Grading    | < 2s        | $0.01-0.02   |
| Handoff Notes   | < 3s        | $0.015-0.025 |

### Daily Cost Estimate:

**Per Student (10 interactions/day):**

- 5 chat messages: ~$0.08
- 3 task generations: ~$0.07
- 2 task gradings: ~$0.03
- **Total: ~$0.18/student/day**

**100 Students:**

- $18/day
- $540/month
- $6,480/year

_Using GPT-4. GPT-3.5-turbo is 10x cheaper but less accurate._

---

## 🎯 Feature Checklist

After testing, verify:

### Core Features:

- [ ] OpenAI connection works
- [ ] Age-appropriate responses (test all 3 ages)
- [ ] Multiple choice tasks generate correctly
- [ ] Open-ended tasks generate correctly
- [ ] Real-world activities generate correctly
- [ ] Instant MC grading works
- [ ] AI grading for open-ended works
- [ ] Adaptive difficulty works
- [ ] Task type distribution correct by age
- [ ] Struggle detection triggers appropriately
- [ ] Interventions are helpful
- [ ] Handoff notes are comprehensive

### Technical Features:

- [ ] Error handling works (test with invalid key)
- [ ] Retry logic works (test with network issues)
- [ ] Token usage logged correctly
- [ ] Cost estimates accurate
- [ ] Context window management works
- [ ] Conversation summarization works
- [ ] No TypeScript errors
- [ ] No console errors (except expected logs)

---

## 🎓 Student Personas for Testing

Use these test personas:

### Lucas (Age 9, Grade 4)

- **Subjects:** Math (Fractions, Division), Science (Animals)
- **Expected Tone:** Simple, emojis, very encouraging
- **Task Types:** 50% MC, 30% OE, 20% RW
- **Topics:** Fractions (30%), Division (25%), Decimals (20%)

### Eva (Age 12, Grade 7)

- **Subjects:** English (Metaphors), Math (Algebra)
- **Expected Tone:** Balanced, some complexity
- **Task Types:** 40% MC, 40% OE, 20% RW
- **Topics:** Metaphors (struggling), Algebra, Writing

### Pat (Age 16, Grade 11)

- **Subjects:** Math (Calculus), Science (Physics)
- **Expected Tone:** Academic, challenging
- **Task Types:** 30% MC, 50% OE, 20% RW
- **Topics:** Derivatives, Momentum, Stoichiometry

### Mia (Age 10, Grade 5)

- **Subjects:** Math (Fractions), English (Grammar)
- **Expected Tone:** Simple but not babyish
- **Task Types:** 50% MC, 30% OE, 20% RW
- **Topics:** Various, well-rounded

---

## 📝 Test Results Template

Copy this to document your testing:

```markdown
## Test Results - [Date]

### Environment:

- Node/Bun Version:
- OpenAI Model: gpt-4
- API Key Status: ✅ Valid

### Test 1: Basic Chat

- Lucas (Age 9): ✅ Pass / ❌ Fail
  - Notes:
- Eva (Age 12): ✅ Pass / ❌ Fail
  - Notes:
- Pat (Age 16): ✅ Pass / ❌ Fail
  - Notes:

### Test 2: Task Generation

- Multiple Choice: ✅ Pass / ❌ Fail
  - Quality: [1-5]
  - Time: [seconds]
  - Notes:
- Open-Ended: ✅ Pass / ❌ Fail
  - Quality: [1-5]
  - Time: [seconds]
  - Notes:
- Real-World: ✅ Pass / ❌ Fail
  - Quality: [1-5]
  - Time: [seconds]
  - Notes:

### Test 3: Grading

- MC Grading: ✅ Pass / ❌ Fail
- OE Grading: ✅ Pass / ❌ Fail
- Feedback Quality: [1-5]

### Test 4: Adaptive Features

- Difficulty Adaptation: ✅ Pass / ❌ Fail
- Task Type Distribution: ✅ Pass / ❌ Fail
- Topic Prioritization: ✅ Pass / ❌ Fail

### Test 5: Struggle Detection

- Task Failure Detection: ✅ Pass / ❌ Fail
- Conversation Monitoring: ✅ Pass / ❌ Fail
- Interventions: ✅ Pass / ❌ Fail
- Handoff Notes: ✅ Pass / ❌ Fail

### Performance:

- Average Response Time: [seconds]
- Total Tokens Used: [count]
- Estimated Cost: $[amount]

### Issues Found:

1.
2.
3.

### Overall Assessment:

- System Status: ✅ Ready / ⚠️ Needs Work / ❌ Major Issues
- Recommendation:
```

---

## 🚀 Next Steps After Testing

### If Everything Works:

1. ✅ Document any configuration changes
2. ✅ Note optimal settings for your use case
3. ✅ Plan for production deployment
4. ✅ Set up monitoring/alerts
5. ✅ Consider Phase 8 optimizations (caching, batching)

### If Issues Found:

1. 🐛 Document all issues clearly
2. 📝 Note reproduction steps
3. 🔍 Check logs and error messages
4. 💬 Share findings for troubleshooting

---

## 💡 Tips for Best Results

1. **Start Simple:** Test basic chat first, then move to complex features
2. **One Feature at a Time:** Don't test everything at once
3. **Monitor Costs:** Keep OpenAI dashboard open during testing
4. **Use Test Mode:** Consider OpenAI's test environment for initial testing
5. **Document Everything:** Save examples of good and bad outputs
6. **Test Edge Cases:** Try unusual inputs, long conversations, etc.
7. **Performance First:** If slow, optimize before testing everything
8. **Iterate:** Testing → Fix → Re-test cycle

---

## 📞 Support

**Issues with this guide?**

- Check `Docs/ENV_SETUP.md` for environment details
- Review `Docs/PRD5/AITasks.md` for implementation details
- Check console logs for detailed error messages

**OpenAI API Issues?**

- Visit: https://platform.openai.com/docs
- Check status: https://status.openai.com
- View usage: https://platform.openai.com/usage

---

Good luck with testing! 🎉

Remember: This is a development environment. Test thoroughly before production use!
