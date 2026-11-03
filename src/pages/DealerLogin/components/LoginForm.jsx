import TextInput from '../../../components/common/TextInput.jsx';
import PasswordInput from '../../../components/common/PasswordInput.jsx';
import Button from '../../../components/common/Button.jsx';
import { MailIcon, LockIcon, ArrowRightIcon } from './icons.jsx';

// Same form as the original shared Login page. Both fields are required, so
// each label carries a red asterisk.
function RequiredLabel({ children }) {
  return (
    <>
      {children} <span className="text-error-500">*</span>
    </>
  );
}

export default function LoginForm({
  email, setEmail, password, setPassword, rememberMe,
  setRememberMe, errorMessage, isSubmitting, onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <TextInput
        id="email"
        label={<RequiredLabel>Dealer Code</RequiredLabel>}
        type="text"
        variant="boxed"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="Enter your Dealer Code"
        icon={<MailIcon />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <PasswordInput
        id="password"
        label={<RequiredLabel>Password</RequiredLabel>}
        variant="boxed"
        autoComplete="current-password"
        placeholder="Enter your password"
        icon={<LockIcon />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* "Remember me" is a local UI preference only — it does not change
          session length or send anything extra to the backend, so it can't
          misrepresent what the app actually does with your session. */}
      <div className="mb-5 mt-1 flex items-center text-sm">
        <label htmlFor="rememberMe" className="flex items-center gap-2 text-gray-700">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-brand-500"
          />
          Remember me
        </label>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-error-500 bg-error-50 p-4 text-sm text-gray-700" role="alert">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full"
      >
        Sign In
        <ArrowRightIcon />
      </Button>
    </form>
  );
}
