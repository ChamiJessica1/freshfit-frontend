import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, Package } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import MenuCard from "../Components/MenuCard";
import { getMenu, getPersonalizedMenu, isAuthed } from "../api";

const SECTION_META = {
  Breakfast: {
    title: "Breakfast",
    blurb: "Start the day with balanced, energizing meals.",
  },
  Salads: {
    title: "Salads",
    blurb: "Fresh greens, lean proteins, and bright dressings.",
  },
  "Main Course": {
    title: "Main Course",
    blurb: "Hearty, balanced meals built around quality ingredients.",
  },
  Soups: {
    title: "Soups",
    blurb: "Warming, nutrient-dense bowls for any time of day.",
  },
  Desserts: {
    title: "Desserts",
    blurb: "Sweet treats made with smart, wholesome ingredients.",
  },
  Snacks: {
    title: "Snacks",
    blurb: "Quick, nourishing bites for between meals.",
  },
};

export default function MenuSectionPage() {
  const navigate = useNavigate();
  const { sectionKey } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const meta = SECTION_META[sectionKey];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const fetcher = isAuthed() ? getPersonalizedMenu : getMenu;
    fetcher()
      .then((data) => {
        if (!cancelled) {
          setAllItems(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    const inSection = allItems.filter((item) => item.section === sectionKey);
    const search = searchTerm.trim().toLowerCase();
    if (!search) return inSection;
    return inSection.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        (item.description || "").toLowerCase().includes(search) ||
        (item.dietary_tags || []).some((tag) =>
          tag.toLowerCase().includes(search)
        )
    );
  }, [sectionKey, searchTerm, allItems]);

  if (!meta) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
        <Navbar />

        <section className="flex min-h-[600px] flex-col items-center justify-center px-6 text-center">
          <Package size={80} className="text-slate-200" />
          <h1 className="mt-6 text-4xl font-black">Section not found</h1>
          <button
            onClick={() => navigate("/menu")}
            className="mt-8 rounded-full bg-emerald-600 px-8 py-4 text-lg font-black text-white transition hover:bg-emerald-700"
          >
            Back to Menu
          </button>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f3] font-sans text-[#10291d] antialiased">
      <Navbar />

      <section className="bg-gradient-to-br from-[#eefaf3] via-[#e7f7f6] to-[#dff5f8] px-6 py-16 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <button
            onClick={() => navigate("/menu")}
            className="mb-7 inline-flex items-center gap-2 text-base font-black text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>

          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-emerald-600">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>

          <h1 className="text-5xl font-black leading-tight tracking-[-0.06em] text-[#10291d] md:text-7xl">
            {meta.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-slate-600 md:text-xl">
            {meta.blurb}
          </p>

          <div className="mt-10 max-w-2xl">
            <div className="relative">
              <Search
                size={22}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder={`Search ${meta.title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white py-4 pl-14 pr-5 text-[15px] font-bold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          {error && (
            <p className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
              {error}
            </p>
          )}

          {loading ? (
            <div className="rounded-[28px] bg-white px-6 py-24 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-lg font-medium text-slate-500">Loading...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[28px] bg-white px-6 py-24 text-center shadow-sm ring-1 ring-slate-200">
              <h2 className="text-3xl font-black tracking-[-0.04em]">
                No matches
              </h2>
              <p className="mt-4 text-lg font-medium text-slate-500">
                Try another search or clear it to see all{" "}
                {meta.title.toLowerCase()}.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
