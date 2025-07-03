"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  FileImage,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface Document {
  _id: string;
  name: string;
  type: string;
  fileType: string;
  size: string;
  uploadDate: string;
  description: string;
  url: string;
  fileName: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
}

const documentCategories = {
  medical: {
    label: "Medical Records",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  insurance: {
    label: "Insurance",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  evidence: {
    label: "Evidence",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  legal: {
    label: "Legal Documents",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  other: {
    label: "Other",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  },
};

export default function DocumentShareModal({
  isOpen,
  onClose,
  document,
}: DocumentShareModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  if (!document) return null;

  const category =
    documentCategories[document.type as keyof typeof documentCategories];

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <FileImage className="w-6 h-6" />;
    }
    return <FileText className="w-6 h-6" />;
  };

  const handleShare = async () => {
    if (!email.trim()) {
      setShareError("Please enter a valid email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setShareError("Please enter a valid email address");
      return;
    }

    setIsSharing(true);
    setShareError(null);

    try {
      const response = await fetch("/api/share-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail: email,
          message,
          document,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to share document");
      }

      setShareSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error("Share error:", error);
      setShareError(
        error instanceof Error
          ? error.message
          : "Failed to share document. Please try again."
      );
    } finally {
      setIsSharing(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setMessage("");
    setShareError(null);
    setShareSuccess(false);
  };

  const handleClose = () => {
    if (!isSharing) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Share Document">
      <div className="space-y-6">
        {shareSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Document Shared Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              The document information has been sent to {email}
            </p>
          </div>
        ) : (
          <>
            {/* Document Preview */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getFileIcon(document.mimeType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {document.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    {category && (
                      <Badge className={category.color}>{category.label}</Badge>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {document.size}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipient Email *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  disabled={isSharing}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={3}
                  disabled={isSharing}
                  className="w-full"
                />
              </div>
            </div>

            {/* Error Message */}
            {shareError && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {shareError}
                  </p>
                </div>
              </div>
            )}

            {/* Note about current implementation */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    ℹ
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                    Document Sharing
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    This will send document metadata and information to the
                    recipient via email. Currently in simulation mode - check
                    the server logs to see the email details that would be sent.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSharing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleShare}
                disabled={isSharing || !email.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSharing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Share Document
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
