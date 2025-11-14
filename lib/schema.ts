import { pgTable, serial, text, timestamp, boolean, varchar, integer, decimal, pgEnum } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: varchar("email", { length: 255 }).unique(),
  fullName: varchar("full_name", { length: 255 }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatarUrl: text("avatar_url"),
  role: varchar("role", { length: 50 }).default("reader"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  richContent: text("rich_content"), // TipTap editor content
  imageUrl: text("image_url"),
  category: varchar("category", { length: 100 }).default("Uncategorized"),
  author: varchar("author", { length: 255 }).notNull(),
  readTimeMinutes: integer("read_time_minutes").default(5),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  viewCount: integer("view_count").default(0),
  seoDescription: text("seo_description"),
})

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
})

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const eventTypeEnum = pgEnum("event_type", ["free", "paid"])

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  richContent: text("rich_content"), // TipTap editor content
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: varchar("location", { length: 255 }),
  capacity: integer("capacity"),
  eventType: eventTypeEnum("event_type").default("free").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"), // pending, completed, failed
  stripeTransactionId: text("stripe_transaction_id"),
  registeredAt: timestamp("registered_at").defaultNow(),
})

export const emailLogs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // post, event
  contentId: integer("content_id").notNull(),
  contentTitle: varchar("content_title", { length: 255 }).notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
})

export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id")
    .notNull()
    .references(() => series.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  episodeNumber: integer("episode_number").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  richContent: text("rich_content"),
  imageUrl: text("image_url"),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  viewCount: integer("view_count").default(0),
})

export const postsCategoriesRelation = pgTable("posts_categories", {
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
})

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  parentId: integer("parent_id"), // For replies
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  website: varchar("website", { length: 255 }),
  content: text("content").notNull(),
  approved: boolean("approved").default(false),
  notifyOnReplies: boolean("notify_on_replies").default(false),
  visibilityToken: varchar("visibility_token", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
})

export const newsletterPopups = pgTable("newsletter_popups", {
  id: serial("id").primaryKey(),
  visitorId: varchar("visitor_id", { length: 255 }).notNull().unique(), // Browser fingerprint/cookie
  lastShown: timestamp("last_shown").notNull(),
  showCount: integer("show_count").default(0),
})

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type AdminUser = typeof adminUsers.$inferSelect
export type InsertAdminUser = typeof adminUsers.$inferInsert
export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
export type UserSession = typeof userSessions.$inferSelect
export type InsertUserSession = typeof userSessions.$inferInsert
export type Post = typeof posts.$inferSelect
export type InsertPost = typeof posts.$inferInsert
export type Subscriber = typeof subscribers.$inferSelect
export type InsertSubscriber = typeof subscribers.$inferInsert
export type Category = typeof categories.$inferSelect
export type InsertCategory = typeof categories.$inferInsert
export type Event = typeof events.$inferSelect
export type InsertEvent = typeof events.$inferInsert
export type EventRegistration = typeof eventRegistrations.$inferSelect
export type InsertEventRegistration = typeof eventRegistrations.$inferInsert
export type EmailLog = typeof emailLogs.$inferSelect

export type Series = typeof series.$inferSelect
export type InsertSeries = typeof series.$inferInsert
export type Episode = typeof episodes.$inferSelect
export type InsertEpisode = typeof episodes.$inferInsert
export type Comment = typeof comments.$inferSelect
export type InsertComment = typeof comments.$inferInsert
export type NewsletterPopup = typeof newsletterPopups.$inferSelect
export type InsertNewsletterPopup = typeof newsletterPopups.$inferInsert
export type SiteSetting = typeof siteSettings.$inferSelect
export type InsertSiteSetting = typeof siteSettings.$inferInsert

export const insertAdminUserSchema = createInsertSchema(adminUsers)
export const insertUserSchema = createInsertSchema(users)
export const insertPostSchema = createInsertSchema(posts)
export const insertSubscriberSchema = createInsertSchema(subscribers)
export const insertCategorySchema = createInsertSchema(categories)
export const insertEventSchema = createInsertSchema(events)
export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations)
export const insertSeriesSchema = createInsertSchema(series)
export const insertEpisodeSchema = createInsertSchema(episodes)
export const insertCommentSchema = createInsertSchema(comments)
