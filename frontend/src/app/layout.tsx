import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
// Temporarily commented out to test if this is causing the error
// import { TwentyFirstToolbar } from "@21st-extension/toolbar-next";
// import { ReactPlugin } from "@21st-extension/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Добрые дела Росатома",
  description: "Единый портал для жителей, волонтёров и НКО, где собрана вся информация о социальных, экологических, культурных, образовательных и спортивных инициативах в городах присутствия Росатома.",
  keywords: "Росатом, добрые дела, волонтерство, НКО, социальные проекты, экология, образование, культура, спорт",
  authors: [{ name: "Государственная корпорация по атомной энергии Росатом" }],
  creator: "Росатом",
  publisher: "Росатом",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rosatom-gooddeeds.ru'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Добрые дела Росатома",
    description: "Единый портал для жителей, волонтёров и НКО, где собрана вся информация о социальных инициативах в городах присутствия Росатома.",
    url: 'https://rosatom-gooddeeds.ru',
    siteName: "Добрые дела Росатома",
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Добрые дела Росатома",
    description: "Единый портал для жителей, волонтёров и НКО, где собрана вся информация о социальных инициативах в городах присутствия Росатома.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* Temporarily commented out to test if this is causing the error */}
        {/* <TwentyFirstToolbar
          config={{
            plugins: [ReactPlugin],
          }}
        /> */}
      </body>
    </html>
  );
}