import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../AuthProvider";
import "react-toastify/dist/ReactToastify.css";
import Stars from "../Stars/Stars";
import { useCart } from "../../hooks/useCart";

export default function ItemCard({ items }) {
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useContext(AuthContext);
  const { handleAddItem } = useCart();

  return (
    <>
      <div className="font-black lg:flex lg:flex-wrap justify-evenly gap-4 mx-auto pb-12 px-4">
        {items.map((item) => {
          return (
            <div
              className="bg-white flex flex-col justify-between items-center w-80 h-[600px] rounded-lg border border-slate-200 shadow-lg"
              key={item.id}
            >
              <div className="h-1/2">
                <img
                  className="bg-white p-8 rounded-t-lg  h-full aspect-auto object-contain cursor-pointer"
                  onClick={() => navigate(`/item/${item.id}`)}
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className="px-5 pb-5 bg-white mt-auto rounded-b-lg h-1/2 flex flex-col justify-end w-full">
                <h5 className="bg-white text-lg font-semibold tracking-tight text-black  text-pretty">
                  {item.name}
                </h5>

                <Stars />

                <div className="flex items-center justify-between bg-white  mt-2 w-full">
                  <span className="bg-white text-xl font-bold text-black ">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    disabled={!isLoggedIn}
                    onClick={() => {
                      handleAddItem(item.id);
                    }}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-300 disabled:transition-none disabled:cursor-not-allowed"
                  >
                    {isLoggedIn ? "Add to Cart" : "Login to Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
