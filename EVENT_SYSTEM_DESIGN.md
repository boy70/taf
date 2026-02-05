# Event Management System - Professional Implementation Plan

## Current State Analysis

### Existing Database Models
1. **event**: Basic event with type, visibility, location, skills
2. **eventRegistration**: Simple user registration with status
3. **attendance**: Event attendance tracking

### Gaps to Address
- No event pricing (free/paid)
- No event format distinction (online/in-person)
- No event status tracking (upcoming/ongoing/past)
- No QR code attendance mechanism
- No post-event gallery
- No attendance counter per user
- Limited visibility controls

---

## Enhanced Database Schema

### New/Modified Models Needed

#### 1. **event** (Enhanced)
```prisma
model event {
  id                  String   @id @default(cuid())
  startupId           String
  title               String
  description         String?  @db.Text
  
  // Event Details
  type                String   @default("GENERAL")  // GENERAL, TRAINING, WORKSHOP, CONFERENCE
  format              String   @default("IN_PERSON") // IN_PERSON, ONLINE, HYBRID
  price               Float    @default(0)  // 0 for free
  currency            String   @default("USD")
  
  // Timing
  startAt             DateTime
  endAt               DateTime?
  
  // Location (for in-person events)
  location            String?
  venue               String?
  
  // Visibility & Access
  visibility          String   @default("ORG_ONLY") // PUBLIC, ORG_ONLY, MEMBERS_ONLY, PRIVATE
  isApprovalRequired  Boolean  @default(false)
  maxParticipants     Int?
  
  // Attendance
  status              String   @default("UPCOMING") // UPCOMING, ONGOING, COMPLETED, CANCELLED
  
  // QR Code & Attendance
  qrCodeUrl           String?  @db.LongText
  qrCodeData          String?  @db.LongText
  
  // Post-Event
  galleryImagesJson   Json?    // Array of image URLs
  summary             String?  @db.Text
  
  // Relations
  skillsJson          Json?
  relatedTeamId       String?
  relatedProjectId    String?
  createdById         String
  
  // Metadata
  tags                Json?    // Array of tags
  category            String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  // Relations
  startup       startup @relation(fields: [startupId], references: [id], onDelete: Cascade)
  relatedTeam   team?   @relation("TeamEvent", fields: [relatedTeamId], references: [id])
  relatedProject project? @relation("ProjectEvent", fields: [relatedProjectId], references: [id])
  createdBy     user    @relation("EventCreator", fields: [createdById], references: [id])
  
  registrations       eventRegistration[]
  attendances         eventAttendance[]
  approvalRequests    eventApprovalRequest[]
  
  @@index([startupId])
  @@index([createdById])
  @@index([status])
  @@index([visibility])
}
```

#### 2. **eventRegistration** (Enhanced)
```prisma
model eventRegistration {
  id              String   @id @default(cuid())
  eventId         String
  userId          String
  
  // Registration Status
  status          String   @default("REGISTERED") // REGISTERED, APPROVED, REJECTED, CANCELLED
  approvedAt      DateTime?
  
  // Payment (if applicable)
  paymentStatus   String   @default("PENDING")    // PENDING, PAID, FAILED, REFUNDED
  ticketId        String?
  
  appliedAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  event           event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user            user     @relation("EventRegistrations", fields: [userId], references: [id])
  
  @@unique([eventId, userId])
  @@index([userId])
  @@index([status])
}
```

#### 3. **eventAttendance** (New - Replaces/Enhances attendance)
```prisma
model eventAttendance {
  id              String   @id @default(cuid())
  eventId         String
  userId          String
  
  // Attendance Status
  status          String   @default("NOT_ATTENDED") // ATTENDED, NOT_ATTENDED, PARTIAL
  checkInTime     DateTime?
  checkOutTime    DateTime?
  
  // QR Code Scanning
  scannedAt       DateTime?
  qrCodeId        String?
  scannerUserId   String?  // HR who manually marked attendance
  
  // Duration attended (in minutes)
  durationMinutes Int?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  event           event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user            user     @relation("EventAttendances", fields: [userId], references: [id])
  scanner         user?    @relation("ManualAttendanceMarked", fields: [scannerUserId], references: [id])
  
  @@unique([eventId, userId])
  @@index([userId])
  @@index([eventId])
  @@index([status])
}
```

#### 4. **eventApprovalRequest** (New - For private event approvals)
```prisma
model eventApprovalRequest {
  id              String   @id @default(cuid())
  eventId         String
  userId          String
  
  status          String   @default("PENDING") // PENDING, APPROVED, REJECTED
  rejectionReason String?
  approvedAt      DateTime?
  approvedBy      String?
  
  requestedAt     DateTime @default(now())
  
  event           event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user            user     @relation("EventApprovalRequests", fields: [userId], references: [id])
  approver        user?    @relation("ApprovalsGiven", fields: [approvedBy], references: [id])
  
  @@unique([eventId, userId])
  @@index([userId])
  @@index([status])
}
```

#### 5. **eventQRCode** (New - Track QR scans)
```prisma
model eventQRCode {
  id              String   @id @default(cuid())
  eventId         String
  code            String   @unique
  
  // QR Code Details
  qrImageUrl      String?  @db.LongText
  qrData          String?  @db.LongText
  
  // Scan Tracking
  totalScans      Int      @default(0)
  
  createdAt       DateTime @default(now())
  
  event           event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  
  @@index([eventId])
}
```

#### 6. **userEventStats** (New - Track user participation)
```prisma
model userEventStats {
  id                  String   @id @default(cuid())
  userId              String
  startupId           String
  
  totalEventsJoined   Int      @default(0)
  totalAttended       Int      @default(0)
  totalHoursAttended  Float    @default(0)
  
  updatedAt           DateTime @updatedAt
  
  user                user     @relation(fields: [userId], references: [id], onDelete: Cascade)
  startup             startup  @relation(fields: [startupId], references: [id], onDelete: Cascade)
  
  @@unique([userId, startupId])
  @@index([userId])
}
```

---

## API Routes Structure

```
/api/events/
  ├── route.ts                          // GET (list all), POST (create)
  ├── [id]/
  │   ├── route.ts                      // GET, PATCH, DELETE
  │   ├── register/route.ts             // POST (user joins)
  │   ├── attendance/route.ts           // GET (list attendees), POST (manual mark)
  │   ├── qr-code/route.ts              // GET (generate/retrieve QR)
  │   ├── qr-code/scan/route.ts         // POST (scan QR code)
  │   └── gallery/route.ts              // GET (photos), POST (upload), DELETE
  ├── upcoming/route.ts                 // GET (filter upcoming)
  ├── past/route.ts                     // GET (filter completed)
  └── approvals/
      └── route.ts                      // GET (pending), POST (approve/reject)

/api/event-stats/
  ├── user/[userId]/route.ts            // GET user event statistics

/api/organizations/[id]/
  └── events/route.ts                   // GET (filter by visibility & user role)
```

---

## UI Components Structure

### HR Dashboard
```
/dashboard/hr/
├── events/
│   ├── page.tsx                   // List all events
│   ├── create/page.tsx            // Create new event
│   ├── [id]/
│   │   ├── page.tsx               // Event details & management
│   │   ├── attendees/page.tsx      // View attendance
│   │   ├── qr-code/page.tsx        // QR code display & print
│   │   ├── gallery/page.tsx        // Manage post-event photos
│   │   └── analytics/page.tsx      // Event analytics
│   └── approvals/page.tsx          // Event approval requests
```

### Employee Dashboard
```
/dashboard/employee/
├── events/
│   ├── page.tsx                   // Browse available events
│   ├── registered/page.tsx         // My registered events
│   ├── attended/page.tsx           // Events I attended
│   └── [id]/page.tsx               // Event details & participate
```

### Organization Public Page
```
/organizations/[id]/
├── events/                         // Events tab (enhanced)
│   ├── page.tsx                   // View public events with status
│   └── [id]/page.tsx              // Event details & register
```

---

## Event Status Flow

```
Creation → UPCOMING → (Event Date) → ONGOING → COMPLETED
                                   ↘ (Cancelled) → CANCELLED
```

## Visibility Levels

| Level | Public | Org Members | Members Only | Private |
|-------|--------|-------------|--------------|---------|
| Public | ✓ | ✓ | - | - |
| ORG_ONLY | - | ✓ | - | - |
| MEMBERS_ONLY | - | ✓ (if member) | ✓ | - |
| PRIVATE | - | - | - | ✓ (approval required) |

---

## Key Features Timeline

### Phase 1: Database & Core
- Enhanced event schema with all fields
- QR code generation & storage
- Attendance tracking with QR

### Phase 2: HR Features
- Event creation & management
- QR code generation & printing
- Attendance management (manual + QR scan)
- Event photo gallery

### Phase 3: User Features
- Event discovery & filtering
- Event registration with approval system
- QR code scanning for attendance
- Event statistics & history

### Phase 4: Organization Page
- Enhanced events display
- Status badges (upcoming, ongoing, completed)
- Event filtering by type/format/price

---

## Professional Best Practices

1. **Scalability**: All relations properly indexed
2. **Data Integrity**: Cascade deletes, unique constraints
3. **Flexibility**: JSON fields for extensibility (tags, skills, gallery)
4. **Audit Trail**: createdAt, updatedAt timestamps
5. **Security**: Visibility controls, approval workflows
6. **Performance**: Proper indexing on frequently queried fields
7. **Maintainability**: Clear naming conventions, logical grouping
