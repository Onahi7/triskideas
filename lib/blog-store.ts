export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  featured: boolean
  imageUrl?: string
}

export interface AdminUser {
  id: string
  username: string
  password: string
}

const BLOG_STORAGE_KEY = "blog_posts"
const ADMIN_STORAGE_KEY = "admin_users"

// Sample posts to start with
const SAMPLE_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Unleashing Your God-Given Abilities",
    slug: "unleashing-god-given-abilities",
    excerpt: "Discover how to unlock your potential and make a positive impact in the world.",
    content: `As a medical doctor and artist, I\'ve learned that every person possesses unique gifts waiting to be discovered. 
    
Our abilities are not just talents—they are divine gifts meant to be expressed and shared with the world. Too often, we underestimate our potential or hesitate to pursue our passions.

In this piece, I explore how to identify your unique abilities, overcome limiting beliefs, and take bold action to make a meaningful difference. Whether it's through medicine, art, writing, or any other field, your contributions matter.

The journey to unleashing your potential begins with self-awareness. Take time to reflect on what brings you joy, what comes naturally to you, and what impact you want to make. Then, take consistent action.`,
    author: "Dr. Ferdinand Ibu Ogbaji",
    publishedAt: "2024-11-10",
    featured: true,
    imageUrl: "/spiritual-enlightenment-and-potential.jpg",
  },
  {
    id: "2",
    title: "The Intersection of Medicine and Art",
    slug: "medicine-and-art",
    excerpt: "How creative expression enhances healing and human connection in medical practice.",
    content: `Being both a medical doctor and an artist has taught me that these two fields are not opposites—they are complementary expressions of human creativity and compassion.

In medicine, we heal bodies. In art, we heal spirits. Both require deep observation, empathy, and a commitment to understanding what it means to be human.

This reflection explores how artistic thinking enhances clinical practice, how creativity fosters innovation in healthcare, and how medical professionals benefit from pursuing artistic pursuits.`,
    author: "Dr. Ferdinand Ibu Ogbaji",
    publishedAt: "2024-11-08",
    featured: true,
    imageUrl: "/art-and-medicine-healing.jpg",
  },
]

export function initializeBlogStore() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(BLOG_STORAGE_KEY)) {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(SAMPLE_POSTS))
  }

  if (!localStorage.getItem(ADMIN_STORAGE_KEY)) {
    const defaultAdmin: AdminUser = {
      id: "1",
      username: "admin",
      password: "admin123",
    }
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify([defaultAdmin]))
  }
}

export function getAllPosts(): BlogPost[] {
  if (typeof window === "undefined") return SAMPLE_POSTS
  const stored = localStorage.getItem(BLOG_STORAGE_KEY)
  return stored ? JSON.parse(stored) : SAMPLE_POSTS
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug)
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts()
    .filter((post) => post.featured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function createPost(post: Omit<BlogPost, "id">): BlogPost {
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
  }
  const posts = getAllPosts()
  posts.unshift(newPost)
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts))
  return newPost
}

export function updatePost(id: string, updates: Partial<BlogPost>): BlogPost | null {
  const posts = getAllPosts()
  const index = posts.findIndex((p) => p.id === id)
  if (index === -1) return null

  posts[index] = { ...posts[index], ...updates }
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts))
  return posts[index]
}

export function deletePost(id: string): boolean {
  const posts = getAllPosts()
  const filtered = posts.filter((p) => p.id !== id)
  if (filtered.length === posts.length) return false
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(filtered))
  return true
}

export function verifyAdmin(username: string, password: string): boolean {
  if (typeof window === "undefined") return false
  const admins = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || "[]") as AdminUser[]
  return admins.some((a) => a.username === username && a.password === password)
}
