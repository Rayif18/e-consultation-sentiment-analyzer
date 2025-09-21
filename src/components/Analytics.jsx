import { useState, useMemo } from "react";
import { TrendingUp, Globe, Clock, Hash, Download } from "lucide-react";

export default function Analytics({ data }) {
  const [selectedMetric, setSelectedMetric] = useState("sentiment");
  const [timeRange, setTimeRange] = useState("30d");

  // Mock analytics data
  const mockAnalytics = useMemo(
    () => ({
      keywordTrends: [
        {
          keyword: "digital payment",
          frequency: 234,
          sentiment: 0.8,
          growth: 15,
        },
        {
          keyword: "small business",
          frequency: 189,
          sentiment: 0.6,
          growth: 8,
        },
        { keyword: "compliance", frequency: 167, sentiment: -0.3, growth: -5 },
        { keyword: "registration", frequency: 145, sentiment: 0.4, growth: 12 },
        { keyword: "tax rates", frequency: 134, sentiment: -0.2, growth: 3 },
        {
          keyword: "documentation",
          frequency: 123,
          sentiment: -0.1,
          growth: -2,
        },
        { keyword: "multilingual", frequency: 98, sentiment: 0.7, growth: 20 },
        { keyword: "startup", frequency: 87, sentiment: 0.5, growth: 18 },
        { keyword: "bureaucracy", frequency: 76, sentiment: -0.6, growth: -8 },
        { keyword: "innovation", frequency: 65, sentiment: 0.9, growth: 25 },
      ],
      languageAnalysis: [
        {
          language: "English",
          count: 8234,
          avgSentiment: 0.3,
          supportive: 45,
          critical: 28,
          suggestion: 22,
          irrelevant: 5,
        },
        {
          language: "Hindi",
          count: 4521,
          avgSentiment: 0.5,
          supportive: 52,
          critical: 23,
          suggestion: 20,
          irrelevant: 5,
        },
        {
          language: "Tamil",
          count: 1892,
          avgSentiment: 0.2,
          supportive: 38,
          critical: 35,
          suggestion: 22,
          irrelevant: 5,
        },
        {
          language: "Telugu",
          count: 1200,
          avgSentiment: 0.4,
          supportive: 48,
          critical: 25,
          suggestion: 23,
          irrelevant: 4,
        },
      ],
      temporalPatterns: [
        { hour: 0, comments: 45, avgSentiment: 0.2 },
        { hour: 6, comments: 67, avgSentiment: 0.4 },
        { hour: 9, comments: 156, avgSentiment: 0.2 },
        { hour: 11, comments: 234, avgSentiment: 0.6 },
        { hour: 12, comments: 267, avgSentiment: 0.3 },
        { hour: 15, comments: 198, avgSentiment: 0.5 },
        { hour: 18, comments: 134, avgSentiment: 0.4 },
        { hour: 21, comments: 87, avgSentiment: 0.1 },
      ],
      sentimentCorrelation: [
        { topic: "Digital Services", sentiment: 0.8, volume: 234 },
        { topic: "Tax Policy", sentiment: -0.2, volume: 189 },
        { topic: "Compliance", sentiment: -0.4, volume: 167 },
        { topic: "Registration Process", sentiment: 0.3, volume: 145 },
        { topic: "Documentation", sentiment: -0.1, volume: 134 },
        { topic: "Multilingual Support", sentiment: 0.7, volume: 123 },
        { topic: "Startup Policies", sentiment: 0.5, volume: 98 },
        { topic: "Business Licensing", sentiment: 0.1, volume: 87 },
      ],
      emotionRadar: [
        { emotion: "Optimism", value: 85, fullMark: 100 },
        { emotion: "Trust", value: 72, fullMark: 100 },
        { emotion: "Concern", value: 68, fullMark: 100 },
        { emotion: "Anger", value: 34, fullMark: 100 },
        { emotion: "Fear", value: 28, fullMark: 100 },
        { emotion: "Joy", value: 56, fullMark: 100 },
      ],
    }),
    [],
  );

  const actualData = data?.analytics || mockAnalytics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-3xl text-[#111318] dark:text-white/87 mb-2">
            Advanced Analytics
          </h2>
          <p className="text-lg text-[#667085] dark:text-white/60">
            Deep insights into patterns, trends, and correlations
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#2A2A2A] border border-[#E6EAF0] dark:border-white/20 rounded-lg text-sm"
          >
            <option value="sentiment">Sentiment Analysis</option>
            <option value="emotion">Emotion Analysis</option>
            <option value="language">Language Analysis</option>
            <option value="temporal">Temporal Patterns</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#2A2A2A] border border-[#E6EAF0] dark:border-white/20 rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-[#0069FF] dark:bg-[#4A90E2] text-white rounded-lg hover:bg-[#0056D1] dark:hover:bg-[#6BA3E8] transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#667085] dark:text-white/60 mb-1">
                Top Keyword
              </p>
              <p className="text-lg font-bold text-[#111318] dark:text-white/87">
                {actualData.keywordTrends[0]?.keyword}
              </p>
              <p className="text-sm text-[#10B981]">
                +{actualData.keywordTrends[0]?.growth}% growth
              </p>
            </div>
            <Hash size={24} className="text-[#0069FF] dark:text-[#4A90E2]" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#667085] dark:text-white/60 mb-1">
                Languages
              </p>
              <p className="text-lg font-bold text-[#111318] dark:text-white/87">
                {actualData.languageAnalysis.length}
              </p>
              <p className="text-sm text-[#667085] dark:text-white/60">
                Detected
              </p>
            </div>
            <Globe size={24} className="text-[#0069FF] dark:text-[#4A90E2]" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#667085] dark:text-white/60 mb-1">
                Peak Hour
              </p>
              <p className="text-lg font-bold text-[#111318] dark:text-white/87">
                {
                  actualData.temporalPatterns.reduce((max, curr) =>
                    curr.comments > max.comments ? curr : max,
                  ).hour
                }
                :00
              </p>
              <p className="text-sm text-[#667085] dark:text-white/60">
                Most active
              </p>
            </div>
            <Clock size={24} className="text-[#0069FF] dark:text-[#4A90E2]" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#667085] dark:text-white/60 mb-1">
                Trending
              </p>
              <p className="text-lg font-bold text-[#111318] dark:text-white/87">
                {actualData.keywordTrends.filter((k) => k.growth > 10).length}
              </p>
              <p className="text-sm text-[#10B981]">Keywords ↗</p>
            </div>
            <TrendingUp size={24} className="text-[#10B981]" />
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Keyword Trends */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
            Keyword Trends & Sentiment
          </h3>
          <div className="space-y-3">
            {actualData.keywordTrends.slice(0, 8).map((keyword, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#0069FF] dark:bg-[#4A90E2] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-[#111318] dark:text-white/87">
                      {keyword.keyword}
                    </p>
                    <p className="text-sm text-[#667085] dark:text-white/60">
                      {keyword.frequency} mentions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      keyword.sentiment > 0.3
                        ? "text-[#10B981]"
                        : keyword.sentiment < -0.3
                          ? "text-[#EF4444]"
                          : "text-[#F59E0B]"
                    }`}
                  >
                    {keyword.sentiment > 0 ? "+" : ""}
                    {(keyword.sentiment * 100).toFixed(0)}%
                  </div>
                  <div
                    className={`text-xs ${
                      keyword.growth > 0 ? "text-[#10B981]" : "text-[#EF4444]"
                    }`}
                  >
                    {keyword.growth > 0 ? "↗" : "↘"} {Math.abs(keyword.growth)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Analysis */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
            Language Distribution & Sentiment
          </h3>
          <div className="space-y-3">
            {actualData.languageAnalysis.map((lang, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#0069FF] dark:bg-[#4A90E2] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-[#111318] dark:text-white/87">
                      {lang.language}
                    </p>
                    <p className="text-sm text-[#667085] dark:text-white/60">
                      {lang.count} comments
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      lang.avgSentiment > 0.3
                        ? "text-[#10B981]"
                        : lang.avgSentiment < -0.3
                          ? "text-[#EF4444]"
                          : "text-[#F59E0B]"
                    }`}
                  >
                    {(lang.avgSentiment * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Temporal Patterns */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
        <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
          Hourly Activity & Sentiment Patterns
        </h3>
        <div className="space-y-3">
          {actualData.temporalPatterns.map((hourData, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#0069FF] dark:bg-[#4A90E2] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  {hourData.hour}:00
                </div>
                <div>
                  <p className="font-medium text-[#111318] dark:text-white/87">
                    {hourData.comments} comments
                  </p>
                  <p className="text-sm text-[#667085] dark:text-white/60">
                    {(hourData.avgSentiment * 100).toFixed(0)}% sentiment
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment vs Volume Correlation */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
            Topic Sentiment vs Volume
          </h3>
          <div className="space-y-3">
            {actualData.sentimentCorrelation.map((topicData, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#0069FF] dark:bg-[#4A90E2] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-[#111318] dark:text-white/87">
                      {topicData.topic}
                    </p>
                    <p className="text-sm text-[#667085] dark:text-white/60">
                      {topicData.volume} mentions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      topicData.sentiment > 0.3
                        ? "text-[#10B981]"
                        : topicData.sentiment < -0.3
                          ? "text-[#EF4444]"
                          : "text-[#F59E0B]"
                    }`}
                  >
                    {(topicData.sentiment * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emotion Radar */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
            Emotion Profile
          </h3>
          <div className="space-y-3">
            {actualData.emotionRadar.map((emotionData, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#0069FF] dark:bg-[#4A90E2] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-[#111318] dark:text-white/87">
                      {emotionData.emotion}
                    </p>
                    <p className="text-sm text-[#667085] dark:text-white/60">
                      {emotionData.value}% intensity
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      emotionData.value > 80
                        ? "text-[#10B981]"
                        : emotionData.value < 20
                          ? "text-[#EF4444]"
                          : "text-[#F59E0B]"
                    }`}
                  >
                    {emotionData.value}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Word Cloud Placeholder */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
        <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
          Word Cloud Visualization
        </h3>
        <div className="h-64 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">☁️</div>
            <p className="text-[#667085] dark:text-white/60">
              Word cloud visualization would be generated here
            </p>
            <p className="text-sm text-[#667085] dark:text-white/60 mt-2">
              Showing most frequent terms with sentiment-based coloring
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
