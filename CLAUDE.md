# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. It uses Claude AI to generate React components through a chat interface, storing them in a virtual file system.

## Key Commands

### Setup
```bash
npm run setup  # Install deps, generate Prisma client, run migrations
```

### Development
```bash
npm run dev              # Start dev server with Turbopack
npm run dev:daemon       # Start in background, logs to logs.txt
npm test                 # Run Vitest tests
npm run lint             # Run ESLint
```

### Database
```bash
npx prisma generate      # Regenerate Prisma client
npx prisma migrate dev   # Create/apply migrations
npm run db:reset         # Reset database (destructive)
```

## Architecture

### Virtual File System
- Core class: `VirtualFileSystem` in `src/lib/file-system.ts`
- Keeps generated files in-memory, not on disk
- Serializes to JSON for database persistence
- Methods: `createFileWithParents()`, `replaceInFile()`, `insertInFile()`, `rename()`, `deleteFile()`

### AI Integration
- **Chat API**: `src/app/api/chat/route.ts` - streams responses using Vercel AI SDK
- **Tools**: Two AI tools enable code generation:
  - `str_replace_editor` (`src/lib/tools/str-replace.ts`) - view, create, edit files
  - `file_manager` (`src/lib/tools/file-manager.ts`) - rename, delete files/folders
- **System Prompt**: `src/lib/prompts/generation.tsx` - instructs AI to generate React components
- **Mock Provider**: `src/lib/provider.ts` - provides static responses when ANTHROPIC_API_KEY is not set

### Database
- **Schema**: `prisma/schema.prisma` - SQLite with User and Project models
- **Client**: Generated to `src/generated/prisma/` (non-standard location)
- **Access**: Use `prisma` from `src/lib/prisma.ts`

### Component Structure
- `src/components/chat/` - Chat interface (MessageList, MessageInput, ChatInterface)
- `src/components/editor/` - Code editor with Monaco
- `src/components/preview/` - Live preview of generated components
- `src/components/auth/` - Authentication UI
- `src/components/ui/` - Shadcn/ui components

### State Management
- React Context in `src/lib/contexts/`
- Project state synced to database on message completion

### Routing
- Next.js App Router
- `/` - Landing page
- `/[projectId]` - Project workspace with chat, editor, preview tabs
- `/api/chat` - Streaming chat endpoint (maxDuration: 120s)

## Development Notes

- The app works without an API key (returns static mock components)
- Generated components must have `/App.jsx` as entrypoint
- All generated code uses `@/` import alias for local files
- Virtual FS root is `/` (not a real filesystem)
- Tests use Vitest with jsdom environment

## Coding Style

- Use comments sparingly. Only comment complex code.
