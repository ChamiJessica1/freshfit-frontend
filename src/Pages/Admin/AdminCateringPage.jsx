import { useEffect, useState } from "react";
import { Calendar, Check, CheckCircle2, ChevronDown, ChevronUp, Loader2, Mail } from "lucide-react";
import AdminShell, {
  EmptyState,
  ErrorState,
  RefreshButton,
  SkeletonRows,
  StatusBadge,
  Toast,
  formatDate,
  formatMoney,
  fullName,
  useToast,
} from "./AdminShell";
import { apiAdminGetCatering, apiAdminUpdateCateringStatus } from "../../api";

const STATUSES = ["pending", "approved", "rejected", "cancelled", "completed"];

export default function AdminCateringPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const { toast, show, clear } = useToast();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await apiAdminGetCatering());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (id, payload) => {
    setBusyId(id);
    try {
      await apiAdminUpdateCateringStatus(id, payload);
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...payload } : r))
      );
      show("success", `Catering #${id} updated.`);
    } catch (err) {
      show("error", err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminShell
      title="Catering Requests"
      subtitle={loading ? "" : `${rows.length} record${rows.length === 1 ? "" : "s"}`}
      actions={<RefreshButton onClick={load} busy={loading} />}
    >
      <Toast toast={toast} onClose={clear} />

      {loading && <SkeletonRows rows={6} cols={7} />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && rows.length === 0 && (
        <EmptyState label="No catering requests yet." />
      )}
      {!loading && !error && rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Guests</th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Quote</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <CateringRow
                    key={r.id}
                    row={r}
                    idx={idx}
                    expanded={expandedId === r.id}
                    onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
                    onSave={save}
                    busy={busyId === r.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function CateringRow({ row, idx, expanded, onToggle, onSave, busy }) {
  const [status, setStatus] = useState(row.status || "pending");
  const [notes,  setNotes]  = useState(row.admin_notes || "");
  const [price,  setPrice]  = useState(row.quoted_price ?? "");

  useEffect(() => {
    setStatus(row.status || "pending");
    setNotes(row.admin_notes || "");
    setPrice(row.quoted_price ?? "");
  }, [row.id, row.status, row.admin_notes, row.quoted_price]);

  const buildPayload = (statusOverride) => ({
    status: statusOverride || status,
    admin_notes: notes || null,
    quoted_price: price === "" ? null : Number(price),
  });

  return (
    <>
      <tr
        className={`cursor-pointer ${expanded ? "bg-emerald-50/40" : idx % 2 ? "bg-slate-50/50" : ""}`}
        onClick={onToggle}
      >
        <td className="px-4 py-3 font-mono text-xs text-slate-500">#{row.id}</td>
        <td className="px-4 py-3">
          <div className="font-semibold text-slate-900">{fullName(row)}</div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Mail className="h-3 w-3" /> {row.email || "—"}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-slate-700">{row.event_type || "—"}</td>
        <td className="px-4 py-3 text-sm text-slate-700">{row.guest_count ?? "—"}</td>
        <td className="px-4 py-3 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(row.event_date)}
          </div>
          <div className="truncate text-slate-500">{row.event_location || "—"}</div>
        </td>
        <td className="px-4 py-3 text-sm font-semibold text-slate-900">
          {formatMoney(row.quoted_price)}
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={row.status} palette="catering" />
        </td>
        <td className="px-4 py-3 text-right">
          {expanded ? (
            <ChevronUp className="ml-auto h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
          )}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-emerald-50/40">
          <td colSpan={8} className="px-6 py-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Quoted Price (AED)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="text-xs text-slate-500">
                <div className="font-semibold uppercase tracking-wide">Submitted</div>
                <div className="mt-1">{formatDate(row.submitted_at)}</div>
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Admin Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Notes shared with the customer..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => onSave(row.id, buildPayload())}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save Changes
              </button>
              <button
                onClick={() => onSave(row.id, buildPayload("completed"))}
                disabled={busy || row.status === "completed"}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" /> Mark as Done
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
