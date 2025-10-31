#!/bin/bash

# 🚀 Quick Deployment Script for www.find-your-inner-peace.com
# Run this script to prepare your code for deployment

echo "🚀 Starting Deployment Preparation..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from your project root."
    exit 1
fi

echo "✅ Project directory found"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Ready for deployment"
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
    echo "📝 Current status:"
    git status --short
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. DEPLOY TO VERCEL:"
echo "   Option A - Dashboard (Easiest):"
echo "   → Go to https://vercel.com"
echo "   → Click 'Add New Project'"
echo "   → Import from GitHub (or drag folder)"
echo ""
echo "   Option B - CLI:"
echo "   → npm install -g vercel"
echo "   → vercel login"
echo "   → vercel --prod"
echo ""
echo "2. ADD CUSTOM DOMAIN:"
echo "   → Vercel Dashboard → Settings → Domains"
echo "   → Add: find-your-inner-peace.com"
echo "   → Follow DNS instructions"
echo ""
echo "3. UPDATE FIREBASE:"
echo "   → https://console.firebase.google.com/project/mindfulflow-o3lmh/authentication/settings"
echo "   → Add: www.find-your-inner-peace.com"
echo ""
echo "📖 Full guide: See DEPLOY_NOW.md"
echo ""
echo "✨ Your code is ready for deployment!"
echo ""

