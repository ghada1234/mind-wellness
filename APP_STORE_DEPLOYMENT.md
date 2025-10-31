# App Store Deployment Guide

## 📱 Deploy Mind Wellness to App Stores

This guide covers deploying your app to:
- **Google Play Store** (Android)
- **Samsung Galaxy Store** (Android)
- **Apple App Store** (iOS) - Coming Soon

---

## 🚀 Step 1: Prepare for Production Build

### Current Issue
The app uses Server Actions (`'use server'`) which are not compatible with static export needed for mobile. We need to handle this.

### Solution Options:

**Option A: Disable AI Features for Mobile (Quick Fix)**
- Move AI flows to API routes instead of Server Actions
- Or conditionally disable AI features in mobile build

**Option B: Use API Routes (Recommended)**
- Convert Server Actions to API routes
- These work with static export

**Option C: Hybrid Approach**
- Keep web version with Server Actions
- Use API routes for mobile build

---

## 📦 Step 2: Build for Android

### 2.1 Generate Signing Key

First, create a keystore to sign your app:

```bash
cd android/app

# Generate release keystore
keytool -genkey -v -keystore mind-wellness-release.keystore \
  -alias mind-wellness \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# You'll be prompted for:
# - Keystore password (SAVE THIS!)
# - Key password (SAVE THIS!)
# - Your name and organization details
```

⚠️ **CRITICAL**: Keep your keystore file and passwords secure! You'll need them for all future updates.

### 2.2 Configure Signing

Edit `android/app/build.gradle` and add your signing config:

```gradle
signingConfigs {
    release {
        storeFile file("mind-wellness-release.keystore")
        storePassword System.getenv("KEYSTORE_PASSWORD") ?: "YOUR_KEYSTORE_PASSWORD"
        keyAlias "mind-wellness"
        keyPassword System.getenv("KEY_PASSWORD") ?: "YOUR_KEY_PASSWORD"
    }
}

buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        signingConfig signingConfigs.release
    }
}
```

### 2.3 Build the App

```bash
# Build Next.js app for mobile
npm run build:mobile

# Or manually:
BUILD_TARGET=mobile next build && npx cap sync android

# Build release bundle (AAB - recommended for Play Store)
npm run cap:bundle:android

# Or build APK (for direct install or Samsung Galaxy Store)
npm run cap:build:android
```

**Output files:**
- **AAB**: `android/app/build/outputs/bundle/release/app-release.aab` (for Google Play)
- **APK**: `android/app/build/outputs/apk/release/app-release.apk` (for Samsung Galaxy Store)

---

## 🏪 Step 3: Deploy to Google Play Store

### 3.1 Create Google Play Console Account

1. Go to: https://play.google.com/console
2. Pay the one-time registration fee ($25)
3. Complete account setup

### 3.2 Create Your App

1. Click **"Create app"**
2. Fill in app details:
   - **App name**: Mind Wellness
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free
3. Accept terms and create

### 3.3 Complete Store Listing

Required information:
- **App icon**: 512x512px PNG
- **Feature graphic**: 1024x500px
- **Screenshots**: 
  - Phone: At least 2 screenshots
  - Tablet: Optional but recommended
- **Description**: App description
- **Short description**: Up to 80 characters
- **Privacy Policy URL**: Required for apps with user data

### 3.4 Upload App Bundle

1. Go to **Release** → **Production**
2. Click **"Create new release"**
3. Upload your AAB file: `android/app/build/outputs/bundle/release/app-release.aab`
4. Add **Release notes**
5. Review and **"Start rollout to production"**

### 3.5 Submit for Review

1. Complete all required sections
2. Submit for review
3. Review typically takes 1-3 days

---

## 🏪 Step 4: Deploy to Samsung Galaxy Store

### 4.1 Create Samsung Seller Portal Account

1. Go to: https://seller.samsungapps.com/
2. Register and verify seller account
3. Complete seller verification (may take 1-3 business days)

### 4.2 Submit Your App

1. Log in to Seller Portal
2. Click **"Add New Application"**
3. Upload **APK** file: `android/app/build/outputs/apk/release/app-release.apk`
4. Fill in app information:
   - App name, description, category
   - Screenshots and graphics
   - Privacy policy URL
5. Submit for review

### 4.3 Samsung Requirements

- **APK or AAB** format accepted
- App must target Android 8.0+ (API level 26+)
- Complete store listing required
- Privacy policy mandatory if collecting user data

---

## 📱 Step 5: Prepare App Assets

### Required Assets:

1. **App Icon**
   - 512x512px PNG
   - No transparency
   - Located at: `public/icon-512.png` (update if needed)

2. **Screenshots**
   - Phone: 16:9 or 9:16 ratio
   - Minimum 2, maximum 8
   - Recommend: Dashboard, Practice, Mood Tracker, Nutrition

3. **Feature Graphic** (Play Store)
   - 1024x500px
   - Promotional banner

4. **Privacy Policy**
   - Must be publicly accessible URL
   - Required if you collect user data (which you do via Firebase)

---

## ✅ Step 6: Pre-Submission Checklist

- [ ] App builds successfully without errors
- [ ] App icon is set (512x512px)
- [ ] Splash screen works correctly
- [ ] App ID is correct: `com.mindwellness.app`
- [ ] Version code and name are set (increment for each release)
- [ ] Keystore is created and secured
- [ ] Signing config is set up
- [ ] Privacy policy URL is ready
- [ ] Screenshots are prepared
- [ ] App description is written
- [ ] All features tested on real devices

---

## 🔄 Step 7: Update Version for New Releases

When releasing updates:

1. **Update version in `android/app/build.gradle`:**
```gradle
versionCode 2  // Increment by 1
versionName "1.0.1"  // Update version string
```

2. **Rebuild and upload new bundle/APK**

---

## 🐛 Troubleshooting

### Build Fails Due to Server Actions
**Issue**: Server Actions not compatible with static export
**Solution**: 
- Option 1: Move AI flows to API routes
- Option 2: Conditionally disable AI features in mobile build

### Keystore Issues
**Issue**: Forgot keystore password or lost keystore
**Solution**: You'll need to create a new keystore and app listing (Google Play doesn't allow keystore changes)

### Signing Errors
**Issue**: Gradle build fails with signing errors
**Solution**: Double-check keystore path, passwords, and alias in `build.gradle`

---

## 📚 Resources

- [Google Play Console](https://play.google.com/console)
- [Samsung Seller Portal](https://seller.samsungapps.com/)
- [Android App Bundle Guide](https://developer.android.com/guide/app-bundle)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)

---

## 🎯 Next Steps

1. Fix Server Actions compatibility issue
2. Generate signing keystore
3. Prepare app assets (icons, screenshots)
4. Build release bundle/APK
5. Create store listings
6. Submit for review

---

**Note**: For iOS deployment, you'll need:
- Apple Developer Account ($99/year)
- macOS computer (for building)
- Xcode installed
- iOS Capacitor setup (currently Android only)

