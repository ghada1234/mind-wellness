# 🚀 Quick Deploy to www.find-your-inner-peace.com

## Fastest Path to Deploy

### Prerequisites:
- [ ] Code is committed to Git
- [ ] Vercel account (free)
- [ ] Domain access (DNS settings)

---

## ⚡ Quick Deploy (5 minutes)

### Step 1: Push to GitHub

```bash
# If you don't have a GitHub repo yet
git init
git add .
git commit -m "Deploy to production"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repo
4. Click **"Deploy"**

### Step 3: Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyChEa5H8pa4jO2fhk5HVEGruX-5lQbZJac
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mindfulflow-o3lmh.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mindfulflow-o3lmh
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mindfulflow-o3lmh.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1096732411136
NEXT_PUBLIC_FIREBASE_APP_ID=1:1096732411136:web:ab158c0af0aef571bc5fe5
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6KVVT27CNX
```

### Step 4: Add Custom Domain

1. Vercel Dashboard → Settings → Domains
2. Click **"Add Domain"**
3. Enter: `find-your-inner-peace.com`
4. Click **"Add"**
5. Follow DNS instructions

### Step 5: Update DNS

In your domain registrar (GoDaddy, Namecheap, etc.):

```
Type: A Record
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 6: Add Domain to Firebase

1. Go to: https://console.firebase.google.com/project/mindfulflow-o3lmh/authentication/settings
2. Authorized domains → Add:
   - `www.find-your-inner-peace.com`
   - `find-your-inner-peace.com`

---

## ✅ Done!

Your app will be live at: **https://www.find-your-inner-peace.com**

Wait 5-15 minutes for DNS/SSL to propagate.

---

## 🔄 Update Existing Deployment

If you already have it deployed:

```bash
# Just push updates
git push origin main

# Or deploy manually
vercel --prod
```

---

## 📊 Verify It Works

1. Visit: https://www.find-your-inner-peace.com
2. Test sign up
3. Test sign in
4. Check analytics dashboard

---

**That's it!** 🎉

