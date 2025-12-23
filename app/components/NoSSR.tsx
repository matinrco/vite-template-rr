import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

export const NoSSR = ({
  children,
  fallback = null,
}: PropsWithChildren<{ fallback?: React.ReactNode }>) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : <>{fallback}</>;
};
