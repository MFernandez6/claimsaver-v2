"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  Calendar,
  DollarSign,
  Shield,
  MessageSquare,
  Plus,
  Search,
  Bell,
} from "lucide-react";

// Force dynamic rendering to prevent static generation
export const dynamic = "force-dynamic";

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-blue-950 flex items-center justify-center pt-16">
        <div className="text-center">
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
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-blue-950 flex items-center justify-center pt-16">
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
    );
  }

  // Show dashboard content for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-blue-950 pt-24 px-4 sm:px-8">
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
          <Button className="h-16 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-transform duration-200">
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
              <div className="text-2xl font-bold text-emerald-600">$12,450</div>
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
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors duration-200">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  JD
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    John Davis, Esq.
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    &ldquo;I&apos;ve reviewed your case and we have a strong
                    position. Let&apos;s schedule a consultation.&rdquo;
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  SM
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Sarah Martinez
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    &ldquo;Your medical records have been received. We&apos;re
                    processing your claim.&rdquo;
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    1 day ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  RJ
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Robert Johnson
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    &ldquo;The insurance company has made an initial offer.
                    I&apos;ll call you tomorrow.&rdquo;
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    3 days ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-600 delay-400">
          <Card className="shadow-md border-blue-100 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border-l-4 border-orange-500">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Court Hearing - Auto Accident Case
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      March 15, 2024 at 10:00 AM
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      County Courthouse, Room 302
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-500">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Medical Evaluation
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      March 20, 2024 at 2:00 PM
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Dr. Smith&apos;s Office
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
