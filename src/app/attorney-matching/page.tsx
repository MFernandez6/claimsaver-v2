"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Users,
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Phone,
  Award,
  TrendingUp,
  FileText,
  Car,
  Globe,
  Scale,
  Stethoscope,
  HardHat,
  Briefcase,
  Gavel,
  Search,
  Heart,
  X,
  GraduationCap,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

interface Attorney {
  id: number;
  name: string;
  specialization: string;
  location: string;
  rating: number;
  reviews: number;
  experience: string;
  phone: string;
  website: string;
  description: string;
  image: string;
}

interface PracticeArea {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  icon: React.ReactNode;
  color: string;
}

export default function AttorneyMatching() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false);
  const [selectedPracticeDetails, setSelectedPracticeDetails] =
    useState<PracticeArea | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "practice" | "details" | "results"
  >("practice");
  const [selectedPractice, setSelectedPractice] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    incidentDate: "",
    description: "",
  });
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setCurrentStep("practice");
    setSelectedPractice("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentStep("practice");
    setSelectedPractice("");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      incidentDate: "",
      description: "",
    });
    setAttorneys([]);
  };

  const handlePracticeCardClick = (area: PracticeArea) => {
    setSelectedPracticeDetails(area);
    setIsPracticeModalOpen(true);
  };

  const handleClosePracticeModal = () => {
    setIsPracticeModalOpen(false);
    setSelectedPracticeDetails(null);
  };

  const handleLearnMoreClick = () => {
    setIsLearnMoreModalOpen(true);
  };

  const handleCloseLearnMoreModal = () => {
    setIsLearnMoreModalOpen(false);
  };

  const handleConnectToAttorney = () => {
    if (selectedPracticeDetails) {
      setIsPracticeModalOpen(false);
      setSelectedPractice(selectedPracticeDetails.id);
      setCurrentStep("details");
      setIsModalOpen(true);
    }
  };

  const handlePracticeSelect = (practice: string) => {
    setSelectedPractice(practice);
    setCurrentStep("details");
  };

  const handleBackToPractice = () => {
    setCurrentStep("practice");
    setSelectedPractice("");
  };

  const handleBackToDetails = () => {
    setCurrentStep("details");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate attorney search based on location and practice area
    const mockAttorneys = await searchAttorneys(
      formData.location,
      selectedPractice
    );
    setAttorneys(mockAttorneys);
    setCurrentStep("results");
    setIsLoading(false);
  };

  const searchAttorneys = async (
    location: string,
    practiceArea: string
  ): Promise<Attorney[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock attorney data based on location and practice area
    const practiceAreaName =
      practiceAreas.find((p) => p.id === practiceArea)?.title || "Legal";

    return [
      {
        id: 1,
        name: `Johnson & Associates`,
        specialization: practiceAreaName,
        location: location,
        rating: 4.8,
        reviews: 127,
        experience: "15+ years",
        phone: "(555) 123-4567",
        website: "www.johnsonlaw.com",
        description: `Specialized in ${practiceAreaName} with over 15 years of experience. Known for aggressive representation and high success rates.`,
        image: "/images/attorney1.jpg",
      },
      {
        id: 2,
        name: `Smith Legal Group`,
        specialization: practiceAreaName,
        location: location,
        rating: 4.6,
        reviews: 89,
        experience: "12+ years",
        phone: "(555) 234-5678",
        website: "www.smithlegal.com",
        description: `Dedicated ${practiceAreaName} attorneys with a track record of securing maximum compensation for clients.`,
        image: "/images/attorney2.jpg",
      },
      {
        id: 3,
        name: `Williams Law Firm`,
        specialization: practiceAreaName,
        location: location,
        rating: 4.7,
        reviews: 156,
        experience: "18+ years",
        phone: "(555) 345-6789",
        website: "www.williamslaw.com",
        description: `Premier ${practiceAreaName} practice with extensive courtroom experience and personalized client care.`,
        image: "/images/attorney3.jpg",
      },
    ];
  };

  const handleConnectAttorney = (attorneyId: number) => {
    // This would integrate with ClaimSaver+ backend
    console.log(`Connecting to attorney ${attorneyId}`);
    // For now, just show a success message
    alert(t("attorneyMatching.connectionSuccess"));
  };

  const practiceAreas: PracticeArea[] = [
    {
      id: "slip-falls",
      title: t("attorneyMatching.practiceAreas.slipFalls.title"),
      description: t("attorneyMatching.practiceAreas.slipFalls.description"),
      detailedDescription: t(
        "attorneyMatching.practiceAreas.slipFalls.detailedDescription"
      ),
      icon: <FileText className="w-6 h-6" />,
      color: "blue",
    },
    {
      id: "automobile",
      title: t("attorneyMatching.practiceAreas.automobile.title"),
      description: t("attorneyMatching.practiceAreas.automobile.description"),
      detailedDescription: t(
        "attorneyMatching.practiceAreas.automobile.detailedDescription"
      ),
      icon: <Car className="w-6 h-6" />,
      color: "green",
    },
    {
      id: "immigration",
      title: t("attorneyMatching.practiceAreas.immigration.title"),
      description: t("attorneyMatching.practiceAreas.immigration.description"),
      detailedDescription: t(
        "attorneyMatching.practiceAreas.immigration.detailedDescription"
      ),
      icon: <Globe className="w-6 h-6" />,
      color: "purple",
    },
    {
      id: "wills-trusts",
      title: t("attorneyMatching.practiceAreas.willsTrusts.title"),
      description: t("attorneyMatching.practiceAreas.willsTrusts.description"),
      detailedDescription: t(
        "attorneyMatching.practiceAreas.willsTrusts.detailedDescription"
      ),
      icon: <Scale className="w-6 h-6" />,
      color: "orange",
    },
    {
      id: "personal-injury",
      title: t("attorneyMatching.practiceAreas.personalInjury.title"),
      description: t(
        "attorneyMatching.practiceAreas.personalInjury.description"
      ),
      detailedDescription: t(
        "attorneyMatching.practiceAreas.personalInjury.detailedDescription"
      ),
      icon: <Stethoscope className="w-6 h-6" />,
      color: "red",
    },
    {
      id: "workers-comp",
      title: t("attorneyMatching.practiceAreas.workersComp.title"),
      description: t("attorneyMatching.practiceAreas.workersComp.description"),
      detailedDescription: t(
        "attorneyMatching.practiceAreas.workersComp.detailedDescription"
      ),
      icon: <HardHat className="w-6 h-6" />,
      color: "yellow",
    },
    {
      id: "business",
      title: t("attorneyMatching.practiceAreas.business.title"),
      description: t("attorneyMatching.practiceAreas.business.description"),
      detailedDescription: t(
        "attorneyMatching.practiceAreas.business.detailedDescription"
      ),
      icon: <Briefcase className="w-6 h-6" />,
      color: "indigo",
    },
    {
      id: "criminal",
      title: t("attorneyMatching.practiceAreas.criminal.title"),
      description: t("attorneyMatching.practiceAreas.criminal.description"),
      detailedDescription: t(
        "attorneyMatching.practiceAreas.criminal.detailedDescription"
      ),
      icon: <Gavel className="w-6 h-6" />,
      color: "pink",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      red: "from-red-500 to-red-600",
      yellow: "from-yellow-500 to-yellow-600",
      indigo: "from-indigo-500 to-indigo-600",
      pink: "from-pink-500 to-pink-600",
    };
    return colorMap[color] || "from-blue-500 to-blue-600";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/long-logo-ClaimSaver.jpg"
            alt={t("attorneyMatching.hero.imageAlt")}
            className="w-full h-full object-cover opacity-25"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/80 to-indigo-50/70 dark:from-gray-950/70 dark:via-gray-900/80 dark:to-blue-950/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t("attorneyMatching.hero.title")}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("attorneyMatching.hero.subtitle")}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              {t("attorneyMatching.hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={handleOpenModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("attorneyMatching.hero.findAttorney")}
                <Search className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleLearnMoreClick}
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("attorneyMatching.hero.learnMore")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
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
              {t("attorneyMatching.features.title")}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("attorneyMatching.features.subtitle")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("attorneyMatching.features.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("attorneyMatching.features.network.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("attorneyMatching.features.network.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("attorneyMatching.features.trackRecord.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("attorneyMatching.features.trackRecord.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("attorneyMatching.features.secure.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("attorneyMatching.features.secure.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("attorneyMatching.features.instant.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("attorneyMatching.features.instant.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("attorneyMatching.features.successRates.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("attorneyMatching.features.successRates.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("attorneyMatching.features.personalized.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("attorneyMatching.features.personalized.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Practice Areas Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 relative overflow-hidden">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/long-logo-ClaimSaver.jpg"
            alt={t("attorneyMatching.practiceAreas.imageAlt")}
            className="w-full h-full object-cover opacity-20"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-950/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t("attorneyMatching.practiceAreas.title")}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("attorneyMatching.practiceAreas.subtitle")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("attorneyMatching.practiceAreas.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceAreas.map((area) => (
              <Card
                key={area.id}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm cursor-pointer"
                onClick={() => handlePracticeCardClick(area)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(
                      area.color
                    )} rounded-xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {area.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {area.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {area.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                      <span>Learn more</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentStep === "practice" && "Select Practice Area"}
                  {currentStep === "details" && "Your Information"}
                  {currentStep === "results" && "Attorney Matches"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {currentStep === "practice" && (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Select the practice area that best matches your legal needs:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {practiceAreas.map((area) => (
                      <Card
                        key={area.id}
                        className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 cursor-pointer"
                        onClick={() => handlePracticeSelect(area.id)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 bg-gradient-to-r ${getColorClasses(
                                area.color
                              )} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                            >
                              {area.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {area.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {area.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === "details" && (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Please provide your information so we can recommend the best
                    attorneys for your case:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location (City, State)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Incident Date
                      </label>
                      <input
                        type="date"
                        value={formData.incidentDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            incidentDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Case Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      placeholder="Briefly describe your case..."
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackToPractice}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading ? "Searching..." : "Get Recommendations"}
                    </Button>
                  </div>
                </form>
              )}

              {currentStep === "results" && (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Here are your attorney recommendations based on your
                    criteria:
                  </p>
                  <div className="space-y-4">
                    {attorneys.map((attorney) => (
                      <Card
                        key={attorney.id}
                        className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                                {attorney.name}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 mb-2">
                                {attorney.specialization} • {attorney.location}
                              </p>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(attorney.rating)
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {attorney.rating} ({attorney.reviews} reviews)
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Experience: {attorney.experience}
                              </p>
                            </div>
                            <div className="text-right">
                              <Button
                                onClick={() =>
                                  handleConnectAttorney(attorney.id)
                                }
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              >
                                Contact
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {attorney.description}
                          </p>
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Phone className="w-4 h-4" />
                              {attorney.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <GraduationCap className="w-4 h-4" />
                              {attorney.website}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleBackToDetails}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleCloseModal}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Practice Area Details Modal */}
      {isPracticeModalOpen && selectedPracticeDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClosePracticeModal}
          ></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(
                      selectedPracticeDetails.color
                    )} rounded-xl flex items-center justify-center text-white`}
                  >
                    {selectedPracticeDetails.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {selectedPracticeDetails.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Legal Practice Area
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClosePracticeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Practice Overview
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {selectedPracticeDetails.detailedDescription}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    What Our Attorneys Can Help With
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        Free initial consultation to evaluate your case
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Expert legal representation and guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        Negotiation with insurance companies and opposing
                        parties
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        Court representation if litigation becomes necessary
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Maximum compensation recovery for your case</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Why Choose Our Network
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Verified credentials
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600 dark:text-gray-300">
                        High success rates
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Secure & confidential
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Quick response times
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  onClick={handleConnectToAttorney}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Connect with Attorney
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learn More Modal */}
      {isLearnMoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseLearnMoreModal}
          ></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Why You Need an Attorney
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Understanding the legal process and how ClaimSaver+ can help
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseLearnMoreModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-8">
                {/* Why You Need an Attorney Section */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    When Legal Representation is Critical
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-sm font-semibold">
                            1
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Complex Legal Procedures
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Legal processes involve complex paperwork,
                            deadlines, and procedural requirements that can be
                            overwhelming without professional guidance.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-sm font-semibold">
                            2
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Insurance Company Tactics
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Insurance companies often use aggressive tactics to
                            minimize payouts. Attorneys know how to counter
                            these strategies effectively.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-sm font-semibold">
                            3
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Maximizing Compensation
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Attorneys understand how to properly value claims
                            and negotiate for maximum compensation you deserve.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-sm font-semibold">
                            4
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Legal Rights Protection
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Attorneys ensure your rights are protected
                            throughout the entire legal process and prevent
                            costly mistakes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* When You Need an Attorney Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Situations Requiring Legal Counsel
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Car className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Serious Injuries
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            When you&apos;ve sustained significant injuries that
                            require ongoing medical treatment or result in
                            permanent disability.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Disputed Claims
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            When insurance companies deny your claim or offer
                            insufficient compensation for your damages.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Scale className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Complex Cases
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            When multiple parties are involved or when liability
                            is unclear and requires legal expertise to resolve.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Statute of Limitations
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            When approaching legal deadlines that could affect
                            your ability to file a claim or lawsuit.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits of Legal Representation */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Benefits of Professional Legal Help
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        Expert
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Legal Knowledge & Experience
                      </p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        Protection
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Your Rights & Interests
                      </p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        Results
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Maximum Compensation
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Ready to Get Professional Legal Help?
                  </h3>
                  <p className="text-blue-100 mb-6">
                    Connect with qualified attorneys who can help you navigate
                    your legal challenges and protect your rights.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => {
                        handleCloseLearnMoreModal();
                        handleOpenModal();
                      }}
                      className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Get Legal Recommendations
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCloseLearnMoreModal}
                      className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600 px-6 py-3 font-semibold rounded-xl"
                    >
                      Learn More About Legal Services
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
