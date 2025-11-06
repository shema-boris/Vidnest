# 📂 Seed Global Categories

Since users can't create categories, you need to set up a predefined list of global categories that will be used for all videos.

## Recommended Categories

Here's a curated list of categories that cover most video content:

```javascript
const defaultCategories = [
  'Education',
  'Entertainment',
  'Music',
  'Gaming',
  'News',
  'Sports',
  'Technology',
  'Comedy',
  'Food',
  'Travel',
  'Fashion',
  'Fitness',
  'DIY',
  'Beauty',
  'Vlog',
  'Review',
  'Live',
  'Tutorial',
  'Documentary',
  'General'
];
```

---

## How to Seed Categories

### Option 1: Manual Creation (MongoDB Compass or CLI)

```javascript
// In MongoDB shell or Compass
db.categories.insertMany([
  { name: 'Education', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Entertainment', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Music', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Gaming', createdAt: new Date(), updatedAt: new Date() },
  { name: 'News', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Sports', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Technology', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Comedy', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Food', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Travel', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Fashion', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Fitness', createdAt: new Date(), updatedAt: new Date() },
  { name: 'DIY', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Beauty', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Vlog', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Review', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Live', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Tutorial', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Documentary', createdAt: new Date(), updatedAt: new Date() },
  { name: 'General', createdAt: new Date(), updatedAt: new Date() }
]);
```

### Option 2: Create a Seed Script

Create `backend/src/scripts/seedCategories.js`:

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const categories = [
  'Education',
  'Entertainment',
  'Music',
  'Gaming',
  'News',
  'Sports',
  'Technology',
  'Comedy',
  'Food',
  'Travel',
  'Fashion',
  'Fitness',
  'DIY',
  'Beauty',
  'Vlog',
  'Review',
  'Live',
  'Tutorial',
  'Documentary',
  'General'
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories (optional)
    // await Category.deleteMany({});
    // console.log('Cleared existing categories');

    // Insert categories
    for (const name of categories) {
      const exists = await Category.findOne({ name });
      if (!exists) {
        await Category.create({ name });
        console.log(`✅ Created category: ${name}`);
      } else {
        console.log(`⏭️  Category already exists: ${name}`);
      }
    }

    console.log('✅ Category seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
```

**Run it:**
```bash
node backend/src/scripts/seedCategories.js
```

### Option 3: API Endpoint for Admins Only

You could create an admin-only endpoint to seed categories (need to add admin role check):

```javascript
// In categoryController.js
export const seedCategories = async (req, res) => {
  // Only admins can do this
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const categories = [
    'Education', 'Entertainment', 'Music', 'Gaming', 'News',
    'Sports', 'Technology', 'Comedy', 'Food', 'Travel',
    'Fashion', 'Fitness', 'DIY', 'Beauty', 'Vlog',
    'Review', 'Live', 'Tutorial', 'Documentary', 'General'
  ];

  const created = [];
  for (const name of categories) {
    const exists = await Category.findOne({ name });
    if (!exists) {
      const category = await Category.create({ name });
      created.push(category);
    }
  }

  res.json({
    message: 'Categories seeded',
    created: created.length,
    total: categories.length
  });
};
```

---

## Category Matching Logic

The system will now:

1. ✅ **Match existing categories** (case-insensitive)
   - "music" matches "Music"
   - "GAMING" matches "Gaming"

2. ✅ **Use null if no match**
   - Video saved without category
   - User can manually assign later

3. ❌ **Never auto-create categories**
   - Prevents chaos
   - Keeps category list clean

---

## Updating the Category Suggestion Function

You might also want to update `suggestCategory()` in `videoImportService.js` to only suggest categories from your predefined list:

```javascript
// In videoImportService.js
const VALID_CATEGORIES = [
  'Education', 'Entertainment', 'Music', 'Gaming', 'News',
  'Sports', 'Technology', 'Comedy', 'Food', 'Travel',
  'Fashion', 'Fitness', 'DIY', 'Beauty', 'Vlog',
  'Review', 'Live', 'Tutorial', 'Documentary', 'General'
];

export const suggestCategory = (metadata) => {
  const title = (metadata.title || '').toLowerCase();
  const description = (metadata.description || '').toLowerCase();
  const content = `${title} ${description}`;
  
  // ... existing logic ...
  
  let suggestedCategory = 'General'; // default
  
  // Check against valid categories only
  if (content.includes('tutorial') || content.includes('how to')) {
    suggestedCategory = 'Tutorial';
  } else if (content.includes('music')) {
    suggestedCategory = 'Music';
  }
  // ... etc
  
  // Make sure suggestion is in valid list
  return VALID_CATEGORIES.includes(suggestedCategory) 
    ? suggestedCategory 
    : 'General';
};
```

---

## Benefits of This Approach

✅ **Clean category list** - No pollution  
✅ **Predictable** - Users see same categories  
✅ **Manageable** - You control the list  
✅ **Flexible** - Easy to add new categories when needed  
✅ **No chaos** - Users can't create weird categories  

---

## When to Add New Categories

Only add categories when:
1. You see many videos without categories
2. There's a clear pattern of content not fitting existing categories
3. The new category would benefit ALL users

**Add via:**
- Database directly
- Seed script
- Admin API endpoint
