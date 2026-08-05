"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  mockPosts, 
  competitorBenchmarks, 
  sentimentTrendData, 
  intentSignals, 
  topicBubbles, 
  initialChatMessages, 
  chatPromptResponses,
  Post, 
  CompetitorData,
  ChatMessage
} from './mockData';
import { 
  LayoutDashboard, 
  Search, 
  Activity, 
  MessageSquare, 
  FileText, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Share2, 
  MessageCircle, 
  ArrowUpRight, 
  Send, 
  Filter, 
  RotateCcw, 
  Moon, 
  Sun, 
  Sparkles, 
  ThumbsUp, 
  CornerDownRight, 
  Sliders, 
  Download, 
  Mail, 
  Bell, 
  Trash2,
  Calendar,
  Grid,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

export default function SocialSenseDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'feed' | 'competitors' | 'copilot' | 'reports' | 'settings'>('dashboard');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('7d');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Feed Filter States
  const [feedSearch, setFeedSearch] = useState<string>('');
  const [feedPlatform, setFeedPlatform] = useState<string>('all');
  const [feedSentiment, setFeedSentiment] = useState<string>('all');
  const [feedIntent, setFeedIntent] = useState<string>('all');
  const [feedMinEngagement, setFeedMinEngagement] = useState<number>(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Copilot States
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [chatInput, setChatInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Settings state
  const [brandName, setBrandName] = useState<string>('SocialSense AI');
  const [competitorKeywords, setCompetitorKeywords] = useState<string>('LinearSense, BrandMonitor Pro, MeltStream');
  const [alertEmail, setAlertEmail] = useState<string>('marketing@socialsense.ai');
  const [alertChannels, setAlertChannels] = useState<{ slack: boolean; email: boolean }>({ slack: false, email: true });

  // Toggle Dark Mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Global filtered posts based on top navigation filters
  const globallyFilteredPosts = useMemo(() => {
    return mockPosts.filter(post => {
      // Platform filter
      if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) return false;
      return true;
    });
  }, [selectedPlatform]);

  // Feed view filtered posts
  const feedFilteredPosts = useMemo(() => {
    return mockPosts.filter(post => {
      // Search filter (text search across content, author, handle, intent)
      if (feedSearch) {
        const query = feedSearch.toLowerCase();
        const matchesContent = post.content.toLowerCase().includes(query);
        const matchesAuthor = post.author.toLowerCase().includes(query);
        const matchesHandle = post.handle.toLowerCase().includes(query);
        const matchesIntent = post.intent.toLowerCase().includes(query);
        if (!matchesContent && !matchesAuthor && !matchesHandle && !matchesIntent) return false;
      }
      
      // Platform
      if (feedPlatform !== 'all' && post.platform !== feedPlatform) return false;

      // Sentiment
      if (feedSentiment !== 'all' && post.sentiment !== feedSentiment) return false;

      // Intent
      if (feedIntent !== 'all' && post.intent !== feedIntent) return false;

      // Min engagement (likes + shares + comments)
      const totalEngagement = post.engagement.likes + post.engagement.shares + post.engagement.comments;
      if (totalEngagement < feedMinEngagement) return false;

      return true;
    });
  }, [feedSearch, feedPlatform, feedSentiment, feedIntent, feedMinEngagement]);

  // Calculated Dashboard Stats based on current global filters
  const stats = useMemo(() => {
    const count = globallyFilteredPosts.length;
    const pos = globallyFilteredPosts.filter(p => p.sentiment === 'positive').length;
    const neg = globallyFilteredPosts.filter(p => p.sentiment === 'negative').length;
    const neut = globallyFilteredPosts.filter(p => p.sentiment === 'neutral').length;

    const netSentimentScore = count > 0 ? Math.round(((pos - neg) / count) * 100) : 0;
    
    // Intent distribution calculation
    const intentCounts: { [key: string]: number } = {};
    globallyFilteredPosts.forEach(p => {
      intentCounts[p.intent] = (intentCounts[p.intent] || 0) + 1;
    });
    
    const totalIntents = Object.values(intentCounts).reduce((a, b) => a + b, 0);
    const topIntents = Object.entries(intentCounts)
      .map(([name, val]) => ({
        name,
        percentage: totalIntents > 0 ? Math.round((val / totalIntents) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return {
      totalMentions: count * 128 + 432, // Make it look like a large scale analyzed volume
      netSentiment: netSentimentScore,
      positivePercent: count > 0 ? Math.round((pos / count) * 100) : 0,
      negativePercent: count > 0 ? Math.round((neg / count) * 100) : 0,
      topIntent: topIntents[0] || { name: 'Feature Requests', percentage: 42 },
      secondIntent: topIntents[1] || { name: 'Pricing Complaints', percentage: 28 },
    };
  }, [globallyFilteredPosts]);

  // Send message to Copilot chat
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsTyping(true);

    // Simulate streaming AI reply
    setTimeout(() => {
      // Match response or default
      const matched = chatPromptResponses[text.trim()];
      let replyContent = "I've analyzed our social listening database regarding your question. In the last 7 days, u/competitor_x mentioned signals have increased. Let me know if you would like me to draft an outbound sales response or generate content cards addressing these pain points.";
      let citations: Post[] = [];

      if (matched) {
        replyContent = matched.text;
        citations = mockPosts.filter(p => matched.citations.includes(p.id));
      } else {
        // Fallback response containing mentions
        citations = [mockPosts[0]];
      }

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        content: replyContent,
        citations: citations,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const getPlatformIcon = (platform: Post['platform'], size = 16) => {
    switch (platform) {
      case 'reddit':
        return <span className="text-[#ff4500] font-bold" style={{ fontSize: `${size}px` }}>r/</span>;
      case 'twitter':
        return <span className="font-extrabold" style={{ fontSize: `${size}px` }}>𝕏</span>;
      case 'tiktok':
        return <span className="text-[#00f2fe] font-bold" style={{ fontSize: `${size}px` }}>🎵</span>;
      case 'youtube':
        return <span className="text-[#ff0000] font-bold" style={{ fontSize: `${size}px` }}>▶️</span>;
      case 'instagram':
        return <span className="text-pink-500 font-bold" style={{ fontSize: `${size}px` }}>📸</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-card flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-border gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">{brandName}</span>
              <span className="text-[10px] block text-blue-500 font-medium tracking-widest uppercase">MARKET COPILOT</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-600/10 text-blue-500 border-l-2 border-blue-600' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveTab('feed')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'feed' 
                  ? 'bg-blue-600/10 text-blue-500 border-l-2 border-blue-600' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Social Feed & Search</span>
            </button>

            <button 
              onClick={() => setActiveTab('competitors')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'competitors' 
                  ? 'bg-blue-600/10 text-blue-500 border-l-2 border-blue-600' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Competitor Radar</span>
            </button>

            <button 
              onClick={() => setActiveTab('copilot')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'copilot' 
                  ? 'bg-blue-600/10 text-blue-500 border-l-2 border-blue-600' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <div className="flex justify-between items-center w-full">
                <span>AI Research Copilot</span>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse-slow">Live</span>
              </div>
            </button>

            <button 
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'reports' 
                  ? 'bg-blue-600/10 text-blue-500 border-l-2 border-blue-600' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'settings' 
                  ? 'bg-blue-600/10 text-blue-500 border-l-2 border-blue-600' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Footer Area: User and Theme toggle */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between bg-muted/40 p-2 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground">Dark Theme</span>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-md hover:bg-muted text-foreground transition-all"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-500" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" 
              alt="User profile" 
              className="h-10 w-10 rounded-full border border-border"
            />
            <div className="overflow-hidden">
              <span className="text-sm font-semibold block text-foreground truncate">Alex Sterling</span>
              <span className="text-[10px] text-muted-foreground truncate block">Growth Lead</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP HEADER */}
        <header className="h-16 flex-shrink-0 border-b border-border glass-panel sticky top-0 z-30 flex items-center justify-between px-6">
          
          {/* Left filters */}
          <div className="flex items-center gap-4">
            {/* Global Brand Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden sm:inline">Brand:</span>
              <select 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-card text-foreground border border-border text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="all">All Profiles</option>
                <option value="socialsense">SocialSense AI</option>
                <option value="linearsense">LinearSense</option>
              </select>
            </div>

            {/* Platform Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden sm:inline">Platform:</span>
              <select 
                value={selectedPlatform} 
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-card text-foreground border border-border text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="all">All Channels</option>
                <option value="reddit">Reddit</option>
                <option value="twitter">X / Twitter</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>
          </div>

          {/* Right Filters & Avatar */}
          <div className="flex items-center gap-3">
            {/* Date Range Picker */}
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
              <button 
                onClick={() => setSelectedDateRange('24h')}
                className={`text-[10px] px-2.5 py-1 rounded font-semibold transition-all ${selectedDateRange === '24h' ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                24H
              </button>
              <button 
                onClick={() => setSelectedDateRange('7d')}
                className={`text-[10px] px-2.5 py-1 rounded font-semibold transition-all ${selectedDateRange === '7d' ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                7D
              </button>
              <button 
                onClick={() => setSelectedDateRange('30d')}
                className={`text-[10px] px-2.5 py-1 rounded font-semibold transition-all ${selectedDateRange === '30d' ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                30D
              </button>
            </div>

            {/* Notifications */}
            <button className="p-2 border border-border rounded-lg bg-card text-muted-foreground hover:text-foreground relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-blue-500 rounded-full animate-ping"></span>
            </button>
          </div>
        </header>

        {/* VIEW AREA */}
        <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Top Banner / Headline */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/10 via-indigo-950/15 to-transparent border border-blue-500/10 rounded-xl p-5">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Active Market Insights</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Real-time intent extraction and sentiment profiling across all social channels.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('copilot')} 
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white text-xs px-4 py-2.5 rounded-lg font-semibold shadow-md shadow-blue-500/15 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Ask Market Copilot</span>
                </button>
              </div>

              {/* STAT CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-card border border-border rounded-xl p-5 hover:border-blue-500/20 transition-all">
                  <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    <span>Mentions Analyzed</span>
                    <span className="text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5 font-medium">
                      <TrendingUp className="h-3 w-3" />
                      +14.2%
                    </span>
                  </div>
                  <div className="text-3xl font-bold mt-2.5">{stats.totalMentions}</div>
                  <p className="text-xs text-muted-foreground mt-2">Volume analyzed vs last week</p>
                </div>

                {/* Metric 2 */}
                <div className="bg-card border border-border rounded-xl p-5 hover:border-blue-500/20 transition-all">
                  <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    <span>Net Sentiment Score</span>
                    <span className="text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5 font-medium">
                      <TrendingUp className="h-3 w-3" />
                      +{stats.positivePercent}% Pos
                    </span>
                  </div>
                  <div className="text-3xl font-bold mt-2.5 text-blue-500">+{stats.netSentiment}%</div>
                  <p className="text-xs text-muted-foreground mt-2">Overall positive sentiment spread</p>
                </div>

                {/* Metric 3 */}
                <div className="bg-card border border-border rounded-xl p-5 hover:border-blue-500/20 transition-all">
                  <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    <span>Primary Intent Signal</span>
                    <span className="text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded text-[10px] font-medium">
                      Active
                    </span>
                  </div>
                  <div className="text-xl font-bold mt-3.5 truncate">{stats.topIntent.name}</div>
                  <p className="text-xs text-muted-foreground mt-2">{stats.topIntent.percentage}% of intent classified volume</p>
                </div>

                {/* Metric 4 */}
                <div className="bg-card border border-border rounded-xl p-5 hover:border-blue-500/20 transition-all">
                  <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    <span>Share of Voice (vs. Top)</span>
                    <span className="text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5 font-medium">
                      <TrendingDown className="h-3 w-3" />
                      -1.8%
                    </span>
                  </div>
                  <div className="text-3xl font-bold mt-2.5">38%</div>
                  <p className="text-xs text-muted-foreground mt-2">LinearSense active competitor leads at 28%</p>
                </div>
              </div>

              {/* INTERACTIVE VISUALIZATIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sentiment Trend Line Chart */}
                <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold">Sentiment Trend</h3>
                      <p className="text-xs text-muted-foreground">Volume over time split by category sentiment classification.</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1.5 text-green-500 font-medium">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span> Positive
                      </span>
                      <span className="flex items-center gap-1.5 text-yellow-500 font-medium">
                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span> Neutral
                      </span>
                      <span className="flex items-center gap-1.5 text-red-500 font-medium">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span> Negative
                      </span>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sentimentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="posColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="negColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#27272a" : "#e2e8f0"} />
                        <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            background: darkMode ? '#18181b' : '#ffffff', 
                            border: `1px solid ${darkMode ? '#27272a' : '#e2e8f0'}`,
                            color: darkMode ? '#f4f4f5' : '#0f172a',
                            borderRadius: '8px'
                          }} 
                        />
                        <Area type="monotone" dataKey="positive" stroke="#10b981" fillOpacity={1} fill="url(#posColor)" strokeWidth={2} />
                        <Area type="monotone" dataKey="negative" stroke="#ef4444" fillOpacity={1} fill="url(#negColor)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Intent Breakdown Donut Chart */}
                <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold">Intent Breakdown</h3>
                    <p className="text-xs text-muted-foreground">Classified user conversion/pain-point signals.</p>
                  </div>
                  
                  <div className="h-48 my-3 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={intentSignals}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {intentSignals.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {intentSignals.map((sig, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: sig.color }}></span>
                        <span className="text-muted-foreground truncate">{sig.name}:</span>
                        <span className="font-bold">{sig.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TOPIC CLUSTERS AND RECENT INSIGHTS FEED */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Bubble clusters word cloud */}
                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold">Topic Clusters</h3>
                    <p className="text-xs text-muted-foreground">High frequency phrases grouped by emotional sentiment tag.</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 py-4">
                    {topicBubbles.map((bubble, index) => {
                      let sentimentBg = 'bg-muted border-border text-foreground hover:bg-muted/70';
                      if (bubble.sentiment === 'positive') sentimentBg = 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/15';
                      if (bubble.sentiment === 'negative') sentimentBg = 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/15';
                      
                      return (
                        <span 
                          key={index} 
                          className={`text-xs px-3 py-2 rounded-lg border font-semibold cursor-pointer transition-all ${sentimentBg}`}
                          style={{ fontSize: `${Math.max(10, Math.min(14, 10 + (bubble.value / 25)))}px` }}
                        >
                          {bubble.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Recent insights live feed */}
                <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold">Recent Critical Insights</h3>
                      <p className="text-xs text-muted-foreground">High conversion/threat intent signals extracted recently.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('feed')} 
                      className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1.5"
                    >
                      <span>Explore all posts</span>
                      <ArrowUpRight className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {globallyFilteredPosts.slice(0, 4).map((post, idx) => (
                      <div key={idx} className="p-3.5 border border-border bg-background/50 hover:bg-background/80 rounded-lg flex gap-3 transition-all">
                        <div className="flex-shrink-0">
                          {getPlatformIcon(post.platform, 20)}
                        </div>
                        <div className="space-y-1 w-full min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">{post.author}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(post.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded border border-blue-500/10">
                              {post.intent}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              post.sentiment === 'positive' ? 'bg-green-500/10 text-green-400 border-green-500/10' :
                              post.sentiment === 'negative' ? 'bg-red-500/10 text-red-400 border-red-500/10' :
                              'bg-zinc-500/10 text-zinc-400 border-zinc-500/10'
                            }`}>
                              {post.sentiment.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: SOCIAL FEED & DATA TABLE */}
          {activeTab === 'feed' && (
            <div className="space-y-6">
              
              {/* Header Title */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Social Feed Monitoring</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Filter, search, and analyze indexed social posts for strategic triggers.</p>
              </div>

              {/* ADVANCED MULTI-FILTER CONTROL BAR */}
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                
                {/* Search & reset filters row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Semantic search posts (e.g. 'linear speed', 'pricing tiers')..."
                      value={feedSearch}
                      onChange={(e) => setFeedSearch(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-muted-foreground"
                    />
                  </div>
                  
                  {/* Reset Filters button */}
                  <button 
                    onClick={() => {
                      setFeedSearch('');
                      setFeedPlatform('all');
                      setFeedSentiment('all');
                      setFeedIntent('all');
                      setFeedMinEngagement(0);
                    }}
                    className="flex items-center justify-center gap-2 border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground text-sm px-4 py-2.5 rounded-lg transition-all font-semibold"
                  >
                    <RotateCcw className="h-4.5 w-4.5" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Sub Dropdown Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  {/* Platform */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Channel</label>
                    <select
                      value={feedPlatform}
                      onChange={(e) => setFeedPlatform(e.target.value)}
                      className="w-full bg-background text-foreground border border-border text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="all">All Channels</option>
                      <option value="reddit">Reddit</option>
                      <option value="twitter">X / Twitter</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>

                  {/* Sentiment */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Sentiment</label>
                    <select
                      value={feedSentiment}
                      onChange={(e) => setFeedSentiment(e.target.value)}
                      className="w-full bg-background text-foreground border border-border text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="all">All Sentiments</option>
                      <option value="positive">Positive</option>
                      <option value="neutral">Neutral</option>
                      <option value="negative">Negative</option>
                    </select>
                  </div>

                  {/* Intent Badge */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Intent Tag</label>
                    <select
                      value={feedIntent}
                      onChange={(e) => setFeedIntent(e.target.value)}
                      className="w-full bg-background text-foreground border border-border text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="all">All Intent Signals</option>
                      <option value="Competitor Switcher">Competitor Switchers</option>
                      <option value="Pricing Complaint">Pricing Complaints</option>
                      <option value="Feature Request">Feature Requests</option>
                      <option value="Product Bug">Product Bugs</option>
                      <option value="General Praise">General Praise</option>
                    </select>
                  </div>

                  {/* Min engagement */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Min Engagement: {feedMinEngagement}</label>
                    <input 
                      type="range"
                      min={0}
                      max={500}
                      step={50}
                      value={feedMinEngagement}
                      onChange={(e) => setFeedMinEngagement(Number(e.target.value))}
                      className="w-full h-1.5 bg-background rounded-lg appearance-none cursor-pointer accent-blue-500 border border-border my-3.5"
                    />
                  </div>
                </div>

              </div>

              {/* DATA TABLE VIEW */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                        <th className="py-4 px-5">Platform</th>
                        <th className="py-4 px-5">Author</th>
                        <th className="py-4 px-5">Post Context</th>
                        <th className="py-4 px-5">Sentiment</th>
                        <th className="py-4 px-5">Intent Signal</th>
                        <th className="py-4 px-5 text-right">Engagement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {feedFilteredPosts.length > 0 ? (
                        feedFilteredPosts.map((post) => (
                          <tr 
                            key={post.id} 
                            onClick={() => setSelectedPost(post)}
                            className="hover:bg-muted/50 cursor-pointer transition-all"
                          >
                            <td className="py-4.5 px-5 whitespace-nowrap">
                              <span className="flex items-center gap-1.5 text-xs font-medium">
                                {getPlatformIcon(post.platform, 16)}
                                <span className="capitalize">{post.platform}</span>
                              </span>
                            </td>
                            <td className="py-4.5 px-5 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground">{post.author}</span>
                                <span className="text-[11px] text-muted-foreground">{post.handle}</span>
                              </div>
                            </td>
                            <td className="py-4.5 px-5 max-w-xs md:max-w-md">
                              <p className="truncate text-foreground font-normal">{post.content}</p>
                            </td>
                            <td className="py-4.5 px-5 whitespace-nowrap">
                              <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                                post.sentiment === 'positive' ? 'bg-green-500/10 text-green-400 border-green-500/10' :
                                post.sentiment === 'negative' ? 'bg-red-500/10 text-red-400 border-red-500/10' :
                                'bg-zinc-500/10 text-zinc-400 border-zinc-500/10'
                              }`}>
                                {post.sentiment}
                              </span>
                            </td>
                            <td className="py-4.5 px-5 whitespace-nowrap">
                              <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded border border-blue-500/10">
                                {post.intent}
                              </span>
                            </td>
                            <td className="py-4.5 px-5 whitespace-nowrap text-right text-xs font-medium text-muted-foreground">
                              {post.engagement.likes + post.engagement.shares + post.engagement.comments}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-muted-foreground">
                            No social logs match the filter criteria. Try expanding filters or search query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* POST DETAILS DIALOG / MODAL */}
              {selectedPost && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-card border border-border w-full max-w-xl rounded-xl shadow-2xl overflow-hidden transform transition-all">
                    
                    {/* Header */}
                    <div className="p-5 border-b border-border flex justify-between items-start bg-muted/20">
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(selectedPost.platform, 24)}
                        <div>
                          <h3 className="font-bold text-foreground text-base">{selectedPost.author}</h3>
                          <p className="text-xs text-muted-foreground">{selectedPost.handle} • {new Date(selectedPost.date).toLocaleString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedPost(null)}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-lg text-sm"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Original Post</span>
                        <p className="mt-1 text-sm text-foreground leading-relaxed bg-background/50 border border-border p-4 rounded-lg italic">
                          "{selectedPost.content}"
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-border p-3 rounded-lg bg-background/30">
                          <span className="text-[10px] text-muted-foreground font-bold uppercase block">AI Intent Badging</span>
                          <span className="text-xs font-semibold text-blue-400 mt-0.5 inline-block">{selectedPost.intent}</span>
                        </div>
                        <div className="border border-border p-3 rounded-lg bg-background/30">
                          <span className="text-[10px] text-muted-foreground font-bold uppercase block">Core Sentiment</span>
                          <span className={`text-xs font-semibold mt-0.5 inline-block capitalize ${
                            selectedPost.sentiment === 'positive' ? 'text-green-400' :
                            selectedPost.sentiment === 'negative' ? 'text-red-400' : 'text-zinc-400'
                          }`}>{selectedPost.sentiment}</span>
                        </div>
                      </div>

                      <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-lg">
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI Analyst Summary
                        </span>
                        <p className="text-xs text-foreground/90 mt-1.5 leading-relaxed font-medium">
                          {selectedPost.aiSummary}
                        </p>
                      </div>

                      {/* Engagement breakdown */}
                      <div className="flex gap-4 text-xs text-muted-foreground border-t border-border pt-4 justify-between items-center">
                        <div className="flex gap-4">
                          <span className="flex items-center gap-1">👍 <strong className="text-foreground">{selectedPost.engagement.likes}</strong></span>
                          <span className="flex items-center gap-1">🔄 <strong className="text-foreground">{selectedPost.engagement.shares}</strong></span>
                          <span className="flex items-center gap-1">💬 <strong className="text-foreground">{selectedPost.engagement.comments}</strong></span>
                        </div>
                        <a 
                          href={selectedPost.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1"
                        >
                          <span>Go to source post</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: COMPETITOR RADAR */}
          {activeTab === 'competitors' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Competitor Radar</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Real-time benchmark dashboards indexing Share of Voice, sentiments, and weaknesses.</p>
              </div>

              {/* Competitive analysis grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Benchmark table */}
                <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2 space-y-4">
                  <h3 className="text-base font-bold">Market Share Benchmark</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-xs uppercase font-semibold">
                          <th className="pb-3">Brand Name</th>
                          <th className="pb-3">Share of Voice</th>
                          <th className="pb-3">Net Sentiment</th>
                          <th className="pb-3">Total Mentions</th>
                          <th className="pb-3">Core Strength</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {competitorBenchmarks.map((comp, idx) => (
                          <tr key={idx} className="hover:bg-muted/30">
                            <td className="py-3.5 font-bold text-foreground">{comp.name}</td>
                            <td className="py-3.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{comp.shareOfVoice}%</span>
                                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div className="bg-blue-500 h-full" style={{ width: `${comp.shareOfVoice}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 text-green-500 font-semibold">{comp.netSentiment >= 50 ? 'Positive' : 'Low'} (+{comp.netSentiment}%)</td>
                            <td className="py-3.5 text-muted-foreground">{comp.mentions.toLocaleString()}</td>
                            <td className="py-3.5 text-xs text-foreground/80 font-medium">{comp.strength}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Threat vector summaries */}
                <div className="bg-card border border-border rounded-xl p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold">Competitive Threats</h3>
                    <p className="text-xs text-muted-foreground">High impact weaknesses ready for tactical ad positioning.</p>
                  </div>
                  <div className="space-y-3.5 my-3">
                    {competitorBenchmarks.filter(c => c.name !== 'SocialSense AI (You)').map((comp, idx) => (
                      <div key={idx} className="p-3 border border-border bg-background/50 rounded-lg">
                        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                          <span>{comp.name}</span>
                          <span className="text-red-500 text-[10px] uppercase tracking-wider font-bold">Switching Point</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          <strong>Vulnerability</strong>: {comp.weakness}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('copilot');
                      handleSendMessage("What are users complaining about regarding Competitor X?");
                    }}
                    className="w-full text-center py-2 border border-border hover:bg-muted text-xs font-bold rounded-lg transition-all text-blue-500"
                  >
                    Generate Ad Hook Ideas
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: AI RESEARCH COPILOT */}
          {activeTab === 'copilot' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">AI Research Copilot</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Interact with the database, index reviews, and write copy with natural language questions.</p>
              </div>

              {/* Chat frame */}
              <div className="bg-card border border-border rounded-xl h-[550px] flex flex-col justify-between overflow-hidden shadow-2xl">
                
                {/* Chat header */}
                <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
                    <span className="text-sm font-bold text-foreground">Market Dataset Assistant</span>
                  </div>
                  <span className="text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full">
                    Model: GPT-4o-Mini-Listening
                  </span>
                </div>

                {/* Messages stream */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-2xl rounded-xl p-4 space-y-3 ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-background/80 border border-border rounded-bl-none'
                      }`}>
                        <div className="flex justify-between items-center text-[10px] opacity-75 font-semibold">
                          <span>{msg.sender === 'user' ? 'You' : 'SocialSense AI'}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>

                        {/* Citation social media cards */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="space-y-2 border-t border-border/20 pt-3">
                            <span className="text-[9px] uppercase font-bold text-muted-foreground block tracking-wider">CITED EVIDENCE & SOURCE DATA:</span>
                            <div className="grid grid-cols-1 gap-2">
                              {msg.citations.map((post) => (
                                <div 
                                  key={post.id} 
                                  className="p-3 rounded-lg bg-card/60 border border-border/80 flex justify-between items-start cursor-pointer hover:bg-card text-foreground"
                                  onClick={() => setSelectedPost(post)}
                                >
                                  <div className="flex gap-2">
                                    {getPlatformIcon(post.platform, 16)}
                                    <div className="min-w-0">
                                      <span className="text-[11px] font-bold block">{post.author}</span>
                                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">"{post.content}"</p>
                                    </div>
                                  </div>
                                  <span className="text-[8px] bg-red-500/10 text-red-400 font-bold border border-red-500/20 px-1 rounded flex-shrink-0 uppercase">
                                    {post.intent}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-background/80 border border-border rounded-xl rounded-bl-none p-4 text-xs font-semibold text-muted-foreground animate-pulse flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-blue-500 animate-spin" />
                        Analyzing mentions dataset...
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick prompts and footer input */}
                <div className="p-4 border-t border-border bg-muted/5 space-y-3.5">
                  
                  {/* Quick Prompts list */}
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleSendMessage("What are users complaining about regarding Competitor X?")}
                      className="text-[11px] font-bold border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                    >
                      <span>LinearSense Complaints?</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => handleSendMessage("Summarize top content ideas trending on TikTok for our niche.")}
                      className="text-[11px] font-bold border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                    >
                      <span>TikTok Content ideas?</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => handleSendMessage("Extract product feature requests from Reddit.")}
                      className="text-[11px] font-bold border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                    >
                      <span>Reddit Feature requests?</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Input form */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask the market intelligence dataset..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button 
                      onClick={() => handleSendMessage()}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-all shadow-md shadow-blue-500/10"
                    >
                      <Send className="h-4.5 w-4.5" />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 5: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Executive Reports</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Generate, download, and schedule weekly brand summaries for stakeholders.</p>
              </div>

              {/* Reports templates and exports */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Card 1: Weekly summary */}
                <div className="bg-card border border-border rounded-xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider block">Weekly Brand Summary</span>
                    <h3 className="text-lg font-bold text-foreground">Weekly Overview & Intent Signal Index</h3>
                    <p className="text-xs text-muted-foreground">Contains comprehensive benchmark reports, volume spikes, and competitor complaints for the week ending {new Date().toLocaleDateString()}.</p>
                  </div>
                  <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-lg font-bold transition-all w-full">
                    <Download className="h-4 w-4" />
                    <span>Download PDF Report</span>
                  </button>
                </div>

                {/* Card 2: Competitor switch */}
                <div className="bg-card border border-border rounded-xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">Competitor Threats</span>
                    <h3 className="text-lg font-bold text-foreground">Competitor Switching Intent log</h3>
                    <p className="text-xs text-muted-foreground">Extracted logs referencing u/competitor_x switcher mentions, pricing complaints, and bug lists formatted for outbound marketing campaigns.</p>
                  </div>
                  <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-lg font-bold transition-all w-full">
                    <Download className="h-4 w-4" />
                    <span>Download CSV Export</span>
                  </button>
                </div>

                {/* Card 3: Scheduler setup */}
                <div className="bg-card border border-border rounded-xl p-5 space-y-4 flex flex-col justify-between md:col-span-2 lg:col-span-1">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider block">Autopilot Reports</span>
                    <h3 className="text-lg font-bold text-foreground">Scheduled Alerts</h3>
                    <p className="text-xs text-muted-foreground">Automatically trigger and send reports to stakeholders at specific cron intervals.</p>
                    <div className="bg-background border border-border p-3.5 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-foreground block">Cron Frequency</strong>
                        <span className="text-muted-foreground text-[10px]">Every Monday at 9:00 AM</span>
                      </div>
                      <span className="bg-green-500/10 text-green-400 font-semibold border border-green-500/20 px-2 py-0.5 rounded text-[10px]">
                        Active
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 border border-border hover:bg-muted text-foreground text-xs py-2 rounded-lg font-semibold transition-all w-full">
                    <Settings className="h-4 w-4" />
                    <span>Configure Schedule</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Workspace Settings</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Manage brand keywords, setup automated alerts, and customize layout models.</p>
              </div>

              {/* Settings configuration fields */}
              <div className="bg-card border border-border rounded-xl p-6 max-w-2xl space-y-6">
                
                {/* Brand names config */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Brand Configuration</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-foreground font-medium block">Your Brand Name</span>
                      <input 
                        type="text" 
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-foreground font-medium block">Competitors to track (comma separated)</span>
                      <input 
                        type="text" 
                        value={competitorKeywords}
                        onChange={(e) => setCompetitorKeywords(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Email triggers */}
                <div className="space-y-2 border-t border-border pt-5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Alert Recipient Triggers</label>
                  <div className="space-y-1">
                    <span className="text-xs text-foreground font-medium block">Notification Email Destination</span>
                    <input 
                      type="email" 
                      value={alertEmail}
                      onChange={(e) => setAlertEmail(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-foreground"
                    />
                  </div>
                </div>

                {/* Integration triggers */}
                <div className="space-y-3 border-t border-border pt-5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Integrations Autopilot</label>
                  
                  <div className="flex items-center justify-between p-3.5 border border-border rounded-lg bg-background/30">
                    <div>
                      <strong className="text-sm block">Push triggers to Slack channel</strong>
                      <span className="text-xs text-muted-foreground">Post to #product-feedback whenever competitor complaints increase by 20%</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={alertChannels.slack}
                      onChange={(e) => setAlertChannels({ ...alertChannels, slack: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-500 border-border bg-background focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 border border-border rounded-lg bg-background/30">
                    <div>
                      <strong className="text-sm block">Push daily email reports</strong>
                      <span className="text-xs text-muted-foreground">Receive daily intelligence summary emails</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={alertChannels.email}
                      onChange={(e) => setAlertChannels({ ...alertChannels, email: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-500 border-border bg-background focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Save button */}
                <div className="border-t border-border pt-5 flex justify-end">
                  <button 
                    onClick={() => alert("Settings saved successfully!")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md shadow-blue-500/10 transition-all"
                  >
                    Save Changes
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}
