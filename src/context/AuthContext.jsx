import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { dealerLoginEmail } from '../utils/dealerLogin';

const AuthContext = createContext(null);

// Builds the shape the rest of the app expects (ProtectedRoute checks
// user.roles, Login.jsx checks user.roles.includes('ADMIN')) out of a
// Supabase auth user plus its matching public.profiles row.
async function loadUser(authUser) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('name, role, status, dealer_code, vendor_id, permissions')
    .eq('id', authUser.id)
    .single();

  if (error || !profile) {
    throw new Error('No profile found for this account. Contact the administrator.');
  }
  if (profile.status !== 'ACTIVE') {
    await supabase.auth.signOut();
    throw new Error('Your account is inactive. Please contact the administrator.');
  }

  return {
    id: authUser.id,
    email: authUser.email,
    name: profile.name,
    roles: [profile.role],
    // Link to this Dealer's row in dealer_directory (null for non-Dealers).
    dealerCode: profile.dealer_code,
    vendorId: profile.vendor_id,
    // Only meaningful for ADMIN (which Admin Console features a SUPERADMIN
    // has granted it -- see components/Sidebar/sidebarConfig.js and layouts/AdminLayout.jsx).
    permissions: profile.permissions || [],
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while we check for an existing session

  // On first load, resume whatever session Supabase already has in local
  // storage (it manages its own persistence/refresh -- unlike the old
  // backend flow, there is no separate httpOnly-cookie dance to redo here).
  useEffect(() => {
    async function tryResume() {
      const { data } = await supabase.auth.getSession();
      const authUser = data.session?.user;
      if (!authUser) {
        setIsLoading(false);
        return;
      }
      try {
        setUser(await loadUser(authUser));
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    tryResume();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  // Signs in one Supabase Auth email and loads the profile.
  const signIn = useCallback(async (email, password, wrongCredentialsMessage) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.user) {
      throw new Error(wrongCredentialsMessage);
    }
    return loadUser(data.user);
  }, []);

  // Dealer login page (/login): a Dealer Code only. Only DEALER accounts
  // are allowed in. Employees use the separate employee-frontend app.
  const loginDealer = useCallback(async (dealerCode, password) => {
    const loggedInUser = await signIn(
      dealerLoginEmail(dealerCode),
      password,
      'Invalid Dealer Code or password.'
    );
    if (!loggedInUser.roles.includes('DEALER')) {
      await supabase.auth.signOut();
      throw new Error('Invalid Dealer Code or password.');
    }
    setUser(loggedInUser);
    return loggedInUser;
  }, [signIn]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, loginDealer, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
