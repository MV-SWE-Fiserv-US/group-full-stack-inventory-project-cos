import React, { useContext } from "react";
import ItemCard from "../ItemCard/ItemCard";
import { AuthContext } from "../../AuthProvider";

export default function Home() {
  const { filteredItems, items } = useContext(AuthContext);
  return (
    <main className="pt-5">
      <ItemCard items={filteredItems ? filteredItems : items} />
    </main>
  );
}
