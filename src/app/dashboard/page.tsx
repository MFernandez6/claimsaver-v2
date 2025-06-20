"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import {
  FileText,
  Users,
  Calendar,
  DollarSign,
  Shield,
  Plus,
  Search,
  Bell,
  X,
  CheckCircle,
  Car,
  User,
  Edit,
  Trash2,
  Clock,
  MapPin,
  CalendarPlus,
  Upload,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  Download,
  Eye,
} from "lucide-react";

// Force dynamic rendering to prevent static generation
export const dynamic = "force-dynamic";

// Wrapper component to handle Clerk availability
function DashboardContent() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<{
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    description: string;
    reminder: string;
  } | null>(null);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Court Hearing - Auto Accident Case",
      date: "2024-03-15",
      time: "10:00",
      location: "County Courthouse, Room 302",
      type: "court",
      description: "Important court hearing for auto accident case",
      reminder: "1 day before",
    },
    {
      id: 2,
      title: "Medical Evaluation",
      date: "2024-03-20",
      time: "14:00",
      location: "Dr. Smith's Office",
      type: "medical",
      description: "Follow-up medical evaluation appointment",
      reminder: "2 hours before",
    },
  ]);
  const [documents, setDocuments] = useState<
    Array<{
      _id: string;
      name: string;
      type: string;
      fileType: string;
      size: string;
      uploadDate: string;
      description: string;
      url: string;
    }>
  >([
    {
      _id: "1",
      name: "Medical Records - Dr. Smith",
      type: "medical",
      fileType: "pdf",
      size: "2.4 MB",
      uploadDate: "2024-03-01",
      description: "Complete medical evaluation and treatment records",
      url: "#",
    },
    {
      _id: "2",
      name: "Police Report - Auto Accident",
      type: "legal",
      fileType: "pdf",
      size: "1.8 MB",
      uploadDate: "2024-02-28",
      description: "Official police report from the accident scene",
      url: "#",
    },
    {
      _id: "3",
      name: "Insurance Policy Document",
      type: "insurance",
      fileType: "pdf",
      size: "3.2 MB",
      uploadDate: "2024-02-25",
      description: "Complete insurance policy and coverage details",
      url: "#",
    },
    {
      _id: "4",
      name: "Accident Photos",
      type: "evidence",
      fileType: "image",
      size: "5.6 MB",
      uploadDate: "2024-02-20",
      description: "Photographic evidence from the accident scene",
      url: "#",
    },
  ]);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    type: "medical",
    description: "",
    reminder: "1 day before",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
    accidentDate: "",
    accidentLocation: "",
    accidentDescription: "",
    injuries: "",
    medicalProvider: "",
    insuranceCompany: "",
    policyNumber: "",
    vehicleInfo: "",
    witnesses: "",
    policeReport: "",
  });
  const [documentFormData, setDocumentFormData] = useState({
    name: "",
    type: "medical",
    description: "",
    file: null as File | null,
  });

  // Auto-open modal when user signs in
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      setIsModalOpen(true);
    }
  }, [isSignedIn, isLoaded]);

  // Fetch documents from MongoDB
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/documents");
        if (response.ok) {
          const data = await response.json();
          setDocuments(data);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    if (isSignedIn && isLoaded) {
      fetchDocuments();
    }
  }, [isSignedIn, isLoaded]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    setIsModalOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEventInputChange = (field: string, value: string) => {
    setEventFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      type: "medical",
      description: "",
      reminder: "1 day before",
    });
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    description: string;
    reminder: string;
  }) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      description: event.description,
      reminder: event.reminder,
    });
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      // Update existing event
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent.id
            ? { ...eventFormData, id: event.id }
            : event
        )
      );
    } else {
      // Add new event
      const newEvent = {
        ...eventFormData,
        id: Date.now(),
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "court":
        return "orange";
      case "medical":
        return "blue";
      case "therapy":
        return "green";
      case "consultation":
        return "purple";
      default:
        return "gray";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "court":
        return "⚖️";
      case "medical":
        return "🏥";
      case "therapy":
        return "💆";
      case "consultation":
        return "👨‍💼";
      default:
        return "📅";
    }
  };

  const handleAddDocument = () => {
    setDocumentFormData({
      name: "",
      type: "medical",
      description: "",
      file: null,
    });
    setIsDocumentModalOpen(true);
  };

  const handleDocumentInputChange = (
    field: string,
    value: string | File | null
  ) => {
    setDocumentFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (documentFormData.file) {
      try {
        const formData = new FormData();
        formData.append("name", documentFormData.name);
        formData.append("type", documentFormData.type);
        formData.append("description", documentFormData.description);
        formData.append("file", documentFormData.file);

        const response = await fetch("/api/documents", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const newDocument = await response.json();
          setDocuments((prev) => [newDocument, ...prev]);
          setIsDocumentModalOpen(false);
          setDocumentFormData({
            name: "",
            type: "medical",
            description: "",
            file: null,
          });
        } else {
          const errorData = await response.json();
          console.error(
            "Error uploading document:",
            response.status,
            errorData
          );
        }
      } catch (error) {
        console.error("Error uploading document:", error);
      }
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
      } else {
        console.error("Error deleting document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case "medical":
        return "blue";
      case "legal":
        return "orange";
      case "insurance":
        return "green";
      case "evidence":
        return "purple";
      default:
        return "gray";
    }
  };

  const getDocumentTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "image":
        return <FileImage className="w-5 h-5" />;
      case "video":
        return <FileVideo className="w-5 h-5" />;
      case "audio":
        return <FileAudio className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center pt-16"
        style={{
          backgroundImage: "url('/images/long-logo-ClaimSaver.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 pointer-events-none"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!isSignedIn) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center pt-16"
        style={{
          backgroundImage: "url('/images/long-logo-ClaimSaver.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 pointer-events-none"></div>
        <div className="relative z-10">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Authentication Required
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Please sign in to access your dashboard.
                </p>
                <Button className="w-full">Sign In</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show dashboard content for authenticated users
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
        <div className="relative z-10 w-full px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-600">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.firstName || user?.username || "User"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your accident claims and track your recovery progress.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-600 delay-100">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="h-16 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-transform duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>New Claim</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200"
              >
                <Search className="w-5 h-5" />
                <span>Search Claims</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200"
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-600 delay-200">
              <Card className="shadow-md border-blue-100 dark:border-blue-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Claims
                  </CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-blue-100 dark:border-blue-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Attorneys Assigned
                  </CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Specialized in your cases
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-blue-100 dark:border-blue-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Hearings
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">1</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Next: March 15, 2024
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-blue-100 dark:border-blue-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Recovery
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">
                    $12,450
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    +$2,100 this month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity and Claims */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-600 delay-300">
              {/* Recent Claims */}
              <Card className="shadow-md border-blue-100 dark:border-blue-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Recent Claims
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors duration-200">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Auto Accident - I-95
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Filed: March 1, 2024
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Slip & Fall - Mall
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Filed: February 15, 2024
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Medical Malpractice
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Filed: January 20, 2024
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                      Review
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card className="shadow-md border-blue-100 dark:border-blue-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Document Repository
                    </CardTitle>
                    <Button
                      onClick={handleAddDocument}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {documents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No documents uploaded</p>
                      <p className="text-sm">
                        Click &ldquo;Upload Document&rdquo; to add your first
                        file
                      </p>
                    </div>
                  ) : (
                    documents.map((document) => (
                      <div
                        key={document._id}
                        className={`flex items-center justify-between p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                          getDocumentTypeColor(document.type) === "blue"
                            ? "bg-blue-50 dark:bg-blue-950/30 border-blue-500"
                            : getDocumentTypeColor(document.type) === "orange"
                            ? "bg-orange-50 dark:bg-orange-950/30 border-orange-500"
                            : getDocumentTypeColor(document.type) === "green"
                            ? "bg-green-50 dark:bg-green-950/30 border-green-500"
                            : getDocumentTypeColor(document.type) === "purple"
                            ? "bg-purple-50 dark:bg-purple-950/30 border-purple-500"
                            : "bg-gray-50 dark:bg-gray-800 border-gray-500"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`p-2 rounded-lg ${
                              getDocumentTypeColor(document.type) === "blue"
                                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600"
                                : getDocumentTypeColor(document.type) ===
                                  "orange"
                                ? "bg-orange-100 dark:bg-orange-900/50 text-orange-600"
                                : getDocumentTypeColor(document.type) ===
                                  "green"
                                ? "bg-green-100 dark:bg-green-900/50 text-green-600"
                                : getDocumentTypeColor(document.type) ===
                                  "purple"
                                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                            }`}
                          >
                            {getDocumentTypeIcon(document.fileType)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {document.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <span>{document.size}</span>
                              <span>•</span>
                              <span>Uploaded: {document.uploadDate}</span>
                            </div>
                            {document.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {document.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-green-600"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocument(document._id)}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-600 delay-400">
              <Card className="shadow-md border-blue-100 dark:border-blue-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Upcoming Events
                    </CardTitle>
                    <Button
                      onClick={handleAddEvent}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <CalendarPlus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No events scheduled</p>
                        <p className="text-sm">
                          Click &ldquo;Add Event&rdquo; to schedule your first
                          appointment
                        </p>
                      </div>
                    ) : (
                      events.map((event) => (
                        <div
                          key={event.id}
                          className={`flex items-center justify-between p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                            getEventTypeColor(event.type) === "orange"
                              ? "bg-orange-50 dark:bg-orange-950/30 border-orange-500"
                              : getEventTypeColor(event.type) === "blue"
                              ? "bg-blue-50 dark:bg-blue-950/30 border-blue-500"
                              : getEventTypeColor(event.type) === "green"
                              ? "bg-green-50 dark:bg-green-950/30 border-green-500"
                              : getEventTypeColor(event.type) === "purple"
                              ? "bg-purple-50 dark:bg-purple-950/30 border-purple-500"
                              : "bg-gray-50 dark:bg-gray-800 border-gray-500"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-2xl">
                              {getEventTypeIcon(event.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {event.title}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {new Date(event.date).toLocaleDateString()}{" "}
                                    at {event.time}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              {event.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                              className="text-gray-600 hover:text-blue-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-gray-600 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* No-Fault Claim Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">
                      No-Fault Accident Claim Form
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Complete your claim submission with our secure form
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 transition-all duration-300 hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(95vh-120px)] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Accident Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <Car className="w-4 h-4 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Accident Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Accident Date *
                      </label>
                      <input
                        type="date"
                        value={formData.accidentDate}
                        onChange={(e) =>
                          handleInputChange("accidentDate", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Accident Location *
                      </label>
                      <input
                        type="text"
                        value={formData.accidentLocation}
                        onChange={(e) =>
                          handleInputChange("accidentLocation", e.target.value)
                        }
                        placeholder="e.g., I-95 near Exit 15, Miami, FL"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Accident Description *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.accidentDescription}
                        onChange={(e) =>
                          handleInputChange(
                            "accidentDescription",
                            e.target.value
                          )
                        }
                        placeholder="Please describe what happened, including the sequence of events..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Injuries Sustained *
                      </label>
                      <textarea
                        rows={3}
                        value={formData.injuries}
                        onChange={(e) =>
                          handleInputChange("injuries", e.target.value)
                        }
                        placeholder="Describe all injuries, pain, and symptoms..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Medical & Insurance Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Medical & Insurance Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Medical Provider
                      </label>
                      <input
                        type="text"
                        value={formData.medicalProvider}
                        onChange={(e) =>
                          handleInputChange("medicalProvider", e.target.value)
                        }
                        placeholder="Hospital, doctor, or clinic name"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Insurance Company *
                      </label>
                      <input
                        type="text"
                        value={formData.insuranceCompany}
                        onChange={(e) =>
                          handleInputChange("insuranceCompany", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Policy Number *
                      </label>
                      <input
                        type="text"
                        value={formData.policyNumber}
                        onChange={(e) =>
                          handleInputChange("policyNumber", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Vehicle Information
                      </label>
                      <input
                        type="text"
                        value={formData.vehicleInfo}
                        onChange={(e) =>
                          handleInputChange("vehicleInfo", e.target.value)
                        }
                        placeholder="Year, make, model, license plate"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Witnesses
                      </label>
                      <input
                        type="text"
                        value={formData.witnesses}
                        onChange={(e) =>
                          handleInputChange("witnesses", e.target.value)
                        }
                        placeholder="Names and contact information"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Police Report Number
                      </label>
                      <input
                        type="text"
                        value={formData.policeReport}
                        onChange={(e) =>
                          handleInputChange("policeReport", e.target.value)
                        }
                        placeholder="If available"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Submit Claim
                    <CheckCircle className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Management Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">
                      {editingEvent ? "Edit Event" : "Add New Event"}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Schedule your appointment or important event
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEventModalOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 transition-all duration-300 hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              <form onSubmit={handleEventSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={eventFormData.title}
                      onChange={(e) =>
                        handleEventInputChange("title", e.target.value)
                      }
                      placeholder="e.g., Doctor Appointment, Court Hearing"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Event Type *
                    </label>
                    <select
                      value={eventFormData.type}
                      onChange={(e) =>
                        handleEventInputChange("type", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      required
                    >
                      <option value="medical">Medical Appointment</option>
                      <option value="therapy">Physical Therapy</option>
                      <option value="court">Court Hearing</option>
                      <option value="consultation">
                        Attorney Consultation
                      </option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={eventFormData.date}
                      onChange={(e) =>
                        handleEventInputChange("date", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={eventFormData.time}
                      onChange={(e) =>
                        handleEventInputChange("time", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={eventFormData.location}
                      onChange={(e) =>
                        handleEventInputChange("location", e.target.value)
                      }
                      placeholder="e.g., Dr. Smith's Office, County Courthouse"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={eventFormData.description}
                      onChange={(e) =>
                        handleEventInputChange("description", e.target.value)
                      }
                      placeholder="Additional details about the event..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Reminder
                    </label>
                    <select
                      value={eventFormData.reminder}
                      onChange={(e) =>
                        handleEventInputChange("reminder", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    >
                      <option value="15 minutes">15 minutes before</option>
                      <option value="1 hour">1 hour before</option>
                      <option value="2 hours">2 hours before</option>
                      <option value="1 day">1 day before</option>
                      <option value="2 days">2 days before</option>
                      <option value="1 week">1 week before</option>
                    </select>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEventModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {editingEvent ? "Update Event" : "Add Event"}
                    <CheckCircle className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {isDocumentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">
                      Upload Document
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Add important documents to your repository
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDocumentModalOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 transition-all duration-300 hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              <form onSubmit={handleDocumentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Document Name *
                    </label>
                    <input
                      type="text"
                      value={documentFormData.name}
                      onChange={(e) =>
                        handleDocumentInputChange("name", e.target.value)
                      }
                      placeholder="e.g., Medical Records, Police Report"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Document Type *
                    </label>
                    <select
                      value={documentFormData.type}
                      onChange={(e) =>
                        handleDocumentInputChange("type", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      required
                    >
                      <option value="medical">Medical Records</option>
                      <option value="legal">Legal Documents</option>
                      <option value="insurance">Insurance Documents</option>
                      <option value="evidence">Evidence/Photos</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      File *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-200">
                      <input
                        type="file"
                        onChange={(e) =>
                          handleDocumentInputChange(
                            "file",
                            e.target.files?.[0] || null
                          )
                        }
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.wav"
                        required
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          PDF, DOC, Images, Videos, Audio (max 10MB)
                        </p>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={documentFormData.description}
                      onChange={(e) =>
                        handleDocumentInputChange("description", e.target.value)
                      }
                      placeholder="Brief description of the document..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDocumentModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Upload Document
                    <CheckCircle className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main dashboard component that handles Clerk availability
export default function Dashboard() {
  // Check if we're in a browser environment and Clerk is available
  const isClient = typeof window !== "undefined";
  const isClerkAvailable =
    isClient && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If Clerk is not available, show a loading state
  if (!isClerkAvailable) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center pt-16"
        style={{
          backgroundImage: "url('/images/long-logo-ClaimSaver.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 pointer-events-none"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return <DashboardContent />;
}
