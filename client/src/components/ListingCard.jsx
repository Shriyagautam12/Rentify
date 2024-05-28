import React, { useEffect, useState } from "react";
import "../styles/styles.css";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";
const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  province,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
}) => {

     /* SLIDER FOR IMAGES */
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
    /* ADD TO WISHLIST */
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  const isLiked = wishList?.find((item) => item?._id === listingId);

  const patchWishList = async () => {
    // if (user?._id !== creator._id) {
    const response = await fetch(
      `http://localhost:3001/users/${user?._id}/${listingId}`,
      {
        method: "PATCH",
        header: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setWishList(data.wishList));
  // } else { return }
  };

  useEffect(() => {
    console.log("isLiked state:", isLiked);
  }, [isLiked]);

  

  return (
    <div
      className="relative cursor-pointer p-2 rounded-[10px] box hover:box"
      onClick={() => {
        navigate(`/properties/${listingId}`);
      }}
    >
      <div className=" w-[300px] overflow-hidden rounded-[10px] mb-[10px]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths?.map((photo, index) => (
            <div
              key={index}
              className="relative slide w-full h-[270px] flex items-center"
            >
              <img
                src={`http://localhost:3001/${photo?.replace("public", "")}`}
                alt={`photo ${index + 1}`}
                className="h-full w-full filter brightness-[85%]"
              />
              <div
                className="absolute top-2/4 translate-y-[-50%] p-2 rounded-[50%] 
                border-none cursor-pointer flex items-center justify-center 
                bg-[#ffffffb3] z-[9999] hover:bg-white left-[10px]"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide(e);
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div
                  className="absolute top-2/4 translate-y-[-50%] p-2 rounded-[50%] 
                  border-none cursor-pointer flex items-center justify-center 
                  bg-[#ffffffb3] z-[9999] hover:bg-white right-[10px]"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide(e);
                }}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className=" text-lg">
        {city}, {province}, {country}
      </h3>
      <p className=" text-base">{category}</p>

      {!booking ? (
        <>
          <p className=" text-base font-semibold ">{type}</p>
          <p className=" text-base">
            <span className=" font-bold text-lg">₹ {price}</span> per night
          </p>
        </>
      ) : (
        <>
          <p className=" text-base">
            {startDate} - {endDate}
          </p>
          <p className=" text-base font-semibold">
            <span>₹{totalPrice}</span> total
          </p>
        </>
      )}

      <button
        className="absolute  right-5 top-5 border-none text-xl cursor-pointer z-[999] bg-none"
        onClick={(e) => {
          e.stopPropagation();
          patchWishList();
        }}
        disabled={!user}
      >
        {isLiked ? (
          <Favorite className=" text-[red]" />
        ) : (
          <Favorite className=" text-white" />
        )}
      </button>

    
    </div>
  );
};

export default ListingCard;
