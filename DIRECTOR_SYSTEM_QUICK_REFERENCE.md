# Director System - Quick Reference

## What is a Director?
A **Director** (or Manager) is a person assigned by HR to oversee a project, event, or team. They get full access to manage:
- All details of their assigned resource
- Team members and participants
- Group creation and management
- Team leads and supervisors
- Full visibility into everything related to that resource

## Key Points

✅ **Multiple Directors**: Can assign 2+ directors to same resource  
✅ **Full Access**: Directors see and manage everything in their assigned resource  
✅ **Different Roles**: DIRECTOR, CO_DIRECTOR, or LEAD  
✅ **Easy to Manage**: Remove directors anytime  
✅ **HR Only**: Only HR can assign/remove directors  

## Quick Links

### For HR (Managing Directors)
```
API: GET /api/directors - View all director assignments
API: POST /api/projects/[id]/directors - Add project director
API: POST /api/events/[id]/directors - Add event director
API: POST /api/teams/[id]/directors - Add team director
Component: <DirectorManagement /> - UI for managing directors
```

### For Directors (Viewing Assignments)
```
API: GET /api/directors/me - See my directorships
Component: <DirectorDashboard /> - View all my assignments
```

## Database Tables Added
- `projectDirector` - Director assignments for projects
- `eventDirector` - Director assignments for events
- `teamDirector` - Director assignments for teams

## Implementation Steps

1. **Run Migration**
   ```bash
   npx prisma migrate dev
   ```

2. **HR Assigns Director**
   - Open project/event/team details
   - Go to "Director Management"
   - Select employee
   - Choose role
   - Click assign

3. **Director Sees Assignment**
   - Log in to dashboard
   - Go to "My Directorships"
   - View all assigned resources
   - Full access to manage each

## File Structure
```
lib/
  director-permissions.ts          # Permission checking functions

app/api/
  directors/route.ts               # Bulk director operations
  directors/me/route.ts            # Get my directorships
  projects/[id]/directors/route.ts # Project director endpoints
  events/[id]/directors/route.ts   # Event director endpoints
  teams/[id]/directors/route.ts    # Team director endpoints

components/
  director-management.tsx          # HR assignment UI
  director-dashboard.tsx           # Director view UI

prisma/schema.prisma              # Added 3 new models + relationships
```

## Usage Examples

### Assign Director (HR)
```typescript
// POST /api/projects/proj-123/directors
{
  "userId": "user-456",
  "role": "DIRECTOR"
}
```

### Get My Assignments (Director)
```typescript
// GET /api/directors/me
// Returns: projects, events, teams I direct
```

### Check Permissions
```typescript
import { isProjectDirector } from "@/lib/director-permissions"

const isDirector = await isProjectDirector(projectId, userId)
if (isDirector) {
  // Grant access
}
```

## Notes
- Directors must be employees in the system
- HR role required to manage directors
- Each director assignment is unique (can't assign same person twice)
- Delete director assignment to remove access
- Support for 3+ directors per resource
