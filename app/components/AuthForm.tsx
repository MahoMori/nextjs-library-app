"use client";

import type React from "react";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  BookOpen,
  ArrowRight,
} from "lucide-react";

interface AuthFormProps {
  mode?: "signin" | "signup";
}

export default function AuthForm({ mode = "signin" }: AuthFormProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (authMode === "signin") {
      if (!formData.email || !formData.password) {
        alert("Email and password are required");
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch("/api/sign_in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to sign in");
        }

        // Redirect to the previsous page or home page
        if (window.history.length > 2) {
          window.history.back();
          return;
        }
        window.location.href = "/";
      } catch (error) {
        console.error("Error signing in:", error);
        alert("Failed to sign in. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    if (authMode === "signup") {
      if (!formData.name || !formData.email || !formData.password) {
        alert("All fields are required");
        setIsLoading(false);
        return;
      }
      if (!formData.confirmPassword) {
        alert("Please confirm your password");
        setIsLoading(false);
        return;
      }
      if (formData.confirmPassword !== formData.password) {
        alert("Passwords do not match");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/sign_up", {
          method: "POST",
          headers: {
            ContentType: "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to create account");
        }

        // Redirect to the sign-in page
        window.location.href = "/sign-in";
      } catch (error) {
        console.error("Error signing up:", error);
        alert(error);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(false);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {authMode === "signin" ? "Welcome Back" : "Join Library App"}
          </h1>
          <p className="text-slate-600">
            {authMode === "signin"
              ? "Sign in to access your digital library"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Auth Mode Toggle */}
        {/* <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-1 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setAuthMode("signin")}
              className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                authMode === "signin"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                authMode === "signup"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div> */}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (Sign Up Only) */}
            {authMode === "signup" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={authMode === "signup"}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {authMode === "signup" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required={authMode === "signup"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password Link (Sign In Only) */}
            {authMode === "signin" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Terms and Conditions (Sign Up Only) */}
            {authMode === "signup" && (
              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {authMode === "signin"
                    ? "Signing In..."
                    : "Creating Account..."}
                </>
              ) : (
                <>
                  {authMode === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Alternative Action */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              {authMode === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={toggleAuthMode}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer"
              >
                {authMode === "signin" ? "Sign up here" : "Sign in here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
