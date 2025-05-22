import "./globals.css";
import { AppProviders } from "./providers";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <div className="min-h-screen bg-gray-50">
            <Link href="/" className="block py-6 text-center">
              <h1 className="text-3xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                Real Time Sales Analytics Dashboard
              </h1>
            </Link>
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
