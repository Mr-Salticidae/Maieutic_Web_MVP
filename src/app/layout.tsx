import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maieutic",
  description: "一个陪你把问题想清楚的 AI 共学者"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
