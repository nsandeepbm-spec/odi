import { createBrowserRouter } from "react-router";
import MainPage from "./pages/MainPage";
import { ODIKidsPage } from "./pages/ODIKidsPage";
import { WIPPage } from "./pages/WIPPage";
import { ErrorPage } from "./pages/ErrorPage";
import { Layout } from "./components/Layout";
import ServicesPage from "./pages/ServicesPage";
import ProductsPage from "./pages/ProductsPage";
import WorkPage from "./pages/WorkPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: ErrorPage,
    children: [
      {
        index: true,
        Component: MainPage,
      },
      {
        path: "odi-kids",
        Component: ODIKidsPage,
      },
      {
        path: "kids",
        Component: ODIKidsPage,
      },
      {
        path: "wip",
        Component: WIPPage,
      },
      {
        path: "about",
        Component: AboutPage,
      },
      {
        path: "services",
        Component: ServicesPage,
      },
      {
        path: "products",
        Component: ProductsPage,
      },
      {
        path: "work",
        Component: WorkPage,
      },
      {
        path: "careers",
        Component: CareersPage,
      },
      {
        path: "contact",
        Component: ContactPage,
      },
    ],
  },
]);