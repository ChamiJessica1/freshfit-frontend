import { useNavigate } from "react-router-dom";
import {
  ChefHat,
  Award,
  Star,
  Sprout,
  TestTube,
  Recycle,
  Target,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function OurChefsPage() {
  const navigate = useNavigate();

  const chefs = [
    {
      name: "Chef Maya Khoury",
      role: "Executive Head Chef",
      specialty: "Lebanese Mediterranean Cuisine",
      image:
        "https://placehold.co/800x1000/10291d/ffffff?text=Chef+Maya+Khoury",
      description:
        "Chef Maya brings a modern Lebanese touch to Fresh&Fit, transforming traditional flavors like zaatar, sumac, chickpeas, grilled vegetables, and olive oil into balanced meals made for everyday healthy eating.",
      awards: [
        "Lebanese Mediterranean Menu Lead",
        "Healthy Levantine Cuisine Specialist",
        "Fresh&Fit Signature Bowls Developer",
      ],
      rating: "4.9 / 5.0 customer rating",
    },
    {
      name: "Chef Karim Haddad",
      role: "Head of Protein & Performance Meals",
      specialty: "High-Protein Lebanese Grills",
      image:
        "https://placehold.co/800x1000/10291d/ffffff?text=Chef+Karim+Haddad",
      description:
        "Chef Karim focuses on grilled chicken, lean beef, seafood, and high-protein bowls inspired by Lebanese barbecue traditions. His recipes are built for energy, fitness, and clean flavor.",
      awards: [
        "Performance Meal Development Lead",
        "Lebanese Grill & Protein Specialist",
        "Customer Favorite Bowl Creator",
      ],
      rating: "4.8 / 5.0 customer rating",
      reverse: true,
    },
    {
      name: "Chef Nour El Hajj",
      role: "Head of Soups, Desserts & Plant-Based Recipes",
      specialty: "Plant-Based Lebanese Comfort Food",
      image:
        "https://placehold.co/800x1000/10291d/ffffff?text=Chef+Nour+El+Hajj",
      description:
        "Chef Nour creates light soups, vegan meals, and guilt-free desserts using ingredients familiar to Lebanese kitchens, including lentils, tahini, dates, oats, fruit, cocoa, and nuts.",
      awards: [
        "Plant-Based Recipe Development Lead",
        "Healthy Dessert Innovation Specialist",
        "Fresh&Fit Soup Collection Creator",
      ],
      rating: "4.9 / 5.0 customer rating",
    },
  ];

  const philosophy = [
    {
      icon: <Sprout size={34} />,
      title: "Ingredient Integrity",
      text: "We use fresh vegetables, herbs, grains, legumes, and proteins inspired by Lebanese kitchens and selected for quality, flavor, and nutrition.",
    },
    {
      icon: <TestTube size={34} />,
      title: "Nutrition With Flavor",
      text: "Our chefs balance calories, protein, carbs, and healthy fats without removing the comfort and richness people love in Lebanese food.",
    },
    {
      icon: <Recycle size={34} />,
      title: "Respect for Local Food Culture",
      text: "Our recipes are inspired by familiar Lebanese flavors while keeping portions balanced, modern, and suitable for daily healthy eating.",
    },
    {
      icon: <Target size={34} />,
      title: "Consistency Every Time",
      text: "Every recipe is tested carefully so customers receive the same taste, quality, and nutrition whenever they order.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section
        className="relative min-h-[635px] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(13, 43, 29, 0.88), rgba(13, 43, 29, 0.55)), url('https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="mx-auto flex min-h-[635px] max-w-[1040px] flex-col justify-center px-6 text-white">
          <div className="mb-8 inline-flex w-fit items-center gap-3 rounded-full bg-white/20 px-6 py-3 text-lg font-bold backdrop-blur">
            <ChefHat size={20} />
            Culinary Excellence
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-[-0.05em] md:text-7xl">
            Meet the Lebanese Chefs Behind Every Fresh Bite
          </h1>

          <p className="mt-8 max-w-3xl text-2xl font-medium leading-10 text-white/90">
            Our kitchen team blends Lebanese hospitality, Mediterranean flavor,
            and smart nutrition to create meals that are fresh, balanced, and
            made for everyday life.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <span className="inline-block rounded-full bg-emerald-50 px-5 py-2 text-lg font-black text-emerald-600">
              The Team
            </span>

            <h2 className="mt-7 text-5xl font-black tracking-[-0.04em]">
              Our Head Chefs
            </h2>
          </div>

          <div className="mt-16 space-y-12">
            {chefs.map((chef) => (
              <div
                key={chef.name}
                className={`overflow-hidden rounded-[30px] bg-white shadow-sm ring-1 ring-slate-200 lg:grid lg:grid-cols-[400px_1fr] ${
                  chef.reverse ? "lg:grid-cols-[1fr_400px]" : ""
                }`}
              >
                {!chef.reverse && (
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="h-[430px] w-full object-cover lg:h-full"
                  />
                )}

                <div className="flex flex-col justify-center p-9 lg:p-12">
                  <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-base font-black text-emerald-600">
                    {chef.specialty}
                  </span>

                  <h3 className="mt-6 text-3xl font-black">{chef.name}</h3>

                  <p className="mt-2 text-xl font-bold text-cyan-400">
                    {chef.role}
                  </p>

                  <p className="mt-7 text-lg font-medium leading-8 text-slate-500">
                    {chef.description}
                  </p>

                  <div className="mt-7 space-y-3">
                    {chef.awards.map((award) => (
                      <div
                        key={award}
                        className="flex items-center gap-3 text-base font-medium text-slate-500"
                      >
                        <Award size={18} className="text-yellow-500" />
                        {award}
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex items-center gap-3">
                    <div className="flex text-yellow-500">
                      <Star size={20} fill="currentColor" />
                      <Star size={20} fill="currentColor" />
                      <Star size={20} fill="currentColor" />
                      <Star size={20} fill="currentColor" />
                      <Star size={20} />
                    </div>
                    <span className="font-medium text-slate-400">
                      {chef.rating}
                    </span>
                  </div>
                </div>

                {chef.reverse && (
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="h-[430px] w-full object-cover lg:h-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <span className="inline-block rounded-full bg-cyan-100 px-5 py-2 text-lg font-black text-cyan-400">
              How We Cook
            </span>

            <h2 className="mt-7 text-5xl font-black tracking-[-0.04em]">
              Our Culinary Philosophy
            </h2>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-2">
            {philosophy.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
              >
                <div className="mb-6 text-4xl">{item.icon}</div>
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-4 text-lg font-medium leading-8 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-[1240px] rounded-[30px] bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-16 text-center text-white">
          <ChefHat className="mx-auto mb-7" size={56} />

          <h2 className="text-4xl font-black tracking-[-0.04em]">
            Taste the Difference Fresh Lebanese Cooking Makes
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-xl font-medium leading-8 text-white/90">
            Every meal is prepared with care, balanced nutrition, and flavors
            inspired by Lebanese home cooking. Order today and enjoy freshness in
            every bite.
          </p>

          <button
            onClick={() => navigate("/menu")}
            className="mt-9 rounded-2xl bg-white px-10 py-5 text-lg font-black text-emerald-700 transition hover:scale-105 hover:bg-emerald-50"
          >
            Browse the Menu →
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}