import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { series, episodes } from "../lib/schema"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function fixSeriesTable() {
  try {
    console.log('🔧 Fixing series table structure...')
    
    // First, drop the episodes table if it exists (due to foreign key constraints)
    await sql`DROP TABLE IF EXISTS episodes CASCADE`
    console.log('✅ Dropped episodes table (if existed)')
    
    // Drop the series table if it exists
    await sql`DROP TABLE IF EXISTS series CASCADE`
    console.log('✅ Dropped series table (if existed)')
    
    // Create the correct series table structure
    await sql`
      CREATE TABLE series (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        featured BOOLEAN DEFAULT false,
        published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✅ Created series table with correct structure')
    
    // Create the correct episodes table structure
    await sql`
      CREATE TABLE episodes (
        id SERIAL PRIMARY KEY,
        series_id INTEGER NOT NULL REFERENCES series(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        episode_number INTEGER NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        rich_content TEXT,
        image_url TEXT,
        published BOOLEAN DEFAULT false,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        view_count INTEGER DEFAULT 0
      )
    `
    console.log('✅ Created episodes table with correct structure')
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_series_name ON series(name)`
    await sql`CREATE INDEX IF NOT EXISTS idx_series_slug ON series(slug)`
    await sql`CREATE INDEX IF NOT EXISTS idx_series_published ON series(published)`
    await sql`CREATE INDEX IF NOT EXISTS idx_series_featured ON series(featured)`
    await sql`CREATE INDEX IF NOT EXISTS idx_episodes_series_id ON episodes(series_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_episodes_slug ON episodes(slug)`
    await sql`CREATE INDEX IF NOT EXISTS idx_episodes_published ON episodes(published)`
    await sql`CREATE INDEX IF NOT EXISTS idx_episodes_episode_number ON episodes(episode_number)`
    console.log('✅ Created indexes')
    
    // Insert sample data
    await sql`
      INSERT INTO series (name, slug, description, featured, published) VALUES
        ('Medical Insights', 'medical-insights', 'Exploring the intersection of medicine and human potential', true, true),
        ('Creative Journey', 'creative-journey', 'Art, music, and creative expression in personal development', false, true),
        ('Life Reflections', 'life-reflections', 'Thoughts on personal growth and transformation', false, false)
      ON CONFLICT (name) DO NOTHING
    `
    console.log('✅ Inserted sample series data')
    
    console.log('🎉 Series table migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
fixSeriesTable().then(() => {
  console.log('Migration script completed')
  process.exit(0)
})