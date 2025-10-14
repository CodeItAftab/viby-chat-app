// import { DotBackground } from "@/components/custom/DotBackground";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === "/auth")
      navigate("/auth/login", { replace: true });
  }, [navigate]);

  return (
    // <DotBackground
    //   className={
    //     "h-screen w-screen flex items-center justify-center overflow-auto overflow-x-hidden  "
    //   }
    // >
    //   <Outlet />
    // </DotBackground>
    <div className="flex h-screen text-foreground overflow-hidden bg-white">
      <Outlet />
    </div>
  );
};

export default Auth;
