import { useEffect, useRef } from "react";
import type { OAuthProvider } from "../hooks/use-oauth-popup";

export default function GoogleCallbackPage () {
  const hasNotifiedOpener = useRef(false);

  useEffect(() => {
    if (hasNotifiedOpener.current) {
      return;
    }

    hasNotifiedOpener.current = true;

    const notifyOpener = () => {
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

      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          { type: 'oauth-success', provider },
          '*',
        );
        window.close();
      }
    };

    notifyOpener();
  }, [hasNotifiedOpener]);

  return <div>Signing you in...</div>;
};