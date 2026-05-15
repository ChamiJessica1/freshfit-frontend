import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  apiGetFavorites,
  apiRemoveFavorite,
  apiAddToCart,
  isAuthed,
} from "../api";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      const list = await apiGetFavorites();
      setFavorites(list);
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
    refresh();
  }, [navigate]);

  const removeFavorite = async (favorite_id) => {
    await apiRemoveFavorite(favorite_id);
    refresh();
  };

  const addToCart = async (menu_item_id) => {
    try {
      await apiAddToCart(menu_item_id, 1);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] font-sans text-[#10291d] antialiased">
      <Navbar />

      <section className="px-6 py-14 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 flex items-center gap-4">
            <Heart size={38} className="fill-pink-400 text-pink-400" />
            <h1 className="text-5xl font-black tracking-[-0.05em]">
              My Favorites
            </h1>
          </div>

          {error && (
            <p className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-center text-lg font-medium text-slate-500">
              Loading...
            </p>
          ) : favorites.length === 0 ? (
            <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
              <Heart size={90} className="mb-8 text-slate-200" />

              <h2 className="text-3xl font-bold text-slate-600">
                No favorites yet
              </h2>

              <p className="mt-4 text-lg font-medium text-slate-400">
                Save meals you love to find them quickly later.
              </p>

              <button
                onClick={() => navigate("/menu")}
                className="mt-8 rounded-full bg-emerald-600 px-10 py-4 text-lg font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 transition hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(15,23,42,0.14)]"
                >
                  <div className="relative h-60 overflow-hidden">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}

                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:scale-110 hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <h3 className="text-xl font-black leading-tight text-[#10291d]">
                        {item.name}
                      </h3>

                      <p className="text-xl font-black text-emerald-600">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <p className="mb-5 line-clamp-2 font-medium text-slate-500">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/menu/${item.menu_item_id}`)}
                        className="flex-1 rounded-full border-2 border-emerald-600 px-6 py-3 text-base font-black text-emerald-600 transition hover:bg-emerald-600 hover:text-white"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => addToCart(item.menu_item_id)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                      >
                        <ShoppingCart size={21} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
