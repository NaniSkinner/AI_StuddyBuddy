# 🔐 Environment Setup Guide

**AI Study Companion - OpenAI Configuration**

This guide will help you set up the required environment variables for the AI Study Companion application.

---

## Quick Start

### 1. Create `.env.local` file

Copy the `.env.example` file to `.env.local` in the root directory:

```bash
cp .env.example .env.local
```

### 2. Add Your OpenAI API Key

Edit `.env.local` and add your OpenAI API key:

```bash
OPENAI_API_KEY=sk-proj-your-key-here
```

**Get your API key:** https://platform.openai.com/api-keys

### 3. Verify Your Setup

Run the verification script to test your configuration:

```bash
bun run verify-openai
```

You should see:

```
✅ Environment variables validated
✅ OpenAI client initialized
✅ API connection successful!
🎉 All checks passed!
```

---

## Environment Variables Reference

### Required Variables

| Variable         | Description                    | Example             |
| ---------------- | ------------------------------ | ------------------- |
| `OPENAI_API_KEY` | Your OpenAI API key (required) | `sk-proj-abc123...` |

### Optional Configuration

| Variable                     | Description                                 | Default | Valid Range              |
| ---------------------------- | ------------------------------------------- | ------- | ------------------------ |
| `OPENAI_MODEL`               | OpenAI model to use                         | `gpt-4` | `gpt-4`, `gpt-3.5-turbo` |
| `OPENAI_MAX_TOKENS`          | Maximum tokens per response                 | `500`   | `1-4096`                 |
| `OPENAI_TEMPERATURE`         | Response creativity (0=focused, 2=creative) | `0.8`   | `0.0-2.0`                |
| `OPENAI_CONTEXT_WINDOW_SIZE` | Number of recent messages to include        | `15`    | `1-50`                   |

### Monitoring Variables

| Variable                | Description                   | Default   |
| ----------------------- | ----------------------------- | --------- |
| `OPENAI_LOG_USAGE`      | Log token usage to console    | `true`    |
| `OPENAI_COST_PER_TOKEN` | Cost per token for estimation | `0.00003` |

### Application Variables

| Variable                          | Description                   | Default              |
| --------------------------------- | ----------------------------- | -------------------- |
| `NEXT_PUBLIC_APP_NAME`            | Application display name      | `AI Study Companion` |
| `NEXT_PUBLIC_MAX_SUBJECTS`        | Maximum subjects per student  | `4`                  |
| `NEXT_PUBLIC_MAX_FRIEND_MESSAGES` | Friend messages limit per day | `3`                  |

---

## Complete `.env.local` Template

```bash
# ============================================
# OpenAI Configuration (REQUIRED)
# ============================================
OPENAI_API_KEY=sk-proj-your-key-here

# ============================================
# OpenAI Optional Settings
# ============================================
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.8
OPENAI_CONTEXT_WINDOW_SIZE=15

# ============================================
# Token Usage Monitoring
# ============================================
OPENAI_LOG_USAGE=true
OPENAI_COST_PER_TOKEN=0.00003

# ============================================
# Application Configuration
# ============================================
NEXT_PUBLIC_APP_NAME=AI Study Companion
NEXT_PUBLIC_MAX_SUBJECTS=4
NEXT_PUBLIC_MAX_FRIEND_MESSAGES=3
```

---

## Getting Your OpenAI API Key

### Step 1: Create OpenAI Account

1. Go to https://platform.openai.com/signup
2. Sign up or log in
3. Verify your email

### Step 2: Add Payment Method

1. Navigate to https://platform.openai.com/account/billing
2. Add a payment method
3. Add initial credits (minimum $5 recommended)

### Step 3: Create API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Give it a name (e.g., "AI Study Companion - Dev")
4. Copy the key (starts with `sk-`)
5. **Save it somewhere safe - you won't see it again!**

### Step 4: Set Usage Limits (Recommended)

1. Go to https://platform.openai.com/account/limits
2. Set monthly budget limit (e.g., $20)
3. Set email notifications

---

## Cost Estimation

### Development Phase (1 week)

- ~500 API calls
- ~250,000 tokens total
- **Estimated cost: $7.50** (with GPT-4)

### Production Usage (per student per day)

- ~10 AI interactions
- ~5,000 tokens
- **Cost: ~$0.15 per student per day**

### Example Monthly Costs

| Students | Daily Cost | Monthly Cost (30 days) |
| -------- | ---------- | ---------------------- |
| 10       | $1.50      | $45                    |
| 50       | $7.50      | $225                   |
| 100      | $15.00     | $450                   |

**💡 Tip:** Use `gpt-3.5-turbo` for development to reduce costs by ~10x

---

## Troubleshooting

### ❌ Error: "OPENAI_API_KEY is required"

**Solution:**

1. Make sure you created `.env.local` (not `.env`)
2. Verify the variable name is exactly `OPENAI_API_KEY`
3. Restart your dev server after adding the key

### ❌ Error: "Authentication failed"

**Solution:**

1. Check your API key is correct (starts with `sk-`)
2. Verify you copied the entire key (they're long!)
3. Make sure you have billing set up
4. Check your key isn't expired or revoked

### ❌ Error: "Rate limit exceeded"

**Solution:**

1. You're making too many requests too quickly
2. Wait 1 minute and try again
3. Check you don't have multiple dev servers running
4. Consider increasing your rate limit in OpenAI dashboard

### ❌ Error: "Insufficient credits"

**Solution:**

1. Add credits at https://platform.openai.com/account/billing
2. Minimum $5 recommended for testing
3. Set up auto-recharge for convenience

### 🌐 Network Connection Issues

**Solution:**

1. Check your internet connection
2. Try visiting https://api.openai.com in your browser
3. Check if you're behind a corporate firewall
4. Verify OpenAI status at https://status.openai.com

---

## Security Best Practices

### ✅ DO:

- Keep your API key in `.env.local` (gitignored)
- Set monthly spending limits
- Use separate keys for dev/production
- Rotate keys periodically
- Monitor usage regularly

### ❌ DON'T:

- Commit API keys to Git
- Share keys publicly
- Use same key for multiple projects
- Expose keys in client-side code
- Leave unused keys active

---

## Verification Checklist

Before starting development, verify:

- [ ] `.env.local` file created
- [ ] `OPENAI_API_KEY` added (starts with `sk-`)
- [ ] Verification script runs successfully (`bun run verify-openai`)
- [ ] OpenAI account has billing set up
- [ ] Monthly spending limit is set
- [ ] API key is kept secure (not committed to Git)

---

## Next Steps

Once your environment is configured:

1. **Start Development Server:**

   ```bash
   bun run dev
   ```

2. **Test AI Features:**

   - Open http://localhost:3000
   - Login as a student
   - Send a chat message
   - Generate a practice task

3. **Monitor Usage:**

   - Check console for token usage logs
   - Review costs at https://platform.openai.com/usage

4. **Continue Implementation:**
   - Move to Phase 2: Enhanced Context Management
   - Implement task generation features
   - Build adaptive learning system

---

**Need Help?**

- OpenAI Documentation: https://platform.openai.com/docs
- OpenAI Support: https://help.openai.com
- Project Documentation: See `Docs/` directory

---

**Last Updated:** November 8, 2025
