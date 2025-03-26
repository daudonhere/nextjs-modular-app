import type { Metadata } from "next";
import RootLayout from "./RootLayout";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Modular Base App",
  description: "Develop with Nextjs framework",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout>
          {children}
        </RootLayout>;
}
