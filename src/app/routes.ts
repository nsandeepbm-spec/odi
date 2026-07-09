import { createBrowserRouter } from "react-router";
import MainPage from "./pages/MainPage";
import { ODIKidsPage } from "./pages/ODIKidsPage";
import { ErrorPage } from "./pages/ErrorPage";
import { Layout } from "./components/Layout";
import ServicesPage from "./pages/ServicesPage";
import ProductsPage from "./pages/ProductsPage";
import WorkPage from "./pages/WorkPage";
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
import CheckoutPaymentPage from "./pages/checkout/CheckoutPaymentPage";
import CheckoutSuccessPage from "./pages/checkout/CheckoutSuccessPage";

// --- Dashboard ---
import DashboardLayout from "./components/dashboard/DashboardLayout";
import UserOverviewPage from "./pages/dashboard/UserOverviewPage";
import UserOrdersPage from "./pages/dashboard/UserOrdersPage";
import UserSettingsPage from "./pages/dashboard/UserSettingsPage";
import AdminOverviewPage from "./pages/dashboard/AdminOverviewPage";
import AdminOrdersPage from "./pages/dashboard/AdminOrdersPage";
import AdminCustomersPage from "./pages/dashboard/AdminCustomersPage";

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
      { path: "payment", Component: CheckoutPaymentPage },
      { path: "success", Component: CheckoutSuccessPage },
    ]
  },

  // Dashboard Flow (User & Admin)
  {
    path: "/dashboard",
    Component: DashboardLayout,
    ErrorBoundary: ErrorPage,
    children: [
      // User
      { index: true, Component: UserOverviewPage },
      { path: "orders", Component: UserOrdersPage },
      { path: "settings", Component: UserSettingsPage },
      // Admin
      { path: "admin", Component: AdminOverviewPage },
      { path: "admin/orders", Component: AdminOrdersPage },
      { path: "admin/customers", Component: AdminCustomersPage },
    ]
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
      { path: "work", Component: WorkPage },
      { path: "careers", Component: CareersPage },
      { path: "contact", Component: ContactPage },
      { path: "learn-more", Component: LearnMorePage },
    ],
  },
]);