import { useEffect, useState } from "react";
import { Check, Mail } from "lucide-react";
import AdminShell, {
  ConfirmDialog,
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
import { apiAdminGetOrders, apiAdminUpdateOrderStatus } from "../../api";

const STATUSES = [
  "pending",
  "preparing",
  "out_for_delivery",
  "delivered",
  "completed",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const { toast, show, clear } = useToast();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await apiAdminGetOrders());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    setBusyId(id);
    try {
      await apiAdminUpdateOrderStatus(id, status);
      setRows((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      show("success", `Order #${id} updated to ${status.replace(/_/g, " ")}.`);
    } catch (err) {
      show("error", err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminShell
      title="Orders"
      subtitle={loading ? "" : `${rows.length} record${rows.length === 1 ? "" : "s"}`}
      actions={<RefreshButton onClick={load} busy={loading} />}
    >
      <Toast toast={toast} onClose={clear} />
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        body={confirm?.body}
        confirmLabel={confirm?.confirmLabel}
        danger={confirm?.danger}
        onCancel={() => setConfirm(null)}
        onConfirm={confirm?.onConfirm}
      />

      {loading && <SkeletonRows rows={6} cols={7} />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && rows.length === 0 && <EmptyState label="No orders yet." />}
      {!loading && !error && rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-800">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Placed</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o, idx) => (
                  <tr key={o.id} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">#{o.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{fullName(o)}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Mail className="h-3 w-3" /> {o.email || "—"}
                      </div>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-xs text-slate-600">
                      {o.delivery_address || "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{formatMoney(o.total)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(o.created_at)}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <select
                          value={STATUSES.includes(o.status) ? o.status : ""}
                          onChange={(e) => changeStatus(o.id, e.target.value)}
                          disabled={busyId === o.id}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        >
                          <option value="" disabled>Set status</option>
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            setConfirm({
                              title: "Mark order as completed?",
                              body: `Order #${o.id} will be moved to status "completed".`,
                              confirmLabel: "Mark as done",
                              onConfirm: () => {
                                setConfirm(null);
                                changeStatus(o.id, "completed");
                              },
                            })
                          }
                          disabled={busyId === o.id || o.status === "completed"}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Mark as Done
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
