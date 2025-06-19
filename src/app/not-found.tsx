import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found | ClaimSaver+</title>
        <meta name="description" content="Page not found" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-blue-950 flex items-center justify-center px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Page Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Sorry, the page you&apos;re looking for doesn&apos;t exist. It
                might have been moved or deleted.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>

              <Link
                href="/who-we-are"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
