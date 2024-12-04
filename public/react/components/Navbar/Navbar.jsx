import React, { useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import vaultIcon from "../../../assets/vault-icon.svg";
import { NavLink, useNavigate } from "react-router";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, isAdmin } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = (e) => {
    if (e.target.text === "Logout") {
      toast.success("Logging out 👉", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/auth");
        location.reload()
      }, 1000);
    }
  };

  clearLocal = () => {
    localStorage.removeItem("token");
    navigate("/auth");
    location.reload()
  }

  return (
    <>
      <nav className="bg-white">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={vaultIcon} className="h-10" alt="Vaultry Icon" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent rounded">
              Vaultry
            </span>
          </a>
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-slate-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:focus:ring-gray-600"
            aria-controls="navbar-hamburger"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill=""
              viewBox="0 0 17 14"
            >
              <path
                stroke="#1e293b"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className={`${isOpen ? "block" : "hidden"} w-full`}
            id="navbar-hamburger"
          >
            <ul className="flex flex-col font-medium mt-4 rounded-lg">
              <li>
                <NavLink
                  to="/"
                  className="block py-2 px-3 text-slate-800 rounded hover:bg-gray-700 hover:text-white"
                  aria-current="page"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cart"
                  className="block py-2 px-3 text-slate-800 rounded hover:bg-gray-700 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Cart
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/auth"
                  className="block py-2 px-3 text-slate-800 rounded hover:bg-gray-700 hover:text-white"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleLogout(e);
                  }}
                >
                  {isLoggedIn ? "Logout" : "Login / Sign Up"}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className="block py-2 px-3 text-slate-800 rounded hover:bg-gray-700 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {isAdmin ? "Dashboard" : "Settings"}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-t border-gray-700"></hr>
      </nav>
    </>
  );
}
