import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "SocialSense AI — Admin & Tenant Console",
  description: "Enterprise tenant management, provisioning, and monitoring portal.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased"
      style={{
        backgroundColor: "#09090b",
        color: "#f4f4f5",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
