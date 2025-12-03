import { User } from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const admin = useSelector((state) => state.user.user);

  return (
    <header className="h-16 fixed top-0 right-0 left-64 bg-black px-6 flex items-center justify-end shadow-md z-10">
      {/* Admin Icon + Name */}
      <div className="flex items-center bg-white rounded-md px-2 py-2 space-x-2 group cursor-pointer select-none">
        
        <User className="h-6 w-6  group-hover:text-green-400 transition-colors duration-200" />

        <span className=" font-semibold group-hover:text-green-400 transition-colors duration-200">
          {admin.first_name} {admin.last_name}
        </span>

      </div>
    </header>
  );
}
