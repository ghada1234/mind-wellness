# 🚀 Vercel Deployment Guide - Mind Wellness

## Quick Deploy to Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build:vercel`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   In Vercel project settings, add these:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyChEa5H8pa4jO2fhk5HVEGruX-5lQbZJac
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mindfulflow-o3lmh.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=mindfulflow-o3lmh
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mindfulflow-o3lmh.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1096732411136
   NEXT_PUBLIC_FIREBASE_APP_ID=1:1096732411136:web:ab158c0af0aef571bc5fe5
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6KVVT27CNX
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app is live! 🎉

---

## Step 3: Deploy from CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Important: Update Firebase Configuration

After deploying, add your Vercel domain to Firebase:

### 1. Add Authorized Domain
1. Go to: https://console.firebase.google.com/project/mindfulflow-o3lmh/authentication/settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add your Vercel domain (e.g., `mind-wellness.vercel.app`)

### 2. Update CORS Settings (if using Cloud Functions)
Add your Vercel URL to allowed origins

---

## Troubleshooting

### Build Fails

**Error: "output: export" not compatible**
- Solution: Already fixed! The config now only exports for mobile builds
- Vercel uses standard Next.js build

### Environment Variables Not Working

**Error: Firebase not connecting**
- Check that all environment variables are added in Vercel dashboard
- Variables must start with `NEXT_PUBLIC_` to be accessible in browser

### Analytics Shows Zero

**Users not appearing**
- This is normal for a fresh deployment
- Users need to sign up and log in
- Data will appear after first user activity

---

## Post-Deployment Checklist

- [ ] Test sign up: `https://your-app.vercel.app/auth/sign-up`
- [ ] Test sign in: `https://your-app.vercel.app/auth/sign-in`
- [ ] Check analytics: `https://your-app.vercel.app/dashboard/analytics-admin`
- [ ] Verify Firebase connection
- [ ] Test all features
- [ ] Set up custom domain (optional)

---

## Custom Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Add custom domain to Firebase authorized domains

---

## Performance Tips

1. **Enable Vercel Analytics** (free)
   - Go to project settings → Analytics
   - Monitor performance metrics

2. **Enable Speed Insights**
   - Real user monitoring
   - Core Web Vitals tracking

3. **Set up Preview Deployments**
   - Automatic deploys for pull requests
   - Test before merging

---

## Monitoring

### Vercel Dashboard
- View deployment logs
- Monitor traffic
- Check error rates

### Firebase Console
- Monitor authentication
- Check database usage
- View analytics

---

## Updates & Redeployment

Every time you push to GitHub:
- Vercel automatically redeploys
- Takes ~2-3 minutes
- No downtime

Manual redeploy:
```bash
vercel --prod
```

---

## Cost

- **Vercel Free Tier includes:**
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Automatic HTTPS
  - Preview deployments
  - Analytics

- **Firebase Free Tier includes:**
  - 50k reads/day
  - 20k writes/day
  - 1 GB storage
  - Authentication

Both are FREE for most apps!

---

## Your Deployment URLs

After deploying, you'll get:
- **Production**: `https://your-app.vercel.app`
- **Preview**: `https://your-app-git-branch.vercel.app` (for each branch)

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Ready to deploy? Just push to GitHub and connect on Vercel!** 🚀

