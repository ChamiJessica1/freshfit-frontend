import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  X,
  Pencil,
  Package,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Hand,
  Save,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  apiGetMySubscriptions,
  apiGetSubscriptionById,
  apiCancelSubscription,
  apiUpdateSubscriptionItems,
  getMenu,
  isAuthed,
} from "../api";

const DAILY_SECTIONS = ["Breakfast", "Salads", "Soups", "Main Course", "Snacks"];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  expired: "bg-slate-100 text-slate-600 ring-slate-300",
};

const formatDate = (v) => (v ? new Date(v).toLocaleDateString() : "—");

export default function ManageSubscriptionPage() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [list, menu] = await Promise.all([
        apiGetMySubscriptions(),
        getMenu().catch(() => []),
      ]);
      setSubscriptions(list);
      setMenuItems(menu);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }
    load();
  }, [navigate]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
        <Navbar />
        <p className="px-6 py-20 text-center text-lg font-medium text-slate-500">
          Loading...
        </p>
        <Footer />
      </main>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
        <Navbar />
        <section className="flex min-h-[600px] flex-col items-center justify-center px-6 text-center">
          <Package size={80} className="text-slate-200" />
          <h1 className="mt-6 text-4xl font-black">No subscriptions yet</h1>
          <p className="mt-3 text-lg font-medium text-slate-500">
            Subscribe to a meal plan to manage it here.
          </p>
          <button
            onClick={() => navigate("/subscriptions")}
            className="mt-8 rounded-full bg-emerald-600 px-8 py-4 text-lg font-black text-white transition hover:bg-emerald-700"
          >
            Browse Plans
          </button>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section className="px-6 py-10">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <CalendarDays size={36} className="text-emerald-600" />
              <h1 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
                Subscription History
              </h1>
            </div>
            <button
              onClick={() => navigate("/subscriptions")}
              className="rounded-full bg-emerald-600 px-7 py-3 text-base font-black text-white transition hover:bg-emerald-700"
            >
              + New Subscription
            </button>
          </div>

          {error && (
            <p className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
              {error}
            </p>
          )}

          <div className="space-y-6">
            {subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                summary={sub}
                menuItems={menuItems}
                onChanged={load}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function SubscriptionCard({ summary, menuItems, onChanged }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [editing, setEditing] = useState(false);
  const [picks, setPicks] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const planName =
    summary.plan_type === "weekly" ? "Weekly Plan" : "Monthly Plan";
  const days = summary.plan_type === "weekly" ? 7 : 28;
  const weeks = summary.plan_type === "weekly" ? 1 : 4;

  const isActive = summary.status === "active";
  const isCustom = summary.selection_mode === "custom";
  const canEdit = isActive && isCustom;

  const itemsBySection = useMemo(() => {
    const map = {};
    for (const sec of [...DAILY_SECTIONS, "Desserts"]) map[sec] = [];
    for (const item of menuItems) {
      if (map[item.section]) map[item.section].push(item);
    }
    return map;
  }, [menuItems]);

  const loadDetail = async () => {
    try {
      const d = await apiGetSubscriptionById(summary.id);
      setDetail(d);
      const next = {};
      for (const it of d.items || []) {
        if (it.section === "Desserts") {
          const week = Math.ceil((it.day_index || 7) / 7);
          next[`dessert_week_${week}_item`] = it.menu_item_id;
          next[`dessert_week_${week}_day`] = it.day_index;
        } else if (it.day_index) {
          next[`day_${it.day_index}_${it.section}`] = it.menu_item_id;
        }
      }
      setPicks(next);
    } catch (err) {
      setDetailError(err.message);
    }
  };

  const toggleExpand = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && detail === null) await loadDetail();
  };

  const setPick = (key, id) => {
    setPicks((p) => ({ ...p, [key]: id }));
    setSaveError("");
  };

  const collectItems = () => {
    const items = [];
    for (let day = 1; day <= days; day++) {
      for (const section of DAILY_SECTIONS) {
        const id = picks[`day_${day}_${section}`];
        if (id) items.push({ menu_item_id: id, day_index: day, section });
      }
    }
    for (let w = 1; w <= weeks; w++) {
      const id = picks[`dessert_week_${w}_item`];
      const dayId = picks[`dessert_week_${w}_day`];
      if (id && dayId) {
        items.push({
          menu_item_id: id,
          day_index: dayId,
          section: "Desserts",
        });
      }
    }
    return items;
  };

  const filledCount = useMemo(() => {
    let count = 0;
    for (let day = 1; day <= days; day++) {
      for (const section of DAILY_SECTIONS) {
        if (picks[`day_${day}_${section}`]) count++;
      }
    }
    for (let w = 1; w <= weeks; w++) {
      if (picks[`dessert_week_${w}_item`] && picks[`dessert_week_${w}_day`]) {
        count++;
      }
    }
    return count;
  }, [picks, days, weeks]);

  const expectedCount = days * DAILY_SECTIONS.length + weeks;

  const saveChanges = async () => {
    const items = collectItems();
    if (items.length !== expectedCount) {
      setSaveError(
        `Pick all items: ${items.length}/${expectedCount} selected.`
      );
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      await apiUpdateSubscriptionItems(summary.id, items);
      setEditing(false);
      await loadDetail();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelSub = async () => {
    setCancelling(true);
    try {
      await apiCancelSubscription(summary.id);
      setConfirmCancel(false);
      onChanged();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  const itemsByDay = useMemo(() => {
    if (!detail?.items) return {};
    const map = {};
    for (const it of detail.items) {
      if (it.section === "Desserts") continue;
      if (!map[it.day_index]) map[it.day_index] = {};
      map[it.day_index][it.section] = it;
    }
    return map;
  }, [detail]);

  const desserts = useMemo(() => {
    if (!detail?.items) return [];
    return detail.items.filter((it) => it.section === "Desserts");
  }, [detail]);

  return (
    <article className="rounded-[24px] bg-white p-7 shadow-sm ring-1 ring-slate-200">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black tracking-[-0.02em]">{planName}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ring-1 ${
                STATUS_STYLES[summary.status] || STATUS_STYLES.expired
              }`}
            >
              {summary.status}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                isCustom ? "bg-emerald-50 text-emerald-700" : "bg-cyan-50 text-cyan-700"
              }`}
            >
              {isCustom ? <Hand size={12} /> : <Sparkles size={12} />}
              {summary.selection_mode}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {formatDate(summary.start_date)} → {formatDate(summary.end_date)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {canEdit && !editing && (
            <button
              onClick={() => {
                setEditing(true);
                if (!detail) loadDetail();
                setExpanded(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700"
            >
              <Pencil size={16} />
              Edit Items
            </button>
          )}
          {isActive && !confirmCancel && (
            <button
              onClick={() => setConfirmCancel(true)}
              className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-5 py-2.5 text-sm font-black text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-100"
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>
      </header>

      {confirmCancel && (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <p className="text-base font-bold text-rose-700">
            Cancel this subscription?
          </p>
          <p className="mt-1 text-sm text-rose-600">
            You'll stop receiving deliveries immediately. You can subscribe
            again anytime.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={cancelSub}
              disabled={cancelling}
              className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-rose-700 disabled:opacity-60"
            >
              {cancelling ? "Cancelling..." : "Confirm Cancel"}
            </button>
            <button
              onClick={() => setConfirmCancel(false)}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              Keep Plan
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggleExpand}
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
      >
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        {expanded ? "Hide meals" : "View meals by day"}
      </button>

      {expanded && (
        <div className="mt-5">
          {detailError ? (
            <p className="text-sm font-bold text-rose-500">{detailError}</p>
          ) : detail === null ? (
            <p className="text-sm text-slate-500">Loading items...</p>
          ) : editing ? (
            <EditMode
              days={days}
              weeks={weeks}
              picks={picks}
              setPick={setPick}
              itemsBySection={itemsBySection}
              expectedCount={expectedCount}
              filledCount={filledCount}
              saving={saving}
              saveError={saveError}
              onSave={saveChanges}
              onCancel={() => {
                setEditing(false);
                setSaveError("");
                loadDetail();
              }}
            />
          ) : (
            <ViewMode
              days={days}
              itemsByDay={itemsByDay}
              desserts={desserts}
            />
          )}
        </div>
      )}
    </article>
  );
}

function ViewMode({ days, itemsByDay, desserts }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="space-y-4">
        {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
          const map = itemsByDay[day] || {};
          return (
            <div
              key={day}
              className="rounded-xl bg-white p-4 ring-1 ring-slate-200"
            >
              <p className="text-sm font-black uppercase tracking-wider text-emerald-700">
                Day {day} · {DAY_NAMES[(day - 1) % 7]}
              </p>
              <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
                {DAILY_SECTIONS.map((section) => {
                  const it = map[section];
                  return (
                    <div key={section} className="text-sm">
                      <p className="text-xs font-black uppercase text-slate-400">
                        {section}
                      </p>
                      <p className="font-bold text-slate-700">
                        {it?.item_name || "—"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {desserts.length > 0 && (
          <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
            <p className="text-sm font-black uppercase tracking-wider text-emerald-700">
              🍰 Desserts
            </p>
            <ul className="mt-2 space-y-1">
              {desserts.map((d) => (
                <li key={d.subscription_item_id} className="text-sm font-bold text-emerald-800">
                  Week {Math.ceil((d.day_index || 7) / 7)}: {d.item_name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function EditMode({
  days,
  weeks,
  picks,
  setPick,
  itemsBySection,
  expectedCount,
  filledCount,
  saving,
  saveError,
  onSave,
  onCancel,
}) {
  const [activeWeek, setActiveWeek] = useState(1);
  const dayStart = (activeWeek - 1) * 7 + 1;
  const dayEnd = Math.min(activeWeek * 7, days);
  const dayList = [];
  for (let d = dayStart; d <= dayEnd; d++) dayList.push(d);

  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-base font-black text-slate-700">
          Editing meals — {filledCount}/{expectedCount} selected
        </p>
        <div className="flex flex-wrap gap-2">
          {weeks > 1 &&
            Array.from({ length: weeks }, (_, i) => i + 1).map((w) => (
              <button
                key={w}
                onClick={() => setActiveWeek(w)}
                className={`rounded-full px-4 py-1.5 text-xs font-black transition ${
                  activeWeek === w
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                Week {w}
              </button>
            ))}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {dayList.map((day) => (
          <div key={day} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <p className="text-sm font-black uppercase tracking-wider text-emerald-700">
              Day {day} · {DAY_NAMES[(day - 1) % 7]}
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {DAILY_SECTIONS.map((section) => {
                const key = `day_${day}_${section}`;
                return (
                  <Picker
                    key={key}
                    label={section}
                    value={picks[key] || ""}
                    options={itemsBySection[section] || []}
                    onChange={(id) => setPick(key, id)}
                  />
                );
              })}
            </div>
          </div>
        ))}

        <DessertEditCard
          activeWeek={activeWeek}
          picks={picks}
          setPick={setPick}
          itemsBySection={itemsBySection}
        />
      </div>

      {saveError && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
          {saveError}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-full bg-white px-6 py-2.5 text-sm font-black text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          Discard
        </button>
      </div>
    </div>
  );
}

function DessertEditCard({ activeWeek, picks, setPick, itemsBySection }) {
  const itemKey = `dessert_week_${activeWeek}_item`;
  const dayKey = `dessert_week_${activeWeek}_day`;
  const weekDays = [];
  for (let d = (activeWeek - 1) * 7 + 1; d <= activeWeek * 7; d++) {
    weekDays.push({
      value: d,
      label: `Day ${d} · ${DAY_NAMES[(d - 1) % 7]}`,
    });
  }

  return (
    <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
      <p className="text-sm font-black uppercase tracking-wider text-emerald-700">
        🍰 Week {activeWeek} dessert
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Picker
          label="Dessert"
          value={picks[itemKey] || ""}
          options={itemsBySection["Desserts"] || []}
          onChange={(id) => setPick(itemKey, id)}
        />
        <DayPicker
          label="Delivery Day"
          value={picks[dayKey] || ""}
          days={weekDays}
          onChange={(id) => setPick(dayKey, id)}
        />
      </div>
    </div>
  );
}

function DayPicker({ label, value, days, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || "")}
        className={`h-10 w-full rounded-lg border bg-white px-2 text-xs font-bold outline-none transition focus:border-emerald-500 ${
          value ? "border-emerald-300 text-slate-700" : "border-slate-200 text-slate-400"
        }`}
      >
        <option value="">Choose a day...</option>
        {days.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Picker({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || "")}
        className={`h-10 w-full rounded-lg border bg-white px-2 text-xs font-bold outline-none transition focus:border-emerald-500 ${
          value ? "border-emerald-300 text-slate-700" : "border-slate-200 text-slate-400"
        }`}
      >
        <option value="">Choose...</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </label>
  );
}
