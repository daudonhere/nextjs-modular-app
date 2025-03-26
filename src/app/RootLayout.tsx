"use client";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </head>
            <SpeedInsights/>
            <body className="max-w-screen overflow-x-hidden">
                {children}
            </body>
        </html>
    );
}
