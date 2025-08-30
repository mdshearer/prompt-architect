# Prompt Architect

A lead magnet web application for Optimi that helps users build better AI prompts through interactive conversations.

## Features

✅ **Enhanced Chat Interface**: Premium messaging experience with professional chat bubbles, typing indicators, and smooth animations  
✅ **Educational Framework**: Conversational coaching for Custom Instructions, Projects/Gems, and Thread Prompts using OPTIMI methodology  
✅ **Sophisticated Message System**: Real-time status indicators, copy-to-clipboard, multi-line input with auto-resize  
✅ **Expert AI Coaching**: Specialized system prompts with educational content and progressive learning  
✅ **Usage Management**: Smart limits with upgrade prompts and progress tracking  
✅ **Responsive Design**: Mobile-optimized interface with Optimi brand colors  
✅ **Platform Integration**: Cross-platform compatibility guidance (ChatGPT, Claude, Gemini, Copilot)  

## Live Demo

Visit the app at: **http://localhost:3001** (after setup)

## Quick Setup

1. **Database Setup**
   - Run the SQL in `supabase-schema.sql` in your Supabase dashboard
   - Go to Supabase Project → SQL Editor → Execute the schema

2. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

3. **Test the Chat**
   - Click any category on the homepage
   - Start a conversation with the AI
   - Test the 3-message free limit

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: Together.ai (Llama-3.3-70B-Instruct-Turbo)
- **Deployment**: Ready for Vercel

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Together.ai   │
│   (Next.js)     │◄──►│   (Auth + DB)   │    │   (AI Chat)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Development

See `CLAUDE.md` for detailed development guidance.

---

**Built with ❤️ for Optimi's lead generation**