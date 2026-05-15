import { useEffect, useState } from "react";
import { Leaf, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  apiGetAllergies,
  apiSaveDietaryProfile,
  isAuthed,
} from "../api";

const dietaryStyles = [
  { name: "Keto", desc: "Low carb, high fat", icon: "🥑" },
  { name: "Vegan", desc: "Plant-based only", icon: "🌱" },
  { name: "Vegetarian", desc: "No meat or fish", icon: "🥦" },
  { name: "High Protein", desc: "Muscle support meals", icon: "💪" },
  { name: "Low Calorie", desc: "Weight management", icon: "⚖️" },
  { name: "Balanced", desc: "Everyday healthy meals", icon: "🍽️" },
  { name: "Pescatarian", desc: "Fish-based meals", icon: "🐟" },
  { name: "Gluten-Free", desc: "No gluten ingredients", icon: "🌾" },
  { name: "Low Carb", desc: "Reduced carbohydrates", icon: "🥗" },
  { name: "Mediterranean", desc: "Fresh heart-friendly meals", icon: "🫒" },
];

export default function DietaryPreferences() {
  const [allergies, setAllergies] = useState([]); // [{id, name}]
  const [selectedAllergyIds, setSelectedAllergyIds] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiGetAllergies()
      .then(setAllergies)
      .catch(() => setAllergies([]));
  }, []);

  const toggleAllergy = (id) => {
    setSelectedAllergyIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (!isAuthed()) {
      navigate("/menu");
      return;
    }
    setSaving(true);
    try {
      await apiSaveDietaryProfile(selectedStyle, selectedAllergyIds);
      navigate("/menu");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#e7f7f6] px-6 py-10 font-sans text-[#10291d] antialiased">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-8 flex items-center justify-center gap-2 text-lg font-semibold text-emerald-600">
          <Leaf size={20} />
          Step 1 of 1 — Personalize Your Experience
        </p>

        <h1 className="text-4xl font-black tracking-[-0.03em] md:text-5xl">
          What Are Your Dietary Needs?
        </h1>

        <p className="mt-4 text-xl font-medium text-slate-500">
          Help us curate the perfect menu just for you.
        </p>
      </div>

      <section className="mx-auto mt-14 max-w-5xl rounded-[2rem] bg-white px-8 py-10 shadow-2xl shadow-slate-900/10 md:px-10">
        <div>
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold tracking-[-0.02em]">
            <Ban className="text-rose-500" />
            Do You Have Any Allergies?
          </h2>

          {allergies.length === 0 ? (
            <p className="text-base font-medium text-slate-400">
              No allergies configured on the backend yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {allergies.map((item) => {
                const selected = selectedAllergyIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAllergy(item.id)}
                    className={`rounded-2xl border px-6 py-3 text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                      selected
                        ? "border-rose-400 bg-rose-50 text-rose-600"
                        : "border-slate-200 bg-white text-slate-500 hover:border-emerald-400"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold tracking-[-0.02em]">
            🥗 Choose Your Dietary Style
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {dietaryStyles.map((style) => (
              <button
                key={style.name}
                type="button"
                onClick={() =>
                  setSelectedStyle(
                    selectedStyle === style.name ? null : style.name
                  )
                }
                className={`flex items-center gap-5 rounded-2xl border px-6 py-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  selectedStyle === style.name
                    ? "border-emerald-500 bg-emerald-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-emerald-400"
                }`}
              >
                <span className="text-4xl">{style.icon}</span>

                <div>
                  <h3 className="text-xl font-bold tracking-[-0.01em] text-[#10291d]">
                    {style.name}
                  </h3>
                  <p className="mt-1 text-base font-medium text-slate-500">
                    {style.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
            {error}
          </p>
        )}

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="rounded-2xl border border-slate-200 px-8 py-4 text-lg font-bold text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 hover:shadow-lg active:scale-95"
          >
            Skip for Now
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={saving}
            className="group rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-400/30 active:scale-95 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Continue to Menu"}
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}
