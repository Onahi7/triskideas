import { db } from "../lib/db"
import { pageLayouts } from "../lib/schema"

async function testPageLayouts() {
  try {
    console.log("Testing page_layouts table...")
    const result = await db.select().from(pageLayouts).limit(5)
    console.log("✅ Table exists! Found", result.length, "layouts")
    console.log(result)
  } catch (error) {
    console.error("❌ Error:", error)
    if (error instanceof Error && error.message.includes("does not exist")) {
      console.log("\n⚠️  Please run the migration:")
      console.log("psql -U [username] -d [database] -f scripts/add-page-layouts.sql")
    }
  }
  process.exit(0)
}

testPageLayouts()
