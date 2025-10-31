# 📊 User Analytics Dashboard Guide

## Overview

Your Mind Wellness app now includes a comprehensive analytics dashboard that tracks user registrations, activity, and engagement metrics.

---

## 🎯 Features

### 1. **User Statistics**
- **Total Users**: All registered users
- **Today's Signups**: New users in the last 24 hours
- **Weekly Signups**: New users in the last 7 days
- **Active Today**: Users who logged in today

### 2. **Growth Charts**
- **30-Day User Growth**: Line chart showing daily new registrations
- **Cumulative Growth**: Total user count over time
- **Weekly Bar Chart**: Visual representation of recent signups

### 3. **User Management**
- **Recent Users Table**: Last 10 registered users
- **User Details**: Email, registration date, last active time
- **Status Badges**: Active/Inactive indicators

### 4. **Activity Tracking**
- **Feature Usage**: Track entries across:
  - Mood logs
  - Journal entries
  - Meditation sessions
  - Sleep logs
  - Water intake
- **Activity Charts**: Visual breakdown of feature engagement

---

## 🚀 How to Access

1. **Login** to your dashboard
2. Look in the sidebar for **"User Analytics"** (with bar chart icon)
3. Click to view the analytics dashboard

Or visit directly: `http://localhost:9002/dashboard/analytics-admin`

---

## 📈 How It Works

### Automatic Tracking

The app automatically tracks user activity through:

1. **User Registration**: When users sign up via Firebase Authentication
2. **User Activity**: Tracked every time a user logs in
3. **Last Active Time**: Updates every 5 minutes while user is active
4. **Feature Usage**: Counted from Firestore collections

### Data Storage

User metadata is stored in Firestore:

```
users/{userId}
├── email: string
├── createdAt: timestamp
└── lastActive: timestamp
```

### Real-time Updates

Click the **"Refresh Data"** button to reload the latest statistics.

---

## 📊 Dashboard Tabs

### **Overview Tab**
- 4 stat cards showing key metrics
- 30-day growth line chart
- Quick snapshot of user base health

### **Growth Tab**
- Detailed registration trends
- 14-day bar chart
- Monthly/weekly/daily breakdowns
- Active user counts

### **Users Tab**
- Recent users table
- Registration timestamps
- Last active information
- Activity status badges

### **Activity Tab**
- Feature usage statistics
- Engagement bar charts
- Total entries per feature
- Activity breakdown

---

## 🔧 Configuration

### Firestore Security Rules

Ensure your Firestore rules allow reading user metadata for admins:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admin access (add your admin user IDs)
      allow read: if request.auth != null && request.auth.uid in ['YOUR_ADMIN_UID'];
    }
  }
}
```

### Adding Admin Protection

To restrict analytics to admins only, update the page:

```typescript
// In analytics-admin/page.tsx
const ADMIN_EMAILS = ['admin@mindwellness.com', 'your-email@example.com'];

export default function AnalyticsAdminPage() {
  const { user } = useAuth();
  
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return <div>Access Denied</div>;
  }
  
  // ... rest of component
}
```

---

## 📱 Mobile Analytics (Samsung Store)

When deployed to Samsung Galaxy Store, the analytics will track:
- App installs (via Firebase Analytics)
- User registrations
- Daily active users (DAU)
- Monthly active users (MAU)
- Feature adoption rates

### Samsung-Specific Metrics

You can also access Samsung-specific analytics:
1. **Samsung Seller Portal**: https://seller.samsungapps.com/
2. View app-specific metrics:
   - Downloads
   - Active installs
   - Uninstalls
   - Ratings & reviews
   - Revenue (if applicable)

---

## 🎨 Customization

### Adding New Metrics

To track additional metrics, edit the analytics page:

```typescript
// Add custom stats
const [customStat, setCustomStat] = useState(0);

// Calculate in fetchUserAnalytics
const calculateCustomStat = async () => {
  // Your custom logic
  const result = await someCalculation();
  setCustomStat(result);
};
```

### Adding New Charts

Using Recharts library, you can add more visualizations:

```typescript
import { PieChart, Pie, Cell } from 'recharts';

<PieChart width={400} height={400}>
  <Pie
    data={yourData}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={150}
  />
</PieChart>
```

---

## 🔐 Security Best Practices

1. **Protect Admin Routes**: Add authentication checks
2. **Limit Data Exposure**: Don't expose sensitive user information
3. **Use Firestore Rules**: Implement proper security rules
4. **Log Access**: Track who views analytics
5. **GDPR Compliance**: Ensure analytics comply with privacy laws

### Example: Admin-Only Access

```typescript
// Create an admin check hook
export const useIsAdmin = () => {
  const { user } = useAuth();
  const ADMIN_EMAILS = ['admin@mindwellness.com'];
  return ADMIN_EMAILS.includes(user?.email || '');
};

// Use in analytics page
const isAdmin = useIsAdmin();
if (!isAdmin) return <AccessDenied />;
```

---

## 📊 Export Data

To export analytics data for reports:

```typescript
const exportToCSV = () => {
  const csv = recentUsers.map(user => 
    `${user.email},${user.createdAt},${user.lastActive}`
  ).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users-export.csv';
  a.click();
};
```

---

## 🐛 Troubleshooting

### No Users Showing

**Problem**: Dashboard shows 0 users
**Solution**: 
1. Ensure users have signed up through the app
2. Check Firestore to see if `users` collection exists
3. Verify Firestore security rules allow reading

### Charts Not Loading

**Problem**: Charts appear empty
**Solution**:
1. Click "Refresh Data" button
2. Check browser console for errors
3. Verify Recharts library is installed

### Permissions Error

**Problem**: "Permission denied" error
**Solution**:
1. Update Firestore security rules
2. Ensure user is authenticated
3. Check that user metadata exists in Firestore

---

## 📈 Firebase Console Analytics

For even more detailed analytics, use Firebase Console:

1. **Firebase Analytics**: https://console.firebase.google.com/project/mindfulflow-o3lmh/analytics
   - User engagement
   - Screen views
   - Events tracking
   - User demographics
   - Retention cohorts

2. **Firebase Authentication**: https://console.firebase.google.com/project/mindfulflow-o3lmh/authentication/users
   - Total user count
   - Sign-in methods
   - User list with emails
   - Last sign-in times

---

## 🚀 Advanced Features

### Real-Time Analytics

Add real-time updates using Firestore listeners:

```typescript
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'users'),
    (snapshot) => {
      const userCount = snapshot.size;
      setStats(prev => ({ ...prev, totalUsers: userCount }));
    }
  );
  return unsubscribe;
}, []);
```

### Email Reports

Set up automatic weekly email reports:

```typescript
// Using Firebase Cloud Functions
export const sendWeeklyReport = functions.pubsub
  .schedule('0 9 * * 1') // Every Monday at 9 AM
  .onRun(async (context) => {
    const stats = await calculateWeeklyStats();
    await sendEmail({
      to: 'admin@mindwellness.com',
      subject: 'Weekly User Report',
      body: generateReportHTML(stats)
    });
  });
```

---

## 📞 Support

For questions about analytics:
- Check Firebase Console first
- Review this guide
- Check browser console for errors
- Verify Firestore rules

---

## ✨ Next Steps

Consider adding:
- [ ] User retention analysis
- [ ] Funnel analytics (signup → first action)
- [ ] Feature adoption rates
- [ ] Geographic distribution
- [ ] Device/platform breakdown
- [ ] Session duration tracking
- [ ] Push notification analytics
- [ ] A/B testing metrics

---

**Last Updated**: October 2025  
**Feature Version**: 1.0.0

