import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  LayoutDashboard,
  Edit,
  History,
  Gift,
  LogOut,
  Utensils,
  CalendarDays,
  HandPlatter,
  Star,
  Shield,
} from "lucide-react";
import { apiGetCart, clearAuth, getCurrentUser, isAuthed } from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const readCart = async () => {
      if (!isAuthed() || isAdmin) {
        setCartCount(0);
        return;
      }
      try {
        const items = await apiGetCart();
        setCartCount(items.reduce((sum, item) => sum + Number(item.quantity), 0));
      } catch {
        setCartCount(0);
      }
    };
    readCart();
    window.addEventListener("cartUpdated", readCart);
    return () => {
      window.removeEventListener("cartUpdated", readCart);
    };
  }, [isAdmin]);

  const navLinks = [
    { label: "Menu", path: "/menu", icon: <Utensils size={18} /> },
    { label: "Favorites", path: "/favorites", icon: <Heart size={18} /> },
    {
      label: "Subscriptions",
      path: "/subscriptions",
      icon: <CalendarDays size={18} />,
    },
    {
      label: "Catering",
      path: "/catering",
      icon: <HandPlatter size={18} />,
    },
    { label: "Loyalty", path: "/loyalty", icon: <Star size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    clearAuth();
    setProfileOpen(false);
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/login");
  };

  /* -------- Admin-only navbar -------- */
  if (isAdmin) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-800 dark:bg-[#0f1a14]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-3 text-xl font-bold text-emerald-600"
          >
            Fresh&Fit
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
              Admin
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-700 to-cyan-500 px-3 py-1.5 text-xs font-bold text-white shadow ring-1 ring-emerald-600/30 transition hover:opacity-90"
              title="Admin Panel"
            >
              <Shield size={14} />
              Admin Panel
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  /* -------- Customer navbar -------- */
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-800 dark:bg-[#0f1a14]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="text-xl font-bold text-emerald-600"
        >
          Fresh&Fit
        </button>

        {/* Center Nav Links */}
        <div className="hidden items-center gap-8 text-[17px] font-medium text-gray-500 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`flex items-center gap-2 transition ${
                isActive(link.path)
                  ? "font-semibold text-emerald-600"
                  : "hover:text-emerald-600"
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate("/cart")}
            className="relative text-gray-500 hover:text-emerald-600"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-black text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 text-gray-500 hover:text-emerald-600"
            >
              <User size={22} />
              <ChevronDown size={16} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-xl border bg-white shadow-lg">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/dashboard");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile/edit");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100"
                >
                  <Edit size={18} /> Edit Profile
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/order-history");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100"
                >
                  <History size={18} /> Order History
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/loyalty");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100"
                >
                  <Gift size={18} /> Loyalty
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-gray-100"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
