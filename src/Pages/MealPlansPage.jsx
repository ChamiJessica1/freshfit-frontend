import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ShieldCheck,
  Leaf,
  RefreshCw,
  Clock,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function MealPlansPage() {
  const navigate = useNavigate();
  const [openQuestion, setOpenQuestion] = useState(0);

  const steps = [
    {
      icon: <CalendarDays size={30} />,
      step: "STEP 01",
      title: "Choose Your Plan",
      text: "Pick the number of meals that fits your lifestyle — starter, balanced, or all-inclusive.",
      color: "from-emerald-600 to-cyan-400",
      textColor: "text-emerald-600",
    },
    {
      icon: <Leaf size={30} />,
      step: "STEP 02",
      title: "Set Your Preferences",
      text: "Tell us your dietary style and allergies. We'll filter your menu to show only what's safe and suits you.",
      color: "from-cyan-400 to-sky-400",
      textColor: "text-cyan-400",
    },
    {
      icon: <RefreshCw size={30} />,
      step: "STEP 03",
      title: "Choose Your Meals Weekly",
      text: "Every week, browse your personalized menu and select your favorite meals for the coming week.",
      color: "from-violet-400 to-sky-400",
      textColor: "text-violet-400",
    },
    {
      icon: <Clock size={30} />,
      step: "STEP 04",
      title: "We Deliver Fresh Daily",
      text: "Your meals are prepared fresh every morning and delivered straight to your door by our team.",
      color: "from-yellow-500 to-cyan-400",
      textColor: "text-yellow-500",
    },
  ];

  const questions = [
    {
      question: "Can I skip a week or pause my plan?",
      answer:
        "Absolutely. You can skip any week or pause your subscription up to 4 weeks per year with no penalty, as long as you do so before Sunday midnight.",
    },
    {
      question: "How do allergen filters work?",
      answer:
        "When you set up your profile, you select your allergens. Our system automatically hides any menu item that contains those ingredients — no guesswork needed.",
    },
    {
      question: "Can I switch plans later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect from the next billing cycle.",
    },
    {
      question: "Are meals delivered fresh or frozen?",
      answer:
        "All our meals are prepared fresh every morning by our kitchen team and delivered the same day. We never freeze meals.",
    },
    {
      question: "What if I don't like a meal?",
      answer:
        "We stand behind our quality. If you're unhappy with any meal, contact us within 24 hours and we'll issue a full credit on your account.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section
        className="relative min-h-[640px] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18, 52, 35, 0.86), rgba(50, 166, 106, 0.72)), url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600')",
        }}
      >
        <div className="mx-auto flex min-h-[640px] max-w-[1000px] flex-col items-center justify-center px-6 text-center text-white">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/20 px-6 py-3 text-lg font-bold backdrop-blur">
            <CalendarDays size={20} />
            Subscription Plans
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-[-0.05em] md:text-7xl">
            Your Personal Meal Plan,
            <br />
            Delivered Fresh Every Day
          </h1>

          <p className="mt-8 max-w-4xl text-2xl font-medium leading-10 text-white/90">
            Stop thinking about what to eat. Subscribe to a Fresh&Fit plan and
            enjoy chef-crafted, nutritionist-approved meals tailored to your
            body, your goals, and your taste.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-8 text-lg font-semibold">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-cyan-300" size={22} />
              No commitment — cancel anytime
            </div>

            <div className="flex items-center gap-3">
              <Leaf className="text-cyan-300" size={22} />
              Always allergen-filtered
            </div>

            <div className="flex items-center gap-3">
              <RefreshCw className="text-cyan-300" size={22} />
              Change meals weekly
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <span className="inline-block rounded-full bg-cyan-100 px-5 py-2 text-lg font-black text-cyan-400">
              Simple Process
            </span>

            <h2 className="mt-7 text-5xl font-black tracking-[-0.04em]">
              How It Works
            </h2>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-4">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div
                  className={`mx-auto flex h-[70px] w-[70px] items-center justify-center rounded-3xl bg-gradient-to-br ${item.color} text-white`}
                >
                  {item.icon}
                </div>

                <p className={`mt-6 font-black ${item.textColor}`}>
                  {item.step}
                </p>

                <h3 className="mt-4 text-xl font-black">{item.title}</h3>

                <p className="mt-4 text-lg font-medium leading-7 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <span className="inline-block rounded-full bg-yellow-50 px-5 py-2 text-lg font-black text-yellow-500">
              FAQs
            </span>

            <h2 className="mt-7 text-5xl font-black tracking-[-0.04em]">
              Common Questions
            </h2>
          </div>

          <div className="mt-14 space-y-4">
            {questions.map((item, index) => {
              const isOpen = openQuestion === index;

              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <button
                    onClick={() => setOpenQuestion(isOpen ? null : index)}
                    className="flex w-full items-center justify-between px-8 py-6 text-left text-lg font-black"
                  >
                    {item.question}
                    <span className="text-emerald-600">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-200 px-8 py-5 text-lg font-medium leading-8 text-slate-500">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-[1240px] rounded-[30px] bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-20 text-center text-white">
          <h2 className="text-4xl font-black tracking-[-0.04em]">
            Ready to Eat Better, Effortlessly?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-xl font-medium leading-8 text-white/90">
            Join thousands of members who have transformed their relationship
            with food. Start your first week today — cancel anytime.
          </p>

          <button
            onClick={() => navigate("/subscriptions")}
            className="mt-9 rounded-2xl bg-white px-10 py-5 text-xl font-black text-emerald-700 transition hover:scale-105 hover:bg-emerald-50"
          >
            View All Plans & Subscribe →
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}