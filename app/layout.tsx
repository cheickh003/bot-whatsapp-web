import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bot WhatsApp Admin",
  description: "Interface d'administration pour le bot WhatsApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-background antialiased">
        {children}
      </body>
    </html>
  );
}