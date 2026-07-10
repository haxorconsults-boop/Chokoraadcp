import './globals.css';

export const metadata = {
  title: 'SAMMY DOUGLAS KAMAU WAWERU - OLKALOU DCP',
  description: 'Join the Chokoraa Movement for the Ol Kalou By-Election on July 16, 2026. Contribute just KSh 10 and stand with Sammy Douglas Kamau Waweru.',
  keywords: 'Chokoraa, Chokoraa Movement, Ol Kalou By-Election, DCP, Sammy Douglas Kamau Waweru, Kaimbaga, Rurii, Karau, Mirangine, Nyandarua, Kenya elections 2026, grassroots movement Kenya',
  authors: [{ name: 'Chokoraa Movement' }],
  creator: 'Chokoraa Movement',
  publisher: 'Chokoraa Movement',
  metadataBase: new URL('https://www.chokaraa.top'),
  alternates: {
    canonical: 'https://www.chokaraa.top',
  },
  openGraph: {
    title: 'SAMMY DOUGLAS KAMAU WAWERU - OLKALOU DCP',
    description: 'Join the Chokoraa Movement for the Ol Kalou By-Election. Vote DCP on July 16th.',
    type: 'website',
    url: 'https://www.chokaraa.top',
    siteName: 'Chokoraa Movement',
    locale: 'en_KE',
    images: [
      {
        url: 'https://www.chokaraa.top/candidate-face.png',
        width: 500,
        height: 500,
        alt: 'Sammy Douglas Kamau Waweru',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAMMY DOUGLAS KAMAU WAWERU - OLKALOU DCP',
    description: 'Join the Chokoraa Movement for the Ol Kalou By-Election. Vote DCP on July 16th.',
    images: ['https://www.chokaraa.top/candidate-face.png'],
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
        {/* Hardcoded OG tags for WhatsApp/social crawlers that don't execute JS */}
        <meta property="og:title" content="SAMMY DOUGLAS KAMAU WAWERU - OLKALOU DCP" />
        <meta property="og:description" content="Join the Chokoraa Movement for the Ol Kalou By-Election. Vote DCP on July 16th." />
        <meta property="og:url" content="https://www.chokaraa.top" />
        <meta property="og:site_name" content="SAMMY DOUGLAS KAMAU WAWERU - OLKALOU DCP" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.chokaraa.top/candidate-face.png" />
        <meta property="og:image:width" content="500" />
        <meta property="og:image:height" content="500" />
        <meta property="og:image:alt" content="Sammy Douglas Kamau Waweru" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SAMMY DOUGLAS KAMAU WAWERU - OLKALOU DCP" />
        <meta name="twitter:description" content="Join the Chokoraa Movement for the Ol Kalou By-Election. Vote DCP on July 16th." />
        <meta name="twitter:image" content="https://www.chokaraa.top/candidate-face.png" />
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
