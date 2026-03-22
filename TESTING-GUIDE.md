# 🧪 Testing Guide - Byte-Bite Food Delivery App

## ✅ Before You Start

1. Open `menu.html` in your browser
2. Use Chrome DevTools (F12) for testing
3. Test on different screen sizes
4. Check console for any errors

---

## 🎯 Test Cases

### Test 1: Navigation & Links
```
STEPS:
1. Open menu.html
2. Click on each navbar link:
   ✓ Home
   ✓ Search
   ✓ Dine Out (NEW)
   ✓ Offers (NEW)
   ✓ Cart
   ✓ Profile

EXPECTED:
- Each link navigates to correct page
- Navbar stays consistent
- Cart count shows (if items exist)
```

### Test 2: Cart Functionality
```
STEPS:
1. Go to menu.html
2. Click on any category (e.g., Veg)
3. Click on a restaurant
4. Click on a dish → product.html opens
5. Customize & click "ADD TO CART"
6. Go back to menu.html
7. Check cart count badge

EXPECTED:
- Cart count updates instantly
- Badge shows correct number
- Item appears in checkout.html
```

### Test 3: Cart Persistence
```
STEPS:
1. Add 3 items to cart
2. Note the count (e.g., 3)
3. Refresh page (F5)
4. Check cart again

EXPECTED:
- Cart items still there (not cleared)
- Count is still 3
- Navigate to checkout → items visible
```

### Test 4: Dine Out Feature
```
STEPS:
1. Click "Dine Out" in navbar → dineout.html
2. Scroll through restaurants
3. Click filter tabs:
   ✓ All Restaurants
   ✓ Popular Cuisines
   ✓ Special Offers
   ✓ Top Rated
4. Click "Reserve" button on any restaurant

EXPECTED:
- Pages load smoothly
- Filters work correctly
- Reservation alert shows
- Can navigate back
```

### Test 5: Offers Feature
```
STEPS:
1. Click "Offers" in navbar → offers-modern.html
2. Scroll through offers
3. Click filter tabs:
   ✓ All Offers
   ✓ Discounts
   ✓ Cashback
   ✓ Free Delivery
   ✓ Flat OFF
4. Click "Copy" button on any offer
5. Click "Apply" button

EXPECTED:
- Offers load correctly
- Filters show relevant offers
- Copy button shows alert
- Apply navigates to search page
```

### Test 6: Search Functionality
```
STEPS:
1. Click "Search" in navbar → search.html
2. Type in search box (e.g., "pizza")
3. Click on popular dishes
4. Use browser back button

EXPECTED:
- Search page loads
- Input accepts text
- Can browse suggestions
- Navigation works
```

### Test 7: Responsive Design
```
STEPS:
1. Open menu.html
2. Press F12 (DevTools)
3. Click device toolbar icon
4. Select different devices:
   ✓ iPhone SE (375px)
   ✓ iPhone 12 (390px)
   ✓ iPad (768px)
   ✓ Desktop (1920px)
5. Check layout on each

EXPECTED:
- Layout adapts to screen size
- Navbar collapses on mobile
- Text is readable
- Buttons are clickable
- No horizontal scroll
```

### Test 8: Product Customization
```
STEPS:
1. Go to product.html
2. Select portion options
3. Select add-ons
4. Adjust quantity with +/- buttons
5. Watch price update
6. Click "ADD TO CART"

EXPECTED:
- Price updates dynamically
- Options are selectable
- Quantity changes work
- Item adds to cart
- Cart count updates
```

### Test 9: Checkout Page
```
STEPS:
1. Add 2-3 items to cart
2. Go to checkout.html
3. Check:
   ✓ All items visible
   ✓ Item images show
   ✓ Prices correct
   ✓ Quantity controls work
4. Adjust quantities
5. Check order summary updates
6. Set delivery location
7. Click "Place Order"

EXPECTED:
- All items display correctly
- Totals calculate accurately:
  • Item Total
  • Delivery Fee (₹50)
  • Platform Fee (₹12)
  • Taxes (11%)
  • Grand Total
- Address can be set
- Place order works
```

### Test 10: Cart Synchronization
```
STEPS:
1. Add item in menu.html
2. Note cart count
3. Click "Dine Out"
4. Check cart count still shows
5. Click "Offers"
6. Check cart count still shows
7. Go to checkout
8. Count matches

EXPECTED:
- Cart count syncs across all pages
- Item count is consistent
- Badge updates everywhere
- No data loss
```

---

## 🔍 DevTools Testing

### Check Console (F12 → Console)
```
✓ No red errors
✓ No warnings
✓ Cart events fire correctly

Test by typing:
ByteBiteCart.getItemCount()
→ Should return number

ByteBiteCart.getTotals()
→ Should return breakdown
```

### Check LocalStorage
```
F12 → Application → LocalStorage → Your Site

Look for:
✓ bb_cart key exists
✓ Contains JSON array of items
✓ Updates after adding item
✓ Persists after refresh
```

### Check Performance
```
F12 → Performance

Add item to cart, then:
1. Click "Record"
2. Do action (add item/filter)
3. Stop recording
4. Check metrics:
   ✓ Should be < 1000ms
   ✓ Smooth 60 FPS
   ✓ No jank
```

---

## 📱 Mobile Testing

### iPhone Screen (375px)
```
✓ Navbar collapses nicely
✓ Text size readable
✓ Buttons are 44px+ (touch-friendly)
✓ No horizontal scroll
✓ Images load fast
```

### Tablet Screen (768px)
```
✓ 2-column layout shows properly
✓ Navigation still sticky
✓ Cards display nicely
✓ Spacing looks good
```

### Desktop Screen (1920px)
```
✓ Full-width layout works
✓ 4+ columns visible
✓ Content doesn't stretch too wide
✓ Max-width constraint (1400px) works
```

---

## 🎨 Design Testing

### Colors
```
✓ Maroon (#943131) - Used for branding
✓ Orange (#ff5a1f) - Used for CTAs
✓ Cream (#fff8f5) - Used for backgrounds
✓ White (#ffffff) - Used for cards
✓ Dark (#2b1414) - Used for text
```

### Typography
```
✓ Poppins font loads
✓ Rokkitt font loads
✓ Font sizes are readable:
  - H1: 40px (hero)
  - H2: 24px (section)
  - Body: 14-16px
  - Small: 12-13px
```

### Animations
```
✓ Card hover - translateY(-8px)
✓ Button hover - background change
✓ Smooth transitions (0.3s)
✓ No jank or stuttering
```

---

## 🚀 Performance Testing

### Page Load Time
```
Target: < 2 seconds

Test with:
F12 → Network tab
Look at:
✓ Total size
✓ Load time
✓ Speed on slow 3G
```

### Bundle Size
```
HTML: ~15KB
CSS: ~50KB
JS: ~20KB
Total: ~85KB (before assets)
```

---

## 🗂️ File Integrity Check

Run this in console:
```javascript
// Check cart-utils
typeof ByteBiteCart // Should be 'object'
ByteBiteCart.getCart() // Should return array

// Check localStorage
localStorage.getItem('bb_cart') // Should show JSON

// Check events
document.addEventListener('cartUpdated', () => console.log('Event works!'))
// Add item and check console
```

---

## ✨ Feature Checklist

### Core Features
```
☐ Navigation works
☐ Cart adds items
☐ Cart persists (localStorage)
☐ Cart count updates globally
☐ Cart totals calculate correctly
☐ Search functionality exists
☐ Product customization works
☐ Checkout page functional
```

### NEW Features
```
☐ Dine Out page exists
☐ Dine Out restaurants load
☐ Dine Out filters work
☐ Reserve button works
☐ Offers page exists
☐ Offers load correctly
☐ Offer filters work
☐ Copy coupon works
```

### Design Features
```
☐ Sticky navbar on all pages
☐ Cart count badge visible
☐ Responsive on mobile (375px)
☐ Responsive on tablet (768px)
☐ Responsive on desktop (1024px)
☐ Smooth hover animations
☐ Professional spacing
☐ Consistent colors
```

### Browser Compatibility
```
✓ Chrome 90+
✓ Firefox 88+
✓ Safari 14+
✓ Edge 90+
✓ Mobile Safari
✓ Chrome Mobile
```

---

## 🐛 Common Issues & Solutions

### Issue: Cart not updating
```
SOLUTION:
1. Check DevTools Console for errors
2. Type: ByteBiteCart.getItemCount()
3. Try refreshing page
4. Clear localStorage and try again:
   localStorage.clear()
```

### Issue: Page doesn't load
```
SOLUTION:
1. Check browser console (F12)
2. Check file paths are correct
3. Ensure all JS files load
4. Try different browser
```

### Issue: Mobile layout broken
```
SOLUTION:
1. Check viewport meta tag exists
2. Test with real mobile or DevTools
3. Clear browser cache
4. Check CSS media queries
```

### Issue: Image not showing
```
SOLUTION:
1. Check image URL is valid
2. Inspect element to verify src
3. Use valid image URLs
4. Check network tab for 404s
```

---

## 📊 Testing Checklist

Print this and mark off:

```
□ Navigation Tests - All links work
□ Cart Tests - Add/remove items
□ Persistence - Refresh and check
□ Dine Out - Browse & reserve
□ Offers - View & copy codes
□ Search - Type and search
□ Desktop - 1920px width
□ Tablet - 768px width
□ Mobile - 375px width
□ Console - No errors
□ Performance - < 2s load
□ Colors - Correct hex codes
□ Fonts - Poppins/Rokkitt load
□ Animations - Smooth transitions
□ Cross-browser - Chrome/Firefox/Safari
```

---

## 🎯 Final Validation

Before deployment, ensure:

✅ All pages load without errors
✅ Navigation links work
✅ Cart system functional
✅ Responsive on 4 breakpoints
✅ No console errors
✅ Images load properly
✅ Fonts load properly
✅ Animations smooth
✅ Local Storage works
✅ Cart count syncs globally

---

**Once all tests pass, you're ready to deploy! 🚀**
