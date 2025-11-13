import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!')
  console.error('📝 Please ensure you have a .env.local file with DATABASE_URL=your_neon_database_url')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL!)

async function seedAdminUser() {
  try {
    console.log('🌱 Seeding admin user...')
    
    // Check if admin user already exists
    const existingAdmin = await sql`
      SELECT id FROM admin_users WHERE username = 'admin' LIMIT 1
    `
    
    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin user already exists. Updating password...')
      
      // Hash the new password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash('Trisky_2035', saltRounds)
      
      // Update existing admin password
      await sql`
        UPDATE admin_users 
        SET password_hash = ${hashedPassword}, 
            updated_at = CURRENT_TIMESTAMP
        WHERE username = 'admin'
      `
      
      console.log('✅ Admin password updated successfully!')
      return
    }
    
    // Hash the password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash('Trisky_2035', saltRounds)
    
    // Insert new admin user
    await sql`
      INSERT INTO admin_users (
        username, 
        password_hash, 
        email, 
        full_name, 
        active
      ) VALUES (
        'admin',
        ${hashedPassword},
        'admin@triskideas.com',
        'Dr. Ferdinand Ibu Ogbaji',
        true
      )
    `
    
    console.log('✅ Admin user seeded successfully!')
    console.log('📧 Username: admin')
    console.log('🔑 Password: Trisky_2035')
    console.log('📮 Email: admin@triskideas.com')
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  seedAdminUser()
    .then(() => {
      console.log('🎉 Admin seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}

export { seedAdminUser }