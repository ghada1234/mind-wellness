# Deploy to Netlify

## 🚀 Quick Deploy to Netlify

Your app can be deployed to Netlify. Here's how:

---

## Option 1: Deploy via Netlify Dashboard (Easiest)

### Step 1: Push to GitHub

Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### Step 2: Connect to Netlify

1. Go to [netlify.com](https://www.netlify.com)
2. Sign up or log in
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect your GitHub account
5. Select your repository: `ghada1234/mind-wellness`
6. Netlify will auto-detect Next.js

### Step 3: Configure Build Settings

Netlify should auto-detect:
- **Build command**: `npm run build`
- **Publish directory**: `.next`

If not, set manually:
- Build command: `npm run build`
- Publish directory: `.next`

### Step 4: Add Environment Variables

Go to **Site settings** → **Environment variables** and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyChEa5H8pa4jO2fhk5HVEGruX-5lQbZJac
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mindfulflow-o3lmh.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mindfulflow-o3lmh
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mindfulflow-o3lmh.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1096732411136
NEXT_PUBLIC_FIREBASE_APP_ID=1:1096732411136:web:ab158c0af0aef571bc5fe5
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6KVVT27CNX
```

### Step 5: Deploy

Click **"Deploy site"** and wait for the build to complete.

---

## Option 2: Deploy via Netlify CLI

### Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Login to Netlify

```bash
netlify login
```

### Deploy

```bash
# Build the site first
npm run build

# Deploy
netlify deploy --prod
```

---

## 📝 Current Netlify Configuration

Your `netlify.toml` is already configured:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

This uses the Next.js Netlify plugin which handles Next.js routing automatically.

---

## 🔧 Custom Domain Setup

### Step 1: Add Domain in Netlify

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter: `www.find-your-inner-peace.com`
4. Follow DNS configuration instructions

### Step 2: Configure DNS

Add these DNS records to your domain provider:

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: Your Netlify site URL (e.g., `your-site.netlify.app`)

**For root domain (optional):**
- Type: `A`
- Name: `@`
- Value: Netlify IP (provided by Netlify)

---

## ⚠️ Important Notes

1. **AI Features**: Your AI flows use Server Actions (`'use server'`), which work with Netlify's Next.js plugin.

2. **Environment Variables**: Make sure all Firebase environment variables are set in Netlify.

3. **Build Settings**: Netlify will automatically detect Next.js and use the correct build settings.

4. **Both Platforms**: You can deploy to both Vercel AND Netlify - they won't conflict.

---

## 🔄 Continuous Deployment

Once connected to GitHub, Netlify will:
- Automatically deploy on every push to `main` branch
- Show deployment status in Netlify dashboard
- Send you notifications on deploy success/failure

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Netlify account created
- [ ] Site connected to GitHub repository
- [ ] Environment variables added
- [ ] Build settings configured
- [ ] First deployment successful
- [ ] Custom domain configured (if needed)
- [ ] Test all features on Netlify URL

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Verify environment variables are set
- Check `netlify.toml` configuration

### Routing Issues
- Netlify Next.js plugin handles routing automatically
- If issues persist, check plugin is installed

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new variables

---

## 📚 Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Netlify CLI](https://cli.netlify.com/)

