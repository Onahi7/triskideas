import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { categories } from "../lib/schema"

async function seed() {
  const sql = neon(process.env.DATABASE_URL!)
  const db = drizzle(sql)

  console.log("Seeding database...")

  try {
    // Create sample categories
    await db.insert(categories).values([
      { name: "Personal Development", slug: "personal-development", description: "Articles about personal growth" },
      { name: "Medicine & Health", slug: "medicine-health", description: "Medical insights and wellness" },
      { name: "Art & Creativity", slug: "art-creativity", description: "Exploring artistic expression" },
      { name: "Philosophy", slug: "philosophy", description: "Philosophical perspectives" },
    ])

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Seeding error:", error)
  }
}

seed()
