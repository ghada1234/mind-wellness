# 🌐 Custom Domain Deployment - www.find-your-inner-peace.com

## Complete Guide to Deploy Your App to Your Custom Domain

---

## 🚀 Step 1: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Login** or create account
3. **Click "Add New Project"**
4. **Import from GitHub**:
   - If you have a GitHub repo, import it
   - Or connect your local code

5. **Configure Build Settings**:
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `npm run build:vercel` or just `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

6. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyChEa5H8pa4jO2fhk5HVEGruX-5lQbZJac
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mindfulflow-o3lmh.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=mindfulflow-o3lmh
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mindfulflow-o3lmh.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1096732411136
   NEXT_PUBLIC_FIREBASE_APP_ID=1:1096732411136:web:ab158c0af0aef571bc5fe5
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6KVVT27CNX
   ```

7. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live on `your-app.vercel.app`

---

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
cd /Users/ghadaalani/Desktop/mind-main\ 6
vercel

# Deploy to production
vercel --prod
```

---

## 🌐 Step 2: Configure Custom Domain

### In Vercel Dashboard:

1. **Go to your project** on Vercel
2. **Click "Settings"** → **"Domains"**
3. **Click "Add"** or **"Add Domain"**
4. **Enter your domain**: `find-your-inner-peace.com`
5. **Click "Add"**

### Vercel will show you DNS records to add:

**Option 1: A Record (Simplest)**
```
Type: A
Name: @ (or blank)
Value: 76.76.21.21
```

**Option 2: CNAME Record (Recommended)**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Option 3: CNAME for root domain**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

---

## 🔧 Step 3: Update DNS Settings

### Where to Update DNS:

**Your Domain Registrar** (where you bought the domain):
- GoDaddy
- Namecheap
- Cloudflare
- Google Domains
- etc.

### DNS Configuration:

1. **Login to your domain registrar**
2. **Find "DNS Management"** or **"DNS Settings"**
3. **Add/Update DNS Records**:

#### For www.find-your-inner-peace.com:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

#### For find-your-inner-peace.com (root domain):
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**OR** (if your registrar supports it):
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

---

## 🔒 Step 4: SSL/HTTPS Configuration

Vercel automatically provides **free SSL certificates** via Let's Encrypt:

1. **After adding domain**, Vercel will automatically:
   - Provision SSL certificate
   - Configure HTTPS
   - Set up automatic renewal

2. **Wait 5-10 minutes** for DNS propagation and SSL provisioning

3. **Verify SSL**:
   - Visit `https://www.find-your-inner-peace.com`
   - You should see the padlock icon ✅

---

## 🔥 Step 5: Update Firebase Configuration

### Add Your Domain to Firebase:

1. **Go to Firebase Console**:
   https://console.firebase.google.com/project/mindfulflow-o3lmh/authentication/settings

2. **Authorized Domains**:
   - Scroll down to **"Authorized domains"**
   - You should see:
     - `localhost`
     - `mindfulflow-o3lmh.firebaseapp.com`
   
3. **Add Your Custom Domain**:
   - Click **"Add domain"**
   - Enter: `www.find-your-inner-peace.com`
   - Click **"Add"**
   
4. **Also add root domain** (without www):
   - Click **"Add domain"** again
   - Enter: `find-your-inner-peace.com`
   - Click **"Add"**

---

## ✅ Step 6: Verify Deployment

### Checklist:

- [ ] **Domain resolves**: `https://www.find-your-inner-peace.com` loads
- [ ] **HTTPS works**: Padlock icon appears
- [ ] **Sign up works**: Test at `/auth/sign-up`
- [ ] **Sign in works**: Test at `/auth/sign-in`
- [ ] **Firebase connected**: Users can authenticate
- [ ] **Analytics works**: `/dashboard/analytics-admin` loads
- [ ] **PWA works**: Can install app
- [ ] **All features**: Test meditation, journal, mood tracking

---

## 🧪 Testing Your Deployment

### Test URLs:

1. **Homepage**: `https://www.find-your-inner-peace.com`
2. **Sign Up**: `https://www.find-your-inner-peace.com/auth/sign-up`
3. **Sign In**: `https://www.find-your-inner-peace.com/auth/sign-in`
4. **Dashboard**: `https://www.find-your-inner-peace.com/dashboard`
5. **Analytics**: `https://www.find-your-inner-peace.com/dashboard/analytics-admin`

### Test on Mobile:

- Open `https://www.find-your-inner-peace.com` on your phone
- Try installing as PWA
- Test all features

---

## 🔄 Step 7: Automatic Updates

### Git Integration (Recommended):

1. **Connect GitHub repo** to Vercel
2. **Automatic deployments**:
   - Push to `main` branch → Production deploy
   - Push to other branches → Preview deploy
3. **No manual deployment needed**!

### Manual Deployment:

```bash
# From your project directory
vercel --prod
```

---

## 📊 Monitoring Your Live Site

### Vercel Dashboard:
- **Deployments**: View all deployments
- **Analytics**: Traffic and performance
- **Logs**: Error logs and debugging
- **Domains**: Domain status and SSL

### Firebase Console:
- **Users**: https://console.firebase.google.com/project/mindfulflow-o3lmh/authentication/users
- **Analytics**: https://console.firebase.google.com/project/mindfulflow-o3lmh/analytics
- **Database**: https://console.firebase.google.com/project/mindfulflow-o3lmh/firestore

---

## 🐛 Troubleshooting

### Domain Not Resolving:

**Problem**: `www.find-your-inner-peace.com` shows "DNS Error"
**Solution**:
1. Wait 24-48 hours for DNS propagation
2. Check DNS records are correct
3. Use `dig www.find-your-inner-peace.com` to verify
4. Check Vercel dashboard for DNS status

### SSL Certificate Issues:

**Problem**: "Not Secure" warning
**Solution**:
1. Wait 10-15 minutes after adding domain
2. Check Vercel dashboard → Domains → SSL status
3. Ensure DNS is correctly configured
4. Try clearing browser cache

### Firebase Authentication Not Working:

**Problem**: Can't sign in on custom domain
**Solution**:
1. Verify domain is added to Firebase authorized domains
2. Check Firebase console → Authentication → Settings
3. Ensure both `www` and non-`www` versions are added
4. Wait a few minutes for changes to propagate

### Build Errors:

**Problem**: Deployment fails
**Solution**:
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Test build locally: `npm run build`
4. Check for TypeScript/ESLint errors

---

## 🎯 Quick Deploy Commands

```bash
# 1. Make sure you're in the project directory
cd "/Users/ghadaalani/Desktop/mind-main 6"

# 2. Install dependencies (if not done)
npm install

# 3. Test build locally
npm run build

# 4. Deploy to Vercel
vercel --prod

# 5. Add custom domain (if not done via dashboard)
# Go to Vercel dashboard → Settings → Domains → Add domain
```

---

## 📱 PWA Configuration for Custom Domain

Your PWA should work automatically with custom domain. Verify:

1. **Manifest.json** uses correct domain
2. **Service worker** works (if you have one)
3. **Install prompt** works on mobile browsers
4. **Offline functionality** (if implemented)

---

## 🚀 Expected Timeline

- **DNS Propagation**: 5 minutes - 48 hours (usually < 1 hour)
- **SSL Provisioning**: 5-15 minutes after DNS resolves
- **First Deployment**: 2-3 minutes
- **Firebase Domain Add**: Instant (takes effect in ~1 minute)

**Total Time**: Usually 15-30 minutes, up to 48 hours in rare cases

---

## 💰 Cost

**Vercel**: 
- ✅ Free tier includes custom domains
- ✅ Free SSL certificates
- ✅ Unlimited deployments

**Domain**:
- ✅ You already own it
- ✅ Just need to configure DNS

**Total**: $0/month for hosting! 🎉

---

## ✨ Post-Deployment Checklist

- [ ] Domain resolves correctly
- [ ] HTTPS works (SSL certificate active)
- [ ] Firebase authentication works
- [ ] All pages load correctly
- [ ] PWA install works
- [ ] Analytics tracking works
- [ ] Mobile responsive
- [ ] Test sign up / sign in
- [ ] Test all app features
- [ ] Monitor for errors

---

## 📞 Need Help?

### Vercel Support:
- Dashboard → Help Center
- Docs: https://vercel.com/docs

### DNS Issues:
- Contact your domain registrar support
- Or use Cloudflare for better DNS management (free)

### Firebase Issues:
- Firebase Console → Support
- Docs: https://firebase.google.com/docs

---

## 🎉 Success!

Once everything is configured:
- ✅ Your app is live on `www.find-your-inner-peace.com`
- ✅ HTTPS is automatically configured
- ✅ Users can sign up and use the app
- ✅ Analytics tracking your 285+ users
- ✅ PWA works for mobile installs

---

**Your deployment URL**: `https://www.find-your-inner-peace.com`

**Ready to deploy? Follow the steps above!** 🚀

