import { Search, Plus, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 fixed top-0 right-0 left-64 bg-black z-10 px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white p-2 pl-10 rounded-md text-black focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="bg-white p-2 rounded-full hover:bg-gray-200 transition-colors">
          <Plus className="h-5 w-5 text-black" />
        </button>

        <div className="flex items-center space-x-2 bg-white p-2 rounded-md hover:bg-gray-200 transition-colors cursor-pointer">
          <User className="h-5 w-5 text-black" />
          <span className="text-black font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}
