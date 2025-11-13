import Script from 'next/script'

interface StructuredDataProps {
  data: object
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id={`structured-data-${Math.random()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  )
}

export function WebsiteStructuredData() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TRISKIDEAS - The Mind\'s Fruit',
    url: 'https://triskideas.com',
    description: 'Explore ideas about human potential, personal development, and making positive change. By Dr. Ferdinand Ibu Ogbaji',
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: 'Dr. Ferdinand Ibu Ogbaji',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TRISKIDEAS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://triskideas.com/Gemini_Generated_Image_koz312koz312koz3.png',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://triskideas.com/blog?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return <StructuredData data={websiteSchema} />
}