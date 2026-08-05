export interface Post {
  id: string;
  platform: 'reddit' | 'twitter' | 'tiktok' | 'youtube' | 'instagram';
  author: string;
  avatar: string;
  handle: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  intent: 'Competitor Switcher' | 'Pricing Complaint' | 'Feature Request' | 'Product Bug' | 'General Praise' | 'Inquiry';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  date: string;
  url: string;
  aiSummary: string;
}

export interface CompetitorData {
  name: string;
  shareOfVoice: number;
  netSentiment: number;
  mentions: number;
  strength: string;
  weakness: string;
}

export interface SentimentTrendPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface IntentSignal {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface TopicBubble {
  name: string;
  value: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export const mockPosts: Post[] = [
  {
    id: '1',
    platform: 'reddit',
    author: 'u/tech_guru99',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    handle: 'r/SaaS_discuss',
    content: 'Thinking about leaving Competitor X (LinearSense). Their load times have doubled this month and support has been completely unresponsive. Is anyone using SocialSense AI? Need a reliable tool that has quick API data retrieval and doesn\'t break the bank.',
    sentiment: 'negative',
    intent: 'Competitor Switcher',
    engagement: { likes: 142, shares: 12, comments: 45 },
    date: '2026-07-30T10:30:00Z',
    url: 'https://reddit.com/r/SaaS_discuss/comments/x90f1',
    aiSummary: 'User seeking alternative to LinearSense due to performance degradation and poor support; considering SocialSense AI.'
  },
  {
    id: '2',
    platform: 'twitter',
    author: 'Sarah Jenkins',
    handle: '@sarah_j_growth',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    content: 'Okay, the new SocialSense AI competitor tracking dashboard is an absolute game-changer. Being able to compare sentiment trends across Reddit and X automatically saved our marketing team 12 hours of manual sorting this week alone! 🚀📈',
    sentiment: 'positive',
    intent: 'General Praise',
    engagement: { likes: 324, shares: 64, comments: 18 },
    date: '2026-07-30T09:15:00Z',
    url: 'https://twitter.com/sarah_j_growth/status/18928371',
    aiSummary: 'High praise for the competitor tracking feature, citing 12 hours of time savings for their marketing team.'
  },
  {
    id: '3',
    platform: 'tiktok',
    author: 'SaaS Hacks',
    handle: '@saashacks',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60',
    content: 'Stop using Excel for competitive analysis in 2026. This AI tool (SocialSense AI) reads all your competitors\' complaints on TikTok & Reddit and writes your ad copy for you. Watch how I generate 5 hooks in 10 seconds. #marketing #saas #growthhacking',
    sentiment: 'positive',
    intent: 'General Praise',
    engagement: { likes: 1420, shares: 382, comments: 92 },
    date: '2026-07-29T18:45:00Z',
    url: 'https://tiktok.com/@saashacks/video/8821903',
    aiSummary: 'Viral short-form video demonstration showing how SocialSense AI automates competitor pain-point discovery and copywriting.'
  },
  {
    id: '4',
    platform: 'reddit',
    author: 'u/developer_dan',
    handle: 'r/nextjs',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
    content: 'Just registered for SocialSense AI. I love the clean UI, but has anyone noticed that exporting reports to PDF sometimes cuts off the margins on mobile views? Hope the developers fix this layout issue in the next release.',
    sentiment: 'neutral',
    intent: 'Product Bug',
    engagement: { likes: 28, shares: 1, comments: 7 },
    date: '2026-07-29T14:20:00Z',
    url: 'https://reddit.com/r/nextjs/comments/p0a21',
    aiSummary: 'Report of a layout bug where mobile PDF reports cut off margins. Positive general impression of the UI.'
  },
  {
    id: '5',
    platform: 'youtube',
    author: 'MarTech Review',
    handle: 'MarTechReviewChannel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
    content: 'In-depth comparison: SocialSense AI vs. Brand24 vs. Meltwater. SocialSense is by far the most advanced in terms of intent categorization. It correctly labels "Feature Requests" and "Switching Intent" with 94% accuracy, compared to basic sentiment tagging elsewhere.',
    sentiment: 'positive',
    intent: 'General Praise',
    engagement: { likes: 890, shares: 110, comments: 145 },
    date: '2026-07-28T11:00:00Z',
    url: 'https://youtube.com/watch?v=ms902j1',
    aiSummary: 'Comprehensive review praising SocialSense\'s proprietary intent classification over legacy alternatives.'
  },
  {
    id: '6',
    platform: 'twitter',
    author: 'Product Lead Alice',
    handle: '@alice_pm_world',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
    content: 'I wish SocialSense AI had an automatic Slack integration. I want alerts pushed directly to our #product-feedback channel whenever u/competitor_x mentions increase by 20% in an hour. Please build this team!',
    sentiment: 'neutral',
    intent: 'Feature Request',
    engagement: { likes: 78, shares: 5, comments: 12 },
    date: '2026-07-28T08:30:00Z',
    url: 'https://twitter.com/alice_pm_world/status/198231',
    aiSummary: 'Feature request for an automatic Slack integration trigger based on competitor mention spike alerts.'
  },
  {
    id: '7',
    platform: 'instagram',
    author: 'Digital Agency Co',
    handle: '@digitalagency_co',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
    content: 'We migrated our client monitoring dashboards to SocialSense AI. The transition was incredibly smooth, but the $299/mo agency tier is a bit steep for small startups. Hopefully, they introduce a starter agency plan soon.',
    sentiment: 'neutral',
    intent: 'Pricing Complaint',
    engagement: { likes: 189, shares: 24, comments: 39 },
    date: '2026-07-27T16:15:00Z',
    url: 'https://instagram.com/p/Cj81023a/',
    aiSummary: 'Agency user satisfied with capabilities but requests a mid-tier pricing plan targeting smaller agencies.'
  },
  {
    id: '8',
    platform: 'reddit',
    author: 'u/system_admin_rob',
    handle: 'r/sysadmin',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=60',
    content: 'Trying out SocialSense AI for monitoring brand health. Extremely impressed by the data table load speeds. It feels incredibly snappy even when filtering through 100,000+ scraped social media logs.',
    sentiment: 'positive',
    intent: 'General Praise',
    engagement: { likes: 56, shares: 2, comments: 11 },
    date: '2026-07-27T12:05:00Z',
    url: 'https://reddit.com/r/sysadmin/comments/9a8f2',
    aiSummary: 'Sysadmin commends UI performance and responsiveness when querying large data collections.'
  }
];

export const competitorBenchmarks: CompetitorData[] = [
  {
    name: 'SocialSense AI (You)',
    shareOfVoice: 38,
    netSentiment: 68,
    mentions: 12450,
    strength: 'AI Intent Parsing, UI/UX Speed',
    weakness: 'Lacks Slack integrations'
  },
  {
    name: 'LinearSense',
    shareOfVoice: 28,
    netSentiment: 24,
    mentions: 9180,
    strength: 'Legacy integrations',
    weakness: 'Slow loading, poor support'
  },
  {
    name: 'BrandMonitor Pro',
    shareOfVoice: 20,
    netSentiment: 42,
    mentions: 6560,
    strength: 'Enterprise sales networks',
    weakness: 'Basic sentiment (no intent classification)'
  },
  {
    name: 'MeltStream',
    shareOfVoice: 14,
    netSentiment: 51,
    mentions: 4590,
    strength: 'Traditional PR coverage',
    weakness: 'Extremely high cost, dated UI'
  }
];

export const sentimentTrendData: SentimentTrendPoint[] = [
  { date: 'Jul 24', positive: 50, neutral: 35, negative: 15 },
  { date: 'Jul 25', positive: 55, neutral: 30, negative: 15 },
  { date: 'Jul 26', positive: 58, neutral: 32, negative: 10 },
  { date: 'Jul 27', positive: 62, neutral: 28, negative: 10 },
  { date: 'Jul 28', positive: 60, neutral: 25, negative: 15 },
  { date: 'Jul 29', positive: 65, neutral: 23, negative: 12 },
  { date: 'Jul 30', positive: 68, neutral: 22, negative: 10 }
];

export const intentSignals: IntentSignal[] = [
  { name: 'Feature Requests', value: 42, percentage: 42, color: '#3b82f6' },
  { name: 'Pricing Complaints', value: 28, percentage: 28, color: '#f59e0b' },
  { name: 'Competitor Switchers', value: 18, percentage: 18, color: '#10b981' },
  { name: 'Product Bugs', value: 12, percentage: 12, color: '#ef4444' }
];

export const topicBubbles: TopicBubble[] = [
  { name: 'Slack Integration', value: 92, sentiment: 'neutral' },
  { name: 'LinearSense Slow', value: 85, sentiment: 'negative' },
  { name: 'Pricing Tiers', value: 74, sentiment: 'neutral' },
  { name: 'Intent Classifier', value: 68, sentiment: 'positive' },
  { name: 'PDF Export Layout', value: 45, sentiment: 'negative' },
  { name: 'Speed/Snappiness', value: 98, sentiment: 'positive' },
  { name: 'TikTok Ad Copy', value: 63, sentiment: 'positive' },
  { name: 'Brand Health', value: 50, sentiment: 'neutral' }
];

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  citations?: Post[];
  timestamp: string;
}

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'c1',
    sender: 'assistant',
    content: 'Hi! I am your AI Market Research Copilot. I analyze all live social monitoring logs (from Reddit, X/Twitter, TikTok, YouTube, Instagram) to find strategic insights for your business. \n\nAsk me anything, or try one of the quick prompts below!',
    timestamp: new Date().toLocaleTimeString(),
  }
];

export const chatPromptResponses: { [key: string]: { text: string; citations: string[] } } = {
  "What are users complaining about regarding Competitor X?": {
    text: "Based on social analysis, users complaining about **LinearSense** (Competitor X) highlight two primary paint points:\n\n1. **Performance Issues**: Load times have reportedly doubled recently, rendering real-time checks frustrating.\n2. **Customer Support**: Support response times are lagging, pushing users to actively search for alternative platforms (e.g., SocialSense AI).\n\nHere are the active social proofs citing these complaints:",
    citations: ['1']
  },
  "Summarize top content ideas trending on TikTok for our niche.": {
    text: "On TikTok, the highest performing category revolves around **Actionable SaaS Hacks** and avoiding traditional manual tools (like spreadsheet tracking):\n\n- **Automated Competitor Analysis**: Presenting workflows showing how to turn rival customer grievances into high-converting ad copies.\n- **Speed Demonstrations**: Hooking views with instantaneous AI classifications.",
    citations: ['3']
  },
  "Extract product feature requests from Reddit.": {
    text: "Product feature requests collected from Reddit & Twitter emphasize immediate collaboration and export needs:\n\n1. **Automated Integrations**: High demand for a **Slack integration** to broadcast notification spikes directly into communication channels.\n2. **Mobile UX fixes**: Addressing layout issues regarding PDF export margins when rendering report documents on mobile devices.",
    citations: ['6', '4']
  }
};
