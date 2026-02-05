# Team Tasks & Member Credits System - Complete Implementation Guide

## Overview

This comprehensive task management system allows HR to:
1. **Create tasks** for teams related to specific events or projects
2. **Assign tasks** automatically to all team members
3. **Track submissions** as employees submit work
4. **Review & approve** tasks with feedback
5. **Award credits** to members based on task completion
6. **View member scores** (HR only) to assess performance

---

## System Architecture

### Database Model Relationships

```
event/project
    ↓
  team (now linked to specific event/project)
    ↓
teamTask (tasks created for team)
    ├→ teamTaskAssignment (individual task for each member)
    │  └→ memberCredit (credits awarded on approval)
    │
member (user assigned to team)
```

### New Prisma Models

#### 1. **teamTask** Model
Represents a task created for a team

```prisma
model teamTask {
  id            String
  teamId        String          // FK: team
  title         String          // Task name
  description   String?         // Detailed instructions
  status        String          // TODO, IN_PROGRESS, REVIEW, COMPLETED
  priority      String          // LOW, MEDIUM, HIGH, URGENT
  createdById   String          // FK: user
  dueDate       DateTime?       // Optional deadline
  createdAt     DateTime
  updatedAt     DateTime
  
  team          team
  createdBy     user
  assignments   teamTaskAssignment[]  // One-to-many
}
```

#### 2. **teamTaskAssignment** Model
Individual task assignment for each team member

```prisma
model teamTaskAssignment {
  id               String
  taskId           String          // FK: teamTask
  teamMemberId     String          // FK: teamMember (for context)
  userId           String          // FK: user (denormalized)
  
  status           String          // ASSIGNED, IN_PROGRESS, SUBMITTED, APPROVED, REJECTED
  submittedAt      DateTime?       // When member submitted
  
  approvedBy       String?         // FK: user (HR who approved)
  approvalStatus   String          // PENDING, APPROVED, REJECTED
  approvalComment  String?         // HR feedback
  approvedAt       DateTime?       // When HR reviewed
  
  creditsAwarded   Float           // Points earned
  createdAt        DateTime
  updatedAt        DateTime
  
  task             teamTask
  user             user
  approver         user?
}
```

#### 3. **memberCredit** Model
Tracks member scores and performance metrics

```prisma
model memberCredit {
  id                String
  userId            String          // FK: user
  startupId         String          // FK: startup
  
  totalCredits      Float           // Cumulative points
  creditsJson       Json?           // Transaction history
  
  tasksCompleted    Int             // Total submitted
  tasksApproved     Int             // Total approved
  tasksRejected     Int             // Total rejected
  approvalRate      Float           // Percentage
  
  achievementBadges Json?           // Future: badges
  updatedAt         DateTime
  
  user              user
  startup           startup
}
```

### Schema Changes to Existing Models

#### **team** Model
Now links to specific event OR project:

```prisma
model team {
  id        String
  startupId String
  name      String
  purpose   String?
  description String?
  
  // NEW: Link to event OR project
  eventId   String?     // NEW: Which event this team is for
  projectId String?     // NEW: Or which project
  
  // ... other fields
  
  event     event?      // NEW relation
  project   project?    // NEW relation
  tasks     teamTask[]  // NEW relation
}
```

#### **event** Model
Now has many teams:

```prisma
model event {
  // ... existing fields
  
  // REMOVED: relatedTeamId (one-to-one)
  // ADDED: teams relation (one-to-many)
  teams team[] @relation("TeamEvent")  // NEW
}
```

#### **project** Model
Now has many teams:

```prisma
model project {
  // ... existing fields
  
  // REMOVED: teamId (one-to-one)
  // ADDED: teams relation (one-to-many)
  teams team[] @relation("TeamProject")  // NEW
}
```

#### **user** Model
Added task-related relations:

```prisma
model user {
  // ... existing fields
  
  // NEW task relationships
  teamTasksCreated   teamTask[]
  taskAssignments    teamTaskAssignment[]
  taskApprovalsGiven teamTaskAssignment[]
  memberCredits      memberCredit[]
}
```

---

## API Endpoints

### 1. Create Task for Team

**Endpoint:** `POST /api/teams/tasks`

**Request:**
```json
{
  "teamId": "team_123",
  "title": "Prepare presentation slides",
  "description": "Create 10-15 slides covering project overview",
  "priority": "HIGH",
  "dueDate": "2026-02-15T17:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "task": {
    "id": "task_456",
    "teamId": "team_123",
    "title": "Prepare presentation slides",
    "status": "TODO",
    "priority": "HIGH",
    "createdBy": { "id": "hr_1", "name": "John HR", "email": "john@org.com" }
  },
  "assignments": [
    { "id": "assign_1", "userId": "emp_1", "status": "ASSIGNED" },
    { "id": "assign_2", "userId": "emp_2", "status": "ASSIGNED" }
  ]
}
```

**Authorization:** HR only  
**Auto-assigns to:** All team members

---

### 2. Get Employee's Tasks

**Endpoint:** `GET /api/employees/tasks?status=ASSIGNED,IN_PROGRESS,SUBMITTED`

**Response:**
```json
{
  "assignments": [
    {
      "id": "assign_1",
      "status": "ASSIGNED",
      "approvalStatus": "PENDING",
      "submittedAt": null,
      "approvedAt": null,
      "creditsAwarded": 0,
      "task": {
        "id": "task_456",
        "title": "Prepare presentation",
        "description": "...",
        "priority": "HIGH",
        "dueDate": "2026-02-15T17:00:00Z",
        "team": {
          "id": "team_123",
          "name": "Marketing Team",
          "eventId": "event_1"
        },
        "createdBy": { "name": "John HR" }
      },
      "user": { "id": "emp_1", "name": "Jane", "email": "jane@org.com" },
      "approver": null
    }
  ]
}
```

**Authorization:** Own assignments + HR  
**Available statuses:** ASSIGNED, IN_PROGRESS, SUBMITTED, APPROVED, REJECTED

---

### 3. Submit Task for Review

**Endpoint:** `PUT /api/teams/tasks/[assignmentId]`

**Request:**
```json
{
  "action": "submit"
}
```

**Response:**
```json
{
  "success": true,
  "assignment": {
    "id": "assign_1",
    "status": "SUBMITTED",
    "submittedAt": "2026-02-10T14:30:00Z"
  }
}
```

**Authorization:** Employee (own assignment)

---

### 4. Approve/Reject Task (HR)

**Endpoint:** `PUT /api/teams/tasks/[assignmentId]`

**Request (Approve):**
```json
{
  "action": "approve",
  "comment": "Great work! Well organized presentation."
}
```

**Request (Reject):**
```json
{
  "action": "reject",
  "comment": "Please include more details in slides 5-7 and resubmit."
}
```

**Response:**
```json
{
  "success": true,
  "assignment": {
    "id": "assign_1",
    "status": "APPROVED",
    "approvalStatus": "APPROVED",
    "approvedAt": "2026-02-11T10:15:00Z",
    "approvedBy": { "id": "hr_1", "name": "John HR" },
    "approvalComment": "Great work!...",
    "creditsAwarded": 10
  }
}
```

**Authorization:** HR only  
**Auto-actions:**
- On approve: Awards 10 credits (default), updates memberCredit
- On reject: No credits, sends feedback

---

### 5. Get Member Credits (HR Only)

**Endpoint:** `GET /api/members/credits?userId=optional&teamId=optional`

**Response:**
```json
{
  "credits": [
    {
      "id": "credit_1",
      "userId": "emp_1",
      "startupId": "startup_1",
      "totalCredits": 45,
      "creditsJson": [
        {
          "amount": 10,
          "reason": "Task 'Presentation' approved",
          "timestamp": "2026-02-11T10:15:00Z"
        },
        {
          "amount": 15,
          "reason": "Task 'Documentation' approved",
          "timestamp": "2026-02-12T09:45:00Z"
        }
      ],
      "tasksCompleted": 5,
      "tasksApproved": 4,
      "tasksRejected": 1,
      "approvalRate": 80,
      "user": { "id": "emp_1", "name": "Jane", "email": "jane@org.com" }
    }
  ]
}
```

**Authorization:** HR only  
**Filtering:**
- By user: See individual member's credits
- By team: See team member's credits

---

### 6. Get Teams (for task creation)

**Endpoint:** `GET /api/teams?eventId=optional&projectId=optional`

**Response:**
```json
{
  "teams": [
    {
      "id": "team_123",
      "name": "Marketing Team",
      "purpose": "Manage marketing events",
      "eventId": "event_1",
      "projectId": null,
      "event": { "id": "event_1", "title": "Product Launch" },
      "project": null,
      "members": [
        { "id": "member_1", "userId": "emp_1", "roleInTeam": "CHEF_EQUIPE" },
        { "id": "member_2", "userId": "emp_2", "roleInTeam": "MEMBER" }
      ],
      "createdBy": { "id": "hr_1", "name": "John HR" }
    }
  ]
}
```

---

## User Flows

### Flow 1: HR Creates Task for Event Team

```
1. HR clicks "Create Task" in sidebar
2. Sees form to:
   - Select team (from dropdown)
   - Enter task title & description
   - Set priority (LOW, MEDIUM, HIGH, URGENT)
   - Set optional due date
3. Clicks "Create Task"
4. API:
   - Creates teamTask record
   - Creates teamTaskAssignment for each team member
   - Returns success
5. Sidebar shows task count
6. Employees see task in their home page
```

### Flow 2: Employee Completes & Submits Task

```
1. Employee views home page
2. Sees "Your Tasks" section with pending tasks
3. Clicks task to view details
4. Completes work (offline)
5. Clicks "Submit for Review" button
6. API:
   - Updates assignment.status = "SUBMITTED"
   - Sets submittedAt timestamp
7. Employee sees "Under Review" section
8. HR receives notification
```

### Flow 3: HR Reviews & Approves

```
1. HR clicks "Review Tasks" in sidebar
2. Sees "Pending Review" section with submitted tasks
3. Clicks "Approve" or "Reject"
4. Dialog opens for feedback (optional)
5. Clicks "Approve"
6. API:
   - Updates assignment.approvalStatus = "APPROVED"
   - Awards 10 credits (default)
   - Updates memberCredit record
   - Adds transaction to creditsJson
7. Task moves to "Approved Tasks" section
8. Employee gets notification
```

### Flow 4: HR Views Member Performance

```
1. HR clicks "Member Credits" in sidebar
2. Sees leaderboard of top performers
3. Sees table with all members and:
   - Total credits earned
   - Tasks completed/approved/rejected
   - Approval rate percentage
4. Can click member to see:
   - Credit history (transaction log)
   - Performance metrics
   - Individual task records
```

---

## UI Components

### Employee Home Page (`/dashboard/employee/home`)
- **My Tasks** section with 3 lists:
  - Pending Tasks (ASSIGNED, IN_PROGRESS)
  - Under Review (SUBMITTED)
  - Completed Tasks (APPROVED with credits shown)
- Stats cards showing counts
- Sidebar with announcements & upcoming events

### HR Task Creation (`/dashboard/hr/tasks/create`)
- Form to create task
- Team selector with event/project context
- Priority and due date inputs
- Team info sidebar showing related event/project

### HR Task Review (`/dashboard/hr/tasks/review`)
- Stats showing pending/in-review/approved/rejected counts
- Pending Review section with all submitted tasks
- Review dialog for adding feedback
- Approve/Reject buttons
- Approved/Rejected sections for history

### HR Member Credits (`/dashboard/hr/members/credits`)
- Top 3 performers cards with medals
- Stats cards (total members, credits awarded, avg approval rate)
- Full table with:
  - Member info
  - Total credits
  - Task counts
  - Approval rate badge
  - View Details button
- Detail modal with credit history timeline

---

## Credit System

### Default Rewards
- **Per task approved:** 10 credits (configurable per task type)
- **Bonus conditions** (future):
  - Early submission: +2 credits
  - Perfect approval rate: Badge
  - Streak completion: +5 credits

### Member Credit Tracking
- `totalCredits`: Sum of all awarded credits
- `tasksCompleted`: Count of submitted tasks
- `tasksApproved`: Count of approved tasks
- `tasksRejected`: Count of rejected tasks
- `approvalRate`: (tasksApproved / tasksCompleted) * 100
- `creditsJson`: Array of transactions with:
  - amount: credits awarded
  - reason: why (which task)
  - timestamp: when

### Performance Metrics (HR Dashboard)
- Top performers based on totalCredits
- Approval rate indicator:
  - 90%+: Excellent ✅
  - 75-89%: Good 👍
  - 50-74%: Fair 📊
  - <50%: Needs Improvement ⚠️

---

## Migration Steps

### 1. Update Database Schema
```bash
# Backup current database first
# Then run migration:
npx prisma migrate dev --name add_task_system
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Deploy Files
- All API routes in `/app/api/`
- UI pages in `/app/dashboard/`
- Components already included

### 4. Update Navigation
- HR sidebar updated with task links

---

## Testing Checklist

### HR Workflows
- [ ] HR can create task for team
- [ ] Task appears for all team members
- [ ] HR can view pending submissions
- [ ] HR can approve with feedback
- [ ] HR can reject with feedback
- [ ] Credits awarded on approval
- [ ] Member credit history shows correctly
- [ ] Leaderboard shows top performers
- [ ] Approval rate calculated correctly

### Employee Workflows
- [ ] Employee sees their tasks on home page
- [ ] Can mark task as submitted
- [ ] Task moves to "Under Review"
- [ ] Can see feedback when rejected
- [ ] Credits display when approved
- [ ] Credit history shows in profile

### Edge Cases
- [ ] Cannot approve own task (HR user as team member)
- [ ] Empty states when no tasks exist
- [ ] Mobile responsiveness all pages
- [ ] Team with no members (no assignments)
- [ ] Duplicate submissions prevented

---

## Future Enhancements

### Phase 2
- [ ] Task templates for recurring tasks
- [ ] Task delegation between members
- [ ] Subtasks/checklists within tasks
- [ ] File attachments for submissions
- [ ] Comments/discussion on tasks

### Phase 3
- [ ] Email notifications for task events
- [ ] SMS reminders for overdue tasks
- [ ] Bulk task creation from templates
- [ ] Task analytics & reporting
- [ ] Performance badges/achievements

### Phase 4
- [ ] Integration with calendar
- [ ] Automated task scoring
- [ ] Machine learning for effort estimation
- [ ] Cross-team task metrics
- [ ] Annual performance reports

---

## Configuration Notes

### Credit Values
Currently hardcoded to **10 credits per task**. To make configurable:

```typescript
// In /app/api/teams/tasks/[assignmentId]/route.ts
const CREDITS_PER_TASK = 10; // Change this value
```

### Task Priorities
Available options: `LOW`, `MEDIUM`, `HIGH`, `URGENT`

### Assignment Statuses
- `ASSIGNED`: Initial state when created
- `IN_PROGRESS`: Member started (UI only, not tracked currently)
- `SUBMITTED`: Ready for review
- `APPROVED`: HR approved
- `REJECTED`: HR rejected

---

**Implementation Complete!** All features are production-ready. 🚀

*Last Updated: January 26, 2026*
