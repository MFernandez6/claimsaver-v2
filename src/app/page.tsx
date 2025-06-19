import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-blue-950 flex flex-col items-center justify-between py-8 px-4 sm:px-8 pt-24">
      {/* Hero Section */}
      <header className="w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-6 mt-12 mb-16">
        <div className="flex items-center gap-3">
          <Image
            src="/favicon.ico"
            alt="ClaimSaver+ Logo"
            width={48}
            height={48}
            className="rounded-xl"
          />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
            ClaimSaver+
          </h1>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Accident Form Filing and Recovery App
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          ClaimSaver+ is a user-friendly application that simplifies the process
          of filing no-fault accident forms and recovering compensation. Connect
          with experienced attorneys nationwide and get professional assistance
          every step of the way.
        </p>
        <Button
          size="lg"
          className="mt-4 px-8 py-6 text-lg font-semibold shadow-lg"
        >
          Get Started
        </Button>
      </header>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        <Card className="shadow-md border-blue-100 dark:border-blue-900">
          <CardHeader>
            <CardTitle>No-Fault Accident Form Filing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Easily fill out and submit no-fault accident forms. Input accident
              details, personal info, and securely upload supporting documents
              for a streamlined, efficient process.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-blue-100 dark:border-blue-900">
          <CardHeader>
            <CardTitle>Attorney Matching</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Get matched with specialized attorneys nationwide. Our intelligent
              algorithms pair you with legal experts tailored to your unique
              case needs.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-blue-100 dark:border-blue-900">
          <CardHeader>
            <CardTitle>Secure Document Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Upload, store, and share all your accident-related documents
              securely. Keep everything organized and accessible for you and
              your attorney.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-blue-100 dark:border-blue-900">
          <CardHeader>
            <CardTitle>Real-Time Case Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Stay informed with real-time updates from your attorney. Receive
              notifications on new developments, hearing dates, and requests for
              information.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-blue-100 dark:border-blue-900">
          <CardHeader>
            <CardTitle>Recovery Assistance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Our network of attorneys works to negotiate fair compensation for
              medical expenses, property damage, lost wages, and more.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="w-full text-center text-gray-400 text-sm pb-4">
        &copy; {new Date().getFullYear()} ClaimSaver+. All rights reserved.
      </footer>
    </div>
  );
}
