# TAFSULA - QUICK IMPLEMENTATION REFERENCE

**Last Updated:** January 28, 2026  
**Status:** 71.4% Complete (15/21 pages)

---

## 🚨 CRITICAL ACTION ITEMS (Do These First!)

### 1. Create `/dashboard/employee/events` Page
**Time:** 4-5 hours | **Priority:** CRITICAL

```
File to create: app/dashboard/employee/events/page.tsx

Required imports:
- EmployeeLayout from '@/components/layout/employee-layout'
- Card, Badge, Button, Tabs, Input from '@/components/ui'
- useSession, useEffect, useState

Key features:
✓ Event listing with filters
✓ Registration functionality
✓ QR code check-in
✓ Event details modal

API calls needed:
GET  /api/events?startupId=X&status=upcoming
GET  /api/events/:eventId
POST /api/events/:eventId/register
POST /api/events/:eventId/checkin
```

### 2. Create `/dashboard/hr/posts` (Main Page)
**Time:** 2-3 hours | **Priority:** CRITICAL

```
File to create: app/dashboard/hr/posts/page.tsx

Required imports:
- DashboardLayout from '@/components/layout/dashboard-layout'
- Card, Badge, Button, Tabs from '@/components/ui'

Key features:
✓ Posts list with status filtering
✓ Approval workflow UI
✓ Rejection with reason
✓ Search and sort

API calls needed:
GET  /api/posts?startupId=X&status=pending
PUT  /api/posts/:postId/approve
PUT  /api/posts/:postId/reject

Note: /posts/new/page.tsx already exists - reuse patterns from there
```

### 3. Create `/dashboard/hr/members` (Main Page)
**Time:** 5-6 hours | **Priority:** CRITICAL

```
File to create: app/dashboard/hr/members/page.tsx
Components to create:
- components/member-directory-table.tsx
- components/member-leaderboard.tsx
- components/member-profile-modal.tsx

Key features:
✓ Member directory/list
✓ Search and filter
✓ Leaderboard with rankings
✓ Achievement badges
✓ Credit tracking

API calls needed:
GET /api/members?startupId=X
GET /api/members/leaderboard?startupId=X
GET /api/members/:userId/profile

New models needed:
- Achievement badges system
- Member credit visualization
```

### 4. Create `/dashboard/hr/tasks` (Main Dashboard)
**Time:** 5-6 hours | **Priority:** CRITICAL

```
File to create: app/dashboard/hr/tasks/page.tsx
Components to create:
- components/task-assignment-matrix.tsx
- components/task-analytics-dashboard.tsx
- components/task-review-panel.tsx

Key features:
✓ Task dashboard overview
✓ Assignment matrix (teams × members)
✓ Task review and approval
✓ Analytics and metrics
✓ Performance tracking

API calls needed:
GET  /api/tasks?startupId=X&status=X
GET  /api/tasks/analytics?startupId=X
PUT  /api/tasks/:taskId/approve
PUT  /api/tasks/:taskId/reject

Note: /tasks/create/page.tsx and /tasks/review/ exist - integrate with main page
```

---

## 📋 MISSING API ENDPOINTS (Create These)

### High Priority

| Method | Endpoint | Purpose | Effort |
|--------|----------|---------|--------|
| POST | `/api/events/:eventId/register` | Employee event registration | 1 hour |
| POST | `/api/events/:eventId/checkin` | QR code check-in attendance | 1 hour |
| PUT | `/api/posts/:postId/approve` | Approve post | 30 min |
| PUT | `/api/posts/:postId/reject` | Reject post with reason | 30 min |
| GET | `/api/members?startupId=X` | List all members | 1 hour |
| GET | `/api/members/leaderboard` | Member rankings | 1 hour |
| GET | `/api/tasks?startupId=X` | List all tasks | 1 hour |
| PUT | `/api/tasks/:taskId/approve` | Approve task submission | 1 hour |
| GET | `/api/tasks/analytics` | Task analytics/metrics | 1.5 hours |

**Total Estimated Time:** 8-9 hours

---

## ✅ ALREADY COMPLETE PAGES

### Employee Dashboard (7/8)
- ✅ `/dashboard/employee/home` - Task list & notifications
- ✅ `/dashboard/employee/posts` - Community posts feed  
- ✅ `/dashboard/employee/feed` - Feed component
- ✅ `/dashboard/employee/profile` - Profile editing
- ✅ `/dashboard/employee/proposals` - Proposal creation
- ✅ `/dashboard/employee/results` - DISC results display
- ✅ `/dashboard/employee/teams` - Team management
- ❌ `/dashboard/employee/events` - **MISSING**

### HR Dashboard (11/14)
- ✅ `/dashboard/hr/home` - HR dashboard overview
- ✅ `/dashboard/hr/employees` - Employee list & management
- ✅ `/dashboard/hr/events` - Event management
- ✅ `/dashboard/hr/compatibility` - Team compatibility analysis
- ✅ `/dashboard/hr/organization` - Org profile editing
- ✅ `/dashboard/hr/proposals` - Proposal review
- ✅ `/dashboard/hr/settings` - Settings page
- ✅ `/dashboard/hr/teams` - Team management
- ✅ `/dashboard/hr/training-planner` - Training plan generation
- ✅ `/dashboard/hr/posts/new` - Create post
- ✅ `/dashboard/hr/tasks/create` - Create task
- ✅ `/dashboard/hr/tasks/review` - Review tasks
- ❌ `/dashboard/hr/posts` (main) - **MISSING**
- ❌ `/dashboard/hr/members` (main) - **MISSING**
- ❌ `/dashboard/hr/tasks` (main) - **MISSING**

---

## 🔧 DESIGN SYSTEM FIXES NEEDED

### Layout Standardization
Files to update:
- `app/dashboard/hr/home/page.tsx` - Use HRSidebar instead of DashboardLayout
- `app/dashboard/hr/employees/page.tsx` - Use HRSidebar
- `app/dashboard/hr/compatibility/page.tsx` - Use HRSidebar

**Effort:** 30 minutes

### Error Handling Consistency
Create:
- `components/error-card.tsx` - Standard error display

Update 15+ pages to use it.

**Effort:** 2-3 hours

### Loading States
Create:
- `components/skeleton-loader.tsx` - Loading skeleton
- `components/loading-spinner.tsx` - Spinning loader

Update pages:
- HR Settings, HR Teams, HR Organization (missing loaders)

**Effort:** 2-3 hours

---

## 📊 DATABASE - ALREADY GOOD

No changes needed! The Prisma schema includes all models:
- ✅ User, Startup, Profile, Result (DISC)
- ✅ Team, TeamMember, TeamTask, TeamTaskAssignment
- ✅ Event, EventRegistration, EventAttendance, EventApprovalRequest, EventFeedback
- ✅ OrganizationPost, PostComment, PostLike, PostView
- ✅ Proposal, ProposalComment
- ✅ MemberCredit, UserEventStats
- ✅ Notification, Resource, Skill, Certificate

---

## 🎨 COMPONENT LIBRARY - ALREADY AVAILABLE

### UI Components (shadcn/ui)
- Card, Button, Badge, Input, Textarea
- Table, Dialog, Sheet, Tabs
- Checkbox, Select, Label, Alert
- Progress, Avatar, Popover
- Tooltip, Skeleton

### Layout Components
- `EmployeeLayout` - Employee sidebar layout
- `HRSidebar` - HR sidebar component
- `DashboardLayout` - Generic dashboard layout (used inconsistently)

### Custom Components
- `NotificationCenter` - Notification display
- `PostsComponent`, `PostsFeed` - Posts display
- `HRInviteEmployee` - Employee invitation
- `TrainingRecommendations` - Training display
- `OrgProfileEdit` - Organization profile editor

---

## 🧪 TESTING CHECKLIST

### Before Deployment
- [ ] All 4 critical pages created and tested
- [ ] All 10 missing API endpoints created and tested
- [ ] No 404 errors in navigation
- [ ] Mobile responsive on all pages
- [ ] Error handling works correctly
- [ ] Loading states display properly
- [ ] Data fetching works without console errors
- [ ] Forms validate correctly
- [ ] Authentication guard works
- [ ] Database queries return correct data

---

## 📈 PRIORITY ROADMAP

### Week 1 (Est. 25-30 hours)
- [ ] Create `/dashboard/employee/events` - 5 hours
- [ ] Create `/dashboard/hr/posts` main page - 3 hours
- [ ] Create `/dashboard/hr/members` main page - 6 hours
- [ ] Create `/dashboard/hr/tasks` main page - 6 hours
- [ ] Create critical API endpoints - 9 hours

### Week 2 (Est. 15-20 hours)
- [ ] Standardize navigation layouts - 1 hour
- [ ] Create consistent error components - 2 hours
- [ ] Add loading state indicators - 3 hours
- [ ] Create remaining API endpoints - 5 hours
- [ ] Mobile optimization - 4 hours

### Week 3 (Est. 10-15 hours)
- [ ] Add leaderboard system - 4 hours
- [ ] Add task analytics - 4 hours
- [ ] Performance optimization - 4 hours
- [ ] Final testing and bug fixes - 3 hours

---

## 🚀 QUICK START CODE TEMPLATES

### Template 1: New Page with Data Fetching
```tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import EmployeeLayout from '@/components/layout/employee-layout';
import { Card } from '@/components/ui/card';

export default function NewPage() {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/endpoint?startupId=' + session?.user.startupId);
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) fetchData();
  }, [session]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Page Title</h1>
        {/* Content here */}
      </div>
    </EmployeeLayout>
  );
}
```

### Template 2: API Endpoint
```ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Your logic here
    const data = await prisma.model.findMany({
      where: { startupId: session.user.startupId }
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    // Your logic here
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

---

## 📞 REFERENCE LINKS

**Database Schema:** `prisma/schema.prisma`  
**Authentication:** `lib/auth.ts`  
**Database Client:** `lib/db.ts`  
**Component Library:** `components/ui/`  
**Layouts:** `components/layout/`  

---

## 💡 TIPS & TRICKS

1. **Reuse Components:** Check existing pages for similar patterns
2. **Use Types:** Create TypeScript interfaces for data models
3. **Error Boundaries:** Wrap async operations in try-catch
4. **Session Checks:** Always verify `session` before using `session.user`
5. **Responsive Design:** Use Tailwind breakpoints (`md:`, `lg:`, etc.)
6. **Loading States:** Show spinner or skeleton while fetching
7. **API Consistency:** Return standardized response formats

---

**Total Estimated Time to 100% Completion:** 46-57 hours
