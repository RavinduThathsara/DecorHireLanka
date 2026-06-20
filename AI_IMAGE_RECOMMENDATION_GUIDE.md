# AI Image Recommendation Feature - Testing Guide

## ✅ Implementation Complete

The chatbot now intelligently recommends gallery images based on user queries!

---

## 🎯 What Was Added

### 1. **Smart Image Recognition**
The chatbot analyzes user messages and shows relevant gallery images based on decoration categories:
- **Wedding**: poruwa, stage, marriage, wedding
- **Birthday**: birthday, bday, party
- **Table**: table decorations, centerpieces
- **Hall**: hall, venue decorations
- **Gallery**: photo, picture, portfolio, example

### 2. **Real-time Gallery Integration**
- Fetches active gallery images from database on chatbot load
- Filters by category automatically
- Shows up to 4 relevant images per query

### 3. **Beautiful Image Display**
- 2x2 grid layout for image recommendations
- Image titles displayed below each image
- Category header shows decoration type
- Smooth hover effects on image cards

---

## 📂 Files Modified

✅ `frontend/src/components/Chatbot.jsx`
- Added `galleryImages` state for storing gallery data
- Added `loadGalleryImages()` function to fetch from backend
- Added `getRecommendedImages()` function to filter by category
- Enhanced `getAIResponse()` to return text + images
- Updated message rendering to display image recommendations
- Added image grid styling (imageCard, imageStyle, imageTitle)

---

## 🎨 Visual Features

### Image Recommendation Card:
```
┌─────────────────────────────────────┐
│ 🖼️ Recommended Designs: Wedding    │
├─────────────────┬───────────────────┤
│   [Image 1]     │    [Image 2]      │
│   Title 1       │    Title 2        │
├─────────────────┼───────────────────┤
│   [Image 3]     │    [Image 4]      │
│   Title 3       │    Title 4        │
└─────────────────┴───────────────────┘
```

- White background with border
- 2 columns x 2 rows grid
- Each image: 120px height, cover fit
- Category header with emoji

---

## 🧪 Testing Instructions

### Test 1: Wedding Decorations
**User Message**: "Show me wedding stage decorations"

**Expected Result**:
- Bot responds with wedding packages text
- Shows 4 wedding category images in grid
- Header: "🖼️ **Recommended Designs:** Wedding Decorations"

### Test 2: Birthday Decorations
**User Message**: "I want birthday party decorations"

**Expected Result**:
- Bot responds with birthday services
- Shows 4 birthday category images
- Header: "🖼️ **Recommended Designs:** Birthday Decorations"

### Test 3: Table Decorations
**User Message**: "table decorations"

**Expected Result**:
- Bot responds with table decoration services
- Shows 4 table category images
- Header: "🖼️ **Recommended Designs:** Table Decorations"

### Test 4: Hall Decorations
**User Message**: "hall venue decorations"

**Expected Result**:
- Bot responds with hall decoration services
- Shows 4 hall category images
- Header: "🖼️ **Recommended Designs:** Hall Decorations"

### Test 5: Gallery Request
**User Message**: "show me photos of your work"

**Expected Result**:
- Bot responds about gallery
- Shows 4 mixed images from all categories
- Header: "🖼️ **Recommended Designs:** Our Gallery"

### Test 6: No Images Query
**User Message**: "What are your prices?"

**Expected Result**:
- Bot responds with pricing info
- NO images displayed (price queries don't show images)

---

## 🔍 Keyword Triggers

### Wedding Images Shown When User Types:
- "wedding"
- "marriage"
- "stage"
- "poruwa"
- "wedding stage decorations"

### Birthday Images Shown When User Types:
- "birthday"
- "bday"
- "party"
- "birthday decorations"

### Table Images Shown When User Types:
- "table"
- "table decorations"
- "centerpieces"

### Hall Images Shown When User Types:
- "hall"
- "venue"
- "hall decorations"

### Mixed Gallery Images Shown When User Types:
- "gallery"
- "photo"
- "picture"
- "example"
- "portfolio"
- "work"

---

## 💾 Chat History with Images

**Important**: Image recommendations are saved with chat history!
- When you refresh, previous image recommendations reload
- Images persist across sessions for logged-in users
- Images stored as part of message object in MongoDB

---

## 🎨 Styling Details

### Image Recommendation Container:
- Background: White (#fff)
- Border: 1px solid #e5e7eb
- Border radius: 12px
- Padding: 12px
- Margin: 8px top, 16px bottom

### Image Grid:
- Display: Grid (2 columns)
- Gap: 8px between images
- Responsive layout

### Individual Image Card:
- Border radius: 8px
- Border: 1px solid #e5e7eb
- Hover effect: Transform + shadow
- Cursor: Pointer

### Image:
- Width: 100%
- Height: 120px
- Object-fit: Cover
- Maintains aspect ratio

### Image Title:
- Background: #f9fafb
- Font size: 11px
- Font weight: 600
- Centered text
- Padding: 6px 8px

---

## 🚀 How It Works (Technical)

### 1. **Gallery Loading**
```javascript
loadGalleryImages()
  → Fetches from /api/gallery/
  → Stores in galleryImages state
  → Runs on component mount
```

### 2. **Category Filtering**
```javascript
getRecommendedImages(category)
  → Filters galleryImages by category
  → Checks isActive = true
  → Returns max 4 images
```

### 3. **AI Response Enhancement**
```javascript
getAIResponse(userMessage)
  → Analyzes keywords in message
  → Calls getRecommendedImages(category)
  → Returns { text, images, imageCategory }
```

### 4. **Message Rendering**
```javascript
messages.map(msg => {
  if (msg.images && msg.images.length > 0) {
    // Render image recommendation card
  }
})
```

---

## 📊 Data Flow

```
User Types Query
      ↓
Keyword Detection
      ↓
Get Category ("wedding", "birthday", etc.)
      ↓
Filter Gallery Images by Category
      ↓
Return Text + Images + Category Name
      ↓
Render Message + Image Grid
      ↓
Save to MongoDB (Chat History)
```

---

## 🔧 Backend API Used

**Endpoint**: `GET /api/gallery/`

**Response**:
```json
{
  "images": [
    {
      "_id": "...",
      "title": "Elegant Wedding Stage",
      "category": "wedding",
      "imageUrl": "/uploads/1781847988622-310053369.png",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## 🎯 Categories Available

Based on your gallery model, these categories are supported:
1. ✅ **wedding** - Wedding decorations, stages, poruwa
2. ✅ **birthday** - Birthday parties, balloons
3. ✅ **table** - Table decorations, centerpieces
4. ✅ **hall** - Hall/venue decorations
5. ✅ **other** - Miscellaneous decorations

---

## 💡 Pro Tips

1. **Add More Images**: Upload more images in Admin Gallery page to improve recommendations
2. **Categorize Properly**: Ensure images have correct categories in admin panel
3. **Image Titles**: Add descriptive titles for better user experience
4. **Active Status**: Only active images are shown in chatbot

---

## 🐛 Troubleshooting

### Problem: No images showing
**Solution**:
- Check if gallery images exist in database
- Verify images are marked as `isActive: true`
- Check category names match ("wedding", "birthday", etc.)
- Check browser console for fetch errors

### Problem: Images not loading
**Solution**:
- Verify backend URL: `http://localhost:5000`
- Check CORS settings in backend
- Verify uploads folder has images
- Check image paths in database (should start with `/uploads/`)

### Problem: Wrong images showing
**Solution**:
- Check image categories in Admin Gallery page
- Verify keyword detection in `getAIResponse()` function
- Check `getRecommendedImages()` filter logic

---

## ✅ Testing Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Gallery has images uploaded (wedding, birthday, table, hall)
- [ ] Images are marked as Active in admin panel
- [ ] Images have proper categories assigned
- [ ] Chatbot loads without errors
- [ ] Gallery images fetch successfully
- [ ] Wedding query shows wedding images (max 4)
- [ ] Birthday query shows birthday images
- [ ] Table query shows table images
- [ ] Hall query shows hall images
- [ ] Gallery query shows mixed images
- [ ] Price query shows NO images
- [ ] Images display in 2x2 grid
- [ ] Image titles show correctly
- [ ] Images persist in chat history after refresh
- [ ] Hover effect works on image cards

---

## 🎉 Ready to Test!

The AI Image Recommendation feature is fully implemented. When users ask about decorations, they'll see beautiful visual examples from your gallery automatically!

**Quick Test**:
1. Open chatbot
2. Type: "Show me wedding stage decorations"
3. See: Text response + 4 wedding images in grid
4. Type: "birthday party ideas"
5. See: Text response + 4 birthday images in grid

**Enjoy the enhanced chatbot experience!** 🚀
