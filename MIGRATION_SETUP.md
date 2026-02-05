# Task Management System - Setup & Migration Guide

## Prerequisites

Before running the migration, ensure:
1. Database is backed up
2. Node.js and pnpm are installed
3. You're in the project root directory

## Step-by-Step Setup

### 1. Generate Prisma Client

First, regenerate the Prisma client to include the new models:

```bash
cd c:\Users\EliteBook\Desktop\taf
pnpm install @prisma/client@latest
```

### 2. Create & Run Migration

Create a migration for the schema changes:

```bash
pnpm exec prisma migrate dev --name add_task_system
```

This will:
- Create a migration file with SQL changes
- Apply the migration to your database
- Regenerate Prisma Client with new types

### 3. Verify Models

Check that new models are available:

```bash
pnpm exec prisma generate
```

### 4. Type Check Project

Verify TypeScript compiles without errors:

```bash
pnpm exec tsc --noEmit
```

## What Gets Changed in Database

### New Tables

1. **team_task** - Team-wide tasks
   - id, teamId, title, description, status, priority, dueDate, createdById, createdAt, updatedAt

2. **team_task_assignment** - Individual task assignments
   - id, taskId, teamMemberId, userId, status, submittedAt
   - approvedBy, approvalStatus, approvalComment, approvedAt
   - creditsAwarded, createdAt, updatedAt

3. **member_credit** - Member performance tracking
   - id, userId, startupId, totalCredits, creditsJson
   - tasksCompleted, tasksApproved, tasksRejected, approvalRate
   - achievementBadges, updatedAt

### Modified Tables

1. **team** table
   - Adds: `eventId`, `projectId` (nullable foreign keys)
   - Removes: relationship restriction (teams can now belong to many projects/events)

2. **event** table
   - Schema unchanged - adds one-to-many relationship with teams

3. **project** table
   - Schema unchanged - adds one-to-many relationship with teams

4. **user** table
   - Adds 4 new relations (no schema columns added):
     - `teamTasksCreated` → teamTask (one-to-many)
     - `taskAssignments` → teamTaskAssignment (one-to-many)
     - `taskApprovalsGiven` → teamTaskAssignment (one-to-many)
     - `memberCredits` → memberCredit (one-to-many)

5. **startup** table
   - Adds 1 new relation:
     - `memberCredits` → memberCredit (one-to-many)

## Rollback Steps (If Needed)

If something goes wrong:

```bash
# View all migrations
pnpm exec prisma migrate status

# Rollback last migration (development only!)
pnpm exec prisma migrate resolve --rolled-back "add_task_system"

# Or manually reset (CAUTION - deletes all data!)
pnpm exec prisma migrate reset
```

## Post-Migration Checklist

- [ ] Database migration completed successfully
- [ ] Prisma Client regenerated
- [ ] TypeScript compiles without errors (`pnpm run build`)
- [ ] Application starts without errors (`pnpm run dev`)
- [ ] Can access HR sidebar with new menu items:
  - [ ] Task Management section visible
  - [ ] "Create Tasks" link works
  - [ ] "Review Tasks" link works
  - [ ] Member Credits link works
- [ ] Employee can see home page with tasks
- [ ] HR can create task for team
- [ ] Tasks auto-assign to team members
- [ ] Employee can submit task
- [ ] HR can review and approve task
- [ ] Credits awarded on approval

## API Endpoints Ready After Migration

All endpoints should work after Prisma client is regenerated:

- `POST /api/teams/tasks` - Create task
- `GET /api/teams/tasks` - Get tasks
- `PUT /api/teams/tasks/[assignmentId]` - Submit/Approve/Reject
- `GET /api/employees/tasks` - Get employee tasks
- `GET /api/members/credits` - Get member scores (HR only)
- `GET /api/teams` - Get teams

## Pages Ready After Migration

All UI pages are ready to use:

- `/dashboard/employee/home` - Employee home with tasks
- `/dashboard/hr/tasks/create` - Create tasks form
- `/dashboard/hr/tasks/review` - Review submissions form
- `/dashboard/hr/members/credits` - Member performance dashboard

## Troubleshooting

### Error: Property 'teamTask' does not exist

**Cause:** Prisma client not regenerated after schema changes

**Solution:**
```bash
pnpm exec prisma generate
```

### Error: relation "team_task" does not exist

**Cause:** Migration not applied to database

**Solution:**
```bash
pnpm exec prisma migrate dev
```

### Error: Type 'teamTask' not assignable to 'never'

**Cause:** Stale TypeScript cache

**Solution:**
```bash
rm -rf .next
pnpm run build
```

### Database connection error during migration

**Cause:** Database offline or wrong connection string

**Solution:**
1. Check `.env.local` has correct `DATABASE_URL`
2. Verify database server is running
3. Test connection: `pnpm exec prisma db push --skip-generate`

## Support

For issues during migration:
1. Check Prisma status: `pnpm exec prisma migrate status`
2. Review migration file in: `prisma/migrations/`
3. Check database logs for SQL errors

---

**Migration Command Summary:**
```bash
# All-in-one (recommended):
pnpm exec prisma migrate dev --name add_task_system

# Or step by step:
pnpm exec prisma generate
pnpm exec prisma db push
pnpm run build
```
