import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChefHat,
  Users,
  Utensils,
  Check,
  MapPin,
  CalendarDays,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { apiSubmitCateringRequest, isAuthed } from "../api";

export default function CateringPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventType: "",
    guests: "",
    menuPreference: "",
    eventDate: "",
    location: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.eventType ||
      !formData.guests ||
      !formData.menuPreference ||
      !formData.eventDate ||
      !formData.location
    ) {
      setError("Please fill in all required fields before submitting.");
      return;
    }

    if (!isAuthed()) {
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      await apiSubmitCateringRequest({
        event_type: formData.eventType,
        guest_count: Number(formData.guests),
        event_date: formData.eventDate,
        event_location: formData.location,
        menu_preference: formData.menuPreference,
        additional_notes: formData.notes,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-[1080px]">
          <div className="rounded-[30px] bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-14 text-center text-white shadow-sm">
            <ChefHat className="mx-auto mb-6" size={52} strokeWidth={2.2} />

            <h1 className="text-5xl font-black tracking-[-0.04em]">
              Event Catering Services
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-xl font-semibold leading-8 text-white/90">
              Fresh, personalized menus for any occasion. We handle the food,
              you enjoy the event.
            </p>

            {isAuthed() && (
              <button
                onClick={() => navigate("/catering/history")}
                className="mt-7 rounded-full bg-white px-7 py-3 text-base font-black text-emerald-600 shadow transition hover:scale-[1.03]"
              >
                View My Requests
              </button>
            )}
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-sm ring-1 ring-slate-200">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <Users size={25} />
              </div>
              <p className="font-semibold text-[#10291d]">5-500 Guests</p>
            </div>

            <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-sm ring-1 ring-slate-200">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <Utensils size={25} />
              </div>
              <p className="font-semibold text-[#10291d]">Custom Menus</p>
            </div>

            <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-sm ring-1 ring-slate-200">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <ChefHat size={25} />
              </div>
              <p className="font-semibold text-[#10291d]">Pro Chefs</p>
            </div>

            <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-sm ring-1 ring-slate-200">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <Check size={25} />
              </div>
              <p className="font-semibold text-[#10291d]">Dietary Friendly</p>
            </div>
          </div>

          <div className="mt-12 rounded-[24px] bg-white p-10 shadow-sm ring-1 ring-slate-200">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check size={52} />
                </div>

                <h2 className="mt-8 text-4xl font-black">
                  Request Submitted!
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-xl font-medium leading-8 text-slate-500">
                  Your catering request has been received. Our team will contact
                  you within 24 hours.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => navigate("/catering/history")}
                    className="rounded-full bg-emerald-600 px-9 py-4 text-lg font-black text-white transition hover:bg-emerald-700"
                  >
                    View My Requests
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        eventType: "",
                        guests: "",
                        menuPreference: "",
                        eventDate: "",
                        location: "",
                        notes: "",
                      });
                    }}
                    className="rounded-full border border-slate-200 bg-white px-9 py-4 text-lg font-black text-slate-600 transition hover:bg-slate-50"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="mb-9 text-2xl font-black">
                  Request Catering Service
                </h2>

                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-lg font-medium text-slate-700">
                      Event Type *
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-lg outline-none transition focus:border-emerald-500"
                    >
                      <option value="">Select event type</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Graduation">Graduation</option>
                      <option value="Family Gathering">Family Gathering</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-3 block text-lg font-medium text-slate-700">
                      Number of Guests *
                    </label>
                    <div className="relative">
                      <Users
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={21}
                      />
                      <input
                        type="number"
                        name="guests"
                        min="5"
                        max="500"
                        value={formData.guests}
                        onChange={handleChange}
                        placeholder="e.g. 50"
                        className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-5 text-lg outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-lg font-medium text-slate-700">
                      Menu Preference *
                    </label>
                    <select
                      name="menuPreference"
                      value={formData.menuPreference}
                      onChange={handleChange}
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-lg outline-none transition focus:border-emerald-500"
                    >
                      <option value="">Select menu type</option>
                      <option value="Balanced">Balanced</option>
                      <option value="High Protein">High Protein</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Low Carb">Low Carb</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-3 block text-lg font-medium text-slate-700">
                      Event Date *
                    </label>
                    <div className="relative">
                      <CalendarDays
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={21}
                      />
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-5 text-lg outline-none transition focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="mb-3 block text-lg font-medium text-slate-700">
                    Event Location *
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={21}
                    />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Full address or venue name"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-5 text-lg outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <label className="mb-3 block text-lg font-medium text-slate-700">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requirements, dietary restrictions, or notes for our team..."
                    rows="5"
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
                  />
                </div>

                {error && (
                  <p className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-9 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-5 text-xl font-black text-white transition hover:scale-[1.01] disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Catering Request →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}