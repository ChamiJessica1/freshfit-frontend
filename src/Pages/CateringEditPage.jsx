import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChefHat,
  Users,
  MapPin,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  apiGetCateringRequest,
  apiUpdateCateringRequest,
  isAuthed,
} from "../api";

export default function CateringEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventType: "",
    guests: "",
    menuPreference: "",
    eventDate: "",
    location: "",
    notes: "",
  });
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }
    let cancelled = false;
    apiGetCateringRequest(id)
      .then((req) => {
        if (cancelled) return;
        setStatus(req.status);
        setFormData({
          eventType: req.event_type || "",
          guests: String(req.guest_count ?? ""),
          menuPreference: req.menu_preference || "",
          eventDate: req.event_date ? req.event_date.slice(0, 10) : "",
          location: req.event_location || "",
          notes: req.additional_notes || "",
        });
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

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
      setError("Please fill in all required fields before saving.");
      return;
    }

    setSubmitting(true);
    try {
      await apiUpdateCateringRequest(id, {
        event_type: formData.eventType,
        guest_count: Number(formData.guests),
        event_date: formData.eventDate,
        event_location: formData.location,
        menu_preference: formData.menuPreference,
        additional_notes: formData.notes,
      });
      navigate("/catering/history");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
        <Navbar />
        <section className="px-6 py-20 text-center">
          <p className="text-lg font-medium text-slate-500">Loading...</p>
        </section>
        <Footer />
      </main>
    );
  }

  if (status !== "pending") {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
        <Navbar />
        <section className="px-6 py-12">
          <div className="mx-auto max-w-2xl rounded-[24px] bg-white px-8 py-16 text-center shadow-sm ring-1 ring-slate-200">
            <h1 className="text-3xl font-black tracking-[-0.03em]">
              This request can't be edited
            </h1>
            <p className="mt-4 text-lg font-medium text-slate-500">
              Editing is only allowed while a request is still pending review.
              Current status: <span className="font-black">{status}</span>.
            </p>
            <button
              onClick={() => navigate("/catering/history")}
              className="mt-8 rounded-full bg-emerald-600 px-8 py-4 text-lg font-black text-white transition hover:bg-emerald-700"
            >
              Back to My Requests
            </button>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-[1080px]">
          <button
            onClick={() => navigate("/catering/history")}
            className="mb-7 inline-flex items-center gap-2 text-base font-black text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft size={20} />
            Back to My Requests
          </button>

          <div className="rounded-[30px] bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-12 text-center text-white shadow-sm">
            <ChefHat className="mx-auto mb-5" size={48} strokeWidth={2.2} />
            <h1 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
              Edit Catering Request
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg font-medium text-white/90">
              Update event details before our team reviews your request.
            </p>
          </div>

          <div className="mt-10 rounded-[24px] bg-white p-10 shadow-sm ring-1 ring-slate-200">
            <form onSubmit={handleSubmit}>
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

              <div className="mt-9 grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate("/catering/history")}
                  className="rounded-2xl border border-slate-200 px-8 py-5 text-xl font-black text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-5 text-xl font-black text-white transition hover:scale-[1.01] disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Save Changes →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
