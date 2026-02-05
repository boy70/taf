# Event Registration System - Visual Guide

## 🎯 User Journey Map

```
START: User visits Events page
       ↓
    SEE EVENT CARDS
    ├─ Event title, description
    ├─ Date, time, location
    ├─ Organizer info
    ├─ Registration count
    └─ [Register Now] Button ← NEW!
       ↓
    USER CLICKS [Register Now]
       ↓
    SYSTEM VALIDATES
    ├─ User authenticated? ✓
    ├─ Event exists? ✓
    ├─ Not already registered? ✓
    ├─ Event not completed? ✓
    └─ Space available? ✓
       ↓
    REGISTRATION CREATED
    ├─ Status: REGISTERED (or APPROVED)
    ├─ Applied At: Current time
    └─ Database saved ✓
       ↓
    UI UPDATES
    ├─ Button becomes GREEN
    ├─ Shows [Registered] ✓
    └─ Real-time count increases
       ↓
    USER CAN:
    ├─ View event details
    ├─ See registration confirmation
    ├─ Scan QR code (if registered)
    └─ Unregister if needed
       ↓
    END: User registered for event
```

---

## 👔 HR Manager Journey Map

```
START: HR Manager visits Dashboard
       ↓
    SEES DASHBOARD WITH:
    ├─ Total Events: 15
    ├─ Total Registrations: 342
    └─ Upcoming Events widget
       ↓
    CLICKS ON EVENT
    (/dashboard/hr/events/[id])
       ↓
    SEES EVENT DETAIL PAGE
    ├─ Event: "Team Building Day"
    ├─ Date: Jan 25, 2024
    ├─ Format: IN_PERSON
    ├─ Location: Conference Room A
    └─ Price: Free
       ↓
    SEES STATISTICS
    ├─ Total Registrations: 45
    ├─ Approved: 30 ✓
    ├─ Pending: 10 ⏳
    ├─ Rejected: 5 ✗
    └─ Attendees: 28
       ↓
    VIEWS REGISTRATION TABLE
    ├─ John Doe | john@example.com | Software Dev | Approved ✓
    ├─ Jane Smith | jane@example.com | Designer | Pending ⏳ [✓ Approve] [✗ Reject]
    ├─ Bob Wilson | bob@example.com | Manager | Rejected ✗ [🗑️ Remove]
    └─ ... (more registrations)
       ↓
    MANAGES REGISTRATIONS
    ├─ APPROVE: Click ✓ button
    │   ├─ Status: Pending → Approved
    │   ├─ Send confirmation to user
    │   └─ Update in real-time
    │
    ├─ REJECT: Click ✗ button
    │   ├─ Status: Pending → Rejected
    │   ├─ Send rejection to user
    │   └─ Update in real-time
    │
    └─ REMOVE: Click 🗑️ button
        ├─ Delete registration
        ├─ Update statistics
        └─ Table refreshes
       ↓
    EXPORTS DATA
    ├─ Click [Export CSV] button
    ├─ File generated: Team_Building_Day-registrations.csv
    ├─ Contains:
    │   ├─ Name, Email, Headline
    │   ├─ Status, Registration Date
    │   └─ Approval Date
    └─ File downloaded
       ↓
    END: HR management complete
```

---

## 📱 Component Architecture

```
┌─────────────────────────────────────────────────────┐
│           Events Page Component                      │
│  (app/events/page.tsx)                             │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│   EventCard      │  │   EventCard      │ (Multiple)
│   Component      │  │   Component      │
│                  │  │                  │
│ - title          │  │ - title          │
│ - description    │  │ - description    │
│ - startAt        │  │ - startAt        │
│ - location       │  │ - location       │
│ - [Register Now] │  │ - [Register Now] │
│   Button (NEW)   │  │   Button (NEW)   │
│                  │  │                  │
│ onClick:         │  │ onClick:         │
│ - POST Register  │  │ - POST Register  │
│ - Update UI      │  │ - Update UI      │
└──────────────────┘  └──────────────────┘
```

```
┌─────────────────────────────────────────────────────┐
│     HR Dashboard (app/dashboard/hr/page.tsx)       │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌──────────────────┐  ┌──────────────────────┐
│  Event Stats     │  │  Upcoming Events     │
│  Card            │  │  Widget              │
│                  │  │                      │
│ - Total: 15      │  │ - Event 1: 5 regs    │
│ - Registrations  │  │ - Event 2: 8 regs    │
│   342            │  │ - Event 3: 3 regs    │
│                  │  │ - [View All Events]  │
└──────────────────┘  └──────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────┐
        │  HR Event Detail Page              │
        │  (/dashboard/hr/events/[id])      │
        │                                    │
        │ - Event overview                  │
        │ - Dates, format, visibility       │
        │ - Price, location                 │
        │                                    │
        │ [Event Stats]                     │
        │ - Total: 45 registrations         │
        │ - Approved: 30                    │
        │ - Pending: 10                     │
        │ - Rejected: 5                     │
        │                                    │
        │ [HREventRegistrations Component]  │
        │ - Registration table              │
        │ - Action buttons                  │
        │ - [Export CSV] button             │
        └────────────────────────────────────┘
```

---

## 🔄 API Flow Diagram

```
USER SIDE:
┌──────────────┐
│ Event Card   │
│ [Register]   │
└──────┬───────┘
       │
       │ onClick: handleRegister()
       │
       ▼
┌──────────────────────────────┐
│ POST /api/events/[id]/register
│                              │
│ Validate:                    │
│ ✓ Authenticated             │
│ ✓ Event exists              │
│ ✓ Not duplicated            │
│ ✓ Event not completed       │
│ ✓ Capacity OK               │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Create eventRegistration     │
│ {                            │
│   eventId: "123"             │
│   userId: "456"              │
│   status: "APPROVED"         │
│   appliedAt: now             │
│ }                            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Return registration + 201    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ UI Updates                   │
│ - Button: "Registered" ✓     │
│ - Color: Green               │
│ - Count increases            │
└──────────────────────────────┘

HR SIDE:
┌──────────────────────────────┐
│ HR Dashboard                 │
│ [Click Event Link]           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ GET /api/events/[id]/registrations
│                              │
│ Validate:                    │
│ ✓ Authenticated              │
│ ✓ HR role                    │
│ ✓ Same startup               │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Query registrations:         │
│ - Include user data          │
│ - Order by status            │
│ - Calculate stats            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Return {                     │
│   event: {...}               │
│   registrations: [...]       │
│   stats: {                   │
│     total: 45                │
│     approved: 30             │
│     pending: 10              │
│     rejected: 5              │
│   }                          │
│ }                            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ HREventRegistrations renders │
│ - Stats cards                │
│ - Registration table         │
│ - Action buttons             │
└──────┬───────────────────────┘
       │
       │ onClick: handleApprove()
       │
       ▼
┌──────────────────────────────┐
│ PATCH /api/events/[id]/      │
│       registrations/[id]     │
│                              │
│ {                            │
│   status: "APPROVED"         │
│ }                            │
│                              │
│ Update:                      │
│ - status = APPROVED          │
│ - approvedAt = now           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Return updated registration  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Refresh registrations list   │
│ - Table updates in real-time │
│ - Stats recalculate          │
│ - Status shows green ✓       │
└──────────────────────────────┘
```

---

## 🎨 UI State Transitions

### Event Card States:
```
┌─────────────────────────────────────────┐
│          NOT REGISTERED                 │
│                                         │
│  [Register Now]                         │
│  (blue button)                          │
└────────────────┬────────────────────────┘
                 │ Click Register
                 ▼
┌─────────────────────────────────────────┐
│        REGISTERING (Loading)            │
│                                         │
│  [Registering...] ⏳                    │
│  (loading spinner)                      │
└────────────────┬────────────────────────┘
                 │ Success
                 ▼
┌─────────────────────────────────────────┐
│          REGISTERED                     │
│                                         │
│  [✓ Registered]                         │
│  (green button)                         │
└────────────────┬────────────────────────┘
                 │ Click Unregister
                 ▼
┌─────────────────────────────────────────┐
│        UNREGISTERING (Loading)          │
│                                         │
│  [Unregistering...] ⏳                  │
│  (loading spinner)                      │
└────────────────┬────────────────────────┘
                 │ Success
                 ▼
            (Back to NOT REGISTERED)
```

### Registration Status States:
```
REGISTERED (Pending) ⏳ Yellow Badge
    ↓ HR approves
APPROVED ✓ Green Badge
    ↓ OR
REJECTED ✗ Red Badge
```

---

## 📊 Database Relationship

```
┌──────────────┐
│ user         │
├──────────────┤
│ id (PK)      │
│ name         │
│ email        │
│ role         │
│ startupId    │
└──────┬───────┘
       │ 1:Many
       │
       │ "EventRegistrations"
       │
       ▼
┌────────────────────────────┐
│ eventRegistration          │
├────────────────────────────┤
│ id (PK)                    │
│ eventId (FK)               │
│ userId (FK)                │
│ status (REGISTERED|...)    │
│ appliedAt                  │
│ approvedAt (nullable)      │
│ updatedAt                  │
├────────────────────────────┤
│ UNIQUE: eventId + userId   │
└────────────┬───────────────┘
             │ 1:Many
             │
             ▼
        ┌──────────────┐
        │ event        │
        ├──────────────┤
        │ id (PK)      │
        │ title        │
        │ description  │
        │ startupId    │
        │ type         │
        │ format       │
        │ status       │
        │ maxParticip. │
        │ startAt      │
        └──────────────┘
```

---

## 🔐 Authorization Flow

```
┌──────────────────────────┐
│ User Makes Request       │
└────────────┬─────────────┘
             │
             ▼
    ┌────────────────────┐
    │ Authenticated?     │
    └─┬──────────────┬───┘
      │ No           │ Yes
      ▼              ▼
    [403]      ┌────────────────────┐
               │ Check Endpoint     │
               └─┬──────────────┬───┘
                 │ User Routes  │ HR Routes
                 │              │
                 ▼              ▼
            Allow All      ┌──────────────────┐
                           │ Is HR Role?      │
                           └─┬──────────────┬─┘
                             │ No           │ Yes
                             ▼              ▼
                           [403]      ┌────────────────┐
                                      │ Same Startup?  │
                                      └─┬────────────┬─┘
                                        │ No         │ Yes
                                        ▼            ▼
                                      [403]     [200 OK]
```

---

## 📈 Metrics & Monitoring

```
Dashboard Metrics:
┌─────────────────────────────────┐
│ Event Statistics                │
├─────────────────────────────────┤
│                                 │
│  Total Events:      [15]        │
│  ├─ Upcoming:       [8]         │
│  ├─ Ongoing:        [1]         │
│  └─ Completed:      [6]         │
│                                 │
│  Total Registrations: [342]     │
│  ├─ Approved:        [280]      │
│  ├─ Pending:         [45]       │
│  └─ Rejected:        [17]       │
│                                 │
│  Avg per Event:      [22.8]     │
│                                 │
└─────────────────────────────────┘

Event Detail Metrics:
┌─────────────────────────────────┐
│ "Team Building" Event           │
├─────────────────────────────────┤
│                                 │
│  Registrations:     [45] ⬆️     │
│  Approved:          [30]        │
│  Pending:           [10]        │
│  Rejected:          [5]         │
│  Cancellations:     [0]         │
│                                 │
│  Attendance Rate:   [28/30]     │
│                     [93%] ✓     │
│                                 │
│  Feedback Score:    [4.6/5]    │
│                                 │
└─────────────────────────────────┘
```

---

## ✅ Testing Checklist Flow

```
BEFORE DEPLOYMENT:
─────────────────

USER REGISTRATION:
□ Navigate to /events
□ Click Register button
□ Button changes to green
□ Registration count increases
□ Unregister works
□ Double registration prevented
□ Works on mobile view

EVENT DETAILS:
□ Registration section visible
□ Status shows correctly
□ Approve option works (if pending)
□ Error messages clear

HR DASHBOARD:
□ Event stats display
□ Upcoming events show
□ Links work correctly

HR EVENT MANAGEMENT:
□ /dashboard/hr/events/[id] loads
□ Registrations table displays
□ Stats cards show numbers
□ Approve/Reject buttons work
□ Remove button works
□ CSV export works
□ Real-time updates happen

API TESTING:
□ GET /api/events/[id]/register
□ POST /api/events/[id]/register
□ DELETE /api/events/[id]/register
□ GET /api/events/[id]/registrations
□ PATCH /api/events/[id]/registrations/[id]
□ DELETE /api/events/[id]/registrations/[id]

SECURITY:
□ Non-authenticated blocked
□ Non-HR users can't manage
□ Users from different startups blocked
□ Capacity limits enforced
□ Event status checks work

EDGE CASES:
□ Event at capacity → Cannot register
□ Event completed → Cannot register
□ Already registered → Prevented
□ Unregister during event → Blocked
□ Large registration list → Export works
```

---

**This visual guide provides a complete overview of the event registration system architecture and user flows.**
