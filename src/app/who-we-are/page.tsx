"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Footer from "@/components/footer";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import {
  Heart,
  Target,
  Eye,
  Shield,
  Users,
  Star,
  ArrowRight,
} from "lucide-react";

export default function WhoWeAre() {
  const { openSignIn } = useClerk();

  const handleStartClaim = () => {
    openSignIn();
  };

  const values = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Our Mission",
      description:
        "To simplify the accident claim process and help victims recover the compensation they deserve through innovative technology and expert legal support.",
    },
    {
      icon: <Eye className="w-8 h-8 text-green-600" />,
      title: "Our Vision",
      description:
        "To become the leading platform for accident victims, providing seamless access to legal resources and ensuring fair compensation for all.",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Our Values",
      description:
        "We are committed to transparency, integrity, and putting our clients first. We believe in making legal support accessible to everyone.",
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "Our Support",
      description:
        "Our dedicated team is available to assist you throughout your recovery journey, providing personalized support and guidance.",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col pt-24"
      style={{
        backgroundImage: "url('/images/long-logo-ClaimSaver.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Content with background overlay for better readability */}
      <div className="relative w-full flex-1">
        {/* Background overlay for better readability - only on content */}
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 w-full">
          {/* Hero Section */}
          <section className="relative overflow-hidden animate-in fade-in duration-800">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-800 delay-200">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Your Trusted Partner in{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Accident Recovery
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  We understand that dealing with the aftermath of an accident
                  can be overwhelming. That&apos;s why we&apos;ve created a
                  revolutionary platform that connects you with experienced
                  attorneys in Florida and New York.
                </p>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-20 animate-in fade-in duration-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="animate-in fade-in slide-in-from-left-4 duration-600">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    About ClaimSaver+
                  </h2>
                  <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      ClaimSaver+ is a revolutionary platform designed to
                      simplify the process of filing no-fault accident forms and
                      recovering compensation for accident victims. We
                      understand that dealing with the aftermath of an accident
                      can be overwhelming, which is why we&apos;ve created a
                      user-friendly solution that connects you with experienced
                      attorneys in Florida and New York.
                    </p>
                    <p>
                      Our platform combines cutting-edge technology with expert
                      legal knowledge to ensure that you receive the support and
                      compensation you deserve. We believe that everyone should
                      have access to quality legal representation, regardless of
                      their circumstances.
                    </p>
                    <p>
                      At ClaimSaver+, we&apos;re committed to making the legal
                      process as smooth and stress-free as possible. Our team of
                      professionals works tirelessly to ensure that your case
                      receives the attention it deserves, and we&apos;re here to
                      guide you every step of the way.
                    </p>
                  </div>
                </div>

                <div className="relative animate-in fade-in slide-in-from-right-4 duration-600 delay-200">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                    <Image
                      src="/images/family.jpg"
                      alt="ClaimSaver+ Family"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Family First
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Family Story Section */}
          <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 animate-in fade-in duration-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-600">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Family Story
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                  ClaimSaver+ was born from a personal experience that changed
                  our family forever.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-600 delay-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          A Personal Journey
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          After our family faced the challenges of navigating
                          the complex world of accident claims and legal fees,
                          we realized there had to be a better way.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          Our Mission
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          To make quality legal support accessible and
                          affordable for every family. We believe that when life
                          throws unexpected challenges your way, you
                          shouldn&apos;t have to worry about the cost of getting
                          the help you deserve.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <Star className="w-6 h-6" />
                        <h3 className="text-xl font-semibold">Why We Care</h3>
                      </div>
                      <p className="text-blue-100 leading-relaxed">
                        &ldquo;We created this platform to help families like
                        ours avoid the financial burden of traditional legal
                        services during already difficult times.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className="py-20 animate-in fade-in duration-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-600">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Core Values
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  The principles that guide everything we do at ClaimSaver+
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-600"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card className="h-full shadow-lg border-blue-100 dark:border-blue-900 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                      <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                          {value.icon}
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                          {value.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 animate-in fade-in duration-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-600">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of families who have trusted ClaimSaver+ to
                  help them recover the compensation they deserve.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-200"
                    onClick={handleStartClaim}
                  >
                    Start Your Claim
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Link href="/what-we-do">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
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
