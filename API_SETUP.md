# API Configuration Guide

## Google Gemini API Setup (Required)

The application requires a Google Gemini API key to generate AI-powered repository analysis and chat responses.

### Step 1: Get Your Free API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Select or create a Google Cloud project
4. Your API key will be displayed - **copy it**

### Step 2: Add to Your Environment

Open `.env.local` in the project root and add:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with the key you copied.

**Example:**
```bash
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyDnRveyHJ0K2L3M4N5O6P7Q8R9S0T1U2V
```

### Step 3: Restart the Dev Server

If the server is running, stop it (Ctrl+C) and restart:

```bash
npm run dev
```

## Troubleshooting

### Error: "Method doesn't allow unregistered callers"

This error means:
- ✗ API key is missing or empty
- ✗ API key is invalid
- ✗ Changes to `.env.local` weren't applied

**Solution:**
1. Check that `.env.local` has: `NEXT_PUBLIC_GEMINI_API_KEY=your_key_here`
2. Verify the API key from [AI Studio](https://makersuite.google.com/app/apikey)
3. Make sure there are no spaces: `NEXT_PUBLIC_GEMINI_API_KEY=AIzaS...` (not `AIzaS ... `)
4. Restart the dev server

### Error: "Invalid API Key"

**Solution:**
1. Go back to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key (delete the old one if needed)
3. Copy the new key and update `.env.local`
4. Restart the dev server

### AI features not working

If the chat responds but slowly or with errors:
1. Check your Google Cloud project's billing setup
2. Verify the Gemini API is enabled
3. Check your API quota at [Google Cloud Console](https://console.cloud.google.com)

## GitHub API (Optional)

For enhanced repository analysis, you can optionally add a GitHub token:

1. Go to [GitHub Settings → Developer Settings → Tokens](https://github.com/settings/tokens)
2. Generate a new classic token with `repo` scope
3. Add to `.env.local`: `GITHUB_TOKEN=your_token_here`

This allows:
- Higher rate limits for GitHub API calls
- Better repository analysis
- Access to private repository metadata

## Security Notes

- ✅ `NEXT_PUBLIC_GEMINI_API_KEY` is safe to commit (it's public)
- ⚠️ Never share your actual API key in version control
- ⚠️ Rotate your key if accidentally exposed
- ✅ Use `.env.local` for local overrides (it's gitignored)

## Need Help?

- Check the browser console (F12) for detailed error messages
- See the terminal output of `npm run dev` for server-side errors
- Review [Google Gemini API docs](https://ai.google.dev/)
