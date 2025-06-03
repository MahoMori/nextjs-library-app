"use client";

import { useEffect, useState } from "react";

export function useAuth() {
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  const checkAuth = () => {
    fetch("/api/auth_status")
      .then((r) => r.json())
      .then((res) => {
        setAuthorized(res.authorized);
        setChecked(true);
      });
  };

  useEffect(() => {
    checkAuth();

    const handler = () => checkAuth();
    window.addEventListener("auth-changed", handler);

    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  return { authorized, loading: !checked };
}
