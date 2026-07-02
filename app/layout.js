import './globals.css';

export const metadata = {
  title: 'Chokoraa Movement – Ol Kalou By-Election',
  description:
    'Join the Chokoraa Movement for the Ol Kalou By-Election. Contribute KSh 10 and be part of history. They called us Chokoraa. We turned it into a movement.',
  keywords: 'Chokoraa, Ol Kalou, By-Election, Movement, Kaimbaga, Rurii, Karau, Mirangine',
  openGraph: {
    title: 'Chokoraa Movement – Ol Kalou By-Election',
    description: 'Join with only KSh 10. They called us Chokoraa. We turned it into a movement.',
    type: 'website',
    url: 'https://chokoraa.co.ke',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        {children}
      </body>
    </html>
  );
}
