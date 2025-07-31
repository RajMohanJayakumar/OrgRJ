# 🔧 Arcade Games Troubleshooting Guide

## 🚨 **Common Issues and Solutions**

### **Issue: Empty Page on Browser**

**Symptoms**: Browser shows blank page when accessing `/arcade`

**Possible Causes & Solutions**:

#### **1. JSX File Extension Issue**

- **Problem**: React components with JSX content must have `.jsx` extension
- **Solution**: Ensure all files with JSX content use `.jsx` extension
- **Check**: `src/modules/arcade-games/hooks/useMobileControls.jsx`

#### **2. Import Path Issues**

- **Problem**: Imports pointing to wrong file extensions
- **Solution**: Update imports to include `.jsx` extension

```javascript
// ❌ Wrong
import useMobileControls from "../hooks/useMobileControls";

// ✅ Correct
import useMobileControls from "../hooks/useMobileControls.jsx";
```

#### **3. Vite Cache Issues**

- **Problem**: Vite caching old imports
- **Solution**: Restart development server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

#### **4. Module Import Errors**

- **Problem**: Missing or incorrect module exports
- **Solution**: Check `src/modules/arcade-games/index.js` exports

### **Issue: Port Mismatch (5174 vs 5173)**

**Symptoms**: Browser trying to access wrong port

**Solutions**:

1. **Check Vite Config**: Ensure port is set to 5173
2. **Clear Browser Cache**: Hard refresh (Ctrl+Shift+R)
3. **Check Running Processes**: Ensure no other dev server on 5174

### **Issue: Missing Icon Errors**

**Symptoms**: Console errors about missing apple-touch-icon.svg

**Solutions**:

1. **Add Missing Icon**: Create or add the icon file to `public/`
2. **Update Manifest**: Check `public/manifest.json` for correct icon paths
3. **Ignore Warning**: This doesn't affect functionality

### **Issue: Mobile Controls Not Working**

**Symptoms**: Touch controls not responding on mobile

**Solutions**:

1. **Check Mobile Detection**: Verify `useMobileControls` hook
2. **Touch Events**: Ensure `preventDefault()` is called
3. **CSS Touch**: Add `touch-action: none` to game areas

### **Issue: Games Not Loading**

**Symptoms**: Individual games show loading screen indefinitely

**Solutions**:

1. **Check Lazy Loading**: Verify React.Suspense fallbacks
2. **Import Errors**: Check game component imports
3. **Component Exports**: Ensure games export default components

### **Issue: Maximum Update Depth Exceeded**

**Symptoms**: Console error "Maximum update depth exceeded" in useHighScore hook

**Solutions**:

1. **Check useEffect Dependencies**: Ensure no circular dependencies in hooks
2. **Stable Callbacks**: Use functional state updates to avoid dependency loops
3. **Remove Auto-save**: Disable problematic auto-save logic that causes infinite loops
4. **Fixed in v1.1**: This issue has been resolved in the current version

## 🔍 **Debugging Steps**

### **Step 1: Check Console**

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Look for import/module errors

### **Step 2: Verify File Structure**

```
src/modules/arcade-games/
├── hooks/
│   └── useMobileControls.jsx  ✅ Must be .jsx
├── games/
│   ├── SnakeGame.jsx
│   ├── BubblePopGame.jsx
│   └── ...
└── components/
    └── ArcadeGamesModule.jsx
```

### **Step 3: Check Imports**

Verify all imports use correct paths and extensions:

```javascript
// In game files
import useMobileControls from "../hooks/useMobileControls.jsx";

// In index.js
export { default as useMobileControls } from "./hooks/useMobileControls.jsx";
```

### **Step 4: Test Route Detection**

```javascript
// In browser console
console.log(window.location.pathname);
// Should show '/arcade'
```

## 🛠️ **Development Commands**

### **Restart Development Server**

```bash
# Stop current server (Ctrl+C or Cmd+C)
npm run dev
```

### **Clear Vite Cache**

```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### **Check Build**

```bash
# Test production build
npm run build
npm run preview
```

## 📱 **Mobile Testing**

### **Chrome DevTools Mobile Simulation**

1. Open DevTools (F12)
2. Click device toggle icon
3. Select mobile device
4. Test touch controls

### **Real Device Testing**

1. Get local network IP from Vite output
2. Access `http://[IP]:5173/arcade` on mobile
3. Test touch interactions

## 🔧 **Quick Fixes**

### **Fix 1: Restart Everything**

```bash
# Kill all node processes
pkill -f node

# Start fresh
npm run dev
```

### **Fix 2: Clear Browser Data**

1. Open DevTools
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### **Fix 3: Check Network Tab**

1. Open DevTools Network tab
2. Reload page
3. Look for failed requests (red entries)

## 📞 **Getting Help**

### **Error Information to Collect**

1. **Browser Console Errors**: Full error messages
2. **Network Requests**: Failed requests in Network tab
3. **File Structure**: Verify all files exist
4. **Import Paths**: Check all import statements

### **Common Error Messages**

- `Cannot resolve module`: Import path issue
- `Unexpected token '<'`: JSX in .js file
- `Module not found`: Missing file or wrong path
- `Failed to fetch`: Network/server issue
- `Maximum update depth exceeded`: Infinite loop in useEffect/useState (Fixed in v1.1)

## ✅ **Verification Checklist**

- [ ] Development server running on port 5173
- [ ] No console errors in browser
- [ ] `/arcade` route loads arcade menu
- [ ] Individual games load when clicked
- [ ] Mobile controls appear on mobile devices
- [ ] Touch interactions work properly
- [ ] Sound effects play (if enabled)
- [ ] High scores save and load

## 🎯 **Success Indicators**

When everything is working correctly:

- ✅ Arcade menu loads with game categories
- ✅ Classic games section shows 4 games
- ✅ Stress Relief section shows 4 games
- ✅ Games load without errors
- ✅ Mobile controls appear on mobile
- ✅ Touch interactions work smoothly
- ✅ No console errors

---

**Remember**: The arcade games module is designed to be completely self-contained. If issues persist, you can always remove the entire module without affecting the main calculator functionality.
