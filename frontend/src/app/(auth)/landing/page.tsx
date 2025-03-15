import AppLogo from "@/components/app-logo/AppLogo";
import LoginButton from "@/components/login-button/login-button";

export const metadata = {
  title: "Welcome",
};

const LandingPage = () => {
  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center bg-black">
      <AppLogo size={800} />
      <LoginButton />
    </div>
  );
};

export default LandingPage;
