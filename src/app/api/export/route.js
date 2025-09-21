export async function POST(request) {
  try {
    const body = await request.json();
    const { type, format, dateRange, includeCharts, includeRawData } = body;

    if (!type || !format) {
      return Response.json({ error: 'Missing required parameters: type and format' }, { status: 400 });
    }

    // Generate report content based on type
    const reportData = generateReportData(type, dateRange);
    
    if (format === 'json') {
      return Response.json(reportData);
    }
    
    if (format === 'csv') {
      const csvContent = generateCSV(reportData, type);
      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="sentiment-analysis-${type}-${dateRange}.csv"`
        }
      });
    }
    
    if (format === 'xlsx') {
      // For demo purposes, return a simple Excel-like CSV
      const excelContent = generateExcelCSV(reportData, type);
      return new Response(excelContent, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="sentiment-analysis-${type}-${dateRange}.xlsx"`
        }
      });
    }
    
    if (format === 'pdf') {
      // For PDF format, return HTML with instructions for browser-side PDF generation
      const htmlContent = generatePDFContent(reportData, type, includeCharts);
      return new Response(htmlContent, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="sentiment-analysis-${type}-${dateRange}.html"`,
          'X-PDF-Conversion': 'true'
        }
      });
    }

    return Response.json({ error: 'Unsupported format' }, { status: 400 });

  } catch (error) {
    console.error('Export error:', error);
    return Response.json({ 
      error: 'Failed to generate report. Please try again.' 
    }, { status: 500 });
  }
}

function generateReportData(type, dateRange) {
  const currentDate = new Date().toLocaleDateString();
  
  // Mock data for different report types
  const baseData = {
    metadata: {
      reportType: type,
      dateRange: dateRange,
      generatedAt: currentDate,
      totalComments: 15847,
      analysisVersion: '1.0.0'
    },
    summary: {
      sentimentDistribution: {
        supportive: 6234,
        critical: 4521,
        suggestion: 3892,
        irrelevant: 1200
      },
      emotionDistribution: {
        optimism: 5234,
        concern: 4521,
        trust: 3892,
        anger: 2200
      },
      languageDistribution: {
        english: 8234,
        hindi: 4521,
        tamil: 1892,
        telugu: 1200
      }
    },
    keyFindings: [
      "Digital Payment Systems: Highest priority suggestion with 95% support score",
      "Compliance Burden: Major concern for startups, mentioned 189 times",
      "Multilingual Support: Critical need identified across all language groups",
      "Peak Activity: Most comments received between 11:00-13:00"
    ],
    prioritySuggestions: [
      {
        rank: 1,
        text: "Implement digital payment systems for small business registration",
        priority: 95,
        frequency: 234,
        sentiment: "supportive"
      },
      {
        rank: 2,
        text: "Reduce compliance burden for startups in first year",
        priority: 92,
        frequency: 189,
        sentiment: "suggestion"
      },
      {
        rank: 3,
        text: "Provide multilingual support for all government forms",
        priority: 88,
        frequency: 167,
        sentiment: "critical"
      }
    ],
    controversialTopics: [
      {
        topic: "Tax rates for small businesses",
        supportive: 45,
        critical: 55,
        totalMentions: 456
      },
      {
        topic: "Digital documentation requirements",
        supportive: 62,
        critical: 38,
        totalMentions: 234
      }
    ]
  };

  // Customize data based on report type
  if (type === 'summary') {
    return {
      ...baseData,
      sections: ['Executive Summary', 'Key Metrics', 'Priority Recommendations']
    };
  }
  
  if (type === 'detailed') {
    return {
      ...baseData,
      sections: ['Executive Summary', 'Detailed Analysis', 'Evidence Spans', 'Methodology', 'Raw Data'],
      methodology: {
        models: ['mBERT for sentiment classification', 'mT5 for summarization'],
        accuracy: '86% overall accuracy',
        languages: 'English, Hindi, Tamil, Telugu',
        limitations: 'Performance varies by language due to training data availability'
      },
      sampleComments: [
        {
          id: 1,
          text: "This new policy for small business registration is excellent. It will help entrepreneurs start their ventures more easily.",
          sentiment: "supportive",
          emotion: "optimism",
          evidenceSpans: ["excellent", "help entrepreneurs", "more easily"],
          priorityScore: 85
        },
        {
          id: 2,
          text: "The compliance requirements are still too complex for new businesses. We need simpler processes.",
          sentiment: "critical",
          emotion: "concern",
          evidenceSpans: ["too complex", "need simpler processes"],
          priorityScore: 78
        }
      ]
    };
  }
  
  if (type === 'trends') {
    return {
      ...baseData,
      sections: ['Trend Analysis', 'Keyword Evolution', 'Temporal Patterns'],
      trends: {
        keywordTrends: [
          { keyword: 'digital payment', frequency: 234, growth: 15 },
          { keyword: 'small business', frequency: 189, growth: 8 },
          { keyword: 'compliance', frequency: 167, growth: -5 }
        ],
        temporalPatterns: {
          peakHours: '11:00-13:00',
          peakDays: 'Tuesday, Wednesday',
          seasonality: 'Higher activity during policy announcement periods'
        }
      }
    };
  }
  
  if (type === 'language') {
    return {
      ...baseData,
      sections: ['Language Distribution', 'Cross-Language Analysis', 'Translation Quality'],
      languageAnalysis: {
        english: { count: 8234, avgSentiment: 0.3, accuracy: 88 },
        hindi: { count: 4521, avgSentiment: 0.5, accuracy: 86 },
        tamil: { count: 1892, avgSentiment: 0.2, accuracy: 82 },
        telugu: { count: 1200, avgSentiment: 0.4, accuracy: 84 }
      }
    };
  }

  return baseData;
}

function generateCSV(data, type) {
  let csv = '';
  
  // Add metadata
  csv += `Report Type,${data.metadata.reportType}\n`;
  csv += `Generated At,${data.metadata.generatedAt}\n`;
  csv += `Total Comments,${data.metadata.totalComments}\n`;
  csv += `Date Range,${data.metadata.dateRange}\n\n`;

  // Add sentiment distribution
  csv += 'Sentiment Analysis\n';
  csv += 'Sentiment,Count,Percentage\n';
  const total = data.metadata.totalComments;
  Object.entries(data.summary.sentimentDistribution).forEach(([sentiment, count]) => {
    const percentage = ((count / total) * 100).toFixed(1);
    csv += `${sentiment},${count},${percentage}%\n`;
  });
  csv += '\n';

  // Add priority suggestions
  csv += 'Priority Suggestions\n';
  csv += 'Rank,Suggestion,Priority Score,Frequency,Sentiment\n';
  data.prioritySuggestions.forEach(suggestion => {
    csv += `${suggestion.rank},"${suggestion.text}",${suggestion.priority},${suggestion.frequency},${suggestion.sentiment}\n`;
  });
  csv += '\n';

  // Add controversial topics
  csv += 'Controversial Topics\n';
  csv += 'Topic,Supportive %,Critical %,Total Mentions\n';
  data.controversialTopics.forEach(topic => {
    csv += `"${topic.topic}",${topic.supportive},${topic.critical},${topic.totalMentions}\n`;
  });

  return csv;
}

function generateExcelCSV(data, type) {
  // Enhanced CSV format that works well with Excel
  let csv = 'E-Consultation Sentiment Analysis Report\n';
  csv += `Report Type:,${data.metadata.reportType}\n`;
  csv += `Generated:,${data.metadata.generatedAt}\n`;
  csv += `Period:,${data.metadata.dateRange}\n`;
  csv += `Total Comments:,${data.metadata.totalComments}\n\n`;

  // Summary table
  csv += 'EXECUTIVE SUMMARY\n';
  csv += 'Metric,Value,Percentage\n';
  const total = data.metadata.totalComments;
  Object.entries(data.summary.sentimentDistribution).forEach(([sentiment, count]) => {
    const percentage = ((count / total) * 100).toFixed(1);
    csv += `${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)},${count},${percentage}%\n`;
  });
  csv += '\n';

  // Language breakdown
  csv += 'LANGUAGE DISTRIBUTION\n';
  csv += 'Language,Comments,Percentage\n';
  Object.entries(data.summary.languageDistribution).forEach(([lang, count]) => {
    const percentage = ((count / total) * 100).toFixed(1);
    csv += `${lang.charAt(0).toUpperCase() + lang.slice(1)},${count},${percentage}%\n`;
  });
  csv += '\n';

  // Top recommendations
  csv += 'TOP PRIORITY RECOMMENDATIONS\n';
  csv += 'Priority,Recommendation,Score,Mentions,Type\n';
  data.prioritySuggestions.forEach((item, index) => {
    csv += `${index + 1},"${item.text}",${item.priority},${item.frequency},${item.sentiment}\n`;
  });

  return csv;
}

function generatePDFContent(data, type, includeCharts) {
  // Enhanced HTML template optimized for PDF generation via browser print
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>E-Consultation Sentiment Analysis Report</title>
    <style>
        @page {
            size: A4;
            margin: 1cm;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            .no-print {
                display: none !important;
            }
            .page-break {
                page-break-before: always;
            }
        }
        
        @media screen {
            body {
                background: #f5f5f5;
            }
            .print-container {
                background: white;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                margin: 20px auto;
                max-width: 210mm;
            }
        }
        
        * {
            box-sizing: border-box;
        }
        
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px;
            line-height: 1.6; 
            color: #333; 
            font-size: 12pt;
        }
        
        .print-container {
            padding: 40px;
            min-height: 280mm;
        }
        
        .header { 
            border-bottom: 3px solid #0069FF; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
            text-align: center;
        }
        
        .title { 
            color: #111318; 
            font-size: 24pt; 
            font-weight: bold; 
            margin: 0;
            line-height: 1.2;
        }
        
        .subtitle { 
            color: #667085; 
            font-size: 11pt; 
            margin: 8px 0; 
        }
        
        .section { 
            margin: 30px 0; 
            page-break-inside: avoid;
        }
        
        .section h2 { 
            color: #111318; 
            font-size: 16pt; 
            border-bottom: 2px solid #E6EAF0; 
            padding-bottom: 10px; 
            margin-bottom: 20px;
        }
        
        .metric-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
            gap: 15px; 
            margin: 20px 0; 
        }
        
        .metric-card { 
            border: 1px solid #E6EAF0; 
            border-radius: 8px; 
            padding: 15px; 
            text-align: center;
            page-break-inside: avoid;
        }
        
        .metric-value { 
            font-size: 24pt; 
            font-weight: bold; 
            color: #0069FF; 
            margin-bottom: 5px; 
        }
        
        .metric-label { 
            font-size: 9pt; 
            color: #667085; 
        }
        
        .recommendation { 
            background: #F8F9FC; 
            border-left: 4px solid #0069FF; 
            padding: 15px; 
            margin: 15px 0;
            page-break-inside: avoid;
        }
        
        .recommendation h4 { 
            margin: 0 0 10px 0; 
            color: #111318; 
            font-size: 12pt;
        }
        
        .priority-score { 
            background: #0069FF; 
            color: white; 
            padding: 2px 6px; 
            border-radius: 4px; 
            font-size: 9pt; 
            font-weight: bold; 
        }
        
        .controversial-topic { 
            background: #FFF3CD; 
            border-left: 4px solid #F59E0B; 
            padding: 15px; 
            margin: 15px 0;
            page-break-inside: avoid;
        }
        
        .progress-bar { 
            background: #E6EAF0; 
            height: 8px; 
            border-radius: 4px; 
            overflow: hidden; 
            margin: 10px 0; 
        }
        
        .progress-fill { 
            background: #0069FF; 
            height: 100%; 
        }
        
        .footer { 
            margin-top: 60px; 
            padding-top: 20px; 
            border-top: 1px solid #E6EAF0; 
            font-size: 9pt; 
            color: #667085; 
            text-align: center;
            page-break-inside: avoid;
        }
        
        .key-finding { 
            background: #E8F4FD; 
            border-radius: 6px; 
            padding: 12px; 
            margin: 10px 0;
            page-break-inside: avoid;
        }
        
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
            font-size: 10pt;
        }
        
        th, td { 
            border: 1px solid #E6EAF0; 
            padding: 8px; 
            text-align: left; 
        }
        
        th { 
            background: #F8F9FC; 
            font-weight: bold; 
        }
        
        .chart-placeholder { 
            height: 200px; 
            background: #F8F9FC; 
            border: 2px dashed #E6EAF0; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #667085; 
            margin: 20px 0; 
            border-radius: 8px;
            font-size: 10pt;
            text-align: center;
            padding: 20px;
        }
        
        .print-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            text-align: center;
        }
        
        .print-button {
            background: #0069FF;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            margin: 5px;
        }
        
        .print-button:hover {
            background: #0056D1;
        }
        
        .print-info {
            font-size: 12px;
            color: #667085;
            margin-bottom: 10px;
        }
    </style>
    <script>
        // Auto-trigger print when page loads
        window.addEventListener('load', function() {
            setTimeout(function() {
                if (confirm('This report is ready to be saved as PDF. Click OK to open the print dialog, then choose "Save as PDF" as the destination.')) {
                    window.print();
                }
            }, 1000);
        });
        
        // Handle after print event
        window.addEventListener('afterprint', function() {
            setTimeout(function() {
                if (confirm('PDF generation complete! Would you like to close this window?')) {
                    window.close();
                }
            }, 500);
        });
    </script>
</head>
<body>
    <div class="print-controls no-print">
        <div class="print-info">This report is ready for printing</div>
        <button class="print-button" onclick="window.print()">🖨️ Print Report</button>
        <button class="print-button" onclick="window.close()">✖️ Close</button>
    </div>
    
    <div class="print-container">
        <div class="header">
            <h1 class="title">E-Consultation Sentiment Analysis Report</h1>
            <p class="subtitle">Ministry of Corporate Affairs • Smart India Hackathon 2025</p>
            <p class="subtitle">Report Type: ${getReportTypeName(type)} • Generated: ${data.metadata.generatedAt} • Period: ${data.metadata.dateRange}</p>
        </div>

        <div class="section">
            <h2>Executive Summary</h2>
            <p>This report analyzes citizen feedback from the E-consultation module, providing comprehensive insights into public sentiment regarding corporate affairs policies and regulations.</p>
            
            <div class="metric-grid">
                <div class="metric-card">
                    <div class="metric-value">${data.metadata.totalComments.toLocaleString()}</div>
                    <div class="metric-label">Total Comments Analyzed</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${Math.round((data.summary.sentimentDistribution.supportive / data.metadata.totalComments) * 100)}%</div>
                    <div class="metric-label">Supportive Sentiment</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${Math.round((data.summary.sentimentDistribution.critical / data.metadata.totalComments) * 100)}%</div>
                    <div class="metric-label">Critical Feedback</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${Object.keys(data.summary.languageDistribution).length}</div>
                    <div class="metric-label">Languages Detected</div>
                </div>
            </div>
        </div>

    <div class="section">
        <h2>Key Findings</h2>
        ${data.keyFindings.map(finding => `<div class="key-finding">• ${finding}</div>`).join('')}
    </div>

    ${includeCharts ? `
    <div class="section">
        <h2>Sentiment Distribution</h2>
        <div class="chart-placeholder">
            [Sentiment Distribution Chart - Supportive: ${Math.round((data.summary.sentimentDistribution.supportive / data.metadata.totalComments) * 100)}%, Critical: ${Math.round((data.summary.sentimentDistribution.critical / data.metadata.totalComments) * 100)}%, Suggestions: ${Math.round((data.summary.sentimentDistribution.suggestion / data.metadata.totalComments) * 100)}%]
        </div>
    </div>
    ` : ''}

    <div class="section">
        <h2>Priority Recommendations</h2>
        <p>Based on sentiment analysis and frequency of mentions, the following recommendations have been identified as high priority for policy consideration:</p>
        ${data.prioritySuggestions.map((rec, index) => `
            <div class="recommendation">
                <h4>${index + 1}. ${rec.text} <span class="priority-score">Priority: ${rec.priority}</span></h4>
                <p><strong>Mentioned:</strong> ${rec.frequency} times • <strong>Sentiment:</strong> ${rec.sentiment}</p>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>Controversial Topics</h2>
        <p>Topics with mixed public opinion that require careful consideration:</p>
        ${data.controversialTopics.map(topic => `
            <div class="controversial-topic">
                <h4>${topic.topic}</h4>
                <p><strong>Total Mentions:</strong> ${topic.totalMentions}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${topic.supportive}%"></div>
                </div>
                <p>${topic.supportive}% supportive, ${topic.critical}% critical</p>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>Language Analysis</h2>
        <table>
            <thead>
                <tr>
                    <th>Language</th>
                    <th>Comments</th>
                    <th>Percentage</th>
                    <th>Avg Sentiment</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(data.summary.languageDistribution).map(([lang, count]) => `
                    <tr>
                        <td>${lang.charAt(0).toUpperCase() + lang.slice(1)}</td>
                        <td>${count.toLocaleString()}</td>
                        <td>${Math.round((count / data.metadata.totalComments) * 100)}%</td>
                        <td>Positive</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    ${type === 'detailed' && data.methodology ? `
    <div class="section">
        <h2>Methodology</h2>
        <p><strong>Models Used:</strong> ${data.methodology.models.join(', ')}</p>
        <p><strong>Overall Accuracy:</strong> ${data.methodology.accuracy}</p>
        <p><strong>Languages Supported:</strong> ${data.methodology.languages}</p>
        <p><strong>Limitations:</strong> ${data.methodology.limitations}</p>
    </div>
    ` : ''}

    <div class="footer">
        <p>This report was generated by the E-Consultation Sentiment Analyzer developed for Smart India Hackathon 2025.</p>
        <p>For technical details and methodology, please refer to the detailed analysis documentation.</p>
        <p>© 2025 Ministry of Corporate Affairs. All rights reserved.</p>
    </div>
</body>
</html>
  `;

  return html;
}

function getReportTypeName(type) {
  const names = {
    'summary': 'Executive Summary',
    'detailed': 'Detailed Analysis',
    'trends': 'Trend Analysis',
    'language': 'Language Report'
  };
  return names[type] || type;
}