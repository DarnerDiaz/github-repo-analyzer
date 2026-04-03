# Database Configuration & Architecture

## Overview

The GitHub Repository Analyzer uses **SQLite with Prisma ORM** for persistent data storage. This enables:

- Repository analysis history
- Chat session persistence
- Message conversation history
- Pagination and efficient querying

## Database Setup

### Automatic Setup

The database is automatically created and initialized when you run:

```bash
npm run dev
```

This will:
1. Create/migrate the SQLite database (`dev.db`)
2. Create all necessary tables
3. Validate the connection

### Manual Migration

If needed, manually run migrations:

```bash
npx prisma migrate dev
```

## Database Schema

### Tables

**Repository**
- `id` (primary key)
- `owner` — Repository owner username
- `name` — Repository name
- `fullName` — `owner/name` (unique)
- `url` — GitHub repository URL
- `stars` — Star count
- `forks` — Fork count
- `language` — Primary language
- `description` — Repository description
- `createdAt`, `updatedAt` — Timestamps

**Analysis**
- `id` (primary key)
- `repositoryId` — Foreign key to Repository
- `summary` — Repository summary
- `structure` — Architecture/structure info
- `keyFiles` — Important files (JSON array)
- `technologies` — Technology stack (JSON array)
- `createdAt`, `updatedAt` — Timestamps

**ChatSession**
- `id` (primary key)
- `repositoryId` — Foreign key to Repository
- `title` — Session title
- `createdAt`, `updatedAt` — Timestamps

**ChatMessage**
- `id` (primary key)
- `sessionId` — Foreign key to ChatSession
- `role` — Message role ('user' or 'assistant')
- `content` — Message content
- `createdAt` — Timestamp

## Accessing the Database

### Prisma Studio (Visual Explorer)

View and edit database records with a GUI:

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

### Programmatic Access

The `prisma` client is exported from `src/lib/prisma.ts`:

```typescript
import { prisma } from '@/lib/prisma';

// Create
const repo = await prisma.repository.create({
  data: { owner: 'facebook', name: 'react', ... }
});

// Read
const repo = await prisma.repository.findUnique({
  where: { fullName: 'facebook/react' }
});

// Update
await prisma.repository.update({
  where: { id: 'xxx' },
  data: { stars: 200000 }
});

// Delete
await prisma.repository.delete({
  where: { id: 'xxx' }
});
```

## Performance Optimization

### Indexes

Database indexes are defined on:
- `Repository.fullName` (unique)
- `Repository(owner, name)`
- `Analysis.repositoryId`
- `ChatSession.repositoryId`
- `ChatMessage.sessionId`

### Query Strategies

For better performance:

```typescript
// ✅ Efficient - loads related data
const session = await prisma.chatSession.findUnique({
  where: { id },
  include: { messages: true, repository: true }
});

// ✅ Efficient - pagination
const sessions = await prisma.chatSession.findMany({
  take: 10,
  skip: page * 10,
  orderBy: { createdAt: 'desc' }
});

// ❌ Inefficient - N+1 queries
for (const session of sessions) {
  const messages = await prisma.chatMessage.findMany({
    where: { sessionId: session.id }
  });
}
```

## Windows SQLite Timeout Fix

On Windows, SQLite file locking can cause timeouts. The solution:

**Database URL Configuration:**
```bash
DATABASE_URL="file:./dev.db?timeout=10000"
```

The `?timeout=10000` parameter gives SQLite 10 seconds to acquire file locks.

**Retry Logic:**

All API routes implement exponential backoff retry logic (up to 3 attempts) for timeout errors.

## Troubleshooting

### Error: "database is locked"

**Cause:** Multiple processes accessing the database simultaneously
**Solution:** 
1. Stop the dev server
2. Clear lock files: `rm -rf .next`
3. Restart: `npm run dev`

### Error: "unable to index file"

**Cause:** Corrupted database file
**Solution:**
```bash
rm dev.db dev.db-journal
npm run dev  # Recreates database
```

### Slow queries

**Check:**
1. Use Prisma Studio to inspect data volume
2. Review indexes on frequently queried fields
3. Use `.include()` instead of separate queries

## Backup & Migration

### Backup Database

```bash
cp dev.db dev.db.backup
```

### Export Data

```bash
npx prisma db execute --stdin < export.sql
```

### Production Setup

For production, consider:
- PostgreSQL or MySQL (SQLite is dev-only)
- Connection pooling (PgBouncer for Postgres)
- Automated backups
- Read replicas

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then redeploy with: `npx prisma migrate deploy`
