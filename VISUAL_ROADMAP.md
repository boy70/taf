# 🗺️ VISUAL ROADMAP - Professional SaaS HR Dashboard

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER / CLIENT SIDE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐    ┌──────────────────────┐            │
│  │   Left Sidebar       │    │   Main Content       │            │
│  │  (hr-sidebar.tsx)    │    │                      │            │
│  │                      │    │  Dashboard / Feed /  │            │
│  │  • Dashboard         │    │  Teams / Posts       │            │
│  │  • Home Feed         │    │                      │            │
│  │  • Teams             │    │  ┌─────────────────┐ │            │
│  │  • Events            │    │  │ Drag-Drop Area  │ │            │
│  │  • People            │    │  │ (Employees)     │ │            │
│  │  • Development       │    │  └─────────────────┘ │            │
│  │  • Settings          │    │                      │            │
│  └──────────────────────┘    └──────────────────────┘            │
│                                                                   │
│  Mobile:                                                          │
│  ┌─────────┐  Toggle                                            │
│  │ ≡ Menu  │─────→ Full-screen Sidebar                         │
│  └─────────┘                                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             ↓ (API Calls)
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS BACKEND / API                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  API Routes:                                                      │
│  ┌──────────────────────────┐  ┌──────────────────────────┐     │
│  │  POST /api/posts         │  │  POST /api/teams/groups  │     │
│  │  Create organization     │  │  Save team configuration │     │
│  │  posts and announcements │  │  with chef assignment    │     │
│  └──────────────────────────┘  └──────────────────────────┘     │
│                                                                   │
│  Page Routes:                                                     │
│  /dashboard/hr (Dashboard)                                       │
│  /dashboard/hr/home (Feed)                                       │
│  /dashboard/hr/posts/new (Create Post)                          │
│  /dashboard/hr/teams (Teams List)                               │
│  /dashboard/hr/teams/groups (Drag-Drop)                         │
│  /dashboard/hr/settings (Settings)                              │
│                                                                   │
│  Authentication:                                                  │
│  NextAuth.js → Session Management → Role Verification           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             ↓ (Queries/Mutations)
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE (MySQL + Prisma)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Models:                                                          │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐        │
│  │   users     │    │    teams     │    │ teamMembers │        │
│  │             │    │              │    │             │        │
│  │ • id        │←──→│ • id         │←──→│ • id        │        │
│  │ • email     │    │ • startupId  │    │ • teamId    │        │
│  │ • name      │    │ • name       │    │ • userId    │        │
│  │ • role      │    │ • leadIds    │    │ • roleInTeam│        │
│  │ • startupId │    │ • members    │    └─────────────┘        │
│  └─────────────┘    └──────────────┘                            │
│        ↑                                                          │
│        └─→  ┌──────────────────┐                                │
│             │ organizationPost  │                                │
│             │                  │                                │
│             │ • id             │                                │
│             │ • title          │                                │
│             │ • content        │                                │
│             │ • imageUrl       │                                │
│             │ • authorId       │─→ (FK) user                   │
│             │ • startupId      │─→ (FK) startup                │
│             │ • createdAt      │                                │
│             └──────────────────┘                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Flow Diagrams

### Flow 1: Creating and Publishing a Post

```
HR User
   │
   ├─→ Click "Home Feed" in sidebar
   │
   ├─→ Page loads (server-side)
   │   └─→ Fetch upcoming events
   │   └─→ Fetch all posts
   │   └─→ Display on page
   │
   ├─→ Click "Create Post" button
   │
   ├─→ Navigate to /dashboard/hr/posts/new
   │
   ├─→ Form displays (client-side)
   │   ├─ Title input
   │   ├─ Content textarea
   │   └─ Image URL input
   │
   ├─→ User fills form
   │
   ├─→ User clicks "Publish Post"
   │
   ├─→ Client-side validation
   │   └─→ Check title & content filled
   │
   ├─→ Send POST /api/posts
   │
   ├─→ Server validates
   │   ├─ Check HR role
   │   ├─ Check startup assigned
   │   └─ Validate inputs
   │
   ├─→ Create in database
   │   └─→ INSERT into organizationPost
   │
   ├─→ Return success
   │
   ├─→ Client shows toast: "Post created!"
   │
   └─→ Redirect to /dashboard/hr/home
       └─→ All team members see new post
```

### Flow 2: Organizing Teams with Drag & Drop

```
HR User
   │
   ├─→ Click "Team Groups" in sidebar
   │
   ├─→ Page loads (server-side)
   │   └─→ Fetch all employees
   │
   ├─→ See:
   │   ├─ Unassigned Employees (top)
   │   └─ Group Cards (expandable)
   │
   ├─→ Drag "John Smith" to "Marketing"
   │   │
   │   ├─→ Mouse down (onDragStart)
   │   │   └─→ Save: draggedEmployee = John
   │   │
   │   ├─→ Drag over group (onDragOver)
   │   │   └─→ prevent default
   │   │
   │   ├─→ Drop on group (onDrop)
   │   │   └─→ Update state:
   │   │       ├─ Add John to Marketing
   │   │       ├─ Remove from Unassigned
   │   │       └─ Visual update
   │   │
   │   └─→ UI updates instantly
   │
   ├─→ Click crown icon on John
   │   └─→ John becomes Chef d'équipe
   │
   ├─→ Repeat for other employees
   │
   ├─→ Create new group
   │   ├─ Click "New Group"
   │   ├─ Enter group name
   │   └─ Click "Create"
   │
   ├─→ Click "Save Configuration"
   │
   ├─→ Client validates
   │   └─→ Check: each group with members has chef
   │
   ├─→ Send POST /api/teams/groups
   │   └─→ Include: all groups, members, chefs
   │
   ├─→ Server processes
   │   ├─ Validate chef requirement
   │   ├─ Create/update teams
   │   ├─ Add team members
   │   └─ Set roles
   │
   ├─→ Database updated
   │
   ├─→ Return success
   │
   └─→ Toast: "Configuration saved!"
       └─→ Changes persist on refresh
```

### Flow 3: Viewing Team and Feed

```
Employee User
   │
   ├─→ Login to dashboard
   │
   ├─→ See Dashboard
   │   ├─ Key metrics
   │   ├─ Team distribution
   │   └─ Quick actions
   │
   ├─→ Click "Home Feed"
   │
   ├─→ Page renders (server-side)
   │   ├─ Fetch upcoming events
   │   └─ Fetch organization posts
   │
   ├─→ See:
   │   ├─ "Upcoming Events" section
   │   │  └─ Shows 5 upcoming events
   │   │     ├─ Title, date, format
   │   │     └─ Registration count
   │   │
   │   └─ "Recent Posts" section
   │      └─ Shows all published posts
   │         ├─ Author avatar
   │         ├─ Title & content
   │         ├─ Image (if present)
   │         ├─ "Posted X time ago"
   │         └─ Like, comment, share buttons
   │
   ├─→ Can click event to view details
   │
   ├─→ Can register for event
   │
   └─→ Can like or comment (future feature)
```

---

## Component Hierarchy

```
Dashboard App
│
├─ DashboardLayout (existing)
│  │
│  └─ HRSidebar (NEW)
│     │
│     ├─ Logo Section
│     ├─ Navigation Menu
│     │  ├─ NavLink (individual)
│     │  └─ NavSection (expandable)
│     ├─ User Section
│     └─ Mobile Toggle
│
├─ HR Pages
│  │
│  ├─ /dashboard/hr/page.tsx (Dashboard)
│  │  └─ Metrics Cards
│  │  └─ Team Distribution
│  │  └─ Upcoming Events Widget
│  │
│  ├─ /dashboard/hr/home/page.tsx (Feed)
│  │  └─ Upcoming Events Section
│  │  └─ Posts Feed
│  │     └─ Post Card (multiple)
│  │
│  ├─ /dashboard/hr/posts/new/page.tsx (Create Post)
│  │  └─ Title Input
│  │  └─ Content Textarea
│  │  └─ Image URL Input
│  │  └─ Submit Button
│  │
│  ├─ /dashboard/hr/teams/page.tsx (Teams List)
│  │  └─ Team Card (multiple)
│  │     ├─ Team Name
│  │     ├─ Chef Badge
│  │     └─ Members List
│  │
│  ├─ /dashboard/hr/teams/groups/page.tsx (Drag-Drop)
│  │  ├─ Unassigned Employees
│  │  │  └─ EmployeeCard (draggable)
│  │  └─ Group Cards (droppable)
│  │     └─ TeamGroupsClient (interactive)
│  │        ├─ Group Card
│  │        ├─ Member Cards (with delete)
│  │        └─ Chef Crown Button
│  │
│  └─ /dashboard/hr/settings/page.tsx (Settings)
│     ├─ Account Section
│     ├─ Notifications Section
│     ├─ Security Section
│     └─ Danger Zone
│
└─ UI Components
   ├─ Card
   ├─ Button
   ├─ Input
   ├─ Textarea
   ├─ Badge
   ├─ Dialog
   ├─ Alert
   └─ Icons (lucide-react)
```

---

## Data Flow Example: Posting an Announcement

```
User Types:        └──→  Form State  ──→  Validation  ──→  API Call
  "Team meeting        │ title: "..."    │ title filled?    │ POST
   at 3pm"             │ content: "..."  │ content filled?  │ /api/posts
                       │ image: "..."    │ image valid?     │
                                                              │
                                                              ↓
                                                       Backend Validates
                                                       ├─ HR role?
                                                       ├─ Startup assigned?
                                                       └─ Inputs valid?
                                                              │
                                                              ↓
                                                       Database Insert
                                                       INSERT INTO
                                                       organizationPost
                                                       ├ title
                                                       ├ content
                                                       ├ imageUrl
                                                       ├ authorId
                                                       ├ startupId
                                                       └ createdAt
                                                              │
                                                              ↓
                                                       Return Success
                                                              │
                                                              ↓
                                                       Client Toast
                                                       "Post created!"
                                                              │
                                                              ↓
                                                       Redirect to /home
                                                              │
                                                              ↓
                                                       Server Fetches
                                                       All Posts
                                                              │
                                                              ↓
                                                       Display in Feed
                                                       └─→ All users see
```

---

## Mobile vs Desktop Layout

### DESKTOP (1024px+)
```
┌──────────────────────────────────────────────────────────┐
│                      HEADER (sticky)                     │
├──────────────────────────────────────────────────────────┤
│  │                                                        │
│  │   Sidebar (fixed, 256px)                              │
│  │   ├─ Logo                                             │
│  │   ├─ Nav Links                                        │
│  │   └─ Sign Out                                         │
│  │                                                        │
│  └──────────────────────────────────────────────────────│
│     │                                                    │
│     │  Main Content (responsive)                        │
│     │  ├─ Dashboard                                     │
│     │  ├─ Metrics Grid (4 columns)                     │
│     │  ├─ Cards (2-3 column layout)                    │
│     │  └─ Full width for feed                          │
│     │                                                    │
│     │                                                    │
└─────┴────────────────────────────────────────────────────┘
```

### TABLET (640px - 1024px)
```
┌────────────────────────────────────┐
│         HEADER                     │
├────────────────────────────────────┤
│ │                                 │
│ │ Sidebar (collapsible)           │
│ │ [≡] Toggle on demand            │
│ │                                 │
│ │ Main Content                    │
│ │ ├─ Cards (2 columns)           │
│ │ ├─ Teams (2 columns)           │
│ │ └─ Responsive images           │
│ │                                 │
│ └─────────────────────────────────┘
```

### MOBILE (< 640px)
```
┌────────────┐
│ [≡] Header │  ← Hamburger toggle
├────────────┤
│            │
│ Main       │
│ Content    │
│ (Single    │
│  Column)   │
│            │
└────────────┘

Sidebar (when open):
┌────────────┐
│ [×] Sidebar│  ← Close button
├────────────┤
│ Dashboard  │
│ Home Feed  │
│ Teams      │
│ Events     │
│ Settings   │
│ Sign Out   │
└────────────┘
```

---

## State Management Flow (Drag & Drop Example)

```
Initial State:
{
  groups: [
    { id: "1", name: "Marketing", members: [], chef: null },
    { id: "2", name: "Sales", members: [], chef: null }
  ],
  unassignedEmployees: [
    { id: "emp1", name: "John", email: "john@..." },
    { id: "emp2", name: "Jane", email: "jane@..." }
  ],
  draggedEmployee: null
}

User Action: Start dragging John
│
└─→ onDragStart(John)
    {
      ...state,
      draggedEmployee: { id: "emp1", name: "John" }
    }

User Action: Drag over Marketing group
│
└─→ onDragOver()
    (prevent default, show visual feedback)

User Action: Drop on Marketing
│
└─→ onDrop("1")
    New State:
    {
      groups: [
        {
          id: "1",
          name: "Marketing",
          members: [{ id: "emp1", name: "John" }],
          chef: null
        },
        { id: "2", name: "Sales", members: [] }
      ],
      unassignedEmployees: [
        { id: "emp2", name: "Jane" }
      ],
      draggedEmployee: null
    }

User Action: Click crown on John
│
└─→ onSetChef("1", John)
    New State:
    {
      groups: [
        {
          id: "1",
          name: "Marketing",
          members: [{ id: "emp1", name: "John" }],
          chef: { id: "emp1", name: "John" }  ← Chef assigned
        },
        ...
      ]
    }

User Action: Click "Save Configuration"
│
└─→ Validate + Send POST /api/teams/groups
    └─→ Database Updated
    └─→ Persists on next page load
```

---

## Performance Optimization Strategy

```
Frontend:
├─ Server-Side Rendering (SSR)
│  └─ Initial HTML from server (fast first paint)
│
├─ Code Splitting
│  └─ Each page loads only needed JS
│
├─ CSS Optimization
│  └─ Tailwind purges unused styles
│
└─ Image Optimization
   └─ Responsive images, lazy loading

Backend:
├─ Database Queries
│  └─ Optimized with Prisma select()
│
├─ Caching
│  └─ Static generation where possible
│
└─ API Optimization
   └─ Minimal response payloads

Network:
├─ HTTP/2 multiplexing
├─ Gzip compression
└─ CDN delivery
```

---

## Security Layers

```
Input
  │
  ├─ Client-side validation
  │  └─ Check required fields
  │  └─ Format validation
  │
  ├─ Server-side validation
  │  └─ Re-validate all inputs
  │  └─ Type checking with Prisma
  │
  └─ Database constraints
     └─ NOT NULL, UNIQUE indexes

Access Control
  │
  ├─ Authentication (NextAuth)
  │  └─ Session verification
  │
  ├─ Authorization
  │  └─ Role check (HR required)
  │  └─ Startup isolation
  │
  └─ Data Access
     └─ Prisma relations
     └─ WHERE clauses by startupId

Transport
  │
  ├─ HTTPS encryption
  ├─ CSRF tokens (Next.js built-in)
  └─ Secure cookies
```

---

**This visual roadmap shows how every piece fits together perfectly!** ✨

---

*Last Updated: January 26, 2026*
