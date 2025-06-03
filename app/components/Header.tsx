"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  BookOpen,
  User,
  Home,
  LogIn,
  ChevronDown,
  Clock,
  Heart,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMyPageDropdownOpen, setIsMyPageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMyPageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const myPageLinks = [
    {
      name: "My Page",
      href: "/my-page",
      icon: User,
      description: "Overview of your library",
    },
    {
      name: "Checked Out",
      href: "/my-page/checked-out",
      icon: BookOpen,
      description: "Currently borrowed books",
    },
    {
      name: "On Hold",
      href: "/my-page/on-hold",
      icon: Clock,
      description: "Reserved books waiting",
    },
    {
      name: "For Later",
      href: "/my-page/for-later",
      icon: Heart,
      description: "Your reading wishlist",
    },
  ];

  const { authorized } = useAuth();

  const signOut = async () => {
    try {
      const response = await fetch("/api/sign_out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      window.dispatchEvent(new Event("auth-changed"));

      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Library App
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Home Link */}
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              Home
            </Link>

            {/* My Page Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMyPageDropdownOpen(!isMyPageDropdownOpen)}
                onMouseEnter={() => setIsMyPageDropdownOpen(true)}
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 group"
              >
                <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                My Library
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMyPageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isMyPageDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50"
                  onMouseLeave={() => setIsMyPageDropdownOpen(false)}
                >
                  {myPageLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMyPageDropdownOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors duration-200 group"
                      >
                        <Icon className="w-5 h-5 mt-0.5 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Sign In/Sign Out Button */}
            {authorized ? (
              <button
                className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 group cursor-pointer"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 group cursor-pointer"
              >
                <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-slate-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col gap-2">
              {/* Home Link */}
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-slate-50"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>

              {/* My Page Links */}
              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="text-xs font-medium text-slate-500 px-3 py-1 uppercase tracking-wider">
                  My Library
                </div>
                {myPageLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-start gap-3 text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-slate-50"
                    >
                      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Sign In/Sign Out */}
              {authorized ? (
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors duration-200 mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors duration-200 mt-4"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
