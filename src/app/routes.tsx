import { createBrowserRouter } from "react-router";
import MainPage from "./pages/MainPage";
import { ODIKidsPage } from "./pages/ODIKidsPage";
import { ErrorPage } from "./pages/ErrorPage";
import { Layout } from "./components/Layout";
import ServicesPage from "./pages/ServicesPage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";
import LearnMorePage from "./pages/LearnMorePage";
import IndustriesPage from "./pages/industriesPage";
import Service3DMovieConversion from "./pages/Service3DMovieConversion";
import Service3DShortFilms from "./pages/Service3DShortFilms";
import Service3DReelsVertical from "./pages/Service3DReelsVertical";
import ServiceImmersiveAdvertising from "./pages/ServiceImmersiveAdvertising";
import ServiceDepthCompositing from "./pages/ServiceDepthCompositing";
import ServiceVRVisionPro from "./pages/ServiceVRVisionPro";
import SpaceExplorerPage from "./pages/SpaceExplorerPage.tsx";
import Service3DBook from "./pages/Service3DBook.tsx";

// --- Auth ---
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// --- Checkout ---
import CheckoutLayout from "./components/checkout/CheckoutLayout";
import CheckoutPage from "./pages/CheckoutPage"; // Serves as Checkout Details
import CheckoutReviewPage from "./pages/checkout/CheckoutReviewPage";
import CheckoutPaymentPage from "./pages/checkout/CheckoutPaymentPage";
import CheckoutSuccessPage from "./pages/checkout/CheckoutSuccessPage";

// --- Auth guard ---
import { RequireAuth, RequireAdmin } from "./components/auth/RequireAuth";

// --- Dashboard: User ---
import UserLayout from "./components/dashboard/UserLayout";
import UserOverviewPage from "./pages/dashboard/user/OverviewPage";
import UserBookingsPage from "./pages/dashboard/user/BookingsPage";
import UserOrdersPage from "./pages/dashboard/user/OrdersPage";
import UserPaymentsPage from "./pages/dashboard/user/PaymentsPage";
import UserSettingsPage from "./pages/dashboard/user/SettingsPage";

// --- Dashboard: Admin ---
import AdminLayout from "./components/dashboard/AdminLayout";
import AdminOverviewPage from "./pages/dashboard/admin/OverviewPage";
import AdminBookingsPage from "./pages/dashboard/admin/BookingsPage";
import AdminProductsPage from "./pages/dashboard/admin/ProductsPage";
import AdminCustomersPage from "./pages/dashboard/admin/CustomersPage";
import AdminPaymentsPage from "./pages/dashboard/admin/PaymentsPage";
import AdminSettingsPage from "./pages/dashboard/admin/SettingsPage";

export const router = createBrowserRouter([
  // Standalone Auth Routes
  { path: "/login", Component: LoginPage },
  { path: "/register", Component: RegisterPage },

  // Checkout Flow
  {
    path: "/checkout",
    Component: CheckoutLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: CheckoutPage },
      { path: "review", Component: CheckoutReviewPage },
      { path: "payment", Component: CheckoutPaymentPage },
      { path: "success", Component: CheckoutSuccessPage },
    ]
  },

  // Admin Dashboard (signed-in + admin role)
  {
    path: "/dashboard/admin",
    Component: RequireAdmin,
    ErrorBoundary: ErrorPage,
    children: [
      {
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminOverviewPage },
          { path: "bookings", Component: AdminBookingsPage },
          { path: "products", Component: AdminProductsPage },
          { path: "customers", Component: AdminCustomersPage },
          { path: "payments", Component: AdminPaymentsPage },
          { path: "settings", Component: AdminSettingsPage },
        ],
      },
    ],
  },

  // User Dashboard (signed-in)
  {
    path: "/dashboard",
    Component: RequireAuth,
    ErrorBoundary: ErrorPage,
    children: [
      {
        Component: UserLayout,
        children: [
          { index: true, Component: UserOverviewPage },
          { path: "bookings", Component: UserBookingsPage },
          { path: "orders", Component: UserOrdersPage },
          { path: "payments", Component: UserPaymentsPage },
          { path: "settings", Component: UserSettingsPage },
        ],
      },
    ],
  },

  // Main Website Flow
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: MainPage },
      { path: "odi-kids", Component: ODIKidsPage },
      { path: "kids", Component: ODIKidsPage },
      { path: "about", Component: AboutPage },
      { path: "services", Component: ServicesPage },
      { path: "industries", Component: IndustriesPage },
      { path: "services/3d-movie-conversion", Component: Service3DMovieConversion },
      { path: "services/3d-books", Component: Service3DBook },
      { path: "services/3d-short-films", Component: Service3DShortFilms },
      { path: "services/3d-reels-vertical", Component: Service3DReelsVertical },
      { path: "services/immersive-advertising", Component: ServiceImmersiveAdvertising },
      { path: "services/depth-compositing", Component: ServiceDepthCompositing },
      { path: "services/vr-vision-pro", Component: ServiceVRVisionPro },
      { path: "products", Component: ProductsPage },
      { path: "products/space-explorer", Component: SpaceExplorerPage },
      { path: "careers", Component: CareersPage },
      { path: "contact", Component: ContactPage },
      { path: "learn-more", Component: LearnMorePage },
    ],
  },
]);