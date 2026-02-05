# Director System - Quick Reference Card

## What Is A Director?
A director is a person assigned by HR to oversee and manage a project, event, or team. They get **FULL ACCESS** to all details and can manage everything within that resource.

## Key Numbers
- **3** new database models
- **12** new API endpoints  
- **2** new UI components
- **9** utility functions
- **Multiple** directors per resource

## The Three Resource Types

### 🎯 PROJECT
```
Directors can:
├── View all project details
├── Manage team assignments
├── Oversee project timeline
├── View all tasks
├── Approve team activities
└── Full project management
```

### 📅 EVENT
```
Directors can:
├── View event details
├── Manage registrations
├── Oversee attendance
├── Manage event teams
├── View feedback
└── Full event management
```

### 👥 TEAM
```
Directors can:
├── View team members
├── Create subgroups
├── Assign team leads/chiefs
├── Oversee team activities
├── Manage team tasks
└── Full team management
```

## Three Role Types

| Role | Authority | Use Case |
|------|-----------|----------|
| **DIRECTOR** | Full | Primary manager |
| **CO_DIRECTOR** | Shared | Joint management |
| **LEAD** | Limited | Team lead (teams only) |

## Quick API Reference

### Assign Director (HR Only)
```bash
POST /api/projects/[id]/directors
{ "userId": "user-id", "role": "DIRECTOR" }
```

### List Directors
```bash
GET /api/projects/[id]/directors
GET /api/events/[id]/directors
GET /api/teams/[id]/directors
```

### Remove Director (HR Only)
```bash
DELETE /api/projects/[id]/directors
{ "userId": "user-id" }
```

### Get My Assignments (Any User)
```bash
GET /api/directors/me
# Returns: projects, events, teams, summary
```

### View All Directors (HR Only)
```bash
GET /api/directors
GET /api/directors?type=project
GET /api/directors?type=event
GET /api/directors?userId=user-id
```

### Bulk Assign (HR Only)
```bash
POST /api/directors
{
  "type": "project",
  "resourceId": "proj-123",
  "userIds": ["user-1", "user-2"],
  "role": "DIRECTOR"
}
```

## UI Components Quick Start

### Show Director Assignment UI
```tsx
import { DirectorManagement } from "@/components/director-management"

<DirectorManagement
  type="project"
  resourceId={projectId}
  resourceName="Project Name"
/>
```

### Show Director Dashboard
```tsx
import { DirectorDashboard } from "@/components/director-dashboard"

<DirectorDashboard />
```

## Permission Functions

```typescript
// Check if user is director
import { 
  isProjectDirector,
  isEventDirector, 
  isTeamDirector,
  getProjectDirectors,
  getEventDirectors,
  getTeamDirectors
} from "@/lib/director-permissions"

// Usage
const isDirector = await isProjectDirector(projectId, userId)
if (isDirector) {
  // Grant full access
}

// Get all directors
const directors = await getProjectDirectors(projectId)
```

## Flow: Assigning a Director

```
1. HR opens project page
   ↓
2. Finds "Director Management" section
   ↓
3. Selects employee from dropdown
   ↓
4. Chooses role (DIRECTOR, CO_DIRECTOR)
   ↓
5. Clicks "Assign Director"
   ↓
6. ✓ Director assigned!
   ↓
7. Employee can now:
   - See this resource in "My Directorships"
   - Full access to manage
```

## Flow: Director Using Assignment

```
1. Log in as director
   ↓
2. Go to "My Directorships" 
   ↓
3. See all assigned resources:
   - 3 Projects
   - 2 Events
   - 1 Team
   ↓
4. Click on any resource
   ↓
5. Get full access to:
   - Details & info
   - Team members
   - Activities
   - Manage everything
```

## Database Tables

### projectDirector
```
id, projectId, userId, role, createdAt, updatedAt
Unique: (projectId, userId)
```

### eventDirector
```
id, eventId, userId, role, createdAt, updatedAt
Unique: (eventId, userId)
```

### teamDirector
```
id, teamId, userId, role, createdAt, updatedAt
Unique: (teamId, userId)
```

## Access Control Matrix

```
Who can... | Assign | View | Remove
-----------|--------|------|--------
HR         |   ✓    |  ✓   |   ✓
Director   |   ✗    |  ✓   |   ✗
Member     |   ✗    |  ✓*  |   ✗
Other      |   ✗    |  ✗   |   ✗

* Only if assigned to resource
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| **201** | Director assigned successfully |
| **200** | Success (GET/DELETE) |
| **400** | Bad request (missing data/duplicate) |
| **401** | Unauthorized (not HR) |
| **404** | Resource not found |
| **500** | Server error |

## Common Queries

### "How do I make John a director?"
```
HR Dashboard → Project → Director Management → 
Select "John" → Role "DIRECTOR" → Assign
```

### "How do I see what I direct?"
```
Dashboard → My Directorships → See all assignments
```

### "Can one person direct multiple things?"
```
YES! Multiple assignments supported
John can direct:
- 3 Projects
- 2 Events  
- 1 Team
All simultaneously
```

### "Can multiple people direct one thing?"
```
YES! Multiple directors supported
Project X can have:
- John (DIRECTOR)
- Jane (CO_DIRECTOR)
- Bob (DIRECTOR)
All 3 direct same project
```

### "What if I remove a director?"
```
POST /api/projects/[id]/directors
DELETE → Director removed
User loses access immediately
```

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| "Not authorized" | Check user is HR role |
| "Director already assigned" | User already directs this |
| "404 Not found" | Check resource ID exists |
| "No directors show up" | Check user is logged in |
| "Changes not reflecting" | Refresh page or restart |

## Files You Need

| File | Purpose |
|------|---------|
| **lib/director-permissions.ts** | Permission checking |
| **components/director-management.tsx** | HR assignment UI |
| **components/director-dashboard.tsx** | Director view |
| **app/api/directors/** | API endpoints |
| **prisma/schema.prisma** | Database schema |

## Database Migration

```bash
# One command to set it all up
npx prisma migrate dev --name add-director-system

# That's it! Tables created, types generated
```

## Next Steps After Setup

1. ✅ Run migration
2. ✅ Add components to pages
3. ✅ Test with HR assigning
4. ✅ Test with director viewing
5. ✅ Launch to production!

## Key Takeaways

✨ **Multiple directors per resource** - Team management doesn't have to be solo  
✨ **Full access** - Directors see and control everything  
✨ **Easy assignment** - HR can assign in seconds  
✨ **Clear dashboard** - Directors see all assignments  
✨ **Flexible roles** - Different authority levels  
✨ **Type-safe** - Built with TypeScript and Prisma  
✨ **Production-ready** - All error handling included  

---

**Questions?** See DIRECTOR_SYSTEM_GUIDE.md for full documentation
