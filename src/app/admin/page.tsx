"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Key,
  Lock,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  Users,
  Layers,
  ArrowRight,
  RefreshCw,
  LogOut,
  ExternalLink,
  AlertCircle,
  EyeOff,
  Sparkles,
  Ban,
  CheckCircle2,
  X
} from "lucide-react";

interface AssignedKeyword {
  id: string;
  keyword_string: string;
  topic_context?: string;
  is_active: boolean;
  created_at?: string;
}

interface ClientWorkspace {
  id: string;
  name: string;
  billing_status: string;
  max_keywords: number;
  active_keywords_count: number;
  created_at?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    is_active: boolean;
  } | null;
  assigned_keywords: AssignedKeyword[];
}

let API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

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
    }
  } catch {}
}

export default function AdminMonitorPortal() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Data states
  const [clients, setClients] = useState<ClientWorkspace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Provisioning Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [boughtKeyword, setBoughtKeyword] = useState<string>("");
  const [topicContext, setTopicContext] = useState<string>("");
  const [maxKeywords, setMaxKeywords] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Success provision result
  const [provisionSuccess, setProvisionSuccess] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Auto-check stored admin key on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("socialsense_admin_key");
      if (stored) {
        setAdminKey(stored);
        verifyAndFetch(stored);
      }
    } catch {}
  }, []);

  const verifyAndFetch = async (key: string) => {
    setIsVerifying(true);
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify`, {
        method: "POST",
        headers: { "x-admin-key": key.trim() }
      });
      if (res.ok) {
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem("socialsense_admin_key", key.trim());
        } catch {}
        await fetchClients(key.trim());
      } else {
        setIsAuthenticated(false);
        setAuthError("Invalid Admin Master Password. Access denied.");
      }
    } catch (err: any) {
      setAuthError(`Unable to reach backend at ${API_BASE}. Ensure backend is running.`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    verifyAndFetch(adminKey.trim());
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setAdminKey("");
    try {
      sessionStorage.removeItem("socialsense_admin_key");
    } catch {}
  };

  const fetchClients = async (keyToUse?: string) => {
    const k = keyToUse || adminKey;
    if (!k) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/clients`, {
        headers: { "x-admin-key": k.trim() }
      });
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let generated = "";
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated + "!");
  };

  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!companyName.trim() || !email.trim() || !password.trim() || !boughtKeyword.trim()) {
      setFormError("All required fields must be filled.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/provision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim()
        },
        body: JSON.stringify({
          company_name: companyName.trim(),
          email: email.trim(),
          password: password.trim(),
          bought_keyword: boughtKeyword.trim(),
          topic_context: topicContext.trim(),
          max_keywords: Number(maxKeywords) || 1
        })
      });

      const data = await res.json();
      if (res.ok) {
        setProvisionSuccess(data);
        // Reset form
        setCompanyName("");
        setEmail("");
        setPassword("");
        setBoughtKeyword("");
        setTopicContext("");
        setMaxKeywords(1);
        await fetchClients();
      } else {
        setFormError(data.detail || "Failed to provision client workspace.");
      }
    } catch (err: any) {
      setFormError(`Server error: ${err.message || "Failed to reach backend."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (companyId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const res = await fetch(`${API_BASE}/api/admin/clients/${companyId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim()
        },
        body: JSON.stringify({ billing_status: newStatus })
      });
      if (res.ok) {
        await fetchClients();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteClient = async (companyId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete client workspace "${name}"? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/clients/${companyId}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey.trim() }
      });
      if (res.ok) {
        await fetchClients();
      }
    } catch (err) {
      console.error("Failed to delete workspace:", err);
    }
  };

  const copyWelcomeTemplate = () => {
    if (!provisionSuccess) return;
    const loginUrl = window.location.origin;
    const text = `🎉 Welcome to SocialSense AI!

Here are your dedicated workspace login credentials:
🌐 Dashboard URL: ${loginUrl}
👤 Login Email: ${provisionSuccess.credentials.email}
🔑 Password: ${provisionSuccess.credentials.password}
🎯 Tracked Keyword: "${provisionSuccess.keyword.keyword_string}" (Plan: 1 Keyword)

Log in anytime to run real-time market research and AI competitor sentiment analysis!`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.user?.email || "").toLowerCase().includes(q) ||
      c.assigned_keywords.some((k) => k.keyword_string.toLowerCase().includes(q))
    );
  });

  const totalKeywords = clients.reduce((acc, c) => acc + c.assigned_keywords.length, 0);
  const activeClients = clients.filter((c) => c.billing_status === "active").length;

  // -------------------------------------------------------------------------
  // 1. Admin Authentication Screen
  // -------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121215] border border-[#27272a] rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">SocialSense Monitor</h1>
              <p className="text-xs text-zinc-400">Owner & Client Provisioning Portal</p>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Admin Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin password (default: admin2026!)"
                  className="w-full bg-[#18181b] border border-[#27272a] focus:border-blue-500 text-sm text-white rounded-xl pl-10 pr-3 py-2.5 outline-none transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-sm py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Master Key...</span>
                </>
              ) : (
                <>
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#27272a]/60 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Back to Client Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 2. Authenticated Admin Portal
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-[#27272a] bg-[#121215]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">SocialSense Admin Portal</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                Active Master Session
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Client Tenant Monitor & Keyword Provisioning</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#18181b] border border-[#27272a] text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Client Dashboard</span>
          </Link>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
            title="Log out of admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Zero-Knowledge Privacy Guarantee Banner */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-zinc-900/60 border border-emerald-500/20 rounded-2xl p-4 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-emerald-300">
                🔒 Zero-Knowledge Client Privacy Guarantee
              </h2>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                As owner/admin, you can provision client accounts and control which keyword they bought. 
                Client scraped social posts, competitor feeds, and private AI chat intelligence are 
                <strong className="text-zinc-200"> strictly excluded</strong> from this portal to preserve complete enterprise confidentiality.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#121215] border border-[#27272a] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Total Client Workspaces</p>
              <h3 className="text-2xl font-bold text-white mt-1">{clients.length}</h3>
              <p className="text-[10px] text-emerald-400 mt-1">● {activeClients} Active Subscriptions</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#121215] border border-[#27272a] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Tracked Bought Keywords</p>
              <h3 className="text-2xl font-bold text-white mt-1">{totalKeywords}</h3>
              <p className="text-[10px] text-indigo-400 mt-1">Strict 1 Keyword Plan Enforced</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#121215] border border-[#27272a] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Scraper Quota Security</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">100% Locked</h3>
              <p className="text-[10px] text-zinc-400 mt-1">Clients cannot scrape other keywords</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Action Header & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121215] border border-[#27272a] p-4 rounded-2xl">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by company name, client email, or keyword..."
              className="w-full bg-[#18181b] border border-[#27272a] focus:border-blue-500 text-xs text-white rounded-xl pl-9 pr-3 py-2 outline-none transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchClients()}
              disabled={isLoading}
              className="p-2 rounded-xl bg-[#18181b] border border-[#27272a] text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
            </button>

            <button
              onClick={() => {
                setFormError(null);
                setProvisionSuccess(null);
                generateRandomPassword();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Provision New Client & Keyword</span>
            </button>
          </div>
        </div>

        {/* Workspaces Table */}
        <div className="bg-[#121215] border border-[#27272a] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#27272a] bg-[#18181b]/50 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Company / Brand</th>
                  <th className="py-3 px-4">Client Login Email</th>
                  <th className="py-3 px-4">Bought Tracked Keyword</th>
                  <th className="py-3 px-4">Quota</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]/60 text-xs">
                {isLoading && clients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                      <span>Loading client workspaces...</span>
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-500">
                      <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30 text-zinc-400" />
                      <p className="text-zinc-400 font-medium">No client workspaces found</p>
                      <p className="text-[11px] text-zinc-600 mt-1">
                        Click "Provision New Client & Keyword" to onboard your first paying client.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => {
                    const primaryKw = client.assigned_keywords[0];
                    const isSuspended = client.billing_status === "suspended";

                    return (
                      <tr
                        key={client.id}
                        className="hover:bg-[#18181b]/40 transition-colors group"
                      >
                        {/* Company Name */}
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
                              {client.name?.[0] || "C"}
                            </div>
                            <div>
                              <span>{client.name}</span>
                              <p className="text-[10px] text-zinc-500 font-mono">
                                ID: {client.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-4 text-zinc-300 font-mono text-[11px]">
                          {client.user?.email || "No user attached"}
                        </td>

                        {/* Bought Keyword */}
                        <td className="py-3.5 px-4">
                          {primaryKw ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
                              <Lock className="w-3 h-3 text-blue-400" />
                              <span>"{primaryKw.keyword_string}"</span>
                            </div>
                          ) : (
                            <span className="text-zinc-500 italic text-[11px]">No keyword registered</span>
                          )}
                        </td>

                        {/* Quota */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[11px] font-mono border border-zinc-700">
                            {client.active_keywords_count} / {client.max_keywords} kw
                          </span>
                        </td>

                        {/* Billing Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              !isSuspended
                                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                                : "bg-rose-500/10 border-rose-500/25 text-rose-400"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${!isSuspended ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                            {isSuspended ? "Suspended" : "Active"}
                          </span>
                        </td>

                        {/* Created At */}
                        <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                          {client.created_at ? new Date(client.created_at).toLocaleDateString() : "—"}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(client.id, client.billing_status)}
                              className={`p-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                                !isSuspended
                                  ? "bg-zinc-800/80 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 border-zinc-700/60"
                                  : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              }`}
                              title={!isSuspended ? "Suspend client workspace" : "Reactivate client workspace"}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteClient(client.id, client.name)}
                              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700/60 hover:border-rose-500/30 transition-all cursor-pointer"
                              title="Delete client workspace"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------------- */}
      {/* Provisioning Modal */}
      {/* ------------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121215] border border-[#27272a] rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in duration-200">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Provision New Client Workspace</h3>
                  <p className="text-[11px] text-zinc-400">Add company & strictly lock to their bought keyword</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If Provisioned Successfully, show Ready-to-Send Template */}
            {provisionSuccess ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Client Workspace Successfully Created!</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    The client account is active. They can strictly track and scrape only their assigned keyword.
                  </p>
                </div>

                <div className="p-3.5 bg-[#18181b] border border-[#27272a] rounded-xl space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Company:</span>
                    <span className="text-white font-semibold">{provisionSuccess.company.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Email:</span>
                    <span className="text-blue-400">{provisionSuccess.credentials.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Password:</span>
                    <span className="text-emerald-400 font-bold">{provisionSuccess.credentials.password}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Bought Keyword:</span>
                    <span className="text-amber-400 font-semibold">"{provisionSuccess.keyword.keyword_string}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Keyword Limit:</span>
                    <span className="text-zinc-300">Locked to 1 Keyword</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyWelcomeTemplate}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Client Welcome Message</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setProvisionSuccess(null);
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Provision Form */
              <form onSubmit={handleProvisionSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Company / Client Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Nike Malaysia, Dyson, L'Oreal..."
                    className="w-full bg-[#18181b] border border-[#27272a] focus:border-blue-500 text-xs text-white rounded-xl px-3 py-2 outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Client Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. client@brand.com"
                      className="w-full bg-[#18181b] border border-[#27272a] focus:border-blue-500 text-xs text-white rounded-xl px-3 py-2 outline-none transition-all placeholder:text-zinc-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-zinc-300">Password *</label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Generate</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Client login password"
                      className="w-full bg-[#18181b] border border-[#27272a] focus:border-blue-500 text-xs text-white rounded-xl px-3 py-2 outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-blue-300 mb-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Bought Tracked Keyword (Strictly Locked) *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={boughtKeyword}
                      onChange={(e) => setBoughtKeyword(e.target.value)}
                      placeholder="e.g. nike, dyson supersonic, proton x50..."
                      className="w-full bg-[#18181b] border border-blue-500/30 focus:border-blue-400 text-xs text-white rounded-xl px-3 py-2 outline-none transition-all"
                    />
                    <p className="text-[10px] text-zinc-400 mt-1">
                      This is the <strong>only</strong> keyword this client will be permitted to track and scrape.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Topic Context (Optional)
                    </label>
                    <input
                      type="text"
                      value={topicContext}
                      onChange={(e) => setTopicContext(e.target.value)}
                      placeholder="e.g. Running shoes, activewear, marathon sponsors"
                      className="w-full bg-[#18181b] border border-[#27272a] focus:border-blue-500 text-xs text-white rounded-xl px-3 py-2 outline-none transition-all placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Provisioning...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Provision & Lock Keyword</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
