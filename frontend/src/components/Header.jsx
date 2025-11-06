import { Link } from "react-router-dom";
import Avatar from "./ui/Avatar";

export default function Header({ onLogout, currentUser }) {
  const initials = `${currentUser?.firstName?.[0] ?? ""}${currentUser?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <header className="pt-6">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center gap-2">
        <div className="flex gap-1 text-surface-800 font-montserrat mr-2">
          <Link to="/dashboard" className="hover:underline">Home</Link>
          <span> | </span>
          <button onClick={onLogout} className="text-surface-800 font-montserrat hover:underline">Log out</button>
        </div>
        <Avatar
          name={`${currentUser?.firstName ?? ""} ${currentUser?.lastName ?? ""}`}
          size={32}
          background="bg-element-200"
        />
      </div>
    </header>
  );
}



