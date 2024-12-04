import { useContext } from "react";
import { toast, Slide } from "react-toastify";
import {AuthContext} from "../AuthProvider";
import apiURL from "../api";

export const useCart = () => {
  const { userId } = useContext(AuthContext);
  console.log(userId);
  

  const addItemToCart = async (itemId) => {
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
  };

  const handleAddItem = (itemId) => {
    addItemToCart(itemId);
  };

  return { addItemToCart, handleAddItem };
};
