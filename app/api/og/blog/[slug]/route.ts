import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/db-actions'

export const runtime = 'edge'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await getPostBySlug(params.slug)
    
    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    const title = post.title
    const description = post.excerpt || post.content.substring(0, 150)
    const author = post.author || 'Dr. Ferdinand Ibu Ogbaji'
    const publishedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#fffbeb',
            backgroundImage: 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)',
            padding: '60px',
            fontFamily: 'system-ui',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: '#d97706',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
                marginRight: 20,
              }}
            >
              ✨
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: '#92400e',
              }}
            >
              TRISKIDEAS
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Title */}
            <div
              style={{
                fontSize: 54,
                fontWeight: 'bold',
                color: '#92400e',
                lineHeight: 1.1,
                marginBottom: 30,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title.length > 80 ? title.substring(0, 77) + '...' : title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 24,
                color: '#a16207',
                lineHeight: 1.4,
                marginBottom: 40,
                maxWidth: '90%',
              }}
            >
              {description.length > 200 ? description.substring(0, 197) + '...' : description}
            </div>

            {/* Category Badge */}
            {post.category && (
              <div
                style={{
                  display: 'inline-flex',
                  backgroundColor: '#d97706',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginBottom: 20,
                  width: 'fit-content',
                }}
              >
                {post.category}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              fontSize: 18,
              color: '#a16207',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: 20 }}>By {author}</div>
              <div>{publishedDate}</div>
            </div>
            <div style={{ fontStyle: 'italic' }}>The Mind's Fruit</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Error generating image', { status: 500 })
  }
}