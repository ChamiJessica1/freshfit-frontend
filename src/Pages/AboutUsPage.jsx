import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Heart,
  Zap,
  Users,
  Award,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function AboutUsPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Leaf size={30} />,
      title: "Fresh Local Ingredients",
      text: "We work with trusted Lebanese farms and suppliers to prepare meals with fresh produce, quality proteins, and seasonal flavors.",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: <Heart size={30} />,
      title: "Health First, Always",
      text: "Every meal is built to support balanced nutrition without making healthy eating feel boring or complicated.",
      color: "bg-pink-50 text-pink-500",
    },
    {
      icon: <Zap size={30} />,
      title: "Fast & Reliable Delivery",
      text: "From our kitchen to your door, we focus on delivering fresh meals on time so your routine stays simple.",
      color: "bg-cyan-50 text-cyan-500",
    },
    {
      icon: <Users size={30} />,
      title: "Personalized for You",
      text: "Our menu experience helps customers choose meals based on allergies, dietary styles, and personal preferences.",
      color: "bg-yellow-50 text-yellow-500",
    },
    {
      icon: <Award size={30} />,
      title: "Chef-Crafted Meals",
      text: "Our team combines practical nutrition with Lebanese hospitality to create meals that are healthy, satisfying, and enjoyable.",
      color: "bg-violet-50 text-violet-500",
    },
    {
      icon: <ShieldCheck size={30} />,
      title: "Allergy-Aware Kitchen",
      text: "Clear labeling and careful preparation help customers make safer choices with confidence.",
      color: "bg-green-50 text-green-500",
    },
  ];

  const milestones = [
    {
      year: "2020",
      text: "Fresh&Fit started in Beirut with a simple goal: make healthy eating easier for busy Lebanese customers.",
    },
    {
      year: "2021",
      text: "Expanded deliveries across Greater Beirut and introduced weekly healthy meal packages.",
    },
    {
      year: "2022",
      text: "Launched dietary preference filtering to help customers find meals that match their allergies and lifestyle.",
    },
    {
      year: "2023",
      text: "Introduced subscription plans and corporate meal services for offices and teams.",
    },
    {
      year: "2024",
      text: "Partnered with more local suppliers to bring fresher ingredients and better seasonal menu options.",
    },
    {
      year: "2026",
      text: "Serving customers across Lebanon with a growing menu of meals, soups, desserts, subscriptions, catering, and corporate meals.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section
        className="relative min-h-[545px] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(14, 49, 31, 0.82), rgba(57, 172, 112, 0.68)), url('https://rharecruiters.com/wp-content/uploads/2022/11/RHA-91-5-Signs-of-a-Healthy-Company-Culture-1-800x501.jpg')",
        }}
      >
        <div className="mx-auto flex min-h-[545px] max-w-[980px] flex-col items-center justify-center px-6 text-center text-white">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/20 px-6 py-3 text-lg font-bold backdrop-blur">
            <Leaf size={20} />
            Our Story
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-[-0.05em] md:text-7xl">
            Nourishing Lives,
            <br />
            One Meal at a Time
          </h1>

          <p className="mt-8 max-w-4xl text-2xl font-medium leading-10 text-white/90">
            Fresh&Fit was born from a simple belief: eating healthy should be
            joyful, personal, and effortless. We combine fresh ingredients,
            smart nutrition, and Lebanese hospitality to deliver meals people
            genuinely enjoy.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-emerald-50 px-5 py-2 text-lg font-black text-emerald-600">
              Our Mission
            </span>

            <h2 className="mt-7 text-5xl font-black leading-tight tracking-[-0.05em]">
              Making Healthy Eating the Easiest Choice You Make Every Day
            </h2>

            <p className="mt-7 text-xl font-medium leading-9 text-slate-500">
              We started Fresh&Fit because eating well should not feel
              expensive, time-consuming, or complicated. Our goal is to make
              balanced meals more accessible for students, families,
              professionals, and teams across Lebanon.
            </p>

            <p className="mt-7 text-xl font-medium leading-9 text-slate-500">
              Today, Fresh&Fit brings together healthy recipes, dietary
              preference filtering, subscriptions, catering, and corporate meal
              programs in one simple platform.
            </p>
          </div>

          <img
            src="/AboutUs.png"
            alt="Fresh&Fit team sharing healthy meals"
            className="h-[360px] w-full rounded-[30px] object-cover shadow-xl"
          />
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <span className="inline-block rounded-full bg-cyan-100 px-5 py-2 text-lg font-black text-cyan-400">
              What We Stand For
            </span>

            <h2 className="mt-7 text-5xl font-black tracking-[-0.04em]">
              Our Core Values
            </h2>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
              >
                <div
                  className={`mb-7 flex h-14 w-14 items-center justify-center rounded-2xl ${value.color}`}
                >
                  {value.icon}
                </div>

                <h3 className="text-xl font-black">{value.title}</h3>

                <p className="mt-4 text-lg font-medium leading-8 text-slate-500">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <span className="inline-block rounded-full bg-yellow-50 px-5 py-2 text-lg font-black text-yellow-500">
              Our Journey
            </span>

            <h2 className="mt-7 text-5xl font-black tracking-[-0.04em]">
              Milestones That Define Us
            </h2>
          </div>

          <div className="relative mt-16 space-y-8">
            <div className="absolute left-[42px] top-8 hidden h-[calc(100%-70px)] w-[3px] bg-gradient-to-b from-emerald-600 to-cyan-400 md:block" />

            {milestones.map((item, index) => (
              <div
                key={item.year}
                className="relative grid gap-6 md:grid-cols-[110px_1fr]"
              >
                <div
                  className={`z-10 flex h-20 w-20 items-center justify-center rounded-full text-lg font-black text-white shadow-lg ${
                    index % 2 === 0 ? "bg-emerald-600" : "bg-cyan-400"
                  }`}
                >
                  {item.year}
                </div>

                <div className="flex min-h-20 items-center rounded-2xl bg-white px-7 py-5 text-lg font-medium leading-8 text-slate-600 shadow-sm ring-1 ring-slate-200">
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[1240px] rounded-[30px] bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-16 text-center text-white">
          <h2 className="text-4xl font-black tracking-[-0.04em]">
            Fresh&Fit by the Numbers
          </h2>

          <div className="mt-12 grid gap-10 md:grid-cols-4">
            <div>
              <p className="text-5xl font-black">5K+</p>
              <p className="mt-4 text-lg font-medium text-white/85">
                Happy Customers
              </p>
            </div>

            <div>
              <p className="text-5xl font-black">40+</p>
              <p className="mt-4 text-lg font-medium text-white/85">
                Menu Items
              </p>
            </div>

            <div>
              <p className="text-5xl font-black">8</p>
              <p className="mt-4 text-lg font-medium text-white/85">
                Lebanese Areas Served
              </p>
            </div>

            <div>
              <p className="text-5xl font-black">4.9★</p>
              <p className="mt-4 text-lg font-medium text-white/85">
                Average Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 text-center">
        <h2 className="text-4xl font-black tracking-[-0.04em]">
          Ready to Start Your Healthy Journey?
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-xl font-medium leading-8 text-slate-500">
          Join customers across Lebanon who eat better, feel better, and live
          better with Fresh&Fit.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="mt-9 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-10 py-5 text-lg font-black text-white transition hover:scale-105"
        >
          Get Started Free
          <Sparkles size={20} />
        </button>
      </section>

      <Footer />
    </main>
  );
}