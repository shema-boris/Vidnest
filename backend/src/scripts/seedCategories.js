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
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📂 Seeding categories...\n');

    let created = 0;
    let skipped = 0;

    for (const name of categories) {
      const exists = await Category.findOne({ name });
      if (!exists) {
        await Category.create({ name });
        console.log(`  ✅ Created: ${name}`);
        created++;
      } else {
        console.log(`  ⏭️  Exists:  ${name}`);
        skipped++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  - Created: ${created}`);
    console.log(`  - Skipped: ${skipped}`);
    console.log(`  - Total:   ${categories.length}`);
    console.log('\n✅ Category seeding complete!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedCategories();
