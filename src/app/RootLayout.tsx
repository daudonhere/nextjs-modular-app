"use client";
import LoadingComponent from "@/components/Loading";
import useLoading from "@/services/useLoading";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const loading = useLoading();

    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </head>
            <body className="max-w-screen overflow-x-hidden">
                <LoadingComponent isLoading={loading} />
                <div className={`transition-opacity ${loading ? 'opacity-30' : 'opacity-100'}`}>
                    {children}
                </div>
            </body>
        </html>
    );
}
