# Prompt Architect

A lead magnet web application for Optimi that helps users build better AI prompts through interactive conversations.

## Features

✅ **Interactive Chat Interface**: AI-powered conversations using Together.ai  
✅ **Three Prompt Categories**: Custom Instructions, Projects/Gems, and Thread Conversations  
✅ **Usage Limits**: 3 free conversations per category, expandable with authentication  
✅ **Responsive Design**: Mobile-friendly interface with Tailwind CSS  
✅ **Expert System Prompts**: Specialized AI guidance for each prompt category  
✅ **Optimi Brand Colors**: Professional styling with custom brand colors  

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