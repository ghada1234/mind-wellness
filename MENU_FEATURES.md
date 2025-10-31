# 📋 Menu Features - Sidebar Navigation

## 📊 **Current Menu Structure**

### **Main Navigation** (Primary Features)

| Icon | Feature | Route | Description |
|------|---------|-------|-------------|
| 📊 | **Dashboard** | `/dashboard` | Main dashboard with stats and overview |
| 🧠 | **Practice** | `/dashboard/practice` | Combined Breathing, Meditation, Mindfulness |
| 🛌 | **Sleep** | `/dashboard/sleep` | Sleep tracking and logs |
| 🏃 | **Activity** | `/dashboard/activity` | Activity and workout tracking |
| 🍎 | **Nutrition** | `/dashboard/nutrition` | Food and nutrition logging |
| 😊 | **Mood** | `/dashboard/mood` | Mood tracking and emotional wellness |
| 📔 | **Journal** | `/dashboard/journal` | Journal entries and notes |

---

### **Secondary Navigation** (Additional Features)

| Icon | Feature | Route | Description |
|------|---------|-------|-------------|
| ❤️ | **Self Love** | `/dashboard/self-love` | Self-care and self-love activities |
| 🔔 | **Reminders** | `/dashboard/reminders` | Set reminders and notifications (shows badge count) |
| 💧 | **Water Log** | `/dashboard/water` | Track daily water intake |
| ✨ | **AI Hub** | `/dashboard/ai-hub` | AI-powered wellness assistant |
| 💗 | **Wellness Report** | `/dashboard/wellness-report` | Comprehensive wellness analytics |
| 📈 | **User Analytics** | `/dashboard/analytics-admin` | Admin analytics dashboard |

---

## 🎯 **Feature Details**

### **1. Dashboard** (`/dashboard`)
- **Purpose**: Main overview page
- **Features**:
  - Sleep statistics
  - Nutrition calories
  - Activity minutes
  - Mood tracking
  - Water intake
  - Daily goals
  - Recent logs
  - Activity feed

### **2. Practice** (`/dashboard/practice`)
- **Purpose**: Combined wellness practices
- **Features**:
  - **Breathing Tab**: Breathing exercises and timer
  - **Meditation Tab**: Guided meditations and timer
  - **Mindfulness Tab**: Mindfulness resources and exercises

### **3. Sleep** (`/dashboard/sleep`)
- **Purpose**: Track sleep patterns
- **Features**:
  - Sleep log entries
  - Sleep duration tracking
  - Sleep quality metrics
  - Sleep history

### **4. Activity** (`/dashboard/activity`)
- **Purpose**: Track physical activity
- **Features**:
  - Workout logging
  - Activity minutes
  - Exercise tracking
  - Activity history

### **5. Nutrition** (`/dashboard/nutrition`)
- **Purpose**: Food and nutrition tracking
- **Features**:
  - Food logging
  - Calorie tracking
  - Meal planning
  - Nutrition history

### **6. Mood** (`/dashboard/mood`)
- **Purpose**: Track emotional wellness
- **Features**:
  - Mood logging
  - Emotional tracking
  - Mood history
  - Mood patterns

### **7. Journal** (`/dashboard/journal`)
- **Purpose**: Journal entries and notes
- **Features**:
  - Journal entries
  - Notes taking
  - Journal history

### **8. Self Love** (`/dashboard/self-love`)
- **Purpose**: Self-care activities
- **Features**:
  - Self-care tracking
  - Self-love exercises
  - Self-care history

### **9. Reminders** (`/dashboard/reminders`)
- **Purpose**: Set reminders and notifications
- **Features**:
  - Create reminders
  - Notification settings
  - Reminder history
  - **Badge**: Shows count of active reminders

### **10. Water Log** (`/dashboard/water`)
- **Purpose**: Track daily water intake
- **Features**:
  - Water intake logging
  - Daily water goals
  - Water intake history

### **11. AI Hub** (`/dashboard/ai-hub`)
- **Purpose**: AI-powered wellness assistant
- **Features**:
  - AI chat assistance
  - Wellness recommendations
  - Personalized advice

### **12. Wellness Report** (`/dashboard/wellness-report`)
- **Purpose**: Comprehensive wellness analytics
- **Features**:
  - Overall wellness metrics
  - Health insights
  - Progress tracking

### **13. User Analytics** (`/dashboard/analytics-admin`)
- **Purpose**: Admin analytics dashboard
- **Features**:
  - User statistics
  - Growth charts
  - Activity metrics
  - User management

---

## 📱 **Menu Features**

### **Sidebar Behavior**
- ✅ **Collapsible**: Sidebar can collapse/expand
- ✅ **Mobile Responsive**: Works on mobile devices
- ✅ **Active State**: Highlights current page
- ✅ **Badge Support**: Shows reminder count
- ✅ **Tooltips**: Shows labels on hover (when collapsed)
- ✅ **Client-Side Navigation**: Uses Next.js Link (no page reloads)

### **Sidebar Header**
- Logo (links to homepage)
- Clickable logo

### **Sidebar Footer**
- Currently empty (can be used for user profile/logout)

---

## 🔧 **Technical Details**

### **Navigation Arrays**
- **mainNav**: Primary navigation items (7 items)
- **secondaryNav**: Secondary navigation items (6 items)

### **Icons**
All icons use `lucide-react`:
- `LayoutDashboard` - Dashboard
- `BrainCircuit` - Practice
- `BedDouble` - Sleep
- `Activity` - Activity
- `Apple` - Nutrition
- `Smile` - Mood
- `BookText` - Journal
- `HeartHandshake` - Self Love
- `Bell` - Reminders
- `Droplets` - Water Log
- `Sparkles` - AI Hub
- `HeartPulse` - Wellness Report
- `BarChart3` - User Analytics

---

## 📊 **Available Pages (All Dashboard Routes)**

Based on file structure, these pages exist:

1. ✅ `/dashboard` - Main dashboard
2. ✅ `/dashboard/practice` - Combined practice page
3. ✅ `/dashboard/sleep` - Sleep tracking
4. ✅ `/dashboard/activity` - Activity tracking
5. ✅ `/dashboard/nutrition` - Nutrition tracking
6. ✅ `/dashboard/mood` - Mood tracking
7. ✅ `/dashboard/journal` - Journal
8. ✅ `/dashboard/self-love` - Self love
9. ✅ `/dashboard/reminders` - Reminders
10. ✅ `/dashboard/water` - Water log
11. ✅ `/dashboard/ai-hub` - AI Hub
12. ✅ `/dashboard/wellness-report` - Wellness report
13. ✅ `/dashboard/analytics-admin` - User analytics
14. ✅ `/dashboard/profile` - User profile (not in sidebar)
15. ⚠️ `/dashboard/breathing` - Breathing (now part of Practice)
16. ⚠️ `/dashboard/meditation` - Meditation (now part of Practice)
17. ⚠️ `/dashboard/mindfulness` - Mindfulness (now part of Practice)

---

## 🎨 **Menu Customization**

### **To Add a New Menu Item:**

1. **Add to Navigation Array** (`src/components/layout/sidebar-nav.tsx`):
```typescript
const mainNav = [
  // ... existing items
  { href: '/dashboard/new-feature', icon: NewIcon, label: 'New Feature' },
];
```

2. **Create the Page** (`src/app/dashboard/new-feature/page.tsx`)

3. **Add Icon Import** (if needed):
```typescript
import { NewIcon } from 'lucide-react';
```

### **To Remove a Menu Item:**

Simply remove it from the `mainNav` or `secondaryNav` array.

### **To Reorder Menu Items:**

Change the order of items in the `mainNav` or `secondaryNav` arrays.

---

## ✅ **Summary**

**Total Menu Items**: 13 features
- **Main Navigation**: 7 items
- **Secondary Navigation**: 6 items

**All features are accessible and working** ✅

