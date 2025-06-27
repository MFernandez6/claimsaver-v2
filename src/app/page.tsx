"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/footer";
import FAQ from "@/components/faq";
import { useClerk } from "@clerk/nextjs";
import {
  Play,
  Shield,
  Users,
  FileText,
  Smartphone,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Globe,
  Award,
} from "lucide-react";

export default function Home() {
  const { openSignIn } = useClerk();

  const handleGetStarted = () => {
    openSignIn();
  };

  const faqItems = [
    {
      question: "Is this legal?",
      answer:
        "ClaimSaver+ was created by experienced legal professionals who wanted to streamline the process of accident claim filing and recovery. Our platform connects you with licensed attorneys who specialize in accident cases and are authorized to practice law in your state. We provide form filing assistance, document management, and attorney matching services that comply with all applicable laws and regulations. The attorneys in our network are independent legal professionals who will provide you with proper legal representation. As with any legal matter, it's important to work with qualified attorneys who can provide you with the legal advice and representation you need.",
    },
    {
      question: "How long does it take to get matched with an attorney?",
      answer:
        "We provide instant matching with attorneys in our network. Once you submit your claim information, we'll connect you with qualified attorneys in your area who specialize in accident cases. You can expect to hear from an attorney within 24-48 hours.",
    },
    {
      question: "What types of accidents does ClaimSaver+ handle?",
      answer:
        "ClaimSaver+ handles all types of motor vehicle accidents, including car accidents, motorcycle accidents, truck accidents, pedestrian accidents, and bicycle accidents. We focus on no-fault accident claims and help you recover compensation for medical expenses, property damage, and lost wages.",
    },
    {
      question: "Do I need to provide documents for my claim?",
      answer:
        "Yes, you'll need to provide relevant documents such as police reports, medical records, insurance information, photos of the accident scene, and any other evidence related to your case. Our secure platform makes it easy to upload and organize these documents.",
    },
    {
      question: "Is ClaimSaver+ available in all states?",
      answer:
        "ClaimSaver+ currently services Florida and New York, with additional states to be added in the future. We have attorneys licensed in these states and can help you with claims in these service areas.",
    },
    {
      question: "What if I'm not satisfied with the attorney I'm matched with?",
      answer:
        "If you're not satisfied with your initial attorney match, we can help you connect with another attorney in our network. We want to ensure you have the best possible representation for your case.",
    },
  ];

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "No-Fault Form Filing",
      description:
        "Streamlined form submission with real-time validation and instant confirmation.",
      color: "blue",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Regional Network",
      description: "Access to qualified attorneys in Florida and New York",
      color: "green",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Document Management",
      description:
        "Bank-level security for all your case documents with seamless access.",
      color: "purple",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Real-Time Updates",
      description:
        "Stay informed with instant notifications and case progress tracking.",
      color: "orange",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Recovery Assistance",
      description:
        "Our network works to negotiate fair compensation for your damages.",
      color: "red",
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Instant Processing",
      description:
        "Real-time form validation and immediate submission confirmation",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Regional Network",
      description: "Access to qualified attorneys in Florida and New York",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Proven Results",
      description:
        "Thousands of successful claims processed with high satisfaction rates",
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Premium Support",
      description: "Dedicated team available to guide you through every step",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/long-logo-ClaimSaver.jpg"
            alt="ClaimSaver+ Background"
            className="w-full h-full object-cover opacity-25"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/80 to-indigo-50/70 dark:from-gray-950/70 dark:via-gray-900/80 dark:to-blue-950/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-2xl">C+</span>
                </div>
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight">
                  ClaimSaver+
                </span>
              </div>
            </div>

            {/* Cool Decorative Line */}
            <div className="flex justify-center items-center mb-12">
              <div className="flex items-center gap-4 w-full max-w-md">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400 to-blue-600"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg"></div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-400 to-purple-600"></div>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Accident Recovery
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Connect with experienced attorneys and navigate your recovery
              journey with confidence. Get the compensation you deserve with our
              innovative platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Recovery
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Watch Demo
                <Play className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Video Section */}
            <div className="relative max-w-4xl mx-auto">
              <video
                autoPlay
                loop
                playsInline
                controls
                className="w-full h-auto rounded-2xl shadow-2xl"
                style={{ maxHeight: "50vh" }}
              >
                <source src="/video/Whiteboard.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="fixed inset-0 z-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/images/logo-blue-black.png')`,
              backgroundSize: "300px 300px",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
              opacity: 0.15,
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools and support to streamline your accident
              recovery process
            </p>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
              {/* First 3 cards */}
              {features.slice(0, 3).map((feature, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}

              {/* Last 2 cards centered */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                  {features.slice(3, 5).map((feature, index) => (
                    <Card
                      key={index + 3}
                      className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <CardHeader className="pb-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 relative overflow-hidden">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/long-logo-ClaimSaver.jpg"
            alt="ClaimSaver+ Background"
            className="w-full h-full object-cover opacity-20"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-950/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ClaimSaver+?
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                We combine cutting-edge technology with human expertise to
                deliver the most efficient and effective accident recovery
                experience.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-6">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Flat fee $500</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free consultation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Success Metrics</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">Average Recovery Time</span>
                    <span className="text-2xl font-bold">6-12 months</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">Success Rate</span>
                    <span className="text-2xl font-bold">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">Attorney Network</span>
                    <span className="text-2xl font-bold">FL & NY</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">Customer Satisfaction</span>
                    <span className="text-2xl font-bold">4.9/5</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Flat Fee
                    </p>
                    <p className="text-2xl font-bold text-green-600">$500</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ
        title="Frequently Asked Questions"
        subtitle="Get answers to the most common questions about ClaimSaver+"
        items={faqItems}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
