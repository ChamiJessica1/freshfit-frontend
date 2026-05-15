// Shared layout + small UI primitives for every admin page.
// Sidebar navigation + branded header. Pages render their content as children.

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Utensils,
  ClipboardList,
  HandPlatter,
  CalendarDays,
  Star,
  Building2,
  Users as UsersIcon,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { getCurrentUser, isAuthed } from "../../api";

export const NAV_ITEMS = [
  { to: "/admin",              label: "Dashboard",     icon: LayoutGrid },
  { to: "/admin/menu",         label: "Menu Items",    icon: Utensils },
  { to: "/admin/orders",       label: "Orders",        icon: ClipboardList },
  { to: "/admin/catering",     label: "Catering",      icon: HandPlatter },
  { to: "/admin/subscriptions",label: "Subscriptions", icon: CalendarDays },
  { to: "/admin/reviews",      label: "Reviews",       icon: Star },
  { to: "/admin/corporate",    label: "Corporate Meals", icon: Building2 },
  { to: "/admin/users",        label: "Users",         icon: UsersIcon },
];

export default function AdminShell({ title, subtitle, actions, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  useEffect(() => {
    if (!isAuthed() || !user || user.role !== "admin") {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 shrink-0 flex-col bg-gradient-to-b from-emerald-700 to-emerald-800 px-5 py-6 text-white md:flex">
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
            <Utensils className="h-4 w-4 text-cyan-300" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-cyan-200">
              Fresh&amp;Fit
            </p>
            <p className="text-sm font-bold">Admin</p>
          </div>
        </button>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.to ||
              (item.to !== "/admin" && location.pathname.startsWith(item.to));
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-white text-emerald-800 shadow"
                    : "text-emerald-50/90 hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10"
        >
          Back to site
        </button>
      </aside>

      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>

        {/* mobile nav */}
        <nav className="-mx-1 mb-6 flex gap-2 overflow-x-auto pb-2 md:hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.to ||
              (item.to !== "/admin" && location.pathname.startsWith(item.to));
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  active
                    ? "bg-emerald-700 text-white"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {children}
      </main>
    </div>
  );
}

/* ---------- shared primitives ---------- */

export function Spinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-emerald-700">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-sm font-medium">{label || "Loading..."}</p>
    </div>
  );
}

export function SkeletonRows({ rows = 6, cols = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid animate-pulse gap-4 border-b border-slate-100 px-4 py-3 last:border-0"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((__, c) => (
            <div key={c} className="h-3 rounded bg-slate-200" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <AlertCircle className="h-8 w-8 text-red-600" />
      <p className="text-sm font-medium text-red-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ label }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
      {label || "Nothing to show yet."}
    </div>
  );
}

export function RefreshButton({ onClick, busy }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50 disabled:opacity-50"
    >
      <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
      Refresh
    </button>
  );
}

export function StatusBadge({ status, palette }) {
  const value = String(status || "").toLowerCase();
  const map = {
    // orders + general
    pending:          "bg-yellow-100 text-yellow-800 ring-yellow-200",
    preparing:        "bg-blue-100 text-blue-800 ring-blue-200",
    out_for_delivery: "bg-cyan-100 text-cyan-800 ring-cyan-200",
    delivered:        "bg-green-100 text-green-800 ring-green-200",
    completed:        "bg-emerald-100 text-emerald-800 ring-emerald-200",
    cancelled:        "bg-red-100 text-red-700 ring-red-200",
    rejected:         "bg-red-100 text-red-700 ring-red-200",
    approved:         "bg-green-100 text-green-800 ring-green-200",
    active:           "bg-green-100 text-green-800 ring-green-200",
    inactive:         "bg-red-100 text-red-700 ring-red-200",
    admin:            "bg-purple-100 text-purple-800 ring-purple-200",
    customer:         "bg-gray-100 text-gray-700 ring-gray-200",
    available:        "bg-emerald-100 text-emerald-800 ring-emerald-200",
    unavailable:      "bg-gray-200 text-gray-700 ring-gray-300",
  };
  // catering "cancelled" should be gray per the spec; route through palette.
  if (palette === "catering" && value === "cancelled") {
    return (
      <Pill cls="bg-gray-200 text-gray-700 ring-gray-300">{value}</Pill>
    );
  }
  return <Pill cls={map[value] || "bg-slate-100 text-slate-700 ring-slate-200"}>{value || "—"}</Pill>;
}

function Pill({ cls, children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${cls}`}
    >
      {String(children).replace(/_/g, " ")}
    </span>
  );
}

export function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div className="fixed right-4 top-4 z-50 flex w-80 max-w-[90vw] items-start gap-3 rounded-xl bg-white p-4 shadow-2xl ring-1 ring-slate-200">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isError ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {isError ? <XCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
      </div>
      <div className="flex-1 text-sm text-slate-700">{toast.message}</div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  onCancel,
  onConfirm,
  danger,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              danger
                ? "bg-red-100 text-red-600"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{body}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-700 hover:bg-emerald-800"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- tiny hook for toast ---------- */
export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show, clear: () => setToast(null) };
}

/* ---------- formatters used by every page ---------- */
export const formatDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString();
};

export const formatMoney = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return `AED ${n.toFixed(2)}`;
};

export const fullName = (row) => {
  if (!row) return "—";
  if (row.full_name) return row.full_name;
  const composed = `${row.first_name || ""} ${row.last_name || ""}`.trim();
  return composed || row.name || "—";
};
