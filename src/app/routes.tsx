import { createBrowserRouter } from "react-router";
import MainPage from "./pages/MainPage";
import { ODIKidsPage } from "./pages/ODIKidsPage";
import { ErrorPage } from "./pages/ErrorPage";
import { Layout } from "./components/Layout";
import { SeoRoot } from "./components/Seo";
import ServicesPage from "./pages/ServicesPage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";
import LearnMorePage from "./pages/LearnMorePage";
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/legal/TermsOfServicePage";
import CookiesPolicyPage from "./pages/legal/CookiesPolicyPage";
import IndustriesPage from "./pages/industriesPage";
import Service3DMovieConversion from "./pages/Service3DMovieConversion";
import SpaceExplorerPage from "./pages/SpaceExplorerPage.tsx";
import Service3DBook from "./pages/Service3DBook.tsx";

const lazyRoute = (importFn: () => Promise<any>) => async () => {
  const m = await importFn();
  return { Component: m.default };
};

// --- Auth ---
const LoginPage = lazyRoute(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazyRoute(() => import('./pages/auth/RegisterPage'));

// --- Checkout ---
const CheckoutLayout = lazyRoute(() => import('./components/checkout/CheckoutLayout'));
const CheckoutPage = lazyRoute(() => import('./pages/CheckoutPage'));
const CheckoutReviewPage = lazyRoute(() => import('./pages/checkout/CheckoutReviewPage'));
const CheckoutPaymentPage = lazyRoute(() => import('./pages/checkout/CheckoutPaymentPage'));
const CheckoutSuccessPage = lazyRoute(() => import('./pages/checkout/CheckoutSuccessPage'));

// --- Auth guard ---
import { RequireAuth, RequireAdmin } from "./components/auth/RequireAuth";

// --- Dashboard: User ---
const UserLayout = lazyRoute(() => import('./components/dashboard/UserLayout'));
const UserOverviewPage = lazyRoute(() => import('./pages/dashboard/user/OverviewPage'));
const UserBookingsPage = lazyRoute(() => import('./pages/dashboard/user/BookingsPage'));
const UserOrdersPage = lazyRoute(() => import('./pages/dashboard/user/OrdersPage'));
const UserOrderDetailPage = lazyRoute(() => import('./pages/dashboard/user/OrderDetailPage'));
const UserReviewsPage = lazyRoute(() => import('./pages/dashboard/user/ReviewsPage'));
const UserPaymentsPage = lazyRoute(() => import('./pages/dashboard/user/PaymentsPage'));
const UserSettingsPage = lazyRoute(() => import('./pages/dashboard/user/SettingsPage'));
const UserInboxPage = lazyRoute(() => import('./pages/dashboard/user/InboxPage'));

// --- Dashboard: Admin ---
const AdminLayout = lazyRoute(() => import('./components/dashboard/AdminLayout'));
const AdminOverviewPage = lazyRoute(() => import('./pages/dashboard/admin/OverviewPage'));
const AdminOrdersPage = lazyRoute(() => import('./pages/dashboard/admin/OrdersPage'));
const AdminOrderDetailPage = lazyRoute(() => import('./pages/dashboard/admin/OrderDetailPage'));
const AdminShipmentsPage = lazyRoute(() => import('./pages/dashboard/admin/ShipmentsPage'));
const AdminPickupsPage = lazyRoute(() => import('./pages/dashboard/admin/PickupsPage'));
const AdminProductsPage = lazyRoute(() => import('./pages/dashboard/admin/ProductsPage'));
const ProductEditorPage = lazyRoute(() => import('./pages/dashboard/admin/ProductEditorPage'));
const AdminCustomersPage = lazyRoute(() => import('./pages/dashboard/admin/CustomersPage'));
const AdminPaymentsPage = lazyRoute(() => import('./pages/dashboard/admin/PaymentsPage'));
const AdminPaymentDetailPage = lazyRoute(() => import('./pages/dashboard/admin/PaymentDetailPage'));
const AdminCouponsPage = lazyRoute(() => import('./pages/dashboard/admin/CouponsPage'));
const AdminSettingsPage = lazyRoute(() => import('./pages/dashboard/admin/SettingsPage'));
const AdminInboxPage = lazyRoute(() => import('./pages/dashboard/admin/InboxPage'));
const AdminContactInquiriesPage = lazyRoute(() => import('./pages/dashboard/admin/ContactInquiriesPage'));
const AdminCareerApplicationsPage = lazyRoute(() => import('./pages/dashboard/admin/CareerApplicationsPage'));
const AdminLegalPagesPage = lazyRoute(() => import('./pages/dashboard/admin/LegalPagesPage'));
const AdminCancelManagementPage = lazyRoute(() => import('./pages/dashboard/admin/CancelManagementPage'));
const AdminRefundManagementPage = lazyRoute(() => import('./pages/dashboard/admin/RefundManagementPage'));
const AdminRefundDetailPage = lazyRoute(() => import('./pages/dashboard/admin/RefundDetailPage'));

export const router = createBrowserRouter([
  {
    Component: SeoRoot,
    children: [
  // Standalone Auth Routes
  { path: "/login", lazy: LoginPage },
  { path: "/register", lazy: RegisterPage },

  // Checkout Flow
  {
    path: "/checkout",
    lazy: CheckoutLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, lazy: CheckoutPage },
      { path: "review", lazy: CheckoutReviewPage },
      { path: "payment", lazy: CheckoutPaymentPage },
      { path: "success", lazy: CheckoutSuccessPage },
    ]
  },

  // Admin Dashboard (signed-in + admin role)
  {
    path: "/dashboard/admin",
    Component: RequireAdmin,
    ErrorBoundary: ErrorPage,
    children: [
      {
        lazy: AdminLayout,
        children: [
          { index: true, lazy: AdminOverviewPage },
          { path: "inbox", lazy: AdminInboxPage },
          { path: "contact-inquiries", lazy: AdminContactInquiriesPage },
          { path: "career-applications", lazy: AdminCareerApplicationsPage },
          { path: "legal", lazy: AdminLegalPagesPage },
          { path: "orders", lazy: AdminOrdersPage },
          { path: "orders/:orderId", lazy: AdminOrderDetailPage },
          { path: "shipments", lazy: AdminShipmentsPage },
          { path: "pickups", lazy: AdminPickupsPage },
          { path: "cancels", lazy: AdminCancelManagementPage },
          { path: "refunds", lazy: AdminRefundManagementPage },
          { path: "refunds/:refundId", lazy: AdminRefundDetailPage },
          { path: "products", lazy: AdminProductsPage },
          { path: "products/new", lazy: ProductEditorPage },
          { path: "products/:id", lazy: ProductEditorPage },
          { path: "coupons", lazy: AdminCouponsPage },
          { path: "customers", lazy: AdminCustomersPage },
          { path: "payments", lazy: AdminPaymentsPage },
          { path: "payments/:paymentId", lazy: AdminPaymentDetailPage },
          { path: "settings", lazy: AdminSettingsPage },
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
        lazy: UserLayout,
        children: [
          { index: true, lazy: UserOverviewPage },
          { path: "inbox", lazy: UserInboxPage },
          { path: "bookings", lazy: UserBookingsPage },
          { path: "orders", lazy: UserOrdersPage },
          { path: "orders/:orderId", lazy: UserOrderDetailPage },
          { path: "reviews", lazy: UserReviewsPage },
          { path: "payments", lazy: UserPaymentsPage },
          { path: "settings", lazy: UserSettingsPage },
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
      { path: "products", Component: ProductsPage },
      { path: "products/space-explorer", Component: SpaceExplorerPage },
      { path: "careers", Component: CareersPage },
      { path: "contact", Component: ContactPage },
      { path: "learn-more", Component: LearnMorePage },
      { path: "privacy", Component: PrivacyPolicyPage },
      { path: "terms", Component: TermsOfServicePage },
      { path: "cookies", Component: CookiesPolicyPage },
    ],
  },
    ],
  },
]);