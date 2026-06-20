# Quick Test Scenarios - AI Image Recommendations

## 🚀 5-Minute Testing Guide

---

## Prerequisites
- ✅ Backend running: `cd backend && npm start`
- ✅ Frontend running: `cd frontend && npm run dev`
- ✅ MongoDB connected
- ✅ Gallery images uploaded with categories

---

## Test Scenario 1: Wedding Decorations 💐

### User Input:
```
Show me wedding stage decorations
```

### Expected Output:
**Text Response**:
```
We offer stunning wedding decoration packages! 💐 Our services include:
• Traditional Poruwa decorations
• Stage decorations
• Aisle & venue decorations
• Floral arrangements

Would you like to see our wedding packages or book a consultation?
```

**Visual Output**:
```
┌─────────────────────────────────────────────────┐
│ 🖼️ Recommended Designs: Wedding Decorations    │
├───────────────────┬─────────────────────────────┤
│   [Wedding Img 1] │     [Wedding Img 2]        │
│   Image Title 1   │     Image Title 2          │
├───────────────────┼─────────────────────────────┤
│   [Wedding Img 3] │     [Wedding Img 4]        │
│   Image Title 3   │     Image Title 4          │
└───────────────────┴─────────────────────────────┘
```

**Alternative Triggers**:
- "wedding decorations"
- "marriage stage"
- "poruwa decorations"
- "wedding venue setup"

---

## Test Scenario 2: Birthday Party 🎉

### User Input:
```
I want birthday party decorations
```

### Expected Output:
**Text Response**:
```
We create amazing birthday decorations! 🎉 We offer:
• Theme-based decorations
• Balloon arrangements
• Backdrop setups
• Cake table decorations

Which age group or theme are you interested in?
```

**Visual Output**:
```
┌─────────────────────────────────────────────────┐
│ 🖼️ Recommended Designs: Birthday Decorations   │
├───────────────────┬─────────────────────────────┤
│  [Birthday Img 1] │    [Birthday Img 2]        │
│   Image Title 1   │     Image Title 2          │
├───────────────────┼─────────────────────────────┤
│  [Birthday Img 3] │    [Birthday Img 4]        │
│   Image Title 3   │     Image Title 4          │
└───────────────────┴─────────────────────────────┘
```

**Alternative Triggers**:
- "birthday"
- "bday decorations"
- "party setup"

---

## Test Scenario 3: Table Decorations 🍽️

### User Input:
```
table decorations
```

### Expected Output:
**Text + 4 Table Category Images**

**Alternative Triggers**:
- "table centerpieces"
- "dining table setup"

---

## Test Scenario 4: Hall Decorations 🏛️

### User Input:
```
hall venue decorations
```

### Expected Output:
**Text + 4 Hall Category Images**

**Alternative Triggers**:
- "venue decorations"
- "hall setup"
- "reception hall"

---

## Test Scenario 5: Gallery Browsing 📸

### User Input:
```
show me photos of your work
```

### Expected Output:
**Text Response**:
```
Check out our amazing work! 📸

Visit our Gallery page to see:
• Wedding decorations
• Birthday setups
• Hall decorations
• Table arrangements

You can also follow us on Instagram for daily updates!
```

**Visual Output**:
```
┌─────────────────────────────────────────────────┐
│ 🖼️ Recommended Designs: Our Gallery            │
├───────────────────┬─────────────────────────────┤
│   [Mixed Img 1]   │     [Mixed Img 2]          │
│   Wedding         │     Birthday               │
├───────────────────┼─────────────────────────────┤
│   [Mixed Img 3]   │     [Mixed Img 4]          │
│   Table           │     Hall                   │
└───────────────────┴─────────────────────────────┘
```

**Alternative Triggers**:
- "gallery"
- "pictures"
- "portfolio"
- "examples"
- "show your work"

---

## Test Scenario 6: No Images (Control Test) 💰

### User Input:
```
What are your prices?
```

### Expected Output:
**Text Response ONLY** (NO IMAGES):
```
Our decoration packages are customizable based on your needs! 💰

Prices typically start from:
• Basic packages: LKR 25,000+
• Premium packages: LKR 50,000+
• Luxury packages: LKR 100,000+

For accurate pricing, I recommend booking a consultation.
Would you like me to help you with that?
```

✅ **NO image grid should appear** (this confirms keyword filtering works)

---

## Test Scenario 7: Chat History Persistence 💾

### Steps:
1. Send: "Show me wedding decorations"
2. Receive: Text + 4 wedding images
3. Refresh the page (F5)
4. Reopen chatbot

### Expected Result:
✅ All previous messages restored
✅ Wedding images still visible in chat
✅ No data loss

---

## Test Scenario 8: User Login Linking 🔗

### Steps (Anonymous → Logged In):
1. (Not logged in) Send: "wedding stage"
2. Receive: Images + text
3. Log in to account
4. Check for green banner

### Expected Result:
```
┌─────────────────────────────────────────────────┐
│ 💾 Chat history saved - You can continue this  │
│ conversation anytime!                           │
└─────────────────────────────────────────────────┘
```

---

## Test Scenario 9: Multiple Queries in Sequence 🔄

### User Inputs (in order):
1. "wedding"
2. "birthday"
3. "table"
4. "gallery"

### Expected Result:
- ✅ Message 1: Wedding text + 4 wedding images
- ✅ Message 2: Birthday text + 4 birthday images
- ✅ Message 3: Table text + 4 table images
- ✅ Message 4: Gallery text + 4 mixed images
- ✅ All images display correctly in separate cards
- ✅ Scrollable conversation history

---

## Test Scenario 10: Edge Cases 🔍

### Case A: No Gallery Images in Database
**Expected**: Text response only, no images shown

### Case B: Category Has < 4 Images
**Expected**: Shows available images (1-3 images in grid)

### Case C: Images Not Active
**Expected**: Only active images shown

### Case D: Wrong Category Spelling
**Expected**: Falls back to text-only response

---

## ✅ Success Criteria Checklist

After running all tests, verify:

- [ ] Wedding keywords trigger wedding images
- [ ] Birthday keywords trigger birthday images
- [ ] Table keywords trigger table images
- [ ] Hall keywords trigger hall images
- [ ] Gallery keywords trigger mixed images
- [ ] Price queries show NO images
- [ ] Images display in 2×2 grid
- [ ] Image titles appear below photos
- [ ] Category header shows correct decoration type
- [ ] Images load from backend server
- [ ] Chat history saves images correctly
- [ ] Page refresh restores images
- [ ] Logged-in users see green history notice
- [ ] Typing animation works smoothly
- [ ] Auto-scroll to latest message works
- [ ] Hover effects on image cards work
- [ ] All images are clickable (cursor: pointer)

---

## 🐛 Common Issues & Solutions

### Issue: Images not showing
**Check**:
```bash
# Backend console - should see:
MongoDB Connected ✅
Server running on port 5000

# Browser console - should NOT see:
Error loading gallery images
```

**Solution**: Ensure gallery has images with correct categories

---

### Issue: Wrong images showing
**Check**: Admin Gallery page → Verify image categories

---

### Issue: Images not persisting after refresh
**Check**: 
- Browser localStorage has `chatSessionId`
- Backend MongoDB has chat history documents
- Network tab shows successful POST to `/api/chat/save`

---

## 🎯 Performance Benchmarks

- **Gallery Load Time**: < 500ms
- **Image Display Time**: < 200ms
- **Message Response Time**: 1-1.5 seconds (includes typing animation)
- **Chat History Load**: < 300ms
- **Page Refresh Recovery**: < 1 second

---

## 📊 Test Results Template

```
Date: _____________
Tester: ___________

[ ] Scenario 1: Wedding - PASS / FAIL
[ ] Scenario 2: Birthday - PASS / FAIL
[ ] Scenario 3: Table - PASS / FAIL
[ ] Scenario 4: Hall - PASS / FAIL
[ ] Scenario 5: Gallery - PASS / FAIL
[ ] Scenario 6: No Images - PASS / FAIL
[ ] Scenario 7: History - PASS / FAIL
[ ] Scenario 8: User Link - PASS / FAIL
[ ] Scenario 9: Multiple Queries - PASS / FAIL
[ ] Scenario 10: Edge Cases - PASS / FAIL

Overall Status: ___________
Notes: _____________________
```

---

## 🚀 Ready to Test!

Start with Scenario 1 (Wedding) and work your way down. Each scenario should take < 1 minute to test.

**Total Testing Time**: ~10 minutes for all scenarios

**Good luck!** 🎉
