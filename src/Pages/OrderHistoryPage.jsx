import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, RotateCcw, Package } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  apiGetUserOrders,
  apiGetOrderDetails,
  apiAddToCart,
  isAuthed,
} from "../api";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const list = await apiGetUserOrders();
        setOrders(list);

        // Fetch items for each order in parallel
        const itemsByOrder = {};
        await Promise.all(
          list.map(async (order) => {
            try {
              itemsByOrder[order.id] = await apiGetOrderDetails(order.id);
            } catch {
              itemsByOrder[order.id] = [];
            }
          })
        );
        setOrderItemsMap(itemsByOrder);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const handleTrack = (order) => {
    localStorage.setItem("freshfit_latest_order_id", String(order.id));
    navigate("/track-order");
  };

  const handleReorder = async (order) => {
    const items = orderItemsMap[order.id] || [];
    try {
      for (const item of items) {
        await apiAddToCart(item.menu_item_id, item.quantity);
      }
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/cart");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section className="px-6 py-10">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-10 flex items-center gap-4">
            <History size={36} className="text-emerald-600" />
            <h1 className="text-5xl font-black tracking-[-0.05em]">
              Order History
            </h1>
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
          ) : orders.length === 0 ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl bg-white text-center shadow-sm ring-1 ring-slate-200">
              <Package size={76} className="text-slate-200" />
              <h2 className="mt-6 text-3xl font-black">No orders yet</h2>
              <p className="mt-3 text-lg font-medium text-slate-500">
                Your previous orders will appear here.
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="mt-8 rounded-full bg-emerald-600 px-8 py-4 text-lg font-black text-white"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-7">
              {orders.map((order) => {
                const items = orderItemsMap[order.id] || [];
                const isDelivered = order.status === "delivered";
                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
                  >
                    <div className="grid gap-6 border-b border-slate-100 p-7 md:grid-cols-3">
                      <div>
                        <p className="font-medium text-slate-400">Order ID</p>
                        <h2 className="text-2xl font-black text-emerald-600">
                          #{order.id}
                        </h2>
                      </div>

                      <div>
                        <p className="font-medium text-slate-400">Date</p>
                        <h2 className="text-xl font-medium">
                          {(order.created_at || "").split("T")[0] || "—"}
                        </h2>
                      </div>

                      <div className="md:text-right">
                        <span
                          className={`inline-block rounded-full px-5 py-2 font-bold ${
                            isDelivered
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-cyan-100 text-blue-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-7">
                      <div className="flex flex-wrap gap-4">
                        {items.map((item) => (
                          <div
                            key={item.menu_item_id}
                            className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                          >
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="h-12 w-12 rounded-xl object-cover"
                              />
                            )}
                            <div>
                              <p className="font-bold">{item.name}</p>
                              <p className="text-sm font-medium text-slate-400">
                                x{item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="font-medium text-slate-400">
                            Total Paid
                          </p>
                          <p className="text-2xl font-black text-emerald-600">
                            ${Number(order.total).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          {!isDelivered && (
                            <button
                              onClick={() => handleTrack(order)}
                              className="rounded-2xl border-2 border-cyan-400 px-7 py-3 text-lg font-black text-cyan-400 transition hover:bg-cyan-50"
                            >
                              Track
                            </button>
                          )}

                          <button
                            onClick={() => handleReorder(order)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3 text-lg font-black text-white transition hover:bg-emerald-700"
                          >
                            <RotateCcw size={18} />
                            Reorder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
