import React from "react";
import { Search, Person, Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";
import "../styles/styles.css";
const Navbar = () => {
  const user = useSelector((state) => state.user);
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const links = user? [
    { path: `/${user._id}/trips`, label: "Trip List" },
    { path: `/${user._id}/wishList`, label: "Wish List" },
    { path: `/${user._id}/properties`, label: "Property List" },
    { path: `/${user._id}/reservations`, label: "Reservation List" },
    { path: "/create-listing", label: "Become A Host" },
    {
      path: "/login",
      label: "Log Out",
      onClick: () => dispatch(setLogout()),
    },
  ]:[];
  return (
    <div className=" md:px-14 md:py-3 flex justify-between items-center relative sm:px-5 px-3">
      <a href="/">
        <img
          src="../assets/logo.png"
          alt="logo"
          className=" w-[100px] cursor-pointer"
        />
      </a>
      <div className=" border-e-gray-800 border-[1px] rounded-[30px] h-[50px] py-0 px-5 md:flex gap-10 items-center hidden hover:input_box ">
        <input
          type="text"
          placeholder="Search"
          value={search}
          className=" border-none outline-none hover:box "
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton disabled={search === ""}>
          <Search
            className=" text-[#F8395A]"
            onClick={() => {
              navigate(`/properties/search/${search}`);
            }}
          />
        </IconButton>
      </div>
      <div className=" flex items-center gap-5">
        {user ? (
          <a
            href="/create-listing"
            className=" text-[#24355A] font-bold cursor-pointer hover:text-[#F8395A] hidden md:block"
          >
            Become a Host
          </a>
        ) : (
          <a href="/login">Become a Host</a>
        )}

        <button
          className="h-[50px] flex items-center py-0 px-[10px] border-e-gray-800 border-[1px] rounded-[30px] gap-[10px] bg-white cursor-pointer hover:box "
          onClick={() => setDropDownMenu(!dropDownMenu)}
        >
          <Menu className=" text-[grey]" />
          {!user ? (
            <Person className=" text-[grey]" />
          ) : (
            <img
              src={`http://localhost:3001/${user.profileImagePath.replace(
                "public",
                ""
              )}`}
              alt="profile photo"
              className=" object-cover rounded-[50%] w-10 h-10"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropDownMenu && !user && (
          <div className="absolute bg-white md:right-[60px] top-20 flex flex-col w-[200px] py-[10px] px-0 border-gray-400 border-[1px] rounded-[20px] box z-50 right-20">
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}

        {dropDownMenu && user && (
          <div className="absolute bg-white md:right-[60px] top-20 flex flex-col w-[200px] border-gray-400 border-[1px] rounded-[30px] box z-50 right-20">
            {links.map(({ path, label, onClick }, index) => (
              <Link
                key={index}
                to={path}
                onClick={onClick}
                className=" w-full py-2 px-4 text-[#24355A] font-bold hover:text-[#F8395A] hover:bg-[#d9d5d533]"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
