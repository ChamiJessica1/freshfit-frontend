import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Leaf, Sparkles, Hand, ArrowLeft, AlertCircle } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  getMenu,
  apiCreateSubscription,
  apiGetMySubscriptions,
  isAuthed,
} from "../api";

const DAILY_SECTIONS = ["Breakfast", "Salads", "Soups", "Main Course", "Snacks"];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PLANS = {
  weekly: {
    name: "Weekly Plan",
    price: 179.99,
    oldPrice: 249.99,
    period: "/week",
    days: 7,
    weeks: 1,
    dessertCount: 1,
    label: "Flexible",
    description: "Healthy meals planned across 7 days.",
    features: [
      "5 items per day (breakfast, salad, soup, main, snack)",
      "1 dessert per week",
      "Pause or cancel anytime",
      "Free delivery",
    ],
  },
  monthly: {
    name: "Monthly Plan",
    price: 649.99,
    oldPrice: 899.99,
    period: "/month",
    days: 28,
    weeks: 4,
    dessertCount: 4,
    label: "Best Value",
    popular: true,
    description: "4 weeks of personalised meals with the biggest savings.",
    features: [
      "5 items per day (breakfast, salad, soup, main, snack)",
      "1 dessert per week × 4 weeks",
      "Priority delivery",
      "Cancel anytime",
      "Save up to 28%",
    ],
  },
};

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("plans"); // plans | mode | items | done
  const [planKey, setPlanKey] = useState(null);
  const [mode, setMode] = useState(null); // custom | auto
  const [menuItems, setMenuItems] = useState([]);
  const [picks, setPicks] = useState({}); // { "day_section": menu_item_id, "dessert_week_N": id }
  const [warning, setWarning] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeSubscription, setActiveSubscription] = useState(null);

  const plan = planKey ? PLANS[planKey] : null;

  useEffect(() => {
    getMenu()
      .then(setMenuItems)
      .catch(() => setMenuItems([]));

    if (isAuthed()) {
      apiGetMySubscriptions()
        .then((list) => {
          const active = list.find((s) => s.status === "active");
          if (active) setActiveSubscription(active);
        })
        .catch(() => {});
    }
  }, []);

  const itemsBySection = useMemo(() => {
    const map = {};
    for (const sec of [...DAILY_SECTIONS, "Desserts"]) map[sec] = [];
    for (const item of menuItems) {
      if (map[item.section]) map[item.section].push(item);
    }
    return map;
  }, [menuItems]);

  const choosePlan = (key) => {
    setPlanKey(key);
    setMode(null);
    setPicks({});
    setActiveWeek(1);
    setWarning("");
  };

  const goToMode = () => {
    if (!planKey) return;
    setStep("mode");
    setWarning("");
  };

  const chooseMode = (m) => {
    setMode(m);
    setWarning("");
    if (m === "auto") {
      submit("auto");
    } else {
      setStep("items");
    }
  };

  const setPick = (key, id) => {
    setPicks((prev) => ({ ...prev, [key]: id }));
    setWarning("");
  };

  const collectCustomItems = () => {
    const items = [];
    if (!plan) return items;
    for (let day = 1; day <= plan.days; day++) {
      for (const section of DAILY_SECTIONS) {
        const id = picks[`day_${day}_${section}`];
        if (id) items.push({ menu_item_id: id, day_index: day, section });
      }
    }
    for (let w = 1; w <= plan.weeks; w++) {
      const id = picks[`dessert_week_${w}_item`];
      const day = picks[`dessert_week_${w}_day`];
      if (id && day) {
        items.push({
          menu_item_id: id,
          day_index: day,
          section: "Desserts",
        });
      }
    }
    return items;
  };

  const expectedCount = plan ? plan.days * DAILY_SECTIONS.length + plan.weeks : 0;
  const filledCustomCount = useMemo(() => {
    if (!plan) return 0;
    let count = 0;
    for (let day = 1; day <= plan.days; day++) {
      for (const section of DAILY_SECTIONS) {
        if (picks[`day_${day}_${section}`]) count++;
      }
    }
    for (let w = 1; w <= plan.weeks; w++) {
      if (picks[`dessert_week_${w}_item`] && picks[`dessert_week_${w}_day`]) {
        count++;
      }
    }
    return count;
  }, [picks, plan]);

  const submit = async (selectionMode) => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }
    if (!plan) return;

    const payload = {
      plan_type: planKey,
      start_date: new Date().toISOString().split("T")[0],
      selection_mode: selectionMode,
    };

    if (selectionMode === "custom") {
      const items = collectCustomItems();
      if (items.length !== expectedCount) {
        setWarning(
          `Please pick all items (including a delivery day for each dessert): ${items.length}/${expectedCount} selected.`
        );
        return;
      }
      payload.items = items;
    }

    setSubmitting(true);
    setWarning("");
    try {
      await apiCreateSubscription(payload);
      setStep("done");
    } catch (err) {
      setWarning(err.message);
      if (selectionMode === "auto") setStep("mode");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section className="px-6 py-14">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 text-center">
            <h1 className="flex items-center justify-center gap-4 text-5xl font-black tracking-[-0.04em]">
              Subscription Plans
              <Leaf className="text-lime-500" size={40} />
            </h1>
            <p className="mt-4 text-xl font-medium text-slate-500">
              Save more and eat healthy every day with a meal subscription.
            </p>
          </div>

          {activeSubscription && step !== "done" && (
            <ActiveSubscriptionBlock
              subscription={activeSubscription}
              navigate={navigate}
            />
          )}

          {step !== "plans" && !activeSubscription && (
            <button
              onClick={() => {
                if (step === "mode") setStep("plans");
                else if (step === "items") setStep("mode");
              }}
              className="mb-8 inline-flex items-center gap-2 text-base font-black text-emerald-600 hover:text-emerald-700"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          )}

          {!activeSubscription && step === "plans" && (
            <PlansStep
              planKey={planKey}
              choosePlan={choosePlan}
              goNext={goToMode}
            />
          )}

          {!activeSubscription && step === "mode" && plan && (
            <ModeStep
              plan={plan}
              chooseMode={chooseMode}
              submitting={submitting}
            />
          )}

          {!activeSubscription && step === "items" && plan && (
            <ItemsStep
              plan={plan}
              picks={picks}
              setPick={setPick}
              itemsBySection={itemsBySection}
              activeWeek={activeWeek}
              setActiveWeek={setActiveWeek}
              expectedCount={expectedCount}
              filledCount={filledCustomCount}
              warning={warning}
              submitting={submitting}
              onSubmit={() => submit("custom")}
            />
          )}

          {step === "done" && plan && (
            <DoneStep planName={plan.name} navigate={navigate} />
          )}

          {warning && step !== "items" && (
            <p className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
              {warning}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PlansStep({ planKey, choosePlan, goNext }) {
  return (
    <>
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
        {Object.entries(PLANS).map(([key, plan]) => {
          const selected = planKey === key;
          const isMonthly = key === "monthly";
          return (
            <button
              key={key}
              onClick={() => choosePlan(key)}
              className={`relative rounded-[30px] border-2 bg-white p-10 text-left transition hover:-translate-y-1 hover:shadow-xl ${
                selected ? "border-emerald-500 shadow-xl" : "border-slate-200 shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-7 py-2 text-sm font-black text-white">
                  ⭐ Most Popular
                </div>
              )}

              <span
                className={`mb-7 inline-block rounded-full px-4 py-2 text-sm font-black text-white ${
                  isMonthly ? "bg-emerald-600" : "bg-cyan-400"
                }`}
              >
                {plan.label}
              </span>

              <h2 className="text-3xl font-black">{plan.name}</h2>
              <p className="mt-2 text-lg font-medium text-slate-500">
                {plan.description}
              </p>

              <div className="mt-7 flex items-end gap-3">
                <p
                  className={`text-5xl font-black ${
                    isMonthly ? "text-emerald-600" : "text-cyan-400"
                  }`}
                >
                  ${plan.price}
                </p>
                <p className="pb-2 text-lg font-bold text-slate-500">
                  {plan.period}
                </p>
                <p className="pb-2 text-base font-bold text-slate-400 line-through">
                  ${plan.oldPrice}
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-4 text-lg font-medium text-slate-600"
                  >
                    <Check
                      size={20}
                      className={isMonthly ? "text-emerald-600" : "text-cyan-400"}
                    />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="mt-9 flex items-center gap-4 text-lg font-medium text-slate-600">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                    selected
                      ? "border-emerald-600 bg-emerald-600"
                      : isMonthly
                      ? "border-emerald-600"
                      : "border-cyan-400"
                  }`}
                >
                  {selected && <Check size={17} className="text-white" />}
                </span>
                Select this plan
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-14 flex justify-center">
        <button
          disabled={!planKey}
          onClick={goNext}
          className={`rounded-full px-16 py-5 text-xl font-black text-white transition ${
            planKey
              ? "bg-gradient-to-r from-emerald-600 to-cyan-400 shadow-lg hover:scale-105"
              : "cursor-not-allowed bg-gradient-to-r from-emerald-300 to-cyan-200"
          }`}
        >
          Continue →
        </button>
      </div>
    </>
  );
}

function ModeStep({ plan, chooseMode, submitting }) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black tracking-[-0.03em]">
          How would you like to choose your meals?
        </h2>
        <p className="mt-3 text-lg font-medium text-slate-500">
          You're subscribing to the {plan.name}.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <button
          onClick={() => chooseMode("custom")}
          disabled={submitting}
          className="rounded-[28px] border-2 border-slate-200 bg-white p-10 text-left transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl disabled:opacity-60"
        >
          <Hand size={42} className="text-emerald-600" />
          <h3 className="mt-6 text-2xl font-black">I'll choose myself</h3>
          <p className="mt-3 text-lg font-medium text-slate-500">
            Pick the exact meal you want for each day. Full control over what
            you eat.
          </p>
          <p className="mt-6 inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-black text-emerald-700">
            {plan.days} days × 5 items + {plan.dessertCount} dessert
            {plan.dessertCount === 1 ? "" : "s"}
          </p>
        </button>

        <button
          onClick={() => chooseMode("auto")}
          disabled={submitting}
          className="rounded-[28px] border-2 border-slate-200 bg-white p-10 text-left transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl disabled:opacity-60"
        >
          <Sparkles size={42} className="text-cyan-500" />
          <h3 className="mt-6 text-2xl font-black">Surprise me</h3>
          <p className="mt-3 text-lg font-medium text-slate-500">
            Let our chefs pick a balanced rotation. We'll deliver a varied
            selection across the {plan.weeks === 1 ? "week" : "month"}.
          </p>
          <p className="mt-6 inline-block rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-black text-cyan-700">
            {submitting ? "Setting up..." : "One-click subscribe"}
          </p>
        </button>
      </div>
    </div>
  );
}

function ItemsStep({
  plan,
  picks,
  setPick,
  itemsBySection,
  activeWeek,
  setActiveWeek,
  expectedCount,
  filledCount,
  warning,
  submitting,
  onSubmit,
}) {
  const dayStart = (activeWeek - 1) * 7 + 1;
  const dayEnd = Math.min(activeWeek * 7, plan.days);
  const days = [];
  for (let d = dayStart; d <= dayEnd; d++) days.push(d);

  return (
    <>
      <div className="mb-8 rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.03em]">
              Build your {plan.name}
            </h2>
            <p className="mt-1 text-base font-medium text-slate-500">
              Pick one item per section per day. Plus {plan.dessertCount} dessert
              {plan.dessertCount === 1 ? "" : "s"} for the {plan.weeks === 1 ? "week" : "month"}.
            </p>
          </div>
          <p className="text-lg font-black text-emerald-700">
            {filledCount}/{expectedCount} selected
          </p>
        </div>
      </div>

      {plan.weeks > 1 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {Array.from({ length: plan.weeks }, (_, i) => i + 1).map((w) => (
            <button
              key={w}
              onClick={() => setActiveWeek(w)}
              className={`rounded-full px-6 py-2.5 text-base font-black transition ${
                activeWeek === w
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              Week {w}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {days.map((day) => (
          <DayCard
            key={day}
            day={day}
            plan={plan}
            picks={picks}
            setPick={setPick}
            itemsBySection={itemsBySection}
          />
        ))}

        <DessertCard
          activeWeek={activeWeek}
          itemsBySection={itemsBySection}
          picks={picks}
          setPick={setPick}
        />
      </div>

      {warning && (
        <p className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
          {warning}
        </p>
      )}

      <div className="mt-10 flex justify-center">
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-full bg-gradient-to-r from-emerald-600 to-cyan-400 px-16 py-5 text-xl font-black text-white shadow-lg transition hover:scale-105 disabled:opacity-60"
        >
          {submitting ? "Subscribing..." : `Subscribe • $${plan.price}`}
        </button>
      </div>
    </>
  );
}

function DayCard({ day, picks, setPick, itemsBySection }) {
  const dayLabel = `Day ${day} (${DAY_NAMES[(day - 1) % 7]})`;
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-xl font-black tracking-[-0.02em]">{dayLabel}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {DAILY_SECTIONS.map((section) => {
          const key = `day_${day}_${section}`;
          return (
            <SectionPicker
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
  );
}

function DessertCard({ activeWeek, itemsBySection, picks, setPick }) {
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
    <div className="rounded-[24px] bg-emerald-50 p-6 ring-1 ring-emerald-200">
      <h3 className="text-xl font-black tracking-[-0.02em] text-emerald-800">
        🍰 Week {activeWeek} dessert
      </h3>
      <p className="mt-1 text-sm font-medium text-emerald-700">
        Pick one dessert and the day you'd like it delivered.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SectionPicker
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
        className={`h-12 w-full rounded-xl border bg-white px-3 text-sm font-bold outline-none transition focus:border-emerald-500 ${
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

function SectionPicker({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || "")}
        className={`h-12 w-full rounded-xl border bg-white px-3 text-sm font-bold outline-none transition focus:border-emerald-500 ${
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

function ActiveSubscriptionBlock({ subscription, navigate }) {
  const planLabel =
    subscription.plan_type === "weekly" ? "Weekly Plan" : "Monthly Plan";
  return (
    <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-10 text-center shadow-sm ring-1 ring-amber-200">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <AlertCircle size={32} />
      </div>
      <h2 className="mt-6 text-3xl font-black tracking-[-0.03em]">
        You already have an active subscription
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-lg font-medium text-slate-500">
        You're currently on the{" "}
        <span className="font-black text-slate-700">{planLabel}</span>. To
        switch plans, cancel your current subscription first.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => navigate("/subscriptions/manage")}
          className="rounded-full bg-emerald-600 px-8 py-4 text-lg font-black text-white transition hover:bg-emerald-700"
        >
          Manage My Subscription
        </button>
      </div>
    </div>
  );
}

function DoneStep({ planName, navigate }) {
  return (
    <div className="mx-auto max-w-2xl rounded-[30px] bg-white px-10 py-16 text-center shadow-sm ring-1 ring-slate-200">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Check size={52} />
      </div>
      <h2 className="mt-8 text-4xl font-black">Subscribed!</h2>
      <p className="mt-5 text-xl font-medium leading-8 text-slate-500">
        You're now on the{" "}
        <span className="font-black text-slate-600">{planName}</span>.
        <br />
        Your first delivery starts tomorrow!
      </p>
      <button
        onClick={() => navigate("/subscriptions/manage")}
        className="mt-8 rounded-full bg-emerald-600 px-9 py-4 text-xl font-black text-white shadow-lg transition hover:bg-emerald-700"
      >
        View My Subscriptions
      </button>
    </div>
  );
}
