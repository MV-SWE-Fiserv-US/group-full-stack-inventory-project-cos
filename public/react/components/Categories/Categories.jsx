import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";

const Categories = () => {
  const { categories, handleCategory } = useContext(AuthContext);

  return (
    <section className="flex flex-col items-end py-2">
      <div className="flex items-center mb-2 pr-8">
        <label htmlFor="category" className="mr-2">
          Category:
        </label>
        <select onChange={handleCategory} className="p-2 border rounded">
          <option value="All">All</option>
          {categories.map((item, id) => (
            <option key={id} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <hr className="border-t border-slate-800 w-screen"></hr>
    </section>
  );
};

export default Categories;

//   import { Outlet } from "react-router";
// import Navbar from "./Navbar/Navbar";
// import Footer from "./Footer/Footer";

// export default function App() {
//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col min-h-[95vh]">
//         <Outlet />
//       </div>
//       <Footer />
//     </>
//   );
// }

// import React from "react";
// import { createRoot } from "react-dom/client";
// import "regenerator-runtime/runtime";
// import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
// import App from "./components/App";
// import Cart from "./components/Cart/Cart";
// import Navbar from "./components/Navbar/Navbar";
// import Footer from "./components/Footer/Footer";
// import ItemDescription from "./components/ItemDescription/ItemDescription";
// import Dashboard from "./components/Dashboard/Dashboard";
// import Login from "./components/Login/Login";
// import { AuthProvider } from "./AuthProvider";
// import { ToastContainer } from "react-toastify";
// import Checkout from "./components/Forms/CheckoutForm/Checkout";
// import Success from "./components/Success/Success";
// import Home from "./components/Home/Home";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "/cart",
//         element: <Cart />,
//       },
//       {
//         path: "/item/:id",
//         element: <ItemDescription />,
//       },
//       {
//         path: "/dashboard",
//         element: <Dashboard />,
//       },
//       {
//         path: "/auth",
//         element: <Login />,
//       },
//       {
//         path: "/checkout",
//         element: <Checkout />,
//       },
//       {
//         path: "/success/:id",
//         element: <Success />,
//       },
//     ],
//   },
// ]);

// const root = createRoot(document.getElementById("root"));
// root.render(
//   <AuthProvider>
//     <ToastContainer />
//     <RouterProvider router={router} />
//   </AuthProvider>
// );

// import React, { useState, useContext } from "react";
// import { AuthContext } from "../../AuthProvider";
// import vaultIcon from "../../../assets/vault-icon.svg";
// import { NavLink, useLocation, useNavigate, useParams } from "react-router";
// import { toast, Slide } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Categories from "../Categories/Categories";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const { isLoggedIn, isAdmin } = useContext(AuthContext);

//  const params = useLocation()
//  const hasNoParams = params.pathname === "/"

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleLogout = (e) => {
//     if (e.target.text === "Logout") {
//       toast.success("Logging out 👉", {
//         position: "top-center",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         transition: Slide,
//       });
//       setTimeout(() => {
//         localStorage.removeItem("token");
//         navigate("/auth");
//         location.reload()
//       }, 1000);
//     }
//   };

//   clearLocal = () => {
//     localStorage.removeItem("token");
//     navigate("/auth");
//     location.reload()
//   }

//   return (
//     <>
//       <nav className="bg-white">
//         <div className="flex flex-wrap items-center justify-between mx-auto p-4">
//           <a
//             href="/"
//             className="flex items-center space-x-3 rtl:space-x-reverse"
//           >
//             <img src={vaultIcon} className="h-10" alt="Vaultry Icon" />
//             <span className="self-center text-2xl font-semibold whitespace-nowrap bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent rounded">
//               Vaultry
//             </span>
//           </a>
//           <button
//             onClick={toggleMenu}
//             type="button"
//             className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-slate-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:focus:ring-gray-600"
//             aria-controls="navbar-hamburger"
//             aria-expanded={isOpen}
//           >
//             <span className="sr-only">Open main menu</span>
//             <svg
//               className="w-5 h-5"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill=""
//               viewBox="0 0 17 14"
//             >
//               <path
//                 stroke="#1e293b"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M1 1h15M1 7h15M1 13h15"
//               />
//             </svg>
//           </button>
//           <div
//             className={`${isOpen ? "block" : "hidden"} w-full`}
//             id="navbar-hamburger"
//           >
//             <ul className="flex flex-col font-medium mt-4 rounded-lg">
//               <li>
//                 <NavLink
//                   to="/"
//                   className="block py-2 px-3 text-slate-800 rounded hover:bg-gray-700 hover:text-white"
//                   aria-current="page"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Home
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/cart"
//                   className="block py-2 px-3 text-slate-800 rounded hover:bg-gray-700 hover:text-white"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Cart
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/auth"
//                   className="block py-2 px-3 text-slate-800 rounded hover:bg-gray-700 hover:text-white"
//                   onClick={(e) => {
//                     setIsOpen(false);
//                     handleLogout(e);
//                   }}
//                 >
//                   {isLoggedIn ? "Logout" : "Login / Sign Up"}
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/dashboard"
//                   className="block py-2 px-3 text-slate-800 rounded hover:bg-gray-700 hover:text-white"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {isAdmin ? "Dashboard" : "Settings"}
//                 </NavLink>
//               </li>
//             </ul>
//           </div>
//         </div>
//         <hr className="border-t border-gray-700"></hr>
//       </nav>
//         {hasNoParams && <Categories />}
//     </>
//   );
// }

// import { createContext, useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import apiURL from "./api";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [username, setUsername] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [clientSecret, setClientSecret] = useState("");
//   const [items, setItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState(null);
//   const [categories, setCategories] = useState([]);

//   const getClientSecret = async () => {
//     try {
//       const response = await fetch(`${apiURL}/payment-intent`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ total: 1000 }),
//       });
//       const { clientSecret } = await response.json();
//       setClientSecret(clientSecret);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     getClientSecret();
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setIsLoggedIn(true);
//       const decoded = jwtDecode(token);
//       setUserId(decoded.id);
//       setUsername(decoded.name);
//       setUserEmail(decoded.email);
//       if (decoded.isAdmin) {
//         setIsAdmin(true);
//       }
//     }
//   }, []);

//   async function fetchItems() {
//     try {
//       const response = await fetch(`${apiURL}/items`);
//       const itemsData = await response.json();

//       const uniqueCategories = Array.from(
//         new Set(itemsData.map((item) => item.category))
//       );
//       setCategories(uniqueCategories);

//       setItems(itemsData);
//     } catch (err) {
//       console.log("Oh no an error! ", err);
//     }
//   }

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const handleCategory = (e) => {
//     e.preventDefault();
//     const category = e.target.value;
//     if (category === "All") {
//       setFilteredItems(null);
//       fetchItems();
//     } else {
//       const filterItems = items.filter((item) => item.category === category);
//       setFilteredItems(filterItems);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ isAdmin, isLoggedIn, userId, username, userEmail, clientSecret, items, categories, setFilteredItems, fetchItems, filteredItems, handleCategory }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
