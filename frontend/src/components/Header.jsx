import { Link } from "react-router-dom";

export default function Header({ onLogout, currentUser }) {
  const initials = `${currentUser?.firstName?.[0] ?? ""}${currentUser?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <header className="pt-6">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center gap-2">

      

      <div className="flex gap-1 text-pink-900 font-montserrat mr-2 ">
        <Link to="/dashboard" className="hover:underline">
          Home
        </Link>
        <span> | </span>
        
        <button
          onClick={onLogout}
          className="text-pink-900 font-montserrat hover:underline"
          >
          Log out
        </button>
      </div>

      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-cyan-600"
        title={`${currentUser?.firstName ?? ""} ${currentUser?.lastName ?? ""}`}
      >
        {initials}
      </div>

    </div>
  </header>
  );
}



