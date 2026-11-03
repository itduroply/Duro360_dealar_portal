// Shared fallback for both ProtectedRoute's session check and AppRoutes'
// <Suspense> (see routes/AppRoutes.jsx) -- one lazy-loaded route chunk
// arriving late looks the same to the user as a session check in progress,
// so there's no reason to keep two copies of this markup.
export default function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center text-slate-500">
      Loading…
    </div>
  );
}
