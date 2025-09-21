import { useState } from 'react';
import { Download, FileText, Calendar, Filter, Share, Eye, Printer } from 'lucide-react';

export default function Reports({ data }) {
  const [selectedReport, setSelectedReport] = useState('summary');
  const [dateRange, setDateRange] = useState('30d');
  const [format, setFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'summary',
      name: 'Executive Summary',
      description: 'High-level insights for policymakers',
      icon: FileText,
      estimatedPages: 3
    },
    {
      id: 'detailed',
      name: 'Detailed Analysis',
      description: 'Comprehensive analysis with evidence',
      icon: Eye,
      estimatedPages: 15
    },
    {
      id: 'trends',
      name: 'Trend Analysis',
      description: 'Temporal patterns and keyword trends',
      icon: Calendar,
      estimatedPages: 8
    },
    {
      id: 'language',
      name: 'Language Report',
      description: 'Multilingual sentiment breakdown',
      icon: Share,
      estimatedPages: 5
    }
  ];

  const generateReport = async () => {
    setGenerating(true);
    
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedReport,
          format: format,
          dateRange: dateRange,
          includeCharts: true,
          includeRawData: selectedReport === 'detailed'
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }

      // Create download link or open PDF for printing
      const blob = await response.blob();
      const contentType = response.headers.get('content-type');
      
      if (contentType === 'text/html' && response.headers.get('x-pdf-conversion') === 'true') {
        // For PDF format, open in new window and trigger print
        const url = window.URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        
        // Wait for the window to load, then trigger print
        printWindow.addEventListener('load', () => {
          setTimeout(() => {
            printWindow.print();
          }, 1000);
        });
        
        // Clean up after printing
        printWindow.addEventListener('afterprint', () => {
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            printWindow.close();
          }, 1000);
        });
      } else {
        // For other formats, download as before
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `sentiment-analysis-${selectedReport}-${dateRange}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

    } catch (error) {
      console.error('Report generation failed:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const previewReport = () => {
    // Open preview in new window
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    previewWindow.document.write(getReportPreview());
  };

  const getReportPreview = () => {
    const currentDate = new Date().toLocaleDateString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sentiment Analysis Report Preview</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { border-bottom: 2px solid #0069FF; padding-bottom: 20px; margin-bottom: 30px; }
          .title { color: #111318; font-size: 24px; font-weight: bold; margin: 0; }
          .subtitle { color: #667085; font-size: 14px; margin: 5px 0; }
          .section { margin: 30px 0; }
          .section h2 { color: #111318; font-size: 18px; border-bottom: 1px solid #E6EAF0; padding-bottom: 10px; }
          .metric { display: inline-block; margin: 10px 20px 10px 0; padding: 15px; border: 1px solid #E6EAF0; border-radius: 8px; }
          .metric-value { font-size: 24px; font-weight: bold; color: #0069FF; }
          .metric-label { font-size: 12px; color: #667085; }
          .chart-placeholder { height: 200px; background: #F8F9FC; border: 1px dashed #E6EAF0; display: flex; align-items: center; justify-content: center; color: #667085; margin: 20px 0; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #E6EAF0; font-size: 12px; color: #667085; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">E-Consultation Sentiment Analysis Report</h1>
          <p class="subtitle">Ministry of Corporate Affairs • Generated on ${currentDate}</p>
          <p class="subtitle">Report Type: ${reportTypes.find(r => r.id === selectedReport)?.name} • Period: ${dateRange}</p>
        </div>

        <div class="section">
          <h2>Executive Summary</h2>
          <p>This report analyzes citizen feedback from the E-consultation module, providing insights into public sentiment regarding corporate affairs policies.</p>
          
          <div class="metric">
            <div class="metric-value">15,847</div>
            <div class="metric-label">Total Comments</div>
          </div>
          
          <div class="metric">
            <div class="metric-value">39%</div>
            <div class="metric-label">Supportive</div>
          </div>
          
          <div class="metric">
            <div class="metric-value">29%</div>
            <div class="metric-label">Critical</div>
          </div>
          
          <div class="metric">
            <div class="metric-value">25%</div>
            <div class="metric-label">Suggestions</div>
          </div>
        </div>

        <div class="section">
          <h2>Key Findings</h2>
          <ul>
            <li><strong>Digital Payment Systems:</strong> Highest priority suggestion with 95% support score</li>
            <li><strong>Compliance Burden:</strong> Major concern for startups, mentioned 189 times</li>
            <li><strong>Multilingual Support:</strong> Critical need identified across all language groups</li>
            <li><strong>Peak Activity:</strong> Most comments received between 11:00-13:00</li>
          </ul>
        </div>

        <div class="section">
          <h2>Sentiment Distribution</h2>
          <div class="chart-placeholder">
            [Sentiment Distribution Chart]
          </div>
        </div>

        <div class="section">
          <h2>Priority Recommendations</h2>
          <ol>
            <li><strong>Implement digital payment systems</strong> for small business registration (Priority: 95)</li>
            <li><strong>Reduce compliance burden</strong> for startups in first year (Priority: 92)</li>
            <li><strong>Provide multilingual support</strong> for all government forms (Priority: 88)</li>
          </ol>
        </div>

        <div class="section">
          <h2>Language Analysis</h2>
          <div class="chart-placeholder">
            [Language Distribution Chart]
          </div>
          <p>Comments received in 4 languages: English (52%), Hindi (29%), Tamil (12%), Telugu (7%)</p>
        </div>

        <div class="footer">
          <p>This is a preview of the ${reportTypes.find(r => r.id === selectedReport)?.name.toLowerCase()}. The full report contains detailed analysis, charts, and appendices.</p>
          <p>Generated by E-Consultation Sentiment Analyzer • Smart India Hackathon 2025</p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-extrabold text-3xl text-[#111318] dark:text-white/87 mb-4">
          Generate Reports
        </h2>
        <p className="text-lg text-[#667085] dark:text-white/60 max-w-2xl mx-auto">
          Create comprehensive reports for stakeholders with customizable formats and detailed insights
        </p>
      </div>

      {/* Report Configuration */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-8">
          <h3 className="font-semibold text-xl text-[#111318] dark:text-white/87 mb-6">
            Report Configuration
          </h3>

          {/* Report Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#111318] dark:text-white/87 mb-4">
              Select Report Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                      selectedReport === report.id
                        ? 'border-[#0069FF] dark:border-[#4A90E2] bg-[#0069FF]/5 dark:bg-[#4A90E2]/10'
                        : 'border-[#E6EAF0] dark:border-white/20 hover:border-[#0069FF] dark:hover:border-[#4A90E2]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon size={24} className={`mt-1 ${
                        selectedReport === report.id 
                          ? 'text-[#0069FF] dark:text-[#4A90E2]' 
                          : 'text-[#667085] dark:text-white/60'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-[#111318] dark:text-white/87 mb-1">
                          {report.name}
                        </h4>
                        <p className="text-sm text-[#667085] dark:text-white/60 mb-2">
                          {report.description}
                        </p>
                        <p className="text-xs text-[#667085] dark:text-white/60">
                          ~{report.estimatedPages} pages
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-[#111318] dark:text-white/87 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#2A2A2A] border border-[#E6EAF0] dark:border-white/20 rounded-lg text-sm text-[#111318] dark:text-white/87"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111318] dark:text-white/87 mb-2">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#2A2A2A] border border-[#E6EAF0] dark:border-white/20 rounded-lg text-sm text-[#111318] dark:text-white/87"
              >
                <option value="pdf">PDF Document</option>
                <option value="xlsx">Excel Spreadsheet</option>
                <option value="csv">CSV Data</option>
                <option value="json">JSON Data</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111318] dark:text-white/87 mb-2">
                Language Filter
              </label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-[#2A2A2A] border border-[#E6EAF0] dark:border-white/20 rounded-lg text-sm text-[#111318] dark:text-white/87"
              >
                <option value="all">All Languages</option>
                <option value="english">English Only</option>
                <option value="hindi">Hindi Only</option>
                <option value="tamil">Tamil Only</option>
                <option value="telugu">Telugu Only</option>
              </select>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#111318] dark:text-white/87 mb-4">
              Include in Report
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#0069FF] dark:text-[#4A90E2] border-[#E6EAF0] dark:border-white/20 rounded focus:ring-[#0069FF] dark:focus:ring-[#4A90E2]"
                />
                <span className="ml-2 text-sm text-[#111318] dark:text-white/87">Charts and visualizations</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#0069FF] dark:text-[#4A90E2] border-[#E6EAF0] dark:border-white/20 rounded focus:ring-[#0069FF] dark:focus:ring-[#4A90E2]"
                />
                <span className="ml-2 text-sm text-[#111318] dark:text-white/87">Priority suggestions</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#0069FF] dark:text-[#4A90E2] border-[#E6EAF0] dark:border-white/20 rounded focus:ring-[#0069FF] dark:focus:ring-[#4A90E2]"
                />
                <span className="ml-2 text-sm text-[#111318] dark:text-white/87">Evidence spans and explanations</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0069FF] dark:text-[#4A90E2] border-[#E6EAF0] dark:border-white/20 rounded focus:ring-[#0069FF] dark:focus:ring-[#4A90E2]"
                />
                <span className="ml-2 text-sm text-[#111318] dark:text-white/87">Raw comment data (detailed reports only)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#0069FF] dark:text-[#4A90E2] border-[#E6EAF0] dark:border-white/20 rounded focus:ring-[#0069FF] dark:focus:ring-[#4A90E2]"
                />
                <span className="ml-2 text-sm text-[#111318] dark:text-white/87">Methodology and limitations</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E6EAF0] dark:border-white/10">
            <button
              onClick={previewReport}
              className="inline-flex items-center space-x-2 px-6 py-3 border border-[#E6EAF0] dark:border-white/20 text-[#111318] dark:text-white/87 rounded-lg hover:bg-[#F8F9FC] dark:hover:bg-[#2A2A2A] transition-colors"
            >
              <Eye size={20} />
              <span>Preview Report</span>
            </button>

            <button
              onClick={generateReport}
              disabled={generating}
              className={`inline-flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                generating
                  ? 'bg-[#E6EAF0] dark:bg-white/20 text-[#667085] dark:text-white/40 cursor-not-allowed'
                  : 'bg-[#0069FF] dark:bg-[#4A90E2] hover:bg-[#0056D1] dark:hover:bg-[#6BA3E8] transform hover:scale-105 active:scale-95'
              }`}
            >
              <Download size={20} />
              <span>{generating ? 'Generating...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
            Recent Reports
          </h3>
          <div className="space-y-3">
            {[
              {
                name: 'Executive Summary - Last 30 days',
                date: '2025-01-16 14:30',
                format: 'PDF',
                size: '2.3 MB',
                downloads: 12
              },
              {
                name: 'Detailed Analysis - Q4 2024',
                date: '2025-01-15 09:15',
                format: 'PDF',
                size: '8.7 MB',
                downloads: 8
              },
              {
                name: 'Language Report - December 2024',
                date: '2025-01-10 16:45',
                format: 'Excel',
                size: '1.2 MB',
                downloads: 15
              }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText size={20} className="text-[#0069FF] dark:text-[#4A90E2]" />
                  <div>
                    <p className="font-medium text-[#111318] dark:text-white/87">{report.name}</p>
                    <p className="text-sm text-[#667085] dark:text-white/60">
                      {report.date} • {report.format} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-[#667085] dark:text-white/60">
                    {report.downloads} downloads
                  </span>
                  <button className="p-2 text-[#0069FF] dark:text-[#4A90E2] hover:bg-[#0069FF]/10 dark:hover:bg-[#4A90E2]/20 rounded-lg transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
            Report Templates
          </h3>
          <p className="text-[#667085] dark:text-white/60 mb-6">
            Customize report templates for different stakeholders and use cases
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-[#E6EAF0] dark:border-white/20 rounded-lg">
              <h4 className="font-medium text-[#111318] dark:text-white/87 mb-2">Policymaker Brief</h4>
              <p className="text-sm text-[#667085] dark:text-white/60 mb-3">
                Concise 2-page summary with key insights and recommendations
              </p>
              <button className="text-sm text-[#0069FF] dark:text-[#4A90E2] hover:underline">
                Customize Template
              </button>
            </div>
            <div className="p-4 border border-[#E6EAF0] dark:border-white/20 rounded-lg">
              <h4 className="font-medium text-[#111318] dark:text-white/87 mb-2">Technical Analysis</h4>
              <p className="text-sm text-[#667085] dark:text-white/60 mb-3">
                Detailed methodology, metrics, and statistical analysis
              </p>
              <button className="text-sm text-[#0069FF] dark:text-[#4A90E2] hover:underline">
                Customize Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}