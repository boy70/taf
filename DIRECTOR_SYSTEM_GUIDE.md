# Director/Manager System Documentation

## Overview

The Director/Manager system allows HR administrators to assign one or more directors (managers) to projects, events, and teams. Directors get full access to manage and view all details of their assigned resources, including team members, subgroups, and event participants.

## Key Features

### 1. **Multiple Directors Per Resource**
- Assign multiple directors to a single project, event, or team
- Each director can have a different role: DIRECTOR, CO_DIRECTOR, or LEAD
- Perfect for larger initiatives requiring shared management

### 2. **Role Types**
- **DIRECTOR**: Full management and decision-making authority
- **CO_DIRECTOR**: Shared management responsibility with other directors
- **LEAD**: Team lead with specific responsibilities (for teams)

### 3. **Resource Types**
- **Projects**: Director oversees project execution, timelines, and team assignments
- **Events**: Director manages event logistics, registrations, and attendance
- **Teams**: Director supervises team members, assignments, and team activities

## Database Schema

### Models

#### `projectDirector`
```
id: String @id
projectId: String
userId: String
role: String (default: "DIRECTOR")
createdAt: DateTime
updatedAt: DateTime
```

#### `eventDirector`
```
id: String @id
eventId: String
userId: String
role: String (default: "DIRECTOR")
createdAt: DateTime
updatedAt: DateTime
```

#### `teamDirector`
```
id: String @id
teamId: String
userId: String
role: String (default: "DIRECTOR")
createdAt: DateTime
updatedAt: DateTime
```

## API Endpoints

### Director Assignment APIs

#### 1. **Assign Director to Project**
```
POST /api/projects/[projectId]/directors
```
**Headers**: Authorization required (HR role)
**Body**:
```json
{
  "userId": "user-id",
  "role": "DIRECTOR" // or "CO_DIRECTOR"
}
```

#### 2. **Assign Director to Event**
```
POST /api/events/[eventId]/directors
```
**Headers**: Authorization required (HR role)
**Body**:
```json
{
  "userId": "user-id",
  "role": "DIRECTOR"
}
```

#### 3. **Assign Director to Team**
```
POST /api/teams/[teamId]/directors
```
**Headers**: Authorization required (HR role)
**Body**:
```json
{
  "userId": "user-id",
  "role": "DIRECTOR" // or "CO_DIRECTOR", "LEAD"
}
```

#### 4. **Get Directors of a Resource**
```
GET /api/projects/[projectId]/directors
GET /api/events/[eventId]/directors
GET /api/teams/[teamId]/directors
```
Returns array of directors with user info and role

#### 5. **Remove Director**
```
DELETE /api/projects/[projectId]/directors
DELETE /api/events/[eventId]/directors
DELETE /api/teams/[teamId]/directors
```
**Headers**: Authorization required (HR role)

### Bulk Operations

#### 6. **Get All Directors (HR Dashboard)**
```
GET /api/directors
```
**Query Parameters**:
- `type`: "project" | "event" | "team" (optional, filter by type)
- `userId`: string (optional, filter by user)

**Response**:
```json
{
  "directors": [
    {
      "id": "...",
      "type": "project",
      "resourceId": "...",
      "resourceName": "...",
      "director": {
        "id": "...",
        "name": "...",
        "email": "..."
      },
      "role": "DIRECTOR",
      "assignedAt": "2024-01-28T..."
    }
  ],
  "total": 15
}
```

#### 7. **Bulk Assign Directors**
```
POST /api/directors
```
**Headers**: Authorization required (HR role)
**Body**:
```json
{
  "type": "project", // or "event", "team"
  "resourceId": "resource-id",
  "userIds": ["user-id-1", "user-id-2"],
  "role": "DIRECTOR" // optional
}
```

### Director Dashboard

#### 8. **Get My Directorships**
```
GET /api/directors/me
```
**Response**:
```json
{
  "projects": [
    {
      "id": "...",
      "projectId": "...",
      "project": {
        "id": "...",
        "title": "...",
        "description": "...",
        "status": "..."
      },
      "role": "DIRECTOR"
    }
  ],
  "events": [...],
  "teams": [...],
  "summary": {
    "projectCount": 3,
    "eventCount": 2,
    "teamCount": 1,
    "totalDirectorships": 6
  }
}
```

## Permission Utility Functions

Located in `lib/director-permissions.ts`:

```typescript
// Check if user is director of resource
async function isProjectDirector(projectId: string, userId: string): boolean
async function isEventDirector(eventId: string, userId: string): boolean
async function isTeamDirector(teamId: string, userId: string): boolean

// Get all directors of resource
async function getProjectDirectors(projectId: string)
async function getEventDirectors(eventId: string)
async function getTeamDirectors(teamId: string)

// Get user's directorships
async function getUserProjectDirectorships(userId: string)
async function getUserEventDirectorships(userId: string)
async function getUserTeamDirectorships(userId: string)
```

## UI Components

### 1. **DirectorManagement Component**
```typescript
<DirectorManagement
  type="project" // or "event", "team"
  resourceId="project-123"
  resourceName="Q1 Launch Campaign"
/>
```
Allows HR to manage directors for a specific resource.

### 2. **DirectorDashboard Component**
```typescript
<DirectorDashboard />
```
Shows all directorships for the logged-in user with summary stats.

## Implementation Example

### HR Assigning a Director to a Project

```typescript
// In HR Dashboard
import { DirectorManagement } from "@/components/director-management"

export default function ProjectDetailsPage({ params }) {
  return (
    <div>
      <h1>Project: {project.title}</h1>
      <DirectorManagement
        type="project"
        resourceId={params.projectId}
        resourceName={project.title}
      />
    </div>
  )
}
```

### Director Viewing Their Dashboard

```typescript
// In Director Dashboard
import { DirectorDashboard } from "@/components/director-dashboard"

export default function DirectorPage() {
  return (
    <div>
      <h1>Your Directorships</h1>
      <DirectorDashboard />
    </div>
  )
}
```

## Authorization Flow

1. **HR Role Only**:
   - Can assign/remove directors via POST/DELETE endpoints
   - Can view all directors in startup via GET /api/directors

2. **Directors/Managers**:
   - Can access their assigned resources
   - Can view team members and details
   - Can manage groups and subgroups (implementation-specific)
   - See their directorships via GET /api/directors/me

3. **Regular Users**:
   - Cannot assign directors
   - Can only view resources they're part of (as participant/member)

## Usage Flow

### For HR:
1. Navigate to project/event/team details
2. Go to "Director Management" section
3. Select employee from dropdown
4. Choose role (DIRECTOR, CO_DIRECTOR, etc.)
5. Click "Assign Director"
6. Remove directors as needed

### For Directors:
1. Log in to dashboard
2. Go to "Director Dashboard" or "My Assignments"
3. View all assigned projects, events, and teams
4. Click on any resource to manage:
   - Team members and groups
   - Event participants
   - Project tasks and timelines
5. Full access to manage subgroups and team leads under them

## Database Migration

To apply these changes:

```bash
npx prisma migrate dev --name add-director-system
# or
npm run prisma:migrate
```

This will:
1. Create three new tables: `projectDirector`, `eventDirector`, `teamDirector`
2. Add foreign key relationships
3. Create unique constraints (projectId_userId, eventId_userId, teamId_userId)

## Security Considerations

- Directors are verified via HR role + NextAuth session
- Unique constraints prevent duplicate director assignments
- Soft relationships with CASCADE delete for data integrity
- API endpoints check authorization before allowing changes
- Directors get access through their directorships, not via role field

## Future Enhancements

1. **Hierarchical Directors**: Support for director-of-directors
2. **Permission Levels**: Granular permissions (view-only, edit, admin)
3. **Audit Logging**: Track director assignments and changes
4. **Notifications**: Alert users when they're assigned as director
5. **Director Groups**: Manage multiple directors as a group
6. **Custom Roles**: Create custom director roles with specific permissions
