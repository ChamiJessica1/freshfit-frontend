import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Users,
  Utensils,
  Pencil,
  Ban,
  ChevronDown,
  ChevronUp,
  ChefHat,
  Clock,
  Star,
  Trash2,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  apiGetMyCateringRequests,
  apiCancelCateringRequest,
  apiGetCateringHistory,
  apiGetCateringReviews,
  apiAddCateringReview,
  apiDeleteReview,
  isAuthed,
} from "../api";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-300",
  completed: "bg-cyan-50 text-cyan-700 ring-cyan-200",
};

const STATUS_LABEL = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
  completed: "Completed",
};

const formatDate = (value) => {
  if (!value) return "—";
  try {
    const d = new Date(value);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
};

const formatDateTime = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

export default function CateringHistoryPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGetMyCateringRequests();
      setRequests(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#10291d]">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-[1080px]">
          <div className="rounded-[30px] bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-12 text-white shadow-sm">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <ChefHat size={42} strokeWidth={2.2} />
                <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-5xl">
                  My Catering Requests
                </h1>
                <p className="mt-3 max-w-xl text-lg font-medium text-white/90">
                  Review past requests, edit pending ones, and track status.
                </p>
              </div>

              <button
                onClick={() => navigate("/catering")}
                className="rounded-full bg-white px-7 py-3 text-base font-black text-emerald-600 shadow transition hover:scale-[1.03]"
              >
                + New Request
              </button>
            </div>
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="rounded-[24px] bg-white px-6 py-20 text-center shadow-sm ring-1 ring-slate-200">
                <p className="text-lg font-medium text-slate-500">Loading...</p>
              </div>
            ) : error ? (
              <p className="rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
                {error}
              </p>
            ) : requests.length === 0 ? (
              <div className="rounded-[24px] bg-white px-6 py-24 text-center shadow-sm ring-1 ring-slate-200">
                <h2 className="text-3xl font-black tracking-[-0.04em]">
                  No requests yet
                </h2>
                <p className="mx-auto mt-4 max-w-md text-lg font-medium text-slate-500">
                  Submit a catering request and we'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => navigate("/catering")}
                  className="mt-8 rounded-full bg-emerald-600 px-8 py-4 text-lg font-black text-white transition hover:bg-emerald-700"
                >
                  Request Catering
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {requests.map((r) => (
                  <RequestCard key={r.id} request={r} onChanged={load} />
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

function RequestCard({ request, onChanged }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState(null);
  const [historyError, setHistoryError] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const status = request.status;
  const canEdit = status === "pending";
  const canCancel = status === "pending" || status === "approved";

  const toggleExpand = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && history === null) {
      try {
        const data = await apiGetCateringHistory(request.id);
        setHistory(data);
      } catch (err) {
        setHistoryError(err.message);
      }
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    setCancelError("");
    try {
      await apiCancelCateringRequest(request.id, reason.trim());
      setCancelOpen(false);
      setReason("");
      onChanged();
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <article className="rounded-[24px] bg-white p-7 shadow-sm ring-1 ring-slate-200">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black tracking-[-0.02em]">
              {request.event_type}
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ring-1 ${
                STATUS_STYLES[status] || STATUS_STYLES.pending
              }`}
            >
              {STATUS_LABEL[status] || status}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Submitted {formatDateTime(request.submitted_at)}
            {request.updated_at && (
              <>
                {" · "}Last edited {formatDateTime(request.updated_at)}
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <button
              onClick={() => navigate(`/catering/edit/${request.id}`)}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700"
            >
              <Pencil size={16} />
              Edit
            </button>
          )}
          {canCancel && !cancelOpen && (
            <button
              onClick={() => setCancelOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-5 py-2.5 text-sm font-black text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-100"
            >
              <Ban size={16} />
              Cancel
            </button>
          )}
        </div>
      </header>

      <dl className="mt-6 grid gap-5 text-base md:grid-cols-2">
        <Detail icon={<CalendarDays size={18} />} label="Event Date">
          {formatDate(request.event_date)}
        </Detail>
        <Detail icon={<Users size={18} />} label="Guests">
          {request.guest_count}
        </Detail>
        <Detail icon={<MapPin size={18} />} label="Location">
          {request.event_location}
        </Detail>
        <Detail icon={<Utensils size={18} />} label="Menu Preference">
          {request.menu_preference || "—"}
        </Detail>
      </dl>

      {request.additional_notes && (
        <p className="mt-5 rounded-2xl bg-slate-50 px-5 py-4 text-base font-medium text-slate-600">
          <span className="font-bold text-slate-700">Notes: </span>
          {request.additional_notes}
        </p>
      )}

      {request.quoted_price != null && (
        <p className="mt-5 rounded-2xl bg-emerald-50 px-5 py-4 text-lg font-black text-emerald-700">
          Quoted price: ${Number(request.quoted_price).toFixed(2)}
        </p>
      )}

      {status === "cancelled" && (
        <p className="mt-5 rounded-2xl bg-slate-50 px-5 py-4 text-base text-slate-600">
          <span className="font-bold">Cancelled: </span>
          {formatDateTime(request.cancelled_at)}
          {request.cancellation_reason && (
            <>
              {" · "}
              <span className="italic">"{request.cancellation_reason}"</span>
            </>
          )}
        </p>
      )}

      {cancelOpen && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <p className="text-base font-bold text-rose-700">
            Cancel this request?
          </p>
          <p className="mt-1 text-sm text-rose-600">
            This cannot be undone. Optionally tell us why so we can improve.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Reason (optional)"
            className="mt-4 w-full resize-none rounded-xl border border-rose-200 bg-white px-4 py-3 text-base outline-none focus:border-rose-400"
          />
          {cancelError && (
            <p className="mt-3 text-sm font-bold text-rose-600">{cancelError}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-rose-700 disabled:opacity-60"
            >
              {cancelling ? "Cancelling..." : "Confirm Cancellation"}
            </button>
            <button
              onClick={() => {
                setCancelOpen(false);
                setReason("");
                setCancelError("");
              }}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              Keep Request
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggleExpand}
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
      >
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        {expanded ? "Hide timeline" : "View status timeline"}
      </button>

      {expanded && (
        <div className="mt-5 rounded-2xl bg-slate-50 p-5">
          {historyError ? (
            <p className="text-sm font-bold text-rose-500">{historyError}</p>
          ) : history === null ? (
            <p className="text-sm text-slate-500">Loading timeline...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-slate-500">No status changes yet.</p>
          ) : (
            <ol className="space-y-4">
              {history.map((h) => (
                <li key={h.id} className="flex gap-4">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 ring-1 ring-slate-200">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-700">
                      {h.previous_status
                        ? `${STATUS_LABEL[h.previous_status] || h.previous_status} → ${
                            STATUS_LABEL[h.new_status] || h.new_status
                          }`
                        : STATUS_LABEL[h.new_status] || h.new_status}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatDateTime(h.changed_at)}
                    </p>
                    {h.note && (
                      <p className="mt-1 text-sm italic text-slate-600">
                        "{h.note}"
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
      {(status === "approved" || status === "completed") && (
        <CateringReviewPanel cateringRequestId={request.id} />
      )}
    </article>
  );
}

function CateringReviewPanel({ cateringRequestId }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [myReview, setMyReview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const loadReview = async () => {
    try {
      const list = await apiGetCateringReviews(cateringRequestId);
      const mine = Array.isArray(list) && list.length ? list[0] : null;
      setMyReview(mine);
      if (mine) {
        setRating(mine.rating);
        setComment(mine.comment || "");
      }
      setErr("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoaded(true);
    }
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !loaded) loadReview();
  };

  const submit = async () => {
    setBusy(true);
    setErr("");
    try {
      await apiAddCateringReview(cateringRequestId, rating, comment.trim());
      await loadReview();
      setEditing(false);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!myReview) return;
    setBusy(true);
    setErr("");
    try {
      await apiDeleteReview(myReview.id);
      setMyReview(null);
      setRating(5);
      setComment("");
      setEditing(false);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const showForm = !myReview || editing;

  return (
    <div className="mt-5">
      <button
        onClick={toggle}
        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
      >
        <Star
          size={16}
          className={myReview ? "fill-yellow-400 text-yellow-400" : ""}
        />
        {open ? "Hide review" : myReview ? "Your review" : "Leave a review"}
      </button>

      {open && (
        <div className="mt-4 rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
          {!loaded ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : showForm ? (
            <>
              <p className="text-sm font-bold text-slate-700">
                {myReview
                  ? "Edit your review"
                  : "How was your catering experience?"}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">
                  Rating:
                </span>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  >
                    <Star
                      size={22}
                      className={
                        n <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your reaction and any comments (optional)"
                className="mt-4 w-full resize-none rounded-xl border border-emerald-200 bg-white px-4 py-3 text-base outline-none focus:border-emerald-400"
              />

              {err && (
                <p className="mt-3 text-sm font-bold text-rose-600">{err}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={submit}
                  disabled={busy}
                  className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {busy
                    ? "Saving..."
                    : myReview
                    ? "Update review"
                    : "Submit review"}
                </button>
                {myReview && (
                  <button
                    onClick={() => {
                      setEditing(false);
                      setRating(myReview.rating);
                      setComment(myReview.comment || "");
                      setErr("");
                    }}
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                {Array.from({ length: myReview.rating }).map((_, i) => (
                  <Star
                    key={`f${i}`}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
                {Array.from({ length: 5 - myReview.rating }).map((_, i) => (
                  <Star key={`e${i}`} size={18} className="text-slate-300" />
                ))}
              </div>

              {myReview.comment && (
                <p className="mt-3 text-base font-medium text-slate-600">
                  "{myReview.comment}"
                </p>
              )}

              {err && (
                <p className="mt-3 text-sm font-bold text-rose-600">{err}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-emerald-600 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
                >
                  <Pencil size={15} />
                  Edit
                </button>
                <button
                  onClick={remove}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-5 py-2.5 text-sm font-black text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-100 disabled:opacity-60"
                >
                  <Trash2 size={15} />
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-emerald-600">{icon}</div>
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 text-base font-bold text-[#10291d]">{children}</p>
      </div>
    </div>
  );
}
