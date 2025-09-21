export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read and parse CSV file
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return Response.json({ error: 'CSV file must contain headers and at least one data row' }, { status: 400 });
    }

    // Parse CSV headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const expectedHeaders = ['comment_id', 'comment_text', 'timestamp', 'language'];
    
    const hasRequiredHeaders = expectedHeaders.every(header => 
      headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
    );
    
    if (!hasRequiredHeaders) {
      return Response.json({ 
        error: 'CSV must contain columns: comment_id, comment_text, timestamp, language' 
      }, { status: 400 });
    }

    // Parse CSV data
    const comments = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= 4) {
        comments.push({
          id: values[0]?.replace(/"/g, '') || i.toString(),
          text: values[1]?.replace(/"/g, '') || '',
          timestamp: values[2]?.replace(/"/g, '') || new Date().toISOString(),
          language: values[3]?.replace(/"/g, '') || 'en',
          user_id: values[4]?.replace(/"/g, '') || null
        });
      }
    }

    if (comments.length === 0) {
      return Response.json({ error: 'No valid comments found in CSV' }, { status: 400 });
    }

    // Simulate AI analysis processing
    const analysisResults = await processComments(comments);

    return Response.json({
      success: true,
      totalComments: comments.length,
      processedAt: new Date().toISOString(),
      summary: analysisResults.summary,
      comments: analysisResults.processedComments,
      analytics: analysisResults.analytics,
      prioritySuggestions: analysisResults.prioritySuggestions,
      controversialTopics: analysisResults.controversialTopics
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json({ 
      error: 'Failed to process file. Please check the format and try again.' 
    }, { status: 500 });
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

async function processComments(comments) {
  // Simulate AI processing with realistic results
  const processedComments = comments.map(comment => {
    const analysis = analyzeComment(comment.text, comment.language);
    return {
      ...comment,
      ...analysis
    };
  });

  // Generate summary statistics
  const summary = generateSummary(processedComments);
  
  // Generate analytics
  const analytics = generateAnalytics(processedComments);
  
  // Generate priority suggestions
  const prioritySuggestions = generatePrioritySuggestions(processedComments);
  
  // Generate controversial topics
  const controversialTopics = generateControversialTopics(processedComments);

  return {
    processedComments,
    summary,
    analytics,
    prioritySuggestions,
    controversialTopics
  };
}

function analyzeComment(text, language) {
  // Simulate sentiment analysis
  const sentiments = ['supportive', 'critical', 'suggestion', 'irrelevant'];
  const emotions = ['optimism', 'concern', 'trust', 'anger'];
  
  // Simple keyword-based analysis for demo
  const lowerText = text.toLowerCase();
  
  let sentiment = 'irrelevant';
  let emotion = 'concern';
  let priorityScore = Math.floor(Math.random() * 40) + 30; // 30-70 base score
  
  // Sentiment detection based on keywords
  if (lowerText.includes('good') || lowerText.includes('excellent') || lowerText.includes('support') || 
      lowerText.includes('agree') || lowerText.includes('positive') || lowerText.includes('helpful')) {
    sentiment = 'supportive';
    emotion = 'optimism';
    priorityScore += 20;
  } else if (lowerText.includes('bad') || lowerText.includes('terrible') || lowerText.includes('against') || 
             lowerText.includes('disagree') || lowerText.includes('negative') || lowerText.includes('problem')) {
    sentiment = 'critical';
    emotion = 'anger';
    priorityScore += 15;
  } else if (lowerText.includes('suggest') || lowerText.includes('recommend') || lowerText.includes('should') || 
             lowerText.includes('could') || lowerText.includes('improve') || lowerText.includes('better')) {
    sentiment = 'suggestion';
    emotion = 'concern';
    priorityScore += 25;
  }

  // Adjust for language
  if (language === 'hi') {
    if (lowerText.includes('अच्छा') || lowerText.includes('बेहतर') || lowerText.includes('समर्थन')) {
      sentiment = 'supportive';
      emotion = 'optimism';
    } else if (lowerText.includes('बुरा') || lowerText.includes('समस्या') || lowerText.includes('गलत')) {
      sentiment = 'critical';
      emotion = 'anger';
    }
  }

  // Generate summary (first 100 chars + ellipsis)
  const summary = text.length > 100 ? text.substring(0, 100) + '...' : text;
  
  // Generate evidence spans (keywords that influenced the classification)
  const evidenceSpans = extractEvidenceSpans(text, sentiment);

  return {
    sentiment,
    emotion,
    summary,
    evidenceSpans,
    priorityScore: Math.min(priorityScore, 100),
    confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0
  };
}

function extractEvidenceSpans(text, sentiment) {
  const spans = [];
  const lowerText = text.toLowerCase();
  
  const keywords = {
    supportive: ['good', 'excellent', 'support', 'agree', 'positive', 'helpful', 'great', 'amazing'],
    critical: ['bad', 'terrible', 'against', 'disagree', 'negative', 'problem', 'issue', 'wrong'],
    suggestion: ['suggest', 'recommend', 'should', 'could', 'improve', 'better', 'enhance', 'modify']
  };

  if (keywords[sentiment]) {
    keywords[sentiment].forEach(keyword => {
      if (lowerText.includes(keyword)) {
        spans.push(keyword);
      }
    });
  }

  return spans.slice(0, 5); // Limit to 5 evidence spans
}

function generateSummary(comments) {
  const total = comments.length;
  const sentimentCounts = {
    supportive: 0,
    critical: 0,
    suggestion: 0,
    irrelevant: 0
  };
  
  const emotionCounts = {
    optimism: 0,
    concern: 0,
    trust: 0,
    anger: 0
  };
  
  const languageCounts = {};

  comments.forEach(comment => {
    sentimentCounts[comment.sentiment]++;
    emotionCounts[comment.emotion]++;
    languageCounts[comment.language] = (languageCounts[comment.language] || 0) + 1;
  });

  // Generate trends over time (mock data for last 7 days)
  const trendsOverTime = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trendsOverTime.push({
      date: date.toISOString().split('T')[0],
      supportive: Math.floor(Math.random() * 100) + 50,
      critical: Math.floor(Math.random() * 80) + 30,
      suggestion: Math.floor(Math.random() * 90) + 40,
      irrelevant: Math.floor(Math.random() * 30) + 10
    });
  }

  return {
    totalComments: total,
    sentimentDistribution: sentimentCounts,
    emotionDistribution: emotionCounts,
    languageDistribution: languageCounts,
    trendsOverTime
  };
}

function generateAnalytics(comments) {
  // Generate keyword trends
  const keywordFreq = {};
  comments.forEach(comment => {
    const words = comment.text.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 3 && !isStopWord(word)) {
        keywordFreq[word] = (keywordFreq[word] || 0) + 1;
      }
    });
  });

  const keywordTrends = Object.entries(keywordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([keyword, frequency]) => ({
      keyword,
      frequency,
      sentiment: Math.random() * 2 - 1, // -1 to 1
      growth: Math.random() * 40 - 20 // -20 to 20
    }));

  return {
    keywordTrends,
    languageAnalysis: generateLanguageAnalysis(comments),
    temporalPatterns: generateTemporalPatterns(comments),
    sentimentCorrelation: generateSentimentCorrelation(comments),
    emotionRadar: generateEmotionRadar(comments)
  };
}

function generateLanguageAnalysis(comments) {
  const languages = {};
  
  comments.forEach(comment => {
    if (!languages[comment.language]) {
      languages[comment.language] = {
        language: getLanguageName(comment.language),
        count: 0,
        sentiments: { supportive: 0, critical: 0, suggestion: 0, irrelevant: 0 }
      };
    }
    
    languages[comment.language].count++;
    languages[comment.language].sentiments[comment.sentiment]++;
  });

  return Object.values(languages).map(lang => ({
    ...lang,
    avgSentiment: calculateAvgSentiment(lang.sentiments),
    supportive: Math.round((lang.sentiments.supportive / lang.count) * 100),
    critical: Math.round((lang.sentiments.critical / lang.count) * 100),
    suggestion: Math.round((lang.sentiments.suggestion / lang.count) * 100),
    irrelevant: Math.round((lang.sentiments.irrelevant / lang.count) * 100)
  }));
}

function generateTemporalPatterns(comments) {
  const hourlyData = Array(24).fill(0).map((_, hour) => ({
    hour,
    comments: 0,
    avgSentiment: 0
  }));

  comments.forEach(comment => {
    const hour = new Date(comment.timestamp).getHours();
    hourlyData[hour].comments++;
  });

  // Add some realistic variation
  hourlyData.forEach((data, hour) => {
    if (hour >= 9 && hour <= 17) {
      data.comments += Math.floor(Math.random() * 50) + 20; // Business hours
    } else {
      data.comments += Math.floor(Math.random() * 20) + 5; // Off hours
    }
    data.avgSentiment = Math.random() * 0.6 - 0.3; // -0.3 to 0.3
  });

  return hourlyData;
}

function generateSentimentCorrelation(comments) {
  const topics = [
    'Digital Services', 'Tax Policy', 'Compliance', 'Registration Process',
    'Documentation', 'Multilingual Support', 'Startup Policies', 'Business Licensing'
  ];

  return topics.map(topic => ({
    topic,
    sentiment: Math.random() * 2 - 1, // -1 to 1
    volume: Math.floor(Math.random() * 200) + 50
  }));
}

function generateEmotionRadar(comments) {
  const emotions = ['Optimism', 'Trust', 'Concern', 'Anger', 'Fear', 'Joy'];
  
  return emotions.map(emotion => ({
    emotion,
    value: Math.floor(Math.random() * 40) + 40, // 40-80
    fullMark: 100
  }));
}

function generatePrioritySuggestions(comments) {
  const suggestions = comments
    .filter(c => c.sentiment === 'suggestion')
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 10);

  const topSuggestions = [
    {
      id: 1,
      text: "Implement digital payment systems for small business registration",
      priority: 95,
      frequency: Math.floor(Math.random() * 100) + 150,
      sentiment: "supportive",
      evidence: ["digital payment", "small business", "registration", "easier process"]
    },
    {
      id: 2,
      text: "Reduce compliance burden for startups in first year",
      priority: 92,
      frequency: Math.floor(Math.random() * 80) + 120,
      sentiment: "suggestion",
      evidence: ["compliance burden", "startups", "first year", "reduce paperwork"]
    },
    {
      id: 3,
      text: "Provide multilingual support for all government forms",
      priority: 88,
      frequency: Math.floor(Math.random() * 70) + 100,
      sentiment: "critical",
      evidence: ["multilingual", "government forms", "language barrier", "accessibility"]
    }
  ];

  return topSuggestions;
}

function generateControversialTopics(comments) {
  return [
    {
      topic: "Tax rates for small businesses",
      supportive: 45,
      critical: 55,
      totalMentions: Math.floor(Math.random() * 200) + 300
    },
    {
      topic: "Digital documentation requirements",
      supportive: 62,
      critical: 38,
      totalMentions: Math.floor(Math.random() * 150) + 200
    },
    {
      topic: "Compliance timeline for new businesses",
      supportive: 38,
      critical: 62,
      totalMentions: Math.floor(Math.random() * 100) + 150
    }
  ];
}

function isStopWord(word) {
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'];
  return stopWords.includes(word.toLowerCase());
}

function getLanguageName(code) {
  const languages = {
    'en': 'English',
    'hi': 'Hindi',
    'ta': 'Tamil',
    'te': 'Telugu',
    'bn': 'Bengali',
    'mr': 'Marathi',
    'gu': 'Gujarati',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'pa': 'Punjabi'
  };
  return languages[code] || code.toUpperCase();
}

function calculateAvgSentiment(sentiments) {
  const total = Object.values(sentiments).reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;
  
  const weighted = (sentiments.supportive * 1) + (sentiments.suggestion * 0.5) + 
                   (sentiments.critical * -0.5) + (sentiments.irrelevant * 0);
  
  return weighted / total;
}