import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Tag, Package } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  apiGetCart,
  apiUpdateCartItem,
  apiRemoveCartItem,
  apiApplyCoupon,
  isAuthed,
} from "../api";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const items = await apiGetCart();
      setCartItems(items);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const updateQuantity = async (cart_item_id, newQty) => {
    if (newQty <= 0) {
      await apiRemoveCartItem(cart_item_id);
    } else {
      await apiUpdateCartItem(cart_item_id, newQty);
    }
    window.dispatchEvent(new Event("cartUpdated"));
    refresh();
  };

  const removeItem = async (cart_item_id) => {
    await apiRemoveCartItem(cart_item_id);
    window.dispatchEvent(new Event("cartUpdated"));
    refresh();
  };

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      ),
    [cartItems]
  );

  const total = Math.max(subtotal - discount, 0);

  const applyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      localStorage.removeItem("freshfit_pending_coupon");
      return;
    }
    try {
      const res = await apiApplyCoupon(code, subtotal);
      setDiscount(Number(res.discount));
      setMessage(`Coupon applied: -$${Number(res.discount).toFixed(2)}`);
      // Persist so CheckoutPage can send it with the order
      localStorage.setItem(
        "freshfit_pending_coupon",
        JSON.stringify({ code: res.code, discount: Number(res.discount) })
      );
    } catch (err) {
      setDiscount(0);
      setMessage(err.message);
      localStorage.removeItem("freshfit_pending_coupon");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section className="px-6 py-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 flex items-center gap-4">
            <ShoppingBag size={34} className="text-emerald-600" />
            <h1 className="text-5xl font-black tracking-[-0.05em]">
              Shopping Cart
            </h1>
            <span className="text-xl font-medium text-slate-500">
              ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
            </span>
          </div>

          {error && (
            <p className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-center text-lg font-medium text-slate-500">
              Loading...
            </p>
          ) : cartItems.length === 0 ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
              <Package size={80} className="text-slate-200" />
              <h2 className="mt-7 text-2xl font-medium text-slate-500">
                Your cart is empty
              </h2>
              <p className="mt-4 text-lg font-medium text-slate-400">
                Add some healthy meals to get started!
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="mt-8 rounded-full bg-emerald-600 px-8 py-4 text-xl font-black text-white transition hover:bg-emerald-700"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1fr_440px]">
              <div>
                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-24 w-24 rounded-2xl object-cover"
                        />
                      )}

                      <div className="flex-1">
                        <h2 className="text-2xl font-black">{item.name}</h2>
                        <p className="mt-1 font-medium text-slate-500">
                          ${Number(item.price).toFixed(2)} each
                        </p>

                        <div className="mt-4 inline-flex items-center overflow-hidden rounded-full border border-slate-200">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-4 py-1 text-xl font-bold hover:bg-slate-50"
                          >
                            −
                          </button>
                          <span className="px-6 py-1 font-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-4 py-1 text-xl font-bold hover:bg-slate-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-8">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 transition hover:text-red-500"
                        >
                          <Trash2 size={22} />
                        </button>

                        <p className="text-2xl font-black text-emerald-600">
                          ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/menu")}
                  className="mt-6 text-lg font-bold text-emerald-600 hover:text-emerald-700"
                >
                  ← Continue Shopping
                </button>
              </div>

              <aside className="h-fit rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-2xl font-black">Order Summary</h2>

                <div className="mt-7">
                  <label className="mb-3 block text-lg font-medium text-slate-600">
                    Coupon Code
                  </label>

                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Tag
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className="h-14 w-full rounded-2xl border border-slate-200 pl-12 pr-4 text-lg outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      onClick={applyCoupon}
                      className="rounded-2xl bg-emerald-600 px-6 font-black text-white transition hover:bg-emerald-700"
                    >
                      Apply
                    </button>
                  </div>

                  {message && (
                    <p className="mt-3 text-sm font-bold text-emerald-600">
                      {message}
                    </p>
                  )}
                </div>

                <div className="mt-7 space-y-4 border-y border-slate-100 py-6 text-lg font-medium">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>−${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500">
                    <span>Delivery</span>
                    <span className="text-emerald-600">$2.50</span>
                  </div>
                </div>

                <div className="mt-5 flex justify-between text-2xl font-black">
                  <span>Total</span>
                  <span className="text-emerald-600">
                    ${(total + 2.5).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-7 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-5 text-xl font-black text-white transition hover:scale-[1.02]"
                >
                  Checkout →
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
