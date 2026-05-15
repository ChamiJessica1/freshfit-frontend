import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Gift,
  Heart,
  Wallet,
  Utensils,
  CalendarDays,
  HandPlatter,
  Star,
  ShoppingCart,
  Edit,
  ArrowRight,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  apiGetUserOrders,
  apiGetFavorites,
  apiGetProfile,
  apiGetLoyaltyAccount,
  isAuthed,
} from "../api";

export default function ProfileDashboardPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loyalty, setLoyalty] = useState({ total_points: 0, total_coupons: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const [ordersList, favs, prof, loy] = await Promise.all([
          apiGetUserOrders().catch(() => []),
          apiGetFavorites().catch(() => []),
          apiGetProfile().catch(() => null),
          apiGetLoyaltyAccount().catch(() => ({
            total_points: 0,
            total_coupons: 0,
          })),
        ]);

        setOrders(ordersList);
        setFavoritesCount(favs.length);
        setProfile(prof);
        setLoyalty(loy);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const { totalOrders, totalSpent } = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((s, o) => s + Number(o.total || 0), 0);
    return { totalOrders, totalSpent };
  }, [orders]);

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: <Package size={28} />,
      color: "from-emerald-600 to-emerald-500",
    },
    {
      label: "Available Coupons",
      value: loyalty.total_coupons || 0,
      icon: <Gift size={28} />,
      color: "from-cyan-400 to-cyan-300",
    },
    {
      label: "Favorites",
      value: favoritesCount,
      icon: <Heart size={28} />,
      color: "from-pink-500 to-pink-400",
    },
    {
      label: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: <Wallet size={28} />,
      color: "from-amber-500 to-amber-400",
    },
  ];

  const quickActions = [
    { label: "Menu", path: "/menu", icon: <Utensils size={26} /> },
    { label: "Favorites", path: "/favorites", icon: <Heart size={26} /> },
    {
      label: "Subscriptions",
      path: "/subscriptions",
      icon: <CalendarDays size={26} />,
    },
    {
      label: "Catering",
      path: "/catering",
      icon: <HandPlatter size={26} />,
    },
    { label: "Loyalty", path: "/loyalty", icon: <Star size={26} /> },
    { label: "Cart", path: "/cart", icon: <ShoppingCart size={26} /> },
  ];

  const recentOrders = orders.slice(0, 3);

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
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-4">
              <LayoutDashboard size={36} className="text-emerald-600" />
              <div>
                <h1 className="text-5xl font-black tracking-[-0.05em]">
                  {profile?.full_name
                    ? `Welcome back, ${profile.full_name.split(" ")[0]}`
                    : "Dashboard"}
                </h1>
                <p className="mt-2 text-lg font-medium text-slate-500">
                  Manage your orders, rewards, and preferences in one place.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/profile/edit")}
              className="inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-7 py-4 text-lg font-black text-white transition hover:bg-emerald-700"
            >
              <Edit size={20} />
              Edit Profile
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${stat.color} text-white`}
                >
                  {stat.icon}
                </div>
                <p className="text-sm font-black uppercase tracking-wide text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-4xl font-black text-[#10291d]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-black">Quick Actions</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {quickActions.map((a) => (
                <button
                  key={a.path}
                  onClick={() => navigate(a.path)}
                  className="group flex flex-col items-center gap-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:ring-emerald-300"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                    {a.icon}
                  </span>
                  <span className="text-base font-black text-[#10291d]">
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-black">Recent Orders</h2>
              <button
                onClick={() => navigate("/order-history")}
                className="inline-flex items-center gap-2 text-base font-black text-emerald-600 hover:text-emerald-700"
              >
                View all
                <ArrowRight size={18} />
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package size={56} className="text-slate-200" />
                <p className="mt-5 text-lg font-medium text-slate-500">
                  No orders yet — your meal history will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-lg font-black text-emerald-600">
                        #{order.id}
                      </p>
                      <p className="text-sm font-medium text-slate-400">
                        {(order.created_at || "").split("T")[0]}
                      </p>
                    </div>

                    <div className="flex items-center gap-5">
                      <span
                        className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                          order.status === "delivered"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-cyan-100 text-blue-600"
                        }`}
                      >
                        {order.status}
                      </span>

                      <p className="text-xl font-black text-[#10291d]">
                        ${Number(order.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
