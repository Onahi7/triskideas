import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/db-actions'

export async function GET(request: NextRequest) {
  try {
    const posts = await getAllPosts()
    const baseUrl = 'https://triskideas.com'

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
  <channel>
    <title>TRISKIDEAS - The Mind's Fruit</title>
    <link>${baseUrl}</link>
    <description>Explore ideas about human potential, personal development, and making positive change. By Dr. Ferdinand Ibu Ogbaji</description>
    <language>en-US</language>
    <managingEditor>contact@triskideas.com (Dr. Ferdinand Ibu Ogbaji)</managingEditor>
    <webMaster>contact@triskideas.com (Dr. Ferdinand Ibu Ogbaji)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    <sy:updatePeriod>daily</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <image>
      <url>${baseUrl}/Gemini_Generated_Image_koz312koz312koz3.png</url>
      <title>TRISKIDEAS - The Mind's Fruit</title>
      <link>${baseUrl}</link>
      <width>512</width>
      <height>512</height>
    </image>
    ${posts
      .slice(0, 20) // Limit to 20 most recent posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200)}...]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <dc:creator><![CDATA[${post.author || 'Dr. Ferdinand Ibu Ogbaji'}]]></dc:creator>
      <pubDate>${new Date(post.createdAt || post.publishedAt || new Date()).toUTCString()}</pubDate>
      <guid isPermaLink="false">${baseUrl}/blog/${post.slug}</guid>
      ${post.imageUrl ? `<enclosure url="${baseUrl}${post.imageUrl}" type="image/jpeg" />` : ''}
      ${post.category ? `<category><![CDATA[${post.category}]]></category>` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}