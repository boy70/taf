# 👨‍💻 Developer Technical Reference - Enhanced Proposal System

## 📦 File Locations

**Employee Proposals Page:**
```
app/dashboard/employee/proposals/page.tsx (900+ lines)
```

**HR Proposals Review Page:**
```
app/dashboard/hr/proposals/page.tsx (550+ lines)
```

**API Endpoints:**
```
app/api/proposals/route.ts              (GET/POST)
app/api/proposals/[id]/route.ts         (GET/PUT/DELETE)
app/api/proposals/[id]/status/route.ts  (PUT - status updates)
app/api/proposals/[id]/comments/route.ts (POST/GET - comments)
```

---

## 🎨 Component Architecture

### ProposalGuide Component
```typescript
const ProposalGuide = ({ onClose }: { onClose: () => void }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  
  const pages = [
    { title, subtitle, icon, bgGradient, content }
  ]
  
  return (
    // Animated modal with book design
  )
}
```

**Key Props:**
- `onClose`: Function to call when closing guide

**State Management:**
- `currentPage`: 0-3 for 4 guide pages
- `isFlipping`: Boolean for flip animation state

### ProposalsPage Component
```typescript
export default function ProposalsPage() {
  // State for form, proposals, modals
  const [showForm, setShowForm] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [hasOpenedFormBefore, setHasOpenedFormBefore] = useState(false)
  const [formData, setFormData] = useState({ type, title, visibility, swot, smart })
  
  // Form handling
  const handleOpenForm = () => {
    setShowForm(true)
    if (!hasOpenedFormBefore) {
      setShowGuide(true)
      setHasOpenedFormBefore(true)
    }
  }
  
  const handleSubmitProposal = async (e) => {
    // POST to /api/proposals with canvasJson
  }
}
```

---

## 🔄 Data Flow

### Form Submission:
```typescript
const handleSubmitProposal = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const response = await fetch("/api/proposals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: formData.type,
      title: formData.title,
      visibility: formData.visibility,
      canvasJson: {
        swot: formData.swot,
        smart: formData.smart,
      },
      swotJson: formData.swot,
    }),
  })
  
  if (response.ok) {
    // Reset form
    setFormData(initialState)
    setShowForm(false)
    // Refresh proposals list
    fetchProposals()
  }
}
```

### API Response Structure:
```typescript
interface Proposal {
  id: string
  type: string
  title: string
  status: "submitted" | "approved" | "rejected" | "in_review"
  visibility: "ORG" | "HR_ONLY" | "PRIVATE"
  canvasJson: {
    swot: {
      strengths: string
      weaknesses: string
      opportunities: string
      threats: string
    }
    smart: {
      specific: string
      measurable: string
      achievable: string
      relevant: string
      timeBound: string
    }
  }
  submittedBy: User
  reviewer?: User
  comments: ProposalComment[]
  createdAt: Date
  updatedAt: Date
}
```

---

## 🎬 Animation Reference

### 3D Book Entrance:
```typescript
<motion.div
  initial={{ rotateY: -90, opacity: 0 }}
  animate={{ rotateY: 0, opacity: 1 }}
  exit={{ rotateY: 90, opacity: 0 }}
  transition={{ type: "spring", stiffness: 100, damping: 15 }}
  style={{ perspective: 1200 }}
>
```

### Page Flip Animation:
```typescript
<motion.div
  animate={{ rotateZ: isFlipping ? 5 : 0 }}
  transition={{ duration: 0.3 }}
>

// Content fade:
<motion.div
  key={currentPage}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.1 }}
>
```

### Floating Background Circles:
```typescript
<motion.div
  className="absolute w-80 h-80 bg-blue-300 rounded-full"
  animate={{ y: [0, -30, 0], x: [0, 30, 0] }}
  transition={{ duration: 15, repeat: Infinity }}
/>
```

### Button Interactions:
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleClick}
>
```

---

## 🎨 Tailwind Classes Reference

### SWOT Section Colors:
```
Strengths:    bg-green-50   border-green-200   focus:border-green-500
Weaknesses:   bg-yellow-50  border-yellow-200  focus:border-yellow-500
Opportunities: bg-blue-50   border-blue-200    focus:border-blue-500
Threats:      bg-red-50     border-red-200     focus:border-red-500
```

### SMART Section:
```
All fields:   bg-indigo-50  border-indigo-200  focus:border-indigo-500
```

### Guide Header Gradients:
```
Page 1: from-blue-600 to-indigo-600
Page 2: from-green-600 to-emerald-600
Page 3: from-purple-600 to-pink-600
Page 4: from-amber-600 to-orange-600
```

### Typography:
```
Headers:     text-3xl font-black (or 5xl for guide)
Labels:      text-sm font-bold
Placeholders: text-gray-600
Small text:  text-xs text-gray-600 italic
```

---

## 📱 Responsive Breakpoints

```typescript
// Mobile-first (< 768px)
- 1 column layout for SWOT (not 2x2)
- Full width SMART fields
- Guide full screen
- Touch-friendly padding

// Tablet (768px - 1024px)
- 2x2 SWOT grid visible
- 2-column SMART layout
- Guide centered with padding

// Desktop (> 1024px)
- Full 2x2 SWOT grid
- 2-column SMART with last spanning
- Guide with max-width-2xl
- Spacious margins and padding
```

### Grid Examples:
```typescript
// SWOT Grid
className="grid grid-cols-1 md:grid-cols-2 gap-4"

// SMART Grid
className="grid grid-cols-1 md:grid-cols-2 gap-4"

// Last SMART field (Time-bound)
className="md:col-span-2"

// Visibility Selector
className="grid grid-cols-1 md:grid-cols-3 gap-3"
```

---

## 🔍 Key Component Props

### Badge Component:
```typescript
<Badge
  className={`flex items-center gap-1 px-3 py-1.5 border ${getStatusColor(status)}`}
>
  {getStatusIcon(status)}
  {status.replace("_", " ").toUpperCase()}
</Badge>
```

### Button Component:
```typescript
<Button
  type="submit|button"
  onClick={handler}
  variant="default|outline"
  className="custom classes"
>
  Content
</Button>
```

### Motion Components:
```typescript
<motion.div
  initial={{ opacity, scale, rotate, y }}
  animate={{ opacity, scale, rotate, y }}
  exit={{ opacity, scale, rotate, y }}
  transition={{ duration, delay, type, stiffness }}
  whileHover={{ scale, rotate }}
  whileTap={{ scale }}
  onClick={handler}
>
```

---

## 🧪 Testing Checklist

### Functionality:
- [ ] Form opens with "New Proposal" button
- [ ] Guide auto-opens first time
- [ ] Guide has 4 pages with correct content
- [ ] Page navigation works (back/next/dots)
- [ ] "Start Creating 🚀" closes guide
- [ ] Form submits with all fields
- [ ] SWOT data captures correctly
- [ ] SMART data captures correctly
- [ ] Visibility selection works
- [ ] Proposals list displays submitted items

### Animations:
- [ ] Book entrance smooth (rotateY animation)
- [ ] Page flip smooth (rotation + content fade)
- [ ] Buttons scale on hover/tap
- [ ] Floating circles animate continuously
- [ ] Progress bar fills smoothly
- [ ] Content fades in with stagger

### Responsive:
- [ ] Mobile (< 768px) - single column, full screen
- [ ] Tablet (768-1024px) - 2 columns visible
- [ ] Desktop (> 1024px) - full layout with spacing
- [ ] Touch targets at least 44px (mobile)
- [ ] No horizontal scroll on any device

### Accessibility:
- [ ] Good color contrast (WCAG AA)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text for icons (via titles)
- [ ] Semantic HTML structure

### Performance:
- [ ] No layout shifts (CLS)
- [ ] 60fps animations
- [ ] Fast page transitions (< 400ms)
- [ ] Mobile performance acceptable

---

## 🔧 Common Customizations

### Change Guide Colors:
```typescript
// In pages array inside ProposalGuide component:
bgGradient: "from-purple-600 to-pink-600"  // Change gradient
```

### Adjust Animation Speeds:
```typescript
// In animation properties:
transition={{ duration: 0.3 }} // Reduce/increase duration
transition={{ type: "spring", stiffness: 150 }} // Adjust springiness
```

### Modify SWOT Placeholders:
```typescript
placeholder="Your custom text here"
```

### Change Form Grid Layout:
```typescript
className="grid grid-cols-1 md:grid-cols-2 gap-4"
// Change grid-cols-2 to grid-cols-3 for 3-column layout
```

---

## 📊 Bundle Impact

- **Framer Motion**: ~40KB (already in project)
- **Book Guide Code**: ~5KB
- **Animation CSS**: ~2KB
- **Total Impact**: ~7KB minified

---

## 🚀 Deployment Considerations

1. **No External Dependencies**: Uses only existing libraries
2. **No Database Migrations**: Works with existing proposal schema
3. **API Compatibility**: Works with existing API endpoints
4. **Type Safety**: Full TypeScript coverage
5. **Mobile Ready**: Progressive enhancement approach

---

## 📚 Related Files

- `prisma/schema.prisma` - Proposal model definition
- `lib/auth.ts` - Authentication logic
- `app/api/proposals/route.ts` - Main API endpoint
- `types/global.d.ts` - TypeScript type definitions

---

## 🎯 Future Enhancements

### Phase 2:
- [ ] Proposal templates (by type)
- [ ] Draft auto-save
- [ ] Collaborative editing
- [ ] Export to PDF

### Phase 3:
- [ ] AI suggestions for SWOT/SMART
- [ ] Similar proposals finder
- [ ] Voting/commenting system
- [ ] Public gallery of approved proposals

### Phase 4:
- [ ] Analytics dashboard
- [ ] Trend analysis
- [ ] Smart recommendations
- [ ] Integration with project management tools

---

## 📞 Troubleshooting Guide

### Issue: Guide not auto-opening
**Solution**: Check `hasOpenedFormBefore` state is tracking. Call `handleOpenForm()` instead of `setShowForm(true)`.

### Issue: Animations feeling jank
**Solution**: Check GPU acceleration. Add `will-change: transform` to animated elements if needed.

### Issue: Form data not submitting
**Solution**: Verify `canvasJson` structure matches API expectations. Check network tab for errors.

### Issue: SWOT colors not showing
**Solution**: Verify Tailwind CSS is compiled. Check for conflicting CSS classes.

### Issue: Mobile layout broken
**Solution**: Check grid breakpoints. Ensure `grid-cols-1 md:grid-cols-2` structure.

---

**Last Updated**: 2024  
**Maintained By**: Development Team  
**Status**: Production Ready ✅
