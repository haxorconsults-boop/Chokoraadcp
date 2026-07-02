import './globals.css';

export const metadata = {
  title: 'Chokoraa Movement – Ol Kalou By-Election 2026 | Join with KSh 10',
  description:
    'Join the Chokoraa Movement for the Ol Kalou By-Election on July 16, 2026. Contribute just KSh 10 and stand with Sammy Douglas Kamau Waweru (DCP). They called us Chokoraa. We turned it into a movement. Over 45,000 supporters strong.',
  keywords: 'Chokoraa, Chokoraa Movement, Ol Kalou By-Election, DCP, Sammy Douglas Kamau Waweru, Kaimbaga, Rurii, Karau, Mirangine, Nyandarua, Kenya elections 2026, grassroots movement Kenya',
  authors: [{ name: 'Chokoraa Movement' }],
  creator: 'Chokoraa Movement',
  publisher: 'Chokoraa Movement',
  metadataBase: new URL('https://www.chokaraa.top'),
  alternates: {
    canonical: 'https://www.chokaraa.top',
  },
  openGraph: {
    title: 'Chokoraa Movement – Ol Kalou By-Election 2026',
    description: 'Join with only KSh 10. They called us Chokoraa. We turned it into a movement. Vote DCP on July 16th.',
    type: 'website',
    url: 'https://www.chokaraa.top',
    siteName: 'Chokoraa Movement',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chokoraa Movement – Ol Kalou By-Election 2026',
    description: 'Join with only KSh 10. Over 45,000 supporters. Vote DCP on July 16th.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {},
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#6f161e',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}

        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "Ol Kalou By-Election 2026 – Chokoraa Movement",
              "description": "Join the Chokoraa Movement for the Ol Kalou By-Election. Contribute KSh 10 and become part of the most powerful grassroots movement Ol Kalou has ever seen.",
              "startDate": "2026-07-16",
              "endDate": "2026-07-16",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "location": {
                "@type": "Place",
                "name": "Ol Kalou Constituency",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Ol Kalou",
                  "addressRegion": "Nyandarua",
                  "addressCountry": "KE"
                }
              },
              "organizer": {
                "@type": "Organization",
                "name": "Chokoraa Movement",
                "url": "https://www.chokaraa.top"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
