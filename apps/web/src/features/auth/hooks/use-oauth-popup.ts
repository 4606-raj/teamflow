import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';

export type OAuthProvider = 'google' | 'facebook' | 'apple';

type OAuthMessage = {
  type: 'oauth-success' | 'oauth-error';
  provider: OAuthProvider;
};

const popupFeatures = {
  width: 500,
  height: 600,
};

export function useOAuthPopup(provider: OAuthProvider) {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const logout = useAuthStore((state) => state.logout);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPopup = useCallback(() => {
    setError(null);

    const { width, height } = popupFeatures;
    const left = Math.max(0, (window.screen.width - width) / 2);
    const top = Math.max(0, (window.screen.height - height) / 2);
    const popup = window.open(
      `${import.meta.env.VITE_API_URL}/auth/${provider}`,
      `teamflow-${provider}-login`,
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!popup) {
      setError('Please allow popups to continue with social sign-in.');
      return;
    }

    setIsLoading(true);
  }, [provider]);

  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent<OAuthMessage>) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.provider !== provider) return;

      setIsLoading(false);

      if (event.data.type === 'oauth-error') {
        setError('Social sign-in could not be completed. Please try again.');
        return;
      }

      try {
        const response = await authApi.refresh();
        setAccessToken(response.data.accessToken);

        const user = await fetchCurrentUser();
        if (!user) {
          logout();
          setError('Unable to load your account. Please try again.');
          return;
        }

        navigate(user.organizations?.length ? '/' : '/onboarding', {
          replace: true,
        });
      } catch {
        logout();
        setError('Social sign-in could not be completed. Please try again.');
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [fetchCurrentUser, logout, navigate, provider, setAccessToken]);

  return {
    openPopup,
    isLoading,
    error,
  };
}
