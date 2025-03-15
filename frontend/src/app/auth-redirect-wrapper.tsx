"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

const AuthRedirectWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isConnected) {
        router.replace("/home");
      } else {
        router.replace("/landing");
      }
    }
  }, [isConnected, router]);

  return <>{children}</>;
};

export default AuthRedirectWrapper;
