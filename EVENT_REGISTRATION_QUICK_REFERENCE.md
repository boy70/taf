# Event Registration System - Quick Reference

## 🚀 Quick Start

### Files Modified:
1. `components/event-card.tsx` - Added register button
2. `app/api/events/[id]/register/route.ts` - Enhanced validation
3. `app/dashboard/hr/page.tsx` - Added event stats
4. `app/dashboard/hr/events/[id]/page.tsx` - New HR event detail page

### Files Created:
1. `components/hr-event-registrations.tsx` - Registration management UI
2. `app/api/events/[id]/registrations/route.ts` - Fetch registrations API
3. `app/api/events/[id]/registrations/[registrationId]/route.ts` - Manage registration API

---

## 📱 User Flow

```
Events Page (/events)
  └─ EventCard
      ├─ Register Now Button
      │   └─ POST /api/events/[id]/register
      │       └─ Creates eventRegistration record
      └─ Shows registration count

Event Detail Page (/events/[id])
  └─ Registration Section
      ├─ Shows status (Registered/Not Registered)
      ├─ Register/Unregister buttons
      └─ QR code scanning for registered users
```

---

## 👔 HR Flow

```
HR Dashboard (/dashboard/hr)
  ├─ Event Stats Card
  │   ├─ Total Events
  │   └─ Total Registrations
  └─ Upcoming Events Widget
      └─ Link to event detail

HR Event Detail Page (/dashboard/hr/events/[id])
  ├─ Event Overview
  │   ├─ Date, Type, Format
  │   └─ Statistics (Registrations, Attendees, Feedback)
  └─ HREventRegistrations Component
      ├─ Stats Cards (Approved/Pending/Rejected)
      ├─ Registration Table
      │   ├─ User info (Name, Email, Headline)
      │   ├─ Status (Approved/Pending/Rejected)
      │   └─ Action Buttons
      │       ├─ Approve (for Pending)
      │       ├─ Reject (for Pending)
      │       └─ Remove (for others)
      └─ CSV Export Button
```

---

## 🔌 API Endpoints

### Registration (User)
```
GET    /api/events/[id]/register       → Check status
POST   /api/events/[id]/register       → Register
DELETE /api/events/[id]/register       → Unregister
```

### Management (HR)
```
GET    /api/events/[id]/registrations                    → Get all
PATCH  /api/events/[id]/registrations/[registrationId]  → Update status
DELETE /api/events/[id]/registrations/[registrationId]  → Remove
```

---

## 💾 Database Operations

### Create Registration:
```typescript
await prisma.eventRegistration.create({
  data: {
    eventId,
    userId,
    status: event.isApprovalRequired ? "REGISTERED" : "APPROVED",
    appliedAt: new Date(),
  }
})
```

### Update Status:
```typescript
await prisma.eventRegistration.update({
  where: { id: registrationId },
  data: {
    status: "APPROVED", // or "REJECTED"
    approvedAt: new Date(),
  }
})
```

### Fetch All for Event:
```typescript
await prisma.eventRegistration.findMany({
  where: { eventId },
  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        profile: { select: { headline: true } }
      }
    }
  }
})
```

---

## 🎯 Validation Points

- ✅ User authenticated (session check)
- ✅ Event exists
- ✅ Event not completed/cancelled
- ✅ User not already registered
- ✅ Event capacity not exceeded
- ✅ HR role for management endpoints
- ✅ Same startup ownership for HR

---

## 🎨 Component Props

### EventCard
```typescript
interface EventCardProps {
  id: string
  title: string
  description?: string
  startAt: Date | string
  location?: string
  startupName: string
  startupProfileImage?: string
  posterUrl?: string
  registrationCount?: number
  index?: number
  type?: string
  format?: string
  isRegistered?: boolean              // NEW
  onRegistrationChange?: () => void   // NEW
}
```

### HREventRegistrations
```typescript
interface EventRegistrationsProps {
  eventId: string
  eventTitle: string
  eventStartAt: string
}
```

---

## 📊 Response Format

### Registration Status:
```typescript
{
  isRegistered: boolean
  status: "REGISTERED" | "APPROVED" | "REJECTED" | null
  appliedAt: string | null
  approvedAt: string | null
  event: { id, title, startAt, status }
}
```

### Registrations List:
```typescript
{
  event: { id, startupId, title, startAt }
  registrations: Registration[]
  stats: {
    total: number
    approved: number
    pending: number
    rejected: number
    cancelled: number
  }
}
```

---

## 🎬 Key Actions

### User Registers:
1. Click "Register Now" button
2. `handleRegister()` → POST to `/api/events/[id]/register`
3. API creates eventRegistration with REGISTERED status
4. Component updates to show "Registered" button
5. Refresh stats

### HR Approves:
1. View registration in table
2. Click approve button
3. `handleApprove()` → PATCH to `/api/events/[id]/registrations/[id]`
4. API updates status to APPROVED + sets approvedAt
5. Table updates with green badge
6. Stats refresh

### HR Exports CSV:
1. Click "Export CSV" button
2. `handleExportCSV()` builds CSV content
3. Creates blob and downloads file
4. File: `{eventTitle}-registrations.csv`

---

## 🛠️ Development Tips

1. **Testing Registration:**
   - Use browser DevTools to monitor API calls
   - Check Network tab for request/response
   - Verify eventRegistration records in database

2. **Testing HR Features:**
   - Create test HR account with role: "HR"
   - Create test event in HR's startup
   - Use different user to register
   - Test approval flow

3. **CSV Export Debug:**
   - Right-click download, inspect network
   - Check Content-Type: text/csv
   - Verify all data in CSV

4. **Status Updates:**
   - Check client-side state update
   - Verify database change
   - Confirm UI reflects new status

---

## ⚠️ Error Handling

### Common Errors:

| Error | Cause | Solution |
|-------|-------|----------|
| "Event not found" | Invalid event ID | Check URL parameter |
| "Already registered" | Duplicate registration | Show existing status |
| "Event is at full capacity" | Max participants reached | Show waiting list option |
| "Cannot register for completed" | Event status check | Show event status |
| "Not authorized" | Non-HR user | Check role and startup |
| "Internal server error" | Database error | Check database connection |

---

## 📈 Performance Notes

- Registration queries use indexes on eventId + userId
- Fetch operations include necessary relations
- No N+1 queries in HR registrations view
- CSV export handles large datasets efficiently
- Real-time updates use optimistic UI patterns

---

## 🔐 Security Checklist

- [x] Authentication required for all endpoints
- [x] HR role validation for management endpoints
- [x] Startup ownership verification
- [x] Event capacity validation
- [x] Status validation (can't register for past events)
- [x] User can only see own registration status
- [x] HR can only manage registrations for own startup

---

## 📞 Debugging Commands

```bash
# Check if eventRegistration table exists
npx prisma db push

# View registrations for an event
npx prisma studio
# Navigate to eventRegistration, filter by eventId

# Reset event registrations (dev only)
npx prisma db push --force-reset
```

---

**Last Updated:** January 22, 2026
**Version:** 1.0
