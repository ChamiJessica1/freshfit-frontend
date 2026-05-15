import { useNavigate } from "react-router-dom";
import { Leaf, Zap, Heart, Star, ArrowRight } from "lucide-react";
import Footer from "../Components/Footer";




export default function Home() {
   const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f6f8f3] font-sans text-[#10291d] antialiased">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-emerald-900/10 bg-white/95 px-6 py-4 shadow-sm backdrop-blur md:px-10">
        <div className="flex w-full items-center justify-between ">
          <div />

          <div className="flex items-center gap-4 text-[15px] font-semibold text-slate-600 md:gap-6">
            <a
              href="#menu"
              className="hidden transition duration-300 hover:text-emerald-600 md:inline-block"
            >
              Explore Menu
            </a>
            <button 
                onClick={()=> navigate("/login")}
              className="rounded-full border-2 border-emerald-600 px-6 py-2.5 text-emerald-600 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-600/20 active:scale-95">
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-full bg-emerald-600 px-6 py-2.5 text-white shadow-md shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-95">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-[calc(100vh-81px)] bg-gradient-to-br from-[#eefaf3] via-[#e7f7f6] to-[#dff5f8] px-6 py-16 md:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-7 flex items-center gap-2 text-base font-semibold tracking-wide text-emerald-600 md:text-lg">
              <Leaf size={20} /> Personalized Healthy Eating
            </p>

            <h1 className="mb-8 max-w-3xl text-5xl font-black leading-[1.05] tracking-[-0.04em] text-[#112b1f] md:text-6xl lg:text-7xl">
              Eat Fresh,
              <br />
              <span className="text-emerald-600">Live Fit</span>, Feel
              <br />
              Amazing
            </h1>

            <p className="mb-10 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
              Discover personalized healthy meals, desserts, and soups crafted
              for your dietary needs. Fresh ingredients, delivered daily to
              your door.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <button
                  onClick={() => navigate("/signup")}
                  className="group rounded-full bg-gradient-to-r from-emerald-600 to-cyan-400 px-9 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-400/30 active:scale-95">
                    Start Your Journey
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl rounded-[2rem] bg-white/80 p-6 shadow-2xl shadow-slate-900/10 ring-1 ring-white/80 backdrop-blur">
            <img
              src="/Logo.png"
              alt="Fresh&Fit presentation"
              className="h-[360px] w-full rounded-[1.5rem] object-contain md:h-[400px]"
            />
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-[520px] grid-cols-3 gap-6 text-center md:mx-0 md:ml-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))]">
          <Stat number="10K+" label="Happy Users" />
          <Stat number="200+" label="Healthy Meals" />
          <Stat number="4.9★" label="App Rating" />
        </div>
      </section>

      {/* Why Choose */}
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 className="text-4xl font-black tracking-[-0.03em] md:text-5xl">
            Why Choose Fresh&Fit?
          </h2>
          <p className="mt-5 text-lg text-slate-500 md:text-xl">
            Everything you need for a healthy lifestyle
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Feature
              icon={<Leaf size={36} />}
              color="bg-emerald-600"
              title="100% Fresh Ingredients"
              text="Farm-to-table produce sourced from local farmers every morning."
            />
            <Feature
              icon={<Zap size={36} />}
              color="bg-cyan-400"
              title="Fast Delivery"
              text="Get your healthy meals delivered in under 45 minutes."
            />
            <Feature
              icon={<Heart size={36} />}
              color="bg-pink-400"
              title="Personalized for You"
              text="Meals tailored to your dietary preferences and health goals."
            />
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className=" mb-12 flex items-center justify-between gap-6">
            <h2 className="text-4xl font-black tracking-[-0.03em]">
              Explore Our Menu
            </h2>
            <button 
               onClick={()=> navigate("/menu")}
              className="group flex items-center gap-2 text-lg font-bold text-emerald-600 transition-all duration-300 hover:gap-3 hover:text-emerald-700">
              View All
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <MenuCard
              title="Healthy Meals"
              count="50+ options"
              tag="Most Popular"
              image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900"
            />
            <MenuCard
              title="Healthy Desserts"
              count="25+ options"
              tag="Fan Favorite"
              image="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900"
            />
            <MenuCard
              title="Soups"
              count="30+ options"
              tag="Comfort Food"
              image="https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 className="text-4xl font-black tracking-[-0.03em] md:text-5xl">
            How It Works
          </h2>
          <p className="mt-5 text-lg text-slate-500 md:text-xl">
            Get started in 4 simple steps
          </p>

          <div className="mt-16 grid gap-12 md:grid-cols-4">
            <Step number="01" title="Create Account" text="Sign up and tell us your dietary preferences" />
            <Step number="02" title="Explore Menu" text="Browse personalized meals matching your goals" blue />
            <Step number="03" title="Place Order" text="Add to cart and checkout in seconds" />
            <Step number="04" title="Get Delivered" text="Receive fresh meals at your doorstep" blue />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#e8f7f1] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 className="text-4xl font-black tracking-[-0.03em] md:text-5xl">
            What Our Customers Say
          </h2>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Testimonial
              name="Sarah M."
              text="Fresh&Fit changed my relationship with food. I love how every meal is tailored to my keto needs!"
            />
            <Testimonial
              name="James K."
              text="The desserts are incredible — guilt-free and so delicious. I'm genuinely impressed."
            />
            <Testimonial
              name="Priya N."
              text="Fast delivery, fresh ingredients, and the loyalty program is a great bonus. Highly recommend!"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white px-8 py-16 text-center shadow-xl shadow-slate-900/10 ring-1 ring-black/5">
          <h2 className="text-4xl font-black tracking-[-0.03em] md:text-5xl">
            Ready to Start Your Healthy Journey?
          </h2>
          <p className="mt-6 text-lg text-slate-500 md:text-xl">
            Join 10,000+ happy customers eating fresh every day.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <button
                onClick={() => navigate("/signup")}
              className="group rounded-full bg-gradient-to-r from-emerald-600 to-cyan-400 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-400/30 active:scale-95">
              Create Free Account
            </button>
            <button 
              onClick={() => navigate("/menu")}
              className="rounded-full border-2 border-emerald-600 px-10 py-4 text-lg font-bold text-emerald-600 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600 hover:text-white hover:shadow-xl hover:shadow-emerald-600/20 active:scale-95">
              Browse Menu First
            </button>
          </div>
        </div>
      </section>
      
 {/* Footer */}
      <Footer />
    </main>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <h3 className="text-2xl font-black text-emerald-600 md:text-3xl">{number}</h3>
      <p className="mt-1 text-sm font-medium text-slate-600 md:text-base">{label}</p>
    </div>
  );
}

function Feature({ icon, color, title, text }) {
  return (
    <div className="group rounded-3xl bg-white p-10 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/10 md:p-12">
      <div className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl ${color} text-white transition duration-300 group-hover:rotate-3 group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="mb-4 text-2xl font-extrabold tracking-[-0.02em]">{title}</h3>
      <p className="text-lg leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}

function MenuCard({ title, count, tag, image }) {
  return (
    <div className="group relative h-72 overflow-hidden rounded-2xl shadow-lg shadow-slate-900/10">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="absolute bottom-6 left-6 text-white">
        <span className="mb-4 inline-block rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold shadow-md">
          {tag}
        </span>
        <h3 className="text-2xl font-black tracking-[-0.02em]">{title}</h3>
        <p className="mt-1 text-lg font-medium text-white/90">{count}</p>
      </div>
    </div>
  );
}

function Step({ number, title, text, blue }) {
  return (
    <div className="group">
      <div
        className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-3 group-hover:shadow-xl ${
          blue ? "bg-cyan-400 shadow-cyan-400/20" : "bg-emerald-600 shadow-emerald-600/20"
        }`}
      >
        {number}
      </div>
      <h3 className="mb-3 text-2xl font-extrabold tracking-[-0.02em]">{title}</h3>
      <p className="mx-auto max-w-xs text-lg leading-7 text-slate-500">{text}</p>
    </div>
  );
}

function Testimonial({ name, text }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-left shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/10">
      <div className="mb-5 flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={22} className="fill-yellow-400" />
        ))}
      </div>
      <p className="mb-8 text-lg leading-relaxed text-slate-600">"{text}"</p>
      <p className="font-bold text-emerald-600">— {name}</p>
    </div>
  );
}



