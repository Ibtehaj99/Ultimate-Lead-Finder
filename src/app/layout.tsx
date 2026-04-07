import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google"; // Added Outfit
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" }); // Added variable
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" }); // Added Outfit config

export const metadata: Metadata = {
    title: "Ultimate Lead Finder",
    description: "Find high-quality business leads and analyze website needs instantly.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(manrope.variable, outfit.variable, "font-sans antialiased min-h-screen bg-background text-foreground")}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
