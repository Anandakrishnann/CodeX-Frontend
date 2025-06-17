import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

export default function Layout({ children }) {
  return (
    <div className="bg-black text-white">
      <Sidebar />
      <Navbar />
      <main className="pl-64 p-6" style={{ paddingTop: "60px" }}>
        {children}
      </main>
    </div>
  );
}
