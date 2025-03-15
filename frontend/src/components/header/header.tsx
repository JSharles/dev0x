import AppLogo from "../app-logo/AppLogo";
import LoginButton from "../login-button/login-button";

const Header = () => {
  return (
    <div className="flex justify-between items-center flex-row px-12">
      <AppLogo size={180} />
      <LoginButton />
    </div>
  );
};

export default Header;
