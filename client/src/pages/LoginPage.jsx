import React, { useState } from "react";
import "../styles/styles.css";
import { useDispatch } from "react-redux"
import { setLogin } from "../redux/state";
import { useNavigate } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const loggedIn = await res.json();

      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/");
      }else {
        toast.error("Login failed, Invalid Credentials");
      }

    } catch (err) {
      toast.error(`Login failed: ${err.message}`);
    }
  };
  return (
    <div className=" w-screen h-screen flex justify-center items-center flex-col bg-cover login">
       <ToastContainer/>
      <div className="flex flex-col gap-4 w-[40%] p-10 rounded-[20px] content lg:w-[60%] md:w-[80%]">
        <form className="flex flex-col gap-4 items-center " onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-transparent outline-none text-center input_text text-white placeholder-white
          "
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-transparent outline-none text-center input_text text-white placeholder-white
          "
            required
          />
          <button
            type="submit"
            className=" mt-4 hover:-translate-y-1 hover:scale-110 bg-[#F8395A] py-2 px-4 text-white rounded-lg cursor-pointer transition-all ease-in delay-100"
          >
            Log In
          </button>
        </form>
        <a
          href="/register"
          className=" text-white text-sm mt-3 text-center hover:underline"
        >
          Don't have an account? Register here
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
