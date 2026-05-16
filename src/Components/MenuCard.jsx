import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Heart, Plus, Star, Check } from "lucide-react";
import { apiAddToCart,apiAddFavorite, isAuthed } from "../api";

export default function MenuCard({ item }) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [favoriteAdded, setFavoriteAdded] = useState(false);

  const addToCart = async () => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }

    setError("");
    try {
      await apiAddToCart(item.id, 1);
      window.dispatchEvent(new Event("cartUpdated"));
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 2500);
    }
  };
  const addToFavorites = async () => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }

    setError("");
    try {
      await apiAddFavorite(item.id);
      setFavoriteAdded(true);
      setTimeout(() => setFavoriteAdded(false), 1500);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 2500); 
    }
  }

  return (
    <div className="group overflow-hidden rounded-[30px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(15,23,42,0.14)]">
      <div className="relative h-64 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-700 shadow-md">
          {item.section}
        </span>

        <button
          onClick={addToFavorites}
          className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-md transition hover:scale-110 hover:text-rose-500">
          <Heart size={21} className={favoriteAdded?"fill-rose-500": ""}/>
        </button>

        <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-bold text-white backdrop-blur">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          4.9
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="text-[25px] font-black leading-tight tracking-[-0.04em] text-[#10291d]">
            {item.name}
          </h3>

          <p className="whitespace-nowrap text-2xl font-black text-emerald-600">
            ${Number(item.price).toFixed(2)}
          </p>
        </div>

        <p className="mb-5 line-clamp-2 text-[15px] font-medium leading-6 text-slate-500">
          {item.description}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {(item.dietary_tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-6 grid grid-cols-4 gap-2 rounded-3xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <Nutrition value={item.calories} label="Cal" />
          <Nutrition value={`${item.protein ?? 0}g`} label="Protein" />
          <Nutrition value={`${item.carbs ?? 0}g`} label="Carbs" />
          <Nutrition value={`${item.fat ?? 0}g`} label="Fat" />
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-center text-sm font-bold text-red-500">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
            <Flame size={16} className="text-orange-500" />
            Fresh today
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/menu/${item.id}`)}
              className="rounded-full border-2 border-emerald-600 px-5 py-3 text-sm font-black text-emerald-600 transition hover:bg-emerald-600 hover:text-white"
            >
              Details
            </button>

            <button
              onClick={addToCart}
              className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105 ${
                added
                  ? "bg-cyan-400 shadow-cyan-400/25"
                  : "bg-emerald-600 shadow-emerald-600/25 hover:bg-emerald-700"
              }`}
            >
              {added ? <Check size={22} /> : <Plus size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Nutrition({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-[15px] font-black text-[#10291d]">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  );
}
