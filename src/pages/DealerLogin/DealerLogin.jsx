import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { roleHome } from '../../routes/roleHome.js';
import LoginForm from './components/LoginForm.jsx';
import DealerBrandPanel from './components/DealerBrandPanel.jsx';
import duroplyLogo from '../../assets/duroply-logo.png';
import loginBrandBg from '../../assets/login-brand-bg.jpg';

// Dealer login page (/login), for Dealers only. Employees and Admins sign
// in through the separate employee-frontend app. Both apps use the same
// Supabase backend.
//
// Layout: same as the original shared Login page. Wood-grain photo behind,
// brand statement on the left (components/DealerBrandPanel.jsx), white
// sign-in card on the right. On mobile they stack.
export default function DealerLogin() {
  const { loginDealer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const loggedInUser = await loginDealer(email, password);
      const redirectTo = location.state?.from?.pathname || roleHome(loggedInUser.roles);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-950 bg-cover bg-left px-4 py-10"
      style={{ backgroundImage: `url(${loginBrandBg})` }}
    >
      {/* The dark wood-grain photo is shown as it is. A
          light shade on the left keeps the brand text readable; on mobile,
          where the photo's white side is cropped away, the shade covers the
          whole screen. */}
      <div className="pointer-events-none absolute inset-0 bg-gray-950/55 md:bg-transparent md:bg-gradient-to-r md:from-gray-950/60 md:via-gray-950/15 md:to-transparent" />

      <div className="relative z-10 flex w-full max-w-6xl flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-16 md:px-8">
        <DealerBrandPanel />

        {/* White sign-in card with an accent-colored stripe on top. */}
        <div className="w-full animate-fade-in-up overflow-hidden rounded-2xl bg-white shadow-2xl shadow-gray-950/40 ring-1 ring-black/5 md:w-[42%] md:max-w-md">
          <div className="h-1 bg-accent-stripe" aria-hidden="true" />
          <div className="px-7 py-9 sm:px-10">
            <img src={duroplyLogo} alt="DUROPLY" className="h-7 w-auto md:h-8" />
            <div className="mt-1.5 text-[11px] font-semibold tracking-[0.3em] text-brand-500">EXCLUSIVE</div>

            <h1 className="mt-8 text-title-sm font-semibold text-gray-800">Welcome Back</h1>
            <p className="mb-7 mt-2 text-sm text-gray-500">Sign in to access your account</p>

            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              errorMessage={errorMessage}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
