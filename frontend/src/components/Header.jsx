import { Link } from "react-router-dom";
import Avatar from "./ui/Avatar";

export default function Header({ onLogout, currentUser, textColor = "white" }) {
  const initials = `${currentUser?.firstName?.[0] ?? ""}${currentUser?.lastName?.[0] ?? ""}`.toUpperCase();
  const textColorClass = textColor === "black" ? "text-stone-700" : "text-white";

  return (
    <header className="pt-6">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center gap-2">
        <div className={`flex gap-1 ${textColorClass} tracking-wider font-montserrat mr-2`}>
          <Link to="/dashboard" className="hover:underline">Home</Link>
          <span> | </span>
          <button onClick={onLogout} className={`font-montserrat hover:underline ${textColorClass}`}>Log out</button>
        </div>
        <Avatar
          name={`${currentUser?.firstName ?? ""} ${currentUser?.lastName ?? ""}`}
          size={32}
          background="bg-accent-50"
        />
      </div>
    </header>
  );
}