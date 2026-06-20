# Chatbot Image Not Showing - Debug Guide

## ✅ Fixes Applied

I've made the following changes to fix the image display issue:

### 1. **Fixed Image URL Resolution**
- Changed from hardcoded `http://localhost:5000` to use `resolveAssetUrl()` helper
- This ensures images load correctly from the API base URL

### 2. **Fixed Response Format Handling**
- Added proper handling for both string and object responses from `getAIResponse()`
- Prevents undefined errors when accessing `aiResponse.text`

### 3. **Added Error Handling**
- Added `onError` handler for images that fail to load
- Images that fail will hide instead of showing broken image icon

### 4. **Added Debug Logging**
- Console logs to track:
  - Gallery images loading
  - Image filtering by category
  - Number of images found for each query

---

## 🔍 Debugging Steps

### Step 1: Check if Backend is Running

Open a terminal and run:
```bash
cd backend
npm start
```

**Expected Output**:
```
MongoDB Connected ✅
Server running on port 5000
```

---

### Step 2: Check if Gallery Has Images

Open your browser and go to:
```
http://localhost:5000/api/gallery/
```

**Expected Response**:
```json
{
  "images": [
    {
      "_id": "...",
      "title": "Wedding Stage",
      "category": "wedding",
      "imageUrl": "/uploads/1781847988622-310053369.png",
      "isActive": true
    },
    ...
  ]
}
```

**If you see empty array `[]`**:
- Go to Admin Gallery page
- Upload some images
- Set categories correctly (wedding, birthday, table, hall)
- Mark images as Active

---

### Step 3: Open Browser Developer Console

1. Open your website: `http://localhost:5173`
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Open chatbot
5. Type: "wedding decorations"

**Expected Console Output**:
```
Gallery images loaded: 15
Sample image: {_id: "...", title: "...", category: "wedding", ...}
Filtering images for category "wedding": 4 images found
Wedding query detected, returning: 4 images
```

---

### Step 4: Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Filter by "gallery"
4. Open chatbot

**Expected**:
- Request to `/api/gallery/` shows Status **200 OK**
- Response shows array of images

**If Status is 404 or 500**:
- Backend is not running or crashed
- Check backend terminal for errors

---

### Step 5: Check Image URLs

In the Console, when you see images loading, check:
```javascript
// Should show something like:
Sample image: {
  imageUrl: "/uploads/1781847988622-310053369.png"
}
```

**If imageUrl is missing or null**:
- Images in database don't have proper paths
- Re-upload images through Admin Gallery

---

### Step 6: Verify Image Files Exist

Check if upload folder has images:
```bash
dir "g:\DecorHire Lanka\backend\uploads"
```

**Expected**:
- You should see `.png` files with timestamps
- Example: `1781847988622-310053369.png`

**If folder is empty**:
- Upload images through Admin Gallery page
- Images should automatically appear in this folder

---

## 🐛 Common Issues & Solutions

### Issue 1: "Gallery images loaded: 0"
**Cause**: No images in database

**Solution**:
1. Go to Admin Login: `http://localhost:5173/admin/login`
2. Login with admin credentials
3. Go to Gallery Management
4. Upload at least 4 images
5. Set categories: wedding, birthday, table, hall
6. Click "Active" checkbox
7. Refresh chatbot

---

### Issue 2: "Error loading gallery images: Network Error"
**Cause**: Backend not running

**Solution**:
```bash
cd backend
npm start
```

Wait for "Server running on port 5000" message

---

### Issue 3: "Filtering images for category 'wedding': 0 images found"
**Cause**: Images have wrong categories or not active

**Solution**:
1. Check Admin Gallery page
2. Edit each image
3. Set category dropdown to correct value
4. Ensure "Active" checkbox is checked
5. Save changes

---

### Issue 4: Images Show But Don't Load (Broken Image Icon)
**Cause**: Image paths are incorrect

**Solution**:
1. Check console for "Image load error: ..."
2. Verify files exist in `backend/uploads/` folder
3. Check if backend is serving static files:
   ```
   http://localhost:5000/uploads/1781847988622-310053369.png
   ```
4. If 404, check `server.js` has:
   ```javascript
   app.use("/uploads", express.static(uploadsDir));
   ```

---

### Issue 5: "Cannot read property 'text' of undefined"
**Cause**: Old response format issue (FIXED in this update)

**Solution**: Already fixed! The code now handles both formats.

---

## ✅ Testing Checklist

Run through these tests:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] `/api/gallery/` returns images
- [ ] Admin Gallery page shows uploaded images
- [ ] At least 4 wedding category images exist
- [ ] At least 4 birthday category images exist
- [ ] Images are marked as "Active"
- [ ] Console shows "Gallery images loaded: X" (X > 0)
- [ ] Type "wedding" in chatbot
- [ ] Console shows "Filtering images for category 'wedding': 4 images found"
- [ ] Images appear in 2x2 grid below bot message
- [ ] Images load correctly (no broken icons)
- [ ] Image titles show below each image

---

## 📊 Quick Test Commands

### Test 1: Backend Health
```bash
curl http://localhost:5000
```
**Expected**: `{"message":"Wedding Decorator API is running ✅"}`

### Test 2: Gallery API
```bash
curl http://localhost:5000/api/gallery/
```
**Expected**: JSON with images array

### Test 3: Image File Access
```bash
curl http://localhost:5000/uploads/gallery1.png -I
```
**Expected**: `HTTP/1.1 200 OK`

---

## 🎯 Expected Behavior After Fix

1. **On Chatbot Open**:
   - Console: "Gallery images loaded: X"
   - Gallery images fetched in background

2. **On "wedding" Query**:
   - Console: "Filtering images for category 'wedding': 4 images found"
   - Console: "Wedding query detected, returning: 4 images"
   - Bot shows text response
   - Below text: "🖼️ **Recommended Designs:** Wedding Decorations"
   - 2x2 grid with 4 wedding images

3. **On "birthday" Query**:
   - Same behavior but with birthday images

4. **On "pricing" Query**:
   - Text response only (NO images)
   - This is correct behavior

---

## 📝 Code Changes Made

### File: `frontend/src/components/Chatbot.jsx`

**Change 1**: Import resolveAssetUrl
```javascript
import { api, resolveAssetUrl } from "../services/api.js";
```

**Change 2**: Use resolveAssetUrl for images
```javascript
<img src={resolveAssetUrl(img.imageUrl)} ... />
```

**Change 3**: Better response handling
```javascript
if (typeof aiResponse === 'string') {
  // Handle old string format
} else {
  // Handle new object format
}
```

**Change 4**: Added console logging
```javascript
console.log('Gallery images loaded:', response.data.images.length);
console.log('Filtering images for category "wedding":', filtered.length);
```

**Change 5**: Image error handling
```javascript
onError={(e) => {
  console.error('Image load error:', img.imageUrl);
  e.target.style.display = 'none';
}}
```

---

## 🚀 Next Steps

1. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend** (new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Browser Console** (F12)

4. **Open Chatbot**
   - Check console for "Gallery images loaded"

5. **Type "wedding"**
   - Watch console logs
   - Images should appear

6. **If Still Not Working**:
   - Screenshot the console output
   - Check all items in "Common Issues" section above
   - Verify gallery has active wedding images

---

## 💡 Pro Tip

To quickly test if images are loading:

1. Open chatbot
2. Open Console (F12)
3. Type this in console:
   ```javascript
   fetch('http://localhost:5000/api/gallery/')
     .then(r => r.json())
     .then(d => console.log('Gallery data:', d))
   ```

This will show you exactly what the chatbot is receiving!

---

**All fixes have been applied. Follow the debugging steps above to identify and resolve the issue!** 🔧
