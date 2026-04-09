"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { getStripe } from "@/lib/stripe";
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  X,
  TrendingUp,
  Shield,
  Clock,
  ArrowRight,
  Calculator,
  CreditCard,
  FileText,
} from "lucide-react";

export default function Pricing() {
  const { t } = useTranslation();
  const { openSignIn } = useClerk();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleStartClaim = () => {
    openSignIn();
  };

  const traditionalCosts = [
    t("pricing.traditionalCosts.averagePolicy"),
    t("pricing.traditionalCosts.attorneyFee"),
    t("pricing.traditionalCosts.netToVictim"),
    t("pricing.traditionalCosts.additionalCosts"),
    t("pricing.traditionalCosts.hiddenFees"),
  ];

  const claimSaverAdvantages = [
    t("pricing.claimSaverAdvantages.keep95Percent"),
    t("pricing.claimSaverAdvantages.noContingency"),
    t("pricing.claimSaverAdvantages.transparentPricing"),
    t("pricing.claimSaverAdvantages.professionalService"),
    t("pricing.claimSaverAdvantages.maximumRecovery"),
  ];

  const features = [
    {
      icon: <Calculator className="w-6 h-6 text-teal-600" />,
      title: t("pricing.features.transparentPricing.title"),
      description: t("pricing.features.transparentPricing.description"),
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      title: t("pricing.features.maximumRecovery.title"),
      description: t("pricing.features.maximumRecovery.description"),
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      title: t("pricing.features.professionalService.title"),
      description: t("pricing.features.professionalService.description"),
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      title: t("pricing.features.fasterProcessing.title"),
      description: t("pricing.features.fasterProcessing.description"),
    },
  ];

  const services = [
    {
      id: "no-fault-assistance",
      name: t("pricing.services.noFaultAssistance.name"),
      description: t("pricing.services.noFaultAssistance.description"),
      price: 500.0,
      icon: <Shield className="w-6 h-6" />,
    },
    {
      id: "notarization",
      name: t("pricing.services.notarization.name"),
      description: t("pricing.services.notarization.description"),
      price: 25.0,
      icon: <FileText className="w-6 h-6" />,
    },
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const handleCheckout = async () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
      return;
    }

    setIsProcessing(true);

    try {
      const selectedItems = services.filter((service) =>
        selectedServices.includes(service.id)
      );

      console.log("Sending checkout request with items:", selectedItems);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: selectedItems.map((item) => ({
            name: item.name,
            description: item.description,
            price: item.price,
          })),
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const responseData = await response.json();
      console.log("Checkout response:", responseData);

      if (!response.ok) {
        throw new Error(
          responseData.error ||
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const { sessionId, error } = responseData;

      if (error) {
        throw new Error(error);
      }

      if (!sessionId) {
        throw new Error("No session ID received from server");
      }

      // Validate the session before redirecting
      setIsValidating(true);
      console.log("Validating session before redirect...");
      const validationResponse = await fetch("/api/validate-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const validationData = await validationResponse.json();
      console.log("Session validation:", validationData);

      if (!validationData.valid) {
        throw new Error(
          "Checkout session is invalid or expired. Please try again."
        );
      }

      const stripe = await getStripe();
      if (stripe) {
        console.log("Stripe loaded successfully, redirecting to checkout...");

        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          console.error("Stripe redirect error:", stripeError);
          throw new Error(stripeError.message);
        }

        console.log("Stripe redirect initiated successfully");
      } else {
        console.error("Stripe failed to load");
        throw new Error(
          "Stripe is not available. Please check your configuration."
        );
      }
    } catch (error) {
      console.error("Error during checkout:", error);

      let errorMessage =
        "There was an error processing your payment. Please try again or contact support.";

      if (error instanceof Error) {
        if (error.message.includes("apiKey")) {
          errorMessage =
            "Payment system is not properly configured. Please contact support.";
        } else if (error.message.includes("session")) {
          errorMessage = "Unable to create payment session. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }

      alert(errorMessage);
    } finally {
      setIsProcessing(false);
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Loading Overlay */}
      {isValidating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <div className="text-center">
              {/* Cool Loading Wheel */}
              <div className="relative w-16 h-16 mx-auto mb-6">
                {/* Outer ring */}
                <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                {/* Animated ring */}
                <div className="absolute inset-0 border-4 border-transparent border-t-teal-500 border-r-emerald-500 rounded-full animate-spin"></div>
                {/* Inner pulse */}
                <div className="absolute inset-2 bg-gradient-to-r from-teal-500 to-teal-700 rounded-full animate-pulse"></div>
                {/* Center dot */}
                <div className="absolute inset-4 bg-white dark:bg-gray-900 rounded-full"></div>
                {/* Outer ring */}
                <div className="absolute inset-6 bg-gradient-to-r from-teal-500 to-teal-700 rounded-full"></div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Preparing Your Payment
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Validating session and redirecting to secure payment...
              </p>

              {/* Progress dots */}
              <div className="flex justify-center gap-1 mt-4">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
        <div className="absolute inset-0 z-0">
          <PageHeroBackdrop />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t("pricing.title")
                .split(", ")
                .map((part, index) => (
                  <span key={index}>
                    {index > 0 && ", "}
                    {index === 1 ? (
                      <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                        {part}
                      </span>
                    ) : (
                      part
                    )}
                  </span>
                ))}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              {t("pricing.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={handleStartClaim}
                className="bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("pricing.startClaim")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                onClick={() => setShowLearnMoreModal(true)}
              >
                {t("pricing.learnMore")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Payment Services & Summary Card */}
            <div className="max-w-4xl mx-auto relative">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white text-center flex items-center justify-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    {t("pricing.selectServices")}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {t("pricing.selectServicesDesc")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Service Selection */}
                  <div className="space-y-4">
                    {services.map((service) => (
                      <Card
                        key={service.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedServices.includes(service.id)
                          ? "ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-950/30"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        onClick={() => toggleService(service.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-700 rounded-lg flex items-center justify-center text-white">
                                {service.icon}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                                  {service.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm text-left">
                                  {service.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-xl font-bold text-gray-900 dark:text-white">
                                  ${service.price.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  One-time fee
                                </div>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedServices.includes(service.id)
                                  ? "bg-teal-500 border-teal-500"
                                  : "border-gray-300 dark:border-gray-600"
                                  }`}
                              >
                                {selectedServices.includes(service.id) && (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Payment Summary */}
                  <div className="border-t pt-6">
                    <div className="space-y-4">
                      {/* Selected Services */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Selected Services:
                        </h4>
                        {selectedServices.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No services selected
                          </p>
                        ) : (
                          selectedServices.map((serviceId) => {
                            const service = services.find(
                              (s) => s.id === serviceId
                            );
                            return service ? (
                              <div
                                key={serviceId}
                                className="flex justify-between items-center"
                              >
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                                    {service.name}
                                  </p>
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                                    {service.description}
                                  </p>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  ${service.price.toFixed(2)}
                                </span>
                              </div>
                            ) : null;
                          })
                        )}
                      </div>

                      {/* Total */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            Total
                          </span>
                          <span className="text-2xl font-bold text-teal-600">
                            ${getTotalPrice().toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <Button
                        onClick={handleCheckout}
                        disabled={selectedServices.length === 0 || isProcessing}
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            Proceed to Payment
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>

                      {/* Security Notice */}
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          🔒 Secure payment powered by Stripe
                        </p>
                        {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
                          <p className="text-xs text-orange-500 mt-1">
                            ⚠️ Stripe not configured - payment processing
                            disabled
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/90 dark:bg-teal-950/40 px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-white">
                  Complex claim or disputed coverage?
                </span>{" "}
                If your situation may require legal judgment or representation,{" "}
                <a
                  href="/when-to-call-an-attorney"
                  className="text-teal-600 dark:text-teal-400 font-semibold underline underline-offset-2"
                >
                  see when to call an attorney
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-50/90 via-white to-emerald-50/40 dark:from-gray-900 dark:to-slate-900/40">
        <div className="absolute inset-0 z-0">
          <PageHeroBackdrop />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              The{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
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
                    {t("pricing.traditionalCosts.title")}
                  </CardTitle>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    $3,000.00+
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
                    {t("pricing.traditionalCosts.netToVictim")}
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
                    {t("pricing.claimSaverAdvantages.title")}
                  </CardTitle>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    $500.00
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("pricing.platformAccessSubtitle")}
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
                <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/50 rounded-lg space-y-2">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                    Illustrative: on a $10K PIP benefit, a flat $500 platform fee
                    leaves far more in your pocket than a 33% contingency fee—your
                    results may differ.
                  </p>
                  <p className="text-xs text-green-800/80 dark:text-green-200/90">
                    {t("pricing.comparisonNote")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-emerald-50/50 dark:from-gray-900 dark:to-slate-900/80 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <PageHeroBackdrop />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  ClaimSaver+?
                </span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  In Florida, the average auto policy payout is $10,000.00. With
                  traditional methods, after a 33% service contingency fee,
                  victims are left with less than $7,000.00 before additional
                  processing costs.
                </p>
                <p>
                  ClaimSaver+ revolutionizes this process with our flat $500.00
                  fee, allowing you to keep 95% of your settlement.
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Calculator className="w-6 h-6 text-teal-600" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Savings Calculator
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Traditional Service Fee (33%)</span>
                      <span className="font-semibold text-red-600">
                        -$3,300.00
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ClaimSaver+ Flat Fee</span>
                      <span className="font-semibold text-green-600">
                        -$500.00
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Your Savings</span>
                      <span className="text-green-600">+$2,800.00</span>
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
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
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

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-teal-600 to-emerald-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t("pricing.cta.title")}
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            {t("pricing.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={handleStartClaim}
            >
              {t("pricing.cta.button")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
              onClick={() => setShowLearnMoreModal(true)}
            >
              {t("pricing.learnMore")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-teal-100">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">
                Flat $500 platform access • No contingency fee to ClaimSaver+
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      {showLearnMoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                About ClaimSaver+
              </h2>
              <button
                onClick={() => setShowLearnMoreModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Guided Florida PIP filing
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  ClaimSaver+ provides software and education so you can prepare
                  and file your no-fault claim—you are the filer. We do not negotiate with
                  insurers or provide legal advice. A flat $500 fee buys platform
                  access—compared to typical attorney contingency percentages on
                  the same benefit amount, many users keep more after fees, but
                  your situation may differ.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-teal-50 dark:bg-teal-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-teal-900 dark:text-teal-100 mb-2">
                    Traditional Method
                  </h4>
                  <ul className="text-sm text-teal-800 dark:text-teal-200 space-y-1">
                    <li>• 33% service contingency fee</li>
                    <li>• Hidden processing costs</li>
                    <li>• Complex legal procedures</li>
                    <li>• Long waiting periods</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    ClaimSaver+ Method
                  </h4>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>• Flat $500.00 fee</li>
                    <li>• No hidden costs</li>
                    <li>• Streamlined process</li>
                    <li>• Faster results</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  How It Works
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Enter your information
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Guided forms—you provide the facts; we help with formats
                        and completeness
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Organize &amp; validate
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Upload documents and use validation—you submit the
                        claim package
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Submit to your insurer
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        You send materials to your carrier; we do not negotiate
                        for you
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Why use ClaimSaver+?
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>
                    • <strong>Transparent fee:</strong> Flat platform access—not
                    a percentage of your benefit
                  </li>
                  <li>
                    • <strong>You stay in control:</strong> You file and
                    communicate with your insurer
                  </li>
                  <li>
                    • <strong>Tools &amp; education:</strong> Validation,
                    storage, reminders— not representation
                  </li>
                  <li>
                    • <strong>Know the limits:</strong> Not for legal advice—
                    use an attorney when needed
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => setShowLearnMoreModal(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowLearnMoreModal(false);
                  handleStartClaim();
                }}
                className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              >
                Start Your Claim
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Services Modal */}
      {showServicesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Services
              </h2>
              <button
                onClick={() => setShowServicesModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  What you get with platform access
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Software to help you prepare your Florida no-fault filing:
                  guided information entry, document storage, expense tracking,
                  and reminders. We do not communicate with your insurer as your
                  representative or negotiate on your behalf.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Guided platform access — $500.00
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Includes guided workflows and tools for you to prepare
                        your claim materials. Does not include representation or
                        negotiation. Includes:
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>• Guided PIP-related information entry</li>
                        <li>• Secure upload and organization of your documents</li>
                        <li>• Field validation and formatting checks</li>
                        <li>• Expense logging and deadline reminders (general)</li>
                        <li>• Educational content (not case-specific advice)</li>
                        <li>• Email support for platform/technical questions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Notarization Services - $25.00
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Online document notarization via DocuSign for all your
                        legal documents:
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>• Remote online notarization</li>
                        <li>• Secure digital signatures</li>
                        <li>• Legal document verification</li>
                        <li>• 24/7 availability</li>
                        <li>• Instant completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  💰 Savings Calculator
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Traditional Service Fee (33%)</span>
                    <span className="font-semibold text-red-600">
                      -$3,300.00
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ClaimSaver+ Flat Fee</span>
                    <span className="font-semibold text-green-600">
                      -$500.00
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Your Additional Savings</span>
                    <span className="text-green-600">+$2,800.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => setShowServicesModal(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => setShowServicesModal(false)}
                className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              >
                Select Services
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Pricing & Savings
              </h2>
              <button
                onClick={() => setShowPricingModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Understanding our pricing
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  You pay a flat fee for guided platform access—not a
                  percentage of your claim. Compare total costs to other options
                  that may charge contingency fees; your net outcome depends on
                  your facts and coverage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                    Traditional Service Costs
                  </h4>
                  <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                    <li>• 33% contingency fee</li>
                    <li>• Hidden processing costs</li>
                    <li>• Additional filing fees</li>
                    <li>• Administrative charges</li>
                    <li>• Total: $3,000.00+</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    ClaimSaver+ Pricing
                  </h4>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>• Flat $500.00 fee</li>
                    <li>• No hidden costs</li>
                    <li>• No contingency fees</li>
                    <li>• Guided claim filing tools</li>
                    <li>• Total: $500.00</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  💰 Your Savings Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      Traditional Service Fee (33% of $10,000.00)
                    </span>
                    <span className="font-semibold text-red-600">
                      -$3,300.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">
                      ClaimSaver+ Flat Fee
                    </span>
                    <span className="font-semibold text-green-600">
                      -$500.00
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                    <span className="text-gray-900 dark:text-white">
                      Your Total Savings
                    </span>
                    <span className="text-green-600">+$2,800.00</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  What&apos;s included in the flat fee
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Guided digital workflows for information you enter yourself
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Secure storage and organization of your uploaded files
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Validation and formatting checks—not legal strategy
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Reminders and educational articles (general information)
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Support for billing and technical platform questions
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      No negotiation or insurer communication on your behalf
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ⚡ Why Our Pricing Works
                </h3>
                <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                  <li>
                    • <strong>Volume Efficiency:</strong> We process many claims
                    efficiently
                  </li>
                  <li>
                    • <strong>Technology:</strong> Automated systems reduce
                    overhead costs
                  </li>
                  <li>
                    • <strong>No Contingency:</strong> We don&apos;t take a
                    percentage of your settlement
                  </li>
                  <li>
                    • <strong>Transparency:</strong> You know exactly what
                    you&apos;re paying for
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => setShowPricingModal(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowPricingModal(false);
                  handleStartClaim();
                }}
                className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              >
                Start Your Claim
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
