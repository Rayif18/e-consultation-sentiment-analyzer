import { useState, useEffect } from "react";
import {
  Upload,
  BarChart3,
  FileText,
  Settings,
  Users,
  TrendingUp,
  Sun,
  Moon,
} from "lucide-react";
import UploadSection from "../components/UploadSection";
import Dashboard from "../components/Dashboard";
import Analytics from "../components/Analytics";
import Reports from "../components/Reports";
import Metrics from "../components/Metrics";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [userRole, setUserRole] = useState("analyst"); // 'policymaker' or 'analyst'
  const [analysisData, setAnalysisData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(initialDarkMode);
  }, []);

  useEffect(() => {
    // Apply dark mode class to document root
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const tabs = [
    { id: "upload", label: "Upload & Analyze", icon: Upload },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "metrics", label: "Metrics", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "upload":
        return <UploadSection onAnalysisComplete={setAnalysisData} />;
      case "dashboard":
        return <Dashboard data={analysisData} userRole={userRole} />;
      case "analytics":
        return <Analytics data={analysisData} />;
      case "reports":
        return <Reports data={analysisData} />;
      case "metrics":
        return <Metrics />;
      default:
        return <UploadSection onAnalysisComplete={setAnalysisData} />;
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "dark" : ""} bg-[#F8F9FC] dark:bg-[#121212]`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-[#1E1E1E] border-b border-[#E6EAF0] dark:border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0069FF] to-[#4A90E2] rounded-lg flex items-center justify-center">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-xl text-[#111318] dark:text-white/87">
                  E-Consultation Sentiment Analyzer
                </h1>
                <p className="text-sm text-[#667085] dark:text-white/60">
                  Ministry of Corporate Affairs - Smart India Hackathon 2025
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-[#F8F9FC] dark:bg-[#2A2A2A] border border-[#E6EAF0] dark:border-white/20 text-[#111318] dark:text-white/87 hover:bg-[#E6EAF0] dark:hover:bg-[#3A3A3A] transition-colors"
                title={
                  isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Role Selector */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-[#667085] dark:text-white/60">
                  Role:
                </span>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-[#2A2A2A] border border-[#E6EAF0] dark:border-white/20 rounded-lg text-sm text-[#111318] dark:text-white/87 focus:outline-none focus:ring-2 focus:ring-[#0069FF] dark:focus:ring-[#4A90E2]"
                >
                  <option value="analyst">Analyst</option>
                  <option value="policymaker">Policymaker</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-[#1E1E1E] border-b border-[#E6EAF0] dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-[#0069FF] dark:border-[#4A90E2] text-[#0069FF] dark:text-[#4A90E2]"
                      : "border-transparent text-[#667085] dark:text-white/60 hover:text-[#111318] dark:hover:text-white/87"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">{renderContent()}</main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#1E1E1E] border-t border-[#E6EAF0] dark:border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#667085] dark:text-white/60">
              © 2025 Ministry of Corporate Affairs. Built for Smart India
              Hackathon 2025.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[#667085] dark:text-white/60">
                Powered by AI & Open Source
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
