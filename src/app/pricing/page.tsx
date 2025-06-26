"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import { useClerk } from "@clerk/nextjs";
import {
  CheckCircle,
  X,
  TrendingUp,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Calculator,
  Award,
  Users,
} from "lucide-react";

export default function Pricing() {
  const { openSignIn } = useClerk();

  const handleStartClaim = () => {
    openSignIn();
  };

  const traditionalCosts = [
    "Average auto policy: $10,000",
    "Attorney contingency fee: 33%",
    "Net to victim: Less than $7,000",
    "Additional processing costs",
    "Hidden fees and charges",
  ];

  const claimSaverAdvantages = [
    "Keep 95% of your settlement",
    "No contingency fees",
    "Transparent flat rate",
    "Professional service",
    "Maximum recovery for you",
  ];

  const features = [
    {
      icon: <Calculator className="w-6 h-6 text-blue-600" />,
      title: "Transparent Pricing",
      description:
        "No hidden fees, no surprises. Know exactly what you'll pay upfront.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      title: "Maximum Recovery",
      description: "Keep more of your settlement with our flat-rate structure.",
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "Professional Service",
      description:
        "Expert legal support without the traditional attorney fees.",
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      title: "Faster Processing",
      description:
        "Streamlined process gets you results faster than traditional methods.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      location: "Miami, FL",
      text: "ClaimSaver+ saved me thousands compared to traditional attorney fees. The flat rate was exactly what I needed.",
      rating: 5,
    },
    {
      name: "Michael R.",
      location: "Orlando, FL",
      text: "Transparent pricing and professional service. I kept 95% of my settlement instead of just 67%.",
      rating: 5,
    },
    {
      name: "Jennifer L.",
      location: "Tampa, FL",
      text: "The process was so much simpler and more affordable than I expected. Highly recommend!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <img
            src="/images/long-logo-ClaimSaver.jpg"
            alt="ClaimSaver+ Background"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/80 to-indigo-50/70 dark:from-gray-950/70 dark:via-gray-900/80 dark:to-blue-950/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Transparent, Fair, and{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cost-Effective
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              More Money in Your Pocket, Less Stress in Your Life
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={handleStartClaim}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Claim
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Learn More
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
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
              The{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ClaimSaver+ Advantage
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how our transparent pricing puts more money back in your
              pocket
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traditional Costs */}
            <Card className="h-full shadow-lg border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <X className="w-8 h-8 text-red-600" />
                  <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Traditional Costs
                  </CardTitle>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    $3,000+
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Average fees and costs
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {traditionalCosts.map((cost, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {cost}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                    Net to victim: Less than $7,000
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ClaimSaver+ Advantage */}
            <Card className="h-full shadow-xl border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 text-sm font-semibold rounded-bl-lg">
                RECOMMENDED
              </div>
              <CardHeader className="text-center pb-4 pt-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ClaimSaver+ Advantage
                  </CardTitle>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    $500
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    One-time flat fee
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {claimSaverAdvantages.map((advantage, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {advantage}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                    Net to victim: Keep 95% of settlement
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 relative overflow-hidden">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <img
            src="/images/long-logo-ClaimSaver.jpg"
            alt="ClaimSaver+ Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-950/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ClaimSaver+?
                </span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  In Florida, the average auto policy payout is $10,000. With
                  traditional methods, after a 33% attorney contingency fee,
                  victims are left with less than $7,000 before additional
                  processing costs.
                </p>
                <p>
                  ClaimSaver+ revolutionizes this process with our flat $500
                  fee, allowing you to keep 95% of your settlement.
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Calculator className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Savings Calculator
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Traditional Attorney Fee (33%)</span>
                      <span className="font-semibold text-red-600">
                        -$3,300
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ClaimSaver+ Flat Fee</span>
                      <span className="font-semibold text-green-600">
                        -$500
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Your Savings</span>
                      <span className="text-green-600">+$2,800</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              What Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Clients Say
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real stories from real people who saved thousands with ClaimSaver+
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.location}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Save Thousands?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of accident victims who have used ClaimSaver+ to
            maximize their recovery. Get started today with our transparent
            flat-rate pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={handleStartClaim}
            >
              Start Your Claim
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Learn More
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-blue-100">
              <Award className="w-5 h-5" />
              <span className="font-semibold">
                Flat fee $500 • No hidden costs • Keep 95% of settlement
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
