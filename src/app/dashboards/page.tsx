"use client";

import { useEffect, useState, useCallback } from "react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
  createdAt: string;
}

// ─── Date helpers ────────────────────────────────────────────────────────────

function getWeekBounds(offsetWeeks: number) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon + offsetWeeks * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

function formatDateShort(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatDateFull(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDayLabel(d: Date) {
  return d.toLocaleDateString("en-IN", { weekday: "short" });
}

// ─── CSV export ──────────────────────────────────────────────────────────────

function sanitizeCSVField(value: string) {
  let val = (value ?? "").trim();
  // CSV Injection prevention (Formula Injection)
  // If the field starts with =, +, -, @, prefix it with a single quote '
  if (/^[=\+\-@]/.test(val)) {
    val = `'${val}`;
  }
  // Standard CSV escaping: wrap in quotes if it contains separator, quote, or newline
  if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
    val = `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function exportCSV(contacts: Contact[], weekLabel: string) {
  const header = ["Name", "Email", "Company", "Phone", "Message", "Date"];
  const rows = contacts.map((c) => [
    sanitizeCSVField(c.name),
    sanitizeCSVField(c.email),
    sanitizeCSVField(c.company ?? ""),
    sanitizeCSVField(c.phone ?? ""),
    sanitizeCSVField(c.message ?? ""),
    sanitizeCSVField(formatDateFull(c.createdAt)),
  ]);
  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `voxora-leads-${weekLabel.replace(/\s/g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────

function BarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex justify-between items-end h-[150px] pt-6 gap-1 sm:gap-3">
      {data.map((d) => {
        const barHeightPct = (d.count / max) * 100;
        return (
          <div
            key={d.label}
            className="flex flex-col items-center flex-grow flex-shrink basis-0 min-w-0 relative"
          >
            {/* Bar Track & Fill Container */}
            <div className="w-full max-w-[32px] h-[140px] relative bg-muted rounded-md flex items-end">
              {/* Count Label */}
              {d.count > 0 && (
                <span 
                  className="absolute left-1/2 -translate-x-1/2 text-[11px] font-semibold text-foreground font-sans whitespace-nowrap"
                  style={{ bottom: `calc(${barHeightPct}% + 6px)` }}
                >
                  {d.count}
                </span>
              )}

              {/* Bar Fill */}
              {d.count > 0 && (
                <div 
                  className="w-full bg-foreground opacity-85 rounded-md"
                  style={{ height: `${barHeightPct}%` }}
                />
              )}
            </div>

            {/* Day Label */}
            <span className="mt-2 text-[11px] text-muted-foreground font-sans">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: { dir: "up" | "down" | "neutral"; pct: number };
}) {
  const trendColor =
    trend?.dir === "up"
      ? "text-emerald-400"
      : trend?.dir === "down"
        ? "text-destructive"
        : "text-muted-foreground";
  const trendIcon =
    trend?.dir === "up" ? "▲" : trend?.dir === "down" ? "▼" : "—";

  return (
    <div className="bg-card border border-border rounded-xl p-5 sm:p-6 flex-grow flex-shrink basis-0 min-w-0">
      <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">
        {label}
      </p>
      <p className="text-3xl sm:text-4xl font-bold text-foreground mb-1.5 leading-none">
        {value}
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        {trend && (
          <span className={`text-xs font-semibold ${trendColor}`}>
            {trendIcon} {trend.pct}%
          </span>
        )}
        {sub && (
          <span className="text-xs text-muted-foreground">
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/contacts", { credentials: "include" });
      if (!res.ok) {
        throw new Error(`Failed to load data (Status ${res.status})`);
      }
      const data = await res.json();
      setAllContacts(data.contacts ?? []);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err?.message || "An unexpected error occurred while loading dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { start, end } = getWeekBounds(weekOffset);
  const prevWeek = getWeekBounds(weekOffset - 1);

  const thisWeekLeads = allContacts.filter((c) => {
    const d = new Date(c.createdAt);
    return d >= start && d <= end;
  });

  const lastWeekLeads = allContacts.filter((c) => {
    const d = new Date(c.createdAt);
    return d >= prevWeek.start && d <= prevWeek.end;
  });

  // Trend
  const thisCount = thisWeekLeads.length;
  const lastCount = lastWeekLeads.length;
  let trendDir: "up" | "down" | "neutral" = "neutral";
  let trendPct = 0;
  if (lastCount > 0) {
    trendPct = Math.round(((thisCount - lastCount) / lastCount) * 100);
    trendDir = trendPct > 0 ? "up" : trendPct < 0 ? "down" : "neutral";
  } else if (thisCount > 0) {
    trendPct = 100;
    trendDir = "up";
  }

  // Bar chart: Mon–Sun
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const count = thisWeekLeads.filter((c) => {
      const d = new Date(c.createdAt);
      return (
        d.getDate() === day.getDate() &&
        d.getMonth() === day.getMonth() &&
        d.getFullYear() === day.getFullYear()
      );
    }).length;
    return { label: getDayLabel(day), count };
  });

  const weekLabel = `${formatDateShort(start)} – ${formatDateShort(end)}`;
  const isCurrentWeek = weekOffset === 0;

  return (
    <div className="p-3.5 sm:p-10 pb-24 max-w-[1100px] w-full mx-auto font-sans box-border">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 sm:mb-10 gap-6">
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">
            Weekly Report
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {isCurrentWeek ? "This Week" : weekLabel}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isCurrentWeek ? weekLabel : `Week of ${weekLabel}`}
          </p>
        </div>

        {/* Week navigator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="bg-muted border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-foreground cursor-pointer transition-colors duration-150 hover:bg-accent font-sans"
          >
            ← Prev
          </button>
          {!isCurrentWeek && (
            <button
              onClick={() => setWeekOffset(0)}
              className="bg-transparent border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-muted-foreground cursor-pointer transition-colors duration-150 hover:text-foreground hover:bg-muted font-sans"
            >
              Today
            </button>
          )}
          <button
            onClick={() => setWeekOffset((o) => Math.min(o + 1, 0))}
            disabled={isCurrentWeek}
            className={`border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm font-sans transition-colors duration-150 ${
              isCurrentWeek
                ? "bg-muted/40 text-muted-foreground cursor-not-allowed opacity-40"
                : "bg-muted text-foreground cursor-pointer hover:bg-accent"
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-card border border-destructive rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
          {/* Error Icon */}
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1.5">
              Unable to load Dashboard Data
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {error}
            </p>
          </div>
          <button
            onClick={fetchData}
            className="bg-foreground text-background border-none rounded-lg px-5 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer transition-opacity duration-150 hover:opacity-90 font-sans"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="This Week"
              value={loading ? "—" : thisCount}
              trend={loading ? undefined : { dir: trendDir, pct: Math.abs(trendPct) }}
              sub="vs last week"
            />
            <StatCard
              label="Last Week"
              value={loading ? "—" : lastCount}
              sub="leads captured"
            />
            <StatCard
              label="All Time"
              value={loading ? "—" : allContacts.length}
              sub="total leads"
            />
          </div>

          {/* ── Bar chart ── */}
          <div className="bg-card border border-border rounded-xl p-5 sm:p-7 pb-5 mb-6 overflow-hidden">
            <p className="text-sm font-semibold text-foreground mb-10">
              Daily Activity
            </p>
            {loading ? (
              <div className="h-[148px] flex items-center justify-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Loading…</span>
              </div>
            ) : (
              <BarChart data={chartData} />
            )}
          </div>

          {/* ── This week's leads ── */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="p-5 sm:px-6 border-b border-border flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-0.5">
                  {isCurrentWeek ? "This Week's Leads" : "Week's Leads"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {loading ? "Loading…" : `${thisCount} contact${thisCount !== 1 ? "s" : ""}`}
                </p>
              </div>
              {thisCount > 0 && (
                <button
                  onClick={() => exportCSV(thisWeekLeads, weekLabel)}
                  className="bg-transparent border border-border rounded-lg px-3.5 py-1.5 text-xs font-semibold text-foreground cursor-pointer transition-colors duration-150 hover:bg-muted hover:border-ring flex items-center gap-1.5 font-sans"
                >
                  ↓ Export CSV
                </button>
              )}
            </div>

            {/* Leads list */}
            {loading ? (
              <div className="p-12 text-center text-muted-foreground text-xs sm:text-sm">
                Loading leads…
              </div>
            ) : thisWeekLeads.length === 0 ? (
              <div className="p-14 text-center">
                <p className="text-sm sm:text-base font-semibold text-foreground mb-1.5">
                  No leads this week
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {isCurrentWeek
                    ? "New leads will appear here as they come in."
                    : "No leads were captured during this week."}
                </p>
              </div>
            ) : (
              <div>
                {thisWeekLeads.map((c, i) => (
                  <div
                    key={c._id}
                    className={`flex items-start sm:items-center gap-3 sm:gap-4 p-4 sm:px-6 transition-colors duration-100 ${
                      i < thisWeekLeads.length - 1 ? "border-b border-border" : ""
                    } hover:bg-muted`}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs sm:text-sm font-semibold text-foreground flex-shrink-0">
                      {(c.name || c.email || "?")[0].toUpperCase()}
                    </div>

                    {/* Content Group */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                      {/* Name + email */}
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                          {c.name || "Unknown"}
                        </p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                          {c.email}
                        </p>
                      </div>

                      {/* Company & Date */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {c.company && (
                          <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground bg-muted border border-border rounded px-2 py-0.5 truncate max-w-[100px] sm:max-w-none">
                            {c.company}
                          </span>
                        )}
                        <span className="text-[10px] sm:text-[11px] text-muted-foreground whitespace-nowrap">
                          {formatDateFull(c.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
