import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Plus, Star, Check } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  getMenu,
  apiAddToCart,
  apiAddFavorite,
  apiGetReviews,
  apiAddReview,
  isAuthed,
} from "../api";

export default function ItemDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    getMenu()
      .then((items) => {
        const found = items.find((m) => Number(m.id) === Number(id));
        setItem(found || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    apiGetReviews(id)
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthed()) {
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      await apiAddReview(Number(id), newRating, newComment.trim());
      const updated = await apiGetReviews(id);
      setReviews(updated);
      setNewComment("");
      setNewRating(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

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
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const addFavorite = async () => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }
    try {
      await apiAddFavorite(item.id);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] font-sans text-[#10291d]">
        <Navbar />
        <p className="px-6 py-24 text-center text-lg font-medium text-slate-500">
          Loading...
        </p>
        <Footer />
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] font-sans text-[#10291d]">
        <Navbar />
        <section className="px-6 py-24 text-center">
          <h1 className="text-4xl font-black">Item not found</h1>
          <button
            onClick={() => navigate("/menu")}
            className="mt-6 rounded-full bg-emerald-600 px-8 py-3 font-bold text-white"
          >
            Back to Menu
          </button>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f3] font-sans text-[#10291d]">
      <Navbar />

      <section className="px-6 py-10 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <button
            onClick={() => navigate("/menu")}
            className="mb-8 flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-emerald-600 shadow-sm ring-1 ring-black/5 transition hover:bg-emerald-50"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>

          <div className="overflow-hidden rounded-[34px] bg-white shadow-xl shadow-slate-900/10 ring-1 ring-black/5">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[720px]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />

                <span className="absolute left-8 top-8 rounded-full bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-lg">
                  {item.section}
                </span>
              </div>

              <div className="p-8 md:p-12">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-5xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
                      {item.name}
                    </h1>

                    <div className="mt-5 flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={22}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="ml-3 text-lg font-black text-slate-500">
                        4.9 reviews
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={addFavorite}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                  >
                    <Heart size={25} />
                  </button>
                </div>

                <p className="mb-4 text-center text-xl font-medium leading-9 text-slate-600">
                  {item.description}
                </p>

                <p className="mb-6 text-center text-5xl font-black text-emerald-600">
                  ${Number(item.price).toFixed(2)}
                </p>

                <div className="mb-8 grid grid-cols-4 gap-4">
                  <Nutrition label="Calories" value={item.calories} />
                  <Nutrition label="Protein" value={`${item.protein ?? 0}g`} />
                  <Nutrition label="Carbs" value={`${item.carbs ?? 0}g`} />
                  <Nutrition label="Fat" value={`${item.fat ?? 0}g`} />
                </div>

                <div className="mb-8 text-center">
                  <h3 className="mb-4 text-2xl font-black">Dietary Tags</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {(item.dietary_tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-emerald-50 px-5 py-2 text-sm font-black text-emerald-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-8 text-center">
                  <h3 className="mb-4 text-2xl font-black">Ingredients</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {(item.ingredients || []).map((ingredient) => (
                      <span
                        key={ingredient}
                        className="rounded-full bg-slate-100 px-5 py-2 text-sm font-black text-slate-600"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-10 text-center">
                  <h3 className="mb-4 text-2xl font-black">Allergens</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {(item.allergens || []).length > 0 ? (
                      item.allergens.map((allergen) => (
                        <span
                          key={allergen}
                          className="rounded-full bg-rose-50 px-5 py-2 text-sm font-black text-rose-600"
                        >
                          {allergen}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-slate-100 px-5 py-2 text-sm font-black text-slate-500">
                        No listed allergens
                      </span>
                    )}
                  </div>
                </div>

                {error && (
                  <p className="mb-4 rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
                    {error}
                  </p>
                )}

                <button
                  onClick={addToCart}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-emerald-600 px-8 py-5 text-lg font-black text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
                >
                  {added ? <Check size={22} /> : <Plus size={22} />}
                  {added ? "Added!" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>

          <section className="mx-auto mt-12 max-w-[900px] rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-10">
            <h2 className="mb-8 text-3xl font-black">Customer Reviews</h2>

            {reviews.length === 0 ? (
              <p className="text-center font-medium text-slate-500">
                No reviews yet. Be the first to leave one!
              </p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-3xl bg-slate-50 p-6">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <p className="text-lg font-black text-emerald-700">
                        {review.full_name}
                      </p>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={18} className="fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-lg leading-7 text-slate-600">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={submitReview} className="mt-10 border-t border-slate-100 pt-8 text-left">
              <h3 className="mb-5 text-xl font-black">Leave a Review</h3>

              <div className="mb-5 flex items-center gap-3">
                <span className="font-medium text-slate-600">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setNewRating(n)}
                      className="transition hover:scale-110"
                    >
                      <Star
                        size={26}
                        className={
                          n <= newRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience..."
                rows="4"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                disabled={submittingReview || !newComment.trim()}
                className="mt-5 rounded-2xl bg-emerald-600 px-8 py-3 font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Nutrition({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5 text-center">
      <p className="text-2xl font-black text-emerald-600">{value}</p>
      <p className="mt-1 text-sm font-black text-slate-500">{label}</p>
    </div>
  );
}
