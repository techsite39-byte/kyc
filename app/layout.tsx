import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "KeystoneID | Identity verification demo", description: "A professional demo identity verification experience." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
