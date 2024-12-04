import { Outlet } from "react-router";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-[85vh] justify-center">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
