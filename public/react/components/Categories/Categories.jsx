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
