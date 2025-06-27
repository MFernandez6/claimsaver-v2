"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  className?: string;
}

export default function FAQ({
  title = "Common Questions",
  subtitle = "Everything you need to know about ClaimSaver+",
  items,
  className = "",
}: FAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section
      className={`py-12 sm:py-16 bg-gradient-to-br from-gray-50/65 to-blue-50/65 dark:from-gray-950/65 dark:to-gray-900/65 relative z-10 backdrop-blur-[1px] ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Contact Info */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 sm:mb-6 shadow-lg">
            <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-2">
            {subtitle}
          </p>
        </div>

        {/* FAQ Content - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Title Column - Mobile: Full width, Desktop: Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center lg:text-left">
                Frequently Asked Questions
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 text-center lg:text-left">
                Find answers to the most common questions about our platform and
                services.
              </p>

              {/* Contact Info */}
              <div className="bg-gradient-to-r from-blue-50/90 to-purple-50/90 dark:from-blue-950/90 dark:to-purple-950/90 rounded-xl p-4 border border-blue-200 dark:border-blue-800 w-full lg:w-3/4 backdrop-blur-[1px] mx-auto lg:mx-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 text-center lg:text-left">
                  Need help?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 text-center lg:text-left">
                  Our team is here to help you get the compensation you deserve.
                </p>
                <div className="text-center lg:text-left">
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
                  >
                    <a href="mailto:ClaimSaverPlus@gmail.com">Email Us</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Column - Mobile: Full width, Desktop: Main content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="space-y-3 sm:space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/92 dark:bg-gray-800/92 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl backdrop-blur-[1px]"
                >
                  <Button
                    variant="ghost"
                    onClick={() => toggleItem(index)}
                    className="w-full p-4 sm:p-6 text-left flex items-start justify-between hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-all duration-300"
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white pr-3 sm:pr-4 leading-tight">
                      {item.question}
                    </h3>
                    <div className="flex-shrink-0 mt-1 sm:mt-0">
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300" />
                      )}
                    </div>
                  </Button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openItems.includes(index)
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
