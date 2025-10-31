# 🚀 Deploy to www.find-your-inner-peace.com - Step by Step

## ✅ Pre-Deployment Checklist

- [x] Code is ready (build tested successfully)
- [ ] Git repository initialized
- [ ] Code committed to Git
- [ ] GitHub repository created (if using Git integration)

---

## 📦 Step 1: Prepare Your Code

### Initialize Git (if not done):

```bash
cd "/Users/ghadaalani/Desktop/mind-main 6"

# Check if git is initialized
git status

# If not, initialize:
git init
git add .
git commit -m "Ready for deployment"
```

---

## 🔗 Step 2: Connect to GitHub (Optional but Recommended)

### Option A: Create New GitHub Repo

1. **Go to GitHub**: https://github.com/new
2. **Create new repository**: 
   - Name: `mind-wellness-app` (or any name)
   - Make it **Private** (recommended)
   - Don't initialize with README
3. **Push your code**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Option B: Skip GitHub (Deploy Directly)

You can deploy directly from local code using Vercel CLI.

---

## 🚀 Step 3: Deploy to Vercel

### Method 1: Via Vercel Dashboard (Easiest)

1. **Go to Vercel**: https://vercel.com
2. **Login** or create account (free)
3. **Click "Add New Project"**
4. **Import Git Repository**:
   - If you pushed to GitHub, select your repo
   - Click "Import"
   
   **OR**
   
   **Drag & Drop**:
   - Click "Import Git Repository"
   - Drag your project folder (but GitHub is better)

5. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

6. **Add Environment Variables** (Click "Environment Variables"):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyChEa5H8pa4jO2fhk5HVEGruX-5lQbZJac
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mindfulflow-o3lmh.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=mindfulflow-o3lmh
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mindfulflow-o3lmh.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1096732411136
   NEXT_PUBLIC_FIREBASE_APP_ID=1:1096732411136:web:ab158c0af0aef571bc5fe5
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6KVVT27CNX
   ```

7. **Click "Deploy"**
   - Wait 2-3 minutes
   - Your app will be live at `your-app.vercel.app`

---

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from project directory
cd "/Users/ghadaalani/Desktop/mind-main 6"
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? mind-wellness (or any name)
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## 🌐 Step 4: Add Custom Domain

### In Vercel Dashboard:

1. **Go to your project** on Vercel
2. **Click "Settings"** → **"Domains"**
3. **Click "Add Domain"**
4. **Enter**: `find-your-inner-peace.com`
5. **Click "Add"**

Vercel will show you DNS instructions.

### Update DNS at Your Domain Registrar:

#### Option A: CNAME (Recommended for www)

In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

#### Option B: A Record (For root domain)

```
Type: A
Name: @ (or blank)
Value: 76.76.21.21
TTL: 3600
```

**Or both** (recommended):
- **A Record** for `find-your-inner-peace.com` (root)
- **CNAME** for `www.find-your-inner-peace.com`

---

## ⏱️ Step 5: Wait for DNS & SSL

After updating DNS:

1. **Wait 5-15 minutes** for DNS propagation
2. **Wait 5-10 minutes** for SSL certificate (automatic)
3. **Check status** in Vercel Dashboard → Domains

You'll see:
- ✅ **Valid Configuration** - DNS is correct
- ⏳ **Provisioning Certificate** - SSL in progress
- ✅ **Ready** - Everything working!

---

## 🔥 Step 6: Update Firebase

1. **Go to Firebase Console**:
   https://console.firebase.google.com/project/mindfulflow-o3lmh/authentication/settings

2. **Authorized Domains**:
   - Scroll to "Authorized domains"
   - Click "Add domain"
   - Enter: `www.find-your-inner-peace.com`
   - Click "Add"
   - Repeat for: `find-your-inner-peace.com` (without www)

---

## ✅ Step 7: Verify Deployment

### Test These URLs:

1. **Homepage**: `https://www.find-your-inner-peace.com`
2. **Sign Up**: `https://www.find-your-inner-peace.com/auth/sign-up`
3. **Sign In**: `https://www.find-your-inner-peace.com/auth/sign-in`
4. **Dashboard**: `https://www.find-your-inner-peace.com/dashboard`
5. **Analytics**: `https://www.find-your-inner-peace.com/dashboard/analytics-admin`

### Test Checklist:

- [ ] Site loads correctly
- [ ] HTTPS padlock appears ✅
- [ ] Sign up works
- [ ] Sign in works
- [ ] Dashboard loads
- [ ] Analytics page works
- [ ] PWA install works (mobile)
- [ ] All features functional

---

## 🔄 Step 8: Automatic Updates

Once connected to GitHub:

- ✅ **Every push to `main` branch** → Auto-deploys to production
- ✅ **Pull requests** → Preview deployments
- ✅ **No manual deployment needed!**

### Manual Deployment:

```bash
vercel --prod
```

---

## 🐛 Troubleshooting

### Domain Not Working:

**Problem**: Site doesn't load
**Solution**:
- Wait longer (DNS can take up to 48 hours)
- Check DNS records are correct
- Verify in Vercel dashboard → Domains → Check DNS

### SSL Certificate Not Ready:

**Problem**: "Not Secure" warning
**Solution**:
- Wait 10-15 minutes after adding domain
- Check Vercel dashboard → Domains → SSL status
- Ensure DNS is correctly configured

### Build Errors:

**Problem**: Deployment fails
**Solution**:
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Test build locally: `npm run build`

### Firebase Auth Not Working:

**Problem**: Can't sign in on custom domain
**Solution**:
- Verify domain is in Firebase authorized domains
- Check both `www` and non-`www` versions are added
- Wait a few minutes for changes to propagate

---

## 📊 Post-Deployment

### Monitor Your Site:

1. **Vercel Dashboard**:
   - View deployments
   - Check analytics
   - Monitor errors

2. **Firebase Console**:
   - Monitor users: https://console.firebase.google.com/project/mindfulflow-o3lmh/authentication/users
   - Check analytics: https://console.firebase.google.com/project/mindfulflow-o3lmh/analytics

3. **Your Analytics Page**:
   - `https://www.find-your-inner-peace.com/dashboard/analytics-admin`

---

## 🎉 Success!

Once everything is configured:
- ✅ App is live on `www.find-your-inner-peace.com`
- ✅ HTTPS automatically configured
- ✅ Firebase authentication working
- ✅ All features accessible
- ✅ Analytics tracking your users

---

## 🚀 Quick Command Reference

```bash
# Deploy to Vercel
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs

# Remove deployment (if needed)
vercel remove
```

---

## 📞 Need Help?

- **Vercel Support**: Dashboard → Help
- **Vercel Docs**: https://vercel.com/docs
- **Firebase Docs**: https://firebase.google.com/docs

---

**Ready? Start with Step 1!** 🚀

