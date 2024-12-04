import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { toast, Slide } from "react-toastify";
import { AuthContext } from "../../AuthProvider";
import UpdateItem from "../Forms/UpdateItemForm/UpdateItem";
import DeleteItem from "../Forms/DeleteItemForm/DeleteItem";
import apiURL from "../../api";
import "react-toastify/dist/ReactToastify.css";
import Stars from "../Stars/Stars";

export default function ItemDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const adminRef = useRef(null);
  const { isLoggedIn, isAdmin, userId } = useContext(AuthContext);
  const [adminView, setAdminView] = useState(false);
  const [singleItem, setSingleItem] = useState({
    id: 0,
    name: "",
    description: "",
    category: "",
    price: 0,
    image: "",
  });

  function toggleAdminMenu() {
    setAdminView(!adminView);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 200);
  }

  async function fetchSingleItem(id) {
    try {
      const response = await fetch(`${apiURL}/items/${id}`);
      const itemData = await response.json();
      setSingleItem(itemData);
    } catch (err) {
      console.log("Oh no an error! ", err);
    }
  }

  async function addItemToCart(userId, itemId) {
    try {
      const response = await fetch(
        `${apiURL}/users/${userId}/addToCart/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Item could not be added to your cart!");
      }
      toast.success("Item added to cart 🛒", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
    } catch (err) {
      console.log("Oh no an error! ", err);
      toast.error("Item could not be added to cart 😰 Try again later.", {
        position: "top-center",
      });
    }
  }

  function handleAddItem(itemId) {
    addItemToCart(userId, itemId);
  }

  useEffect(() => {
    fetchSingleItem(id);
  }, []);

  return (
    <>
      <section className="max-w-6xl h-full mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 flex mt-4">
        <div className="w-1/2 h-full flex flex-col p-4 items-center justify-center">
          <div className="w-full">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              type="button"
              onClick={() => navigate("/")}
            >
              Back to Shop
            </button>
          </div>
          <img
            src={singleItem.image}
            alt={singleItem.name}
            className="h-full w-1/2 object-contain"
          />
        </div>
        <div className="p-4 flex flex-col justify-around flex-wrap w-1/2">
          <h2 className="text-xl font-semibold text-gray-800">
            {singleItem.name}
            <Stars />
          </h2>
          <p className="text-gray-600 mt-2">{singleItem.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              ${Number(singleItem.price).toFixed(2)}
            </span>
            <button
              type="button"
              disabled={!isLoggedIn}
              onClick={() => {
                handleAddItem(singleItem.id);
              }}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-300 disabled:transition-none disabled:cursor-not-allowed"
            >
              {isLoggedIn ? "Add to Cart" : "Login to Add to Cart"}
            </button>
          </div>
        </div>
      </section>
      <div className="flex items-center justify-around m-12">
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:transition-none disabled:cursor-not-allowed"
          onClick={toggleAdminMenu}
          disabled={!isAdmin}
        >
          {isAdmin ? "Admin - Update/Delete" : "Must be Admin to Update/Delete"}
        </button>
      </div>
      {adminView && (
        <section ref={adminRef}>
          <UpdateItem item={singleItem} />
          <DeleteItem item={singleItem} />
        </section>
      )}
    </>
  );
}
