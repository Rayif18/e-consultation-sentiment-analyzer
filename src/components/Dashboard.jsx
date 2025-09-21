import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertTriangle, ThumbsUp, ThumbsDown, 
  MessageSquare, Users, Clock, Filter, Eye, ChevronRight 
} from 'lucide-react';

export default function Dashboard({ data, userRole = 'analyst' }) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('all');

  // Mock data for demonstration - in real app this would come from props
  const mockData = useMemo(() => ({
    summary: {
      totalComments: 15847,
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
      },
      trendsOverTime: [
        { date: '2025-01-10', supportive: 234, critical: 156, suggestion: 189, irrelevant: 45 },
        { date: '2025-01-11', supportive: 267, critical: 178, suggestion: 201, irrelevant: 52 },
        { date: '2025-01-12', supportive: 298, critical: 145, suggestion: 234, irrelevant: 38 },
        { date: '2025-01-13', supportive: 312, critical: 167, suggestion: 256, irrelevant: 41 },
        { date: '2025-01-14', supportive: 289, critical: 189, suggestion: 278, irrelevant: 47 },
        { date: '2025-01-15', supportive: 334, critical: 201, suggestion: 289, irrelevant: 55 },
        { date: '2025-01-16', supportive: 356, critical: 178, suggestion: 312, irrelevant: 49 }
      ],
      prioritySuggestions: [
        {
          id: 1,
          text: "Implement digital payment systems for small business registration",
          priority: 95,
          frequency: 234,
          sentiment: "supportive",
          evidence: ["digital payment", "small business", "registration", "easier process"]
        },
        {
          id: 2,
          text: "Reduce compliance burden for startups in first year",
          priority: 92,
          frequency: 189,
          sentiment: "suggestion",
          evidence: ["compliance burden", "startups", "first year", "reduce paperwork"]
        },
        {
          id: 3,
          text: "Provide multilingual support for all government forms",
          priority: 88,
          frequency: 167,
          sentiment: "critical",
          evidence: ["multilingual", "government forms", "language barrier", "accessibility"]
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
    },
    comments: [
      {
        id: 1,
        text: "This new policy for small business registration is excellent. It will help entrepreneurs start their ventures more easily.",
        sentiment: "supportive",
        emotion: "optimism",
        language: "english",
        timestamp: "2025-01-16 10:30:00",
        summary: "Positive feedback on small business registration policy",
        evidenceSpans: ["excellent", "help entrepreneurs", "more easily"],
        priorityScore: 85
      },
      {
        id: 2,
        text: "The compliance requirements are still too complex for new businesses. We need simpler processes.",
        sentiment: "critical",
        emotion: "concern",
        language: "english",
        timestamp: "2025-01-16 11:45:00",
        summary: "Concerns about complex compliance requirements",
        evidenceSpans: ["too complex", "need simpler processes"],
        priorityScore: 78
      }
    ]
  }), []);

  const actualData = data || mockData;

  // Color schemes
  const sentimentColors = {
    supportive: '#10B981',
    critical: '#EF4444',
    suggestion: '#F59E0B',
    irrelevant: '#6B7280'
  };

  const emotionColors = {
    optimism: '#10B981',
    concern: '#F59E0B',
    trust: '#3B82F6',
    anger: '#EF4444'
  };

  // Prepare chart data
  const sentimentChartData = Object.entries(actualData.summary.sentimentDistribution).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: sentimentColors[key]
  }));

  const emotionChartData = Object.entries(actualData.summary.emotionDistribution).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: emotionColors[key]
  }));

  if (userRole === 'policymaker') {
    return (
      <div className="space-y-8">
        {/* Policymaker Header */}
        <div className="text-center">
          <h2 className="font-extrabold text-3xl text-[#111318] dark:text-white/87 mb-4">
            Policy Insights Dashboard
          </h2>
          <p className="text-lg text-[#667085] dark:text-white/60">
            High-level insights and priority recommendations for policy decisions
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#667085] dark:text-white/60 mb-1">Total Comments</p>
                <p className="text-2xl font-bold text-[#111318] dark:text-white/87">
                  {actualData.summary.totalComments.toLocaleString()}
                </p>
              </div>
              <MessageSquare size={24} className="text-[#0069FF] dark:text-[#4A90E2]" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#667085] dark:text-white/60 mb-1">Supportive</p>
                <p className="text-2xl font-bold text-[#10B981]">
                  {Math.round((actualData.summary.sentimentDistribution.supportive / actualData.summary.totalComments) * 100)}%
                </p>
              </div>
              <ThumbsUp size={24} className="text-[#10B981]" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#667085] dark:text-white/60 mb-1">Critical</p>
                <p className="text-2xl font-bold text-[#EF4444]">
                  {Math.round((actualData.summary.sentimentDistribution.critical / actualData.summary.totalComments) * 100)}%
                </p>
              </div>
              <ThumbsDown size={24} className="text-[#EF4444]" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#667085] dark:text-white/60 mb-1">Suggestions</p>
                <p className="text-2xl font-bold text-[#F59E0B]">
                  {actualData.summary.sentimentDistribution.suggestion.toLocaleString()}
                </p>
              </div>
              <TrendingUp size={24} className="text-[#F59E0B]" />
            </div>
          </div>
        </div>

        {/* Priority Suggestions */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-xl text-[#111318] dark:text-white/87 mb-6">
            Top Priority Suggestions
          </h3>
          <div className="space-y-4">
            {actualData.summary.prioritySuggestions.map((suggestion, index) => (
              <div key={suggestion.id} className="border border-[#E6EAF0] dark:border-white/10 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#0069FF] dark:bg-[#4A90E2] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#111318] dark:text-white/87">{suggestion.text}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#667085] dark:text-white/60">Priority Score</div>
                    <div className="text-lg font-bold text-[#0069FF] dark:text-[#4A90E2]">{suggestion.priority}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-[#667085] dark:text-white/60">
                  <span>Mentioned {suggestion.frequency} times</span>
                  <span>•</span>
                  <span className={`capitalize ${
                    suggestion.sentiment === 'supportive' ? 'text-[#10B981]' :
                    suggestion.sentiment === 'critical' ? 'text-[#EF4444]' :
                    'text-[#F59E0B]'
                  }`}>
                    {suggestion.sentiment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controversial Topics */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-xl text-[#111318] dark:text-white/87 mb-6 flex items-center">
            <AlertTriangle size={20} className="text-[#F59E0B] mr-2" />
            Controversial Topics
          </h3>
          <div className="space-y-4">
            {actualData.summary.controversialTopics.map((topic, index) => (
              <div key={index} className="border border-[#E6EAF0] dark:border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-[#111318] dark:text-white/87">{topic.topic}</h4>
                  <span className="text-sm text-[#667085] dark:text-white/60">{topic.totalMentions} mentions</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-[#E6EAF0] dark:bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-[#10B981] h-2 rounded-full"
                      style={{ width: `${topic.supportive}%` }}
                    />
                  </div>
                  <div className="text-sm text-[#667085] dark:text-white/60">
                    {topic.supportive}% supportive, {topic.critical}% critical
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Analyst View
  return (
    <div className="space-y-8">
      {/* Analyst Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-3xl text-[#111318] dark:text-white/87 mb-2">
            Detailed Analytics Dashboard
          </h2>
          <p className="text-lg text-[#667085] dark:text-white/60">
            Comprehensive analysis with detailed breakdowns and evidence
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#2A2A2A] border border-[#E6EAF0] dark:border-white/20 rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#2A2A2A] border border-[#E6EAF0] dark:border-white/20 rounded-lg text-sm"
          >
            <option value="all">All Languages</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="tamil">Tamil</option>
            <option value="telugu">Telugu</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Distribution */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
            Sentiment Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Emotion Distribution */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
            Emotion Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emotionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0069FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trends Over Time */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
        <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
          Sentiment Trends Over Time
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={actualData.summary.trendsOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="supportive" stackId="1" stroke="#10B981" fill="#10B981" />
            <Area type="monotone" dataKey="suggestion" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
            <Area type="monotone" dataKey="critical" stackId="1" stroke="#EF4444" fill="#EF4444" />
            <Area type="monotone" dataKey="irrelevant" stackId="1" stroke="#6B7280" fill="#6B7280" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Comments Table */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
        <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
          Recent Comments with Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6EAF0] dark:border-white/10">
                <th className="text-left py-3 px-4 font-medium text-[#667085] dark:text-white/60">Comment</th>
                <th className="text-left py-3 px-4 font-medium text-[#667085] dark:text-white/60">Sentiment</th>
                <th className="text-left py-3 px-4 font-medium text-[#667085] dark:text-white/60">Emotion</th>
                <th className="text-left py-3 px-4 font-medium text-[#667085] dark:text-white/60">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-[#667085] dark:text-white/60">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {actualData.comments.map((comment) => (
                <tr key={comment.id} className="border-b border-[#E6EAF0] dark:border-white/10">
                  <td className="py-4 px-4">
                    <div className="max-w-md">
                      <p className="text-sm text-[#111318] dark:text-white/87 mb-1">{comment.text}</p>
                      <p className="text-xs text-[#667085] dark:text-white/60">{comment.summary}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      comment.sentiment === 'supportive' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      comment.sentiment === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {comment.sentiment}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#111318] dark:text-white/87 capitalize">{comment.emotion}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-[#0069FF] dark:text-[#4A90E2]">{comment.priorityScore}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {comment.evidenceSpans.map((span, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-[#0069FF]/10 dark:bg-[#4A90E2]/20 text-[#0069FF] dark:text-[#4A90E2]">
                          {span}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}