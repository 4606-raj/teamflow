import { useEffect } from "react";
import { authApi } from "../api/auth.api";
import type { OAuthProvider } from "../hooks/use-oauth-popup";

export default function GoogleCallbackPage () {
  useEffect(() => {
    const completeLogin = async () => {
      const providerParam = new URLSearchParams(window.location.search).get('provider');
      const provider: OAuthProvider | null =
        providerParam === 'google' ||
        providerParam === 'facebook' ||
        providerParam === 'apple'
          ? providerParam
          : null;

      if (!provider) {
        return;
      }

      try {
        await authApi.refresh();

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: 'oauth-success', provider },
            window.location.origin,
          );
          window.close();
          return;
        }
      } catch {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: 'oauth-error', provider },
            window.location.origin,
          );
          window.close();
        }
      }
    };

    void completeLogin();
  }, []);

  return <div>Signing you in...</div>;
};