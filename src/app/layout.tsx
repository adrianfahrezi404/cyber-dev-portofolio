import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cyber.dev"),
  title: {
    default: "CYBER.DEV — Adrian Dwi Fahrezi Rizki",
    template: "%s | CYBER.DEV",
  },
  description:
    "Portfolio mahasiswa Teknik Informatika dengan fokus pada Cyber Security (Red Teaming & Bug Bounty), Artificial Intelligence, dan Web Development.",
  keywords: [
    "cybersecurity",
    "red teaming",
    "bug bounty",
    "web developer",
    "portfolio",
    "CTF",
    "penetration testing",
    "AI",
  ],
  authors: [{ name: "Adrian Dwi Fahrezi Rizki" }],
  openGraph: {
    title: "CYBER.DEV — Adrian Dwi Fahrezi Rizki",
    description:
      "Cyber Security Enthusiast | Red Teamer | Bug Bounty Hunter | Web Developer",
    type: "website",
    locale: "id_ID",
    siteName: "CYBER.DEV",
  },
  twitter: {
    card: "summary_large_image",
    title: "CYBER.DEV — Adrian Dwi Fahrezi Rizki",
    description:
      "Cyber Security Enthusiast | Red Teamer | Bug Bounty Hunter | Web Developer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
