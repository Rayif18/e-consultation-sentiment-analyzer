import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function UploadSection({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile);
    setError("");
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && isValidFileType(droppedFile)) {
        handleFileSelect(droppedFile);
      } else {
        setError(
          "Please upload a supported file format (CSV, Excel, JSON, or TXT)",
        );
      }
    },
    [handleFileSelect],
  );

  const isValidFileType = (file) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/json",
      "text/plain",
      "text/tab-separated-values",
    ];
    const validExtensions = [".csv", ".xlsx", ".xls", ".json", ".txt", ".tsv"];

    return (
      validTypes.includes(file.type) ||
      validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
  };

  const handleFileInput = useCallback(
    (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile && isValidFileType(selectedFile)) {
        handleFileSelect(selectedFile);
      } else if (selectedFile) {
        setError(
          "Please upload a supported file format (CSV, Excel, JSON, or TXT)",
        );
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const analyzeComments = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setAnalyzing(true);
    setError("");
    setProgress(0);

    try {
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 30) {
            clearInterval(uploadInterval);
            return 30;
          }
          return prev + 5;
        });
      }, 200);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      clearInterval(uploadInterval);
      setProgress(50);

      if (!response.ok) {
        throw new Error(
          `Analysis failed: ${response.status} ${response.statusText}`,
        );
      }

      // Simulate analysis progress
      const analysisInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(analysisInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      const data = await response.json();

      setTimeout(() => {
        clearInterval(analysisInterval);
        setProgress(100);
        setUploading(false);
        setAnalyzing(false);
        onAnalysisComplete(data);
      }, 2000);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "Analysis failed. Please try again.");
      setUploading(false);
      setAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-extrabold text-3xl text-[#111318] dark:text-white/87 mb-4">
          Upload Comments for Analysis
        </h2>
        <p className="text-lg text-[#667085] dark:text-white/60 max-w-2xl mx-auto">
          Upload files containing citizen comments from the E-consultation
          module. Our AI will analyze sentiment, emotions, and generate
          actionable insights.
        </p>
      </div>

      {/* Upload Area */}
      <div className="max-w-2xl mx-auto">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
            file
              ? "border-[#0069FF] dark:border-[#4A90E2] bg-[#0069FF]/5 dark:bg-[#4A90E2]/10"
              : "border-[#E6EAF0] dark:border-white/20 hover:border-[#0069FF] dark:hover:border-[#4A90E2] hover:bg-[#0069FF]/5 dark:hover:bg-[#4A90E2]/10"
          }`}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls,.json,.txt,.tsv"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />

          <div className="space-y-4">
            {file ? (
              <>
                <CheckCircle
                  size={48}
                  className="mx-auto text-[#0069FF] dark:text-[#4A90E2]"
                />
                <div>
                  <p className="font-semibold text-[#111318] dark:text-white/87">
                    {file.name}
                  </p>
                  <p className="text-sm text-[#667085] dark:text-white/60">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload
                  size={48}
                  className="mx-auto text-[#667085] dark:text-white/60"
                />
                <div>
                  <p className="font-semibold text-[#111318] dark:text-white/87 mb-2">
                    Drop your file here, or click to browse
                  </p>
                  <p className="text-sm text-[#667085] dark:text-white/60">
                    Supports CSV, Excel, JSON, and TXT files up to 50MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
            <AlertCircle
              size={20}
              className="text-red-600 dark:text-red-400 flex-shrink-0"
            />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Progress Bar */}
        {(uploading || analyzing) && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#111318] dark:text-white/87">
                {uploading && progress < 50
                  ? "Uploading..."
                  : "Analyzing comments..."}
              </span>
              <span className="text-sm text-[#667085] dark:text-white/60">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-[#E6EAF0] dark:bg-white/20 rounded-full h-2">
              <div
                className="bg-[#0069FF] dark:bg-[#4A90E2] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <div className="mt-6 text-center">
          <button
            onClick={analyzeComments}
            disabled={!file || uploading}
            className={`inline-flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              !file || uploading
                ? "bg-[#E6EAF0] dark:bg-white/20 text-[#667085] dark:text-white/40 cursor-not-allowed"
                : "bg-[#0069FF] dark:bg-[#4A90E2] hover:bg-[#0056D1] dark:hover:bg-[#6BA3E8] transform hover:scale-105 active:scale-95"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FileText size={20} />
                <span>Analyze Comments</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sample Data Format */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Supported File Formats */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
            Supported File Formats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg text-center">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium text-[#111318] dark:text-white/87 mb-1">
                CSV Files
              </h4>
              <p className="text-sm text-[#667085] dark:text-white/60">.csv</p>
              <p className="text-xs text-[#667085] dark:text-white/60 mt-1">
                Comma-separated values
              </p>
            </div>
            <div className="p-4 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg text-center">
              <div className="text-2xl mb-2">📈</div>
              <h4 className="font-medium text-[#111318] dark:text-white/87 mb-1">
                Excel Files
              </h4>
              <p className="text-sm text-[#667085] dark:text-white/60">
                .xlsx, .xls
              </p>
              <p className="text-xs text-[#667085] dark:text-white/60 mt-1">
                Microsoft Excel spreadsheets
              </p>
            </div>
            <div className="p-4 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg text-center">
              <div className="text-2xl mb-2">🔗</div>
              <h4 className="font-medium text-[#111318] dark:text-white/87 mb-1">
                JSON Files
              </h4>
              <p className="text-sm text-[#667085] dark:text-white/60">.json</p>
              <p className="text-xs text-[#667085] dark:text-white/60 mt-1">
                JavaScript Object Notation
              </p>
            </div>
            <div className="p-4 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg text-center">
              <div className="text-2xl mb-2">📝</div>
              <h4 className="font-medium text-[#111318] dark:text-white/87 mb-1">
                Text Files
              </h4>
              <p className="text-sm text-[#667085] dark:text-white/60">
                .txt, .tsv
              </p>
              <p className="text-xs text-[#667085] dark:text-white/60 mt-1">
                Plain text and tab-separated
              </p>
            </div>
          </div>
          <p className="text-sm text-[#667085] dark:text-white/60 mt-4">
            <strong>Why these formats?</strong> CSV and Excel files are the most
            common export formats from government systems and surveys. JSON
            supports API integrations, while TXT files allow for simple
            copy-paste workflows from various sources.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
            Expected Data Structure (CSV Example)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E6EAF0] dark:border-white/10">
                  <th className="text-left py-2 px-3 font-medium text-[#667085] dark:text-white/60">
                    comment_id
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-[#667085] dark:text-white/60">
                    comment_text
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-[#667085] dark:text-white/60">
                    timestamp
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-[#667085] dark:text-white/60">
                    language
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-[#667085] dark:text-white/60">
                    user_id (optional)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#E6EAF0] dark:border-white/10">
                  <td className="py-2 px-3 text-[#111318] dark:text-white/87">
                    1
                  </td>
                  <td className="py-2 px-3 text-[#111318] dark:text-white/87">
                    This policy will help small businesses grow...
                  </td>
                  <td className="py-2 px-3 text-[#111318] dark:text-white/87">
                    2025-01-15 10:30:00
                  </td>
                  <td className="py-2 px-3 text-[#111318] dark:text-white/87">
                    en
                  </td>
                  <td className="py-2 px-3 text-[#111318] dark:text-white/87">
                    user_123
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-[#111318] dark:text-white/87">
                    2
                  </td>
                  <td className="py-2 px-3 text-[#111318] dark:text-white/87">
                    यह नीति बहुत अच्छी है...
                  </td>
                  <td className="py-2 px-3 text-[#111318] dark:text-white/87">
                    2025-01-15 11:45:00
                  </td>
                  <td className="py-2 px-3 text-[#111318] dark:text-white/87">
                    hi
                  </td>
                  <td className="py-2 px-3 text-[#111318] dark:text-white/87">
                    user_456
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[#667085] dark:text-white/60 mt-4">
            <strong>Note:</strong> The system supports English, Hindi, Tamil,
            Telugu, and other Indian languages.
          </p>
        </div>
      </div>
    </div>
  );
}
