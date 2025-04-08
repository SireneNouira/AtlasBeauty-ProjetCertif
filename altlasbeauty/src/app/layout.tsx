import type { Metadata } from "next";
// import { Playfair_Display, Lora } from 'next/font/google';
import { Lato, Crimson_Text } from 'next/font/google';
import "./globals.css";

// Définir les polices avec des variables CSS
// const playfair = Playfair_Display({
//   subsets: ['latin'],
//   weight: ['400', '600', '700'],
//   variable: '--font-playfair',
//   display: 'swap',
// });
const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

// Texte → Crimson Text
const crimson = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-crimson',
  display: 'swap',
});
// const lora = Lora({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
//   variable: '--font-lora',
//   display: 'swap',
// });

export const metadata: Metadata = {
  title: "AtlasBeauty",
  description: "Transformer votre beauté",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${lato.variable} ${crimson.variable}`}>
      
      <body className="font-body">{children}</body>
    </html>
  );
}
