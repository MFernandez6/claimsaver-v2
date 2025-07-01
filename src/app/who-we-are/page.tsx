"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Users,
  Heart,
  Shield,
  Star,
  Target,
  Eye,
} from "lucide-react";

export default function WhoWeAre() {
  const { openSignIn } = useClerk();
  const { t } = useTranslation();

  const handleStartClaim = () => {
    openSignIn();
  };

  const values = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: t("whoWeAre.values.mission.title"),
      description: t("whoWeAre.values.mission.description"),
    },
    {
      icon: <Eye className="w-8 h-8 text-green-600" />,
      title: t("whoWeAre.values.vision.title"),
      description: t("whoWeAre.values.vision.description"),
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: t("whoWeAre.values.values.title"),
      description: t("whoWeAre.values.values.description"),
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: t("whoWeAre.values.support.title"),
      description: t("whoWeAre.values.support.description"),
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
                  {t("whoWeAre.hero.title")}{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t("whoWeAre.hero.subtitle")}
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  {t("whoWeAre.hero.description")}
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
                    {t("whoWeAre.about.title")}
                  </h2>
                  <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>{t("whoWeAre.about.paragraph1")}</p>
                    <p>{t("whoWeAre.about.paragraph2")}</p>
                    <p>{t("whoWeAre.about.paragraph3")}</p>
                  </div>
                </div>

                <div className="relative animate-in fade-in slide-in-from-right-4 duration-600 delay-200">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                    <Image
                      src="/images/family.jpg"
                      alt={t("whoWeAre.about.imageAlt")}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {t("whoWeAre.about.familyFirst")}
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
                  {t("whoWeAre.familyStory.title")}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                  {t("whoWeAre.familyStory.subtitle")}
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
                          {t("whoWeAre.familyStory.personalJourney.title")}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t(
                            "whoWeAre.familyStory.personalJourney.description"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {t("whoWeAre.familyStory.mission.title")}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t("whoWeAre.familyStory.mission.description")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <Star className="w-6 h-6" />
                        <h3 className="text-xl font-semibold">
                          {t("whoWeAre.familyStory.whyWeCare.title")}
                        </h3>
                      </div>
                      <p className="text-blue-100 leading-relaxed">
                        {t("whoWeAre.familyStory.whyWeCare.quote")}
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
                  {t("whoWeAre.coreValues.title")}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {t("whoWeAre.coreValues.subtitle")}
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
                  {t("whoWeAre.cta.title")}
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  {t("whoWeAre.cta.description")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-200"
                    onClick={handleStartClaim}
                  >
                    {t("whoWeAre.cta.startClaim")}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Link href="/what-we-do">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
                    >
                      {t("whoWeAre.cta.learnMore")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
