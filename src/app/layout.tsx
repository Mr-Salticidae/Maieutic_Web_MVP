import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const instrumentSans = localFont({
  src: [
    {
      path: "../../public/fonts/InstrumentSans-Regular.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../../public/fonts/InstrumentSans-Bold.ttf",
      weight: "700",
      style: "normal"
    }
  ],
  variable: "--font-sans",
  display: "swap"
});

const italiana = localFont({
  src: "../../public/fonts/Italiana-Regular.ttf",
  variable: "--font-serif",
  display: "swap"
});

const geistMono = localFont({
  src: [
    {
      path: "../../public/fonts/GeistMono-Regular.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../../public/fonts/GeistMono-Bold.ttf",
      weight: "700",
      style: "normal"
    }
  ],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Maieutic",
  description: "一个陪你把问题想清楚的 AI 共学者"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${instrumentSans.variable} ${italiana.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
