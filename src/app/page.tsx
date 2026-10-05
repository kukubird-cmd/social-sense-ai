"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  Sparkles,
  Send,
  Filter,
  RefreshCw,
  ExternalLink,
  Play,
  Key,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Trash2,
  Plus,
  Loader2,
  Globe,
  TrendingUp,
  MessageCircle,
  ThumbsUp,
  Share2,
  Bot,
  User,
  Zap,
  Info,
  FlaskConical,
  Lock,
  Unlock,
  Square,
  Target,
  ArrowRight,
  Edit3,
  Check,
  X,
  LogOut,
  Eye,
  ChevronDown,
  ChevronUp,
  Maximize2
} from "lucide-react";

// Platform colors & badges
const PLATFORM_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  tiktok: { label: "TikTok", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  instagram: { label: "Instagram", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
  twitter: { label: "X / Twitter", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
  reddit: { label: "Reddit", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  youtube: { label: "YouTube", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  unknown: { label: "Social", color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20" }
};

// Decodes raw unicode escapes (\uXXXX, surrogate pairs) and HTML entities (&quot;, &#39;, &amp;)
function unescapeUnicodeAndHtml(str: string): string {
  if (!str) return "";
  let decoded = str;

  // 1. Decode surrogate pairs \uD83C\uDFA5 -> genuine UTF-8 characters and emojis
  decoded = decoded.replace(/\\u([dD][89abAB][0-9a-fA-F]{2})\\u([dD][c-fC-F][0-9a-fA-F]{2})/g, (_, high, low) => {
    try {
      const h = parseInt(high, 16);
      const l = parseInt(low, 16);
      const codePoint = ((h - 0xd800) * 0x400) + (l - 0xdc00) + 0x10000;
      return String.fromCodePoint(codePoint);
    } catch {
      return _;
    }
  });

  // 2. Decode standard 4-digit \uXXXX escapes (e.g. \u534e -> 华)
  decoded = decoded.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    try {
      return String.fromCodePoint(parseInt(hex, 16));
    } catch {
      return _;
    }
  });

  // 3. Decode common HTML entities
  const htmlEntities: Record<string, string> = {
    "&quot;": '"',
    "&#34;": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&amp;": "&",
    "&#38;": "&",
    "&lt;": "<",
    "&#60;": "<",
    "&gt;": ">",
    "&#62;": ">",
    "&nbsp;": " "
  };
  decoded = decoded.replace(/&(quot|apos|amp|lt|gt|nbsp|#34|#39|#38|#60|#62);/g, (m) => htmlEntities[m] || m);

  if (typeof document !== "undefined") {
    try {
      const txt = document.createElement("textarea");
      txt.innerHTML = decoded;
      decoded = txt.value;
    } catch (e) {}
  }
  return decoded;
}

// Inline Markdown Formatter (handles [Links](url), raw URLs, **bold**, *italic*, and `code`)
function renderFormattedInline(text: string): React.ReactNode {
  if (!text) return text;

  // Ensure unicode escapes and HTML entities are clean
  const cleanStr = unescapeUnicodeAndHtml(text);

  // Regex matches:
  // 1: Markdown link: [text](url) -> group 2: label, group 3: url
  // 4: Bold-Italic: ***text*** -> group 5
  // 6: Bold: **text** -> group 7
  // 8: Italic: *text* -> group 9
  // 10: Inline code: `text` -> group 11
  // 12: Standalone URL: https?://... -> group 12
  const regex = /(\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)|\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*([^\*]+?)\*|`([^`]+)`|(https?:\/\/[^\s\)\],<"]+))/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(cleanStr)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleanStr.slice(lastIndex, match.index));
    }

    const [fullMatch, , linkLabel, linkUrl, boldItalic, boldText, italicText, codeText, rawUrl] = match;

    if (linkLabel && linkUrl) {
      let platformBadgeStyle = "text-indigo-400 hover:text-indigo-300 border-indigo-500/30 bg-indigo-950/30 hover:bg-indigo-950/60";
      const lower = (linkUrl + " " + linkLabel).toLowerCase();
      if (lower.includes("youtube") || lower.includes("youtu.be")) {
        platformBadgeStyle = "text-red-400 hover:text-red-300 border-red-500/40 bg-red-950/30 hover:bg-red-950/50";
      } else if (lower.includes("reddit")) {
        platformBadgeStyle = "text-orange-400 hover:text-orange-300 border-orange-500/40 bg-orange-950/30 hover:bg-orange-950/50";
      } else if (lower.includes("tiktok")) {
        platformBadgeStyle = "text-cyan-400 hover:text-cyan-300 border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-950/50";
      } else if (lower.includes("instagram")) {
        platformBadgeStyle = "text-pink-400 hover:text-pink-300 border-pink-500/40 bg-pink-950/30 hover:bg-pink-950/50";
      } else if (lower.includes("twitter") || lower.includes("x.com")) {
        platformBadgeStyle = "text-sky-400 hover:text-sky-300 border-sky-500/40 bg-sky-950/30 hover:bg-sky-950/50";
      }

      parts.push(
        <a
          key={`lnk-${match.index}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 font-medium px-2 py-0.5 mx-0.5 rounded-md text-xs border transition-all duration-150 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] ${platformBadgeStyle}`}
          title={`Open source on ${linkLabel}: ${linkUrl}`}
        >
          <span>{linkLabel}</span>
          <ExternalLink className="w-3 h-3 inline-block flex-shrink-0" />
        </a>
      );
    } else if (boldItalic !== undefined) {
      parts.push(
        <strong key={`bi-${match.index}`} className="text-white font-bold italic">
          {boldItalic}
        </strong>
      );
    } else if (boldText !== undefined) {
      parts.push(
        <strong key={`b-${match.index}`} className="text-white font-semibold">
          {boldText}
        </strong>
      );
    } else if (italicText !== undefined) {
      parts.push(
        <em key={`em-${match.index}`} className="text-zinc-200 italic font-semibold">
          {italicText}
        </em>
      );
    } else if (codeText !== undefined) {
      parts.push(
        <code key={`c-${match.index}`} className="bg-[#27272a] text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono">
          {codeText}
        </code>
      );
    } else if (rawUrl !== undefined) {
      parts.push(
        <a
          key={`raw-${match.index}`}
          href={rawUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline underline-offset-2 font-medium hover:bg-indigo-950/50 px-1.5 py-0.5 rounded text-xs transition-colors cursor-pointer"
        >
          <span className="truncate max-w-[240px] inline-block align-bottom">{rawUrl}</span>
          <ExternalLink className="w-3 h-3 inline-block flex-shrink-0" />
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < cleanStr.length) {
    parts.push(cleanStr.slice(lastIndex));
  }

  return parts.length > 0 ? parts : cleanStr;
}

// Clean, rich Markdown renderer (no raw ###, **, * symbols)
function CleanMarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "bullet" | "number"; items: { num?: string; text: string }[] } | null = null;

  const flushList = (keyPrefix: string) => {
    if (!currentList) return;
    if (currentList.type === "bullet") {
      elements.push(
        <ul key={`${keyPrefix}-ul`} className="my-2 space-y-1.5 pl-1">
          {currentList.items.map((it, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-zinc-300 text-xs sm:text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
              <div className="flex-1">{renderFormattedInline(it.text)}</div>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`${keyPrefix}-ol`} className="my-2 space-y-1.5 pl-1">
          {currentList.items.map((it, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-zinc-300 text-xs sm:text-sm leading-relaxed">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono mt-0.5 flex-shrink-0 border border-indigo-500/30">
                {it.num || idx + 1}
              </span>
              <div className="flex-1">{renderFormattedInline(it.text)}</div>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    if (!line) {
      flushList(`empty-${idx}`);
      return;
    }

    // Horizontal Rule
    if (line === "---" || line === "***" || line === "___") {
      flushList(`hr-${idx}`);
      elements.push(<hr key={`hr-${idx}`} className="border-[#27272a] my-3" />);
      return;
    }

    // Headings
    if (line.startsWith("#### ")) {
      flushList(`h4-${idx}`);
      elements.push(
        <h5 key={`h4-${idx}`} className="text-xs font-bold text-indigo-300 mt-2.5 mb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-3 bg-indigo-400 rounded-sm" />
          <span>{renderFormattedInline(line.slice(5))}</span>
        </h5>
      );
      return;
    }
    if (line.startsWith("### ")) {
      flushList(`h3-${idx}`);
      elements.push(
        <h4 key={`h3-${idx}`} className="text-sm font-bold text-white mt-3 mb-1.5 flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full" />
          <span>{renderFormattedInline(line.slice(4))}</span>
        </h4>
      );
      return;
    }
    if (line.startsWith("## ")) {
      flushList(`h2-${idx}`);
      elements.push(
        <h3 key={`h2-${idx}`} className="text-base font-bold text-white mt-3.5 mb-2 flex items-center gap-2 border-b border-[#27272a] pb-1">
          <span className="w-2 h-4 bg-indigo-500 rounded" />
          <span>{renderFormattedInline(line.slice(3))}</span>
        </h3>
      );
      return;
    }
    if (line.startsWith("# ")) {
      flushList(`h1-${idx}`);
      elements.push(
        <h2 key={`h1-${idx}`} className="text-lg font-extrabold text-white mt-4 mb-2">
          {renderFormattedInline(line.slice(2))}
        </h2>
      );
      return;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      flushList(`bq-${idx}`);
      elements.push(
        <div key={`bq-${idx}`} className="border-l-2 border-indigo-500 bg-indigo-950/20 px-3 py-2 my-2 rounded-r text-zinc-300 italic text-xs leading-relaxed">
          {renderFormattedInline(line.slice(2))}
        </div>
      );
      return;
    }

    // Numbered list
    const numMatch = line.match(/^(\d+)[\.\)]\s+(.*)$/);
    if (numMatch) {
      if (!currentList || currentList.type !== "number") {
        flushList(`switch-num-${idx}`);
        currentList = { type: "number", items: [] };
      }
      currentList.items.push({ num: numMatch[1], text: numMatch[2] });
      return;
    }

    // Bullet list
    const bulletMatch = line.match(/^([*\-•])\s+(.*)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== "bullet") {
        flushList(`switch-bullet-${idx}`);
        currentList = { type: "bullet", items: [] };
      }
      currentList.items.push({ text: bulletMatch[2].trim() });
      return;
    }

    // Indented continuation of previous list item
    if (currentList && (rawLine.startsWith("  ") || rawLine.startsWith("\t")) && currentList.items.length > 0) {
      currentList.items[currentList.items.length - 1].text += " " + line;
      return;
    }

    // Regular paragraph
    flushList(`p-${idx}`);
    elements.push(
      <p key={`p-${idx}`} className="my-1.5 text-zinc-200 text-xs sm:text-sm leading-relaxed">
        {renderFormattedInline(line)}
      </p>
    );
  });

  flushList("final");
  return <div className="space-y-1">{elements}</div>;
}

interface ScrapedPost {
  id: string;
  platform: string;
  keyword: string;
  author: string;
  handle: string;
  content: string;
  sentiment: "Positive" | "Neutral" | "Negative" | "Crisis";
  url: string;
  timestamp: string;
  is_owned_media?: boolean;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface ChatMessage {
  id: string;
  sender: "user" | "gemini";
  text: string;
  timestamp: string;
  referencedCount?: number;
  topicOptions?: string[];
}

interface KeywordItem {
  id: string;
  keyword_string: string;
  topic_context?: string;
  is_active: boolean;
  platform_flags: Record<string, boolean>;
  created_at: string;
}

let API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");
let WS_BASE = (process.env.NEXT_PUBLIC_WS_URL || API_BASE.replace(/^http/, "ws")).replace(/\/+$/, "");

if (typeof window !== "undefined") {
  try {
    const params = new URLSearchParams(window.location.search);
    const queryApi = params.get("api") || params.get("backend");
    if (queryApi && (queryApi.startsWith("http://") || queryApi.startsWith("https://"))) {
      localStorage.setItem("socialsense_custom_api_url", queryApi.replace(/\/+$/, ""));
    }
    const saved = localStorage.getItem("socialsense_custom_api_url");
    if (saved && (saved.startsWith("http://") || saved.startsWith("https://"))) {
      API_BASE = saved.replace(/\/+$/, "");
      WS_BASE = API_BASE.replace(/^http/, "ws");
    }
  } catch {}
}

const DEFAULT_COMPANY_ID = "11111111-1111-1111-1111-111111111111";

export default function SimplifiedSocialSenseDashboard() {
  const [activeTab, setActiveTab] = useState<"feed" | "chat" | "keywords">("feed");

  // Multi-Tenant Auth & Session States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeCompanyId, setActiveCompanyId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<{ email: string; companyName: string; role: string; companyId?: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Restore session from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("socialsense_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email && parsed.companyId) {
          setActiveCompanyId(parsed.companyId);
          setCurrentUser(parsed);
          setIsLoggedIn(true);
        }
      }
    } catch {}
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError("Please enter your registered email address.");
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError("Please enter your account password.");
      return;
    }
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        const user = {
          email: data.email,
          companyName: data.company_name,
          role: data.role,
          companyId: data.company_id
        };
        setActiveCompanyId(data.company_id);
        setCurrentUser(user);
        setIsLoggedIn(true);
        try {
          localStorage.setItem("socialsense_session", JSON.stringify(user));
        } catch {}
      } else {
        const err = await res.json().catch(() => ({}));
        setLoginError(err.detail || "Account not found or invalid credentials. Only registered company accounts have access.");
      }
    } catch {
      setLoginError(`Unable to reach the authentication server at ${API_BASE}. Please ensure the backend is running and reachable.`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickLogin = async (email: string, companyName: string, role: string) => {
    setLoginEmail(email);
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "demo" })
      });
      if (res.ok) {
        const data = await res.json();
        const user = {
          email: data.email,
          companyName: data.company_name,
          role: data.role,
          companyId: data.company_id
        };
        setActiveCompanyId(data.company_id);
        setCurrentUser(user);
        setIsLoggedIn(true);
        try {
          localStorage.setItem("socialsense_session", JSON.stringify(user));
        } catch {}
      } else {
        const err = await res.json().catch(() => ({}));
        setLoginError(err.detail || `Could not sign in to ${companyName}. Workspace is not registered on this server.`);
      }
    } catch {
      setLoginError(`Unable to reach authentication server at ${API_BASE}. Please check server connection.`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveCompanyId("");
    setKeywords([]);
    setPosts([]);
    setSelectedKeyword("all");
    try {
      localStorage.removeItem("socialsense_session");
    } catch {}
  };

  // Live Data States
  const [posts, setPosts] = useState<ScrapedPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all");
  const [selectedKeyword, setSelectedKeyword] = useState<string>("all");
  const [mediaFilter, setMediaFilter] = useState<"all" | "earned" | "owned">("all");
  const [inspectingPost, setInspectingPost] = useState<ScrapedPost | null>(null);
  const [expandedPostIds, setExpandedPostIds] = useState<Set<string>>(new Set());

  const toggleExpandPost = (id: string) => {
    setExpandedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Keyword & Scraper States (1 Keyword Plan Enforced)
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [maxKeywords, setMaxKeywords] = useState<number>(1);
  const [currentScrapingKeyword, setCurrentScrapingKeyword] = useState<{ keyword_id: string; keyword_string: string } | null>(null);
  const [newKeywordInput, setNewKeywordInput] = useState<string>("");
  const [newTopicContextInput, setNewTopicContextInput] = useState<string>("");
  const [editingKeywordId, setEditingKeywordId] = useState<string | null>(null);
  const [editingContextText, setEditingContextText] = useState<string>("");
  const [isAddingKeyword, setIsAddingKeyword] = useState<boolean>(false);
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [isStoppingScrape, setIsStoppingScrape] = useState<boolean>(false);
  const [scrapeNotice, setScrapeNotice] = useState<string | null>(null);

  // Gemini AI Chat States
  const [currentFocusTopic, setCurrentFocusTopic] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "gemini",
      text: "Hello! I am your **Gemini AI Social Analyst**.\n\nI have direct access to your live database of scraped comments and posts across TikTok, Reddit, Instagram, X/Twitter, and YouTube.\n\nAsk me anything — I will analyze real social discussions, summarize public sentiment, or flag crisis issues for you!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  // Fetch real scraped posts from FastAPI
  const fetchScrapedData = async (targetCompanyId?: string) => {
    const compId = targetCompanyId || activeCompanyId;
    if (!compId) return;
    setIsLoadingPosts(true);
    try {
      const res = await fetch(`${API_BASE}/api/companies/${compId}/scraped-data`);
      if (res.ok) {
        const data = await res.json();
        const rawList = Array.isArray(data) ? data : data.records || [];
        const parsed: ScrapedPost[] = rawList.map((r: any) => {
          const rawContent = r.comment_text || "";
          const decoded = unescapeUnicodeAndHtml(rawContent);
          
          // Extract author handle if present (e.g., /u/username or @handle)
          let author = "User";
          let handle = "";
          const redditMatch = rawContent.match(/\/u\/([A-Za-z0-9_-]+)/);
          const twitterMatch = rawContent.match(/@([A-Za-z0-9_]+)/);
          if (redditMatch) {
            author = redditMatch[1];
            handle = `u/${redditMatch[1]}`;
          } else if (twitterMatch) {
            author = twitterMatch[1];
            handle = `@${twitterMatch[1]}`;
          }

          const metrics = r.engagement_metrics || {};
          return {
            id: r.id || String(Math.random()),
            platform: (r.platform || "unknown").toLowerCase(),
            keyword: r.keyword_string || "General",
            author,
            handle,
            content: decoded,
            sentiment: r.sentiment_score || "Neutral",
            url: r.post_url || "#",
            timestamp: r.timestamp || new Date().toISOString(),
            is_owned_media: Boolean(r.is_owned_media),
            engagement: {
              likes: metrics.likes || metrics.upvotes || 0,
              shares: metrics.shares || metrics.retweets || 0,
              comments: metrics.comments || metrics.replies || 0
            }
          };
        });
        setPosts(parsed);
      }
    } catch (err) {
      console.warn("Error loading scraped data:", err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Fetch real keywords & quota from FastAPI
  const fetchKeywords = async (targetCompanyId?: string) => {
    const compId = targetCompanyId || activeCompanyId;
    if (!compId) return;
    try {
      const res = await fetch(`${API_BASE}/api/companies/${compId}/keywords`);
      if (res.ok) {
        const data = await res.json();
        setKeywords(Array.isArray(data) ? data : data.value || []);
      } else {
        const stored = localStorage.getItem(`socialsense_kws_${compId}`);
        setKeywords(stored ? JSON.parse(stored) : []);
      }
      const quotaRes = await fetch(`${API_BASE}/api/companies/${compId}/quota`);
      if (quotaRes.ok) {
        const quotaData = await quotaRes.json();
        if (typeof quotaData.max_keywords === "number") {
          setMaxKeywords(quotaData.max_keywords);
        }
      } else {
        setMaxKeywords(1);
      }
    } catch (err) {
      console.warn("Error fetching keywords or quota:", err);
      const stored = localStorage.getItem(`socialsense_kws_${compId}`);
      setKeywords(stored ? JSON.parse(stored) : []);
      setMaxKeywords(1);
    }
  };

  // Check active scraping status from FastAPI backend
  const checkScraperStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/scraper/status`);
      if (res.ok) {
        const data = await res.json();
        const active = Boolean(data.is_scraping);
        setIsScraping(active);
        if (data.current_keyword) {
          setCurrentScrapingKeyword(data.current_keyword);
        } else if (!active) {
          setCurrentScrapingKeyword(null);
        }
        return active;
      }
    } catch {
      // Backend may be offline
    }
    return false;
  };

  // React strictly to activeCompanyId changes to prevent cross-account interception
  useEffect(() => {
    if (!activeCompanyId) return;

    // Reset data first so previous account data never flashes or intercepts
    setPosts([]);
    setKeywords([]);
    setSelectedKeyword("all");

    fetchScrapedData(activeCompanyId);
    fetchKeywords(activeCompanyId);
    checkScraperStatus();

    // WebSocket real-time live ingestion listener strictly scoped to this company_id room
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(`${WS_BASE}/ws/${activeCompanyId}`);
      ws.onopen = () => setWsConnected(true);
      ws.onclose = () => setWsConnected(false);
      ws.onerror = () => setWsConnected(false);
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === "SCRAPING_STARTED") {
            setIsScraping(true);
            if (payload.keyword_string) {
              setCurrentScrapingKeyword({
                keyword_id: payload.keyword_id || "",
                keyword_string: payload.keyword_string
              });
              setScrapeNotice(`🚀 Live scraping running for "${payload.keyword_string}"...`);
            }
          } else if (payload.event === "SCRAPING_STOPPED") {
            setIsScraping(false);
            setCurrentScrapingKeyword(null);
            setScrapeNotice(payload.message || "🛑 Scraping stopped.");
            setTimeout(() => setScrapeNotice(null), 6000);
            fetchScrapedData(activeCompanyId);
          } else if (payload.event === "SCRAPING_FINISHED") {
            setIsScraping(false);
            setCurrentScrapingKeyword(null);
            fetchScrapedData(activeCompanyId);
          } else if (payload.event === "NEW_SCRAPED_DATA" && Array.isArray(payload.records)) {
            fetchScrapedData(activeCompanyId);
            checkScraperStatus();
          }
        } catch (e) {
          console.error("WS Parse error:", e);
        }
      };
    } catch (e) {
      console.warn("WebSocket init error:", e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [activeCompanyId]);

  // Poll status periodically when scraping is active to detect completion
  useEffect(() => {
    if (!isScraping) return;
    const interval = setInterval(() => {
      checkScraperStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, [isScraping]);

  // Add new keyword
  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordInput.trim()) return;
    if (keywords.length >= maxKeywords) {
      setKeywordError(`Commercial Quota Limit Reached (${keywords.length}/${maxKeywords} active keywords). Upgrade tier to track more.`);
      return;
    }

    setIsAddingKeyword(true);
    setKeywordError(null);

    try {
      const res = await fetch(`${API_BASE}/api/companies/${activeCompanyId}/keywords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword_string: newKeywordInput.trim(),
          topic_context: newTopicContextInput.trim(),
          platform_flags: {
            tiktok: true,
            instagram: true,
            twitter: true,
            reddit: true,
            youtube: true
          }
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to add keyword");
      }

      setNewKeywordInput("");
      setNewTopicContextInput("");
      await fetchKeywords(activeCompanyId);
    } catch (err: any) {
      // Local fallback for offline/isolated demo
      const fallbackItem: KeywordItem = {
        id: "kw-" + Date.now(),
        keyword_string: newKeywordInput.trim(),
        topic_context: newTopicContextInput.trim(),
        is_active: true,
        platform_flags: { tiktok: true, instagram: true, twitter: true, reddit: true, youtube: true },
        created_at: new Date().toISOString()
      };
      const updated = [...keywords, fallbackItem];
      setKeywords(updated);
      try {
        localStorage.setItem(`socialsense_kws_${activeCompanyId}`, JSON.stringify(updated));
      } catch {}
      setNewKeywordInput("");
      setNewTopicContextInput("");
      setKeywordError(null);
    } finally {
      setIsAddingKeyword(false);
    }
  };

  // Update keyword topic context or status
  const handleUpdateKeywordContext = async (keywordId: string, topicContext: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/companies/${activeCompanyId}/keywords/${keywordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_context: topicContext.trim()
        })
      });
      if (res.ok) {
        setEditingKeywordId(null);
        setEditingContextText("");
        await fetchKeywords(activeCompanyId);
      }
    } catch (err) {
      console.error("Failed to update keyword context:", err);
    }
  };

  // Delete keyword
  const handleDeleteKeyword = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/companies/${activeCompanyId}/keywords/${id}`, {
        method: "DELETE"
      });
      await fetchKeywords(activeCompanyId);
    } catch (err) {
      const updated = keywords.filter((k) => k.id !== id);
      setKeywords(updated);
      try {
        localStorage.setItem(`socialsense_kws_${activeCompanyId}`, JSON.stringify(updated));
      } catch {}
    }
  };

  // Stop all active scraper tasks and abort cloud runs
  const handleStopScrape = async () => {
    setIsStoppingScrape(true);
    try {
      const res = await fetch(`${API_BASE}/api/scraper/stop`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setIsScraping(false);
        setScrapeNotice(data.message || "🛑 Scraping stopped. Cloud actors aborted.");
        setTimeout(() => setScrapeNotice(null), 8000);
        await fetchScrapedData(activeCompanyId);
      } else {
        const err = await res.json();
        setScrapeNotice(`Failed to stop scraping: ${err.detail || "Server error"}`);
      }
    } catch {
      setScrapeNotice("Failed to reach backend server to stop scraping.");
    } finally {
      setIsStoppingScrape(false);
    }
  };

  // Trigger live Apify scrape
  const handleRunScrape = async (keywordId: string) => {
    setIsScraping(true);
    setScrapeNotice("Launching Apify scraper actors (100 posts per platform) across TikTok, Reddit, Instagram, X, and YouTube in the cloud...");

    try {
      const res = await fetch(`${API_BASE}/api/scraper/trigger/${keywordId}?company_id=${encodeURIComponent(activeCompanyId)}&limit=100`, {
        method: "POST"
      });
      if (res.ok) {
        setIsScraping(true);
        setScrapeNotice("Scrapers triggered (100 posts per platform)! Data is automatically downloaded and added to your feed as soon as actors finish.");
        setTimeout(() => checkScraperStatus(), 1000);
      } else {
        setIsScraping(false);
        const data = await res.json().catch(() => ({}));
        const detailMsg = typeof data.detail === "string" ? data.detail : (data.detail ? JSON.stringify(data.detail) : "Error triggering scrape.");
        setScrapeNotice(`⛔ ${detailMsg}`);
      }
    } catch (err: any) {
      setIsScraping(false);
      setScrapeNotice("Failed to trigger scraper. Check backend logs.");
    }
  };

  // Quick Scrape any keyword (searched or custom) - strictly checks bought status for registered companies
  const handleQuickScrape = async (keywordText: string) => {
    const cleanKw = keywordText.trim();
    if (!cleanKw || isScraping) return;

    // Check if the current company actually owns / bought this keyword
    const registeredKw = keywords.find(
      (k) => k.keyword_string.toLowerCase() === cleanKw.toLowerCase()
    );

    if (!registeredKw && currentUser?.role !== "admin") {
      setScrapeNotice(
        `⛔ Access Denied: "${cleanKw}" has not been purchased for company workspace "${currentUser?.companyName || "Client"}". Only registered companies can scrape keywords they have bought and activated in their plan.`
      );
      return;
    }

    setIsScraping(true);
    setScrapeNotice(`🚀 Launching Apify scrapers for "${cleanKw}" (100 posts per platform) across TikTok, Reddit, Instagram, X, and YouTube...`);

    try {
      const res = await fetch(`${API_BASE}/api/scraper/quick-scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: activeCompanyId,
          keyword_string: cleanKw,
          platforms: "tiktok,instagram,twitter,reddit,youtube",
          limit: 100
        })
      });

      if (res.ok) {
        setIsScraping(true);
        setScrapeNotice(`✅ Scrapers launched for "${cleanKw}"! Ingesting real data into your live feed as actors complete.`);
        await fetchKeywords(activeCompanyId);
        setTimeout(() => checkScraperStatus(), 1000);
      } else {
        setIsScraping(false);
        const errData = await res.json().catch(() => ({}));
        const errMsg = typeof errData.detail === "string"
          ? errData.detail
          : (Array.isArray(errData.detail) && errData.detail[0]?.msg ? errData.detail[0].msg : (errData.detail ? JSON.stringify(errData.detail) : "Failed to launch scrapers"));
        setScrapeNotice(`⛔ ${errMsg}`);
      }
    } catch (err: any) {
      setIsScraping(false);
      setScrapeNotice("Failed to launch scrapers. Check backend connection.");
    }
  };

  // Send message to Gemini AI Chatbot
  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!presetText) setChatInput("");
    setIsChatLoading(true);
    try {
      // Enforce strict single-keyword scoping for Gemini AI analysis
      const activeKw = selectedKeyword !== "all" 
        ? keywords.find((k) => k.keyword_string.toLowerCase() === selectedKeyword.toLowerCase()) 
        : (keywords.length > 0 ? keywords[0] : null);
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          company_id: activeCompanyId,
          keyword_id: activeKw?.id,
          topic_context: currentFocusTopic.trim() || activeKw?.topic_context || undefined
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Chat failed");
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `gemini-${Date.now()}`,
        sender: "gemini",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        referencedCount: data.referenced_records_count,
        topicOptions: Array.isArray(data.topic_options) ? data.topic_options : []
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "gemini",
        text: `⚠️ **Error communicating with Gemini AI**: ${err.message || "Failed to reach AI service."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Filtered post list
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlatform = selectedPlatform === "all" || p.platform === selectedPlatform;
      const matchesSentiment = selectedSentiment === "all" || p.sentiment.toLowerCase() === selectedSentiment.toLowerCase();
      const matchesKeyword = selectedKeyword === "all" || p.keyword.toLowerCase() === selectedKeyword.toLowerCase();
      const matchesMedia =
        mediaFilter === "all" ||
        (mediaFilter === "earned" && !p.is_owned_media) ||
        (mediaFilter === "owned" && Boolean(p.is_owned_media));

      return matchesSearch && matchesPlatform && matchesSentiment && matchesKeyword && matchesMedia;
    });
  }, [posts, searchQuery, selectedPlatform, selectedSentiment, selectedKeyword, mediaFilter]);

  // Sentiment counts (strictly scoped to the currently selected keyword)
  const sentimentCounts = useMemo(() => {
    const scopedPosts = selectedKeyword === "all"
      ? posts
      : posts.filter((p) => p.keyword.toLowerCase() === selectedKeyword.toLowerCase());
    const pos = scopedPosts.filter((p) => (p.sentiment || "").toLowerCase() === "positive").length;
    const neu = scopedPosts.filter((p) => (p.sentiment || "").toLowerCase() === "neutral").length;
    const neg = scopedPosts.filter((p) => (p.sentiment || "").toLowerCase() === "negative").length;
    const cri = scopedPosts.filter((p) => (p.sentiment || "").toLowerCase() === "crisis").length;
    const owned = scopedPosts.filter((p) => Boolean(p.is_owned_media)).length;
    const earned = scopedPosts.length - owned;
    return { pos, neu, neg, cri, owned, earned, total: scopedPosts.length };
  }, [posts, selectedKeyword]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[300px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/25 mb-4 ring-1 ring-white/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
              SocialSense AI
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full align-middle">
                Enterprise
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Real-Time Social Media Market Research & PR Intelligence
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#121215]/90 border border-[#27272a] rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Sign In to Registered Workspace
              </h2>
              <p className="text-xs text-zinc-400">
                Access is restricted to registered company tenants and bought keywords.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Registered Work Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="analyst@yourcompany.com"
                    className="w-full bg-[#18181b] border border-[#27272a] focus:border-blue-500 text-sm text-white rounded-xl pl-10 pr-3 py-2.5 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Account Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#18181b] border border-[#27272a] focus:border-blue-500 text-sm text-white rounded-xl pl-10 pr-3 py-2.5 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#27272a]" />
              </div>
              <span className="relative px-3 bg-[#121215] text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
                Quick 1-Click Access
              </span>
            </div>

            {/* Quick Demo Logins */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("analyst@apexmotors.com", "Apex Motors (EV Client)", "client")}
                className="w-full p-2.5 rounded-xl bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-blue-500/40 text-left flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/20">
                    AM
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">Apex Motors</div>
                    <div className="text-[10px] text-zinc-500">Automotive / EV Brand Client</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">1-Click Login</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("lead@orchan.asia", "Orchan Consulting Asia", "agency")}
                className="w-full p-2.5 rounded-xl bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-indigo-500/40 text-left flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">
                    OA
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">Orchan Consulting Asia</div>
                    <div className="text-[10px] text-zinc-500">PR & Communications Agency</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium">1-Click Login</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("admin@socialsense.ai", "System Administrator", "admin")}
                className="w-full p-2.5 rounded-xl bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-emerald-500/40 text-left flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/20">
                    SA
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">Admin Sandbox</div>
                    <div className="text-[10px] text-zinc-500">Full Access (Unlimited Mode)</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">1-Click Login</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-[11px] text-zinc-500 flex flex-col items-center gap-2">
            <span>Protected by SocialSense AI Security &bull; Powered by Gemini 3 Flash</span>
            <Link
              href="/admin"
              className="text-zinc-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 text-xs font-medium bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-blue-500/30 px-3 py-1.5 rounded-lg"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Tenant Provisioning &amp; Monitor Console &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#27272a] bg-[#121215]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white">SocialSense AI</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                Gemini 3 Flash
              </span>
            </div>
            <p className="text-xs text-zinc-400">Real-Time Social Media Market Research & Intelligence</p>
          </div>
        </div>

        {/* Status Indicators, Mode Switcher & Live WebSocket */}
        <div className="flex items-center gap-3">
          {/* Commercial B2B Plan Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border bg-blue-500/10 border-blue-500/25 text-blue-300">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Commercial Plan:</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200 font-semibold">
              {keywords.length} / {maxKeywords} Keywords
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded-lg">
            <span className={`w-2 h-2 rounded-full ${wsConnected ? "bg-emerald-500 animate-pulse" : "bg-zinc-500"}`} />
            <span className="text-zinc-300">{wsConnected ? "Live Feed Sync" : "Connecting..."}</span>
          </div>

          {/* Permanent Stop Scraping Header Button */}
          <button
            id="header-stop-scraping-btn"
            onClick={handleStopScrape}
            disabled={!isScraping || isStoppingScrape}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isScraping
                ? "bg-rose-600/20 hover:bg-rose-600/35 text-rose-400 hover:text-rose-300 border border-rose-500/40 animate-pulse shadow-sm shadow-rose-950/50 cursor-pointer"
                : "bg-[#18181b] text-zinc-500 border border-[#27272a] opacity-70 cursor-not-allowed"
            }`}
            title={isScraping ? "Stop all active scraping tasks and abort cloud scrapers" : "No scraping runs currently active"}
          >
            {isStoppingScrape ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
            ) : (
              <Square className={`w-3.5 h-3.5 ${isScraping ? "fill-current text-rose-400" : "text-zinc-500"}`} />
            )}
            <span>{isScraping ? "Stop Scraping" : "Scraper Idle"}</span>
          </button>

          <div className="text-xs bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded-lg text-zinc-300">
            Database Posts: <strong className="text-white">{posts.length}</strong>
          </div>

          <button
            onClick={() => fetchScrapedData()}
            className="p-1.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-zinc-300 transition-colors cursor-pointer"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingPosts ? "animate-spin text-blue-400" : ""}`} />
          </button>

          {/* User Account & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#27272a]">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#18181b] border border-[#27272a] text-xs">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                {currentUser?.companyName?.[0] || "C"}
              </div>
              <span className="text-zinc-200 font-medium">{currentUser?.companyName || "Client Workspace"}</span>
            </div>

            {currentUser?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer"
                title="Open Admin Tenant Provisioning & Monitoring Console"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Admin Portal</span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/80 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400 border border-zinc-700/60 hover:border-rose-500/30 transition-all cursor-pointer"
              title="Sign out and return to login page"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Scrape Notification Banner */}
      {scrapeNotice && (
        <div className="bg-blue-950/60 border-b border-blue-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-blue-200">
          <div className="flex items-center gap-2">
            {isScraping ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span>{scrapeNotice}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isScraping && (
              <button
                id="banner-stop-scraping-btn"
                onClick={handleStopScrape}
                disabled={isStoppingScrape}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-sm"
                title="Stop running scrapers immediately"
              >
                {isStoppingScrape ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Square className="w-3 h-3 fill-current" />
                )}
                <span>Stop Scraping</span>
              </button>
            )}
            <button onClick={() => setScrapeNotice(null)} className="text-blue-400 hover:text-white ml-1">✕</button>
          </div>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="border-b border-[#27272a] bg-[#0e0e11] px-6 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === "feed"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]/50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Live Social Feed</span>
            <span className="px-1.5 py-0.5 text-[11px] rounded-full bg-zinc-800 text-zinc-300 font-mono">
              {filteredPosts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === "chat"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]/50"
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>AI Social Analyst (Gemini)</span>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
              RAG Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab("keywords")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === "keywords"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]/50"
            }`}
          >
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Keywords & Scraper</span>
            <span className="px-1.5 py-0.5 text-[11px] rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
              {keywords.length} / {maxKeywords}
            </span>
          </button>
        </div>

        {/* Sentiment Quick Pill Overview - Clickable Filters */}
        <div className="hidden md:flex items-center gap-2 text-xs flex-wrap">
          <button
            id="pill-filter-positive"
            onClick={() => {
              setActiveTab("feed");
              setSelectedSentiment((prev) => (prev.toLowerCase() === "positive" ? "all" : "positive"));
              if (mediaFilter === "owned") setMediaFilter("all");
            }}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
              selectedSentiment.toLowerCase() === "positive"
                ? "text-emerald-300 bg-emerald-500/25 border-emerald-400 ring-2 ring-emerald-500/50 shadow-md shadow-emerald-500/20 font-bold scale-105"
                : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:scale-[1.03]"
            }`}
            title="Click to filter feed for Positive comments"
          >
            {selectedSentiment.toLowerCase() === "positive" && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            )}
            <span>Positive:</span>
            <strong>{sentimentCounts.pos}</strong>
          </button>

          <button
            id="pill-filter-neutral"
            onClick={() => {
              setActiveTab("feed");
              setSelectedSentiment((prev) => (prev.toLowerCase() === "neutral" ? "all" : "neutral"));
              if (mediaFilter === "owned") setMediaFilter("all");
            }}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
              selectedSentiment.toLowerCase() === "neutral"
                ? "text-zinc-200 bg-zinc-500/30 border-zinc-300 ring-2 ring-zinc-400/50 shadow-md font-bold scale-105"
                : "text-zinc-400 bg-zinc-500/10 border-zinc-500/20 hover:bg-zinc-500/20 hover:border-zinc-500/40 hover:scale-[1.03]"
            }`}
            title="Click to filter feed for Neutral comments"
          >
            {selectedSentiment.toLowerCase() === "neutral" && (
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 inline-block" />
            )}
            <span>Neutral:</span>
            <strong>{sentimentCounts.neu}</strong>
          </button>

          <button
            id="pill-filter-negative"
            onClick={() => {
              setActiveTab("feed");
              setSelectedSentiment((prev) => (prev.toLowerCase() === "negative" ? "all" : "negative"));
              if (mediaFilter === "owned") setMediaFilter("all");
            }}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
              selectedSentiment.toLowerCase() === "negative"
                ? "text-amber-300 bg-amber-500/25 border-amber-400 ring-2 ring-amber-500/50 shadow-md shadow-amber-500/20 font-bold scale-105"
                : "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 hover:scale-[1.03]"
            }`}
            title="Click to filter feed for Negative comments"
          >
            {selectedSentiment.toLowerCase() === "negative" && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
            )}
            <span>Negative:</span>
            <strong>{sentimentCounts.neg}</strong>
          </button>

          <button
            id="pill-filter-crisis"
            onClick={() => {
              setActiveTab("feed");
              setSelectedSentiment((prev) => (prev.toLowerCase() === "crisis" ? "all" : "crisis"));
              if (mediaFilter === "owned") setMediaFilter("all");
            }}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
              selectedSentiment.toLowerCase() === "crisis"
                ? "text-rose-200 bg-rose-500/30 border-rose-400 ring-2 ring-rose-500 shadow-md shadow-rose-500/30 font-bold scale-105"
                : "text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 hover:scale-[1.03]"
            } ${sentimentCounts.cri > 0 ? "animate-pulse" : ""}`}
            title="Click to filter feed for Crisis comments"
          >
            {selectedSentiment.toLowerCase() === "crisis" && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping inline-block" />
            )}
            <span>🚨 Crisis:</span>
            <strong>{sentimentCounts.cri}</strong>
          </button>

          <button
            id="pill-filter-audience"
            onClick={() => {
              setActiveTab("feed");
              setMediaFilter((prev) => (prev === "earned" ? "all" : "earned"));
            }}
            className={`px-2 py-1 rounded-md border text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
              mediaFilter === "earned"
                ? "text-sky-200 bg-sky-500/30 border-sky-400 ring-2 ring-sky-500/50 shadow-md shadow-sky-500/20 font-bold scale-105"
                : "text-sky-400 bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20 hover:border-sky-500/40 hover:scale-[1.03]"
            }`}
            title="Click to filter feed for real viewer and audience comments"
          >
            {mediaFilter === "earned" && (
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
            )}
            <span>👤 Audience:</span>
            <strong>{sentimentCounts.earned}</strong>
          </button>

          {sentimentCounts.owned > 0 && (
            <button
              id="pill-filter-owned"
              onClick={() => {
                setActiveTab("feed");
                setMediaFilter((prev) => (prev === "owned" ? "all" : "owned"));
              }}
              className={`px-2 py-1 rounded-md border text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                mediaFilter === "owned"
                  ? "text-orange-200 bg-orange-500/30 border-orange-400 ring-2 ring-orange-500/50 shadow-md shadow-orange-500/20 font-bold scale-105"
                  : "text-orange-400 bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/40 hover:scale-[1.03]"
              }`}
              title="Click to filter feed for brand / creator promotional posts"
            >
              {mediaFilter === "owned" && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
              )}
              <span>📢 Owned:</span>
              <strong>{sentimentCounts.owned}</strong>
            </button>
          )}

          {(selectedSentiment !== "all" || mediaFilter !== "all") && (
            <button
              id="pill-clear-filter"
              onClick={() => {
                setSelectedSentiment("all");
                setMediaFilter("all");
              }}
              className="text-[11px] text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
              title="Reset sentiment and media filters"
            >
              <span>✕</span>
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {/* ========================================================================= */}
        {/* TAB 1: LIVE SOCIAL FEED                                                   */}
        {/* ========================================================================= */}
        {activeTab === "feed" && (
          <div className="space-y-5">
            {/* Search & Filter Header */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search posts or enter any keyword (e.g. #kmkk)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim() && filteredPosts.length === 0) {
                      handleQuickScrape(searchQuery);
                    }
                  }}
                  className="w-full bg-[#18181b] border border-[#27272a] text-sm text-white rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs p-1"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap sm:flex-nowrap">
                {/* Keyword Filter */}
                <select
                  value={selectedKeyword}
                  onChange={(e) => setSelectedKeyword(e.target.value)}
                  className="bg-[#18181b] border border-[#27272a] text-xs text-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Keywords</option>
                  {keywords.map((kw) => (
                    <option key={kw.id} value={kw.keyword_string}>
                      {kw.keyword_string}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="bg-[#18181b] border border-[#27272a] text-xs text-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Platforms</option>
                  <option value="tiktok">TikTok</option>
                  <option value="reddit">Reddit</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">X / Twitter</option>
                  <option value="youtube">YouTube</option>
                </select>

                <select
                  value={selectedSentiment}
                  onChange={(e) => setSelectedSentiment(e.target.value)}
                  className="bg-[#18181b] border border-[#27272a] text-xs text-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Sentiments</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                  <option value="crisis">Crisis</option>
                </select>

                <select
                  value={mediaFilter}
                  onChange={(e) => setMediaFilter(e.target.value as any)}
                  className="bg-[#18181b] border border-[#27272a] text-xs text-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="all">All Content ({posts.length})</option>
                  <option value="earned">👤 Audience Comments ({sentimentCounts.earned})</option>
                  <option value="owned">📢 Owned Media / Promo ({sentimentCounts.owned})</option>
                </select>

                {isScraping ? (
                  <button
                    id="feed-stop-scraping-btn"
                    onClick={handleStopScrape}
                    disabled={isStoppingScrape}
                    className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-md shadow-rose-500/25 whitespace-nowrap animate-pulse"
                    title="Stop all active scrapers immediately"
                  >
                    {isStoppingScrape ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Square className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>Stop Scraping</span>
                  </button>
                ) : searchQuery.trim() ? (
                  <button
                    id="feed-quick-scrape-btn"
                    onClick={() => handleQuickScrape(searchQuery)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-md shadow-blue-500/25 whitespace-nowrap"
                    title={`Scrape & monitor "${searchQuery}" across all platforms`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
                    <span>Scrape "{searchQuery.length > 14 ? searchQuery.slice(0, 14) + '...' : searchQuery}"</span>
                  </button>
                ) : (
                  <button
                    id="feed-scrape-now-btn"
                    onClick={() => {
                      if (selectedKeyword !== "all") {
                        const kw = keywords.find(k => k.keyword_string.toLowerCase() === selectedKeyword.toLowerCase());
                        if (kw) return handleRunScrape(kw.id);
                      }
                      if (keywords[0]) handleRunScrape(keywords[0].id);
                    }}
                    disabled={keywords.length === 0}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Scrape Now</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active Filter Banner */}
            {(selectedSentiment !== "all" || mediaFilter !== "all" || selectedPlatform !== "all" || searchQuery) && (
              <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-[#18181b] border border-blue-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-zinc-400 font-medium">Filtering:</span>
                  {selectedSentiment !== "all" && (
                    <span className={`px-2.5 py-1 rounded-md font-bold uppercase tracking-wider text-[11px] border flex items-center gap-1.5 ${
                      selectedSentiment.toLowerCase() === "positive" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" :
                      selectedSentiment.toLowerCase() === "crisis" ? "bg-rose-500/25 text-rose-300 border-rose-500/50 animate-pulse" :
                      selectedSentiment.toLowerCase() === "negative" ? "bg-amber-500/20 text-amber-300 border-amber-500/40" :
                      "bg-zinc-500/20 text-zinc-300 border-zinc-500/40"
                    }`}>
                      <span>{selectedSentiment.toUpperCase()} Sentiment</span>
                      <span className="text-zinc-400 font-normal">({filteredPosts.length} comments)</span>
                      <button onClick={() => setSelectedSentiment("all")} className="hover:text-white ml-0.5 text-xs font-normal" title="Remove sentiment filter">✕</button>
                    </span>
                  )}
                  {mediaFilter !== "all" && (
                    <span className="px-2.5 py-1 rounded-md font-medium text-[11px] bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1.5">
                      <span>{mediaFilter === "earned" ? "👤 Audience Comments Only" : "📢 Owned Promotional Posts Only"}</span>
                      <button onClick={() => setMediaFilter("all")} className="hover:text-white ml-0.5 text-xs font-normal" title="Remove media filter">✕</button>
                    </span>
                  )}
                  {selectedPlatform !== "all" && (
                    <span className="px-2.5 py-1 rounded-md font-medium text-[11px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
                      <span>Platform: {selectedPlatform.toUpperCase()}</span>
                      <button onClick={() => setSelectedPlatform("all")} className="hover:text-white ml-0.5 text-xs font-normal">✕</button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-2.5 py-1 rounded-md font-medium text-[11px] bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1.5">
                      <span>Query: "{searchQuery}"</span>
                      <button onClick={() => setSearchQuery("")} className="hover:text-white ml-0.5 text-xs font-normal">✕</button>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {selectedSentiment !== "all" && (
                    <button
                      id="banner-ai-summarize-btn"
                      onClick={() => {
                        setActiveTab("chat");
                        handleSendChatMessage(
                          `Please analyze all ${selectedSentiment} comments in the dataset. What are the key topics, specific opinions, or user reactions being discussed?`
                        );
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-sm shadow-indigo-500/25 whitespace-nowrap cursor-pointer"
                      title="Ask Gemini to synthesize what these comments are about"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask AI: What are these {selectedSentiment.toUpperCase()} comments about?</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedSentiment("all");
                      setMediaFilter("all");
                      setSelectedPlatform("all");
                      setSearchQuery("");
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Posts Grid */}
            {isLoadingPosts ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
                <p className="text-sm">Loading real scraped posts from database...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-[#121215] border border-[#27272a] rounded-xl p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-zinc-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  {searchQuery ? `No posts found for "${searchQuery}"` : "No posts found"}
                </h3>
                <p className="text-xs text-zinc-400 max-w-lg mx-auto mb-5 leading-relaxed">
                  {searchQuery
                    ? `"${searchQuery}" hasn't been scraped yet, or no social mentions match your active filters. Click below to launch live Apify scrapers across TikTok, Reddit, Instagram, X, and YouTube!`
                    : selectedPlatform !== "all" || selectedSentiment !== "all" || selectedKeyword !== "all"
                    ? "No posts match your selected filters. Try clearing your filters or search query."
                    : "No social data has been scraped yet. Add a keyword in the Keywords tab and run a scrape!"}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {isScraping ? (
                    <button
                      id="empty-state-stop-scraping-btn"
                      onClick={handleStopScrape}
                      disabled={isStoppingScrape}
                      className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-rose-500/25 transition-all animate-pulse"
                    >
                      {isStoppingScrape ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Square className="w-4 h-4 fill-current" />
                      )}
                      <span>Stop Scraping</span>
                    </button>
                  ) : searchQuery ? (
                    <button
                      onClick={() => handleQuickScrape(searchQuery)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-blue-500/25 transition-all"
                    >
                      <Zap className="w-4 h-4 fill-current text-yellow-300" />
                      <span>Scrape & Ingest "{searchQuery}" Across All Platforms</span>
                    </button>
                  ) : keywords.length > 0 ? (
                    <button
                      onClick={() => handleRunScrape(keywords[0].id)}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Run Scrape for "{keywords[0].keyword_string}"
                    </button>
                  ) : null}

                  {(searchQuery || selectedPlatform !== "all" || selectedSentiment !== "all" || selectedKeyword !== "all" || mediaFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedPlatform("all");
                        setSelectedSentiment("all");
                        setSelectedKeyword("all");
                        setMediaFilter("all");
                      }}
                      className="text-xs text-zinc-400 hover:text-white px-3.5 py-2 rounded-lg border border-[#27272a] hover:bg-zinc-800/60 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPosts.map((post) => {
                  const plat = PLATFORM_CONFIG[post.platform] || PLATFORM_CONFIG.unknown;
                  const sentimentColor =
                    post.sentiment === "Positive"
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      : post.sentiment === "Crisis"
                      ? "text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse font-bold"
                      : post.sentiment === "Negative"
                      ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                      : "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";

                  return (
                    <div
                      key={post.id}
                      className="bg-[#121215] hover:bg-[#151518] border border-[#27272a] hover:border-zinc-700 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 group shadow-sm"
                    >
                      <div>
                        {/* Header: Platform, Keyword, Media Badge, Sentiment */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${plat.bg} ${plat.color}`}>
                              {plat.label}
                            </span>
                            <span className="text-[11px] text-zinc-400 bg-[#18181b] border border-[#27272a] px-2 py-0.5 rounded-md">
                              #{post.keyword}
                            </span>
                            {post.is_owned_media ? (
                              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center gap-1" title="Brand / creator self-promotional content">
                                📢 Owned Media
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md border border-sky-500/30 bg-sky-500/10 text-sky-300 flex items-center gap-1" title="Real viewer / audience reaction">
                                👤 Viewer Comment
                              </span>
                            )}
                          </div>

                          <span className={`px-2.5 py-0.5 text-[11px] rounded-md border font-medium ${sentimentColor}`}>
                            {post.sentiment}
                          </span>
                        </div>

                        {/* Author & Date */}
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2.5">
                          <span className="font-semibold text-zinc-200">{post.author}</span>
                          {post.handle && <span className="text-zinc-500">{post.handle}</span>}
                          <span>•</span>
                          <span className="text-zinc-500">
                            {new Date(post.timestamp).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>

                        {/* Clean Decoded Content */}
                        <div className="relative">
                          <p className={`text-sm text-zinc-200 leading-relaxed break-words ${
                            expandedPostIds.has(post.id) ? "" : "line-clamp-5"
                          }`}>
                            {post.content}
                          </p>
                          {post.content.length > 200 && (
                            <button
                              onClick={() => toggleExpandPost(post.id)}
                              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium mt-1 flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>{expandedPostIds.has(post.id) ? "Show less" : "Read full comment"}</span>
                              {expandedPostIds.has(post.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Footer: Metrics & Actions */}
                      <div className="mt-4 pt-3 border-t border-[#27272a]/60 flex items-center justify-between text-xs text-zinc-400">
                        <div className="flex items-center gap-3">
                          {post.engagement.likes > 0 && (
                            <span className="flex items-center gap-1 hover:text-zinc-200">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{post.engagement.likes.toLocaleString()}</span>
                            </span>
                          )}
                          {post.engagement.comments > 0 && (
                            <span className="flex items-center gap-1 hover:text-zinc-200">
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{post.engagement.comments.toLocaleString()}</span>
                            </span>
                          )}
                          {post.engagement.shares > 0 && (
                            <span className="flex items-center gap-1 hover:text-zinc-200">
                              <Share2 className="w-3.5 h-3.5" />
                              <span>{post.engagement.shares.toLocaleString()}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setInspectingPost(post)}
                            className="text-[11px] text-zinc-400 hover:text-white hover:bg-zinc-800/80 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                            title="Inspect full comment details and sentiment context"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Inspect</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab("chat");
                              handleSendChatMessage(`What is the sentiment and context behind this post: "${post.content.slice(0, 150)}..."?`);
                            }}
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Ask AI</span>
                          </button>

                          {post.url && post.url !== "#" && (
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
                              title="View Original Post"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AI SOCIAL ANALYST (GEMINI CHATBOT)                                 */}
        {/* ========================================================================= */}
        {activeTab === "chat" && (
          <div className="bg-[#121215] border border-[#27272a] rounded-xl flex flex-col h-[76vh] overflow-hidden shadow-xl">
            {/* Chatbot Header */}
            <div className="px-6 py-3.5 border-b border-[#27272a] bg-[#18181b]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    Gemini Social Analyst
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Grounded on {posts.length} Live Records
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">Trained on your real scraped social media database</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Strict Target Keyword Selector for Chat */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] border border-indigo-500/30 text-xs shadow-sm">
                  <span className="text-indigo-300 font-medium">Analyzing Keyword:</span>
                  <select
                    value={selectedKeyword}
                    onChange={(e) => {
                      setSelectedKeyword(e.target.value);
                      setCurrentFocusTopic("");
                    }}
                    className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-1"
                  >
                    {keywords.map((k) => (
                      <option key={k.id} value={k.keyword_string} className="bg-[#18181b] text-white">
                        #{k.keyword_string}
                      </option>
                    ))}
                    <option value="all" className="bg-[#18181b] text-white">All Keywords</option>
                  </select>
                </div>

                {currentFocusTopic && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-300">
                    <Target className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Focus: <strong className="text-white">{currentFocusTopic}</strong></span>
                    <button
                      onClick={() => setCurrentFocusTopic("")}
                      className="text-zinc-400 hover:text-white ml-1 p-0.5 hover:bg-zinc-700/50 rounded transition-colors cursor-pointer"
                      title="Clear topic focus"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Ready to Answer</span>
                </div>
              </div>
            </div>

            {/* Chat Message History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-indigo-600/30 text-indigo-400 border border-indigo-500/30"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`rounded-xl p-4 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-[#18181b] border border-[#27272a] text-zinc-200 rounded-tl-none shadow-md"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                    ) : (
                      <CleanMarkdownRenderer content={msg.text} />
                    )}

                    {/* Interactive Topic Chooser Pills */}
                    {msg.topicOptions && msg.topicOptions.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-zinc-700/50">
                        <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium mb-2.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Detected distinct topics. Click to focus your research:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.topicOptions.map((topic, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setCurrentFocusTopic(topic);
                                handleSendChatMessage(`Focus analysis strictly on: "${topic}". Filter out all unrelated noise.`);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/40 text-xs text-indigo-200 hover:text-white transition-all cursor-pointer group shadow-sm"
                            >
                              <span>🎯 {topic}</span>
                              <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-2.5 pt-2 border-t border-zinc-700/40 flex items-center justify-between text-[10px] text-zinc-400">
                      <span>{msg.timestamp}</span>
                      {msg.referencedCount !== undefined && (
                        <span className="text-indigo-400 font-medium">
                          Analyzed {msg.referencedCount} live posts
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex gap-3 max-w-2xl mr-auto">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-[#18181b] border border-[#27272a] rounded-xl rounded-tl-none p-3.5 text-xs text-zinc-400 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Gemini is reading your social media database and drafting insights...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Preset Question Chips */}
            <div className="px-6 py-2.5 bg-[#0e0e11] border-t border-[#27272a] flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-zinc-500 text-[11px] font-medium flex-shrink-0">Quick prompts:</span>
              <button
                onClick={() => handleSendChatMessage("Analyze audience and viewer sentiments only, detailing specific criticisms and frustrations while ignoring brand promotional copy.")}
                className="px-3 py-1 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 hover:text-white transition-colors flex-shrink-0 font-medium"
              >
                👤 Audience Criticisms (Ignore Promo)
              </button>
              <button
                onClick={() => handleSendChatMessage("Summarize the top complaints and sentiment breakdown across all platforms.")}
                className="px-3 py-1 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-zinc-300 hover:text-white transition-colors flex-shrink-0"
              >
                Summarize Complaints & Sentiment
              </button>
              <button
                onClick={() => handleSendChatMessage("What are people specifically discussing on Reddit vs TikTok?")}
                className="px-3 py-1 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-zinc-300 hover:text-white transition-colors flex-shrink-0"
              >
                Reddit vs TikTok Comparison
              </button>
              <button
                onClick={() => handleSendChatMessage("Are there any urgent PR crisis threats or boycott signals in the data?")}
                className="px-3 py-1 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-zinc-300 hover:text-white transition-colors flex-shrink-0"
              >
                Check Crisis Signals
              </button>
              <button
                onClick={() => handleSendChatMessage("Draft an executive holding statement addressing customer grievances.")}
                className="px-3 py-1 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-zinc-300 hover:text-white transition-colors flex-shrink-0"
              >
                Draft PR Response
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-[#27272a] bg-[#121215]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask Gemini to analyze comments, summarize feedback, or draft responses..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isChatLoading}
                  className="flex-1 bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: KEYWORDS & SCRAPER                                                 */}
        {/* ========================================================================= */}
        {activeTab === "keywords" && (
          <div className="space-y-6">
            {/* Commercial B2B Plan & Quota Card */}
            <div className="bg-gradient-to-r from-blue-950/20 via-[#121215] to-[#18181b] border border-[#27272a] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Commercial B2B Plan: Active</h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Enterprise Quota Enforced
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Your organization is subscribed to the <strong>Enterprise Market Intelligence Tier</strong>. Each tracked brand term collects up to 100 posts per platform across TikTok, Instagram, Reddit, X, and YouTube with strict single-keyword concurrency and isolation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-shrink-0">
                <div className="text-left sm:text-right">
                  <div className="text-xs text-zinc-400">Quota Allocation</div>
                  <div className="text-base font-bold text-white font-mono">
                    <span className={keywords.length >= maxKeywords ? "text-amber-400" : "text-emerald-400"}>
                      {keywords.length} / {maxKeywords} Keywords
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-[#18181b] border-[#27272a] text-zinc-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Commercial License</span>
                </div>
              </div>
            </div>

            {/* Add Keyword Form */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Add New Tracked Keyword</h3>
                <span className="text-[11px] text-zinc-400 bg-[#18181b] border border-[#27272a] px-2.5 py-0.5 rounded-full font-medium">
                  {maxKeywords - keywords.length} slot(s) remaining
                </span>
              </div>

              <form onSubmit={handleAddKeyword} className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Keyword / Hashtag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. #kmkk or Horizon EV"
                      value={newKeywordInput}
                      onChange={(e) => setNewKeywordInput(e.target.value)}
                      disabled={isAddingKeyword || keywords.length >= maxKeywords}
                      className="w-full bg-[#18181b] border border-[#27272a] text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-500 disabled:opacity-50"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Target Topic Focus (Optional Context)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kolej Matrikulasi Kejuruteraan Kedah"
                      value={newTopicContextInput}
                      onChange={(e) => setNewTopicContextInput(e.target.value)}
                      disabled={isAddingKeyword || keywords.length >= maxKeywords}
                      className="w-full bg-[#18181b] border border-[#27272a] text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors placeholder-zinc-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newKeywordInput.trim() || isAddingKeyword || keywords.length >= maxKeywords}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm cursor-pointer"
                  >
                    {isAddingKeyword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span>Add Tracked Keyword</span>
                  </button>
                </div>
              </form>

              {keywordError && (
                <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{keywordError}</span>
                </div>
              )}

              {keywords.length >= maxKeywords && (
                <div className="mt-3 flex items-center justify-between bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-xs text-amber-300">
                  <span>⚠️ Commercial Quota Limit Reached ({maxKeywords}/{maxKeywords} active keywords). To monitor additional brands or competitors, deactivate an unused keyword below or contact your account representative to upgrade your plan.</span>
                </div>
              )}
            </div>

            {/* Active Keywords List */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#27272a] flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Active Monitored Keywords</h3>
                <div className="flex items-center gap-3">
                  {isScraping && (
                    <button
                      id="keywords-stop-all-scraping-btn"
                      onClick={handleStopScrape}
                      disabled={isStoppingScrape}
                      className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors shadow-sm animate-pulse cursor-pointer"
                      title="Stop all active scraping tasks"
                    >
                      {isStoppingScrape ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5 fill-current" />}
                      <span>Stop All Scraping</span>
                    </button>
                  )}
                  <span className="text-xs text-zinc-400">{keywords.length} active</span>
                </div>
              </div>

              {keywords.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500">
                  No keywords tracked yet. Enter a brand keyword above to start scraping!
                </div>
              ) : (
                <div className="divide-y divide-[#27272a]">
                  {keywords.map((kw) => (
                    <div key={kw.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#151518] transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-white text-sm">{kw.keyword_string}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                          {kw.topic_context && (
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 font-medium">
                              <Target className="w-3 h-3 text-indigo-400" />
                              <span>Focus: {kw.topic_context}</span>
                            </span>
                          )}
                        </div>

                        {editingKeywordId === kw.id ? (
                          <div className="mt-2 flex items-center gap-2 max-w-md">
                            <input
                              type="text"
                              value={editingContextText}
                              onChange={(e) => setEditingContextText(e.target.value)}
                              placeholder="e.g. Kolej Matrikulasi Kejuruteraan Kedah"
                              className="flex-1 bg-[#18181b] border border-indigo-500/50 text-xs text-white rounded px-2.5 py-1.5 focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateKeywordContext(kw.id, editingContextText)}
                              className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              title="Save topic focus"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditingKeywordId(null)}
                              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                            <span>Platforms: TikTok, Reddit, Instagram, X, YouTube</span>
                            <button
                              onClick={() => {
                                setEditingKeywordId(kw.id);
                                setEditingContextText(kw.topic_context || "");
                              }}
                              className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
                              title="Set or edit topic disambiguation context"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{kw.topic_context ? "Edit Focus" : "+ Add Topic Focus"}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isScraping ? (
                          currentScrapingKeyword?.keyword_id === kw.id ? (
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold px-2.5 py-1.5 rounded-lg animate-pulse">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Scraping Live...</span>
                              </span>
                              <button
                                onClick={handleStopScrape}
                                disabled={isStoppingScrape}
                                className="flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Stop active scraping"
                              >
                                {isStoppingScrape ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 fill-current text-rose-400" />
                                )}
                                <span>Stop</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              disabled={true}
                              className="flex items-center gap-1.5 bg-zinc-800/60 text-zinc-500 border border-zinc-700/40 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-not-allowed opacity-60"
                              title={`Scrape busy: Currently scraping '${currentScrapingKeyword?.keyword_string || "another keyword"}'. Only 1 keyword can be scraped at a time.`}
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Scrape Busy (1 at a time)</span>
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => handleRunScrape(kw.id)}
                            className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Run Scrape</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteKeyword(kw.id)}
                          disabled={isScraping && currentScrapingKeyword?.keyword_id === kw.id}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-40"
                          title="Delete keyword"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Comment Details & Sentiment Inspection Modal */}
      {inspectingPost && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setInspectingPost(null)}
        >
          <div
            className="bg-[#121215] border border-[#27272a] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#27272a]">
              <div className="flex items-center gap-2 flex-wrap">
                {(() => {
                  const plat = PLATFORM_CONFIG[inspectingPost.platform] || PLATFORM_CONFIG.unknown;
                  return (
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${plat.bg} ${plat.color}`}>
                      {plat.label}
                    </span>
                  );
                })()}
                <span className="text-xs text-zinc-400 bg-[#18181b] border border-[#27272a] px-2.5 py-1 rounded-md font-mono">
                  #{inspectingPost.keyword}
                </span>
                {inspectingPost.is_owned_media ? (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center gap-1">
                    📢 Owned Media
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md border border-sky-500/30 bg-sky-500/10 text-sky-300 flex items-center gap-1">
                    👤 Viewer Comment
                  </span>
                )}
                <span
                  className={`px-3 py-1 text-xs font-bold uppercase rounded-md border tracking-wider ${
                    inspectingPost.sentiment.toLowerCase() === "positive"
                      ? "text-emerald-300 bg-emerald-500/20 border-emerald-500/40"
                      : inspectingPost.sentiment.toLowerCase() === "crisis"
                      ? "text-rose-300 bg-rose-500/25 border-rose-500/50 animate-pulse"
                      : inspectingPost.sentiment.toLowerCase() === "negative"
                      ? "text-amber-300 bg-amber-500/20 border-amber-500/40"
                      : "text-zinc-300 bg-zinc-500/20 border-zinc-500/40"
                  }`}
                >
                  {inspectingPost.sentiment} Sentiment
                </span>
              </div>

              <button
                onClick={() => setInspectingPost(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-between gap-2 mt-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 font-bold">
                  {inspectingPost.author.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-zinc-200 text-sm block">{inspectingPost.author}</span>
                  {inspectingPost.handle && <span className="text-zinc-500 text-xs">{inspectingPost.handle}</span>}
                </div>
              </div>
              <span className="text-zinc-500">
                {new Date(inspectingPost.timestamp).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short"
                })}
              </span>
            </div>

            {/* Comment Body */}
            <div className="mt-4 p-4 rounded-xl bg-[#18181b] border border-[#27272a]">
              <p className="text-base text-zinc-100 leading-relaxed break-words whitespace-pre-wrap selection:bg-blue-600 selection:text-white">
                "{inspectingPost.content}"
              </p>
            </div>

            {/* Sentiment Context & Guidance */}
            <div className="mt-4">
              {inspectingPost.sentiment.toLowerCase() === "crisis" && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <strong className="font-bold block text-rose-200">High PR Risk / Crisis Escalation</strong>
                    <span>This comment contains negative sentiment with high viral or reputational hazard signals. Prompt response or crisis monitoring is advised.</span>
                  </div>
                </div>
              )}
              {inspectingPost.sentiment.toLowerCase() === "positive" && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <strong className="font-bold block text-emerald-200">Organic Customer Advocacy</strong>
                    <span>This comment highlights genuine praise, satisfaction, or positive sentiment from viewers/audiences.</span>
                  </div>
                </div>
              )}
              {inspectingPost.sentiment.toLowerCase() === "negative" && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <strong className="font-bold block text-amber-200">Customer Pain Point / Criticism</strong>
                    <span>This comment reflects user dissatisfaction or critique regarding the topic or product.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Engagement Stats */}
            <div className="mt-4 flex items-center gap-6 text-xs text-zinc-400 pt-3 border-t border-[#27272a]">
              <span className="flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 text-zinc-500" />
                <span>Likes: <strong className="text-zinc-200">{inspectingPost.engagement.likes.toLocaleString()}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-zinc-500" />
                <span>Comments / Replies: <strong className="text-zinc-200">{inspectingPost.engagement.comments.toLocaleString()}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-zinc-500" />
                <span>Shares: <strong className="text-zinc-200">{inspectingPost.engagement.shares.toLocaleString()}</strong></span>
              </span>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-[#27272a]">
              <button
                onClick={() => {
                  const queryText = `Analyze why this comment is categorized as ${inspectingPost.sentiment} sentiment and explain what audience issue or praise it represents: "${inspectingPost.content.slice(0, 180)}..."`;
                  setInspectingPost(null);
                  setActiveTab("chat");
                  handleSendChatMessage(queryText);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask Gemini AI to Analyze This Comment</span>
              </button>

              <div className="flex items-center gap-2">
                {inspectingPost.url && inspectingPost.url !== "#" && (
                  <a
                    href={inspectingPost.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
                  >
                    <span>View Post</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setInspectingPost(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white border border-[#27272a] hover:bg-zinc-800/60 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
