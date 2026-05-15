import { useEffect, useState } from "react";
import { Star, Trash2, User } from "lucide-react";
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
import { apiAdminDeleteReview, apiAdminGetReviews } from "../../api";

const FILTERS = [
  { key: "all",            label: "All",       query: "" },
  { key: "general",        label: "General",   query: "general" },
  { key: "item",           label: "Item",      query: "item" },
  { key: "catering",       label: "Catering",  query: "catering" },
  { key: "corporate_meal", label: "Corporate", query: "corporate_meal" },
];

export default function AdminReviewsPage() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const { toast, show, clear } = useToast();

  const load = async (key) => {
    const next = key ?? filter;
    setFilter(next);
    setLoading(true);
    setError("");
    try {
      const opt = FILTERS.find((f) => f.key === next);
      setRows(await apiAdminGetReviews(opt?.query || undefined));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const askDelete = (review) =>
    setConfirm({
      title: "Delete review?",
      body: `Review #${review.id} by ${fullName(review)} will be permanently removed.`,
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
      title="Reviews"
      subtitle={loading ? "" : `${rows.length} review${rows.length === 1 ? "" : "s"}`}
      actions={<RefreshButton onClick={() => load(filter)} busy={loading} />}
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

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => load(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                active
                  ? "bg-cyan-500 text-white shadow"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:text-cyan-700"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {loading && <SkeletonRows rows={6} cols={6} />}
      {!loading && error && <ErrorState message={error} onRetry={() => load(filter)} />}
      {!loading && !error && rows.length === 0 && <EmptyState label="No reviews to show." />}
      {!loading && !error && rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Comment</th>
                  <th className="px-4 py-3">By</th>
                  <th className="px-4 py-3">Posted</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((rev, idx) => (
                  <tr key={rev.id} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">#{rev.id}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="inline-flex rounded-full bg-cyan-100 px-2 py-0.5 font-semibold capitalize text-cyan-800">
                        {String(rev.review_type || "").replace(/_/g, " ") || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3"><Stars rating={rev.rating} /></td>
                    <td className="max-w-md px-4 py-3 text-sm text-slate-700">
                      <p className="line-clamp-2">
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
