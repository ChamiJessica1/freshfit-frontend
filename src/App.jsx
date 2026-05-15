import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/HomePage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import DietaryPreferences from "./Pages/DietaryPreferences";
import MenuPage from "./Pages/MenuPage";
import MenuSectionPage from "./Pages/MenuSectionPage";
import ItemDetailsPage from "./Pages/ItemDetailsPage";
import FavoritesPage from "./Pages/FavoritesPage";
import SubscriptionsPage from "./Pages/SubscriptionsPage";
import CateringPage from "./Pages/CateringPage";
import CateringHistoryPage from "./Pages/CateringHistoryPage";
import CateringEditPage from "./Pages/CateringEditPage";
import MealPlansPage from "./Pages/MealPlansPage";
import CorporateMealsPage from "./Pages/CorporateMealsPage";
import AboutUsPage from "./Pages/AboutUsPage";
import OurChefsPage from "./Pages/OurChefsPage";
import CartPage from "./Pages/CartPage";
import CheckoutPage from "./Pages/CheckoutPage";
import TrackOrderPage from "./Pages/TrackOrderPage";
import OrderHistoryPage from "./Pages/OrderHistoryPage";
import LoyaltyPage from "./Pages/LoyaltyPage";
import ProfileDashboardPage from "./Pages/ProfileDashboardPage";
import EditProfilePage from "./Pages/EditProfilePage";
import ManageSubscriptionPage from "./Pages/ManageSubscriptionPage";
import DarkModeToggle from "./Components/ModeToggle";
import AdminRoute from "./Components/AdminRoute";

// Admin pages are lazy-loaded to keep them out of the customer bundle.
const AdminDashboardPage     = lazy(() => import("./Pages/Admin/AdminDashboardPage"));
const AdminMenuPage          = lazy(() => import("./Pages/Admin/AdminMenuPage"));
const AdminOrdersPage        = lazy(() => import("./Pages/Admin/AdminOrdersPage"));
const AdminCateringPage      = lazy(() => import("./Pages/Admin/AdminCateringPage"));
const AdminSubscriptionsPage = lazy(() => import("./Pages/Admin/AdminSubscriptionsPage"));
const AdminReviewsPage       = lazy(() => import("./Pages/Admin/AdminReviewsPage"));
const AdminCorporatePage     = lazy(() => import("./Pages/Admin/AdminCorporatePage"));
const AdminUsersPage         = lazy(() => import("./Pages/Admin/AdminUsersPage"));

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-sm font-medium text-emerald-700">Loading admin…</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DarkModeToggle />
      <Suspense fallback={<AdminFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/preferences" element={<DietaryPreferences />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/section/:sectionKey" element={<MenuSectionPage />} />
          <Route path="/menu/:id" element={<ItemDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/catering" element={<CateringPage />} />
          <Route path="/catering/history" element={<CateringHistoryPage />} />
          <Route path="/catering/edit/:id" element={<CateringEditPage />} />
          <Route path="/meal-plans" element={<MealPlansPage />} />
          <Route path="/corporate" element={<CorporateMealsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/chefs" element={<OurChefsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/loyalty" element={<LoyaltyPage />} />
          <Route path="/dashboard" element={<ProfileDashboardPage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/subscriptions/manage" element={<ManageSubscriptionPage />} />

          <Route path="/admin"               element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/menu"          element={<AdminRoute><AdminMenuPage /></AdminRoute>} />
          <Route path="/admin/orders"        element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
          <Route path="/admin/catering"      element={<AdminRoute><AdminCateringPage /></AdminRoute>} />
          <Route path="/admin/subscriptions" element={<AdminRoute><AdminSubscriptionsPage /></AdminRoute>} />
          <Route path="/admin/reviews"       element={<AdminRoute><AdminReviewsPage /></AdminRoute>} />
          <Route path="/admin/corporate"     element={<AdminRoute><AdminCorporatePage /></AdminRoute>} />
          <Route path="/admin/users"         element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
