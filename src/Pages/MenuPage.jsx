import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getMenu, getPersonalizedMenu, isAuthed } from "../api";

const SECTIONS = [
  { key: "Breakfast", title: "Breakfast" },
  { key: "Salads", title: "Salads" },
  { key: "Main Course", title: "Main Course" },
  { key: "Soups", title: "Soups" },
  { key: "Desserts", title: "Desserts" },
  { key: "Snacks", title: "Snacks" },
];

export default function MenuPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetcher = isAuthed() ? getPersonalizedMenu : getMenu;
    fetcher()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const map = {};
    SECTIONS.forEach((s) => (map[s.key] = 0));
    items.forEach((item) => {
      if (map[item.section] !== undefined) map[item.section] += 1;
    });
    return map;
  }, [items]);

  const goToSection = (key) => {
    navigate(`/menu/section/${encodeURIComponent(key)}`);
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] font-sans text-[#10291d] antialiased">
      <Navbar />

      <section className="bg-gradient-to-br from-[#eefaf3] via-[#e7f7f6] to-[#dff5f8] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-[1440px] text-center">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.28em] text-emerald-600">
            Fresh & Healthy Menu
          </p>

          <h1 className="text-5xl font-black leading-tight tracking-[-0.06em] text-[#10291d] md:text-7xl">
            Choose Your
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-cyan-400 bg-clip-text text-transparent">
              Category
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg font-medium leading-8 text-slate-600 md:text-xl">
            Explore breakfasts, salads, mains, soups, desserts, and snacks —
            all built around clean ingredients and balanced nutrition.
          </p>
        </div>
      </section>

      {error && (
        <div className="px-6 pt-6 md:px-10">
          <p className="mx-auto max-w-[1440px] rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
            {error}
          </p>
        </div>
      )}

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-5 sm:grid-cols-3 md:gap-7 lg:grid-cols-3 xl:grid-cols-6">
          {SECTIONS.map((s) => {
            const count = counts[s.key] ?? 0;
            return (
              <button
                key={s.key}
                onClick={() => goToSection(s.key)}
                className="group relative aspect-square overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.10)] ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(15,23,42,0.18)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-700 to-emerald-900 transition duration-700 group-hover:from-emerald-600 group-hover:via-emerald-800 group-hover:to-emerald-950" />

                <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center text-white">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70">
                    {count} item{count === 1 ? "" : "s"}
                  </span>
                  <h3 className="mt-2 text-2xl font-black uppercase tracking-wide leading-tight md:text-3xl">
                    {s.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
