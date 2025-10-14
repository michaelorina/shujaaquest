import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShujaaQuest - Kenyan Heroes Quiz Game",
  description: "Test your knowledge of Kenyan heroes with AI-generated questions! Play ShujaaQuest and learn about famous Kenyans in a fun, interactive way. Built for the National TVET AI Hackathon.",
  keywords: ["Kenyan heroes", "quiz game", "AI", "education", "Kenya", "history", "shujaas"],
  authors: [{ name: "ShujaaQuest Team" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "ShujaaQuest - Kenyan Heroes Quiz Game",
    description: "How well do you know your shujaas? Test your knowledge with AI-generated questions about Kenyan heroes!",
    type: "website",
    locale: "en_KE",
    siteName: "ShujaaQuest",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShujaaQuest - Kenyan Heroes Quiz Game",
    description: "Test your knowledge of Kenyan heroes with AI-generated questions!",
    creator: "@shujaaquest",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
