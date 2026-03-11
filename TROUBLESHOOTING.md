# Testing and Troubleshooting Guide - Profile Display Issue

## Quick Fix Steps

### Option 1: Use Test Login Page (Recommended)
1. **Open**: `c:\Users\Shyamnandhan S P\Desktop\LOVEABLE BIKER\login\test-login.html` in your browser
2. **Update password**: Edit line 76 in test-login.html to match your actual password
3. **Click**: "🚀 Test Login & Redirect" button
4. **Result**: Should redirect to create trip page with your name displayed

### Option 2: Login Through Regular Login Page
1. **Open**: http://localhost:3001
2. **Login with**:
   - Username: `shyam`
   - Password: (your password)
3. **Watch console**: Press F12 → Console tab to see debug logs
4. **Check**: After redirect, you should see "Shyamnandhan SP" with initial "S"

### Option 3: Manual Session Test (Browser Console)
1. **Open**: http://localhost:8082 (Create Trip page)
2. **Press F12** → Console tab
3. **Paste and run**:
```javascript
// Set test user data
sessionStorage.setItem('userData', JSON.stringify({
  name: "Shyamnandhan SP",
  username: "shyam"
}));

// Reload page to see changes
location.reload();
```
4. **Result**: Should show "Shyamnandhan SP" with initial "S"

## Debug Information

### Check What's Stored in Session
Open browser console (F12) on create trip page and run:
```javascript
console.log('Session data:', sessionStorage.getItem('userData'));
```

### Expected Output:
```json
{"name":"Shyamnandhan SP","username":"shyam"}
```

### Clear Session (if corrupted):
```javascript
sessionStorage.clear();
location.reload();
```

## Common Issues & Solutions

### Issue 1: Shows "Traveler" instead of actual name
**Cause**: Session data not set or corrupted
**Solution**: 
- Logout and login again
- Use test-login.html to set session properly
- Check console for error messages

### Issue 2: Profile dropdown not showing
**Cause**: JavaScript error or component not rendering
**Solution**:
- Check browser console for errors
- Refresh the page (Ctrl + F5)
- Clear browser cache

### Issue 3: Redirect not working after login
**Cause**: Create trip server not running on port 8082
**Solution**:
```bash
cd "c:\Users\Shyamnandhan S P\Desktop\LOVEABLE BIKER\createtrip"
npm run dev
```

## Console Debug Logs

After implementing the fixes, you should see these logs:

### On Login Page (localhost:3001):
```
Login successful! User data: {name: "Shyamnandhan SP", username: "shyam"}
User data stored in sessionStorage
Redirecting to create trip page...
```

### On Create Trip Page (localhost:8082):
```
Session userData: {"name":"Shyamnandhan SP","username":"shyam"}
Parsed user: {name: "Shyamnandhan SP", username: "shyam"}
Setting userName to: Shyamnandhan SP
```

## Files Modified

1. **ChatPage.tsx** - Added console logs for debugging
2. **script.js** - Added console logs for login process
3. **test-login.html** - NEW: Quick test utility

## Password Note

The test-login.html file uses password `test123` by default. If your password is different:
1. Open: `login\test-login.html`
2. Find line 76: `password: 'test123'`
3. Change to your actual password
4. Save and try again

## Server Status Check

Make sure all servers are running:
```powershell
# Check login server (port 3001)
netstat -ano | findstr ":3001"

# Check landing page (port 8080)
netstat -ano | findstr ":8080"

# Check create trip (port 8082)
netstat -ano | findstr ":8082"
```

All three should show "LISTENING" status.

## What Should Happen

1. ✅ User logs in with username/password
2. ✅ Server validates against MongoDB
3. ✅ Server returns user data: `{name: "Shyamnandhan SP", username: "shyam"}`
4. ✅ Client stores in sessionStorage
5. ✅ Redirect to create trip page
6. ✅ Create trip reads sessionStorage
7. ✅ Displays "Shyamnandhan SP" with avatar "S"

## Next Steps

1. Try the **test-login.html** page first
2. If that works, try the regular login page
3. Check browser console for any error messages
4. If still not working, clear browser cache and cookies

---

Need help? Check the console logs and compare with the expected output above.
