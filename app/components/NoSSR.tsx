import { type PropsWithChildren, useEffect, useState } from "react";

export const NoSSR = ({
  children,
  fallback = null,
}: PropsWithChildren<{ fallback?: React.ReactNode }>) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : <>{fallback}</>;
};
