"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, FileImage, Calendar } from "lucide-react";
import PDFViewer from "./PDFViewer";

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

interface DocumentPreviewModalProps {
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

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  document,
}: DocumentPreviewModalProps) {
  if (!document) return null;

  const category =
    documentCategories[document.type as keyof typeof documentCategories];

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <FileImage className="w-6 h-6" />;
    }
    return <FileText className="w-6 h-6" />;
  };

  const isPDF =
    document.mimeType === "application/pdf" ||
    document.fileName.toLowerCase().endsWith(".pdf");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Document Details">
      <div className="space-y-6">
        {/* Document Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            {getFileIcon(document.mimeType)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {document.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {category && (
                <Badge className={category.color}>{category.label}</Badge>
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {document.fileType}
              </span>
            </div>
          </div>
        </div>

        {/* PDF Viewer for PDF files */}
        {isPDF && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    📄
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                    PDF Viewer
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    View and interact with your PDF document below. Use the
                    controls to zoom, rotate, or download the file.
                  </p>
                </div>
              </div>
            </div>

            <PDFViewer
              fileUrl={`/api/documents/${document._id}/view`}
              fileName={document.fileName}
            />
          </div>
        )}

        {/* Document Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                File Name
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {document.fileName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                File Size
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {document.size}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                MIME Type
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {document.mimeType}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upload Date
              </label>
              <p className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(document.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {document.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                {document.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Created
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(document.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Updated
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(document.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Note about current implementation */}
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-green-600 dark:text-green-400">
                ✓
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                File Storage Active
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                {isPDF
                  ? "PDF files can now be viewed directly in the browser with zoom and rotation controls."
                  : "Files are now stored locally and can be downloaded. The actual file will be attached when sharing via email."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
