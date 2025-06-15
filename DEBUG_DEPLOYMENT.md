# 🔍 **Deployment Debugging Guide**

## **Issue**: Empty Screen at https://thefmsmkt-kiosk-runcit-veteran.web.app

### **Possible Causes & Solutions**

#### **1. Environment Variables Missing**
The application may be failing because production environment variables are not set.

**Solution**: Check if these variables are available in production:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_GEMINI_API_KEY`

#### **2. Console Error Check**
Open browser developer tools (F12) and check:
1. **Console tab** for JavaScript errors
2. **Network tab** for failed resource loads
3. **Elements tab** to see if `<div id="root">` is empty

#### **3. Firebase Project Configuration**
Ensure Firebase project is properly configured:
1. Firebase hosting is enabled
2. Firestore is properly set up
3. Project ID matches the configuration

#### **4. Manual Test Commands**

```bash
# Test local build
npm run build
npm run preview

# Check if local preview works at http://localhost:4173
```

#### **5. Environment Variable Setup for Production**

You need to either:

**Option A: Set environment variables in Firebase**
```bash
# Use Firebase functions config (if using functions)
firebase functions:config:set app.gemini_key="your_actual_gemini_key"
firebase functions:config:set app.firebase_key="your_actual_firebase_key"
```

**Option B: Create production build with embedded keys**
```bash
# Create production environment file
# Copy .env.example to .env.production
# Set actual production keys in .env.production
```

**Option C: Use Firebase Environment Config**
```bash
# In Firebase Console -> Project Settings -> General
# Set Web app configuration with actual keys
```

### **Quick Fix Test**

Try visiting the website and:
1. Press F12 to open developer tools
2. Go to Console tab
3. Look for error messages
4. Check if `Warning: Missing environment variables` appears

### **Expected Behavior**

The website should show:
1. **Blue theme background** (--theme-bg-deep-space: #112C70)
2. **Login screen** with email/password form
3. **No console errors** (warnings about missing API keys are OK)

If you see a completely blank white/blue screen, there's likely a critical JavaScript error preventing the React app from mounting.

### **Current Status**

✅ Build successful (1771 modules transformed)  
✅ Firebase deployment successful  
❌ Website showing empty screen  
❓ Need to check browser console for errors  

### **Next Steps**

1. Check browser console for JavaScript errors
2. Verify Firebase project configuration matches
3. Set production environment variables if needed
4. Test with a minimal configuration

The application should work even without API keys (with warning messages) - it shouldn't show a completely empty screen.
