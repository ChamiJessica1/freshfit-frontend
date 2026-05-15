import { useEffect, useState } from "react";
import { Power } from "lucide-react";
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
import { apiAdminGetUsers, apiAdminToggleUserStatus } from "../../api";

export default function AdminUsersPage() {
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
      setRows(await apiAdminGetUsers());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (user) => {
    setBusyId(user.id);
    try {
      const res = await apiAdminToggleUserStatus(user.id);
      const next = res?.data?.is_active ?? (user.is_active ? 0 : 1);
      setRows((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: next } : u))
      );
      show(
        "success",
        `User #${user.id} ${next ? "activated" : "deactivated"}.`
      );
    } catch (err) {
      show("error", err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminShell
      title="Users"
      subtitle={loading ? "" : `${rows.length} user${rows.length === 1 ? "" : "s"}`}
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
      {!loading && !error && rows.length === 0 && <EmptyState label="No users found." />}
      {!loading && !error && rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u, idx) => {
                  const active = !!u.is_active;
                  return (
                    <tr key={u.id} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">#{u.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{fullName(u)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={u.role || "customer"} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={active ? "active" : "inactive"} />
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDate(u.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() =>
                              setConfirm({
                                title: active ? "Deactivate user?" : "Activate user?",
                                body: active
                                  ? `User #${u.id} (${u.email}) will no longer be able to log in.`
                                  : `User #${u.id} (${u.email}) will be able to log in again.`,
                                confirmLabel: active ? "Deactivate" : "Activate",
                                danger: active,
                                onConfirm: () => {
                                  setConfirm(null);
                                  toggle(u);
                                },
                              })
                            }
                            disabled={busyId === u.id}
                            className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
                              active
                                ? "border-red-200 bg-white text-red-700 hover:bg-red-50"
                                : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                            }`}
                          >
                            <Power className="h-3.5 w-3.5" />
                            {active ? "Deactivate" : "Activate"}
                          </button>
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
