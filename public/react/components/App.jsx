import React, { useState, useEffect } from "react";

// import and prepend the api url to any fetch calls
import apiURL from "../api";
import ItemCard from "./ItemCard/ItemCard";

export default function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState(null);
  const [categories, setCategories] = useState([]);

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
    fetchItems();
  }, []);

  const categorySection = (
      <section className="flex flex-col items-end py-2 absolute top-20 right-0">
        <div className="flex items-center mb-2 pr-8">
          <label htmlFor="category" className="mr-2">
            Category:
          </label>
          <select onChange={handleCategory} className="p-2 border rounded">
            <option value="All">All</option>
            {categories.map((item, id) => (
              <option key={id} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      <hr className="border-t border-slate-800 mb-4 w-screen"></hr>
      </section>
  );

  return (
    <>
      {categorySection}
      <main className="flex flex-col h-full w-screen pt-20">
        <ItemCard items={filteredItems ? filteredItems : items} />
      </main>
    </>
  );
}
