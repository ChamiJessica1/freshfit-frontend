import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCircle,
  Users,
  Leaf,
  Clock,
  Shield,
  Star,
  Send,
  FileText,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { apiAddCorporateReview, isAuthed } from "../api";

export default function CorporateMealsPage() {
  const requestRef = useRef(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleChoosePlan = (planName) => {
    setSelectedPlan(planName);
    setSubmitted(false);

    setTimeout(() => {
      requestRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const benefits = [
    {
      icon: <Users size={28} />,
      title: "Scalable for Every Team",
      text: "Whether your team has 5 employees or 500, our corporate meal program adapts easily to your size, schedule, and daily needs.",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: <Leaf size={28} />,
      title: "Inclusive Dietary Options",
      text: "Employees can enjoy meals that match their dietary preferences and allergy restrictions, including Vegan, Keto, Gluten-Free, and High Protein options.",
      color: "bg-cyan-50 text-cyan-500",
    },
    {
      icon: <Clock size={28} />,
      title: "Reliable Daily Delivery",
      text: "Meals are prepared fresh and delivered within the agreed time window, helping your team stay focused without lunch delays.",
      color: "bg-yellow-50 text-yellow-500",
    },
    {
      icon: <Shield size={28} />,
      title: "Safe Meal Handling",
      text: "Each meal is labeled and packed carefully, following strict kitchen procedures to support employees with allergies and food sensitivities.",
      color: "bg-violet-50 text-violet-500",
    },
    {
      icon: <Star size={28} />,
      title: "Dedicated Support",
      text: "Corporate clients receive priority support and clear communication for meal coordination, schedule updates, and special team requests.",
      color: "bg-pink-50 text-pink-500",
    },
    {
      icon: <FileText size={28} />,
      title: "Simple Billing",
      text: "We support monthly invoicing and flexible billing arrangements to make the process smooth for your finance and operations teams.",
      color: "bg-green-50 text-green-500",
    },
  ];

  const plans = [
    {
      name: "Team",
      size: "5–20 people",
      price: "$12",
      period: "/person/meal",
      description:
        "Ideal for small teams and startups that want to provide a reliable healthy lunch benefit.",
      color: "cyan",
      features: [
        "Daily lunch delivery from Monday to Friday",
        "Individual meal selection for employees",
        "Access to 40+ menu items",
        "Allergy-aware meal labeling",
        "Monthly invoice billing",
      ],
    },
    {
      name: "Business",
      size: "21–100 people",
      price: "$10",
      period: "/person/meal",
      description:
        "Designed for growing companies that want a complete wellness-focused meal solution.",
      color: "green",
      popular: true,
      features: [
        "Lunch with optional breakfast delivery",
        "Expanded menu access for larger teams",
        "Dedicated account support",
        "Allergy and dietary preference management",
        "Weekly usage and nutrition summaries",
        "Priority delivery coordination",
      ],
    },
    {
      name: "Enterprise",
      size: "100+ people",
      price: "Custom Pricing",
      period: "",
      description:
        "A tailored solution for large organizations with advanced dietary, billing, and multi-location needs.",
      color: "violet",
      features: [
        "Customized menu planning",
        "Multi-office delivery coordination",
        "Team nutrition consultation",
        "Custom reporting options",
        "Quarterly service reviews",
        "Priority operational support",
      ],
    },
  ];

  const testimonials = [
    {
      text: "Fresh&Fit made our office lunches easier, healthier, and more organized. Our team looks forward to lunch every day.",
      company: "TechNova Inc.",
      employees: "85 employees",
    },
    {
      text: "The setup was smooth, and the allergy-friendly options gave our employees much more confidence when choosing meals.",
      company: "Greenbridge Studio",
      employees: "22 employees",
    },
    {
      text: "Reliable delivery and professional service. Fresh&Fit has become an important part of our employee wellness program.",
      company: "Apex Capital Group",
      employees: "140 employees",
    },
  ];

  const faqs = [
    {
      question: "How far in advance do we need to place orders?",
      answer:
        "Orders should be placed by 10:00 PM the night before next-day delivery. For first-time corporate setup, we recommend allowing at least 3 business days.",
    },
    {
      question: "Can employees each choose their own meals?",
      answer:
        "Yes. Employees can select meals based on their own dietary preferences, allergies, and wellness goals.",
    },
    {
      question: "What's the minimum order for corporate delivery?",
      answer:
        "Our Team plan starts at 5 people per day. For smaller needs, we recommend using our individual meal subscription plans.",
    },
    {
      question: "Do you deliver on weekends?",
      answer:
        "Standard corporate plans cover Monday through Friday. Weekend delivery can be arranged for Business and Enterprise clients when needed.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      requestRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section
        className="relative min-h-[700px] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(13, 43, 29, 0.88), rgba(42, 139, 92, 0.7)), url('https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/EyvF0jkPg/videoblocks-multiethnic-group-of-people-in-modern-office-creative-business-team-working-on-project-together-laughing-and-smiling_sahufqz1_thumbnail-1080_01.png')",
        }}
      >
        <div className="mx-auto flex min-h-[700px] max-w-[1050px] flex-col justify-center px-6 text-white">
          <div className="mb-8 inline-flex w-fit items-center gap-3 rounded-full bg-white/20 px-6 py-3 text-lg font-bold backdrop-blur">
            <Building2 size={20} />
            Corporate Meal Programs
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-[-0.05em] md:text-7xl">
            Healthy Meals That Keep Your Team Performing
          </h1>

          <p className="mt-8 max-w-3xl text-2xl font-medium leading-10 text-white/90">
            Fresh&Fit delivers fresh, chef-prepared corporate meals tailored to
            your team's dietary needs, schedule, and workplace routine. 
          </p>
          <div className="mt-10 flex flex-wrap gap-5 text-lg font-bold">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-3 backdrop-blur">
              <CheckCircle size={19} className="text-cyan-300" />
              Starting from $10/person/meal
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-3 backdrop-blur">
              <CheckCircle size={19} className="text-cyan-300" />
              Free setup support
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-3 backdrop-blur">
              <CheckCircle size={19} className="text-cyan-300" />
              Flexible plans
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <span className="inline-block rounded-full bg-emerald-50 px-5 py-2 text-lg font-black text-emerald-600">
              Why Fresh&Fit
            </span>

            <h2 className="mt-7 text-5xl font-black tracking-[-0.04em]">
              Built for Modern Workplaces
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
              >
                <div
                  className={`mb-7 flex h-14 w-14 items-center justify-center rounded-2xl ${benefit.color}`}
                >
                  {benefit.icon}
                </div>

                <h3 className="text-xl font-black">{benefit.title}</h3>

                <p className="mt-4 text-lg font-medium leading-8 text-slate-500">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <span className="inline-block rounded-full bg-cyan-100 px-5 py-2 text-lg font-black text-cyan-400">
              Packages
            </span>

            <h2 className="mt-7 text-5xl font-black tracking-[-0.04em]">
              Corporate Plans for Every Team Size
            </h2>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => {
              const isGreen = plan.color === "green";
              const isViolet = plan.color === "violet";

              return (
                <div
                  key={plan.name}
                  className={`relative overflow-hidden rounded-[28px] bg-white shadow-sm ring-2 ${
                    isGreen
                      ? "ring-emerald-600"
                      : isViolet
                      ? "ring-violet-300"
                      : "ring-slate-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-emerald-600 py-3 text-center text-base font-black text-white">
                      ⭐ MOST POPULAR
                    </div>
                  )}

                  <div className="p-8">
                    <h3 className="text-3xl font-black">{plan.name}</h3>

                    <p
                      className={`mt-2 font-black ${
                        isGreen
                          ? "text-emerald-600"
                          : isViolet
                          ? "text-violet-400"
                          : "text-cyan-400"
                      }`}
                    >
                      {plan.size}
                    </p>

                    <div className="mt-6 flex items-end gap-1">
                      <span
                        className={`text-5xl font-black ${
                          isGreen
                            ? "text-emerald-600"
                            : isViolet
                            ? "text-violet-400"
                            : "text-cyan-400"
                        }`}
                      >
                        {plan.price}
                      </span>

                      {plan.period && (
                        <span className="pb-2 text-lg font-medium text-slate-400">
                          {plan.period}
                        </span>
                      )}
                    </div>

                    <p className="mt-6 text-lg font-medium leading-8 text-slate-500">
                      {plan.description}
                    </p>

                    <div className="mt-7 space-y-4">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex gap-4 text-lg font-medium leading-7 text-slate-600"
                        >
                          <CheckCircle
                            size={18}
                            className={`mt-1 shrink-0 ${
                              isGreen
                                ? "text-emerald-600"
                                : isViolet
                                ? "text-violet-400"
                                : "text-cyan-400"
                            }`}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleChoosePlan(plan.name)}
                      className={`mt-9 w-full rounded-2xl px-8 py-4 text-lg font-black transition hover:scale-[1.02] ${
                        isGreen
                          ? "bg-gradient-to-r from-emerald-600 to-cyan-400 text-white"
                          : isViolet
                          ? "border-2 border-violet-400 text-violet-500 hover:bg-violet-50"
                          : "border-2 border-cyan-400 text-cyan-500 hover:bg-cyan-50"
                      }`}
                    >
                      Get a Quote →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <span className="inline-block rounded-full bg-yellow-50 px-5 py-2 text-lg font-black text-yellow-500">
              Testimonials
            </span>

            <h2 className="mt-7 text-5xl font-black tracking-[-0.04em]">
              What Corporate Clients Say
            </h2>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.company}
                className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
              >
                <div className="text-xl text-yellow-500">★★★★★</div>

                <p className="mt-5 text-lg font-medium leading-8 text-slate-600">
                  "{item.text}"
                </p>

                <h3 className="mt-7 text-lg font-black">{item.company}</h3>
                <p className="text-slate-400">{item.employees}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CorporateFeedback />

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="text-center text-5xl font-black tracking-[-0.04em]">
            Frequently Asked Questions
          </h2>

          <div className="mt-14 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between px-8 py-6 text-left text-lg font-black"
                  >
                    {faq.question}
                    <span className="text-emerald-600">
                      {isOpen ? "⌃" : "⌄"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-200 px-8 py-5 text-lg font-medium leading-8 text-slate-500">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={requestRef} className="px-6 pb-24">
        <div className="mx-auto max-w-[1240px] rounded-[28px] bg-white p-10 shadow-sm ring-1 ring-slate-200">
          {submitted ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle size={52} />
              </div>

              <h2 className="mt-8 text-4xl font-black tracking-[-0.04em]">
                Request Submitted Successfully!
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-xl font-medium leading-8 text-slate-500">
                Thank you for choosing Fresh&Fit Corporate Meals. Our team will
                review your request and contact you within 24 hours.
              </p>

              {selectedPlan && (
                <p className="mt-5 text-lg font-black text-emerald-600">
                  Selected Plan: {selectedPlan}
                </p>
              )}

              <button
                onClick={() => setSubmitted(false)}
                className="mt-9 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-10 py-5 text-lg font-black text-white transition hover:scale-105"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <span className="inline-block rounded-full bg-emerald-50 px-5 py-2 text-lg font-black text-emerald-600">
                  Get Started
                </span>

                <h2 className="mt-6 text-4xl font-black tracking-[-0.04em]">
                  Request a Corporate Quote
                </h2>

                <p className="mt-4 text-lg font-medium text-slate-500">
                  Tell us about your team and we will contact you within one
                  business day.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-10">
                {selectedPlan && (
                  <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-lg font-bold text-emerald-700">
                    Selected Plan: {selectedPlan}
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-lg font-medium text-slate-700">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Smith"
                      className="h-14 w-full rounded-2xl border border-slate-200 px-5 text-lg outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-lg font-medium text-slate-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      className="h-14 w-full rounded-2xl border border-slate-200 px-5 text-lg outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-lg font-medium text-slate-700">
                      Work Email
                    </label>
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      className="h-14 w-full rounded-2xl border border-slate-200 px-5 text-lg outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-lg font-medium text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+1 555-000-0000"
                      className="h-14 w-full rounded-2xl border border-slate-200 px-5 text-lg outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-3 block text-lg font-medium text-slate-700">
                    Team Size
                  </label>
                  <select className="h-14 w-full rounded-2xl border border-slate-200 px-5 text-lg outline-none focus:border-emerald-500">
                    <option>Select team size...</option>
                    <option>5–20 people</option>
                    <option>21–100 people</option>
                    <option>100+ people</option>
                  </select>
                </div>

                <div className="mt-6">
                  <label className="mb-3 block text-lg font-medium text-slate-700">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Any special requirements, dietary needs across the team, delivery schedule preferences..."
                    className="w-full resize-none rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-10 py-5 text-lg font-black text-white transition hover:scale-105"
                >
                  <Send size={20} />
                  Submit Request
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function CorporateFeedback() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await apiAddCorporateReview(rating, comment.trim());
      setDone(true);
      setComment("");
      setRating(5);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-[760px] rounded-[28px] bg-white p-10 shadow-sm ring-1 ring-slate-200">
        <div className="text-center">
          <span className="inline-block rounded-full bg-emerald-50 px-5 py-2 text-lg font-black text-emerald-600">
            Your Feedback
          </span>
          <h2 className="mt-6 text-3xl font-black tracking-[-0.04em]">
            Share Your Reaction
          </h2>
          <p className="mt-3 text-lg font-medium text-slate-500">
            Tried our corporate meal program? Tell us how it went.
          </p>
        </div>

        {!isAuthed() ? (
          <div className="mt-8 rounded-2xl bg-slate-50 px-6 py-8 text-center">
            <p className="text-lg font-medium text-slate-600">
              Please{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-black text-emerald-600 underline"
              >
                log in
              </button>{" "}
              to leave feedback.
            </p>
          </div>
        ) : done ? (
          <div className="mt-8 rounded-2xl bg-emerald-50 px-6 py-8 text-center text-emerald-700">
            <CheckCircle size={40} className="mx-auto" />
            <p className="mt-4 text-lg font-black">Thanks for your feedback!</p>
            <button
              onClick={() => setDone(false)}
              className="mt-5 rounded-full bg-white px-6 py-2.5 text-sm font-black text-emerald-600 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
            >
              Leave another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-medium text-slate-600">Rating:</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                >
                  <Star
                    size={28}
                    className={
                      n <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="What did you think of the corporate meal experience? (optional)"
              className="mt-6 w-full resize-none rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none focus:border-emerald-500"
            />

            {err && (
              <p className="mt-4 text-center text-sm font-bold text-rose-600">
                {err}
              </p>
            )}

            <div className="mt-6 text-center">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-10 py-4 text-lg font-black text-white transition hover:scale-105 disabled:opacity-60"
              >
                <Star size={20} />
                {busy ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}