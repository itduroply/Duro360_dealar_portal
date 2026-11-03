// Dealer app: every signed-in user here is a Dealer, so home is always the
// Dealer Portal. Shared by ProtectedRoute and AppRoutes.
export function roleHome() {
  return '/dealer';
}
