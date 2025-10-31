# 🚀 Quick Build Guide - Samsung Galaxy Store

## One-Time Setup (First Time Only)

### 1. Generate Keystore
```bash
cd android/app
keytool -genkey -v -keystore mind-wellness-release.keystore \
  -alias mind-wellness -keyalg RSA -keysize 2048 -validity 10000
```
💾 **Save your passwords securely!**

### 2. Configure Signing
Edit `android/app/build.gradle`:
- Uncomment the signing config
- Add your keystore path and passwords

### 3. Add Firebase (if needed)
Place `google-services.json` in `android/app/`

---

## Build Process (Every Release)

### Step 1: Update Version
Edit `android/app/build.gradle`:
```gradle
versionCode 1      // Increment for each release
versionName "1.0.0" // Update version string
```

### Step 2: Build
```bash
# Build web app and sync to Android
npm run build:mobile

# Build signed AAB for Samsung Store
npm run cap:bundle:android
```

### Step 3: Locate File
Your AAB file is at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Step 4: Upload to Samsung
1. Go to https://seller.samsungapps.com/
2. Select your app → Update Binary
3. Upload `app-release.aab`
4. Add release notes
5. Submit for review

---

## Testing Before Release

```bash
# Run on connected Samsung device
npm run cap:run:android

# Open in Android Studio for debugging
npm run cap:open:android
```

---

## Common Issues

**Build fails?**
```bash
cd android && ./gradlew clean && cd ..
npm run build:mobile
```

**Need to update after changes?**
```bash
npm run cap:sync
```

---

## File Sizes & Requirements

- **AAB File**: ~5-20 MB (recommended)
- **APK File**: ~10-30 MB (alternative)
- **Min Android**: 5.1 (API 22)
- **Target Android**: Latest (API 34)

---

## Pre-Submission Checklist

- [ ] Version code incremented
- [ ] App tested on Samsung device
- [ ] No crashes or errors
- [ ] Screenshots updated (if features changed)
- [ ] Release notes written
- [ ] Privacy policy accessible

---

## After Approval

- Monitor reviews and ratings
- Respond to user feedback
- Plan next update (bug fixes, features)
- Update every 1-2 months for better visibility

---

For full details, see: **SAMSUNG_STORE_DEPLOYMENT.md**



