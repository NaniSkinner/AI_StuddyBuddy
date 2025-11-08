# ✅ Quick Testing Checklist

Use this for quick verification of all AI features.

---

## 🔧 Setup (One-Time)

- [ ] Create `.env.local` file
- [ ] Add OpenAI API key
- [ ] Run `bun install` (if not done)
- [ ] Run `bun run verify-openai`
- [ ] See "All checks passed!" ✅

---

## 🚀 Quick Start

```bash
# Start the app
bun run dev

# Open browser
http://localhost:3000
```

---

## 🧪 Feature Testing (15 minutes)

### 1. Age-Appropriate Responses (3 min)

- [ ] Login as **Lucas (9)** → Ask about fractions → Should use simple words + emojis
- [ ] Login as **Eva (12)** → Ask about metaphors → Should be balanced, clear
- [ ] Login as **Pat (16)** → Ask about calculus → Should be academic, detailed

### 2. Task Generation (5 min)

- [ ] Request **Multiple Choice** task → Check: 4 options, correct answer, hints
- [ ] Request **Open-Ended** task → Check: rubric with key points, hints
- [ ] Request **Real-World** task → Check: activity, instructions, materials

### 3. Grading System (3 min)

- [ ] Complete MC task correctly → Should show "🎉 Excellent!"
- [ ] Complete MC task incorrectly → Should offer hint
- [ ] Submit open-ended answer → Should get score + specific feedback

### 4. Adaptive Features (2 min)

- [ ] Check if tasks match student's progress level
- [ ] Verify task types match age (MC/OE/RW distribution)
- [ ] Confirm struggling topics prioritized

### 5. Struggle Detection (2 min)

- [ ] Get 2-3 tasks wrong → Should suggest easier task or hint
- [ ] Use phrases like "I'm confused" → Should offer help
- [ ] Multiple failures → Should suggest tutor

---

## ✅ Success Criteria

**System is working if:**

- ✅ All responses are age-appropriate
- ✅ Tasks generate with correct structure
- ✅ Grading provides helpful feedback
- ✅ Difficulty adapts to student
- ✅ Interventions trigger when struggling
- ✅ No TypeScript errors in console
- ✅ Response time < 5 seconds
- ✅ Token usage logged correctly

---

## 🐛 Quick Troubleshooting

**Problem:** OpenAI errors
→ **Fix:** Check API key in `.env.local`

**Problem:** Slow responses
→ **Fix:** Reduce `OPENAI_MAX_TOKENS` to 400

**Problem:** Tasks not generating
→ **Fix:** Check console for errors, verify API key has credits

**Problem:** Incorrect TypeScript errors
→ **Fix:** Run `bun run build` to check compilation

---

## 📊 Monitor During Testing

Watch console for:

```
[TOKEN USAGE] Operation: chat_response
  Total tokens: 570
  Cost: $0.017
  Success: true ✅
```

**Expected costs during testing (~1 hour):**

- Chat: ~20 messages × $0.02 = $0.40
- Tasks: ~10 generations × $0.03 = $0.30
- Grading: ~5 grades × $0.02 = $0.10
- **Total: ~$0.80 for comprehensive testing**

---

## 🎯 Quick Test Scenario

**The "5-Minute Smoke Test":**

1. Run `bun run verify-openai` → Should pass ✅
2. Start app: `bun run dev`
3. Login as Lucas
4. Say: "Help me with fractions"
5. Request a practice task
6. Complete the task
7. Check feedback

**If all 7 steps work → System is functional!** 🎉

---

## 📝 Found Issues?

Document here:

```
Issue:
Steps to reproduce:
Expected:
Actual:
Console errors:
```

---

## Next Steps

- [ ] All tests pass → Ready for production prep!
- [ ] Some issues → Review logs and fix
- [ ] Performance concerns → Consider Phase 8 optimization
- [ ] Everything works → Celebrate! 🎉

---

**Testing Date:** ******\_\_\_******  
**Tester:** ******\_\_\_******  
**Result:** ⬜ Pass | ⬜ Fail | ⬜ Needs Work
