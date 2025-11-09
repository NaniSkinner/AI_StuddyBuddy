import type { Metadata } from "next";
import {
  Caveat,
  Patrick_Hand,
  Comic_Neue,
  Indie_Flower,
} from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

// Hand-lettered font for headings and playful emphasis
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hand",
  display: "swap",
});

// Readable handwriting for body text
const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sketch",
  display: "swap",
});

// Friendly comic style for AI messages
const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-comic",
  display: "swap",
});

// Extra playful for decorative elements
const indieFlower = Indie_Flower({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-indie",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Study Companion",
  description:
    "Your persistent, context-aware tutoring assistant designed to help K-12 students learn and grow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${patrickHand.variable} ${caveat.variable} ${comicNeue.variable} ${indieFlower.variable} font-sketch bg-doodle-cream flex flex-col min-h-screen`}
      >
        {/* Skip to main content link for keyboard navigation */}
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
