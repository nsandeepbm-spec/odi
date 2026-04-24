import { useRouteError, Link } from "react-router";

export function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-xl text-gray-600 mb-2">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-500 italic mb-8">
          {error?.statusText || error?.message || "Unknown error"}
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-[#06B6D4] text-white rounded-lg hover:bg-[#0891b2] transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
