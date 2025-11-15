import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

async function runMigration() {
  try {
    console.log("Checking if site_settings table exists...")
    
    // Check if table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'site_settings'
      );
    `)
    
    const exists = tableExists.rows[0]?.exists
    
    if (exists) {
      console.log("✓ site_settings table already exists")
      return
    }
    
    console.log("Creating site_settings table...")
    
    // Create table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) NOT NULL UNIQUE,
        value TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)
    
    // Create index
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
    `)
    
    console.log("✓ site_settings table created")
    
    // Insert default settings
    console.log("Inserting default settings...")
    
    await db.execute(sql`
      INSERT INTO site_settings (key, value, updated_at) VALUES
        ('hero_image', '/IMG-20251113-WA0001.jpg', NOW()),
        ('hero_title', 'The Mind''s Fruit', NOW()),
        ('hero_subtitle', 'Ideas That Awaken Your Potential', NOW()),
        ('hero_description', 'Welcome to TRISKIDEAS. I''m Ferdinand Ibu Ogbaji—a medical doctor, artist, and passionate explorer of human potential. Here, we delve into the intersection of medicine, creativity, and personal transformation.', NOW()),
        ('about_image', '/IMG-20251113-WA0001.jpg', NOW()),
        ('about_title', 'About Dr. Ferdinand Ibu Ogbaji', NOW()),
        ('about_content', 'Hello! I''m Ferdinand, and I''m passionate about helping people reach their full potential by unleashing their God-given abilities to make a positive change in our world.

By profession, I''m a medical doctor. As a pursuit, I''m an artist. I love music, art, reading, travelling, thinking, and exploring new things. These diverse interests have shaped my perspective on human potential and creativity.

I''m married to Florence and we reside in Jos, Nigeria, where I continue to practice medicine, create art, and explore the intersection of healing, creativity, and personal transformation.', NOW()),
        ('author_bio', 'Dr. Ferdinand Ibu Ogbaji is a passionate medical doctor, artist, and thinker based in Jos, Nigeria. He is dedicated to helping people unlock their God-given potential and make positive contributions to society. Married to Florence, Ferdinand combines his medical expertise with artistic creativity to explore transformative ideas.', NOW()),
        ('payment_gateway', 'none', NOW()),
        ('primary_color', '#d97706', NOW()),
        ('primary_dark_color', '#92400e', NOW()),
        ('accent_color', '#fed7aa', NOW()),
        ('background_color', '#fffbeb', NOW())
      ON CONFLICT (key) DO NOTHING;
    `)
    
    console.log("✓ Default settings inserted")
    console.log("Migration completed successfully!")
    
  } catch (error) {
    console.error("Migration failed:", error)
    throw error
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
