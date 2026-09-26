import { Geist, Geist_Mono, Sora } from "next/font/google";
import { Web3Provider } from "@/providers/web3-provider";
import { LangProvider } from "@/lib/lang";
import { Navbar } from "@/components/navbar";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${sora.variable}`}
    >
      <body className="antialiased font-sans">
        <Web3Provider>
          <LangProvider>
            <Navbar />
            {children}
          </LangProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
