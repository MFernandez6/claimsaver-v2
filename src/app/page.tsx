"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/footer";
import { useClerk } from "@clerk/nextjs";

export default function Home() {
  const { openSignIn } = useClerk();

  const handleGetStarted = () => {
    openSignIn();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/images/long-logo-ClaimSaver.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Content with background overlay for better readability */}
      <div className="relative w-full flex-1 px-4 sm:px-8 pt-24 pb-8">
        {/* Background overlay for better readability - only on content */}
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 w-full">
          {/* Hero Section with Video */}
          <header className="w-full max-w-6xl mx-auto flex flex-col items-center text-center gap-8 mt-12 mb-16">
            <div className="mb-4">
              <h1
                className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 bg-clip-text text-transparent drop-shadow-lg animate-pulse"
                style={{ animationDuration: "3s" }}
              >
                ClaimSaver+
              </h1>
            </div>

            {/* Video Section */}
            <div className="w-full max-w-4xl mx-auto mb-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 dark:border-gray-800/20">
                <video
                  autoPlay
                  loop
                  playsInline
                  controls
                  className="w-full h-auto"
                  style={{ maxHeight: "60vh" }}
                >
                  <source src="/video/Whiteboard.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Video overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
              Accident Form Filing and Recovery App
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              ClaimSaver+ is a user-friendly application that simplifies the
              process of filing no-fault accident forms and recovering
              compensation. Connect with experienced attorneys nationwide and
              get professional assistance every step of the way.
            </p>
            <Button
              size="lg"
              className="mt-4 px-8 py-6 text-lg font-semibold shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </header>

          {/* Features Section */}
          <section className="w-full max-w-5xl mx-auto mb-24">
            {/* First row - 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              <Card className="shadow-lg border-blue-100 dark:border-blue-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-300">
                    No-Fault Accident Form Filing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Easily fill out and submit no-fault accident forms. Input
                    accident details, personal info, and securely upload
                    supporting documents for a streamlined, efficient process.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-blue-100 dark:border-blue-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-300">
                    Attorney Matching
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get matched with specialized attorneys nationwide. Our
                    intelligent algorithms pair you with legal experts tailored
                    to your unique case needs.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-blue-100 dark:border-blue-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-300">
                    Secure Document Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Upload, store, and share all your accident-related documents
                    securely. Keep everything organized and accessible for you
                    and your attorney.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Second row - 2 centered cards */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                <Card className="shadow-lg border-blue-100 dark:border-blue-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-blue-700 dark:text-blue-300">
                      Real-Time Case Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Stay informed with real-time updates from your attorney.
                      Receive notifications on new developments, hearing dates,
                      and requests for information.
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-blue-100 dark:border-blue-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-blue-700 dark:text-blue-300">
                      Recovery Assistance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our network of attorneys works to negotiate fair
                      compensation for medical expenses, property damage, lost
                      wages, and more.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
