import { getPostBySlug } from '@/lib/db-actions'

export const runtime = 'edge'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    
    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    const title = post.title
    const description = post.excerpt || post.content.substring(0, 150)
    const author = post.author || 'Dr. Ferdinand Ibu Ogbaji'
    const publishedDate = new Date(post.createdAt || new Date()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const html = `
      <div style="
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        background: linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%);
        padding: 60px;
        font-family: system-ui;
      ">
        <div style="
          display: flex;
          align-items: center;
          margin-bottom: 40px;
        ">
          <div style="
            width: 60px;
            height: 60px;
            background-color: #d97706;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            margin-right: 20px;
          ">✨</div>
          <div style="
            font-size: 28px;
            font-weight: bold;
            color: #92400e;
          ">TRISKIDEAS</div>
        </div>

        <div style="
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        ">
          <div style="
            font-size: 54px;
            font-weight: bold;
            color: #92400e;
            line-height: 1.1;
            margin-bottom: 30px;
            max-width: 100%;
          ">${title.length > 80 ? title.substring(0, 77) + '...' : title}</div>

          <div style="
            font-size: 24px;
            color: #a16207;
            line-height: 1.4;
            margin-bottom: 40px;
            max-width: 90%;
          ">${description.length > 200 ? description.substring(0, 197) + '...' : description}</div>

          ${post.category ? `
          <div style="
            display: inline-flex;
            background-color: #d97706;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 20px;
            width: fit-content;
          ">${post.category}</div>
          ` : ''}
        </div>

        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          font-size: 18px;
          color: #a16207;
        ">
          <div style="display: flex; align-items: center;">
            <div style="margin-right: 20px;">By ${author}</div>
            <div>${publishedDate}</div>
          </div>
          <div style="font-style: italic;">The Mind's Fruit</div>
        </div>
      </div>
    `

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Error generating image', { status: 500 })
  }
}