import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, User, Mail, Phone, Leaf, AlertCircle, Save } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  apiGetProfile,
  apiUpdateProfile,
  apiGetAllergies,
  apiGetDietaryProfile,
  apiSaveDietaryProfile,
  isAuthed,
  getCurrentUser,
  setAuth,
  getToken,
} from "../api";

const DIETARY_STYLES = [
  "No Preference",
  "Vegan",
  "Vegetarian",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Mediterranean",
  "Gluten-Free",
  "High-Protein",
];

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dietaryStyle, setDietaryStyle] = useState("No Preference");
  const [allergies, setAllergies] = useState([]); // selected allergy ids
  const [allAllergies, setAllAllergies] = useState([]); // [{id,name}]
  const [savedMessage, setSavedMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const [profile, dietary, allergyList] = await Promise.all([
          apiGetProfile(),
          apiGetDietaryProfile().catch(() => ({ diet_type: null, allergies: [] })),
          apiGetAllergies().catch(() => []),
        ]);

        setFullName(profile.full_name || "");
        setEmail(profile.email || "");
        setPhoneNumber(profile.phone || "");
        setDietaryStyle(dietary.diet_type || "No Preference");
        setAllergies((dietary.allergies || []).map((a) => a.id));
        setAllAllergies(allergyList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const toggleAllergy = (id) => {
    setAllergies((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError("Full name is required.");
      setSavedMessage("");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await apiUpdateProfile({
        full_name: fullName.trim(),
        phone: phoneNumber.trim(),
        avatar_url: null,
      });

      await apiSaveDietaryProfile(
        dietaryStyle === "No Preference" ? null : dietaryStyle,
        allergies
      );

      // Refresh stored user.full_name so Dashboard greeting updates
      const user = getCurrentUser();
      if (user) {
        setAuth(getToken(), { ...user, full_name: fullName.trim() });
      }

      setSavedMessage("Profile saved successfully!");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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
        <div className="mx-auto max-w-[820px]">
          <div className="mb-10 flex items-center gap-4">
            <Edit size={34} className="text-emerald-600" />
            <h1 className="text-5xl font-black tracking-[-0.05em]">
              Edit Profile
            </h1>
          </div>

          <div className="space-y-7">
            <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-2xl font-black">Personal Information</h2>

              <div className="mt-7 space-y-6">
                <Field
                  label="Full Name"
                  icon={<User size={20} />}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your full name"
                />

                <Field
                  label="Email (read-only)"
                  icon={<Mail size={20} />}
                  value={email}
                  readOnly
                />

                <Field
                  label="Phone Number"
                  icon={<Phone size={20} />}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+961 00 000 000"
                />
              </div>
            </section>

            <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div className="mb-7 flex items-center gap-4">
                <Leaf size={26} className="text-emerald-600" />
                <h2 className="text-2xl font-black">Dietary Style</h2>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {DIETARY_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setDietaryStyle(style)}
                    className={`rounded-2xl border px-5 py-4 text-left text-base font-bold transition ${
                      dietaryStyle === style
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div className="mb-7 flex items-center gap-4">
                <AlertCircle size={26} className="text-emerald-600" />
                <h2 className="text-2xl font-black">Allergies</h2>
              </div>

              {allAllergies.length === 0 ? (
                <p className="text-base font-medium text-slate-500">
                  No allergies configured on the backend.
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {allAllergies.map((a) => {
                    const selected = allergies.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAllergy(a.id)}
                        className={`rounded-full border px-5 py-2 text-base font-bold transition ${
                          selected
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                        }`}
                      >
                        {a.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {error && (
              <p className="rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
                {error}
              </p>
            )}

            {savedMessage && (
              <p className="rounded-2xl bg-emerald-50 px-5 py-4 text-center font-bold text-emerald-700">
                {savedMessage}
              </p>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 rounded-2xl border-2 border-slate-200 bg-white px-8 py-5 text-xl font-black text-slate-600 transition hover:border-slate-300"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-5 text-xl font-black text-white transition hover:scale-[1.02] disabled:opacity-60"
              >
                <Save size={22} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({ label, icon, value, onChange, placeholder, readOnly }) {
  return (
    <div>
      <label className="mb-3 block text-lg font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`h-14 w-full rounded-2xl border border-slate-200 pl-12 pr-5 text-lg outline-none focus:border-emerald-500 ${
            readOnly ? "bg-slate-50 text-slate-500" : ""
          }`}
        />
      </div>
    </div>
  );
}
