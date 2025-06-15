import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import KioskInput from '../components/common/KioskInput';
import KioskButton from '../components/common/KioskButton';
import { ShieldCheckIcon } from '@heroicons/react/24/outline'; // Using a different icon

const LoginScreen: React.FC = () => {
  const [username, setUsernameInput] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginTimestamp, setLoginTimestamp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const { translate } = useLanguageStore();
  const navigate = useNavigate();

  const updateTimestamp = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateString = now.toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });
    setLoginTimestamp(`${timeString}, ${dateString}`);
  };

  useEffect(() => {
    updateTimestamp();
    const intervalId = setInterval(updateTimestamp, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--theme-bg-deep-space)] p-4 sm:p-6 text-[var(--theme-text-primary)]">
      <div className="w-full max-w-3xl lg:max-w-4xl mx-auto">
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-bold text-[var(--theme-accent-cyan)]">{translate('company_logo')}</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-0 md:gap-0 bg-[var(--theme-panel-bg)] rounded-xl shadow-2xl overflow-hidden border border-[var(--theme-border-color)]">
          <form onSubmit={handleLogin} className="w-full md:w-1/2 p-6 sm:p-8 space-y-6 flex flex-col justify-center">
            <KioskInput
              label={translate('login_user_id_email')}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="cth: admin@example.com"
              required
            />
            <KioskInput
              label={translate('login_password')}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="flex items-center justify-between text-sm mt-2">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[var(--theme-primary-color)] focus:ring-[var(--theme-focus-ring)] border-[var(--theme-border-color)] rounded bg-[var(--theme-input-bg)]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-[var(--theme-text-secondary)]">{translate('login_remember_me')}</label>
              </div>
              <a href="#" className="font-medium text-[var(--theme-accent-cyan)] hover:text-[var(--theme-accent-magenta)]">{translate('login_forgot_password')}</a>
            </div>
            <KioskButton type="submit" fullWidth className="text-lg py-4" isLoading={isLoading}>
              {translate('login_button')}
            </KioskButton>
          </form>

          <div className="w-full md:w-1/2 p-6 sm:p-8 space-y-6 flex flex-col items-center justify-center text-center bg-[var(--theme-panel-bg-alt)]">
            <div className="text-center">
              <ShieldCheckIcon className="w-20 h-20 sm:w-24 sm:h-24 text-[var(--theme-accent-cyan)] mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-[var(--theme-text-primary)] mb-2">{translate('app_title_long')}</h2>
              <p className="text-[var(--theme-text-secondary)] text-sm mb-6">{translate('login_prompt')}</p>
            </div>
            <KioskButton variant="secondary" fullWidth className="max-w-xs py-3">
              {translate('login_clock_in_out')}
            </KioskButton>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[var(--theme-text-muted)]">
          <p className="mb-1">{loginTimestamp}</p>
          <p>
            <span>{translate('app_version')}</span>: 1.0.8 | <span>{translate('connection_status')}</span>: <span className="text-[var(--theme-accent-cyan)] font-semibold">Online</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;