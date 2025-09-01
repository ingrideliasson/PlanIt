import { Link } from "react-router-dom";

export default function Header({ onLogout }) {
  return (
    <header className="pt-6">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-end items-center gap-3 sm:gap-5 text-fuchsia-900 font-montserrat text-sm sm:text-base">
          {/* Navigate to dashboard */}
          <Link to="/dashboard" className="hover:underline">
            Home
          </Link>

          <span className="hidden sm:block h-5 w-px bg-fuchsia-900" />

          <button onClick={onLogout} className="hover:underline">
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}

