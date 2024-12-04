import React, { useState, useContext, useEffect } from "react";
import { toast, Slide } from "react-toastify";
import { AuthContext } from "../../AuthProvider";
import { Link } from "react-router";
import apiURL from "../../api";
import AddItemFrom from "../Forms/AddItemForm/AddItemForm";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);

  const [disabledInputs, setDisabledInputs] = useState({
    name: true,
    email: true,
    password: true,
    submitter: true,
  });

  const { isLoggedIn, userId, username, userEmail, isAdmin } =
    useContext(AuthContext);

  const [userData, setUserData] = useState({
    name: username,
    email: userEmail,
    password: "fillerpassword",
    isAdmin: isAdmin,
  });

  const [updatedData, setUpdatedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setUpdatedData({ ...updatedData, [name]: value });
    setDisabledInputs({
      ...disabledInputs,
      submitter: false,
    });
  };

  async function updateUserInfo(userId, updatedUserInfo) {
    try {
      const response = await fetch(`${apiURL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserInfo),
      });
      if (!response.ok) {
        throw new Error("Cart could not be updated. Try again later.");
      }
      toast.success("User info successfully updated 👍", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
    } catch (err) {
      console.log("Oh no an error! ", err);
      toast.error("User info could not be updated 😰 Try again later.", {
        position: "top-center",
      });
    }
  }

  async function fetchUser(userId) {
    try {
      const response = await fetch(`${apiURL}/users/${userId}`);
      if (!response.ok) {
        throw new Error("Could not get user. Try again later.");
      }
      const data = await response.json();
      const name = await data.name;
      const email = await data.email;
      setUserData({ ...userData, name: name, email: email });
    } catch (err) {
      console.log("Oh no an error! ", err);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserInfo(userId, updatedData);
    fetchUser(userId);
    location.reload();
  };

  useEffect(() => {
    fetchUser(userId);
  }, []);

  return (
    <>
      <section
        className={"w-full flex justify-center items-center py-12 px-12 " + (showForm ? "blur" : "")}
      >
        {isLoggedIn ? (
          <div className="w-full rounded-lg shadow-lg border border-gray-300 py-4 px-4 bg-white flex flex-col gap-y-8">
            <div className="px-4 sm:px-0">
              <h3 className="text-2xl font-semibold text-gray-900">
                User Dashboard
              </h3>
              <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
                Personal details and information.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                    <dt className="text-sm/6 font-medium text-gray-900">
                      Full name
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between">
                      <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        disabled={disabledInputs.name}
                        className="w-1/2"
                      ></input>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-1/4"
                        onClick={() =>
                          setDisabledInputs({
                            ...disabledInputs,
                            name: !disabledInputs.name,
                          })
                        }
                      >
                        Change Name
                      </button>
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                    <dt className="text-sm/6 font-medium text-gray-900">
                      User Status
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {userData.isAdmin ? "Admin" : "Standard User"}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                    <dt className="text-sm/6 font-medium text-gray-900">
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between">
                      <input
                        type="text"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        disabled={disabledInputs.email}
                        className="w-1/2"
                      ></input>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-1/4"
                        onClick={() =>
                          setDisabledInputs({
                            ...disabledInputs,
                            email: !disabledInputs.email,
                          })
                        }
                      >
                        Change Email
                      </button>
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                    <dt className="text-sm/6 font-medium text-gray-900">
                      Password
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between">
                      <input
                        type="text"
                        name="password"
                        value={userData.password.replace(/./g, "*")}
                        onChange={handleChange}
                        disabled={disabledInputs.password}
                        className="w-1/2"
                      ></input>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-1/4"
                        onClick={() =>
                          setDisabledInputs({
                            ...disabledInputs,
                            password: !disabledInputs.password,
                          })
                        }
                      >
                        Change Password
                      </button>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-1/4 transition disabled:bg-gray-300 disabled:transition-none disabled:cursor-not-allowed"
                  disabled={disabledInputs.submitter}
                >
                  Submit Changes
                </button>
              </div>
            </form>
            <div></div>
            <div className="mt-4 flex flex-col justify-center items-center">
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                Admin Only
              </h4>
              <button
                type="button"
                className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-600 w-1/4 transition disabled:bg-gray-300 disabled:transition-none disabled:cursor-not-allowed"
                disabled={userData.isAdmin ? false : true}
                onClick={() => {
                  setShowForm(!showForm);
                }}
              >
                {showForm ? "Close Form" : "Add Store Item"}
              </button>
            </div>
          </div>
        ) : (
          <h1 className="font-extrabold text-3xl">
            Please{" "}
            <Link to="/auth" className="text-blue-400 underline">
              Login/Sign Up
            </Link>{" "}
            to View User Dashboard
          </h1>
        )}
      </section>
      {showForm ? <AddItemFrom setShowForm={setShowForm} /> : ""}
    </>
  );
};

export default Dashboard;
