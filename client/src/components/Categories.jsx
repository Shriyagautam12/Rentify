import React from "react";
import { categories } from "../data";
import { Link } from "react-router-dom";
const Categories = () => {
  return (
    <div className="py-[50px] lg:px-[60px] px-5 flex flex-col items-center text-center bg-[#F7F8F8]">
      <h1 className=" text-[#24355A] text-[40px] font-extrabold mb-4">
        Explore Top Categories
      </h1>
      <p className=" max-w-[700px] text-xl">
        Explore our wide range of vacation rentals that cater to all types of
        travelers. Immerse yourself in the local culture, enjoy the comforts of
        home, and create unforgettable memories in your dream destination.
      </p>
      <div className=" flex flex-wrap py-[50px] px-0 justify-center gap-5">
        {categories?.slice(1, 7).map((category, index) => (
          <Link to={`/properties/category/${category.label}`} key={index}>
            <div
              className=" relative flex justify-center items-center w-[250px] h-[200px] cursor-pointer"
             
            >
              <img
                src={category.img}
                alt={category.label}
                className=" absolute w-full h-full "
              />
              <div className="absolute w-full h-full bg-[#0000008c] transition-all duration-300 ease-in-out hover:w-[80%] hover:h-[80%]"></div>
              <div className="relative text-white">
                <div className=" !text-[45px] flex items-center justify-center">
                  {" "}
                  {React.createElement(category.icon)}
                </div>
                <p className=' font-semibold'>{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
