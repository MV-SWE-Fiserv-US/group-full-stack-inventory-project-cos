import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import apiURL from "../../api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loginOrRegister, setLoginOrRegister] = useState(null);
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  }

  function handleChangeRegister(e) {
    const { name, value } = e.target;
    setRegisterFormData({ ...registerFormData, [name]: value });
    console.log(registerFormData.name);
    if (registerFormData.name == "TacoBel") {
      setIsVisible(true);
      console.log("TACOBELLLLLL");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${apiURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginFormData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setLoginOrRegister(null);
      setLoginFormData({
        email: "",
        password: "",
      });
      toast.success("Login successful 👍", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
      setTimeout(() => {
        navigate("/");
        location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(`${error}`, {
        position: "top-center",
      });
    }
  }

  async function handleSubmitRegister(e) {
    e.preventDefault();
    console.log(registerFormData);
    try {
      const response = await fetch(`${apiURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerFormData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful", data);
      localStorage.setItem("token", data.token);
      setLoginOrRegister("login");
      setLoginFormData({
        email: "",
        password: "",
      });
      setTimeout(() => {
        navigate("/");
        location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  const loginPrompts = {
    login: (
      <section className="w-full flex justify-center py-12 px-12">
        <div className="w-full max-w-md rounded-lg shadow-lg border border-gray-300 py-2 px-4 max-h-[50vh] flex flex-col gap-y-8">
          <div className="px-4 sm:px-0">
            <h3 className="text-2xl font-semibold text-gray-900">Login</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Please enter your credentials to login.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col mt-6 flex-grow"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                value={loginFormData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative mb-6">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginFormData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 py-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className="mt-auto flex space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
                onClick={() => setLoginOrRegister(null)}
              >
                Go Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </section>
    ),
    register: (
      <section className="w-full flex justify-center py-12 px-12">
        <div className="w-full max-w-md rounded-lg shadow-lg border border-gray-300 py-2 px-4 max-h-[60vh] flex flex-col gap-y-10">
          <div className="px-4 sm:px-0">
            <h3 className="text-2xl font-semibold text-gray-900">Register</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Please enter your details to register.
            </p>
          </div>
          <form
            onSubmit={handleSubmitRegister}
            className="flex flex-col mt-6 flex-grow"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                name="name"
                value={registerFormData.name}
                onChange={handleChangeRegister}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                value={registerFormData.email}
                onChange={handleChangeRegister}
              />
            </div>
            <div className="relative mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={registerFormData.password}
                onChange={handleChangeRegister}
              />
              <button
                type="button"
                className="absolute top-1/2 right-0 transform translate-y-1 px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className={isVisible ? "" : "hidden"}>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="isAdmin"
              >
                Admin
              </label>
              <input
                className="mr-2 leading-tight"
                id="isAdmin"
                type="checkbox"
                name="isAdmin"
                checked={registerFormData.isAdmin}
                onChange={(e) =>
                  setRegisterFormData({
                    ...registerFormData,
                    isAdmin: e.target.checked,
                  })
                }
              />
            </div>
            <div className="mt-auto flex space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
                onClick={() => setLoginOrRegister(null)}
              >
                Go Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </section>
    ),
  };
  return (
    <>
      {loginOrRegister === "login" && loginPrompts.login}
      {loginOrRegister === "register" && loginPrompts.register}
      {!loginOrRegister && (
        <section className="w-full flex justify-center py-12 px-12">
          <div className="w-full max-w-md rounded-lg shadow-lg border border-gray-300 py-2 px-4 max-h-[30vh] flex flex-col gap-y-10">
            <div className="px-4 sm:px-0 text-center">
              <h3 className="text-2xl font-semibold text-gray-900">Welcome</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Please choose an option to proceed.
              </p>
            </div>
            <div className="flex flex-col mt-6">
              <div className="mb-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full mb-4"
                  onClick={() => setLoginOrRegister("login")}
                >
                  Login
                </button>
              </div>
              <div className="mb-4">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full mb-4"
                  onClick={() => setLoginOrRegister("register")}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
