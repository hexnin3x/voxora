import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voxora - AI Receptionists & Voice Agents",
  description: "Premium AI voice receptionists and conversational agents that answer calls, qualify leads, and schedule appointments 24/7.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://voxora.ai"),
  openGraph: {
    title: "Voxora - AI Receptionists & Voice Agents",
    description: "Premium AI voice receptionists and conversational agents that answer calls, qualify leads, and schedule appointments 24/7.",
    url: "/",
    siteName: "Voxora",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Voxora AI Voice Agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voxora - AI Receptionists & Voice Agents",
    description: "Premium AI voice receptionists and conversational agents that answer calls, qualify leads, and schedule appointments 24/7.",
    images: ["/og-image.png"],
    creator: "@voxora",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="overflow-x-clip max-w-[100vw]" suppressHydrationWarning>{children}</body>
    </html>
  );
}
