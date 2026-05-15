import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users as UsersIcon,
  ClipboardList,
  CalendarDays,
  HandPlatter,
  Utensils,
  Star,
  Building2,
  ArrowRight,
} from "lucide-react";
import AdminShell, { ErrorState, Spinner } from "./AdminShell";
import { apiAdminGetStats } from "../../api";

const STAT_CARDS = [
  {
    key: "users",
    label: "Total Users",
    icon: UsersIcon,
    accent: "from-emerald-500 to-emerald-700",
  },
  {
    key: "orders",
    label: "Total Orders",
    icon: ClipboardList,
    accent: "from-cyan-500 to-cyan-700",
  },
  {
    key: "active_subscriptions",
    label: "Active Subscriptions",
    icon: CalendarDays,
    accent: "from-emerald-600 to-cyan-600",
  },
  {
    key: "pending_catering",
    label: "Pending Catering",
    icon: HandPlatter,
    accent: "from-amber-500 to-orange-500",
  },
];

const NAV_CARDS = [
  { to: "/admin/menu",          label: "Menu Items",    icon: Utensils,       desc: "Add, edit, or hide items." },
  { to: "/admin/orders",        label: "Orders",        icon: ClipboardList,  desc: "Track and update statuses." },
  { to: "/admin/catering",      label: "Catering",      icon: HandPlatter,    desc: "Quote and approve events." },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: CalendarDays,   desc: "Manage active plans." },
  { to: "/admin/reviews",       label: "Reviews",       icon: Star,           desc: "Moderate feedback." },
  { to: "/admin/corporate",     label: "Corporate Meals", icon: Building2,    desc: "Review program feedback." },
  { to: "/admin/users",         label: "Users",         icon: UsersIcon,      desc: "Roles and activation." },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiAdminGetStats();
      setStats(res.data || res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminShell title="Dashboard" subtitle="At-a-glance health of Fresh&Fit operations.">
      {loading && <Spinner label="Loading stats..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STAT_CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.key}
                  className="overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
                >
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent} text-white shadow`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{c.label}</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {stats[c.key] ?? 0}
                  </p>
                </div>
              );
            })}
          </div>

          <h2 className="mb-3 mt-10 text-lg font-bold text-slate-900">Manage</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NAV_CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.to}
                  onClick={() => navigate(c.to)}
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{c.label}</p>
                      <p className="text-xs text-slate-500">{c.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" />
                </button>
              );
            })}
          </div>
        </>
      )}
    </AdminShell>
  );
}
