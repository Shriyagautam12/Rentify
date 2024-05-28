import React, { useEffect, useState } from "react";
import "../styles/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files && files[0];

      if (file && file.type.startsWith("image/")) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: file,
        }));
      } else {
        
        toast.error("Invalid file type. Please upload an image file.");
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "")
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      const register_form = new FormData();

      for (const key in formData) {
        register_form.append(key, formData[key]);
      }
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: register_form,
      });

      if(res.ok){
      navigate("/login");
      }
      else {
        const errorMessage = await res.text();
        toast.error("Registration failed , User Already Exist");
      }
    } catch (err) {
      console.error("Registration failed", err.message)
     
    }
  };

  console.log("d", formData);
  return (
    <div className=" w-screen h-screen flex justify-center items-center flex-col bg-cover register">
      <ToastContainer/>
      <div className="flex flex-col gap-4 w-[40%] p-10 rounded-[20px] content lg:w-[60%] md:w-[80%]">
        <form className="flex flex-col gap-4 items-center " onSubmit={handleSubmit} >
          <input
            placeholder="First Name"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-transparent outline-none text-center input_text text-white placeholder-white
            "
          />

          <input
            placeholder="Last Name"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-transparent outline-none text-center input_text text-white placeholder-white
           "
          />

          <input
            placeholder="Phone Number"
            name="phoneNumber"
            type="tel"
            required
            className="w-full px-4 py-2 bg-transparent outline-none text-center input_text text-white placeholder-white
           "
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <input
            placeholder="Email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 bg-transparent outline-none text-center input_text text-white placeholder-white
           "
            value={formData.email}
            onChange={handleChange}
          />

          <input
            placeholder="Password"
            name="password"
            type="password"
            required
            onChange={handleChange}
            value={formData.password}
            className="w-full px-4 py-2 bg-transparent outline-none text-center input_text text-white placeholder-white
            "
          />
              {!passwordMatch && (
            <p className="text-red-500">Passwords does not match</p>
          )}

          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            required
            onChange={handleChange}
            value={formData.confirmPassword}
            className="w-full px-4 py-2 bg-transparent outline-none text-center input_text text-white placeholder-white
            "
          />
          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-transparent outline-none text-center input_text text-white placeholder-white
            "
          />
          <label
            htmlFor="image"
            className="flex flex-col gap-2 justify-center items-center cursor-pointer text-sm text-white"
          >
            <img
              src="/assets/addImage.png"
              alt="add profile photo"
              className="w-[25px]"
            />
            <p>Upload Your Photo</p>
          </label>
          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile photo"
              style={{ maxWidth: "80px" }}
            />
          )}
          <button
            type="submit"
            disabled={!passwordMatch} 
            className=" mt-4 hover:-translate-y-1 hover:scale-110 bg-[#F8395A] py-2 px-4 text-white rounded-lg cursor-pointer transi ease-in delay-100"
          >
            REGISTER
          </button>
        </form>
        <a
          href="/login"
          className=" text-white text-sm mt-3 text-center hover:underline"
        >
          Already have an account?Login Here
        </a>
      </div>
    </div>
  );
};

export default Register;
