"use client";
import { Button } from "@/components/ui/button";

import AppLogo from "@/components/app-logo/AppLogo";

const NotfoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <AppLogo size={400} />
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">The page does not exist</p>
        <Button
          className="mt-4 ml-2"
          onClick={() => (window.location.href = "/home")}
        >
          Back To Home
        </Button>
      </div>
    </div>
  );
};

export default NotfoundPage;
