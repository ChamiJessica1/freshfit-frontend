import { useEffect, useState } from "react";
import {
  Edit2,
  Loader2,
  Plus,
  Power,
  Trash2,
  X,
} from "lucide-react";
import AdminShell, {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  RefreshButton,
  SkeletonRows,
  StatusBadge,
  Toast,
  formatMoney,
  useToast,
} from "./AdminShell";
import {
  apiAdminCreateMenuItem,
  apiAdminDeleteMenuItem,
  apiAdminGetMenu,
  apiAdminToggleMenuItem,
  apiAdminUpdateMenuItem,
} from "../../api";

const BLANK = {
  name: "",
  category: "",
  section: "",
  description: "",
  price: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  ingredients: "",
  dietary_tags: "",
  allergens: "",
  image_url: "",
  is_available: true,
};

// Backend stores arrays as JSON strings; the form uses comma-separated strings.
const toCsv = (val) => {
  if (Array.isArray(val)) return val.join(", ");
  if (!val) return "";
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.join(", ");
    } catch {
      /* not JSON — treat as already-csv */
    }
    return val;
  }
  return "";
};

const fromItem = (item) => ({
  name: item.name || "",
  category: item.category || "",
  section: item.section || "",
  description: item.description || "",
  price: item.price ?? "",
  calories: item.calories ?? "",
  protein: item.protein ?? "",
  carbs: item.carbs ?? "",
  fat: item.fat ?? "",
  ingredients: toCsv(item.ingredients),
  dietary_tags: toCsv(item.dietary_tags),
  allergens: toCsv(item.allergens),
  image_url: item.image_url || "",
  is_available: !!item.is_available,
});

const toPayload = (form) => ({
  name: form.name.trim(),
  category: form.category.trim(),
  section: form.section.trim() || null,
  description: form.description.trim() || null,
  price: form.price === "" ? null : Number(form.price),
  calories: form.calories === "" ? null : Number(form.calories),
  protein: form.protein === "" ? null : Number(form.protein),
  carbs: form.carbs === "" ? null : Number(form.carbs),
  fat: form.fat === "" ? null : Number(form.fat),
  ingredients: form.ingredients,    // backend serializes csv to JSON array
  dietary_tags: form.dietary_tags,
  allergens: form.allergens,
  image_url: form.image_url.trim() || null,
  is_available: form.is_available ? 1 : 0,
});

export default function AdminMenuPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [editing, setEditing] = useState(null); // null | "new" | row object
  const [confirm, setConfirm] = useState(null);
  const { toast, show, clear } = useToast();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await apiAdminGetMenu());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (form) => {
    if (!form.name || !form.category || form.price === "") {
      show("error", "Name, category and price are required.");
      return;
    }
    const payload = toPayload(form);
    try {
      if (editing === "new") {
        await apiAdminCreateMenuItem(payload);
        show("success", "Menu item created.");
      } else {
        await apiAdminUpdateMenuItem(editing.id, payload);
        show("success", `Menu item #${editing.id} updated.`);
      }
      setEditing(null);
      await load();
    } catch (err) {
      show("error", err.message);
    }
  };

  const handleToggle = async (item) => {
    setBusyId(item.id);
    try {
      const res = await apiAdminToggleMenuItem(item.id);
      const next = res?.data?.is_available ?? (item.is_available ? 0 : 1);
      setRows((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, is_available: next } : r))
      );
      show("success", `"${item.name}" is now ${next ? "available" : "hidden"}.`);
    } catch (err) {
      show("error", err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = (item) => {
    setConfirm({
      title: "Delete menu item?",
      body: `"${item.name}" will be permanently removed.`,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        setConfirm(null);
        setBusyId(item.id);
        const snap = rows;
        setRows((prev) => prev.filter((r) => r.id !== item.id));
        try {
          await apiAdminDeleteMenuItem(item.id);
          show("success", `"${item.name}" deleted.`);
        } catch (err) {
          setRows(snap);
          show("error", err.message);
        } finally {
          setBusyId(null);
        }
      },
    });
  };

  return (
    <AdminShell
      title="Menu Items"
      subtitle={loading ? "" : `${rows.length} item${rows.length === 1 ? "" : "s"}`}
      actions={
        <>
          <RefreshButton onClick={load} busy={loading} />
          <button
            onClick={() => setEditing("new")}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
          >
            <Plus className="h-4 w-4" /> Add New Item
          </button>
        </>
      }
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
      {!loading && !error && rows.length === 0 && (
        <EmptyState label='No menu items yet. Click "Add New Item" to create one.' />
      )}
      {!loading && !error && rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-800">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Calories</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m, idx) => (
                  <tr key={m.id} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{m.name}</div>
                      {m.description && (
                        <div className="line-clamp-1 text-xs text-slate-500">
                          {m.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{m.category || "—"}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{m.section || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{formatMoney(m.price)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{m.calories ?? "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={m.is_available ? "available" : "unavailable"} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <button
                          onClick={() => handleToggle(m)}
                          disabled={busyId === m.id}
                          title={m.is_available ? "Hide from customers" : "Make available"}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                          <Power className="h-3.5 w-3.5" />
                          {m.is_available ? "Hide" : "Show"}
                        </button>
                        <button
                          onClick={() => setEditing(m)}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(m)}
                          disabled={busyId === m.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
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

      {editing && (
        <MenuItemModal
          initial={editing === "new" ? BLANK : fromItem(editing)}
          isNew={editing === "new"}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </AdminShell>
  );
}

function MenuItemModal({ initial, isNew, onCancel, onSave }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4">
      <div className="my-8 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {isNew ? "Add Menu Item" : "Edit Menu Item"}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Name *" value={form.name} onChange={(v) => set("name", v)} required />
          <Field label="Category *" value={form.category} onChange={(v) => set("category", v)} required />
          <Field label="Section" value={form.section} onChange={(v) => set("section", v)} />
          <Field label="Image URL" value={form.image_url} onChange={(v) => set("image_url", v)} />

          <div className="md:col-span-2">
            <Field
              label="Description"
              textarea
              value={form.description}
              onChange={(v) => set("description", v)}
            />
          </div>

          <Field label="Price (AED) *" type="number" step="0.01" value={form.price} onChange={(v) => set("price", v)} required />
          <Field label="Calories" type="number" value={form.calories} onChange={(v) => set("calories", v)} />
          <Field label="Protein (g)" type="number" step="0.1" value={form.protein} onChange={(v) => set("protein", v)} />
          <Field label="Carbs (g)" type="number" step="0.1" value={form.carbs} onChange={(v) => set("carbs", v)} />
          <Field label="Fat (g)" type="number" step="0.1" value={form.fat} onChange={(v) => set("fat", v)} />

          <div className="md:col-span-2 space-y-3">
            <Field
              label="Ingredients (comma-separated)"
              value={form.ingredients}
              onChange={(v) => set("ingredients", v)}
              placeholder="e.g. chicken, rice, lemon"
            />
            <Field
              label="Dietary Tags (comma-separated)"
              value={form.dietary_tags}
              onChange={(v) => set("dietary_tags", v)}
              placeholder="e.g. gluten-free, high-protein"
            />
            <Field
              label="Allergens (comma-separated)"
              value={form.allergens}
              onChange={(v) => set("allergens", v)}
              placeholder="e.g. dairy, nuts"
            />
          </div>

          <label className="md:col-span-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              checked={form.is_available}
              onChange={(e) => set("is_available", e.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
            <span className="text-sm font-medium text-slate-700">
              Available to customers
            </span>
          </label>

          <div className="md:col-span-2 mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isNew ? "Create Item" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", step, required, placeholder, textarea }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      ) : (
        <input
          type={type}
          step={step}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      )}
    </label>
  );
}
