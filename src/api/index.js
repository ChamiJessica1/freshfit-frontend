// Single API client for the Fresh&Fit backend.
// API base resolution order:
//   1. VITE_API_BASE if set in env (explicit override)
//   2. http://localhost:5000/api when the app itself is served from localhost
// This means the same build works both locally and on the public URL.
// Token + current user are stored in localStorage.

const PROD_API = "https://freshfit-backend-production.up.railway.app/api";
const LOCAL_API = "http://localhost:5000/api";

const resolveApiBase = () => {
  if (import.meta.env.VITE_API_BASE)
    return import.meta.env.VITE_API_BASE;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return LOCAL_API;
  }
  return PROD_API;
};

 const API_BASE = resolveApiBase();
//const API_BASE = PROD_API;


// ---------- auth state ----------
const TOKEN_KEY = "freshfit_token";
const USER_KEY = "freshfit_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
};
export const isAuthed = () => Boolean(getToken());
export const setAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ---------- core fetcher ----------
const DEFAULT_TIMEOUT_MS = 10000;

const request = async (path, { method = "GET", body, auth = false } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw new Error(
      "Cannot reach the server. Make sure the backend is running on port 5000."
    );
  }
  clearTimeout(timeoutId);

  // 401 / 403 → kick the user back to login
  if (res.status === 401 || res.status === 403) {
    clearAuth();
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* empty body is fine */
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};

// ---------- AUTH ----------
export const register = (payload) =>
  request("/auth/register", { method: "POST", body: payload });

export const login = (payload) =>
  request("/auth/login", { method: "POST", body: payload });

export const forgotPassword = (email) =>
  request("/auth/forgot-password", { method: "POST", body: { email } });

export const resetPassword = (token, newPassword) =>
  request("/auth/reset-password", {
    method: "POST",
    body: { token, newPassword },
  });

// ---------- MENU ----------
// Backend returns rows from menu_item with image_url. Frontend pages expect
// an `image` field, so we adapt here.
const adaptMenuItem = (row) => ({
  id: row.id,
  name: row.name,
  section: row.section,
  description: row.description,
  price: Number(row.price),
  calories: row.calories,
  protein: row.protein,
  carbs: row.carbs,
  fat: row.fat,
  ingredients: Array.isArray(row.ingredients)
    ? row.ingredients
    : safeParseJSON(row.ingredients, []),
  dietary_tags: Array.isArray(row.dietary_tags)
    ? row.dietary_tags
    : safeParseJSON(row.dietary_tags, []),
  allergens: Array.isArray(row.allergens)
    ? row.allergens
    : safeParseJSON(row.allergens, []),
  image: row.image_url || row.image,
});

const safeParseJSON = (v, fallback) => {
  if (!v) return fallback;
  if (typeof v !== "string") return fallback;
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
};

export const getMenu = async () => {
  const items = await request("/menu");
  return items.map(adaptMenuItem);
};

export const getPersonalizedMenu = async () => {
  const items = await request("/menu/personalized", { auth: true });
  return items.map(adaptMenuItem);
};

// ---------- CART ----------
export const apiAddToCart = (menu_item_id, quantity = 1) =>
  request("/cart/add", {
    method: "POST",
    auth: true,
    body: { menu_item_id, quantity },
  });

export const apiGetCart = async () => {
  const user = getCurrentUser();
  if (!user) throw new Error("Not logged in");
  const rows = await request(`/cart/${user.id}`, { auth: true });
  // Adapt rows: backend returns { id, menu_item_id, name, price, quantity }
  // Frontend pages expect { id (cart_item_id), menu_item_id, name, price, quantity, image, ... }
  return rows.map((r) => ({
    id: r.id,
    menu_item_id: r.menu_item_id,
    name: r.name,
    price: Number(r.price),
    quantity: r.quantity,
    image: r.image_url || null,
  }));
};

export const apiUpdateCartItem = (cart_item_id, quantity) =>
  request("/cart/update", {
    method: "PUT",
    auth: true,
    body: { cart_item_id, quantity },
  });

export const apiRemoveCartItem = (cart_item_id) =>
  request(`/cart/remove/${cart_item_id}`, { method: "DELETE", auth: true });

// ---------- ORDERS ----------
export const apiCreateOrder = (payload) =>
  request("/order", { method: "POST", auth: true, body: payload });

export const apiGetOrderDetails = (order_id) =>
  request(`/order/details/${order_id}`, { auth: true });

export const apiGetUserOrders = async () => {
  const user = getCurrentUser();
  if (!user) throw new Error("Not logged in");
  return request(`/order/${user.id}`, { auth: true });
};

export const apiGetOrderTracking = (order_id) =>
  request(`/order/tracking/${order_id}`, { auth: true });

export const apiUpdateOrderStatus = (order_id, status) =>
  request("/order/status", {
    method: "PUT",
    auth: true,
    body: { order_id, status },
  });

// ---------- PROFILE ----------
export const apiGetProfile = () => request("/profile", { auth: true });

export const apiUpdateProfile = (payload) =>
  request("/profile", { method: "PUT", auth: true, body: payload });

// ---------- DIETARY ----------
export const apiGetAllergies = () => request("/dietary/allergies");

export const apiGetDietaryProfile = () => request("/dietary", { auth: true });

export const apiSaveDietaryProfile = (diet_type, allergies) =>
  request("/dietary", {
    method: "POST",
    auth: true,
    body: { diet_type, allergies },
  });

// ---------- FAVORITES ----------
export const apiGetFavorites = () => request("/favorite", { auth: true });

export const apiAddFavorite = (menu_item_id) =>
  request("/favorite", {
    method: "POST",
    auth: true,
    body: { menu_item_id },
  });

export const apiRemoveFavorite = (favorite_id) =>
  request(`/favorite/${favorite_id}`, { method: "DELETE", auth: true });

// ---------- COUPONS ----------
export const apiApplyCoupon = (code, subtotal) =>
  request("/coupon/apply", {
    method: "POST",
    auth: true,
    body: { code, subtotal },
  });

// ---------- REVIEWS ----------
export const apiGetReviews = (menu_item_id) =>
  request(`/review/${menu_item_id}`);

export const apiAddReview = (menu_item_id, rating, comment) =>
  request("/review", {
    method: "POST",
    auth: true,
    body: { review_type: "item", menu_item_id, rating, comment },
  });

export const apiDeleteReview = (id) =>
  request(`/review/${id}`, { method: "DELETE", auth: true });

// Catering-request reviews (one per request per user; re-submitting updates it).
export const apiGetCateringReviews = (catering_request_id) =>
  request(`/review/catering/${catering_request_id}`, { auth: true });

export const apiAddCateringReview = (catering_request_id, rating, comment) =>
  request("/review", {
    method: "POST",
    auth: true,
    body: { review_type: "catering", catering_request_id, rating, comment },
  });

// Standalone feedback about the corporate-meals program.
export const apiAddCorporateReview = (rating, comment) =>
  request("/review", {
    method: "POST",
    auth: true,
    body: { review_type: "corporate_meal", rating, comment },
  });

// ---------- SUBSCRIPTIONS ----------
export const apiCreateSubscription = (payload) =>
  request("/subscriptions", { method: "POST", auth: true, body: payload });

export const apiGetMySubscriptions = () =>
  request("/subscriptions/my", { auth: true });

export const apiGetSubscriptionById = (id) =>
  request(`/subscriptions/${id}`, { auth: true });

export const apiCancelSubscription = (id) =>
  request(`/subscriptions/${id}/cancel`, { method: "PUT", auth: true });

export const apiUpdateSubscriptionItems = (id, items) =>
  request(`/subscriptions/${id}/items`, {
    method: "PUT",
    auth: true,
    body: { items },
  });

// ---------- LOYALTY ----------
export const apiGetLoyaltyAccount = () =>
  request("/loyalty/my", { auth: true });

export const apiAddLoyaltyPoints = (points) =>
  request("/loyalty/add-points", {
    method: "POST",
    auth: true,
    body: { points },
  });

export const apiRedeemLoyaltyPoints = (cost) =>
  request("/loyalty/redeem", {
    method: "POST",
    auth: true,
    body: { cost },
  });

// ---------- CATERING ----------
export const apiSubmitCateringRequest = (payload) =>
  request("/catering", { method: "POST", auth: true, body: payload });

export const apiGetMyCateringRequests = () =>
  request("/catering/my", { auth: true });

export const apiGetCateringRequest = (id) =>
  request(`/catering/${id}`, { auth: true });

export const apiUpdateCateringRequest = (id, payload) =>
  request(`/catering/${id}`, { method: "PUT", auth: true, body: payload });

export const apiCancelCateringRequest = (id, reason) =>
  request(`/catering/${id}/cancel`, {
    method: "PUT",
    auth: true,
    body: { reason },
  });

export const apiGetCateringHistory = (id) =>
  request(`/catering/${id}/history`, { auth: true });

// ---------- ADMIN ----------
export const apiAdminGetStats = () => request("/admin/stats", { auth: true });

// MENU
export const apiAdminGetMenu = () => request("/admin/menu", { auth: true });
export const apiAdminCreateMenuItem = (payload) =>
  request("/admin/menu", { method: "POST", auth: true, body: payload });
export const apiAdminUpdateMenuItem = (id, payload) =>
  request(`/admin/menu/${id}`, { method: "PUT", auth: true, body: payload });
export const apiAdminDeleteMenuItem = (id) =>
  request(`/admin/menu/${id}`, { method: "DELETE", auth: true });
export const apiAdminToggleMenuItem = (id) =>
  request(`/admin/menu/${id}/toggle`, { method: "PUT", auth: true });

// ORDERS
export const apiAdminGetOrders = () => request("/admin/orders", { auth: true });
export const apiAdminUpdateOrderStatus = (id, status) =>
  request(`/admin/orders/${id}/status`, {
    method: "PUT",
    auth: true,
    body: { status },
  });

// CATERING
export const apiAdminGetCatering = () =>
  request("/admin/catering", { auth: true });
export const apiAdminUpdateCateringStatus = (id, payload) =>
  request(`/admin/catering/${id}/status`, {
    method: "PUT",
    auth: true,
    body: payload,
  });

// SUBSCRIPTIONS
export const apiAdminGetSubscriptions = () =>
  request("/admin/subscriptions", { auth: true });
export const apiAdminUpdateSubscriptionStatus = (id, status) =>
  request(`/admin/subscriptions/${id}/status`, {
    method: "PUT",
    auth: true,
    body: { status },
  });

// REVIEWS
export const apiAdminGetReviews = (type) =>
  request(`/admin/reviews${type ? `?type=${type}` : ""}`, { auth: true });
export const apiAdminDeleteReview = (id) =>
  request(`/admin/reviews/${id}`, { method: "DELETE", auth: true });

// CORPORATE
export const apiAdminGetCorporate = () =>
  request("/admin/corporate", { auth: true });

// USERS
export const apiAdminGetUsers = () => request("/admin/users", { auth: true });
export const apiAdminToggleUserStatus = (id) =>
  request(`/admin/users/${id}/status`, { method: "PUT", auth: true });
