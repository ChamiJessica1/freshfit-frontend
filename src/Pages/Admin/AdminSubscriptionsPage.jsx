import { useEffect, useState } from "react";
import { Check, Mail, X } from "lucide-react";
import AdminShell, {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  RefreshButton,
  SkeletonRows,
  StatusBadge,
  Toast,
  formatDate,
  fullName,
  useToast,
} from "./AdminShell";
import {
  apiAdminGetSubscriptions,
  apiAdminUpdateSubscriptionStatus,
} from "../../api";

export default function AdminSubscriptionsPage() {
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
      setRows(await apiAdminGetSubscriptions());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      await apiAdminUpdateSubscriptionStatus(id, status);
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      show("success", `Subscription #${id} ${status}.`);
    } catch (err) {
      show("error", err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminShell
      title="Subscriptions"
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

      {loading && <SkeletonRows rows={6} cols={6} />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && rows.length === 0 && <EmptyState label="No subscriptions yet." />}
      {!loading && !error && rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Start</th>
                  <th className="px-4 py-3">End</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s, idx) => {
                  const active = String(s.status).toLowerCase() === "active";
                  return (
                    <tr key={s.id} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">#{s.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{fullName(s)}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Mail className="h-3 w-3" /> {s.email || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{s.plan_type || "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{s.selection_mode || "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDate(s.start_date)}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDate(s.end_date)}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {active ? (
                            <>
                              <button
                                onClick={() =>
                                  setConfirm({
                                    title: "Mark subscription as completed?",
                                    body: `Subscription #${s.id} will be set to "completed".`,
                                    confirmLabel: "Mark as done",
                                    onConfirm: () => {
                                      setConfirm(null);
                                      updateStatus(s.id, "completed");
                                    },
                                  })
                                }
                                disabled={busyId === s.id}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                              >
                                <Check className="h-3.5 w-3.5" /> Mark as Done
                              </button>
                              <button
                                onClick={() =>
                                  setConfirm({
                                    title: "Cancel subscription?",
                                    body: `Subscription #${s.id} will be cancelled and visible as such to the customer.`,
                                    confirmLabel: "Cancel subscription",
                                    danger: true,
                                    onConfirm: () => {
                                      setConfirm(null);
                                      updateStatus(s.id, "cancelled");
                                    },
                                  })
                                }
                                disabled={busyId === s.id}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                              >
                                <X className="h-3.5 w-3.5" /> Cancel
                              </button>
                            </>
                          ) : (
                            <span className="text-xs italic text-slate-400">No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
