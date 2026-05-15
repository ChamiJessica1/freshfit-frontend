import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Gift, Trophy, Sparkles, Ticket } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  apiGetLoyaltyAccount,
  apiRedeemLoyaltyPoints,
  isAuthed,
} from "../api";

const REWARDS = [
  { points: 25, label: "$5 off your next order", icon: "gift" },
  { points: 75, label: "Free dessert add-on", icon: "sparkles" },
  { points: 150, label: "Free meal under $15", icon: "trophy" },
  { points: 300, label: "20% off any order", icon: "star" },
];

const iconFor = (key) => {
  if (key === "gift") return <Gift size={28} />;
  if (key === "sparkles") return <Sparkles size={28} />;
  if (key === "trophy") return <Trophy size={28} />;
  return <Star size={28} />;
};

export default function LoyaltyPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    total_points: 0,
    total_coupons: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }
    apiGetLoyaltyAccount()
      .then(setAccount)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const points = Number(account.total_points) || 0;
  const coupons = Number(account.total_coupons) || 0;

  const { tier, nextTier, progress } = useMemo(() => {
    let tier = "Sprout";
    let nextTier = "Bronze";
    let nextAt = 50;

    if (points >= 500) {
      tier = "Gold";
      nextTier = null;
      nextAt = 500;
    } else if (points >= 200) {
      tier = "Silver";
      nextTier = "Gold";
      nextAt = 500;
    } else if (points >= 50) {
      tier = "Bronze";
      nextTier = "Silver";
      nextAt = 200;
    }

    const progress = nextTier ? Math.min((points / nextAt) * 100, 100) : 100;
    return { tier, nextTier, progress };
  }, [points]);

  const redeemReward = async (reward) => {
    if (points < reward.points) return;
    setError("");
    try {
      await apiRedeemLoyaltyPoints(reward.points);
      const updated = await apiGetLoyaltyAccount();
      setAccount(updated);
      setMessage(`Redeemed: ${reward.label}. You now have ${updated.total_coupons} coupon(s).`);
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

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

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section className="px-6 py-10">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-10 flex items-center gap-4">
            <Star size={36} className="text-emerald-600" />
            <h1 className="text-5xl font-black tracking-[-0.05em]">
              Loyalty Rewards
            </h1>
          </div>

          {error && (
            <p className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
              {error}
            </p>
          )}

          <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-cyan-400 p-10 text-white shadow-sm">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-bold uppercase tracking-wide text-white/80">
                  Current Tier
                </p>
                <h2 className="mt-2 text-5xl font-black">{tier}</h2>
                <p className="mt-3 text-lg font-medium text-white/90">
                  Coupons available: {coupons}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold uppercase tracking-wide text-white/80">
                  Your Balance
                </p>
                <p className="mt-2 text-6xl font-black">{points}</p>
                <p className="mt-1 text-sm font-bold text-white/80">points</p>
              </div>
            </div>

            {nextTier && (
              <div className="mt-8">
                <div className="mb-2 flex justify-between text-sm font-bold text-white/90">
                  <span>Progress to {nextTier}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {message && (
            <p className="mt-6 rounded-2xl bg-emerald-50 px-5 py-4 text-center font-bold text-emerald-700">
              {message}
            </p>
          )}

          <h2 className="mt-12 text-3xl font-black">Available Rewards</h2>
          <p className="mt-2 text-lg font-medium text-slate-500">
            Redeem your points for coupons.
          </p>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {REWARDS.map((r) => {
              const unlocked = points >= r.points;
              return (
                <div
                  key={r.label}
                  className={`flex items-center gap-5 rounded-3xl p-6 ring-1 ${
                    unlocked
                      ? "bg-white shadow-sm ring-emerald-200"
                      : "bg-white/60 ring-slate-200"
                  }`}
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                      unlocked
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-300"
                    }`}
                  >
                    {iconFor(r.icon)}
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`text-xl font-black ${
                        unlocked ? "text-[#10291d]" : "text-slate-400"
                      }`}
                    >
                      {r.label}
                    </h3>
                    <p className="mt-1 font-medium text-slate-500">
                      {r.points} points
                    </p>
                  </div>

                  <button
                    onClick={() => redeemReward(r)}
                    disabled={!unlocked}
                    className={`rounded-full px-5 py-2.5 text-sm font-black transition ${
                      unlocked
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "cursor-not-allowed bg-slate-100 text-slate-400"
                    }`}
                  >
                    {unlocked ? "Redeem" : "Locked"}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-4">
              <Ticket size={28} className="text-emerald-600" />
              <h2 className="text-2xl font-black">
                You have {coupons} coupon{coupons === 1 ? "" : "s"}
              </h2>
            </div>
            <p className="mt-3 font-medium text-slate-500">
              Apply them at checkout in the cart's coupon field.
            </p>
          </div>

          <div className="mt-12 rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <Star size={42} className="mx-auto text-emerald-600" />
            <h2 className="mt-5 text-3xl font-black">Order more, earn more</h2>
            <p className="mx-auto mt-3 max-w-xl text-lg font-medium text-slate-500">
              Every order builds your tier and unlocks new rewards.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-7 rounded-2xl bg-emerald-600 px-10 py-5 text-lg font-black text-white transition hover:bg-emerald-700"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
