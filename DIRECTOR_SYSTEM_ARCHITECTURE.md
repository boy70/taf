# Director System - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        TAFSULA Dashboard                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐     ┌──────────────────┐              │
│  │   HR Dashboard   │     │ Director Dashboard               │
│  ├──────────────────┤     ├──────────────────┤              │
│  │ • Assign Dirs    │     │ • View My Tasks  │              │
│  │ • Manage Assigns │     │ • Manage Teams   │              │
│  │ • Bulk Ops       │     │ • Oversee Events │              │
│  └────────┬─────────┘     └────────┬─────────┘              │
│           │                        │                        │
│           └────────────┬───────────┘                        │
│                        │                                    │
└────────────────────────┼────────────────────────────────────┘
                         │
            ┌────────────▼────────────┐
            │     API Endpoints       │
            ├────────────────────────┤
            │ /api/directors         │
            │ /api/directors/me      │
            │ /api/projects/[]/dir   │
            │ /api/events/[]/dir     │
            │ /api/teams/[]/dir      │
            └────────────┬────────────┘
                         │
       ┌─────────────────┼──────────────────┐
       │                 │                  │
    ┌──▼──┐          ┌──▼──┐           ┌──▼──┐
    │Prisma Client   │Auth │        │Session│
    └──┬──┘          └──┬──┘           └──┬──┘
       │                │                  │
       └────────────────┼──────────────────┘
                        │
        ┌───────────────▼────────────────┐
        │      Database (MySQL)          │
        ├────────────────────────────────┤
        │ projectDirector                │
        │ eventDirector                  │
        │ teamDirector                   │
        │ (+ relationships to project,   │
        │  event, team, user models)     │
        └────────────────────────────────┘
```

## Data Flow - Assigning Director

```
┌─────────────────────────────────────────────────────────────┐
│ HR Admin Opens Project Details Page                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ DirectorManagement Component Loads                           │
│ • Fetches GET /api/projects/[id]/directors                  │
│ • Fetches GET /api/employees                                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ HR Selects Employee & Role                                  │
│ ✓ Select: John Doe                                          │
│ ✓ Role: DIRECTOR                                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Click "Assign Director"                                      │
│ POST /api/projects/[id]/directors                           │
│ { userId: "john-id", role: "DIRECTOR" }                     │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ API Endpoint Processes                                      │
│ 1. Verify HR role ✓                                         │
│ 2. Check project exists ✓                                   │
│ 3. Check duplicate not exists ✓                             │
│ 4. Create projectDirector record ✓                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Database: INSERT projectDirector                            │
│ (projectId, userId, role, createdAt)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Return Success Response                                      │
│ { director: {...}, status: 201 }                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Component Refreshes                                          │
│ • Updates director list                                      │
│ • Shows success toast                                        │
│ • Clears form                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow - Director Views Assignments

```
┌──────────────────────────────────────────────────────────┐
│ Director Logs In & Opens "My Directorships"              │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ DirectorDashboard Component Loads                        │
│ GET /api/directors/me                                    │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ API Gets User Session                                    │
│ userId = "john-id"                                       │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ Query Database                                           │
│ • projectDirector.findMany({userId})                     │
│ • eventDirector.findMany({userId})                       │
│ • teamDirector.findMany({userId})                        │
└──────────────────────────┬───────────────────────────────┘
                           │
         ┌─────────────────┼──────────────────┐
         │                 │                  │
         ▼                 ▼                  ▼
    ┌────────┐        ┌────────┐       ┌────────┐
    │Projects│        │ Events │       │ Teams  │
    │   [3]  │        │   [2]  │       │   [1]  │
    └────────┘        └────────┘       └────────┘
         │                 │                  │
         └─────────────────┼──────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ Response with Summary                                    │
│ {                                                        │
│   projects: [{...}, {...}, {...}],                       │
│   events: [{...}, {...}],                                │
│   teams: [{...}],                                        │
│   summary: {                                             │
│     projectCount: 3,                                     │
│     eventCount: 2,                                       │
│     teamCount: 1,                                        │
│     totalDirectorships: 6                                │
│   }                                                      │
│ }                                                        │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ Dashboard Renders                                        │
│ • Summary cards (3 Projects, 2 Events, 1 Team)          │
│ • Project list with details                             │
│ • Event list with dates                                 │
│ • Team list with member counts                          │
│ • Links to manage each resource                         │
└──────────────────────────────────────────────────────────┘
```

## Permission Check Flow

```
┌────────────────────────────────────┐
│ Need to Verify Access?             │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ Import Utility Function            │
│ import {                           │
│   isProjectDirector                │
│ } from "@/lib/director-permissions"│
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ Call Permission Check              │
│ const canManage =                  │
│   await isProjectDirector(         │
│     projectId,                     │
│     userId                         │
│   )                                │
└────────────┬───────────────────────┘
             │
             ▼
     ┌───────┴────────┐
     │                │
     ▼                ▼
 ┌────────┐      ┌────────┐
 │ true   │      │ false  │
 │ Grant  │      │ Deny   │
 │ Access │      │ Access │
 └────────┘      └────────┘
```

## Database Relationships

```
┌──────────────┐         ┌──────────────────┐
│   project    │────────◆│ projectDirector  │
│              │  1:N    │                  │
├──────────────┤         ├──────────────────┤
│ id           │         │ id               │
│ title        │         │ projectId (FK)   │
│ ...          │         │ userId (FK)      │
└──────────────┘         │ role             │
                         │ createdAt        │
                         └────────┬─────────┘
                                  │
                                  ◆ N:1
                         ┌────────────────┐
                         │      user      │
                         ├────────────────┤
                         │ id             │
                         │ name           │
                         │ email          │
                         │ ...            │
                         └────────────────┘

┌──────────────┐         ┌──────────────────┐
│    event     │────────◆│  eventDirector   │
│              │  1:N    │                  │
└──────────────┘         └────────┬─────────┘
                                  │
                                  ◆ N:1
                         ┌────────────────┐
                         │      user      │
                         └────────────────┘

┌──────────────┐         ┌──────────────────┐
│     team     │────────◆│  teamDirector    │
│              │  1:N    │                  │
└──────────────┘         └────────┬─────────┘
                                  │
                                  ◆ N:1
                         ┌────────────────┐
                         │      user      │
                         └────────────────┘
```

## Resource Access Matrix

```
┌─────────────────┬──────────┬──────────┬───────────┐
│   Role/Action   │ Assign   │ View     │ Remove    │
├─────────────────┼──────────┼──────────┼───────────┤
│ HR Admin        │ ✓ Yes    │ ✓ Yes    │ ✓ Yes     │
│ Project Owner   │ ✗ No     │ ✓ Yes    │ ✗ No      │
│ Project Dir.    │ ✗ No     │ ✓ Yes    │ ✗ No      │
│ Team Member     │ ✗ No     │ ✓ Yes*   │ ✗ No      │
│ Regular User    │ ✗ No     │ ✗ No     │ ✗ No      │
└─────────────────┴──────────┴──────────┴───────────┘
* Only if assigned to resource
```

## Component Hierarchy

```
┌─────────────────────────────────────────────┐
│        ProjectDetailsPage                   │
│     (HR Dashboard)                          │
└────────────────┬────────────────────────────┘
                 │
        ┌────────▼────────┐
        │ DirectorManagement
        │   Component      │
        ├──────────────────┤
        │ • Employee Select│
        │ • Role Select    │
        │ • Assign Button  │
        │ • Director List  │
        └──────────────────┘
        
        Fetches:
        - GET /api/employees
        - GET /api/projects/[id]/directors
        - POST /api/projects/[id]/directors
        - DELETE /api/projects/[id]/directors

┌─────────────────────────────────────────────┐
│      DirectorDashboardPage                  │
├─────────────────────────────────────────────┤
└────────────────┬────────────────────────────┘
                 │
        ┌────────▼─────────┐
        │ DirectorDashboard │
        │   Component       │
        ├───────────────────┤
        │ • Summary Cards   │
        │ • Project List    │
        │ • Event List      │
        │ • Team List       │
        │ • Quick Links     │
        └───────────────────┘
        
        Fetches:
        - GET /api/directors/me
```

## Sequence Diagram - Full Assignment & Access

```
HR Admin          DirectorMgmt      API Server        Database
    │                 │                 │                │
    │─ Opens page ───>│                 │                │
    │                 │                 │                │
    │                 │─ GET /emp ────>│                │
    │                 │<── List ────────│                │
    │                 │                 │                │
    │ Selects John    │                 │                │
    │─ Selects role →│                 │                │
    │                 │                 │                │
    │ Clicks assign   │                 │                │
    │────────────────>│                 │                │
    │                 │─ POST /dir ────>│                │
    │                 │                 │- Verify HR    │
    │                 │                 │- Check exist  │
    │                 │                 │─ INSERT ─────>│
    │                 │                 │<── OK ────────│
    │                 │<── Created ─────│                │
    │<── Success ─────│                 │                │
    │                 │                 │                │
    │─────────────────────────────────────────────────────
    │             (John logs in)
    │
Director (John)   DirectorDash      API Server        Database
    │                 │                 │                │
    │─ Opens Dashboard ──>│                 │                │
    │                 │                 │                │
    │                 │─ GET /me ─────>│                │
    │                 │                 │- Get userId   │
    │                 │                 │- Query 3 tables
    │                 │                 │<─ Find ───────│
    │                 │                 │<── Results ───│
    │                 │<── Data ────────│                │
    │<── Displays ────│                 │                │
    │ • 3 Projects    │                 │                │
    │ • 2 Events      │                 │                │
    │ • 1 Team        │                 │                │
```

## State Flow

```
┌──────────────┐
│ Initial      │
│ State        │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ No Directors Assigned    │
│ (Empty state)            │
└──────┬───────────────────┘
       │
       │ HR assigns director
       │
       ▼
┌──────────────────────────┐
│ Single Director          │
│ (Can manage resource)    │
└──────┬───────────────────┘
       │
       │ HR adds co-director
       │
       ▼
┌──────────────────────────┐
│ Multiple Directors       │
│ (Shared management)      │
└──────┬───────────────────┘
       │
       │ HR removes director
       │
       ▼
┌──────────────────────────┐
│ No Directors / Reduced   │
│ (Back to single or empty)│
└──────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────┐
│ API Request             │
└──────────────┬──────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
   Valid?          Invalid?
   │                 │
   ▼                 ▼
 ┌──┐        ┌─────────────────┐
 │✓ │        │ 400 Bad Request │
 └──┘        └─────────────────┘
   │
   ├─ HR? 
   │   ├─ Yes ──> Continue
   │   └─ No ──> 401 Unauthorized
   │
   ├─ Resource exists?
   │   ├─ Yes ──> Continue
   │   └─ No ──> 404 Not Found
   │
   ├─ Duplicate?
   │   ├─ No ──> Create/Delete
   │   └─ Yes ──> 400 Already exists
   │
   └─> Success (201/200)
```

This comprehensive architecture shows how the director system integrates with the TAFSULA dashboard and enables proper access control and management.
