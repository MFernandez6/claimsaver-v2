"use client";

import { useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

export default function SessionManager() {
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();

  useEffect(() => {
    // Only run session management if user is signed in
    if (!isSignedIn) return;

    // Extended timeout - 30 minutes instead of immediate
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Function to handle page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // User has navigated away or minimized the browser
        // Set a flag to indicate the user has left
        sessionStorage.setItem("userLeftPage", "true");
        sessionStorage.setItem("leftPageTimestamp", Date.now().toString());
      }
    };

    // Function to handle beforeunload (when user closes tab/window)
    const handleBeforeUnload = () => {
      // User is closing the browser/tab
      sessionStorage.setItem("userLeftPage", "true");
      sessionStorage.setItem("leftPageTimestamp", Date.now().toString());
    };

    // Function to handle page focus (when user returns)
    const handlePageFocus = () => {
      const userLeftPage = sessionStorage.getItem("userLeftPage");
      const leftPageTimestamp = sessionStorage.getItem("leftPageTimestamp");

      if (userLeftPage === "true" && leftPageTimestamp) {
        const timeSinceLeft = Date.now() - parseInt(leftPageTimestamp);
        // Only sign out if user was away for more than the session timeout
        if (timeSinceLeft > SESSION_TIMEOUT) {
          // User has returned after being away for too long
          // Clear the flags and sign them out
          sessionStorage.removeItem("userLeftPage");
          sessionStorage.removeItem("leftPageTimestamp");
          signOut();
        } else {
          // User returned within the timeout period, clear the flags
          sessionStorage.removeItem("userLeftPage");
          sessionStorage.removeItem("leftPageTimestamp");
        }
      }
    };

    // Function to handle storage events (for cross-tab communication)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userLeftPage" && e.newValue === "true") {
        // Another tab has indicated the user left
        // Don't immediately sign out, let the timeout handle it
        const leftPageTimestamp = sessionStorage.getItem("leftPageTimestamp");
        if (leftPageTimestamp) {
          const timeSinceLeft = Date.now() - parseInt(leftPageTimestamp);
          if (timeSinceLeft > SESSION_TIMEOUT) {
            signOut();
          }
        }
      }
    };

    // Function to handle window blur (when user switches to another application)
    const handleWindowBlur = () => {
      sessionStorage.setItem("userLeftPage", "true");
      sessionStorage.setItem("leftPageTimestamp", Date.now().toString());
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("focus", handlePageFocus);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("storage", handleStorageChange);

    // Check if user left page on component mount
    const userLeftPage = sessionStorage.getItem("userLeftPage");
    const leftPageTimestamp = sessionStorage.getItem("leftPageTimestamp");

    if (userLeftPage === "true" && leftPageTimestamp) {
      const timeSinceLeft = Date.now() - parseInt(leftPageTimestamp);
      // Only sign out if user was away for more than the session timeout
      if (timeSinceLeft > SESSION_TIMEOUT) {
        sessionStorage.removeItem("userLeftPage");
        sessionStorage.removeItem("leftPageTimestamp");
        signOut();
      } else {
        // User returned within the timeout period, clear the flags
        sessionStorage.removeItem("userLeftPage");
        sessionStorage.removeItem("leftPageTimestamp");
      }
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("focus", handlePageFocus);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [signOut, isSignedIn]);

  // This component doesn't render anything
  return null;
}
