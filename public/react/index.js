import React from "react";
import { createRoot } from "react-dom/client";
import "regenerator-runtime/runtime";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import App from "./components/App";
import Cart from "./components/Cart/Cart";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ItemDescription from "./components/ItemDescription/ItemDescription";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import { AuthProvider } from "./AuthProvider";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="flex flex-col min-h-screen ">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    ),
    children: [
    {
        path: "/",
        element: <App />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/item/:id",
        element: <ItemDescription />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/auth",
        element: <Login />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/success/:id",
        element: <Success />,
      },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <ToastContainer />
    <RouterProvider router={router} />
  </AuthProvider>
);
