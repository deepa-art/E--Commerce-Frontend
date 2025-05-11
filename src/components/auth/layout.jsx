import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start relative overflow-hidden"
      style={{
        backgroundImage: "url('/loginn.avif')", // Corrected typo from 'loginn.avif'
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Welcome message centered at the top */}
      <div className="w-full text-center py-8 lg:py-12 text-white drop-shadow-lg z-10">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
          Welcome to ECommerce Shopping
        </h1>
      </div>
      {/* Centered login container */}
      <div className="w-full max-w-md mx-auto p-4 lg:p-6 z-20 flex items-center justify-center flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;