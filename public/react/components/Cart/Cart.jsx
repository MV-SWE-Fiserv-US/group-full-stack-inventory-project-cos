import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import { Link } from "react-router";
import apiURL from "../../api";
import { useNavigate } from "react-router";

const Cart = () => {
  const { isLoggedIn, userId, username } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        total += item.quantity * item.price;
        return total;
      }, 0)
      .toFixed(2);
  };

  const expandCartItems = async (cart) => {
    return Promise.all(
      cart.flatMap(async (product) => {
        const expanded = await Promise.resolve(
          Array.from({ length: product.quantity }, () => {
            const { quantity, ...originalProduct } = product;
            return originalProduct;
          })
        );
        return expanded;
      })
    ).then((nestedProducts) => nestedProducts.flat());
  };

  const updateQuantity = async (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    const expandedCart = await expandCartItems(cartItems);
    updateUserCart(userId, expandedCart);
  };

  const removeItem = async (targetId) => {
    const updatedCart = await new Promise((resolve) => {
      setCartItems((prevItems) => {
        const filteredCart = prevItems.filter((item) => item.id !== targetId);
        resolve(filteredCart);
        return filteredCart;
      });
    });

    const expandedCart = await expandCartItems(updatedCart);
    updateUserCart(userId, expandedCart);
  };

  async function updateUserCart(userId, updatedCart) {
    try {
      const response = await fetch(`${apiURL}/users/${userId}/updateCart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCart),
      });
      if (!response.ok) {
        throw new Error("Cart could not be updated. Try again later.");
      }
      const data = await response.json();
    } catch (err) {
      console.log("Oh no an error! ", err);
    }
  }

  async function fetchUserCart(userId) {
    try {
      const response = await fetch(`${apiURL}/users/${userId}`);
      if (!response.ok) {
        throw new Error("Could not fetch user!");
      }
      const data = await response.json();
      const cartData = await data.cart;
      const cart = await cartData.reduce((acc, product) => {
        const existingProduct = acc.find((item) => item.id === product.id);

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          acc.push({ ...product, quantity: 1 });
        }

        return acc;
      }, []);

      setCartItems(cart);
    } catch (err) {
      console.log("Oh no an error! ", err);
    }
  }

  useEffect(() => {
    setTotal(calculateTotal());
  }, [cartItems]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserCart(userId);
    }
  }, []);

  return (
    <section className="w-full p-6 flex flex-col items-center justify-center px-20">
      {isLoggedIn ? (
        <>
          <div className="w-full flex justify-between px-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {username}'s Shopping Cart
            </h2>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Checkout
            </h2>
          </div>
          <div className="w-full lg:min-h-[600px] flex flex-col lg:flex-row rounded-lg shadow-lg border border-gray-300 divide-x divide-gray-400 bg-white">
            <div className="lg:w-1/2 h-full overflow-y-auto px-12 py-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-600 text-center">Your cart is empty.</p>
              ) : (
                <>
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li
                        key={item.id}
                        className="py-4 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                          <div className="mx-4 px-4">
                            <h3 className="text-md font-medium text-gray-800">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, (item.quantity -= 1))
                              }
                              className="px-2 py-1 text-gray-500 hover:text-gray-800 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, (item.quantity += 1))
                              }
                              className="px-2 py-1 text-gray-500 hover:text-gray-800"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="lg:w-1/2 overflow-y-auto px-12 py-12 flex flex-col justify-between">
              <article className="text-pretty">
                {cartItems.map((item) => {
                  return (
                    <div
                      className="flex justify-between w-full text-xs"
                      key={item.id}
                    >
                      <p className="w-1/2">
                        {item.name} x {item.quantity}
                      </p>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
                <div className="flex justify-between w-full font-extrabold text-sm">
                  <p className="w-1/2">Tax</p>
                  <p>${(total * 0.07).toFixed(2)}</p>
                </div>
              </article>
              <div>
                <div className="mt-6 flex justify-between items-center border-t pt-4">
                  <span className="text-lg font-bold text-gray-800">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ${(total * 1.07).toFixed(2)}
                  </span>
                </div>
                <button
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  onClick={() =>
                    navigate("/checkout", {
                      state: { total: (total * 1.07).toFixed(2) },
                    })
                  }
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <h1 className="font-extrabold text-3xl">
          Please{" "}
          <Link to="/auth" className="text-blue-400 underline">
            Login/Sign Up
          </Link>{" "}
          to Build a Cart and Checkout
        </h1>
      )}
    </section>
  );
};

export default Cart;
