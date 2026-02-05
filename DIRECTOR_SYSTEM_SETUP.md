# Director System - Setup Instructions

## Step 1: Update Prisma Schema ✅
The schema has been updated with three new models:
- `projectDirector`
- `eventDirector`
- `teamDirector`

Location: `prisma/schema.prisma`

## Step 2: Run Prisma Migration

Execute this command to create the database tables:

```bash
# Navigate to project root
cd c:\Users\EliteBook\Desktop\taf

# Run migration
npx prisma migrate dev --name add-director-system
```

This will:
1. Generate Prisma Client with new types
2. Create migration file
3. Apply migration to database
4. Clear TypeScript errors (models will be recognized)

## Step 3: Verify Installation

After migration, all TypeScript errors should be resolved. Check:

```bash
# Generate Prisma Client if needed
npx prisma generate
```

## Step 4: Test Endpoints

Once migration is complete, test the APIs:

```bash
# Test director assignment (as HR)
curl -X POST http://localhost:3000/api/projects/[projectId]/directors \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "role": "DIRECTOR"
  }'

# Get directors
curl http://localhost:3000/api/directors

# Get my assignments
curl http://localhost:3000/api/directors/me
```

## Step 5: Integrate UI Components

Add the components to your pages:

### In HR Dashboard (Managing Directors)
```tsx
import { DirectorManagement } from "@/components/director-management"

export default function ProjectPage({ params }) {
  return (
    <div>
      <DirectorManagement
        type="project"
        resourceId={params.projectId}
        resourceName="Project Name"
      />
    </div>
  )
}
```

### In Director Dashboard
```tsx
import { DirectorDashboard } from "@/components/director-dashboard"

export default function DirectorPage() {
  return (
    <div>
      <DirectorDashboard />
    </div>
  )
}
```

## Files Created

### Database Schema
- `prisma/schema.prisma` - Updated with director models

### Utility Files
- `lib/director-permissions.ts` - Permission checking functions

### API Endpoints
- `app/api/directors/route.ts` - Bulk operations
- `app/api/directors/me/route.ts` - User's directorships
- `app/api/projects/[projectId]/directors/route.ts` - Project directors
- `app/api/events/[eventId]/directors/route.ts` - Event directors
- `app/api/teams/[teamId]/directors/route.ts` - Team directors

### UI Components
- `components/director-management.tsx` - HR assignment UI
- `components/director-dashboard.tsx` - Director view

### Documentation
- `DIRECTOR_SYSTEM_GUIDE.md` - Full documentation
- `DIRECTOR_SYSTEM_QUICK_REFERENCE.md` - Quick reference
- `DIRECTOR_SYSTEM_SETUP.md` - This file

## Troubleshooting

### TypeScript Errors After Creating Files
**Solution**: Run `npx prisma generate` and wait for migration to complete

### Models Not Found in Prisma
**Solution**: Ensure migration ran successfully:
```bash
npx prisma migrate status
```

### API Returns 401
**Solution**: Ensure user is HR role:
```typescript
// In lib/auth.ts
if (session.user.role !== "HR") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

### Delete Method Fails
**Solution**: The `deleteUnique` method doesn't work with delete in the current Prisma API. Use:
```typescript
await prisma.projectDirector.delete({
  where: {
    projectId_userId: { projectId, userId }
  }
})
```

## Next Steps

1. ✅ Schema updated
2. ⏳ Run migration
3. ⏳ Test APIs
4. ⏳ Integrate UI components
5. ⏳ Add to HR dashboard pages
6. ⏳ Add director dashboard page
7. ⏳ Test end-to-end

## Notes

- Directors are assigned by HR only
- Multiple directors per resource supported
- Directors get full access to assigned resources
- Use permission functions to check access in routes
- Directors see teams, members, and can manage groups under them
