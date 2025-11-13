import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'TRISKIDEAS'
  const description = searchParams.get('description') || 'The Mind\'s Fruit'
  const author = searchParams.get('author') || 'Dr. Ferdinand Ibu Ogbaji'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fffbeb',
          backgroundImage: 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        {/* Logo/Brand Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              backgroundColor: '#d97706',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              marginRight: 20,
            }}
          >
            ✨
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 'bold',
              color: '#92400e',
            }}
          >
            TRISKIDEAS
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            margin: '0 80px',
            fontSize: 48,
            fontWeight: 'bold',
            color: '#92400e',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: 20,
          }}
        >
          {title}
        </div>

        {/* Description */}
        {description && description !== 'The Mind\'s Fruit' && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              margin: '0 100px',
              fontSize: 24,
              color: '#a16207',
              textAlign: 'center',
              lineHeight: 1.3,
              marginBottom: 30,
            }}
          >
            {description.substring(0, 120)}...
          </div>
        )}

        {/* Author */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 20,
            color: '#a16207',
          }}
        >
          By {author}
        </div>

        {/* Bottom Brand */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            fontSize: 18,
            color: '#a16207',
            opacity: 0.8,
          }}
        >
          The Mind's Fruit
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}