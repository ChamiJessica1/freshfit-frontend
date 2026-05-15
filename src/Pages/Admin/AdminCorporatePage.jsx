import { useEffect, useMemo, useState } from "react";
import { Building2, Star, Trash2, User } from "lucide-react";
import AdminShell, {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  RefreshButton,
  SkeletonRows,
  Toast,
  formatDate,
  fullName,
  useToast,
} from "./AdminShell";
import { apiAdminDeleteReview, apiAdminGetCorporate } from "../../api";

export default function AdminCorporatePage() {
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
      setRows(await apiAdminGetCorporate());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    if (!rows.length) return { count: 0, avg: 0 };
    const sum = rows.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return { count: rows.length, avg: sum / rows.length };
  }, [rows]);

  const askDelete = (review) =>
    setConfirm({
      title: "Delete review?",
      body: `Corporate review #${review.id} by ${fullName(review)} will be permanently removed.`,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        setConfirm(null);
        setBusyId(review.id);
        const snapshot = rows;
        setRows((prev) => prev.filter((r) => r.id !== review.id));
        try {
          await apiAdminDeleteReview(review.id);
          show("success", `Review #${review.id} deleted.`);
        } catch (err) {
          setRows(snapshot);
          show("error", err.message);
        } finally {
          setBusyId(null);
        }
      },
    });

  return (
    <AdminShell
      title="Corporate Meals"
      subtitle={
        loading
          ? ""
          : `${stats.count} review${stats.count === 1 ? "" : "s"} · avg ${stats.avg.toFixed(1)}/5`
      }
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

      {!loading && !error && rows.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total Reviews"
            value={stats.count}
            icon={Building2}
            accent="from-emerald-500 to-emerald-700"
          />
          <SummaryCard
            label="Average Rating"
            value={`${stats.avg.toFixed(1)} / 5`}
            icon={Star}
            accent="from-amber-500 to-orange-500"
          />
        </div>
      )}

      {loading && <SkeletonRows rows={6} cols={6} />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && rows.length === 0 && (
        <EmptyState label="No corporate meal reviews yet." />
      )}
      {!loading && !error && rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Comment</th>
                  <th className="px-4 py-3">By</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Posted</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((rev, idx) => (
                  <tr key={rev.id} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">#{rev.id}</td>
                    <td className="px-4 py-3"><Stars rating={rev.rating} /></td>
                    <td className="max-w-md px-4 py-3 text-sm text-slate-700">
                      <p className="line-clamp-3">
                        {rev.comment || (
                          <span className="italic text-slate-400">(no comment)</span>
                        )}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm font-medium text-slate-800">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        {fullName(rev)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{rev.email || "—"}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(rev.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => askDelete(rev)}
                          disabled={busyId === rev.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
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

function SummaryCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function Stars({ rating }) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-4 w-4"
          fill={i <= r ? "currentColor" : "none"}
          stroke="currentColor"
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-slate-600">{r}/5</span>
    </div>
  );
}
