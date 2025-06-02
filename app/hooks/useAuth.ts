"use client";

import { useEffect, useState } from "react";

export function useAuth() {
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth_status")
      .then((r) => r.json())
      .then((res) => {
        setAuthorized(res.authorized);
        setChecked(true);
      });
  }, []);

  return { authorized, loading: !checked };
}
