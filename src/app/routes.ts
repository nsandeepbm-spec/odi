import { createBrowserRouter } from"react-router";
import MainPage from"./pages/MainPage";
import { ODIKidsPage } from"./pages/ODIKidsPage";
import { WIPPage } from"./pages/WIPPage";
import { ErrorPage } from"./pages/ErrorPage";
import { Layout } from"./components/Layout";
import ServicesPage from"./pages/ServicesPage";
import ProductsPage from"./pages/ProductsPage";
import WorkPage from"./pages/WorkPage";
import AboutPage from"./pages/AboutPage";
import CareersPage from"./pages/CareersPage";
import ContactPage from"./pages/ContactPage";
import IndustriesPage from"./pages/industriesPage";
import IndustryOTTPlatforms from"./pages/IndustryOTTPlatforms";
import IndustryFilmStudios from"./pages/IndustryFilmStudios";
import IndustryAdvertisingAgencies from"./pages/IndustryAdvertisingAgencies";
import IndustryCreatorsInfluencers from"./pages/IndustryCreatorsInfluencers";
import IndustryDocumentaryTeams from"./pages/IndustryDocumentaryTeams";
import IndustryMusicLabels from"./pages/IndustryMusicLabels";
import Service3DMovieConversion from"./pages/Service3DMovieConversion";
import Service3DShortFilms from"./pages/Service3DShortFilms";
import Service3DReelsVertical from"./pages/Service3DReelsVertical";
import ServiceImmersiveAdvertising from"./pages/ServiceImmersiveAdvertising";
import ServiceDepthCompositing from"./pages/ServiceDepthCompositing";
import ServiceVRVisionPro from"./pages/ServiceVRVisionPro";

export const router = createBrowserRouter([
 {
 path:"/",
 Component: Layout,
 ErrorBoundary: ErrorPage,
 children: [
 {
 index: true,
 Component: MainPage,
 },
 {
 path:"odi-kids",
 Component: ODIKidsPage,
 },
 {
 path:"kids",
 Component: ODIKidsPage,
 },
 {
 path:"about",
 Component: AboutPage,
 },
 {
 path:"services",
 Component: ServicesPage,
 },
 {
 path:"industries",
 Component: IndustriesPage,
 },
 {
 path:"industries/ott-platforms",
 Component: IndustryOTTPlatforms,
 },
 {
 path:"industries/film-studios",
 Component: IndustryFilmStudios,
 },
 {
 path:"industries/advertising-agencies",
 Component: IndustryAdvertisingAgencies,
 },
 {
 path:"industries/creators-influencers",
 Component: IndustryCreatorsInfluencers,
 },
 {
 path:"industries/documentary-teams",
 Component: IndustryDocumentaryTeams,
 },
 {
 path:"industries/music-labels",
 Component: IndustryMusicLabels,
 },
 {
 path:"services/3d-movie-conversion",
 Component: Service3DMovieConversion,
 },
 {
 path:"services/3d-short-films",
 Component: Service3DShortFilms,
 },
 {
 path:"services/3d-reels-vertical",
 Component: Service3DReelsVertical,
 },
 {
 path:"services/immersive-advertising",
 Component: ServiceImmersiveAdvertising,
 },
 {
 path:"services/depth-compositing",
 Component: ServiceDepthCompositing,
 },
 {
 path:"services/vr-vision-pro",
 Component: ServiceVRVisionPro,
 },
 {
 path:"products",
 Component: ProductsPage,
 },
 {
 path:"work",
 Component: WorkPage,
 },
 {
 path:"careers",
 Component: CareersPage,
 },
 {
 path:"contact",
 Component: ContactPage,
 },
 ],
 },
]);