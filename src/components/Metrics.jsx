import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { 
  Target, TrendingUp, AlertCircle, CheckCircle, Info, 
  RefreshCw, Download, Settings, Award 
} from 'lucide-react';

export default function Metrics() {
  const [selectedModel, setSelectedModel] = useState('sentiment');
  const [showDetails, setShowDetails] = useState(false);

  // Mock evaluation metrics data
  const evaluationMetrics = {
    sentiment: {
      precision: { supportive: 0.89, critical: 0.85, suggestion: 0.82, irrelevant: 0.91 },
      recall: { supportive: 0.87, critical: 0.83, suggestion: 0.79, irrelevant: 0.93 },
      f1Score: { supportive: 0.88, critical: 0.84, suggestion: 0.80, irrelevant: 0.92 },
      accuracy: 0.86,
      macroF1: 0.86,
      weightedF1: 0.87,
      confusionMatrix: [
        { actual: 'Supportive', supportive: 1234, critical: 89, suggestion: 67, irrelevant: 23 },
        { actual: 'Critical', supportive: 78, critical: 1156, suggestion: 45, irrelevant: 12 },
        { actual: 'Suggestion', supportive: 56, critical: 67, suggestion: 1089, irrelevant: 34 },
        { actual: 'Irrelevant', supportive: 12, critical: 8, suggestion: 23, irrelevant: 567 }
      ]
    },
    emotion: {
      precision: { optimism: 0.84, concern: 0.79, trust: 0.81, anger: 0.88 },
      recall: { optimism: 0.82, concern: 0.77, trust: 0.83, anger: 0.85 },
      f1Score: { optimism: 0.83, concern: 0.78, trust: 0.82, anger: 0.86 },
      accuracy: 0.82,
      macroF1: 0.82,
      weightedF1: 0.83
    },
    summarization: {
      rouge1: 0.67,
      rouge2: 0.45,
      rougeL: 0.62,
      humanEvaluation: {
        relevance: 4.2,
        coherence: 4.1,
        fluency: 4.3,
        informativeness: 3.9
      }
    }
  };

  const performanceMetrics = {
    processingSpeed: {
      avgProcessingTime: 2.3, // seconds per comment
      throughput: 1500, // comments per hour
      batchProcessingTime: 45 // minutes for 1000 comments
    },
    systemHealth: {
      uptime: 99.7,
      errorRate: 0.3,
      memoryUsage: 68,
      cpuUsage: 45
    }
  };

  const modelComparison = [
    { model: 'mBERT', accuracy: 0.86, f1Score: 0.87, speed: 2.3 },
    { model: 'XLM-R', accuracy: 0.88, f1Score: 0.89, speed: 3.1 },
    { model: 'IndicBERT', accuracy: 0.84, f1Score: 0.85, speed: 2.1 },
    { model: 'Baseline', accuracy: 0.72, f1Score: 0.71, speed: 0.8 }
  ];

  const getMetricColor = (value, type = 'accuracy') => {
    if (type === 'accuracy' || type === 'f1') {
      if (value >= 0.85) return 'text-[#10B981]';
      if (value >= 0.75) return 'text-[#F59E0B]';
      return 'text-[#EF4444]';
    }
    if (type === 'rouge') {
      if (value >= 0.6) return 'text-[#10B981]';
      if (value >= 0.4) return 'text-[#F59E0B]';
      return 'text-[#EF4444]';
    }
    return 'text-[#111318] dark:text-white/87';
  };

  const getMetricStatus = (value, type = 'accuracy') => {
    if (type === 'accuracy' || type === 'f1') {
      if (value >= 0.85) return { icon: CheckCircle, color: 'text-[#10B981]', label: 'Excellent' };
      if (value >= 0.75) return { icon: AlertCircle, color: 'text-[#F59E0B]', label: 'Good' };
      return { icon: AlertCircle, color: 'text-[#EF4444]', label: 'Needs Improvement' };
    }
    return { icon: Info, color: 'text-[#0069FF]', label: 'Info' };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-3xl text-[#111318] dark:text-white/87 mb-2">
            Model Performance Metrics
          </h2>
          <p className="text-lg text-[#667085] dark:text-white/60">
            Evaluation metrics, performance benchmarks, and model comparison
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#2A2A2A] border border-[#E6EAF0] dark:border-white/20 rounded-lg text-sm"
          >
            <option value="sentiment">Sentiment Model</option>
            <option value="emotion">Emotion Model</option>
            <option value="summarization">Summarization Model</option>
          </select>

          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-[#0069FF] dark:bg-[#4A90E2] text-white rounded-lg hover:bg-[#0056D1] dark:hover:bg-[#6BA3E8] transition-colors">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overall Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#667085] dark:text-white/60 mb-1">Overall Accuracy</p>
              <p className={`text-2xl font-bold ${getMetricColor(evaluationMetrics[selectedModel].accuracy)}`}>
                {(evaluationMetrics[selectedModel].accuracy * 100).toFixed(1)}%
              </p>
              <div className="flex items-center mt-2">
                {(() => {
                  const status = getMetricStatus(evaluationMetrics[selectedModel].accuracy);
                  const StatusIcon = status.icon;
                  return (
                    <>
                      <StatusIcon size={16} className={`mr-1 ${status.color}`} />
                      <span className={`text-xs ${status.color}`}>{status.label}</span>
                    </>
                  );
                })()}
              </div>
            </div>
            <Target size={24} className="text-[#0069FF] dark:text-[#4A90E2]" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#667085] dark:text-white/60 mb-1">Macro F1-Score</p>
              <p className={`text-2xl font-bold ${getMetricColor(evaluationMetrics[selectedModel].macroF1, 'f1')}`}>
                {(evaluationMetrics[selectedModel].macroF1 * 100).toFixed(1)}%
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="mr-1 text-[#10B981]" />
                <span className="text-xs text-[#10B981]">+2.3% vs baseline</span>
              </div>
            </div>
            <Award size={24} className="text-[#0069FF] dark:text-[#4A90E2]" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#667085] dark:text-white/60 mb-1">Processing Speed</p>
              <p className="text-2xl font-bold text-[#111318] dark:text-white/87">
                {performanceMetrics.processingSpeed.avgProcessingTime}s
              </p>
              <p className="text-xs text-[#667085] dark:text-white/60 mt-1">
                per comment
              </p>
            </div>
            <RefreshCw size={24} className="text-[#0069FF] dark:text-[#4A90E2]" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#667085] dark:text-white/60 mb-1">System Uptime</p>
              <p className="text-2xl font-bold text-[#10B981]">
                {performanceMetrics.systemHealth.uptime}%
              </p>
              <p className="text-xs text-[#10B981] mt-1">
                Last 30 days
              </p>
            </div>
            <CheckCircle size={24} className="text-[#10B981]" />
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      {selectedModel === 'sentiment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Classification Metrics */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
            <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
              Classification Metrics by Category
            </h3>
            <div className="space-y-4">
              {Object.entries(evaluationMetrics.sentiment.precision).map(([category, precision]) => {
                const recall = evaluationMetrics.sentiment.recall[category];
                const f1 = evaluationMetrics.sentiment.f1Score[category];
                return (
                  <div key={category} className="p-4 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg">
                    <h4 className="font-medium text-[#111318] dark:text-white/87 mb-3 capitalize">
                      {category}
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-[#667085] dark:text-white/60 mb-1">Precision</p>
                        <p className={`font-semibold ${getMetricColor(precision)}`}>
                          {(precision * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-[#667085] dark:text-white/60 mb-1">Recall</p>
                        <p className={`font-semibold ${getMetricColor(recall)}`}>
                          {(recall * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-[#667085] dark:text-white/60 mb-1">F1-Score</p>
                        <p className={`font-semibold ${getMetricColor(f1, 'f1')}`}>
                          {(f1 * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confusion Matrix */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
            <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
              Confusion Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 font-medium text-[#667085] dark:text-white/60">Actual</th>
                    <th className="text-center py-2 px-3 font-medium text-[#667085] dark:text-white/60">Supportive</th>
                    <th className="text-center py-2 px-3 font-medium text-[#667085] dark:text-white/60">Critical</th>
                    <th className="text-center py-2 px-3 font-medium text-[#667085] dark:text-white/60">Suggestion</th>
                    <th className="text-center py-2 px-3 font-medium text-[#667085] dark:text-white/60">Irrelevant</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluationMetrics.sentiment.confusionMatrix.map((row, index) => (
                    <tr key={index} className="border-t border-[#E6EAF0] dark:border-white/10">
                      <td className="py-2 px-3 font-medium text-[#111318] dark:text-white/87">
                        {row.actual}
                      </td>
                      <td className={`text-center py-2 px-3 ${row.actual.toLowerCase() === 'supportive' ? 'bg-[#10B981]/10 font-bold text-[#10B981]' : ''}`}>
                        {row.supportive}
                      </td>
                      <td className={`text-center py-2 px-3 ${row.actual.toLowerCase() === 'critical' ? 'bg-[#EF4444]/10 font-bold text-[#EF4444]' : ''}`}>
                        {row.critical}
                      </td>
                      <td className={`text-center py-2 px-3 ${row.actual.toLowerCase() === 'suggestion' ? 'bg-[#F59E0B]/10 font-bold text-[#F59E0B]' : ''}`}>
                        {row.suggestion}
                      </td>
                      <td className={`text-center py-2 px-3 ${row.actual.toLowerCase() === 'irrelevant' ? 'bg-[#6B7280]/10 font-bold text-[#6B7280]' : ''}`}>
                        {row.irrelevant}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedModel === 'summarization' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ROUGE Scores */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
            <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
              ROUGE Scores
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg">
                <div>
                  <h4 className="font-medium text-[#111318] dark:text-white/87">ROUGE-1</h4>
                  <p className="text-sm text-[#667085] dark:text-white/60">Unigram overlap</p>
                </div>
                <div className={`text-xl font-bold ${getMetricColor(evaluationMetrics.summarization.rouge1, 'rouge')}`}>
                  {(evaluationMetrics.summarization.rouge1 * 100).toFixed(1)}%
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg">
                <div>
                  <h4 className="font-medium text-[#111318] dark:text-white/87">ROUGE-2</h4>
                  <p className="text-sm text-[#667085] dark:text-white/60">Bigram overlap</p>
                </div>
                <div className={`text-xl font-bold ${getMetricColor(evaluationMetrics.summarization.rouge2, 'rouge')}`}>
                  {(evaluationMetrics.summarization.rouge2 * 100).toFixed(1)}%
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg">
                <div>
                  <h4 className="font-medium text-[#111318] dark:text-white/87">ROUGE-L</h4>
                  <p className="text-sm text-[#667085] dark:text-white/60">Longest common subsequence</p>
                </div>
                <div className={`text-xl font-bold ${getMetricColor(evaluationMetrics.summarization.rougeL, 'rouge')}`}>
                  {(evaluationMetrics.summarization.rougeL * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Human Evaluation */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
            <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
              Human Evaluation (1-5 scale)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={Object.entries(evaluationMetrics.summarization.humanEvaluation).map(([key, value]) => ({
                metric: key.charAt(0).toUpperCase() + key.slice(1),
                score: value
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="score" fill="#0069FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Model Comparison */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
        <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
          Model Comparison
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={modelComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="model" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'speed' ? `${value}s` : `${(value * 100).toFixed(1)}%`,
                name === 'speed' ? 'Processing Time' : name === 'accuracy' ? 'Accuracy' : 'F1-Score'
              ]}
            />
            <Legend />
            <Bar dataKey="accuracy" fill="#10B981" name="Accuracy" />
            <Bar dataKey="f1Score" fill="#0069FF" name="F1-Score" />
            <Bar dataKey="speed" fill="#F59E0B" name="Speed (seconds)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* System Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#111318] dark:text-white/87">Uptime</span>
              <span className="font-semibold text-[#10B981]">{performanceMetrics.systemHealth.uptime}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#111318] dark:text-white/87">Error Rate</span>
              <span className="font-semibold text-[#10B981]">{performanceMetrics.systemHealth.errorRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#111318] dark:text-white/87">Memory Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-[#E6EAF0] dark:bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-[#0069FF] dark:bg-[#4A90E2] h-2 rounded-full"
                    style={{ width: `${performanceMetrics.systemHealth.memoryUsage}%` }}
                  />
                </div>
                <span className="font-semibold text-[#111318] dark:text-white/87">
                  {performanceMetrics.systemHealth.memoryUsage}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#111318] dark:text-white/87">CPU Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-[#E6EAF0] dark:bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-[#10B981] h-2 rounded-full"
                    style={{ width: `${performanceMetrics.systemHealth.cpuUsage}%` }}
                  />
                </div>
                <span className="font-semibold text-[#111318] dark:text-white/87">
                  {performanceMetrics.systemHealth.cpuUsage}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
            Performance Benchmarks
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg">
              <h4 className="font-medium text-[#111318] dark:text-white/87 mb-2">Processing Speed</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#667085] dark:text-white/60">Avg per comment</p>
                  <p className="font-semibold text-[#111318] dark:text-white/87">
                    {performanceMetrics.processingSpeed.avgProcessingTime}s
                  </p>
                </div>
                <div>
                  <p className="text-[#667085] dark:text-white/60">Throughput</p>
                  <p className="font-semibold text-[#111318] dark:text-white/87">
                    {performanceMetrics.processingSpeed.throughput}/hr
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#F8F9FC] dark:bg-[#2A2A2A] rounded-lg">
              <h4 className="font-medium text-[#111318] dark:text-white/87 mb-2">Batch Processing</h4>
              <p className="text-[#667085] dark:text-white/60 text-sm">1000 comments</p>
              <p className="font-semibold text-[#111318] dark:text-white/87">
                {performanceMetrics.processingSpeed.batchProcessingTime} minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Limitations and Notes */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6EAF0] dark:border-white/10 rounded-xl p-6">
        <h3 className="font-semibold text-lg text-[#111318] dark:text-white/87 mb-4">
          Model Limitations & Notes
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                  Language Performance Variation
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Model performance varies across languages. English and Hindi show highest accuracy (86-88%), 
                  while Tamil and Telugu performance is slightly lower (82-84%) due to limited training data.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Evaluation Dataset
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Metrics calculated on a balanced test set of 1,000 manually annotated comments 
                  across 4 languages (English: 400, Hindi: 300, Tamil: 200, Telugu: 100).
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                  Continuous Improvement
                </h4>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Models are retrained monthly with new data. Active learning pipeline 
                  identifies low-confidence predictions for human review and model improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}