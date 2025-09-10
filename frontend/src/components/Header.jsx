import { Link } from "react-router-dom";

export default function Header({ onLogout, currentUser }) {
  const initials = `${currentUser?.firstName?.[0] ?? ""}${currentUser?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <header className="pt-6">
      <div className="w-full mx-auto px-4 pb-8 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Left: Home */}
        <Link to="/dashboard" className="text-fuchsia-900 font-montserrat hover:underline">
          Home
        </Link>

        {/* Right: Avatar and Log out */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold bg-sky-600 border-2 border-white"
            title={`${currentUser?.firstName ?? ""} ${currentUser?.lastName ?? ""}`}
          >
            {initials}
          </div>

          <button
            onClick={onLogout}
            className="text-fuchsia-900 font-montserrat hover:underline"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}



