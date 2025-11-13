export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'TRISKIDEAS'
  const description = searchParams.get('description') || 'The Mind\'s Fruit'
  const author = searchParams.get('author') || 'Dr. Ferdinand Ibu Ogbaji'

  const html = `
    <div style="
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%);
      font-family: system-ui;
    ">
      <div style="
        display: flex;
        align-items: center;
        margin-bottom: 40px;
      ">
        <div style="
          width: 80px;
          height: 80px;
          background-color: #d97706;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin-right: 20px;
        ">✨</div>
        <div style="
          font-size: 36px;
          font-weight: bold;
          color: #92400e;
        ">TRISKIDEAS</div>
      </div>

      <div style="
        font-size: 48px;
        font-weight: bold;
        color: #92400e;
        text-align: center;
        line-height: 1.2;
        margin: 0 80px 20px;
      ">${title}</div>

      ${description && description !== 'The Mind\'s Fruit' ? `
      <div style="
        font-size: 24px;
        color: #a16207;
        text-align: center;
        line-height: 1.3;
        margin: 0 100px 30px;
      ">${description.substring(0, 120)}...</div>
      ` : ''}

      <div style="
        font-size: 20px;
        color: #a16207;
      ">By ${author}</div>

      <div style="
        position: absolute;
        bottom: 40px;
        right: 40px;
        font-size: 18px;
        color: #a16207;
        opacity: 0.8;
      ">The Mind's Fruit</div>
    </div>
  `

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}