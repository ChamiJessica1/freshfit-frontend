import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  Banknote,
  CheckCircle,
  Package,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { apiGetCart, apiCreateOrder, isAuthed } from "../api";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("ASAP (30–45 min)");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState(null); // {code, discount}

  useEffect(() => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }
    apiGetCart()
      .then(setCartItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    try {
      const stored = JSON.parse(
        localStorage.getItem("freshfit_pending_coupon")
      );
      if (stored && stored.code) setCoupon(stored);
    } catch {
      /* ignore */
    }
  }, [navigate]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      ),
    [cartItems]
  );

  const deliveryFee = 2.5;
  const discount = coupon ? Number(coupon.discount) : 0;
  const total = Math.max(subtotal - discount, 0) + deliveryFee;

  const deliveryTimes = [
    "ASAP (30–45 min)",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
  ];

  const handleConfirmOrder = async () => {
    if (!fullName.trim() || !phoneNumber.trim() || !deliveryAddress.trim()) {
      setError("Please fill in your name, phone number, and delivery address.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await apiCreateOrder({
        full_name: fullName.trim(),
        phone: phoneNumber.trim(),
        delivery_address: deliveryAddress.trim(),
        delivery_time: deliveryTime,
        payment_method: paymentMethod,
        coupon_code: coupon?.code || undefined,
      });

      // Save the order id so TrackOrderPage can fetch its details
      localStorage.setItem(
        "freshfit_latest_order_id",
        String(res.order_id)
      );
      // Coupon was consumed by the backend; clear local state
      localStorage.removeItem("freshfit_pending_coupon");

      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/track-order");
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
        <p className="px-6 py-20 text-center text-lg font-medium text-slate-500">
          Loading...
        </p>
        <Footer />
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
        <Navbar />

        <section className="flex min-h-[600px] flex-col items-center justify-center px-6 text-center">
          <Package size={78} className="text-slate-200" />
          <h1 className="mt-6 text-4xl font-black">Your cart is empty</h1>
          <p className="mt-3 text-lg font-medium text-slate-500">
            Add items before checking out.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="mt-8 rounded-full bg-emerald-600 px-8 py-4 text-lg font-black text-white transition hover:bg-emerald-700"
          >
            Browse Menu
          </button>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section className="px-6 py-10">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="mb-10 text-5xl font-black tracking-[-0.05em]">
            Checkout
          </h1>

          <div className="grid gap-10 lg:grid-cols-[1fr_440px]">
            <div className="space-y-8">
              <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="mb-7 flex items-center gap-4">
                  <User size={28} className="text-emerald-600" />
                  <h2 className="text-3xl font-black">Recipient Information</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-3 block text-lg font-medium text-slate-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setError("");
                        }}
                        placeholder="Enter your full name"
                        className="h-14 w-full rounded-2xl border border-slate-200 pl-12 pr-5 text-lg outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-lg font-medium text-slate-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setError("");
                        }}
                        placeholder="+961 00 000 000"
                        className="h-14 w-full rounded-2xl border border-slate-200 pl-12 pr-5 text-lg outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="mb-7 flex items-center gap-4">
                  <MapPin size={28} className="text-emerald-600" />
                  <h2 className="text-3xl font-black">Delivery Address</h2>
                </div>

                <textarea
                  value={deliveryAddress}
                  onChange={(e) => {
                    setDeliveryAddress(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your full delivery address, apartment/floor number, landmark..."
                  rows="4"
                  className="w-full resize-none rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none placeholder:text-slate-400 focus:border-emerald-500"
                />
              </section>

              <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="mb-7 flex items-center gap-4">
                  <Clock size={28} className="text-emerald-600" />
                  <h2 className="text-3xl font-black">Delivery Time</h2>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {deliveryTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setDeliveryTime(time)}
                      className={`rounded-2xl border px-5 py-4 text-left text-lg font-bold transition ${
                        deliveryTime === time
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="mb-7 flex items-center gap-4">
                  <CreditCard size={28} className="text-emerald-600" />
                  <h2 className="text-3xl font-black">Payment Method</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("Cash on Delivery")}
                  className="flex w-full items-center justify-between rounded-2xl border-2 border-emerald-600 bg-emerald-50 p-5 text-left"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                      <Banknote size={28} />
                    </div>

                    <div>
                      <h3 className="text-xl font-black">Cash on Delivery</h3>
                      <p className="mt-1 font-medium text-slate-500">
                        Pay in cash when your order arrives at your door.
                      </p>
                    </div>
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-emerald-600">
                    <div className="h-3 w-3 rounded-full bg-emerald-600" />
                  </div>
                </button>

                <p className="mt-5 flex items-center gap-2 font-medium text-slate-400">
                  <CheckCircle size={18} className="text-emerald-600" />
                  Please have the exact amount ready upon delivery.
                </p>
              </section>

              {error && (
                <p className="rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
                  {error}
                </p>
              )}
            </div>

            <aside className="h-fit rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-28">
              <h2 className="text-2xl font-black">Order Summary</h2>

              <div className="mt-7 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 rounded-2xl object-cover"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-bold text-slate-700">
                        {item.name}
                      </h3>
                      <p className="text-sm font-medium text-slate-400">
                        x{item.quantity}
                      </p>
                    </div>

                    <p className="text-lg font-black text-slate-700">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-7 space-y-4 border-y border-slate-100 py-6 text-lg font-medium">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({coupon.code})</span>
                    <span>−${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 flex justify-between text-2xl font-black">
                <span>Total</span>
                <span className="text-emerald-600">${total.toFixed(2)}</span>
              </div>

              <div className="mt-7 rounded-2xl bg-emerald-50 px-5 py-4 font-bold text-emerald-700">
                <Banknote size={18} className="mr-2 inline" />
                {paymentMethod}
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-5 text-xl font-black text-white transition hover:scale-[1.02] disabled:opacity-60"
              >
                <CheckCircle size={24} />
                {submitting ? "Placing order..." : "Confirm Order"}
              </button>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
