export type PlatformType = 'reddit' | 'twitter' | 'tiktok' | 'youtube' | 'instagram';

export type PRSignal = 
  | 'Crisis Threat' 
  | 'Brand Praise' 
  | 'Influencer Collab' 
  | 'Media Coverage' 
  | 'Customer Escalation';

export interface Post {
  id: string;
  platform: PlatformType;
  author: string;
  avatar: string;
  handle: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  signal: PRSignal;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  date: string;
  url: string;
  aiSummary: string;
  prActionRecommendation: string;
  influencerData?: {
    isSponsored: boolean;
    brandMentioned: string;
    commentSentiment: { positive: number; neutral: number; negative: number };
    reachEstimate: number;
  };
}

export interface CompetitorData {
  name: string;
  shareOfVoice: number;
  netSentiment: number; // -100 to +100
  mentions: number;
  strength: string;
  weakness: string;
  isClient?: boolean;
}

export interface SentimentTrendPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface PRSignalDistribution {
  name: PRSignal;
  value: number;
  percentage: number;
  color: string;
}

export interface ClientAccount {
  id: string;
  name: string;
  industry: string;
  crisisStatus: 'normal' | 'watch' | 'critical';
  crisisSummary: string;
  netSentimentScore: number;
  totalMentions: number;
  shareOfVoice: number;
  competitors: CompetitorData[];
  trendData: SentimentTrendPoint[];
  posts: Post[];
  signals: PRSignalDistribution[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  citations?: Post[];
  timestamp: string;
}

// -------------------------------------------------------------
// CLIENT 1: APEX MOTORS (Automotive & EV Industry Example)
// -------------------------------------------------------------
const apexMotorsPosts: Post[] = [
  {
    id: 'apex-1',
    platform: 'tiktok',
    author: 'DriveCulture KL',
    handle: '@driveculture_my',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    content: 'Just took the new Apex Horizon EV for a 300km road trip from KL to Penang! Instant torque, zero battery anxiety with the ultra-fast DC charging. Honestly feels way more premium than Vanguard Auto for the price point. #ApexMotors #EVReview #CarTokMY',
    sentiment: 'positive',
    signal: 'Brand Praise',
    engagement: { likes: 18400, shares: 3200, comments: 490 },
    date: '2026-09-03T18:20:00Z',
    url: 'https://tiktok.com/@driveculture_my/video/74891283',
    aiSummary: 'Viral short-form automotive review highlighting road-trip performance and price-to-value over Vanguard Auto.',
    prActionRecommendation: 'Amplify: Repost on official client social handles and engage creator for future test-drive activations.',
    influencerData: {
      isSponsored: false,
      brandMentioned: 'Apex Motors',
      commentSentiment: { positive: 82, neutral: 14, negative: 4 },
      reachEstimate: 340000
    }
  },
  {
    id: 'apex-2',
    platform: 'twitter',
    author: 'Kuala Lumpur Tech & Wheels',
    handle: '@kltechwheels',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    content: 'Breaking: 14 Apex Motors owners on Lowyat forum reporting delay in firmware update v2.4, claiming AC cuts off intermittently under noon heat. Hope Apex PR / customer service responds quickly before this blows up. @ApexMotorsMY',
    sentiment: 'negative',
    signal: 'Crisis Threat',
    engagement: { likes: 840, shares: 310, comments: 142 },
    date: '2026-09-04T07:15:00Z',
    url: 'https://twitter.com/kltechwheels/status/18928371',
    aiSummary: 'Early crisis warning: Customers discussing firmware glitch affecting air-conditioning during peak temperatures.',
    prActionRecommendation: 'Urgent: Issue official customer reassurance statement acknowledging the over-the-air hotfix scheduled within 24 hours.'
  },
  {
    id: 'apex-3',
    platform: 'instagram',
    author: 'Ryan Lifestyle & Tech',
    handle: '@ryan_autolife',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    content: 'Proud to announce my collaboration with @ApexMotorsMY for the National Clean Mobility Tour! Dropping by 5 cities this weekend. Come check out the test track and experience autonomous parking. #ApexPartner #Mobility2026 #Sponsored',
    sentiment: 'positive',
    signal: 'Influencer Collab',
    engagement: { likes: 12500, shares: 890, comments: 340 },
    date: '2026-09-02T12:00:00Z',
    url: 'https://instagram.com/p/C9k1920',
    aiSummary: 'Sponsored influencer partnership launch for nationwide roadshow with high initial engagement.',
    prActionRecommendation: 'Track: Monitor comment sentiment for questions about test-drive bookings and showroom locations.',
    influencerData: {
      isSponsored: true,
      brandMentioned: 'Apex Motors',
      commentSentiment: { positive: 76, neutral: 18, negative: 6 },
      reachEstimate: 210000
    }
  },
  {
    id: 'apex-4',
    platform: 'youtube',
    author: 'Autobuzz Insight Malaysia',
    handle: 'AutoBuzzInsight',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    content: 'Deep Dive: Why Apex Motors is outselling European rivals in the EV crossover segment this quarter. Detailed build quality, battery warranty analysis, and dealership service benchmark.',
    sentiment: 'positive',
    signal: 'Media Coverage',
    engagement: { likes: 4500, shares: 620, comments: 280 },
    date: '2026-09-01T15:30:00Z',
    url: 'https://youtube.com/watch?v=apx9021',
    aiSummary: 'Top-tier automotive media coverage positioning client as market leader against European competitors.',
    prActionRecommendation: 'Clip: Include quote snippets in monthly client PR briefing and executive media summary.'
  },
  {
    id: 'apex-5',
    platform: 'reddit',
    author: 'u/ev_enthusiast_my',
    handle: 'r/malaysia',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    content: 'Called Apex Motors Glenmarie service center 3 times to get my side mirror sensor calibrated. Still waiting for a callback after 4 days. Love the car, but after-sales service needs to match the luxury price tag.',
    sentiment: 'negative',
    signal: 'Customer Escalation',
    engagement: { likes: 195, shares: 14, comments: 42 },
    date: '2026-09-03T11:45:00Z',
    url: 'https://reddit.com/r/malaysia/comments/apex89',
    aiSummary: 'Customer grievance regarding delayed callback from regional service center.',
    prActionRecommendation: 'Escalate: Forward customer ticket ID to dealer network head to close loop before escalation.'
  }
];

// -------------------------------------------------------------
// CLIENT 2: AURA LIFESTYLE & GALLERIA (Retail & Mall Example)
// -------------------------------------------------------------
const auraLifestylePosts: Post[] = [
  {
    id: 'aura-1',
    platform: 'tiktok',
    author: 'KL Foodie & Spots',
    handle: '@klfoodiespots',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    content: 'The new Japanese Gourmet Hall at Aura Galleria just opened and it feels like stepping straight into Shinjuku! 🍣✨ Match ice cream is 10/10. Definitely the new weekend hangout spot. #AuraGalleria #KLFoodie #WeekendVibes',
    sentiment: 'positive',
    signal: 'Brand Praise',
    engagement: { likes: 42000, shares: 8700, comments: 1200 },
    date: '2026-09-03T19:00:00Z',
    url: 'https://tiktok.com/@klfoodiespots/video/7491028',
    aiSummary: 'Viral viral lifestyle post showcasing the mall new F&B zone with massive reach and sharing.',
    prActionRecommendation: 'Amplify: Feature in digital press release for upcoming weekend footfall campaign.'
  },
  {
    id: 'aura-2',
    platform: 'twitter',
    author: 'Shukri Rahman',
    handle: '@shukri_urban',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    content: 'Parking system at Aura Galleria went offline around 6 PM today. Took 45 minutes just to exit the basement. Security guards were doing manual cash receipts. @AuraGalleria please upgrade to smart cashless license plate recognition!',
    sentiment: 'negative',
    signal: 'Crisis Threat',
    engagement: { likes: 1420, shares: 580, comments: 210 },
    date: '2026-09-03T20:30:00Z',
    url: 'https://twitter.com/shukri_urban/status/1908129',
    aiSummary: 'Operations failure caused exit bottleneck; multiple visitors complaining on social media.',
    prActionRecommendation: 'Statement Needed: Issue polite social apology explaining temporary network outage and compensation complimentary parking passes.'
  },
  {
    id: 'aura-3',
    platform: 'instagram',
    author: 'Amanda Style & Beauty',
    handle: '@amandastyle_official',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    content: 'VIP preview of the Autumn Luxury Collection at Aura Galleria! ✨ Over 20 flagship boutiques participating with exclusive discounts. Loving this curated luxury experience. #AuraLuxury #FashionWeekKL #Ad',
    sentiment: 'positive',
    signal: 'Influencer Collab',
    engagement: { likes: 16800, shares: 640, comments: 290 },
    date: '2026-09-02T16:00:00Z',
    url: 'https://instagram.com/p/C90192',
    aiSummary: 'Fashion influencer collaboration driving awareness for luxury tenant campaign.',
    prActionRecommendation: 'Document: Record metrics for tenant retail value generation report.',
    influencerData: {
      isSponsored: true,
      brandMentioned: 'Aura Galleria',
      commentSentiment: { positive: 88, neutral: 9, negative: 3 },
      reachEstimate: 290000
    }
  }
];

// -------------------------------------------------------------
// CLIENT 3: INFLUENCER CAMPAIGN RADAR (Creator & Collab Vetting)
// -------------------------------------------------------------
const influencerRadarPosts: Post[] = [
  {
    id: 'inf-1',
    platform: 'tiktok',
    author: 'TechGuru_Marcus',
    handle: '@marcus_techmy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    content: 'Testing the unreleased flagship noise-cancelling headphones from PulseAudio. Are they actually worth RM1,499? Testing in LRT and coffee shops. Honest verdict: ANC is unbelievable. #PulsePartner #TechTok #HonestReview',
    sentiment: 'positive',
    signal: 'Influencer Collab',
    engagement: { likes: 31000, shares: 4200, comments: 890 },
    date: '2026-09-03T14:10:00Z',
    url: 'https://tiktok.com/@marcus_techmy/video/74881920',
    aiSummary: 'High-performing creator tech review with strong credibility and purchase intent in comments.',
    prActionRecommendation: 'High ROI: Creator comment sentiment is 89% positive. Recommend for 6-month brand ambassador contract.',
    influencerData: {
      isSponsored: true,
      brandMentioned: 'PulseAudio',
      commentSentiment: { positive: 89, neutral: 8, negative: 3 },
      reachEstimate: 450000
    }
  },
  {
    id: 'inf-2',
    platform: 'tiktok',
    author: 'Bella Lifestyle Deals',
    handle: '@belladeals_kl',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    content: 'Guys... this new skincare moisturizer everyone is hyping? It broke me out in 2 days. 😭 Look at my cheek redness. Not sponsored, just keeping it 100% real. Check ingredients before buying! #SkincareCheck #ViralBeautyFail',
    sentiment: 'negative',
    signal: 'Crisis Threat',
    engagement: { likes: 58000, shares: 14200, comments: 3400 },
    date: '2026-09-04T08:00:00Z',
    url: 'https://tiktok.com/@belladeals_kl/video/74899120',
    aiSummary: 'Viral negative review warning followers of skin reaction; comments filled with customer complaints.',
    prActionRecommendation: 'Critical: Brand PR team must comment offering dermatologist support and refund protocol.',
    influencerData: {
      isSponsored: false,
      brandMentioned: 'GlowMatrix',
      commentSentiment: { positive: 8, neutral: 14, negative: 78 },
      reachEstimate: 920000
    }
  }
];

export const clientAccounts: ClientAccount[] = [
  {
    id: 'apex-motors',
    name: 'Apex Motors (Automotive)',
    industry: 'Automotive & EV Mobility',
    crisisStatus: 'watch',
    crisisSummary: 'Firmware v2.4 AC glitch discussion on X/Twitter and Lowyat. Recommend proactive holding statement.',
    netSentimentScore: 68,
    totalMentions: 18450,
    shareOfVoice: 42,
    competitors: [
      {
        name: 'Apex Motors (Client)',
        shareOfVoice: 42,
        netSentiment: 68,
        mentions: 18450,
        strength: 'EV Range, Design, Roadshow Visibility',
        weakness: 'Recent firmware update delays',
        isClient: true
      },
      {
        name: 'Vanguard Auto',
        shareOfVoice: 31,
        netSentiment: 34,
        mentions: 13620,
        strength: 'Large legacy dealer network',
        weakness: 'Slow innovation, dated cabin tech'
      },
      {
        name: 'Horizon EV',
        shareOfVoice: 18,
        netSentiment: 48,
        mentions: 7910,
        strength: 'Aggressive pricing',
        weakness: 'Limited charging infrastructure'
      },
      {
        name: 'Zenith Motors',
        shareOfVoice: 9,
        netSentiment: 22,
        mentions: 3950,
        strength: 'Fleet commercial sales',
        weakness: 'Low consumer brand love'
      }
    ],
    trendData: [
      { date: 'Aug 29', positive: 64, neutral: 26, negative: 10 },
      { date: 'Aug 30', positive: 68, neutral: 24, negative: 8 },
      { date: 'Aug 31', positive: 70, neutral: 22, negative: 8 },
      { date: 'Sep 01', positive: 74, neutral: 20, negative: 6 },
      { date: 'Sep 02', positive: 72, neutral: 21, negative: 7 },
      { date: 'Sep 03', positive: 69, neutral: 22, negative: 9 },
      { date: 'Sep 04', positive: 68, neutral: 20, negative: 12 }
    ],
    posts: apexMotorsPosts,
    signals: [
      { name: 'Brand Praise', value: 45, percentage: 45, color: '#10b981' },
      { name: 'Influencer Collab', value: 25, percentage: 25, color: '#a855f7' },
      { name: 'Media Coverage', value: 15, percentage: 15, color: '#3b82f6' },
      { name: 'Crisis Threat', value: 10, percentage: 10, color: '#ef4444' },
      { name: 'Customer Escalation', value: 5, percentage: 5, color: '#f59e0b' }
    ]
  },
  {
    id: 'aura-lifestyle',
    name: 'Aura Lifestyle & Galleria (Retail)',
    industry: 'Premium Retail & Commercial Malls',
    crisisStatus: 'watch',
    crisisSummary: 'Weekend parking bottleneck complaints emerging on X. Overall brand love strong due to new Japanese food hall.',
    netSentimentScore: 74,
    totalMentions: 24100,
    shareOfVoice: 48,
    competitors: [
      {
        name: 'Aura Galleria (Client)',
        shareOfVoice: 48,
        netSentiment: 74,
        mentions: 24100,
        strength: 'Flagship boutique tenant mix, Food Hall',
        weakness: 'Weekend parking access bottleneck',
        isClient: true
      },
      {
        name: 'Metro Galleria',
        shareOfVoice: 26,
        netSentiment: 42,
        mentions: 13080,
        strength: 'Central LRT access',
        weakness: 'Older amenities, crowd congestion'
      },
      {
        name: 'The Grand Atrium',
        shareOfVoice: 16,
        netSentiment: 38,
        mentions: 8040,
        strength: 'Family entertainment',
        weakness: 'Weak luxury presence'
      },
      {
        name: 'Crown Plaza Retail',
        shareOfVoice: 10,
        netSentiment: 29,
        mentions: 5020,
        strength: 'Convenience grocery anchor',
        weakness: 'Declining foot traffic'
      }
    ],
    trendData: [
      { date: 'Aug 29', positive: 70, neutral: 20, negative: 10 },
      { date: 'Aug 30', positive: 72, neutral: 21, negative: 7 },
      { date: 'Aug 31', positive: 78, neutral: 17, negative: 5 },
      { date: 'Sep 01', positive: 81, neutral: 15, negative: 4 },
      { date: 'Sep 02', positive: 79, neutral: 16, negative: 5 },
      { date: 'Sep 03', positive: 76, neutral: 18, negative: 6 },
      { date: 'Sep 04', positive: 74, neutral: 17, negative: 9 }
    ],
    posts: auraLifestylePosts,
    signals: [
      { name: 'Brand Praise', value: 52, percentage: 52, color: '#10b981' },
      { name: 'Influencer Collab', value: 28, percentage: 28, color: '#a855f7' },
      { name: 'Media Coverage', value: 10, percentage: 10, color: '#3b82f6' },
      { name: 'Crisis Threat', value: 7, percentage: 7, color: '#ef4444' },
      { name: 'Customer Escalation', value: 3, percentage: 3, color: '#f59e0b' }
    ]
  },
  {
    id: 'influencer-radar',
    name: 'KOL & Influencer Campaign Tracker',
    industry: 'Integrated Creator Marketing',
    crisisStatus: 'critical',
    crisisSummary: 'Viral negative review on GlowMatrix moisturizer (78% negative comments). Immediate PR intervention needed.',
    netSentimentScore: 54,
    totalMentions: 38900,
    shareOfVoice: 36,
    competitors: [
      {
        name: 'PulseAudio Collab',
        shareOfVoice: 55,
        netSentiment: 84,
        mentions: 21400,
        strength: 'High credible tech conversion',
        weakness: 'High upfront talent retainer',
        isClient: true
      },
      {
        name: 'GlowMatrix Campaign',
        shareOfVoice: 45,
        netSentiment: -24,
        mentions: 17500,
        strength: 'Massive viral reach',
        weakness: 'Severe allergic reaction backlash'
      }
    ],
    trendData: [
      { date: 'Aug 29', positive: 75, neutral: 18, negative: 7 },
      { date: 'Aug 30', positive: 72, neutral: 20, negative: 8 },
      { date: 'Aug 31', positive: 68, neutral: 22, negative: 10 },
      { date: 'Sep 01', positive: 64, neutral: 24, negative: 12 },
      { date: 'Sep 02', positive: 60, neutral: 22, negative: 18 },
      { date: 'Sep 03', positive: 55, neutral: 20, negative: 25 },
      { date: 'Sep 04', positive: 54, neutral: 18, negative: 28 }
    ],
    posts: influencerRadarPosts,
    signals: [
      { name: 'Influencer Collab', value: 45, percentage: 45, color: '#a855f7' },
      { name: 'Crisis Threat', value: 30, percentage: 30, color: '#ef4444' },
      { name: 'Brand Praise', value: 15, percentage: 15, color: '#10b981' },
      { name: 'Customer Escalation', value: 7, percentage: 7, color: '#f59e0b' },
      { name: 'Media Coverage', value: 3, percentage: 3, color: '#3b82f6' }
    ]
  }
];

// PR Comms Copilot Presets
export const prChatResponses: Record<string, { text: string; citations: string[] }> = {
  "Draft an executive PR crisis holding statement for the client": {
    text: `### 🚨 Urgent Crisis Holding Statement (Draft)
**To:** Client Corporate Comms Director  
**Subject:** Holding Statement — Firmware v2.4 / AC Climate Control Issue  

**Holding Statement (For Immediate Release on Social & Media Query Response):**
> *"At Apex Motors, customer safety, comfort, and vehicle reliability are our highest priorities. We are actively monitoring reports from a small number of vehicle owners regarding intermittent climate control performance following the recent v2.4 firmware update.*
> 
> *Our engineering team has identified the cause and is currently deploying an over-the-air (OTA) software patch within the next 24 hours to resolve this completely. Affected owners are invited to contact our 24/7 dedicated customer care concierge at 1-800-APEX-CARE or visit any authorized service center for immediate assistance.*
> 
> *We deeply apologize for the inconvenience caused and thank our community for their continued trust."*

**Recommended PR Actions:**
1. Post across verified brand X/Twitter and Facebook channels.
2. Reply directly to the original Lowyat & Twitter thread starters with the official care hotline.
3. Brief all showroom dealer managers to ensure consistent customer messaging.`,
    citations: ['apex-2']
  },

  "Generate weekly executive PR briefing for client presentation": {
    text: `### 📊 Weekly Executive PR & Sentiment Briefing
**Client:** Apex Motors | **Period:** Aug 29 – Sep 04, 2026 | **Prepared by:** Agency PR Team  

#### 1. Executive Summary
- **Net Sentiment Score (NSS):** **+68** (Well above industry average of +35).
- **Share of Voice (SOV):** **42%** of total Malaysian automotive EV social conversations, leading Vanguard Auto (31%) and Horizon EV (18%).
- **Total Monitored Mentions:** **18,450 mentions** across TikTok, X, Reddit, and Instagram (+14% week-on-week).

#### 2. Key Narrative Highlights
- **Viral Praise Driver:** Road-trip test drive by creator *@driveculture_my* generated **18.4K likes and 340K reach**, with 82% positive audience sentiment praising fast-charging capabilities.
- **Media Feature:** AutoBuzz Insight published an in-depth video positioning Apex as the segment benchmark.

#### 3. PR Exposure / Risk Watchlist
- **Firmware v2.4 Glitch:** 14 owner complaints identified on Twitter/Lowyat. Issue is contained with the newly drafted holding statement and OTA patch announcement.

#### 4. Strategic Recommendations for Next Week
1. Launch Phase 2 of Clean Mobility Tour with creator activations in Penang and Johor.
2. Pitch EV battery durability case study to tier-1 business media (The Edge, BFM 89.9).`,
    citations: ['apex-1', 'apex-2', 'apex-4']
  },

  "Analyze audience sentiment on our latest influencer collaboration": {
    text: `### 🤝 Influencer Campaign Sentiment & ROI Breakdown
**Campaign:** National Clean Mobility Tour / Luxury Retail Preview  

#### Creator Analysis: Ryan Lifestyle & Tech (@ryan_autolife)
- **Estimated Reach:** 210,000 unique impressions.
- **Engagement:** 12,500 Likes | 890 Shares | 340 Comments.
- **Audience Sentiment Ratio:**
  - **Positive (76%):** Audience expressing excitement about test-driving the EV and praising the sleek design.
  - **Neutral (18%):** Inquiries about showroom locations, test track timing, and battery pricing.
  - **Negative (6%):** General skepticism regarding charging infrastructure in rural areas.

**Verdict & Agency Recommendation:**
The collaboration achieved high credibility with near-zero audience fatigue. Re-engage creator for regional showroom launch events.`,
    citations: ['apex-3']
  }
};
