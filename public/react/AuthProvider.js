import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import apiURL from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState(null);
  const [categories, setCategories] = useState([]);

  const getClientSecret = async () => {
    try {
      const response = await fetch(`${apiURL}/payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ total: 1000 }),
      });
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.log(error);
    }
  };

  async function fetchItems() {
    try {
      const response = await fetch(`${apiURL}/items`);
      const itemsData = await response.json();

      const uniqueCategories = Array.from(
        new Set(itemsData.map((item) => item.category))
      );
      setCategories(uniqueCategories);

      setItems(itemsData);
    } catch (err) {
      console.log("Oh no an error! ", err);
    }
  }

  const handleCategory = (e) => {
    e.preventDefault();
    const category = e.target.value;
    if (category === "All") {
      setFilteredItems(null);
      fetchItems();
    } else {
      const filterItems = items.filter((item) => item.category === category);
      setFilteredItems(filterItems);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      setUsername(decoded.name);
      setUserEmail(decoded.email);
      if (decoded.isAdmin) {
        setIsAdmin(true);
      }
    }

    getClientSecret();
    fetchItems();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isLoggedIn,
        userId,
        username,
        userEmail,
        clientSecret,
        items,
        categories,
        filteredItems,
        handleCategory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
