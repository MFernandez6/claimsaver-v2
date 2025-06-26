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
      className={`py-16 bg-gradient-to-br from-gray-50/65 to-blue-50/65 dark:from-gray-950/65 dark:to-gray-900/65 relative z-10 backdrop-blur-[1px] ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Contact Info */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 shadow-lg">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-xl max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* FAQ Content with Side-by-side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Title Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                Find answers to the most common questions about our platform and
                services.
              </p>

              {/* Contact Info */}
              <div className="bg-gradient-to-r from-blue-50/90 to-purple-50/90 dark:from-blue-950/90 dark:to-purple-950/90 rounded-xl p-4 border border-blue-200 dark:border-blue-800 w-3/4 backdrop-blur-[1px]">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Need help?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs mb-3">
                  Our team is here to help you get the compensation you deserve.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-1 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs"
                >
                  <a href="mailto:ClaimSaverPlus@gmail.com">Email Us</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Questions Column */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/92 dark:bg-gray-800/92 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl backdrop-blur-[1px]"
                >
                  <Button
                    variant="ghost"
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                      {item.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300" />
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
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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
