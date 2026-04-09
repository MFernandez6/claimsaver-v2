import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative min-w-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[min(90dvh,90vh)] overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-3 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-gray-800 dark:to-gray-800">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white min-w-0 pr-2 break-words">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain max-h-[min(calc(90dvh-7rem),calc(90vh-7rem))]">
          {children}
        </div>
      </div>
    </div>
  );
}
