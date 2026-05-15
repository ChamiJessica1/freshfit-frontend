import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ChefHat,
  Bike,
  MapPin,
  Clock,
  Package,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  apiGetOrderDetails,
  apiGetOrderTracking,
  apiGetUserOrders,
  isAuthed,
} from "../api";

const STAGE_DEFS = [
  {
    key: "pending",
    title: "Order Received",
    description: "We've got your order and are processing it.",
    icon: <CheckCircle size={28} />,
  },
  {
    key: "preparing",
    title: "Preparing Meal",
    description: "Our chefs are carefully preparing your meal.",
    icon: <ChefHat size={28} />,
  },
  {
    key: "out_for_delivery",
    title: "Out for Delivery",
    description: "Your order is on its way to you!",
    icon: <Bike size={28} />,
  },
  {
    key: "delivered",
    title: "Delivered!",
    description: "Your meal has been delivered. Enjoy!",
    icon: <CheckCircle size={28} />,
  },
];

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        let orderId = localStorage.getItem("freshfit_latest_order_id");

        // Fall back to most recent order if no id stored
        if (!orderId) {
          const orders = await apiGetUserOrders();
          if (orders && orders.length > 0) {
            orderId = orders[0].id;
            const found = orders[0];
            setOrder(found);
          } else {
            setOrder(null);
            return;
          }
        } else {
          // Get the order summary (status, address, etc.) from user orders
          const orders = await apiGetUserOrders();
          const found = orders.find(
            (o) => String(o.id) === String(orderId)
          );
          if (found) setOrder(found);
        }

        const [details, trackingRows] = await Promise.all([
          apiGetOrderDetails(orderId),
          apiGetOrderTracking(orderId),
        ]);

        setItems(details);
        setTracking(trackingRows);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      ),
    [items]
  );

  const stages = useMemo(() => {
    const reachedStages = new Set(tracking.map((t) => t.stage));
    const currentStage = order?.status;
    return STAGE_DEFS.map((def) => ({
      ...def,
      active: reachedStages.has(def.key) && def.key !== currentStage,
      current: def.key === currentStage,
    }));
  }, [tracking, order]);

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

  if (error) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
        <Navbar />
        <p className="px-6 py-20 text-center text-lg font-medium text-red-500">
          {error}
        </p>
        <Footer />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
        <Navbar />

        <section className="flex min-h-[600px] flex-col items-center justify-center px-6 text-center">
          <Package size={80} className="text-slate-200" />
          <h1 className="mt-6 text-4xl font-black">No active order found</h1>
          <button
            onClick={() => navigate("/menu")}
            className="mt-8 rounded-full bg-emerald-600 px-8 py-4 text-lg font-black text-white"
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
        <div className="mx-auto max-w-[820px]">
          <h1 className="text-5xl font-black tracking-[-0.05em]">
            Track Your Order
          </h1>

          <p className="mt-5 text-xl font-medium text-slate-500">
            Order ID:{" "}
            <span className="font-black text-emerald-600">#{order.id}</span>
          </p>

          <div className="mt-10 grid gap-6 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
            <div className="flex gap-4">
              <MapPin size={25} className="text-cyan-400" />
              <div>
                <p className="font-medium text-slate-400">Delivering to</p>
                <p className="text-lg font-medium">{order.delivery_address}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock size={25} className="text-cyan-400" />
              <div>
                <p className="font-medium text-slate-400">Estimated Delivery</p>
                <p className="text-lg font-medium">{order.delivery_time}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-200">
            <div className="relative space-y-10">
              <div className="absolute left-[35px] top-12 h-[calc(100%-70px)] w-[2px] bg-slate-200" />

              {stages.map((stage) => (
                <div key={stage.key} className="relative flex gap-7">
                  <div
                    className={`z-10 flex h-[72px] w-[72px] items-center justify-center rounded-2xl ${
                      stage.active
                        ? "bg-emerald-600 text-white"
                        : stage.current
                        ? "bg-cyan-300 text-white"
                        : "bg-slate-100 text-slate-300"
                    }`}
                  >
                    {stage.icon}
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center gap-3">
                      <h2
                        className={`text-xl font-black ${
                          stage.active || stage.current
                            ? "text-[#10291d]"
                            : "text-slate-300"
                        }`}
                      >
                        {stage.title}
                      </h2>

                      {stage.current && (
                        <span className="rounded-full bg-cyan-400 px-3 py-1 text-sm font-black text-white">
                          Current
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-1 font-medium ${
                        stage.active || stage.current
                          ? "text-slate-500"
                          : "text-slate-300"
                      }`}
                    >
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">Order Items</h2>

            <div className="mt-7 divide-y divide-slate-100">
              {items.map((item) => (
                <div
                  key={item.menu_item_id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="font-medium text-slate-400">
                        x{item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-black text-emerald-600">
                    ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between border-t border-slate-100 pt-5 text-2xl font-black">
              <span>Total</span>
              <span className="text-emerald-600">
                ${Number(order.total ?? total).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <button
              onClick={() => navigate("/menu")}
              className="rounded-2xl bg-emerald-600 px-8 py-5 text-xl font-black text-white transition hover:bg-emerald-700"
            >
              Order Again
            </button>

            <button
              onClick={() => navigate("/order-history")}
              className="rounded-2xl border-2 border-emerald-600 px-8 py-5 text-xl font-black text-emerald-600 transition hover:bg-emerald-50"
            >
              Order History
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
