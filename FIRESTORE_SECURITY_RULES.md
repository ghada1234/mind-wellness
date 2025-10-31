# Firestore Security Rules

## ⚠️ Permission Error Fix

If you're getting "Missing or insufficient permissions" errors, you need to update your Firestore security rules.

---

## 🔧 Step 1: Go to Firebase Console

1. Open: https://console.firebase.google.com/project/mindfulflow-o3lmh/firestore/rules
2. Login with your Google account

---

## 🔧 Step 2: Update Security Rules

Paste these rules into the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Mood entries - users can read/write their own entries
    match /moodEntries/{entryId} {
      allow read, write: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Meal entries - users can read/write their own entries
    match /mealEntries/{entryId} {
      allow read, write: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Activity logs - users can read/write their own entries
    match /activityLog/{entryId} {
      allow read, write: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Sleep logs - users can read/write their own entries
    match /sleepLog/{entryId} {
      allow read, write: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Journal logs - users can read/write their own entries
    match /journalLog/{entryId} {
      allow read, write: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Meditation logs - users can read/write their own entries
    match /meditationLog/{entryId} {
      allow read, write: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Breathing logs - users can read/write their own entries
    match /breathingLog/{entryId} {
      allow read, write: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Saved meal plans - users can read/write their own plans
    match /savedMealPlans/{planId} {
      allow read, write: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🔧 Step 3: Publish Rules

1. Click **"Publish"** button
2. Wait for confirmation
3. Rules will be active immediately

---

## ✅ Test

After updating rules:
1. Sign in to your app
2. Try accessing the dashboard
3. Permission errors should be gone

---

## 🔒 Temporary: More Permissive Rules (For Testing Only)

If you want to test quickly, you can use more permissive rules (⚠️ NOT for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write all documents
    // ⚠️ WARNING: This is for testing only! Not secure for production.
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Remember to update to proper rules before going live!**

---

## 📚 Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/project/mindfulflow-o3lmh/firestore/rules)

