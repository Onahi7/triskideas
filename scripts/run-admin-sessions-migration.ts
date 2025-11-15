import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

async function runMigration() {
  try {
    console.log("Creating admin_sessions table...")
    
    // Create table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)
    
    console.log("✓ admin_sessions table created")
    
    // Create indexes
    console.log("Creating indexes...")
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON admin_sessions(token_hash);
    `)
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
    `)
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
    `)
    
    console.log("✓ Indexes created")
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
