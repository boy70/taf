# Organization Profiles & Events Feature - Implementation Guide

## Overview

This guide covers the new Organization Profiles and Events features added to your Tafsula platform. These features enable HR managers to create professional organization profiles and manage events/training sessions that users can discover and register for.

---

## 🗄️ Database Changes

### New Models Added to Prisma Schema

#### 1. **startupProfile**
Stores organization profile information:
```prisma
model startupProfile {
  id                String   @id @default(cuid())
  startupId         String   @unique
  profileImageUrl   String?
  coverImageUrl     String?
  bio               String?  @db.Text
  contactEmail      String?
  contactPhone      String?
  location          String?
  website           String?
  galleryImagesJson Json?
  isPublic          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  startup           startup  @relation(fields: [startupId], references: [id], onDelete: Cascade)
}
```

#### 2. **organizationPost**
Stores blog posts/updates from organizations:
```prisma
model organizationPost {
  id        String   @id @default(cuid())
  startupId String
  title     String
  content   String   @db.Text
  imageUrl  String?
  authorId  String
  status    String   @default("published")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  startup   startup  @relation(fields: [startupId], references: [id], onDelete: Cascade)
  author    user     @relation(fields: [authorId], references: [id])
}
```

#### 3. **eventRegistration**
Tracks user registrations for events:
```prisma
model eventRegistration {
  id        String   @id @default(cuid())
  eventId   String
  userId    String
  status    String   @default("registered")
  appliedAt DateTime @default(now())
  event     event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user      user     @relation(fields: [userId], references: [id])
}
```

### Existing Model Updates

- **startup**: Added `startupProfile` and `posts` relationships
- **event**: Added `registrations` relationship
- **user**: Added `posts` and `eventRegistrations` relationships

### Migration Steps

```bash
# 1. Update your prisma/schema.prisma with the new models
# 2. Generate migration
npx prisma migrate dev --name add_organization_profiles

# 3. Generate Prisma client
npx prisma generate
```

---

## 📡 API Endpoints

### Organization Profile Endpoints

#### GET `/api/startups/:startupId/profile`
Retrieve an organization's profile.
```typescript
Response: {
  id: string
  startupId: string
  profileImageUrl?: string
  coverImageUrl?: string
  bio?: string
  contactEmail?: string
  contactPhone?: string
  location?: string
  website?: string
  galleryImagesJson?: Json
  isPublic: boolean
}
```

#### PATCH `/api/startups/:startupId/profile`
Update organization profile (HR or SUPERADMIN only).
```typescript
Request: {
  profileImageUrl?: string
  coverImageUrl?: string
  bio?: string
  contactEmail?: string
  contactPhone?: string
  location?: string
  website?: string
  galleryImagesJson?: Json
  isPublic?: boolean
}
```

### Organization Posts Endpoints

#### GET `/api/startups/:startupId/posts`
Retrieve published posts from an organization.

#### POST `/api/startups/:startupId/posts`
Create a new post (HR or SUPERADMIN only).
```typescript
Request: {
  title: string
  content: string
  imageUrl?: string
  status?: string // "published" or "draft"
}
```

### Event Registration Endpoints

#### POST `/api/events/:eventId/register`
Register a user for an event.
```typescript
Request: {
  status?: string // "registered" or other status
}
```

#### GET `/api/events/:eventId/register`
Get all registrations for an event.

### Organizations Directory

#### GET `/api/organizations`
Get public organizations with pagination.
```typescript
Query params:
- page: number (default: 1)
- limit: number (default: 12)

Response: {
  startups: Array<{
    id: string
    name: string
    startupProfile?: { ... }
    _count: { user: number, event: number, project: number }
  }>
  total: number
  pages: number
  currentPage: number
}
```

### Upcoming Events

#### GET `/api/events/upcoming`
Get upcoming public events from organizations with public profiles.
```typescript
Query params:
- page: number (default: 1)
- limit: number (default: 12)

Response: {
  events: Array<{ ... }>
  total: number
  pages: number
  currentPage: number
}
```

---

## 🎨 Components Created

### 1. **OrganizationCard** (`components/organization-card.tsx`)
Display card for organizations in directory.
- Shows organization name, bio, location
- Displays member and event counts
- Links to organization profile

### 2. **EventCard** (`components/event-card.tsx`)
Display card for events in event listing.
- Shows event title, date, location
- Organization info and registration count
- Links to event details

### 3. **OrgProfileEdit** (`components/org-profile-edit.tsx`)
Form component for HR to edit organization profile.
- Upload profile and cover images
- Edit bio, contact info, location, website
- Toggle public visibility

---

## 📄 Pages Created

### 1. **Organizations Directory** (`app/organizations/page.tsx`)
Public page showing all organizations with profiles.
- Search functionality
- Pagination
- Featured stats (50+ organizations, 200+ events, 5000+ members)
- Links to individual organization profiles

### 2. **Organization Profile** (`app/organizations/[id]/page.tsx`)
Detailed organization profile page.
- Cover image and logo display
- About section with contact information
- Posts tab showing organization updates
- Events tab showing upcoming events
- Stats showing member count, event count, project count

### 3. **Events Directory** (`app/events/page.tsx`)
Public page showing upcoming events from all organizations.
- Search and filter capabilities
- Pagination
- Event cards with registration count
- Links to event details and organization profiles

### 4. **HR Organization Settings** (`app/dashboard/hr/organization/page.tsx`)
HR dashboard page to manage organization profile.
- Edit profile information
- Upload images
- Toggle visibility
- Preview profile

---

## 🔐 Authorization & Security

All profile and post endpoints implement role-based access control:

- **SUPERADMIN**: Full access to all organizations
- **HR**: Can manage their own organization's profile and posts
- **EMPLOYEE/REGULAR_USER**: Can view public profiles and register for events

```typescript
// Example authorization check
if (!user || (user.role !== "SUPERADMIN" && 
    (user.role !== "HR" || user.startupId !== params.startupId))) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}
```

---

## 🎯 User Flows

### HR Manager Setting Up Organization Profile

1. Navigate to Dashboard → Organization Profile
2. Upload profile and cover images (use image URLs)
3. Fill in organization bio and contact information
4. Add location, website, and other details
5. Toggle "Public Profile" to make visible in directory
6. Save and view public profile

### Employee Exploring Organizations

1. Click "Organizations" in navigation
2. Search or browse organization cards
3. Click on an organization to view detailed profile
4. View organization's posts and upcoming events
5. Register for events

### Employee Registering for Event

1. Navigate to Events page
2. Search or browse event cards
3. Click "View Event" to see details
4. Click "Register" button
5. Confirm registration

---

## 🚀 Homepage Integration

The homepage now includes:

1. **Navigation Links**
   - "Organizations" link in main navigation
   - "Events" link in main navigation

2. **New Sections**
   - Organization & Events feature section
   - Call-to-action to explore organizations and events

3. **Updated Features List**
   - Professional organization profiles
   - Event and training management
   - Organization directory
   - Event registration system

---

## 📱 Responsive Design

All pages are fully responsive with:
- Mobile-friendly navigation
- Responsive grid layouts for cards
- Touch-friendly buttons and inputs
- Optimized image sizes

---

## 🎨 Design System

The feature uses your existing design system:

- **Colors**: Primary blue, purple, green gradients matching DISC theme
- **Typography**: Same font hierarchy as homepage
- **Components**: Shadcn/Radix UI components
- **Animations**: Framer Motion for smooth transitions
- **Spacing**: Tailwind CSS with consistent padding

---

## 🔄 Data Flow Diagram

```
Organization Profile Management:
HR Manager → Dashboard/Organization → Form → API → Database → Public Directory

Event Registration:
Employee → Events Page → Event Card → Register Button → API → Database → Confirmation

Organization Discovery:
User → Home → Organizations Link → Directory → Organization Card → Profile Page
```

---

## 🛠️ Setup Instructions

### 1. Update Database
```bash
npx prisma migrate dev --name add_organization_profiles
```

### 2. Install Dependencies
All required packages should already be installed. If not:
```bash
npm install
```

### 3. Update Navigation
Navigation is already updated with new links.

### 4. Test the Features
1. Create a startup (admin)
2. Assign HR user to startup
3. Log in as HR user
4. Go to Dashboard → Organization Profile
5. Fill in profile details
6. Make profile public
7. Create events from HR dashboard
8. Log out and browse `/organizations` and `/events`

---

## 📊 Database Queries

### Get organizations with profiles
```typescript
const orgs = await prisma.startup.findMany({
  where: {
    startupProfile: { isPublic: true }
  },
  include: {
    startupProfile: true,
    _count: { select: { user: true, event: true } }
  }
})
```

### Get upcoming events
```typescript
const events = await prisma.event.findMany({
  where: {
    startAt: { gte: new Date() },
    startup: { startupProfile: { isPublic: true } }
  },
  include: {
    startup: { include: { startupProfile: true } },
    _count: { select: { registrations: true } }
  }
})
```

### Register user for event
```typescript
const registration = await prisma.eventRegistration.create({
  data: {
    eventId,
    userId: session.user.id,
    status: "registered"
  }
})
```

---

## 🎯 Future Enhancements

Potential features to add:

1. **Image Upload**
   - Integrate with cloud storage (AWS S3, Cloudinary)
   - Replace URL-based images with file uploads

2. **Gallery**
   - Multiple images per organization
   - Image gallery view on organization profile

3. **Event Calendar**
   - Calendar view of events
   - iCal export functionality

4. **Event Details**
   - Detailed event pages
   - Registration cancellation
   - Event attendee list (for organizers)

5. **Messaging**
   - Direct messaging between HR and users
   - Event notifications

6. **Analytics**
   - View registration statistics
   - Track event attendance

7. **Social Features**
   - Follow organizations
   - Like/comment on posts
   - Share events

---

## 🐛 Troubleshooting

### Profile not showing in directory
- Check `isPublic` is set to `true`
- Ensure startup profile exists
- Verify you're logged in as HR for that startup

### Events not appearing
- Check event `visibility` is set to "ORG"
- Verify organization profile is public
- Check event `startAt` date is in the future

### Authorization errors
- Verify you have the correct role (HR for managing org profile)
- Check your `startupId` matches the organization you're editing
- SUPERADMIN can manage any organization

---

## 📞 Support

For issues or questions:
1. Check the API response error messages
2. Verify database migrations ran successfully
3. Check browser console for client-side errors
4. Verify user roles and permissions

---

## 📝 Notes

- All image URLs must be complete URLs (http/https)
- Organization profiles are optional but recommended for visibility
- Public profiles are the only ones visible in the directory
- Event registrations are tracked but not auto-approved
- Posts default to "published" status on creation

---

Generated on: January 19, 2026
Version: 1.0.0
